'use client';

import { Camera, Highlighter, Pencil, Tag, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

type ToolId = 'highlight' | 'photo' | 'sketch' | 'tag';

interface Tool {
  id: ToolId;
  Icon: LucideIcon;
  label: string;
}

const TOOLS: readonly Tool[] = [
  { id: 'highlight', Icon: Highlighter, label: 'Marca-texto' },
  { id: 'photo', Icon: Camera, label: 'Adicionar foto' },
  { id: 'sketch', Icon: Pencil, label: 'Adicionar rabisco' },
] as const;

const META_TOOLS: readonly Tool[] = [{ id: 'tag', Icon: Tag, label: 'Marcar com tag' }] as const;

/**
 * Toolbar flutuante do editor — pílula branca fixa no rodapé central.
 * Ações ainda não conectadas (Story 2.x liga). Botões são visualmente
 * funcionais (estado ativo + tooltip) mas não persistem nada por enquanto.
 */
export function EditorToolbar() {
  const [active, setActive] = useState<ToolId | null>('sketch');

  function renderButton(tool: Tool) {
    const isActive = active === tool.id;
    return (
      <li key={tool.id} className="group relative">
        <button
          type="button"
          aria-label={tool.label}
          aria-pressed={isActive}
          onClick={() => setActive((curr) => (curr === tool.id ? null : tool.id))}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
            isActive
              ? 'bg-primary-fixed text-on-primary-fixed'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <tool.Icon size={18} strokeWidth={1.6} />
        </button>
        {/* Tooltip */}
        <span
          role="tooltip"
          className="bg-inverse-surface text-inverse-on-surface font-sans pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md px-3 py-1 text-xs whitespace-nowrap opacity-0 shadow-md transition-opacity group-hover:opacity-100"
        >
          {tool.label}
        </span>
      </li>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <nav
        aria-label="Ferramentas do editor"
        className="bg-surface-container-lowest shadow-tactile pointer-events-auto flex items-center gap-1 rounded-full px-3 py-2"
      >
        <ul className="flex items-center gap-1">{TOOLS.map(renderButton)}</ul>

        <span className="bg-outline-variant/60 mx-2 h-6 w-px" aria-hidden />

        <ul className="flex items-center gap-1">{META_TOOLS.map(renderButton)}</ul>

        <button
          type="button"
          aria-label="Salvar entrada"
          className="bg-primary text-on-primary hover:bg-primary-container font-sans ml-2 rounded-full px-6 py-2 text-sm tracking-wide transition-colors"
        >
          Salvar
        </button>
      </nav>
    </div>
  );
}
