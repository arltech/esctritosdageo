import { ArrowLeft, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { MessageActions } from '@/components/social/MessageActions';
import { listMyMessages } from '@/lib/db/social';

export const metadata: Metadata = {
  title: 'Recados — Escritos da Geo',
  robots: { index: false, follow: false },
};

const MONTHS_SHORT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} · ${d.getFullYear()}`;
}

export default async function RecadosPage() {
  const messages = await listMyMessages();

  return (
    <main className="min-h-screen px-4 pt-6 pb-16 sm:px-8 sm:pt-10">
      <Container as="div" className="!px-0">
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
            Recados
          </h1>
        </header>

        {messages.length === 0 ? <EmptyState /> : <MessageList messages={messages} />}
      </Container>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="bg-surface-container mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <Mail className="text-on-surface-variant/40" size={32} strokeWidth={1.4} aria-hidden />
      </div>

      <h3
        className="text-on-surface mb-1.5 text-xl font-medium"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Nenhum bilhete ainda
      </h3>

      <p className="text-on-surface-variant font-sans mb-2 max-w-[280px] text-sm leading-relaxed">
        Quando alguém deixar um recado nas suas escritas públicas, ele aparece aqui — só pra você.
      </p>
      <p
        className="text-on-surface-variant/50 mt-2 text-sm"
        style={{ fontFamily: 'var(--font-writing)' }}
      >
        a leitura faz a palavra acontecer
      </p>
    </div>
  );
}

interface ListProps {
  messages: Awaited<ReturnType<typeof listMyMessages>>;
}

function MessageList({ messages }: ListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {messages.map((m) => {
        const isUnread = !m.read_at;
        return (
          <li key={m.id}>
            <article
              className={`bg-surface-container-lowest relative rounded-md border p-5 transition-colors ${
                isUnread ? 'border-primary/40 shadow-tactile' : 'border-outline-variant/40'
              }`}
            >
              <header className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-on-surface-variant font-sans text-xs">
                    {m.sender_name ? (
                      <span className="text-on-surface font-medium">{m.sender_name}</span>
                    ) : (
                      <span className="italic">alguém</span>
                    )}
                    <span className="mx-1.5 opacity-50">·</span>
                    <span>sobre</span>{' '}
                    {m.text_slug ? (
                      <Link
                        href={`/p/${m.text_slug}`}
                        className="text-on-surface hover:text-primary underline-offset-2 hover:underline"
                      >
                        {m.text_title}
                      </Link>
                    ) : (
                      <span className="text-on-surface">{m.text_title}</span>
                    )}
                  </p>
                  <p className="text-on-surface-variant/70 font-sans mt-0.5 text-xs">
                    {formatDate(m.created_at)}
                  </p>
                </div>
                <MessageActions id={m.id} read={!isUnread} />
              </header>

              <p
                className="text-on-surface text-base leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: 'var(--font-writing)' }}
              >
                {m.body}
              </p>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
