'use client';

import { Bookmark } from 'lucide-react';
import { useState } from 'react';

/**
 * Botão de bookmark para a entrada — visualmente funcional (toggle on/off)
 * mas sem persistência ainda. Story 2.x conecta com a tabela texts.
 */
export function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <button
      type="button"
      aria-label={bookmarked ? 'Remover dos favoritos' : 'Marcar como favorito'}
      aria-pressed={bookmarked}
      title={bookmarked ? 'Salvo' : 'Salvar entrada'}
      onClick={() => setBookmarked((b) => !b)}
      className="bg-surface-container border-outline-variant/40 hover:border-primary text-on-surface-variant hover:text-primary flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
    >
      <Bookmark
        size={18}
        strokeWidth={1.6}
        className={bookmarked ? 'fill-primary text-primary' : ''}
      />
    </button>
  );
}
