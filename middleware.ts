import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import type { Database } from '@/lib/supabase/database.types';

/**
 * Middleware Supabase — refresh silencioso da sessão.
 *
 * Padrão recomendado por Supabase para Next.js App Router: middleware lê e
 * reescreve cookies de sessão a cada request, garantindo que tokens expirando
 * sejam renovados antes de Server Components rodarem.
 *
 * Não bloqueia rotas — apenas mantém sessão fresca. Auth gating fica em
 * Layouts (privado vs publico).
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh silencioso (não usamos o resultado aqui)
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match todos os paths exceto:
     * - _next/static (assets estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, opengraph-image, robots.txt, sitemap.xml
     */
    '/((?!_next/static|_next/image|favicon.ico|opengraph-image|robots.txt|sitemap.xml).*)',
  ],
};
