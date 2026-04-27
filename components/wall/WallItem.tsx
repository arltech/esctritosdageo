import { WallItemControls } from '@/components/wall/WallItemControls';
import type { WallItemWithUrl } from '@/lib/types';

interface WallItemProps {
  item: WallItemWithUrl;
  index: number;
  showStatusToggle?: boolean;
}

const WASHI_VARIANTS = [
  { classes: 'washi-tape-primary -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3' },
  { classes: 'washi-tape-sage -top-2 -left-2 h-5 w-20 -rotate-12' },
  { classes: 'washi-tape-primary -top-2 -right-2 h-5 w-20 rotate-12' },
  { classes: 'washi-tape-sage -top-3 left-1/3 h-5 w-28 rotate-2' },
  { classes: 'washi-tape-primary -top-3 left-4 h-5 w-16 -rotate-6' },
] as const;

/**
 * Polaroide do mural — moldura cream com base larga, fita sempre presente,
 * sépia leve, sombra real, hover sutil simulando peso.
 *
 * Quando `showStatusToggle` (apenas em /casa, pra dona), exibe
 * <WallItemControls /> com toggle público/privado e delete.
 */
export function WallItem({ item, index, showStatusToggle = false }: WallItemProps) {
  const washi = WASHI_VARIANTS[index % WASHI_VARIANTS.length]!;

  return (
    <article
      className="bg-surface-container-lowest shadow-polaroid relative inline-block w-full px-3 pt-3 pb-12 transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-[1deg]"
      style={{ transform: `rotate(${item.tilt_deg}deg)` }}
    >
      <div className={`absolute z-10 ${washi.classes}`} aria-hidden />

      {showStatusToggle ? (
        <WallItemControls
          id={item.id}
          imagePath={item.image_path}
          status={item.status}
          onHome={item.on_home}
          caption={item.caption}
        />
      ) : null}

      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element -- signed URL do Supabase Storage; remotePatterns serão configurados em Story posterior */}
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
  );
}
