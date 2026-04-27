'use client';

import { Globe, Lock } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { TextListItem } from '@/lib/types';

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

interface TextsListingProps {
  texts: TextListItem[];
}

export function TextsListing({ texts }: TextsListingProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const t of texts) for (const tag of t.tags) set.add(tag);
    return Array.from(set).sort();
  }, [texts]);

  const filtered = useMemo(
    () => (activeTag ? texts.filter((t) => t.tags.includes(activeTag)) : texts),
    [texts, activeTag],
  );

  return (
    <>
      {/* Tag filter — só aparece se houver tags */}
      {allTags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-1.5">
          <FilterPill
            label="todas"
            active={!activeTag}
            onClick={() => setActiveTag(null)}
            primary
          />
          {allTags.map((tag) => (
            <FilterPill
              key={tag}
              label={`#${tag}`}
              active={activeTag === tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            />
          ))}
        </div>
      ) : null}

      {/* Lista */}
      <ul className="flex flex-col gap-3">
        {filtered.map((t) => (
          <li key={t.id}>
            <Link
              href={`/escritas/${t.id}`}
              className="border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 hover:shadow-tactile group flex flex-col gap-1.5 rounded-md border p-5 no-underline transition-all"
            >
              <h2
                className="text-on-surface group-hover:text-primary text-lg font-medium tracking-tight transition-colors"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {t.title}
              </h2>

              {t.first_sentence ? (
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {t.first_sentence}
                </p>
              ) : null}

              <div className="text-on-surface-variant/70 mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span style={{ fontFamily: 'var(--font-writing)' }}>
                  {formatDate(t.created_at)}
                </span>
                {t.tags.length > 0 ? (
                  <>
                    <span aria-hidden>·</span>
                    {t.tags.map((tag) => (
                      <span key={tag} className="font-sans">
                        #{tag}
                      </span>
                    ))}
                  </>
                ) : null}
                {t.status === 'public' ? (
                  <>
                    <span aria-hidden>·</span>
                    <span className="text-secondary inline-flex items-center gap-1" title="Pública">
                      <Globe size={11} strokeWidth={1.8} />
                      pública
                    </span>
                  </>
                ) : (
                  <span className="text-on-surface-variant/40 ml-auto" title="Privada">
                    <Lock size={11} strokeWidth={1.8} />
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer count */}
      <p
        className="text-on-surface-variant mt-8 text-center text-sm italic"
        style={{ fontFamily: 'var(--font-writing)' }}
      >
        {filtered.length} {filtered.length === 1 ? 'escrita' : 'escritas'}
        {activeTag ? ` em #${activeTag}` : ''}
      </p>
    </>
  );
}

interface FilterPillProps {
  label: string;
  active: boolean;
  primary?: boolean;
  onClick: () => void;
}

function FilterPill({ label, active, primary, onClick }: FilterPillProps) {
  let className = 'font-sans rounded-full border px-3 py-1 text-xs tracking-wide transition-colors';
  if (active && primary) {
    className += ' bg-primary border-primary text-on-primary';
  } else if (active) {
    className += ' bg-secondary-container border-secondary-container text-on-secondary-container';
  } else {
    className +=
      ' border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface';
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
