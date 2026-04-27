'use client';

import { Check, Trash2 } from 'lucide-react';

import { deleteMessage, markMessageRead } from '@/app/_actions/social';

interface MessageActionsProps {
  id: string;
  read: boolean;
}

export function MessageActions({ id, read }: MessageActionsProps) {
  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Apagar este bilhete? Não dá pra desfazer.')) {
      e.preventDefault();
    }
  }

  return (
    <div className="flex items-center gap-1">
      {!read ? (
        <form action={markMessageRead}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            aria-label="Marcar como lido"
            title="Marcar como lido"
            className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-7 w-7 items-center justify-center rounded-full transition-colors"
          >
            <Check size={13} strokeWidth={1.8} />
          </button>
        </form>
      ) : null}

      <form action={deleteMessage} onSubmit={handleDelete}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          aria-label="Apagar"
          title="Apagar"
          className="text-on-surface-variant hover:bg-error-container hover:text-on-error-container flex h-7 w-7 items-center justify-center rounded-full transition-colors"
        >
          <Trash2 size={13} strokeWidth={1.8} />
        </button>
      </form>
    </div>
  );
}
