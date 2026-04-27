'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ReactionKind, TextReaction } from '@/lib/types';

const ANON_COOKIE = 'edg_anon';
const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano
const MESSAGE_BODY_MAX = 2000;
const MESSAGE_NAME_MAX = 80;

const VALID_KINDS = ['coracao', 'lagrima', 'brilho', 'maos', 'sorriso'] as const;

export type ToggleReactionResult =
  | { ok: true; current: ReactionKind | null }
  | { ok: false; error: string };

export type SendMessageResult = { ok: true } | { ok: false; error: string };

/**
 * Identifica o leitor anônimo via cookie. Cookie é HttpOnly + SameSite=Lax,
 * persiste 1 ano. Não é tracking — só impede que mesma pessoa registre
 * múltiplas reactions/bilhetes inflando contagem (que não exibimos, mas
 * mantém integridade dos dados).
 */
async function getOrCreateAnonId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(ANON_COOKIE)?.value;
  if (existing && existing.length > 0) return existing;
  const fresh = crypto.randomUUID();
  store.set(ANON_COOKIE, fresh, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ANON_COOKIE_MAX_AGE,
  });
  return fresh;
}

/**
 * Toggle de reação no texto público. Se o leitor já tem essa kind, remove.
 * Se tem outra kind, troca. Se não tem, insere.
 *
 * Usa admin client porque RLS do escritos.text_reactions exige texto público
 * (que cobre o caso) mas anon_id é controlado pelo server, não pelo client.
 */
export async function toggleReaction(formData: FormData): Promise<ToggleReactionResult> {
  const textId = formData.get('text_id');
  const kindRaw = formData.get('kind');
  if (typeof textId !== 'string' || !textId) return { ok: false, error: 'Texto inválido.' };
  if (typeof kindRaw !== 'string' || !VALID_KINDS.includes(kindRaw as ReactionKind)) {
    return { ok: false, error: 'Reação inválida.' };
  }
  const kind = kindRaw as ReactionKind;
  const anonId = await getOrCreateAnonId();
  const admin = getSupabaseAdmin();

  // Confirma que texto existe e é público
  const { data: text } = await admin
    .from('texts')
    .select('id, slug, status')
    .eq('id', textId)
    .maybeSingle();
  if (!text || text.status !== 'public') {
    return { ok: false, error: 'Texto não encontrado.' };
  }

  // Lê reaction atual deste anon nesse texto
  const { data: current } = await admin
    .from('text_reactions')
    .select('kind')
    .eq('text_id', textId)
    .eq('anon_id', anonId)
    .maybeSingle<TextReaction>();

  if (current?.kind === kind) {
    // Já tem a mesma reaction → remove (toggle off)
    await admin.from('text_reactions').delete().eq('text_id', textId).eq('anon_id', anonId);
    if (text.slug) revalidatePath(`/p/${text.slug}`);
    return { ok: true, current: null };
  }

  // Insere ou atualiza pra nova kind
  const { error } = await admin
    .from('text_reactions')
    .upsert({ text_id: textId, anon_id: anonId, kind }, { onConflict: 'text_id,anon_id' });
  if (error) {
    console.error('[toggleReaction] upsert falhou', error);
    return { ok: false, error: 'Não consegui registrar.' };
  }
  if (text.slug) revalidatePath(`/p/${text.slug}`);
  return { ok: true, current: kind };
}

/**
 * Bilhete privado pra autora. RLS permite anon INSERT em textos públicos;
 * SELECT é só do dono.
 */
export async function sendMessage(
  _prev: SendMessageResult | null,
  formData: FormData,
): Promise<SendMessageResult> {
  const textId = formData.get('text_id');
  const bodyRaw = formData.get('body');
  const nameRaw = formData.get('sender_name');

  if (typeof textId !== 'string' || !textId) return { ok: false, error: 'Texto inválido.' };
  if (typeof bodyRaw !== 'string') return { ok: false, error: 'Escreva alguma coisa.' };

  const body = bodyRaw.trim().slice(0, MESSAGE_BODY_MAX);
  if (!body) return { ok: false, error: 'Escreva alguma coisa.' };

  const senderName =
    typeof nameRaw === 'string' && nameRaw.trim().length > 0
      ? nameRaw.trim().slice(0, MESSAGE_NAME_MAX)
      : null;

  const admin = getSupabaseAdmin();

  // Confirma texto público antes (defesa em profundidade — RLS já cobre)
  const { data: text } = await admin
    .from('texts')
    .select('id, slug, status')
    .eq('id', textId)
    .maybeSingle();
  if (!text || text.status !== 'public') {
    return { ok: false, error: 'Texto não encontrado.' };
  }

  const { error } = await admin.from('text_messages').insert({
    text_id: textId,
    body,
    sender_name: senderName,
  });

  if (error) {
    console.error('[sendMessage] insert falhou', error);
    return { ok: false, error: 'Não consegui enviar o bilhete.' };
  }

  if (text.slug) revalidatePath(`/p/${text.slug}`);
  revalidatePath('/recados');
  return { ok: true };
}

/**
 * Marca um bilhete como lido. Owner-only via RLS.
 */
export async function markMessageRead(formData: FormData): Promise<void> {
  const id = formData.get('id');
  if (typeof id !== 'string' || !id) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('text_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[markMessageRead] falhou', error);
    return;
  }

  revalidatePath('/recados');
}

/**
 * Apaga bilhete. Owner-only via RLS.
 */
export async function deleteMessage(formData: FormData): Promise<void> {
  const id = formData.get('id');
  if (typeof id !== 'string' || !id) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from('text_messages').delete().eq('id', id);
  if (error) {
    console.error('[deleteMessage] falhou', error);
    return;
  }

  revalidatePath('/recados');
}
