import { ArrowLeft, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { listPublicTexts, type PublicTextListItem } from '@/lib/db/texts';

export const metadata: Metadata = {
  title: 'Leituras — Escritos da Geo',
  description: 'Escritas públicas no santuário — abertas pra quem quiser sentar e ler.',
};

const MONTHS_FULL = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} de ${MONTHS_FULL[d.getMonth()]} de ${d.getFullYear()}`;
}

export default async function LeiturasPage() {
  const texts = await listPublicTexts(50);

  return (
    <main className="min-h-[100svh] px-4 pt-8 pb-16 sm:px-8 sm:pt-14">
      <Container as="div" className="!px-0">
        {/* Voltar pra landing */}
        <Link
          href="/"
          className="text-on-surface-variant hover:text-on-surface font-sans mb-6 inline-flex items-center gap-1.5 text-sm no-underline transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={1.6} />
          início
        </Link>

        <header className="mb-12 text-center">
          <p className="text-on-surface-variant/70 font-sans text-xs tracking-widest uppercase">
            Escritos da Geo
          </p>
          <h1
            className="text-on-surface mt-3 text-4xl tracking-tight sm:text-5xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Leituras
          </h1>
          <p
            className="text-on-surface-variant mx-auto mt-4 max-w-md text-base italic"
            style={{ fontFamily: 'var(--font-writing)' }}
          >
            o que saiu do caderno e ficou aqui, aberto.
          </p>
        </header>

        {texts.length === 0 ? <EmptyState /> : <TextsList texts={texts} />}
      </Container>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="bg-surface-container mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <BookOpen className="text-on-surface-variant/40" size={32} strokeWidth={1.4} aria-hidden />
      </div>

      <h3
        className="text-on-surface mb-1.5 text-xl font-medium"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Ainda nada por aqui
      </h3>
      <p className="text-on-surface-variant font-sans mb-2 max-w-[280px] text-sm leading-relaxed">
        Quando uma escrita for publicada, ela aparece aqui.
      </p>
      <p
        className="text-on-surface-variant/50 mt-2 text-sm"
        style={{ fontFamily: 'var(--font-writing)' }}
      >
        a primeira sempre demora a sair
      </p>
    </div>
  );
}

interface TextsListProps {
  texts: PublicTextListItem[];
}

function TextsList({ texts }: TextsListProps) {
  return (
    <ul className="flex flex-col">
      {texts.map((t, i) => (
        <li key={t.slug}>
          <Link
            href={`/p/${t.slug}`}
            className={`group flex flex-col gap-2 py-8 no-underline transition-all ${
              i === 0 ? '' : 'border-outline-variant/40 border-t'
            }`}
          >
            <p className="text-on-surface-variant/60 font-sans text-xs tracking-wider uppercase">
              {formatDate(t.published_at)}
            </p>

            <h2
              className="text-on-surface group-hover:text-primary text-2xl tracking-tight transition-colors sm:text-3xl"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 500 }}
            >
              {t.title}
            </h2>

            {t.first_sentence ? (
              <p
                className="text-on-surface-variant max-w-[640px] text-base leading-relaxed"
                style={{ fontFamily: 'var(--font-writing)' }}
              >
                {t.first_sentence}
              </p>
            ) : null}

            {t.tags.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span key={tag} className="text-on-surface-variant/70 font-sans text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
