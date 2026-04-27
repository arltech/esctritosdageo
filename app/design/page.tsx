import {
  ArrowLeft,
  Camera,
  Highlighter,
  Home,
  Mail,
  NotebookPen,
  Pencil,
  Settings,
  Tag as TagIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { SettingsTabs } from '@/components/preferences/SettingsTabs';
import { ShowcaseSection, SpecCard, Swatch } from '@/components/design/ShowcaseSection';

import { ElementsTab, FeedbackTab, FormsTab, NavigationTab } from './extras';

export const metadata: Metadata = {
  title: 'Design System — Escritos da Geo',
  robots: { index: false, follow: false },
};

/* ============================================================================
 * Aba 1: CORES & TEMAS
 * ============================================================================ */
function ColorsTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection
        title="Superfícies (sépia — tema padrão)"
        description="Tokens que aparecem em fundos, cartões, polaroides, papel."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Swatch label="background" hint="#fff8f0" color="#fff8f0" />
          <Swatch label="surface-container-lowest" hint="#ffffff" color="#ffffff" />
          <Swatch label="surface-container-low" hint="#fcf3e1" color="#fcf3e1" />
          <Swatch label="surface-container" hint="#f6eddb" color="#f6eddb" />
          <Swatch label="surface-container-high" hint="#f0e7d5" color="#f0e7d5" />
          <Swatch label="surface-variant" hint="#eae2d0" color="#eae2d0" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Texto" description="Hierarquia de leitura.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Swatch label="on-surface" hint="#1f1b10 — corpo editorial" color="#1f1b10" />
          <Swatch label="on-surface-variant" hint="#4d453e — meta, captions" color="#4d453e" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Acentos"
        description="Sépia (primária), sálvia (secundária), washi tan (terciária)."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Swatch label="primary" hint="#68594b — sépia ink" color="#68594b" />
          <Swatch label="primary-fixed" hint="#f4dfcc" color="#f4dfcc" />
          <Swatch label="secondary" hint="#59614e — sálvia" color="#59614e" />
          <Swatch label="secondary-container" hint="#dee6ce" color="#dee6ce" />
          <Swatch label="tertiary" hint="#7b542b — washi tan" color="#7b542b" />
          <Swatch label="tertiary-fixed" hint="#ffdcbd" color="#ffdcbd" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Erro" description="Único par destoante — para alertas reais.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Swatch label="error" hint="#ba1a1a" color="#ba1a1a" />
          <Swatch label="error-container" hint="#ffdad6" color="#ffdad6" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Temas alternativos"
        description="Trocados em /configuracoes → Tema. Tokens acima viram outros valores em runtime via [data-theme]."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: 'sepia', label: 'Sépia', bg: '#fff8f0', surface: '#f6eddb', primary: '#68594b' },
            { id: 'areia', label: 'Areia', bg: '#f0e6d2', surface: '#e1d4ba', primary: '#8a6a3c' },
            {
              id: 'salvia',
              label: 'Sálvia',
              bg: '#e6ecd8',
              surface: '#d2dabe',
              primary: '#4a6038',
            },
            {
              id: 'lavanda',
              label: 'Lavanda',
              bg: '#ebe2f3',
              surface: '#d4c5e3',
              primary: '#5e4870',
            },
          ].map((t) => (
            <div key={t.id} className="border-outline-variant/40 rounded-md border p-3">
              <div className="mb-2 flex gap-1">
                <span
                  className="border-outline-variant/30 h-12 flex-1 rounded-l-sm border"
                  style={{ backgroundColor: t.bg }}
                />
                <span
                  className="border-outline-variant/30 h-12 flex-1 border-y"
                  style={{ backgroundColor: t.surface }}
                />
                <span
                  className="border-outline-variant/30 h-12 flex-1 rounded-r-sm border"
                  style={{ backgroundColor: t.primary }}
                />
              </div>
              <p
                className="text-on-surface text-sm font-medium"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {t.label}
              </p>
            </div>
          ))}
        </div>
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * Aba 2: TIPOGRAFIA
 * ============================================================================ */
function TypographyTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection title="Famílias" description="Três papéis distintos.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SpecCard label="Editorial — var(--font-serif)" meta="Newsreader (default)">
            <p className="text-on-surface text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
              O texto que respira no santuário.
            </p>
          </SpecCard>
          <SpecCard label="Manuscrita — var(--font-writing)" meta="Caveat (default)">
            <p className="text-on-surface text-2xl" style={{ fontFamily: 'var(--font-writing)' }}>
              o sussurro entre as linhas
            </p>
          </SpecCard>
          <SpecCard label="UI — var(--font-sans)" meta="Epilogue (fixa)">
            <p className="text-on-surface font-sans text-base">Etiquetas, botões, navegação.</p>
          </SpecCard>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Escala" description="5 degraus principais.">
        <div className="space-y-4">
          <SpecCard label="headline-lg" meta="48px / 1.1 / 600">
            <p
              className="text-on-surface"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 48,
                lineHeight: 1.1,
                fontWeight: 600,
              }}
            >
              Hero, título de marca
            </p>
          </SpecCard>
          <SpecCard label="headline-md" meta="32px / 1.2 / 500">
            <p
              className="text-on-surface"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 32,
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              Título de seção
            </p>
          </SpecCard>
          <SpecCard label="body-md" meta="18px / 1.6 / 400">
            <p
              className="text-on-surface max-w-[640px]"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.6 }}
            >
              Corpo de leitura. Tudo aqui mira na medida ideal — 65 caracteres por linha — pra quem
              se senta a ler de verdade encontrar onde a palavra mora.
            </p>
          </SpecCard>
          <SpecCard label="marginalia" meta="16px / 1.4 / 400">
            <p className="text-on-surface-variant font-sans text-base">
              Side notes e metadados secundários.
            </p>
          </SpecCard>
          <SpecCard label="caption-hand" meta="14px / 1.3 / 300">
            <p
              className="text-on-surface-variant text-sm"
              style={{ fontFamily: 'var(--font-writing)' }}
            >
              legenda manuscrita debaixo da foto
            </p>
          </SpecCard>
        </div>
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * Aba 3: TEXTURAS
 * ============================================================================ */
function TexturesTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection title="Paper grain" description="Ruído SVG sutil sobre superfícies brancas.">
        <div className="paper-grain bg-surface-container-lowest border-outline-variant/40 h-32 rounded-md border" />
      </ShowcaseSection>

      <ShowcaseSection title="Wall surface" description="Parede de mural com hatching diagonal.">
        <div className="wall-surface border-outline-variant/40 h-32 rounded-md border" />
      </ShowcaseSection>

      <ShowcaseSection
        title="Notebook paper"
        description="Linhas horizontais a cada 40px (caderno pautado)."
      >
        <div className="notebook-paper bg-surface-container-lowest border-outline-variant/40 h-32 rounded-md border" />
      </ShowcaseSection>

      <ShowcaseSection
        title="Washi tape"
        description="Faixas semi-transparentes — sempre absolutas sobre cards."
      >
        <div className="grid grid-cols-2 gap-4">
          <SpecCard label="washi-tape-primary" meta="tan suave">
            <div className="bg-surface-container-lowest border-outline-variant/40 relative h-24 rounded-md border">
              <div className="washi-tape-primary absolute top-2 left-1/2 h-6 w-32 -translate-x-1/2 -rotate-2" />
            </div>
          </SpecCard>
          <SpecCard label="washi-tape-sage" meta="verde acinzentado">
            <div className="bg-surface-container-lowest border-outline-variant/40 relative h-24 rounded-md border">
              <div className="washi-tape-sage absolute top-2 left-1/2 h-6 w-32 -translate-x-1/2 -rotate-2" />
            </div>
          </SpecCard>
        </div>
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * Aba 4: SOMBRAS & SUPERFÍCIES
 * ============================================================================ */
function ShadowsTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection
        title="Sombras táteis"
        description="Duas variantes únicas — nunca shadow-md/lg/xl do Tailwind."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SpecCard label="shadow-tactile" meta="cards, badges, papel preso">
            <div className="bg-surface-container-lowest shadow-tactile h-24 rounded-md" />
          </SpecCard>
          <SpecCard label="shadow-polaroid" meta="fotos, peças com peso">
            <div className="bg-surface-container-lowest shadow-polaroid h-24 rounded-md" />
          </SpecCard>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Border radius"
        description="rounded-md (cards) e rounded-full (pílulas). Sem xl/2xl."
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-surface-container border-outline-variant/40 h-16 w-16 rounded-md border" />
          <span className="text-on-surface-variant font-sans text-xs">rounded-md (6px)</span>
          <div className="bg-surface-container border-outline-variant/40 h-16 w-16 rounded-full border" />
          <span className="text-on-surface-variant font-sans text-xs">rounded-full</span>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Deckle edge"
        description="Borda irregular de papel artesanal — uso raro, sparingly."
      >
        <div className="bg-surface-container-lowest deckle-edge shadow-polaroid mx-auto h-32 w-72" />
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * Aba 5: BOTÕES & INPUTS
 * ============================================================================ */
function ButtonsTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection
        title="Botões"
        description="Quatro variantes — sem componente shared, classes inline."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SpecCard label="Primário (CTA)">
            <button
              type="button"
              className="bg-primary text-on-primary hover:bg-primary-container font-sans rounded-full px-6 py-2.5 text-sm tracking-wide transition-colors"
            >
              salvar
            </button>
          </SpecCard>
          <SpecCard label="Outline neutro">
            <button
              type="button"
              className="border-outline-variant bg-surface-container-lowest text-on-surface hover:border-on-surface shadow-tactile font-sans inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-colors"
            >
              <NotebookPen size={14} strokeWidth={1.6} />
              nova escrita
            </button>
          </SpecCard>
          <SpecCard label="Ghost (texto)">
            <button
              type="button"
              className="text-on-surface-variant hover:text-on-surface font-sans text-sm tracking-wide transition-colors"
            >
              cancelar
            </button>
          </SpecCard>
          <SpecCard label="Ícone (toolbar/nav)">
            <div className="flex gap-2">
              {[Home, NotebookPen, Mail, Settings].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                >
                  <Icon size={18} strokeWidth={1.6} />
                </button>
              ))}
            </div>
          </SpecCard>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Inputs" description="Sem chrome — papel não tem moldura.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SpecCard label="Input text (com borda)">
            <input
              type="text"
              defaultValue=""
              placeholder="seu nome"
              className="border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary placeholder:text-on-surface-variant/40 font-sans w-full rounded border px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </SpecCard>
          <SpecCard label="Input transparente (editor)">
            <input
              type="text"
              defaultValue=""
              placeholder="Título da entrada..."
              className="editor-input text-on-surface placeholder:text-on-surface-variant/30 w-full border-none bg-transparent text-2xl font-medium tracking-tight outline-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            />
          </SpecCard>
        </div>
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * Aba 6: COMPONENTES
 * ============================================================================ */
function ComponentsTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection
        title="Polaroide"
        description="Foto com washi tape, sombra polaroide, leve rotação."
      >
        <div className="flex justify-center py-6">
          <article
            className="bg-surface-container-lowest shadow-polaroid relative inline-block w-48 px-3 pt-3 pb-12"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <div className="washi-tape-primary absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3" />
            <div
              className="aspect-[4/5] w-full overflow-hidden bg-black/5"
              style={{ filter: 'grayscale(0.08) sepia(0.08)' }}
            />
            <p
              className="text-on-surface mt-3 text-center text-xl"
              style={{ fontFamily: 'var(--font-writing)' }}
            >
              manhã quieta
            </p>
          </article>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Marca-texto" description="Gradiente vertical no miolo do texto.">
        <p
          className="text-on-surface text-xl leading-loose"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Um trecho com <mark>palavras destacadas</mark> e o resto vivendo em paz.
        </p>
      </ShowcaseSection>

      <ShowcaseSection title="Tag chips" description="Pílulas pequenas em sálvia.">
        <div className="flex flex-wrap gap-2">
          {['manhã', 'reflexão', 'cartas', 'jardim'].map((t) => (
            <span
              key={t}
              className="bg-secondary-container text-on-secondary-container font-sans rounded-full px-3 py-1 text-xs tracking-wide"
            >
              #{t}
            </span>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Card de listagem" description="Hover ergue borda + sombra.">
        <div className="border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 hover:shadow-tactile flex max-w-md flex-col gap-2 rounded-md border p-5 transition-all">
          <h4
            className="text-on-surface text-lg font-medium tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Manhã de outono
          </h4>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            O café esfriou enquanto eu escrevia sobre o silêncio entre as árvores.
          </p>
          <p
            className="text-on-surface-variant/70 mt-1 text-xs"
            style={{ fontFamily: 'var(--font-writing)' }}
          >
            12 abr · 2026
          </p>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Reactions (bloco social privado)"
        description="5 emoji-state, sem contagem."
      >
        <div className="flex justify-center gap-2">
          {[
            { emoji: '🤍', label: 'tocou' },
            { emoji: '🥲', label: 'emocionou' },
            { emoji: '✨', label: 'iluminou' },
            { emoji: '🙏', label: 'gratidão' },
            { emoji: '🌿', label: 'acalmou' },
          ].map((r) => (
            <button
              key={r.label}
              type="button"
              aria-label={r.label}
              title={r.label}
              className="border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl transition-all hover:scale-105"
              style={{ filter: 'grayscale(0.4) opacity(0.85)' }}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Toolbar do editor"
        description="B / I / marca-texto / foto / rabisco / tag."
      >
        <div className="border-outline-variant/40 bg-surface-container-low flex flex-wrap items-center gap-1 rounded-md border px-3 py-2">
          {[
            { Icon: Highlighter, label: 'Marca-texto' },
            { Icon: Camera, label: 'Foto' },
            { Icon: Pencil, label: 'Rabisco' },
            { Icon: TagIcon, label: 'Tag' },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-md transition-colors"
            >
              <Icon size={16} strokeWidth={1.6} />
            </button>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Empty state"
        description="Padrão DS — círculo + título serif + descrição + CTA."
      >
        <div className="flex flex-col items-center py-8 text-center">
          <div className="bg-surface-container mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <NotebookPen
              className="text-on-surface-variant/40"
              size={32}
              strokeWidth={1.4}
              aria-hidden
            />
          </div>
          <h3
            className="text-on-surface mb-1.5 text-xl font-medium"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Nenhuma escrita ainda
          </h3>
          <p className="text-on-surface-variant font-sans mb-4 max-w-[260px] text-sm leading-relaxed">
            Este caderno está esperando suas primeiras palavras.
          </p>
          <p
            className="text-on-surface-variant/50 mt-2 text-sm"
            style={{ fontFamily: 'var(--font-writing)' }}
          >
            tudo começa com a primeira linha
          </p>
        </div>
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * PAGE
 * ============================================================================ */

export default async function DesignPage() {
  const tabs = [
    { id: 'cores', label: 'Cores', content: <ColorsTab /> },
    { id: 'tipografia', label: 'Tipografia', content: <TypographyTab /> },
    { id: 'texturas', label: 'Texturas', content: <TexturesTab /> },
    { id: 'sombras', label: 'Sombras', content: <ShadowsTab /> },
    { id: 'botoes', label: 'Botões & Inputs', content: <ButtonsTab /> },
    { id: 'forms', label: 'Forms', content: <FormsTab /> },
    { id: 'navegacao', label: 'Navegação', content: <NavigationTab /> },
    { id: 'componentes', label: 'Componentes', content: <ComponentsTab /> },
    { id: 'elementos', label: 'Elementos', content: <ElementsTab /> },
    { id: 'feedback', label: 'Feedback', content: <FeedbackTab /> },
  ];

  return (
    <main className="min-h-screen px-4 pt-6 pb-16 sm:px-8 sm:pt-10">
      <Container as="div" className="!px-0">
        <Link
          href="/casa"
          className="text-on-surface-variant hover:text-on-surface font-sans mb-4 inline-flex items-center gap-1.5 text-sm no-underline transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={1.6} />
          casa
        </Link>

        <header className="mb-8">
          <h1
            className="text-on-surface text-3xl font-medium tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Sistema de Design
          </h1>
          <p className="text-on-surface-variant font-sans mt-2 text-sm italic">
            Os blocos vivos que compõem o santuário.
          </p>
        </header>

        <SettingsTabs tabs={tabs} defaultTab="cores" />
      </Container>
    </main>
  );
}
