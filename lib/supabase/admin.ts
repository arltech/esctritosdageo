/**
 * ⚠️ CLIENTE ADMIN — SERVER-ONLY ⚠️
 *
 * Usa SUPABASE_SERVICE_ROLE_KEY que IGNORA todas as RLS policies.
 *
 * NUNCA importe este módulo em:
 * - Client Components ('use client')
 * - Arquivos com extensão `.client.ts(x)`
 * - Código que possa ser bundlado para o browser
 *
 * Use APENAS para operações administrativas:
 * - Criar/deletar usuários (auth.admin)
 * - Operações de migração/seeding
 * - Webhooks que precisam bypass de RLS
 *
 * Em qualquer outra situação, use `createServerSupabaseClient` (server.ts)
 * que respeita RLS via JWT da sessão do usuário.
 */

import 'server-only';

import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

let cached: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  cached = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cached;
}
