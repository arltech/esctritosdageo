import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import type { Database } from '@/lib/supabase/database.types';

/**
 * Middleware Supabase — refresh silencioso da sessão + auth gating.
 *
 * 1. Reescreve cookies de sessão a cada request (renovação silenciosa de tokens).
 * 2. Bloqueia rotas privadas para visitantes anônimos (redirect → /entrar).
 * 3. Redireciona usuários autenticados que tentam acessar /entrar para a casa (/).
 */

const PUBLIC_PATHS = new Set<string>(['/', '/entrar']);
const PUBLIC_PREFIXES = ['/api/health', '/p/'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = isPublicPath(pathname);

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/entrar';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Usuário autenticado em rota de "passagem" (landing ou login) → vai pra casa.
  if (user && (pathname === '/' || pathname === '/entrar')) {
    const url = request.nextUrl.clone();
    url.pathname = '/casa';
    url.search = '';
    return NextResponse.redirect(url);
  }

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
