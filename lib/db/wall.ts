import 'server-only';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { WallItem, WallItemWithUrl } from '@/lib/types';

const BUCKET = 'escritos-wall-images';
const SIGNED_URL_TTL = 3600; // 1 hora pra mural privado
const PUBLIC_SIGNED_URL_TTL = 60 * 60 * 24; // 24h pra landing pública

/**
 * Lista os wall_items do usuário autenticado, mais recentes primeiro,
 * já com URL assinada de cada imagem (geração em batch — uma chamada
 * só independente da quantidade de itens).
 *
 * RLS garante que só retorna do dono autenticado.
 *
 * @param dateFilter Se passado (YYYY-MM-DD), retorna só itens daquela data
 */
export async function listMyWallItems(dateFilter?: string): Promise<WallItemWithUrl[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase.from('wall_items').select('*').order('created_at', { ascending: false });

  if (dateFilter) {
    const start = `${dateFilter}T00:00:00.000Z`;
    const end = `${dateFilter}T23:59:59.999Z`;
    query = query.gte('created_at', start).lte('created_at', end);
  }

  const { data: items, error } = await query;

  if (error) {
    console.error('[listMyWallItems] select falhou', error);
    throw error;
  }

  if (!items || items.length === 0) return [];

  const paths = items.map((i) => i.image_path);
  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL);

  if (signErr) {
    console.error('[listMyWallItems] createSignedUrls falhou', signErr);
    throw signErr;
  }

  const urlByPath = new Map<string, string>();
  for (const entry of signed ?? []) {
    if (entry.signedUrl && entry.path) {
      urlByPath.set(entry.path, entry.signedUrl);
    }
  }

  return items
    .map((item: WallItem) => {
      const url = urlByPath.get(item.image_path);
      if (!url) return null;
      return { ...item, signed_url: url };
    })
    .filter((x): x is WallItemWithUrl => x !== null);
}

/**
 * Retorna o conjunto de datas (YYYY-MM-DD) que possuem wall_items no mês.
 * Usado pelo MiniCalendar pra desenhar pontos sépia nos dias com conteúdo.
 *
 * Busca um range mais amplo (mês inteiro) numa query só, sem signed URLs.
 */
export async function getDaysWithWallItems(year: number, monthIndex: number): Promise<Set<string>> {
  const supabase = await createServerSupabaseClient();

  const start = new Date(Date.UTC(year, monthIndex, 1)).toISOString();
  const end = new Date(Date.UTC(year, monthIndex + 1, 1)).toISOString();

  const { data, error } = await supabase
    .from('wall_items')
    .select('created_at')
    .gte('created_at', start)
    .lt('created_at', end);

  if (error) {
    console.error('[getDaysWithWallItems] select falhou', error);
    return new Set();
  }

  return new Set((data ?? []).map((row) => row.created_at.slice(0, 10)));
}

/**
 * Lista wall_items marcados em destaque na home (on_home=true), independente de
 * status. RLS anon cobre via policy wall_items_on_home_select.
 *
 * Usado na landing pra exibir uma curadoria pequena no topo.
 */
export async function listOnHomeWallItems(limit = 6): Promise<WallItemWithUrl[]> {
  const supabase = await createServerSupabaseClient();

  const { data: items, error } = await supabase
    .from('wall_items')
    .select('*')
    .eq('on_home', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[listOnHomeWallItems] select falhou', error);
    return [];
  }

  if (!items || items.length === 0) return [];

  const admin = getSupabaseAdmin();
  const paths = items.map((i) => i.image_path);
  const { data: signed, error: signErr } = await admin.storage
    .from(BUCKET)
    .createSignedUrls(paths, PUBLIC_SIGNED_URL_TTL);

  if (signErr) {
    console.error('[listOnHomeWallItems] createSignedUrls falhou', signErr);
    return [];
  }

  const urlByPath = new Map<string, string>();
  for (const entry of signed ?? []) {
    if (entry.signedUrl && entry.path) {
      urlByPath.set(entry.path, entry.signedUrl);
    }
  }

  return items
    .map((item: WallItem) => {
      const url = urlByPath.get(item.image_path);
      if (!url) return null;
      return { ...item, signed_url: url };
    })
    .filter((x): x is WallItemWithUrl => x !== null);
}

/**
 * Lista wall_items publicados (status='public'), acessível pra qualquer visitante
 * via RLS anon. Usa admin client SOMENTE para gerar signed URLs (storage continua
 * dono-only — signed URLs bypassam RLS de storage e funcionam pra anônimos).
 */
export async function listPublicWallItems(limit = 12): Promise<WallItemWithUrl[]> {
  const supabase = await createServerSupabaseClient();

  const { data: items, error } = await supabase
    .from('wall_items')
    .select('*')
    .eq('status', 'public')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('[listPublicWallItems] select falhou', error);
    return [];
  }

  if (!items || items.length === 0) return [];

  const admin = getSupabaseAdmin();
  const paths = items.map((i) => i.image_path);
  const { data: signed, error: signErr } = await admin.storage
    .from(BUCKET)
    .createSignedUrls(paths, PUBLIC_SIGNED_URL_TTL);

  if (signErr) {
    console.error('[listPublicWallItems] createSignedUrls falhou', signErr);
    return [];
  }

  const urlByPath = new Map<string, string>();
  for (const entry of signed ?? []) {
    if (entry.signedUrl && entry.path) {
      urlByPath.set(entry.path, entry.signedUrl);
    }
  }

  return items
    .map((item: WallItem) => {
      const url = urlByPath.get(item.image_path);
      if (!url) return null;
      return { ...item, signed_url: url };
    })
    .filter((x): x is WallItemWithUrl => x !== null);
}
