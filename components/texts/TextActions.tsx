'use client';

import { Check, Copy, Globe, Lock, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { deleteText, togglePublicText } from '@/app/_actions/texts';

interface TextActionsProps {
  id: string;
  title: string;
  status: 'private' | 'public';
  publicUrl: string | null;
}

export function TextActions({ id, title, status, publicUrl }: TextActionsProps) {
  const [copied, setCopied] = useState(false);

  function handleDeleteSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm(`Apagar "${title || 'esta entrada'}"? Não dá pra desfazer.`)) {
      e.preventDefault();
    }
  }

  async function copyLink() {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback silencioso — alguns browsers em http bloqueiam clipboard
    }
  }

  const isPublic = status === 'public';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/escrever?id=${id}`}
        className="border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary font-sans inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm tracking-wide no-underline transition-colors"
      >
        <Pencil size={14} strokeWidth={1.8} />
        editar
      </Link>

      <form action={togglePublicText}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className={`font-sans inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm tracking-wide transition-colors ${
            isPublic
              ? 'border-secondary-container bg-secondary-container/40 text-on-secondary-container hover:bg-secondary-container'
              : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary'
          }`}
        >
          {isPublic ? <Globe size={14} strokeWidth={1.8} /> : <Lock size={14} strokeWidth={1.8} />}
          {isPublic ? 'pública' : 'tornar pública'}
        </button>
      </form>

      {isPublic && publicUrl ? (
        <button
          type="button"
          onClick={copyLink}
          className="border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-sans inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm tracking-wide transition-colors"
        >
          {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.8} />}
          {copied ? 'link copiado' : 'copiar link'}
        </button>
      ) : null}

      <form action={deleteText} onSubmit={handleDeleteSubmit} className="ml-auto">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-on-surface-variant hover:bg-error-container hover:text-on-error-container font-sans inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm tracking-wide transition-colors"
        >
          <Trash2 size={14} strokeWidth={1.8} />
          apagar
        </button>
      </form>
    </div>
  );
}
