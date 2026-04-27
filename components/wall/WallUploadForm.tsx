'use client';

import { ImagePlus } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';

import { uploadWallItem, type UploadResult } from '@/app/_actions/wall';

// image/* funciona melhor em mobile (iOS converte HEIC pra JPEG na hora do upload)
// validação real de mime acontece server-side em uploadWallItem.
const ACCEPT = 'image/*';

export function WallUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<UploadResult | null, FormData>(
    uploadWallItem,
    null,
  );

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI label após action; one-shot, não reativo
      setFileName(null);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-surface-container-lowest/70 border-outline-variant relative flex w-full flex-col px-3 pt-3 pb-12 backdrop-blur-sm"
      style={{
        boxShadow:
          'inset 0 0 0 2px transparent, 0 0 0 2px var(--color-outline-variant), 0 1px 3px rgba(0,0,0,0.04)',
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent 0 8px, rgba(208,196,187,0.25) 8px 9px)',
        transform: 'rotate(-1.5deg)',
      }}
    >
      {/* "Espaço aguardando foto" */}
      <label
        htmlFor="wall-upload-input"
        className="text-on-surface-variant hover:text-primary group flex aspect-[4/5] w-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-outline-variant transition-colors hover:border-primary"
      >
        <ImagePlus
          className="text-on-surface-variant/60 group-hover:text-primary transition-colors"
          size={36}
          strokeWidth={1.4}
        />
        <span className="font-sans px-3 text-center text-[11px] tracking-widest uppercase">
          {fileName ? 'imagem escolhida' : 'colar nova foto'}
        </span>
        {fileName ? (
          <span
            className="text-on-surface-variant/80 max-w-[90%] truncate px-2 text-center text-base italic"
            style={{ fontFamily: 'var(--font-writing)' }}
          >
            {fileName}
          </span>
        ) : null}
        <input
          id="wall-upload-input"
          type="file"
          name="image"
          accept={ACCEPT}
          required
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>

      <input
        type="text"
        name="caption"
        maxLength={200}
        placeholder="legenda (opcional)"
        className="border-outline-variant/50 bg-surface/60 text-on-surface placeholder:text-on-surface-variant/50 mt-3 w-full border-b px-1 py-1 text-center text-lg outline-none transition-colors focus:border-primary"
        style={{ fontFamily: 'var(--font-writing)' }}
      />

      {state?.ok === false ? (
        <p className="text-error font-sans mt-2 text-center text-[11px] italic">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-on-primary hover:bg-primary-container font-sans absolute bottom-2 left-1/2 -translate-x-1/2 rounded-sm px-5 py-1.5 text-[11px] tracking-widest uppercase transition-colors disabled:opacity-60"
      >
        {pending ? 'colando…' : 'colar'}
      </button>
    </form>
  );
}
