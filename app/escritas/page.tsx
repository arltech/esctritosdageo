import { ArrowLeft, NotebookPen, PenLine } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { TextsListing } from '@/components/texts/TextsListing';
import { listMyTexts } from '@/lib/db/texts';

export const metadata: Metadata = {
  title: 'Escritas — Escritos da Geo',
  robots: { index: false, follow: false },
};

export default async function EscritasPage() {
  const texts = await listMyTexts();

  return (
    <main className="min-h-screen px-4 pt-6 pb-16 sm:px-8 sm:pt-10">
      <Container as="div" className="!px-0">
        {/* Back link discreto acima do título */}
        <Link
          href="/casa"
          className="text-on-surface-variant hover:text-on-surface font-sans mb-4 inline-flex items-center gap-1.5 text-sm no-underline transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={1.6} />
          casa
        </Link>

        <header className="mb-8 flex items-end justify-between gap-4">
          <h1
            className="text-on-surface text-3xl font-medium tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Escritas
          </h1>
          {texts.length > 0 ? (
            <Link
              href="/escrever"
              aria-label="Nova escrita"
              className="bg-primary text-on-primary hover:bg-primary-container shadow-tactile font-sans group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide no-underline transition-all hover:-translate-y-0.5"
            >
              <PenLine
                size={15}
                strokeWidth={1.8}
                className="transition-transform group-hover:rotate-[-8deg]"
              />
              <span>nova escrita</span>
            </Link>
          ) : null}
        </header>

        {texts.length === 0 ? <EmptyState /> : <TextsListing texts={texts} />}
      </Container>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      {/* Ilustração circular — padrão DS */}
      <div className="bg-surface-container mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <NotebookPen
          className="text-on-surface-variant/40"
          size={32}
          strokeWidth={1.4}
          aria-hidden
        />
      </div>

      <h3
        className="text-on-surface mb-1.5 text-xl font-medium"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Nenhuma escrita ainda
      </h3>

      <p className="text-on-surface-variant font-sans mb-4 max-w-[260px] text-sm leading-relaxed">
        Este caderno está esperando suas primeiras palavras.
      </p>

      <Link
        href="/escrever"
        className="bg-primary text-on-primary hover:bg-primary-container shadow-tactile font-sans group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide no-underline transition-all hover:-translate-y-0.5"
      >
        <PenLine
          size={15}
          strokeWidth={1.8}
          className="transition-transform group-hover:rotate-[-8deg]"
        />
        Começar a escrever
      </Link>

      <p
        className="text-on-surface-variant/50 mt-4 text-sm"
        style={{ fontFamily: 'var(--font-writing)' }}
      >
        tudo começa com a primeira linha
      </p>
    </div>
  );
}
