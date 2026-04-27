import 'server-only';

import { cookies } from 'next/headers';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ReactionKind, TextMessage } from '@/lib/types';

const ANON_COOKIE = 'edg_anon';

/**
 * Lê a reaction atual do leitor anônimo no texto, se existir.
 * Retorna null se ainda não reagiu.
 */
export async function getMyReaction(textId: string): Promise<ReactionKind | null> {
  const store = await cookies();
  const anonId = store.get(ANON_COOKIE)?.value;
  if (!anonId) return null;

  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from('text_reactions')
    .select('kind')
    .eq('text_id', textId)
    .eq('anon_id', anonId)
    .maybeSingle();

  return (data?.kind ?? null) as ReactionKind | null;
}

export interface MessageWithText extends TextMessage {
  text_title: string;
  text_slug: string | null;
}

/**
 * Lista todos os bilhetes recebidos pela autora autenticada.
 * Junta com o texto pra mostrar título + link.
 */
export async function listMyMessages(): Promise<MessageWithText[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // RLS já filtra por dono. JOIN explícito.
  const { data, error } = await supabase
    .from('text_messages')
    .select('id, text_id, body, sender_name, read_at, created_at, texts(title, slug)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[listMyMessages] falhou', error);
    return [];
  }

  return (data ?? []).map((row) => {
    const t = (row as unknown as { texts: { title: string; slug: string | null } | null }).texts;
    return {
      id: row.id,
      text_id: row.text_id,
      body: row.body,
      sender_name: row.sender_name,
      read_at: row.read_at,
      created_at: row.created_at,
      text_title: t?.title || '(sem título)',
      text_slug: t?.slug ?? null,
    };
  });
}
