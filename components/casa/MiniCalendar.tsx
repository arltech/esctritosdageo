import Link from 'next/link';

const MONTHS_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

const WEEKDAYS_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;

interface MiniCalendarProps {
  /** Datas (YYYY-MM-DD) que possuem conteúdo — recebem ponto sépia */
  daysWithContent: ReadonlySet<string>;
  /** Data atualmente selecionada (filtro ativo), se houver */
  selectedDate?: string | null;
  /** Ano e mês a renderizar (default: hoje) */
  year?: number;
  month?: number;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * Mini-calendário do mês — sem heatmap, sem números de contagem.
 * Cada dia com conteúdo recebe um ponto sépia 4px abaixo do número.
 * Click no dia filtra o feed via `?date=YYYY-MM-DD`.
 *
 * Honra ANTI-MÉTRICAS do PRD: zero streak, zero contagem, dia vazio
 * é igual aos outros (nada vermelho/cinza acusatório).
 */
export function MiniCalendar({
  daysWithContent,
  selectedDate,
  year: yearProp,
  month: monthProp,
}: MiniCalendarProps) {
  const today = new Date();
  const year = yearProp ?? today.getFullYear();
  const month = monthProp ?? today.getMonth();
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = dom
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Constrói grid de células: nulls pra padding até primeiro dia do mês
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let d = 1; d <= totalDays; d += 1) cells.push(d);

  return (
    <div className="bg-surface-container-lowest shadow-tactile rounded-md px-5 py-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h3 className="text-on-surface text-xl" style={{ fontFamily: 'var(--font-writing)' }}>
          {MONTHS_PT[month]}
        </h3>
        <span className="text-on-surface-variant font-sans text-xs tracking-widest opacity-70">
          {year}
        </span>
      </header>

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAYS_PT.map((wd, i) => (
          <span
            key={`wd-${i}`}
            className="text-on-surface-variant font-sans pb-2 text-center text-[10px] tracking-widest opacity-60"
          >
            {wd}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) {
            return <span key={`empty-${i}`} aria-hidden />;
          }
          const key = `${year}-${pad(month + 1)}-${pad(day)}`;
          const hasContent = daysWithContent.has(key);
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;

          return (
            <Link
              key={key}
              href={isSelected ? '/casa' : `/casa?date=${key}`}
              aria-label={
                hasContent
                  ? `${day} de ${MONTHS_PT[month]} — tem conteúdo`
                  : `${day} de ${MONTHS_PT[month]}`
              }
              className={`relative mx-auto flex h-8 w-8 flex-col items-center justify-center rounded-full text-sm transition-colors ${
                isSelected
                  ? 'bg-primary text-on-primary'
                  : isToday
                    ? 'border-primary border text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="leading-none">{day}</span>
              {hasContent && !isSelected ? (
                <span className="bg-tertiary mt-0.5 h-1 w-1 rounded-full" aria-hidden />
              ) : null}
            </Link>
          );
        })}
      </div>

      {selectedDate ? (
        <Link
          href="/casa"
          className="text-on-surface-variant hover:text-primary font-sans mt-4 block text-center text-[11px] tracking-widest uppercase no-underline transition-colors"
        >
          ver tudo
        </Link>
      ) : null}
    </div>
  );
}
