import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import type { Database } from './database.types';

/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 * Usa cookies do Next.js para gerenciar sessão (HttpOnly via @supabase/ssr).
 *
 * Use para:
 * - Ler dados em Server Components
 * - Fazer mutações em Server Actions
 * - Verificar autenticação em middleware/layout
 *
 * NÃO use em Client Components — use `createBrowserClient` (browser.ts).
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Schema dedicado pra coexistir com outras apps no projeto Supabase ARLIA.
      // Precisa estar exposto em Settings > API > Exposed schemas.
      // Cast: nossa Database type continua com 'public' como nome do schema
      // (estrutura idêntica), mas no runtime o Postgres retorna do escritos.
      db: { schema: 'escritos' as 'public' },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components não podem setar cookies — fluxo de refresh
            // acontece via middleware. Suprimir erro silenciosamente conforme
            // padrão recomendado por Supabase.
          }
        },
      },
    },
  );
}
