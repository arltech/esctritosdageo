import 'server-only';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

const AVATAR_BUCKET = 'avatars';

/**
 * Lê o profile do usuário autenticado. Retorna null se não autenticado.
 */
export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (error) {
    console.error('[getMyProfile] select falhou', error);
    return null;
  }
  return data;
}

/**
 * Lê o profile da autora (product-of-one MVP — assume um único profile).
 * Usado em superfícies públicas como a landing pra exibir nome + avatar.
 * RLS profiles_select_public permite leitura anon.
 */
export async function getWriterProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[getWriterProfile] select falhou', error);
    return null;
  }
  return data;
}

/**
 * URL pública do avatar (bucket é public-read). Adiciona cache buster opcional
 * pra forçar refresh após upload.
 */
export function getAvatarUrl(path: string | null, cacheBust?: string): string | null {
  if (!path) return null;
  const admin = getSupabaseAdmin();
  const {
    data: { publicUrl },
  } = admin.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return cacheBust ? `${publicUrl}?v=${cacheBust}` : publicUrl;
}
