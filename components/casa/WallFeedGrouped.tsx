import { WallItem } from '@/components/wall/WallItem';
import { WallUploadForm } from '@/components/wall/WallUploadForm';
import type { WallItemWithUrl } from '@/lib/types';

const MONTHS_FULL_PT = [
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

interface WallFeedGroupedProps {
  items: WallItemWithUrl[];
  /** Quando filtrado por data, esconde o upload (ela não está adicionando — está navegando) */
  isFiltered?: boolean;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function formatDayLabel(key: string, today: Date): string {
  const todayKey = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (key === todayKey) return 'hoje';
  if (key === yesterdayKey) return 'ontem';

  const parts = key.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const monthName = MONTHS_FULL_PT[month];

  if (year === today.getFullYear()) {
    return `${day} de ${monthName}`;
  }
  return `${day} de ${monthName} de ${year}`;
}

/**
 * Feed do mural agrupado por dia. Cada grupo tem um divisor tipográfico
 * em manuscrito ("hoje", "ontem", "23 de abril"). Polaroides do dia em
 * masonry. NÃO mostra contagem por dia — anti-métrica.
 *
 * Quando `isFiltered`, o upload some (modo navegação, não modo escrita).
 */
export function WallFeedGrouped({ items, isFiltered = false }: WallFeedGroupedProps) {
  const today = new Date();

  // Agrupa preservando ordem dos itens (já vem desc por created_at)
  const groups = new Map<string, WallItemWithUrl[]>();
  for (const item of items) {
    const key = dayKey(item.created_at);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  const groupedKeys = Array.from(groups.keys());

  return (
    <div className="space-y-12">
      {!isFiltered ? (
        <div className="columns-1 gap-x-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          <div className="mb-6 break-inside-avoid">
            <WallUploadForm />
          </div>
        </div>
      ) : null}

      {groupedKeys.length === 0 ? (
        <p
          className="text-on-surface-variant/80 mt-10 text-center text-2xl italic"
          style={{ fontFamily: 'var(--font-writing)' }}
        >
          {isFiltered ? 'Nada deste dia.' : 'A parede ainda nua. Cole sua primeira lembrança.'}
        </p>
      ) : null}

      {groupedKeys.map((key) => {
        const dayItems = groups.get(key)!;
        return (
          <section key={key} aria-labelledby={`day-${key}`}>
            <header className="mb-6 flex items-baseline gap-3">
              <h3
                id={`day-${key}`}
                className="text-on-surface text-3xl"
                style={{ fontFamily: 'var(--font-writing)', fontWeight: 700 }}
              >
                {formatDayLabel(key, today)}
              </h3>
              <span className="bg-outline-variant/50 h-px flex-1" aria-hidden />
            </header>

            <div className="columns-1 gap-x-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
              {dayItems.map((item, idx) => (
                <div key={item.id} className="mb-8 break-inside-avoid">
                  <WallItem item={item} index={idx} showStatusToggle />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
