/**
 * Reexports ergonômicos dos tipos gerados pelo Supabase.
 * Importe daqui (`@/lib/types`), não de `@/lib/supabase/database.types`.
 *
 * Convenção: tipos de DOMÍNIO ficam aqui; tipos de baixo nível (Json, Database)
 * só são usados nos próprios clients Supabase.
 */

import type { Database } from './supabase/database.types';

// Tipos de linhas (Row) — o que o banco retorna
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Text = Database['public']['Tables']['texts']['Row'];
export type WallItem = Database['public']['Tables']['wall_items']['Row'];

// Inserts e Updates — usados em mutações
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type TextInsert = Database['public']['Tables']['texts']['Insert'];
export type TextUpdate = Database['public']['Tables']['texts']['Update'];
export type WallItemInsert = Database['public']['Tables']['wall_items']['Insert'];

// Tipo de domínio: WallItem com URL assinada para exibição
export interface WallItemWithUrl extends WallItem {
  signed_url: string;
}

// Enums de status
export type TextStatus = Database['public']['Enums']['text_status'];
export type WallItemStatus = Database['public']['Enums']['wall_item_status'];

// Tipos de domínio derivados (usados em UI / Server Actions)
export interface TextListItem {
  id: string;
  title: string;
  first_sentence: string;
  status: TextStatus;
  tags: string[];
  created_at: string;
}

export interface PublicText {
  slug: string;
  title: string;
  body_html: string;
  published_at: string;
  display_name: string;
}
