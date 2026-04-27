'use client';

import { Check } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const THEME_KEY = 'escritos-da-geo:theme';

interface ThemeOption {
  id: string;
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
    description: 'Bege claro, mais arejado, menos quente.',
    swatches: ['#faf6ee', '#ede5d2', '#8a7152'],
  },
  {
    id: 'salvia',
    label: 'Sálvia',
    description: 'Verde acinzentado — vibe de jardim quieto.',
    swatches: ['#f3f5ed', '#e2e7d3', '#5a7048'],
  },
  {
    id: 'lavanda',
    label: 'Lavanda',
    description: 'Pastel violeta sutil, ar romântico.',
    swatches: ['#f6f3f8', '#e7dfed', '#6e5b80'],
  },
];

/* useSyncExternalStore — pattern recomendado pra ler localStorage no React 19 */

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return 'sepia';
  return window.localStorage.getItem(THEME_KEY) ?? 'sepia';
}

function getServerSnapshot(): string {
  return 'sepia';
}

function applyTheme(themeId: string) {
  if (typeof document === 'undefined') return;
  if (themeId === 'sepia') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeId);
  }
}

export function ThemePicker() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function selectTheme(id: string) {
    if (typeof window === 'undefined') return;
    if (id === 'sepia') {
      window.localStorage.removeItem(THEME_KEY);
    } else {
      window.localStorage.setItem(THEME_KEY, id);
    }
    applyTheme(id);
    // Dispara storage event manualmente pra outros componentes ouvirem
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {THEMES.map((theme) => {
        const isActive = current === theme.id;
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
            {/* Swatches */}
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

            {/* Label + descrição */}
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
