import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { TextActions } from '@/components/texts/TextActions';
import { getMyText } from '@/lib/db/texts';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EscritaReadPage({ params }: PageProps) {
  const { id } = await params;
  const text = await getMyText(id);
  if (!text) notFound();

  const date = new Date(text.created_at);
  const day = date.getDate();
  const month = MONTHS_FULL[date.getMonth()];
  const year = date.getFullYear();

  // Monta URL pública (apenas se tiver slug + status public)
  let publicUrl: string | null = null;
  if (text.status === 'public' && text.slug) {
    const h = await headers();
    const host = h.get('host') ?? '';
    const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
    publicUrl = `${proto}://${host}/p/${text.slug}`;
  }

  return (
    <main className="px-4 pt-8 pb-16 sm:px-8 sm:pt-12">
      <Container as="div" className="!px-0">
        <Link
          href="/escritas"
          className="text-on-surface-variant hover:text-on-surface font-sans mb-6 inline-flex items-center gap-2 text-sm no-underline transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={1.6} />
          escritas
        </Link>

        <article className="bg-surface-container-lowest shadow-tactile rounded-md px-6 py-8 sm:px-14 sm:py-12">
          {/* Data */}
          <div className="border-outline-variant/40 text-on-surface-variant mb-6 flex items-baseline gap-2 border-b pb-3 font-sans text-sm tracking-wide">
            <span className="text-on-surface font-medium">{day}</span>
            <span>{month}</span>
            <span className="text-on-surface-variant/60">·</span>
            <span className="text-on-surface-variant/60">{year}</span>
          </div>

          {/* Título */}
          <h1
            className="text-on-surface mb-6 text-3xl tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {text.title || '(sem título)'}
          </h1>

          {/* Tags */}
          {text.tags && text.tags.length > 0 ? (
            <div className="mb-8 flex flex-wrap gap-1.5">
              {text.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary-container text-on-secondary-container font-sans rounded-full px-3 py-1 text-xs tracking-wide"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Corpo */}
          <div
            className="text-on-surface prose-editor"
            style={{
              fontFamily: 'var(--font-writing)',
              fontSize: '1.25rem',
              lineHeight: '1.85',
            }}
            dangerouslySetInnerHTML={{ __html: text.body_html }}
          />

          {/* Ações */}
          <div className="border-outline-variant/40 mt-12 border-t pt-6">
            <TextActions
              id={text.id}
              title={text.title}
              status={text.status}
              publicUrl={publicUrl}
            />
          </div>
        </article>
      </Container>
    </main>
  );
}
