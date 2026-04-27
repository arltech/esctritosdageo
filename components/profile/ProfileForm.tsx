'use client';

import { Camera, User } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';

import { updateProfile, type UpdateProfileResult } from '@/app/_actions/profile';
import type { Profile } from '@/lib/types';

// image/* funciona melhor em mobile — validação real é server-side em updateProfile.
const ACCEPT = 'image/*';

interface ProfileFormProps {
  profile: Profile;
  avatarUrl: string | null;
}

export function ProfileForm({ profile, avatarUrl }: ProfileFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const [state, formAction, pending] = useActionState<UpdateProfileResult | null, FormData>(
    updateProfile,
    null,
  );

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ressincroniza preview com o avatar persistido após sucesso
      setPreviewUrl(avatarUrl);
    }
  }, [state, avatarUrl]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
      {/* ---------- Avatar ---------- */}
      <div className="flex items-center gap-6">
        <div className="bg-surface-container relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- public bucket avatar
            <img src={previewUrl} alt="Avatar" className="photo-tone h-full w-full object-cover" />
          ) : (
            <User className="text-on-surface-variant/60" size={36} strokeWidth={1.4} />
          )}
        </div>

        <label
          htmlFor="profile-avatar-input"
          className="border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary font-sans inline-flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2 text-xs tracking-widest uppercase transition-colors"
        >
          <Camera size={14} strokeWidth={1.6} />
          {previewUrl ? 'trocar foto' : 'adicionar foto'}
          <input
            id="profile-avatar-input"
            type="file"
            name="avatar"
            accept={ACCEPT}
            onChange={handleAvatarChange}
            className="sr-only"
          />
        </label>
      </div>

      {/* ---------- Nome ---------- */}
      <label className="block">
        <span className="text-on-surface-variant font-sans text-xs tracking-widest uppercase">
          Nome
        </span>
        <input
          type="text"
          name="display_name"
          defaultValue={profile.display_name}
          required
          maxLength={80}
          className="border-outline-variant/60 bg-surface text-on-surface focus:border-primary mt-2 w-full rounded-sm border px-4 py-3 text-lg outline-none transition-colors"
        />
      </label>

      {/* ---------- Tagline ---------- */}
      <label className="block">
        <span className="text-on-surface-variant font-sans text-xs tracking-widest uppercase">
          Frase
        </span>
        <input
          type="text"
          name="tagline"
          defaultValue={profile.tagline ?? ''}
          maxLength={80}
          placeholder="uma frase que te define"
          className="border-outline-variant/60 bg-surface text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary mt-2 w-full rounded-sm border px-4 py-3 text-lg italic outline-none transition-colors"
        />
        <span className="text-on-surface-variant/60 font-sans mt-1 block text-xs">
          até 80 caracteres
        </span>
      </label>

      {/* ---------- Localização ---------- */}
      <label className="block">
        <span className="text-on-surface-variant font-sans text-xs tracking-widest uppercase">
          Onde
        </span>
        <input
          type="text"
          name="location"
          defaultValue={profile.location ?? ''}
          maxLength={80}
          placeholder="cidade, país"
          className="border-outline-variant/60 bg-surface text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary mt-2 w-full rounded-sm border px-4 py-3 text-lg outline-none transition-colors"
        />
      </label>

      {/* ---------- Bio ---------- */}
      <label className="block">
        <span className="text-on-surface-variant font-sans text-xs tracking-widest uppercase">
          Sobre você
        </span>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ''}
          maxLength={500}
          rows={5}
          placeholder="o que te move, o que você escreve, o que quer dizer ao mundo"
          className="border-outline-variant/60 bg-surface text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary mt-2 w-full resize-none rounded-sm border px-4 py-3 text-lg leading-relaxed outline-none transition-colors"
        />
        <span className="text-on-surface-variant/60 font-sans mt-1 block text-xs">
          até 500 caracteres
        </span>
      </label>

      {/* ---------- Feedback + submit ---------- */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <div aria-live="polite" className="font-sans text-sm">
          {state?.ok === true ? (
            <span className="text-secondary italic">Salvo.</span>
          ) : state?.ok === false ? (
            <span className="text-error italic">{state.error}</span>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-on-primary hover:bg-primary-container font-sans rounded-sm px-8 py-3 text-sm tracking-widest uppercase transition-colors disabled:opacity-60"
        >
          {pending ? 'salvando…' : 'salvar'}
        </button>
      </div>
    </form>
  );
}
