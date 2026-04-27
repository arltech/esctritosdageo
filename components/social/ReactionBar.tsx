'use client';

import { useState, useTransition } from 'react';

import { toggleReaction } from '@/app/_actions/social';
import type { ReactionKind } from '@/lib/types';

interface ReactionBarProps {
  textId: string;
  initialReaction: ReactionKind | null;
}

interface ReactionOption {
  kind: ReactionKind;
  emoji: string;
  label: string;
}

/**
 * 5 reações por linha. Sem contagem visível — só destaca a que o leitor
 * escolheu. Anti-métricas mantidos.
 */
const OPTIONS: ReactionOption[] = [
  { kind: 'coracao', emoji: '🤍', label: 'tocou o coração' },
  { kind: 'lagrima', emoji: '🥲', label: 'me emocionou' },
  { kind: 'brilho', emoji: '✨', label: 'me iluminou' },
  { kind: 'maos', emoji: '🙏', label: 'gratidão' },
  { kind: 'sorriso', emoji: '🌿', label: 'me acalmou' },
];

export function ReactionBar({ textId, initialReaction }: ReactionBarProps) {
  const [current, setCurrent] = useState<ReactionKind | null>(initialReaction);
  const [pending, startTransition] = useTransition();

  function handleClick(kind: ReactionKind) {
    // Optimistic
    const previous = current;
    setCurrent(current === kind ? null : kind);

    const fd = new FormData();
    fd.append('text_id', textId);
    fd.append('kind', kind);
    startTransition(async () => {
      const res = await toggleReaction(fd);
      if (!res.ok) {
        setCurrent(previous);
      } else {
        setCurrent(res.current);
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p
        className="text-on-surface-variant/70 font-sans text-xs tracking-wide"
        style={{ fontFamily: 'var(--font-writing)', fontSize: '14px' }}
      >
        deixe sua impressão
      </p>
      <div
        role="group"
        aria-label="Reagir ao texto"
        className="flex flex-wrap justify-center gap-2"
      >
        {OPTIONS.map((opt) => {
          const isActive = current === opt.kind;
          return (
            <button
              key={opt.kind}
              type="button"
              onClick={() => handleClick(opt.kind)}
              disabled={pending}
              aria-pressed={isActive}
              aria-label={opt.label}
              title={opt.label}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl transition-all duration-200 ${
                isActive
                  ? 'border-primary bg-surface-container scale-110'
                  : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 hover:scale-105'
              } disabled:opacity-50`}
              style={{
                filter: isActive ? 'none' : 'grayscale(0.4) opacity(0.85)',
              }}
            >
              {opt.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
