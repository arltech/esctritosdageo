'use client';

import { Globe, Home, Lock, Trash2 } from 'lucide-react';

import { deleteWallItem, toggleOnHomeWallItem, togglePublicWallItem } from '@/app/_actions/wall';
import type { WallItemStatus } from '@/lib/types';

interface WallItemControlsProps {
  id: string;
  imagePath: string;
  status: WallItemStatus;
  onHome: boolean;
  caption?: string | null;
}

export function WallItemControls({
  id,
  imagePath,
  status,
  onHome,
  caption,
}: WallItemControlsProps) {
  const isPublic = status === 'public';

  function handleDeleteSubmit(e: React.FormEvent<HTMLFormElement>) {
    const what = caption ? `"${caption}"` : 'esta foto';
    if (!confirm(`Apagar ${what}? Não dá pra desfazer.`)) {
      e.preventDefault();
    }
  }

  return (
    <div className="absolute top-2 right-2 z-20 flex gap-1.5">
      {/* Toggle público — visível em galerias públicas */}
      <form action={togglePublicWallItem}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          aria-label={isPublic ? 'Tornar privada' : 'Tornar pública'}
          title={isPublic ? 'Pública — clique pra esconder' : 'Privada — clique pra publicar'}
          className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
            isPublic
              ? 'bg-secondary-container/90 text-on-secondary-container hover:bg-secondary-container'
              : 'bg-surface-container-lowest/80 text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary'
          }`}
        >
          {isPublic ? <Globe size={13} strokeWidth={1.8} /> : <Lock size={13} strokeWidth={1.8} />}
        </button>
      </form>

      {/* Toggle em destaque na home — independente de público */}
      <form action={toggleOnHomeWallItem}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          aria-label={onHome ? 'Tirar da home' : 'Colocar em destaque na home'}
          title={onHome ? 'Em destaque na home — clique pra tirar' : 'Colocar em destaque na home'}
          className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
            onHome
              ? 'bg-tertiary-fixed-dim/90 text-on-tertiary-fixed hover:bg-tertiary-fixed-dim'
              : 'bg-surface-container-lowest/80 text-on-surface-variant hover:bg-surface-container-lowest hover:text-tertiary'
          }`}
        >
          <Home size={13} strokeWidth={1.8} fill={onHome ? 'currentColor' : 'none'} />
        </button>
      </form>

      <form action={deleteWallItem} onSubmit={handleDeleteSubmit}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="image_path" value={imagePath} />
        <button
          type="submit"
          aria-label="Apagar foto"
          title="Apagar foto"
          className="bg-surface-container-lowest/80 text-on-surface-variant hover:bg-error-container hover:text-on-error-container flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all"
        >
          <Trash2 size={13} strokeWidth={1.8} />
        </button>
      </form>
    </div>
  );
}
