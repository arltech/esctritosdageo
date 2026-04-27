import { createBrowserClient } from '@supabase/ssr';

import type { Database } from './database.types';

/**
 * Cliente Supabase para Client Components.
 * Lê sessão do mesmo cookie HttpOnly gerenciado pelo server.
 *
 * Use SOMENTE em Client Components. Para Server Components, Server Actions
 * e Route Handlers, use `createServerSupabaseClient` (server.ts).
 *
 * Singleton implícito por sessão de browser.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
