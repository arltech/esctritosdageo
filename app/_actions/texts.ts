'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { sanitizeEditorHtml } from '@/lib/sanitize';
import { shortHash, slugify } from '@/lib/slug';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const EDITOR_BUCKET = 'wall-images';
const EDITOR_SIGNED_URL_TTL = 60 * 60 * 24; // 24h
const TITLE_MAX = 200;
const BODY_MAX = 200_000;
const TAG_MAX = 32;
const TAGS_MAX_COUNT = 16;

export type SaveTextResult = { ok: true; id: string } | { ok: false; error: string };

export type UploadEditorImageResult =
  | { ok: true; path: string; signedUrl: string }
  | { ok: false; error: string };

function normalizeTag(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase().slice(0, TAG_MAX);
  if (!trimmed) return null;
  // permite letras (com acento), números, hífen, underscore — descarta resto
  const cleaned = trimmed.replace(/[^\p{L}\p{N}_-]/gu, '');
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Salva entrada de texto. Se FormData tiver 'id', faz UPDATE; senão INSERT.
 * Mantém status atual no UPDATE (toggle público é ação separada).
 * Sanitiza HTML antes de persistir.
 */
export async function saveText(
  _prev: SaveTextResult | null,
  formData: FormData,
): Promise<SaveTextResult> {
  const idRaw = formData.get('id');
  const titleRaw = formData.get('title');
  const bodyRaw = formData.get('body_html');
  const tagsRaw = formData.getAll('tags');

  const id = typeof idRaw === 'string' && idRaw.length > 0 ? idRaw : null;
  const title = typeof titleRaw === 'string' ? titleRaw.trim().slice(0, TITLE_MAX) : '';
  const body = typeof bodyRaw === 'string' ? bodyRaw.slice(0, BODY_MAX) : '';

  if (!title && !body.trim()) {
    return { ok: false, error: 'Adicione um título ou escreva alguma coisa antes de salvar.' };
  }

  // Tags: normaliza, dedupe, limita
  const tagSet = new Set<string>();
  for (const t of tagsRaw) {
    if (typeof t !== 'string') continue;
    const norm = normalizeTag(t);
    if (norm) tagSet.add(norm);
    if (tagSet.size >= TAGS_MAX_COUNT) break;
  }
  const tags = Array.from(tagSet);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'Sessão expirada. Entre novamente.' };
  }

  let bodyHtml: string;
  try {
    bodyHtml = await sanitizeEditorHtml(body);
  } catch (err) {
    console.error('[saveText] sanitização falhou', err);
    return { ok: false, error: 'Não consegui processar o conteúdo. Tente de novo.' };
  }

  if (id) {
    const { error } = await supabase
      .from('texts')
      .update({ title, body_html: bodyHtml, tags })
      .eq('id', id);

    if (error) {
      console.error('[saveText] update falhou', error);
      return { ok: false, error: 'Não consegui salvar a edição.' };
    }
    revalidatePath('/casa');
    revalidatePath('/escritas');
    revalidatePath(`/escritas/${id}`);
    return { ok: true, id };
  }

  const { data, error } = await supabase
    .from('texts')
    .insert({
      user_id: user.id,
      title,
      body_html: bodyHtml,
      body_markdown: '',
      status: 'private',
      tags,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[saveText] insert falhou', error);
    return { ok: false, error: 'Não consegui salvar. Tente de novo em instantes.' };
  }

  revalidatePath('/casa');
  revalidatePath('/escritas');
  return { ok: true, id: data.id };
}

/**
 * Alterna status público/privado da entrada. Quando vai pra public:
 * gera slug a partir do título (com hash curto pra unicidade).
 * Quando volta pra private: mantém o slug (preserva histórico de URL).
 */
export async function togglePublicText(formData: FormData): Promise<void> {
  const id = formData.get('id');
  if (typeof id !== 'string' || !id) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: current, error: readErr } = await supabase
    .from('texts')
    .select('status, slug, title')
    .eq('id', id)
    .maybeSingle();

  if (readErr || !current) {
    console.error('[togglePublicText] read falhou', readErr);
    return;
  }

  const goingPublic = current.status === 'private';

  if (goingPublic) {
    const baseSlug = current.slug || slugify(current.title || 'sem-titulo') || 'entrada';
    const slug = `${baseSlug}-${shortHash()}`;
    const { error } = await supabase
      .from('texts')
      .update({
        status: 'public',
        slug,
        published_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) console.error('[togglePublicText] publish falhou', error);
  } else {
    const { error } = await supabase.from('texts').update({ status: 'private' }).eq('id', id);
    if (error) console.error('[togglePublicText] unpublish falhou', error);
  }

  revalidatePath('/escritas');
  revalidatePath(`/escritas/${id}`);
}

/**
 * Apaga entrada e redireciona pra /escritas.
 */
export async function deleteText(formData: FormData): Promise<void> {
  const id = formData.get('id');
  if (typeof id !== 'string' || !id) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from('texts').delete().eq('id', id);
  if (error) {
    console.error('[deleteText] delete falhou', error);
    return;
  }

  revalidatePath('/casa');
  revalidatePath('/escritas');
  redirect('/escritas');
}

/**
 * Upload de imagem inserida no corpo do editor. Reaproveita bucket wall-images
 * (privado, signed URLs). Retorna path + signed URL pra inserção inline.
 */
export async function uploadEditorImage(formData: FormData): Promise<UploadEditorImageResult> {
  const file = formData.get('image');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Selecione uma imagem.' };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: 'Formato não suportado. Use JPEG, PNG ou WebP.' };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'Imagem muito grande (máx 5 MB).' };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'Sessão expirada. Entre novamente.' };
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${user.id}/editor/${crypto.randomUUID()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(EDITOR_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadErr) {
    console.error('[uploadEditorImage] upload falhou', uploadErr);
    return { ok: false, error: 'Não consegui salvar a imagem.' };
  }

  const { data: signed, error: signErr } = await supabase.storage
    .from(EDITOR_BUCKET)
    .createSignedUrl(path, EDITOR_SIGNED_URL_TTL);

  if (signErr || !signed?.signedUrl) {
    console.error('[uploadEditorImage] signed url falhou', signErr);
    return { ok: false, error: 'Salvei a imagem mas não consegui gerar URL.' };
  }

  return { ok: true, path, signedUrl: signed.signedUrl };
}
