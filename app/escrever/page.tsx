import type { Metadata } from 'next';

import { Editor } from '@/components/editor/Editor';
import { getMyText } from '@/lib/db/texts';

export const metadata: Metadata = {
  title: 'Escrever — Escritos da Geo',
  robots: { index: false, follow: false },
};

const MONTHS_SHORT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

interface EscreverPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EscreverPage({ searchParams }: EscreverPageProps) {
  const sp = await searchParams;
  const editing = sp.id ? await getMyText(sp.id) : null;

  const date = editing ? new Date(editing.created_at) : new Date();
  const dateLabel = `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} · ${date.getFullYear()}`;

  return (
    <main className="bg-background min-h-[100svh]">
      <Editor
        editingId={editing?.id}
        initialTitle={editing?.title}
        initialBodyHtml={editing?.body_html}
        initialTags={editing?.tags ?? []}
        dateLabel={dateLabel}
      />
    </main>
  );
}
