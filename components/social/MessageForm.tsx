'use client';

import { Check, Send } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';

import { sendMessage, type SendMessageResult } from '@/app/_actions/social';

interface MessageFormProps {
  textId: string;
  authorName: string;
}

export function MessageForm({ textId, authorName }: MessageFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<SendMessageResult | null, FormData>(
    sendMessage,
    null,
  );

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      // Fecha após 2.5s pra mensagem de sucesso ficar visível
      const t = window.setTimeout(() => setOpen(false), 2500);
      return () => window.clearTimeout(t);
    }
  }, [state]);

  if (!open) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-on-surface hover:text-on-surface font-sans inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm tracking-wide transition-colors"
        >
          <Send size={14} strokeWidth={1.6} />
          deixar um bilhete pra {authorName.toLowerCase()}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="text_id" value={textId} />
      <p
        className="text-on-surface-variant/80 text-center text-base italic"
        style={{ fontFamily: 'var(--font-writing)' }}
      >
        Só {authorName.toLowerCase()} vai ler isso.
      </p>

      <textarea
        name="body"
        required
        maxLength={2000}
        rows={4}
        placeholder="o que você quer dizer..."
        className="border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary placeholder:text-on-surface-variant/40 resize-none rounded border px-4 py-3 text-base outline-none transition-colors"
        style={{ fontFamily: 'var(--font-writing)', lineHeight: '1.6' }}
      />

      <input
        type="text"
        name="sender_name"
        maxLength={80}
        placeholder="seu nome (opcional)"
        className="border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary placeholder:text-on-surface-variant/40 font-sans rounded border px-4 py-2 text-sm outline-none transition-colors"
      />

      {state && !state.ok ? (
        <p className="text-error font-sans text-sm italic">{state.error}</p>
      ) : null}

      {state?.ok ? (
        <p className="text-secondary font-sans inline-flex items-center justify-center gap-1.5 text-sm">
          <Check size={14} strokeWidth={2} />
          bilhete enviado.
        </p>
      ) : (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="text-on-surface-variant hover:text-on-surface font-sans text-sm tracking-wide transition-colors disabled:opacity-50"
          >
            cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="bg-primary text-on-primary hover:bg-primary-container font-sans inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm tracking-wide transition-colors disabled:opacity-50"
          >
            <Send size={13} strokeWidth={1.8} />
            {pending ? 'enviando...' : 'enviar'}
          </button>
        </div>
      )}
    </form>
  );
}
