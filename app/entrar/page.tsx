import type { Metadata } from 'next';

import { Container } from '@/components/layout/Container';

import { signIn } from './actions';

export const metadata: Metadata = {
  title: 'Entrar — Escritos da Geo',
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  'campos-invalidos': 'Preencha email e senha para entrar.',
  'credenciais-invalidas': 'Email ou senha incorretos.',
};

type SearchParams = Promise<{ erro?: string }>;

export default async function EntrarPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const erro = sp.erro && ERRORS[sp.erro] ? ERRORS[sp.erro] : null;

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-4 py-12 sm:px-6 sm:py-24">
      <Container as="section" className="!px-0">
        <div className="bg-surface-container-lowest shadow-tactile relative rounded-lg px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div
            className="washi-tape-primary absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 sm:-top-4 sm:h-7 sm:w-32"
            aria-hidden
          />

          <header className="mb-8 text-center sm:mb-12">
            <h1 className="text-on-surface text-3xl sm:text-4xl lg:text-5xl">Escritos da Geo</h1>
            <p className="text-on-surface-variant font-sans mt-3 text-sm tracking-wide sm:mt-4 sm:text-base">
              Um santuário para suas palavras.
            </p>
          </header>

          <form action={signIn} className="flex flex-col gap-5 sm:gap-6" noValidate>
            <label className="flex flex-col gap-1.5 sm:gap-2">
              <span className="text-on-surface-variant font-sans text-xs tracking-wide uppercase sm:text-sm">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                inputMode="email"
                className="border-outline-variant bg-surface text-on-surface focus:border-primary rounded-sm border px-4 py-2.5 text-base outline-none transition-colors sm:py-3 sm:text-lg"
              />
            </label>

            <label className="flex flex-col gap-1.5 sm:gap-2">
              <span className="text-on-surface-variant font-sans text-xs tracking-wide uppercase sm:text-sm">
                Senha
              </span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                minLength={6}
                className="border-outline-variant bg-surface text-on-surface focus:border-primary rounded-sm border px-4 py-2.5 text-base outline-none transition-colors sm:py-3 sm:text-lg"
              />
            </label>

            {erro ? (
              <p className="text-error font-sans text-sm tracking-wide italic">{erro}</p>
            ) : null}

            <button
              type="submit"
              className="bg-primary text-on-primary hover:bg-primary-container font-sans mt-2 rounded-sm px-6 py-3 text-sm tracking-wider uppercase transition-colors sm:text-base"
            >
              entrar
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
}
