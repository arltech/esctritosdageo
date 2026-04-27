import { Feather, Flower2 } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { getAvatarUrl, getWriterProfile } from '@/lib/db/profile';
import { listOnHomeWallItems, listPublicWallItems } from '@/lib/db/wall';
import type { WallItemWithUrl } from '@/lib/types';

const FLOATING_SLOTS = 3;
const MAX_PUBLIC_ON_LANDING = 12;

// Slots fixos das 3 polaroides flutuantes ao redor do hero. Se a Geo tem
// itens marcados em destaque (on_home), eles preenchem esses slots primeiro;
// o restante cai pro fallback Unsplash — placeholder estético atemporal.
const SLOT_STYLES = [
  {
    position: '-left-4 top-6 md:left-[6%] md:top-[14%]',
    rotation: -4,
    washi: 'washi-tape-sage' as const,
    width: 'w-24 sm:w-32 md:w-44',
  },
  {
    position: '-right-3 top-24 hidden sm:block lg:right-[7%] lg:top-[20%]',
    rotation: 5,
    washi: 'washi-tape-primary' as const,
    width: 'w-28 lg:w-44',
  },
  {
    position: '-right-4 bottom-8 md:right-[14%] md:bottom-[12%]',
    rotation: -3,
    washi: 'washi-tape-sage' as const,
    width: 'w-24 sm:w-32 md:w-40',
  },
] as const;

const FALLBACK_DECOR = [
  {
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop',
    alt: 'Caderno aberto sobre uma mesa quieta',
    caption: 'manhãs lentas',
  },
  {
    src: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=600&auto=format&fit=crop',
    alt: 'Xícara de café e luz da janela',
    caption: 'café & silêncio',
  },
  {
    src: 'https://images.unsplash.com/photo-1454944338482-a69bb95894af?q=80&w=600&auto=format&fit=crop',
    alt: 'Folhas secas pressionadas',
    caption: 'memórias prensadas',
  },
] as const;

interface FloatingPolaroide {
  src: string;
  alt: string;
  caption: string;
  isReal: boolean; // true = foto real da Geo; false = fallback Unsplash
}

function buildFloating(onHomeItems: WallItemWithUrl[]): FloatingPolaroide[] {
  const real: FloatingPolaroide[] = onHomeItems.slice(0, FLOATING_SLOTS).map((it) => ({
    src: it.signed_url,
    alt: it.caption ?? 'Foto em destaque',
    caption: it.caption ?? '',
    isReal: true,
  }));

  if (real.length === FLOATING_SLOTS) return real;

  // Completa com Unsplash até ter 3
  const filler = FALLBACK_DECOR.slice(0, FLOATING_SLOTS - real.length).map((d) => ({
    src: d.src,
    alt: d.alt,
    caption: d.caption,
    isReal: false,
  }));

  return [...real, ...filler];
}

export default async function LandingPage() {
  const [onHomeItems, allPublic, profile] = await Promise.all([
    listOnHomeWallItems(FLOATING_SLOTS),
    listPublicWallItems(MAX_PUBLIC_ON_LANDING + FLOATING_SLOTS),
    getWriterProfile(),
  ]);

  const avatarUrl = getAvatarUrl(profile?.avatar_path ?? null);
  const writerName = profile?.display_name ?? 'Geovana';

  const floating = buildFloating(onHomeItems);

  // Galeria geral: itens públicos que NÃO estão flutuando (evita duplicação).
  const featuredIds = new Set(onHomeItems.map((i) => i.id));
  const publicGallery = allPublic
    .filter((i) => !featuredIds.has(i.id))
    .slice(0, MAX_PUBLIC_ON_LANDING);

  const hasGallery = publicGallery.length > 0;

  return (
    <main className="relative">
      {/* ---------- Profile badge (canto inferior esquerdo) ---------- */}
      <div className="fixed bottom-4 left-4 z-30 flex items-center gap-2.5 sm:bottom-6 sm:left-6 sm:gap-3">
        <div className="border-outline-variant/60 bg-surface-container-lowest relative h-10 w-10 overflow-hidden rounded-full border shadow-sm sm:h-12 sm:w-12">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar de bucket público Supabase
            <img
              src={avatarUrl}
              alt={writerName}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div
              className="text-on-surface-variant flex h-full w-full items-center justify-center text-base font-medium sm:text-lg"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {writerName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span
          className="text-on-surface text-base sm:text-lg"
          style={{ fontFamily: 'var(--font-writing)', fontWeight: 600 }}
        >
          {writerName}
        </span>
      </div>

      {/* ---------- Hero section (tela cheia, conteúdo centralizado) ---------- */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4">
        {/* Decorative background icons */}
        <Flower2
          className="text-tertiary pointer-events-none absolute top-[14%] left-[5%] rotate-12 opacity-10 sm:top-[18%]"
          size={100}
          strokeWidth={1.2}
          aria-hidden
        />
        <Feather
          className="text-secondary pointer-events-none absolute right-[5%] bottom-[14%] -rotate-12 opacity-15 sm:bottom-auto sm:top-[40%]"
          size={110}
          strokeWidth={1.2}
          aria-hidden
        />

        {/* 3 polaroides flutuantes */}
        {floating.map((p, idx) => {
          const slot = SLOT_STYLES[idx]!;
          return (
            <article
              key={`${p.src}-${idx}`}
              className={`shadow-polaroid bg-surface-container-lowest absolute z-10 px-2 pt-2 pb-8 ${slot.position} ${slot.width}`}
              style={{ transform: `rotate(${slot.rotation}deg)` }}
            >
              <div
                className={`absolute -top-2 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-3 ${slot.washi}`}
                aria-hidden
              />
              <div className="aspect-[4/5] w-full overflow-hidden bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element -- mistura Unsplash + signed URLs Supabase */}
                <img
                  src={p.src}
                  alt={p.alt}
                  className="photo-tone h-full w-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
              {p.caption ? (
                <p
                  className="text-on-surface-variant mt-2 text-center text-sm sm:text-base"
                  style={{ fontFamily: 'var(--font-writing)' }}
                >
                  {p.caption}
                </p>
              ) : null}
            </article>
          );
        })}

        {/* Hero content centralizado */}
        <Container as="div" className="relative z-20 text-center">
          <div className="relative inline-block px-4 py-2">
            {/* fita washi atravessando o título como marca-texto */}
            <div
              className="washi-tape-primary absolute inset-x-0 top-1/2 -z-10 h-[58%] -translate-y-1/2 -rotate-1"
              aria-hidden
            />
            <h1
              className="text-on-surface relative text-4xl tracking-tight sm:text-6xl lg:text-7xl"
              style={{ fontFamily: 'var(--font-writing)', fontWeight: 700 }}
            >
              Escritos da Geo
            </h1>
          </div>

          <p className="text-on-surface-variant mt-5 text-base italic sm:mt-6 sm:text-lg lg:text-xl">
            Um santuário para suas palavras.
          </p>

          <p className="text-on-surface-variant/80 font-sans mt-2 text-xs tracking-wider uppercase sm:text-sm">
            privado por padrão · público por escolha
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
            <Link
              href="/leituras"
              className="border-outline-variant bg-surface-container-lowest text-on-surface hover:border-on-surface hover:bg-surface-container font-sans inline-block rounded-full border px-8 py-3 text-sm tracking-widest uppercase no-underline shadow-sm transition-colors"
            >
              ler escritas
            </Link>
            <Link
              href="/entrar"
              className="text-on-surface-variant hover:text-on-surface font-sans text-xs tracking-wider uppercase no-underline transition-colors"
            >
              entrar
            </Link>
          </div>
        </Container>
      </section>

      {/* ---------- Recortes públicos (galeria geral) ---------- */}
      {hasGallery ? (
        <section
          aria-labelledby="gallery-heading"
          className="wall-surface relative px-4 py-16 sm:px-8 lg:py-20"
        >
          <h2
            id="gallery-heading"
            className="text-on-surface mb-10 text-center text-2xl tracking-wider sm:text-3xl"
            style={{ fontFamily: 'var(--font-writing)', fontWeight: 700 }}
          >
            recortes públicos
          </h2>
          <div className="mx-auto max-w-6xl columns-1 gap-x-6 [column-fill:_balance] sm:columns-2 lg:columns-3">
            {publicGallery.map((item) => (
              <div key={item.id} className="mb-8 break-inside-avoid">
                <article
                  className="bg-surface-container-lowest shadow-polaroid relative inline-block w-full px-3 pt-3 pb-12"
                  style={{ transform: `rotate(${item.tilt_deg}deg)` }}
                >
                  <div
                    className="washi-tape-primary absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3"
                    aria-hidden
                  />
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- signed URL Supabase Storage */}
                    <img
                      src={item.signed_url}
                      alt={item.caption ?? 'Imagem do mural'}
                      className="photo-tone absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {item.caption ? (
                    <p
                      className="text-on-surface mt-3 px-2 text-center text-xl leading-snug"
                      style={{ fontFamily: 'var(--font-writing)' }}
                    >
                      {item.caption}
                    </p>
                  ) : null}
                </article>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
