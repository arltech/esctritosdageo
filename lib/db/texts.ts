import 'server-only';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile, PublicText, Text, TextListItem } from '@/lib/types';

/**
 * Extrai a primeira frase legível do body_html removendo tags.
 * Usado pra preview na lista — sem parser HTML pesado, regex serve.
 */
function firstSentence(html: string, max = 160): string {
  if (!html) return '';
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

/**
 * Lista todas as escritas da Geo (privadas + públicas), mais recentes primeiro.
 * RLS garante owner-only.
 */
export async function listMyTexts(): Promise<TextListItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('texts')
    .select('id, title, body_html, status, tags, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[listMyTexts] select falhou', error);
    return [];
  }

  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title || '(sem título)',
    first_sentence: firstSentence(t.body_html),
    status: t.status,
    tags: t.tags ?? [],
    created_at: t.created_at,
  }));
}

/**
 * Busca uma entrada do dono autenticado pelo id.
 * Retorna null se não encontrar (ou RLS bloquear).
 */
export async function getMyText(id: string): Promise<Text | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('texts').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('[getMyText] select falhou', error);
    return null;
  }
  return data;
}

export interface PublicTextListItem {
  slug: string;
  title: string;
  first_sentence: string;
  tags: string[];
  published_at: string;
  display_name: string;
}

/**
 * Lista todas as escritas públicas pra index (estilo blog).
 * Anon-safe via admin client. Mais recentes primeiro.
 */
export async function listPublicTexts(limit = 50): Promise<PublicTextListItem[]> {
  const admin = getSupabaseAdmin();

  const { data: texts, error } = await admin
    .from('texts')
    .select('slug, title, body_html, tags, published_at, user_id')
    .eq('status', 'public')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error || !texts || texts.length === 0) {
    if (error) console.error('[listPublicTexts] select falhou', error);
    return [];
  }

  // Pega autor (display_name) — todos os textos podem ser de pessoas diferentes
  const userIds = Array.from(new Set(texts.map((t) => t.user_id)));
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds);

  const nameById = new Map<string, string>();
  for (const p of profiles ?? []) nameById.set(p.id, p.display_name);

  return texts
    .filter((t) => t.slug)
    .map((t) => ({
      slug: t.slug as string,
      title: t.title || '(sem título)',
      first_sentence: firstSentence(t.body_html),
      tags: t.tags ?? [],
      published_at: t.published_at ?? '',
      display_name: nameById.get(t.user_id) ?? 'Geovana',
    }));
}

/**
 * Busca um texto público pelo slug — usado em /p/[slug] (anon).
 * Retorna title, body, autor, data — formato pronto pra exibição.
 */
export async function getPublicTextBySlug(slug: string): Promise<PublicText | null> {
  // Usa admin client pra bypassar dependência de auth.uid() no RLS
  // (RLS já permite anon SELECT em texts public, mas profiles pode ter regra dependente).
  const admin = getSupabaseAdmin();

  const { data: text, error: textErr } = await admin
    .from('texts')
    .select('id, slug, title, body_html, published_at, user_id')
    .eq('slug', slug)
    .eq('status', 'public')
    .maybeSingle();

  if (textErr || !text) {
    if (textErr) console.error('[getPublicTextBySlug] text falhou', textErr);
    return null;
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('display_name')
    .eq('id', text.user_id)
    .maybeSingle<Profile>();

  return {
    id: text.id,
    slug: text.slug ?? '',
    title: text.title,
    body_html: text.body_html,
    published_at: text.published_at ?? '',
    display_name: profile?.display_name ?? 'Geovana',
  };
}
