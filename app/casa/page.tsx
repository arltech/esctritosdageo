import { BookOpen, Home, Mail, NotebookPen, Palette, Settings, User } from 'lucide-react';
import Link from 'next/link';

import { MarginaliaCard } from '@/components/casa/MarginaliaCard';
import { MiniCalendar } from '@/components/casa/MiniCalendar';
import { WallFeedGrouped } from '@/components/casa/WallFeedGrouped';
import { WritePrompt } from '@/components/casa/WritePrompt';
import { Container } from '@/components/layout/Container';
import { getAvatarUrl, getMyProfile } from '@/lib/db/profile';
import { getDaysWithWallItems, listMyWallItems } from '@/lib/db/wall';
import { createServerSupabaseClient } from '@/lib/supabase/server';

import { signOut } from '../actions';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

interface CasaPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function CasaPage({ searchParams }: CasaPageProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const sp = await searchParams;
  const dateFilter = sp.date && DATE_REGEX.test(sp.date) ? sp.date : null;

  const today = new Date();
  const calendarYear = today.getFullYear();
  const calendarMonth = today.getMonth();

  const [items, profile, daysWithContent] = await Promise.all([
    listMyWallItems(dateFilter ?? undefined),
    getMyProfile(),
    getDaysWithWallItems(calendarYear, calendarMonth),
  ]);
  const avatarUrl = getAvatarUrl(
    profile?.avatar_path ?? null,
    profile?.updated_at ? new Date(profile.updated_at).getTime().toString() : undefined,
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* ---------- Top bar (encolhida — sem branding redundante) ---------- */}
      <header className="border-outline-variant/40 bg-background/85 sticky top-0 z-30 border-b backdrop-blur">
        <Container>
          <nav aria-label="Navegação principal" className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <Link
                href="/casa"
                aria-label="Casa"
                title="Casa"
                className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center no-underline transition-colors"
              >
                <Home size={18} strokeWidth={1.6} />
              </Link>
              <Link
                href="/escrever"
                aria-label="Escrever"
                title="Escrever"
                className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center no-underline transition-colors"
              >
                <NotebookPen size={18} strokeWidth={1.6} />
              </Link>
              <Link
                href="/escritas"
                aria-label="Escritas"
                title="Escritas"
                className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center no-underline transition-colors"
              >
                <BookOpen size={18} strokeWidth={1.6} />
              </Link>
              <Link
                href="/recados"
                aria-label="Recados"
                title="Recados"
                className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center no-underline transition-colors"
              >
                <Mail size={18} strokeWidth={1.6} />
              </Link>
              <Link
                href="/design"
                aria-label="Sistema de Design"
                title="Sistema de Design"
                className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center no-underline transition-colors"
              >
                <Palette size={18} strokeWidth={1.6} />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/configuracoes"
                aria-label="Configurações"
                title="Configurações"
                className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center transition-colors"
              >
                <Settings size={17} strokeWidth={1.6} />
              </Link>
              <Link
                href="/configuracoes"
                aria-label={profile?.display_name ?? 'Perfil'}
                title={profile?.display_name ?? 'Perfil'}
                className="bg-surface-container border-outline-variant/60 hover:border-primary flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-colors"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avatar do bucket público
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="text-on-surface-variant/70" size={16} strokeWidth={1.6} />
                )}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-on-surface-variant hover:text-on-surface font-sans text-sm tracking-wide transition-colors"
                  aria-label="Sair"
                >
                  sair
                </button>
              </form>
            </div>
          </nav>
        </Container>
      </header>

      {/* ---------- Mesa de escritório: feed + sidebar ---------- */}
      <main className="wall-surface flex-1 px-4 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          {/* Feed (esquerda) */}
          <section aria-label="Feed de momentos">
            <WallFeedGrouped items={items} isFiltered={Boolean(dateFilter)} />
          </section>

          {/* Sidebar (direita) — vira topo em mobile via lg:order */}
          <aside
            aria-label="Painel lateral"
            className="space-y-6 lg:order-last lg:sticky lg:top-20 lg:self-start"
          >
            <WritePrompt />
            <MiniCalendar
              daysWithContent={daysWithContent}
              selectedDate={dateFilter}
              year={calendarYear}
              month={calendarMonth}
            />
            <MarginaliaCard />
          </aside>
        </div>
      </main>
    </div>
  );
}
