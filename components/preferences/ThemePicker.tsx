'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

const THEME_KEY = 'escritos-da-geo:theme';
const VALID_THEMES = ['sepia', 'areia', 'salvia', 'lavanda'] as const;
type ThemeId = (typeof VALID_THEMES)[number];

interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  swatches: [string, string, string]; // bg, surface, primary
}

const THEMES: ThemeOption[] = [
  {
    id: 'sepia',
    label: 'Sépia',
    description: 'O original — papel envelhecido, tinta sépia.',
    swatches: ['#fff8f0', '#f6eddb', '#68594b'],
  },
  {
    id: 'areia',
    label: 'Areia',
    description: 'Bege quente da praia ao fim de tarde.',
    swatches: ['#f0e6d2', '#e1d4ba', '#8a6a3c'],
  },
  {
    id: 'salvia',
    label: 'Sálvia',
    description: 'Verde acinzentado — vibe de jardim quieto.',
    swatches: ['#e6ecd8', '#d2dabe', '#4a6038'],
  },
  {
    id: 'lavanda',
    label: 'Lavanda',
    description: 'Violeta romântico de fim de tarde.',
    swatches: ['#ebe2f3', '#d4c5e3', '#5e4870'],
  },
];

function applyToDom(themeId: ThemeId) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (themeId === 'sepia') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', themeId);
  }
}

function readFromStorage(): ThemeId {
  if (typeof window === 'undefined') return 'sepia';
  const v = window.localStorage.getItem(THEME_KEY);
  return (VALID_THEMES as readonly string[]).includes(v ?? '') ? (v as ThemeId) : 'sepia';
}

export function ThemePicker() {
  // Sempre inicia 'sepia' no SSR; hidratamos do localStorage no efeito.
  const [current, setCurrent] = useState<ThemeId>('sepia');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação one-shot
    setCurrent(stored);
    setHydrated(true);
    // O atributo já foi aplicado pelo anti-FOUT script no <head>;
    // garantimos por segurança caso o script tenha falhado.
    applyToDom(stored);
  }, []);

  function selectTheme(id: ThemeId) {
    setCurrent(id);
    if (typeof window !== 'undefined') {
      if (id === 'sepia') {
        window.localStorage.removeItem(THEME_KEY);
      } else {
        window.localStorage.setItem(THEME_KEY, id);
      }
    }
    applyToDom(id);
  }

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      // suprime mismatch — current sempre 'sepia' no SSR, real no client
      suppressHydrationWarning
    >
      {THEMES.map((theme) => {
        const isActive = hydrated && current === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => selectTheme(theme.id)}
            aria-pressed={isActive}
            className={`group relative flex items-center gap-4 rounded-md border p-4 text-left transition-all ${
              isActive
                ? 'border-primary bg-surface-container shadow-tactile'
                : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 hover:shadow-tactile'
            }`}
          >
            <div className="flex shrink-0 gap-1">
              {theme.swatches.map((color, i) => (
                <span
                  key={i}
                  className="border-outline-variant/30 h-8 w-5 rounded-sm border first:rounded-l-md last:rounded-r-md"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-on-surface text-base font-medium"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {theme.label}
                </span>
                {isActive ? (
                  <Check size={14} strokeWidth={2} className="text-primary" aria-hidden />
                ) : null}
              </div>
              <p className="text-on-surface-variant font-sans mt-0.5 text-xs leading-snug">
                {theme.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
