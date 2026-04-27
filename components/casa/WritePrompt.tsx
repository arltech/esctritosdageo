import { Pencil } from 'lucide-react';
import Link from 'next/link';

/**
 * Card-prompt persistente na sidebar — convite à escrita sem cobrança.
 * Frase fixa por enquanto; V2 pode permitir customização nas configurações.
 */
export function WritePrompt() {
  return (
    <Link
      href="/escrever"
      className="bg-surface-container-lowest shadow-tactile group relative block overflow-hidden rounded-md px-5 py-6 transition-shadow hover:shadow-md"
    >
      <div className="washi-tape-sage absolute -top-2 left-4 h-5 w-16 -rotate-3" aria-hidden />
      <div className="flex items-start gap-4">
        <div className="bg-primary-fixed text-on-primary-fixed flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Pencil size={18} strokeWidth={1.6} />
        </div>
        <div>
          <p
            className="text-on-surface text-xl leading-tight"
            style={{ fontFamily: 'var(--font-writing)' }}
          >
            o que você quer dizer hoje?
          </p>
          <p className="text-on-surface-variant font-sans mt-2 text-xs tracking-widest uppercase opacity-70 group-hover:opacity-100">
            abrir o caderno →
          </p>
        </div>
      </div>
    </Link>
  );
}
