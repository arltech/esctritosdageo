import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { MessageForm } from '@/components/social/MessageForm';
import { ReactionBar } from '@/components/social/ReactionBar';
import { getMyReaction } from '@/lib/db/social';
import { getPublicTextBySlug } from '@/lib/db/texts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const text = await getPublicTextBySlug(slug);
  if (!text) return { title: 'Não encontrado' };

  return {
    title: `${text.title} — ${text.display_name}`,
    description: text.body_html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160),
  };
}

export default async function PublicTextPage({ params }: PageProps) {
  const { slug } = await params;
  const text = await getPublicTextBySlug(slug);
  if (!text) notFound();

  const date = text.published_at ? new Date(text.published_at) : null;
  const dateLabel = date
    ? `${date.getDate()} de ${MONTHS_FULL[date.getMonth()]} de ${date.getFullYear()}`
    : '';

  return (
    <main className="min-h-[100svh] px-4 py-12 sm:px-8 sm:py-20">
      <Container as="div" className="!px-0">
        <article className="bg-surface-container-lowest shadow-tactile rounded-md px-6 py-10 sm:px-14 sm:py-16">
          <header className="mb-10 text-center">
            <p className="text-on-surface-variant font-sans text-xs tracking-widest uppercase">
              {text.display_name}
            </p>
            <h1
              className="text-on-surface mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {text.title}
            </h1>
            {dateLabel ? (
              <p className="text-on-surface-variant/70 font-sans mt-3 text-sm italic">
                {dateLabel}
              </p>
            ) : null}
          </header>

          <div
            className="text-on-surface prose-editor mx-auto max-w-[640px]"
            style={{
              fontFamily: 'var(--font-writing)',
              fontSize: '1.25rem',
              lineHeight: '1.85',
            }}
            dangerouslySetInnerHTML={{ __html: text.body_html }}
          />

          {/* ---------- Bloco social: reactions + bilhete ---------- */}
          <footer className="border-outline-variant/40 mx-auto mt-16 max-w-[640px] border-t pt-10">
            <div className="mb-10">
              <ReactionBar textId={text.id} initialReaction={await getMyReaction(text.id)} />
            </div>
            <MessageForm textId={text.id} authorName={text.display_name} />
          </footer>
        </article>

        {/* Link pra index de leituras */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/leituras"
            className="text-on-surface-variant hover:text-on-surface font-sans inline-flex items-center gap-2 text-sm tracking-wide no-underline transition-colors"
          >
            ler outras escritas →
          </Link>
        </div>
      </Container>
    </main>
  );
}
