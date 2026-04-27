import {
  Bell,
  ChevronDown,
  ChevronRight,
  Heart,
  Mail,
  MoreHorizontal,
  Search,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';

import { ShowcaseSection, SpecCard } from '@/components/design/ShowcaseSection';

/* ============================================================================
 * NAVEGAÇÃO
 * ============================================================================ */
export function NavigationTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection title="Tabs" description="Já em uso em /configuracoes e /design.">
        <div className="border-outline-variant/40 -mx-4 flex gap-1 border-b px-4 sm:mx-0 sm:px-0">
          {['ativa', 'outra', 'mais uma'].map((label, i) => (
            <button
              key={label}
              type="button"
              className={`font-sans relative shrink-0 px-4 py-3 text-sm tracking-wide transition-colors ${
                i === 0 ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {label}
              <span
                aria-hidden
                className={`absolute right-0 -bottom-px left-0 h-0.5 transition-all ${
                  i === 0 ? 'bg-primary' : 'bg-transparent'
                }`}
              />
            </button>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Breadcrumb" description="Caminho hierárquico simples.">
        <nav
          aria-label="Breadcrumb"
          className="text-on-surface-variant font-sans flex items-center gap-1.5 text-sm"
        >
          <a href="#" className="hover:text-on-surface no-underline">
            casa
          </a>
          <ChevronRight size={12} aria-hidden />
          <a href="#" className="hover:text-on-surface no-underline">
            escritas
          </a>
          <ChevronRight size={12} aria-hidden />
          <span className="text-on-surface">manhã de outono</span>
        </nav>
      </ShowcaseSection>

      <ShowcaseSection
        title="Pagination"
        description="Navegação entre páginas longas (uso raro neste produto)."
      >
        <nav className="flex items-center gap-1" aria-label="Paginação">
          <button
            type="button"
            className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            aria-label="Anterior"
          >
            ‹
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`font-sans flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                n === 2
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {n}
            </button>
          ))}
          <span className="text-on-surface-variant/60 px-1 text-sm">…</span>
          <button
            type="button"
            className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-sans flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors"
          >
            12
          </button>
          <button
            type="button"
            className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            aria-label="Próxima"
          >
            ›
          </button>
        </nav>
      </ShowcaseSection>

      <ShowcaseSection title="Accordion" description="Conteúdo dobrável.">
        <div className="border-outline-variant/40 divide-outline-variant/40 max-w-md divide-y rounded-md border">
          <details className="group" open>
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3">
              <span className="text-on-surface font-sans text-sm font-medium">Privacidade</span>
              <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="text-on-surface-variant px-4 pb-4 text-sm leading-relaxed">
              Tudo é privado por padrão. Você decide o que sai do santuário.
            </div>
          </details>
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3">
              <span className="text-on-surface font-sans text-sm font-medium">Backup</span>
              <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="text-on-surface-variant px-4 pb-4 text-sm leading-relaxed">
              Backups diários no Supabase. Exportação manual disponível.
            </div>
          </details>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Sidebar (mockup)" description="Padrão com itens + ícones.">
        <aside className="border-outline-variant/40 bg-surface-container-low w-56 rounded-md border p-3">
          {[
            { label: 'casa', Icon: Mail, active: false },
            { label: 'escritas', Icon: Heart, active: true },
            { label: 'recados', Icon: Bell, active: false },
            { label: 'configurações', Icon: Settings, active: false },
          ].map(({ label, Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`font-sans flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-surface-container text-on-surface'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Icon size={15} strokeWidth={1.6} />
              {label}
            </button>
          ))}
        </aside>
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * FORMS (estado avançado de inputs)
 * ============================================================================ */
export function FormsTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection title="Search" description="Input com ícone de lupa.">
        <div className="border-outline-variant bg-surface-container-lowest focus-within:border-primary flex max-w-md items-center gap-2 rounded-full border px-4 py-2.5 transition-colors">
          <Search size={14} strokeWidth={1.6} className="text-on-surface-variant" />
          <input
            type="text"
            placeholder="buscar nas escritas..."
            className="text-on-surface placeholder:text-on-surface-variant/40 font-sans flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Toggle (switch)" description="Estado on/off com animação.">
        <div className="flex flex-col gap-3">
          <label className="flex max-w-sm items-center justify-between gap-4">
            <span className="text-on-surface font-sans text-sm">Tornar pública</span>
            <button
              type="button"
              role="switch"
              aria-checked="false"
              className="bg-surface-container-high relative h-6 w-10 rounded-full transition-colors"
            >
              <span className="bg-surface-container-lowest border-outline-variant absolute top-0.5 left-0.5 h-5 w-5 rounded-full border shadow transition-transform" />
            </button>
          </label>
          <label className="flex max-w-sm items-center justify-between gap-4">
            <span className="text-on-surface font-sans text-sm">Receber bilhetes</span>
            <button
              type="button"
              role="switch"
              aria-checked="true"
              className="bg-primary relative h-6 w-10 rounded-full transition-colors"
            >
              <span className="bg-on-primary absolute top-0.5 left-[18px] h-5 w-5 rounded-full shadow transition-transform" />
            </button>
          </label>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Dropdown" description="Select customizado com menu.">
        <div className="relative inline-block">
          <button
            type="button"
            className="border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary font-sans flex min-w-[200px] items-center justify-between gap-3 rounded border px-4 py-2.5 text-sm transition-colors"
          >
            <span>Newsreader</span>
            <ChevronDown size={14} className="text-on-surface-variant" />
          </button>
          <div className="border-outline-variant bg-surface-container-lowest shadow-tactile mt-2 w-full rounded-md border py-1">
            {[
              { label: 'Newsreader', active: true },
              { label: 'Lora', active: false },
              { label: 'EB Garamond', active: false },
              { label: 'Spectral', active: false },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                className={`font-sans block w-full px-4 py-2 text-left text-sm transition-colors ${
                  opt.active
                    ? 'bg-surface-container text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Date badge"
        description="Bloco compacto pra data — variantes editorial e manuscrita."
      >
        <div className="flex flex-wrap items-center gap-6">
          <SpecCard label="Bloco">
            <div className="border-outline-variant bg-surface-container-lowest flex h-20 w-20 flex-col items-center justify-center rounded border">
              <span className="text-on-surface-variant font-sans text-[10px] tracking-widest uppercase">
                abr
              </span>
              <span
                className="text-on-surface text-2xl leading-none font-bold"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                27
              </span>
              <span className="text-on-surface-variant/60 font-sans text-[9px] tracking-widest uppercase">
                seg
              </span>
            </div>
          </SpecCard>
          <SpecCard label="Inline">
            <span className="text-on-surface-variant font-sans flex items-center gap-2 text-sm">
              <span className="bg-primary inline-block h-2 w-2 rounded-full" aria-hidden />
              <span className="text-on-surface font-medium">27</span> abr · 2026
            </span>
          </SpecCard>
          <SpecCard label="Manuscrita">
            <span
              className="text-on-surface-variant text-base"
              style={{ fontFamily: 'var(--font-writing)' }}
            >
              segunda, 27 de abril
            </span>
          </SpecCard>
        </div>
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * FEEDBACK (skeletons, toasts, progress, dialog)
 * ============================================================================ */
export function FeedbackTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection
        title="Skeletons"
        description="Placeholders enquanto carrega — sem animação shimmer (anti-padrão)."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SpecCard label="Card de listagem">
            <div className="bg-surface-container-lowest border-outline-variant/40 flex flex-col gap-2 rounded-md border p-4">
              <div className="bg-surface-container-high h-4 w-2/3 rounded" />
              <div className="bg-surface-container-low h-3 w-full rounded" />
              <div className="bg-surface-container-low h-3 w-5/6 rounded" />
              <div className="mt-2 flex gap-2">
                <div className="bg-secondary-container/50 h-5 w-12 rounded-full" />
                <div className="bg-secondary-container/50 h-5 w-16 rounded-full" />
              </div>
            </div>
          </SpecCard>
          <SpecCard label="Polaroide">
            <div className="bg-surface-container-lowest shadow-polaroid relative inline-block px-3 pt-3 pb-10">
              <div className="bg-surface-container-high h-32 w-32" />
              <div className="bg-surface-container-low mx-auto mt-3 h-3 w-20 rounded" />
            </div>
          </SpecCard>
          <SpecCard label="Editor">
            <div className="flex flex-col gap-3">
              <div className="bg-surface-container-high h-7 w-2/3 rounded" />
              <div className="bg-surface-container-low h-3 w-1/3 rounded" />
              <div className="mt-2 flex flex-col gap-2">
                <div className="bg-surface-container-low h-3 w-full rounded" />
                <div className="bg-surface-container-low h-3 w-11/12 rounded" />
                <div className="bg-surface-container-low h-3 w-full rounded" />
                <div className="bg-surface-container-low h-3 w-5/6 rounded" />
              </div>
            </div>
          </SpecCard>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Toasts" description="Notificações efêmeras.">
        <div className="flex flex-col gap-3">
          {[
            {
              kind: 'default',
              title: 'salvou',
              body: 'sua escrita foi guardada no caderno.',
              accent: 'bg-surface-container border-outline-variant/40 text-on-surface',
            },
            {
              kind: 'success',
              title: 'enviado',
              body: 'o bilhete chegou.',
              accent: 'bg-secondary-container border-secondary text-on-secondary-container',
            },
            {
              kind: 'error',
              title: 'algo deu errado',
              body: 'tente de novo em instantes.',
              accent: 'bg-error-container border-error text-on-error-container',
            },
            {
              kind: 'info',
              title: 'modo escrita',
              body: 'enter cria um novo parágrafo.',
              accent: 'bg-tertiary-fixed border-tertiary text-on-tertiary-fixed',
            },
          ].map((t) => (
            <div
              key={t.kind}
              className={`flex max-w-md items-start gap-3 rounded-md border-l-4 px-4 py-3 ${t.accent}`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-medium">{t.title}</p>
                <p className="font-sans mt-0.5 text-xs opacity-80">{t.body}</p>
              </div>
              <button type="button" aria-label="fechar" className="opacity-50 hover:opacity-100">
                <X size={14} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Progress (barra)"
        description="Fina, sem porcentagem visível por padrão."
      >
        <div className="flex max-w-md flex-col gap-4">
          <div>
            <div className="text-on-surface-variant font-sans mb-1.5 flex justify-between text-xs">
              <span>upload da imagem</span>
              <span className="opacity-60">a caminho</span>
            </div>
            <div className="bg-surface-container-high h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-3/4 rounded-full transition-all" />
            </div>
          </div>
          <div>
            <div className="text-on-surface-variant font-sans mb-1.5 flex justify-between text-xs">
              <span>indexando</span>
              <span className="opacity-60">quase lá</span>
            </div>
            <div className="bg-surface-container-high h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-secondary h-full w-11/12 rounded-full" />
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Steps (etapas)"
        description="Marcação de progresso em fluxos guiados."
      >
        <ol className="text-on-surface-variant font-sans flex max-w-md items-center justify-between text-xs">
          {[
            { label: 'escrever', state: 'done' },
            { label: 'rever', state: 'done' },
            { label: 'publicar', state: 'current' },
            { label: 'compartilhar', state: 'todo' },
          ].map((s, i, arr) => (
            <li key={s.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                    s.state === 'done'
                      ? 'bg-primary text-on-primary'
                      : s.state === 'current'
                        ? 'border-primary text-primary border-2 bg-transparent'
                        : 'bg-surface-container-high text-on-surface-variant/60'
                  }`}
                >
                  {s.state === 'done' ? '✓' : i + 1}
                </span>
                <span className={s.state === 'current' ? 'text-on-surface font-medium' : ''}>
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 ? (
                <span
                  className={`mx-1 h-px flex-1 self-start mt-3 ${
                    s.state === 'done' ? 'bg-primary' : 'bg-outline-variant/40'
                  }`}
                />
              ) : null}
            </li>
          ))}
        </ol>
      </ShowcaseSection>

      <ShowcaseSection title="Dialog (modal)" description="Padrão de confirmação destrutiva.">
        <div className="border-outline-variant/40 bg-surface-container relative flex h-72 items-center justify-center overflow-hidden rounded-md border">
          {/* "tela" simulada */}
          <div className="bg-surface-container-low absolute inset-0 opacity-30" aria-hidden />
          {/* dialog */}
          <div className="bg-surface-container-lowest shadow-tactile relative w-80 rounded-lg p-6">
            <h3
              className="text-on-surface mb-2 text-lg font-medium"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Excluir esta escrita?
            </h3>
            <p className="text-on-surface-variant font-sans mb-5 text-sm">
              Não dá pra desfazer. Quer mesmo?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="text-on-surface-variant hover:text-on-surface font-sans rounded-full px-4 py-2 text-sm tracking-wide transition-colors"
              >
                cancelar
              </button>
              <button
                type="button"
                className="bg-error text-on-error hover:opacity-90 font-sans rounded-full px-4 py-2 text-sm tracking-wide transition-opacity"
              >
                apagar
              </button>
            </div>
          </div>
        </div>
      </ShowcaseSection>
    </div>
  );
}

/* ============================================================================
 * SUPERFÍCIES & ELEMENTOS
 * ============================================================================ */
export function ElementsTab() {
  return (
    <div className="flex flex-col gap-2">
      <ShowcaseSection title="Avatar" description="Circular, fallback inicial em serif.">
        <div className="flex flex-wrap items-end gap-4">
          {[
            { size: 'h-8 w-8 text-xs', label: 'sm' },
            { size: 'h-10 w-10 text-base', label: 'md' },
            { size: 'h-12 w-12 text-lg', label: 'lg' },
            { size: 'h-16 w-16 text-2xl', label: 'xl' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div
                className={`${s.size} bg-surface-container border-outline-variant/60 text-on-surface-variant flex items-center justify-center overflow-hidden rounded-full border font-medium`}
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                G
              </div>
              <span className="text-on-surface-variant/70 font-sans text-[10px]">{s.label}</span>
            </div>
          ))}
          <div className="ml-4 flex flex-col items-center gap-2">
            <div className="flex -space-x-2">
              {['G', 'L', 'M'].map((c, i) => (
                <div
                  key={i}
                  className="bg-surface-container border-surface-container-lowest text-on-surface-variant relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-base font-medium"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {c}
                </div>
              ))}
            </div>
            <span className="text-on-surface-variant/70 font-sans text-[10px]">stack</span>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Badges" description="Status pequenos com dot indicador.">
        <div className="flex flex-wrap items-center gap-3">
          {[
            {
              label: 'privado',
              dot: 'bg-on-surface-variant/50',
              wrap: 'bg-surface-container text-on-surface-variant',
            },
            {
              label: 'público',
              dot: 'bg-secondary',
              wrap: 'bg-secondary-container text-on-secondary-container',
            },
            {
              label: 'rascunho',
              dot: 'bg-tertiary',
              wrap: 'bg-tertiary-fixed text-on-tertiary-fixed',
            },
            { label: 'novo', dot: 'bg-primary', wrap: 'bg-primary-fixed text-on-primary-fixed' },
            { label: 'erro', dot: 'bg-error', wrap: 'bg-error-container text-on-error-container' },
          ].map((b) => (
            <span
              key={b.label}
              className={`font-sans inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] tracking-wider uppercase ${b.wrap}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${b.dot}`} aria-hidden />
              {b.label}
            </span>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Counts (sem número, só presença)"
        description="Coerente com anti-métricas: dot ao invés de badge numérico."
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-on-surface-variant hover:bg-surface-container relative flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            aria-label="recados (com novidade)"
          >
            <Mail size={18} strokeWidth={1.6} />
            <span
              className="border-surface absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 bg-primary"
              aria-hidden
            />
          </button>
          <span className="text-on-surface-variant/70 font-sans text-xs">
            dot indica presença, sem contagem
          </span>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Dividers" description="Variantes de separador horizontal.">
        <div className="flex flex-col gap-6">
          <SpecCard label="Sólido sutil">
            <div className="border-outline-variant/40 border-t" />
          </SpecCard>
          <SpecCard label="Pontilhado">
            <div className="border-outline-variant/60 border-t border-dotted" />
          </SpecCard>
          <SpecCard label="Centro com símbolo">
            <div className="flex items-center gap-3">
              <div className="bg-outline-variant/40 h-px flex-1" />
              <span
                className="text-on-surface-variant/60 text-base"
                style={{ fontFamily: 'var(--font-writing)' }}
              >
                ⁂
              </span>
              <div className="bg-outline-variant/40 h-px flex-1" />
            </div>
          </SpecCard>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Blockquote" description="Citação com barra lateral em sépia.">
        <blockquote className="border-tertiary-fixed-dim border-l-2 pl-5 italic">
          <p
            className="text-on-surface-variant text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Escrever é habitar o silêncio.
          </p>
          <footer className="text-on-surface-variant/70 font-sans mt-2 text-xs">— Geo</footer>
        </blockquote>
      </ShowcaseSection>

      <ShowcaseSection
        title="Marginalia"
        description="Notas laterais — comentários sobre o texto principal."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_1fr]">
          <aside className="text-on-surface-variant/70 lg:text-right">
            <p className="text-sm" style={{ fontFamily: 'var(--font-writing)' }}>
              o café esfriou enquanto eu escrevia
            </p>
            <p className="font-sans mt-1 text-[10px] tracking-widest uppercase">12 abr · manhã</p>
          </aside>
          <p
            className="text-on-surface text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Há manhãs em que o café esfria sem que eu perceba — e descubro depois, frio na xícara,
            que estive longe. Escrevia. Já não importa o café.
          </p>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Stamps & selos"
        description="Carimbos editoriais — uso decorativo raro."
      >
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="border-primary text-primary flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 opacity-80">
              <span
                className="text-2xl leading-none font-bold"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                27
              </span>
              <span className="font-sans text-[8px] tracking-widest uppercase">abril</span>
            </div>
            <span className="text-on-surface-variant/70 font-sans text-[10px]">selo de data</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="bg-primary text-on-primary flex h-16 w-16 items-center justify-center rounded-full opacity-90"
              style={{ fontFamily: 'var(--font-writing)' }}
            >
              <span className="text-2xl">G</span>
            </div>
            <span className="text-on-surface-variant/70 font-sans text-[10px]">selo inicial</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="border-tertiary text-tertiary border-2 px-4 py-1.5 opacity-80">
              <span className="font-sans text-[10px] font-bold tracking-widest uppercase">
                rascunho
              </span>
            </div>
            <span className="text-on-surface-variant/70 font-sans text-[10px]">
              stamp retangular
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="border-secondary text-secondary -rotate-12 border-2 px-3 py-1 opacity-80">
              <span className="font-sans text-[10px] font-bold tracking-widest uppercase">
                publicado
              </span>
            </div>
            <span className="text-on-surface-variant/70 font-sans text-[10px]">com rotação</span>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Spacing" description="Tokens organic além do Tailwind padrão.">
        <div className="flex flex-col gap-3">
          {[
            {
              name: '--spacing-margin-page',
              val: '2.5rem (40px)',
              use: 'margens de página desktop',
            },
            {
              name: '--spacing-gutter-organic',
              val: '1.5rem (24px)',
              use: 'gap entre elementos relacionados',
            },
            {
              name: '--spacing-overlap-negative',
              val: '-1.25rem',
              use: 'sobreposição (washi sobre polaroide)',
            },
          ].map((t) => (
            <div
              key={t.name}
              className="border-outline-variant/40 bg-surface-container-lowest flex items-center justify-between gap-4 rounded-md border px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <code className="text-on-surface font-sans text-xs font-medium">{t.name}</code>
                <p className="text-on-surface-variant/70 font-sans mt-0.5 text-[11px]">{t.use}</p>
              </div>
              <span className="text-on-surface-variant font-sans text-xs">{t.val}</span>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Mais ícones (lucide thin)"
        description="Coerência de stroke ~1.6 em todo o produto."
      >
        <div className="flex flex-wrap gap-3">
          {([Mail, Bell, Search, Settings, Heart, MoreHorizontal] as LucideIcon[]).map(
            (Icon, i) => (
              <button
                key={i}
                type="button"
                className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              >
                <Icon size={18} strokeWidth={1.6} />
              </button>
            ),
          )}
        </div>
      </ShowcaseSection>
    </div>
  );
}
