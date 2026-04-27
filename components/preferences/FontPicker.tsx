'use client';

import { Check } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const SERIF_FONTS = [
  { id: 'newsreader', label: 'Newsreader', cssVar: '--font-newsreader' },
  { id: 'literata', label: 'Literata', cssVar: '--font-literata' },
  { id: 'source-serif', label: 'Source Serif 4', cssVar: '--font-source-serif' },
  { id: 'spectral', label: 'Spectral', cssVar: '--font-spectral' },
  { id: 'vollkorn', label: 'Vollkorn', cssVar: '--font-vollkorn' },
  { id: 'lora', label: 'Lora', cssVar: '--font-lora' },
  { id: 'fraunces', label: 'Fraunces', cssVar: '--font-fraunces' },
  { id: 'eb-garamond', label: 'EB Garamond', cssVar: '--font-eb-garamond' },
  { id: 'cormorant', label: 'Cormorant Garamond', cssVar: '--font-cormorant' },
] as const;

const WRITING_FONTS = [
  { id: 'caveat', label: 'Caveat', cssVar: '--font-caveat' },
  { id: 'sacramento', label: 'Sacramento', cssVar: '--font-sacramento' },
  { id: 'homemade-apple', label: 'Homemade Apple', cssVar: '--font-homemade-apple' },
  { id: 'architects-daughter', label: 'Architects Daughter', cssVar: '--font-architects-daughter' },
  { id: 'gloria-hallelujah', label: 'Gloria Hallelujah', cssVar: '--font-gloria-hallelujah' },
  { id: 'kalam', label: 'Kalam', cssVar: '--font-kalam' },
  { id: 'patrick-hand', label: 'Patrick Hand', cssVar: '--font-patrick-hand' },
] as const;

type SerifId = (typeof SERIF_FONTS)[number]['id'];
type WritingId = (typeof WRITING_FONTS)[number]['id'];

type Kind = 'serif' | 'writing';

const CONFIG = {
  serif: {
    fonts: SERIF_FONTS,
    storageKey: 'escritos-da-geo:font-serif',
    cssVar: '--font-serif',
    fallback: 'serif',
    default: 'newsreader' as SerifId,
    eventName: 'escritos-font-serif-changed',
    sample: 'O ar diferente, a luz se movendo nos vidros.',
  },
  writing: {
    fonts: WRITING_FONTS,
    storageKey: 'escritos-da-geo:font-writing',
    cssVar: '--font-writing',
    fallback: 'cursive',
    default: 'caveat' as WritingId,
    eventName: 'escritos-font-writing-changed',
    sample: 'Hoje o céu pediu silêncio.',
  },
} as const;

function readPreference(kind: Kind): string {
  const cfg = CONFIG[kind];
  try {
    const saved = localStorage.getItem(cfg.storageKey);
    if (saved && cfg.fonts.some((f) => f.id === saved)) return saved;
  } catch {
    // localStorage indisponível
  }
  return cfg.default;
}

function makeSubscribe(eventName: string) {
  return (callback: () => void) => {
    window.addEventListener(eventName, callback);
    window.addEventListener('storage', callback);
    return () => {
      window.removeEventListener(eventName, callback);
      window.removeEventListener('storage', callback);
    };
  };
}

function applyFont(kind: Kind, id: string) {
  const cfg = CONFIG[kind];
  const font = cfg.fonts.find((f) => f.id === id);
  if (!font) return;
  document.documentElement.style.setProperty(cfg.cssVar, `var(${font.cssVar}), ${cfg.fallback}`);
}

interface FontPickerProps {
  kind: Kind;
}

export function FontPicker({ kind }: FontPickerProps) {
  const cfg = CONFIG[kind];
  const selected = useSyncExternalStore(
    makeSubscribe(cfg.eventName),
    () => readPreference(kind),
    () => cfg.default,
  );

  function handleSelect(id: string) {
    applyFont(kind, id);
    try {
      localStorage.setItem(cfg.storageKey, id);
      window.dispatchEvent(new Event(cfg.eventName));
    } catch {
      // sem persistência — escolha vale só pra sessão
    }
  }

  return (
    <ul role="radiogroup" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {cfg.fonts.map((font) => {
        const isSelected = font.id === selected;
        return (
          <li key={font.id} role="none">
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(font.id)}
              suppressHydrationWarning
              className={`group flex w-full items-center justify-between gap-3 rounded-sm border px-4 py-3 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                  : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:border-primary/60 hover:bg-surface-container'
              }`}
            >
              <span className="flex flex-col gap-0.5">
                <span
                  className="text-xl leading-tight"
                  style={{ fontFamily: `var(${font.cssVar}), ${cfg.fallback}` }}
                >
                  {font.label}
                </span>
                <span
                  className="text-on-surface-variant/70 text-sm leading-snug"
                  style={{ fontFamily: `var(${font.cssVar}), ${cfg.fallback}` }}
                >
                  {cfg.sample}
                </span>
              </span>
              {isSelected ? (
                <Check size={16} strokeWidth={2} className="text-primary shrink-0" />
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
