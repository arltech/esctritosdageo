interface ShowcaseSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Wrapper visual pra agrupar exemplos do design system.
 * Título + descrição opcional + slot de demos.
 */
export function ShowcaseSection({ title, description, children }: ShowcaseSectionProps) {
  return (
    <section className="border-outline-variant/40 border-b py-8 last:border-b-0">
      <header className="mb-6">
        <h3
          className="text-on-surface text-lg font-medium tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </h3>
        {description ? (
          <p className="text-on-surface-variant font-sans mt-1 text-sm italic">{description}</p>
        ) : null}
      </header>
      <div>{children}</div>
    </section>
  );
}

interface SwatchProps {
  label: string;
  hint?: string;
  className?: string;
  color?: string;
}

/**
 * Quadrado de cor com label + hex/dica embaixo.
 */
export function Swatch({ label, hint, className, color }: SwatchProps) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div
        className={`border-outline-variant/30 h-16 w-full rounded-md border ${className ?? ''}`}
        style={color ? { backgroundColor: color } : undefined}
        aria-hidden
      />
      <div className="flex w-full flex-col gap-0.5">
        <span className="text-on-surface font-sans text-xs font-medium">{label}</span>
        {hint ? (
          <span className="text-on-surface-variant/70 font-sans text-[10px]">{hint}</span>
        ) : null}
      </div>
    </div>
  );
}

interface SpecCardProps {
  label: string;
  children: React.ReactNode;
  meta?: string;
}

/**
 * Card claro pra envolver um exemplo de componente.
 */
export function SpecCard({ label, children, meta }: SpecCardProps) {
  return (
    <div className="border-outline-variant/40 bg-surface-container-lowest flex flex-col gap-3 rounded-md border p-5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-on-surface-variant font-sans text-xs tracking-widest uppercase">
          {label}
        </span>
        {meta ? (
          <span className="text-on-surface-variant/60 font-sans text-[10px]">{meta}</span>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}
