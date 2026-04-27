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

// Inserts e Updates — usados em mutações
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type TextInsert = Database['public']['Tables']['texts']['Insert'];
export type TextUpdate = Database['public']['Tables']['texts']['Update'];

// Enum de status
export type TextStatus = Database['public']['Enums']['text_status'];

// Tipos de domínio derivados (usados em UI / Server Actions)
export interface TextListItem {
  id: string;
  title: string;
  first_sentence: string;
  status: TextStatus;
  created_at: string;
}

export interface PublicText {
  slug: string;
  title: string;
  body_html: string;
  published_at: string;
  display_name: string;
}
