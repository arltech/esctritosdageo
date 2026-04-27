'use server';

import { revalidatePath } from 'next/cache';

import { createServerSupabaseClient } from '@/lib/supabase/server';

const AVATAR_BUCKET = 'escritos-avatars';
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const MAX_NAME = 80;
const MAX_TAGLINE = 80;
const MAX_LOCATION = 80;
const MAX_BIO = 500;

export type UpdateProfileResult = { ok: true } | { ok: false; error: string };

export type UpdatePasswordResult = { ok: true } | { ok: false; error: string };

const PASSWORD_MIN = 6;
const PASSWORD_MAX = 200;

/**
 * Troca a senha do usuário autenticado. Não exige senha atual — sessão já
 * autentica. Em fluxos críticos (banco etc.) reauth seria boa prática, mas
 * pra MVP de escrita pessoal isso é proporcional.
 */
export async function updatePassword(
  _prev: UpdatePasswordResult | null,
  formData: FormData,
): Promise<UpdatePasswordResult> {
  const next = formData.get('next_password');
  const confirm = formData.get('confirm_password');

  if (typeof next !== 'string' || typeof confirm !== 'string') {
    return { ok: false, error: 'Preencha os dois campos.' };
  }
  if (next.length < PASSWORD_MIN || next.length > PASSWORD_MAX) {
    return {
      ok: false,
      error: `Senha precisa ter entre ${PASSWORD_MIN} e ${PASSWORD_MAX} caracteres.`,
    };
  }
  if (next !== confirm) {
    return { ok: false, error: 'As senhas não batem.' };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão expirada. Entre novamente.' };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    console.error('[updatePassword] falhou', error.message);
    return { ok: false, error: 'Não consegui trocar a senha. Tente de novo.' };
  }

  return { ok: true };
}

function extFromMime(mime: string): string {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

function trim(value: FormDataEntryValue | null, max: number): string | null {
  if (typeof value !== 'string') return null;
  const t = value.trim().slice(0, max);
  return t.length > 0 ? t : null;
}

export async function updateProfile(
  _prev: UpdateProfileResult | null,
  formData: FormData,
): Promise<UpdateProfileResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão expirada. Entre novamente.' };

  const displayName = trim(formData.get('display_name'), MAX_NAME);
  if (!displayName) {
    return { ok: false, error: 'O nome não pode ficar vazio.' };
  }

  const tagline = trim(formData.get('tagline'), MAX_TAGLINE);
  const location = trim(formData.get('location'), MAX_LOCATION);
  const bio = trim(formData.get('bio'), MAX_BIO);

  // Avatar é opcional — só processa se vier arquivo válido
  let avatarPath: string | undefined;
  const avatarFile = formData.get('avatar');
  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(avatarFile.type)) {
      return { ok: false, error: 'Avatar deve ser JPEG, PNG ou WebP.' };
    }
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      return { ok: false, error: 'Avatar muito grande (máx 2 MB).' };
    }

    const ext = extFromMime(avatarFile.type);
    avatarPath = `${user.id}/avatar.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(avatarPath, avatarFile, { contentType: avatarFile.type, upsert: true });

    if (uploadErr) {
      console.error('[updateProfile] upload avatar falhou', uploadErr);
      return { ok: false, error: 'Não consegui salvar o avatar. Tente de novo.' };
    }
  }

  const updates: {
    display_name: string;
    tagline: string | null;
    location: string | null;
    bio: string | null;
    avatar_path?: string;
  } = {
    display_name: displayName,
    tagline,
    location,
    bio,
  };
  if (avatarPath) updates.avatar_path = avatarPath;

  const { error: updateErr } = await supabase.from('profiles').update(updates).eq('id', user.id);

  if (updateErr) {
    console.error('[updateProfile] update falhou', updateErr);
    return { ok: false, error: 'Falhei ao salvar. Tente de novo.' };
  }

  revalidatePath('/configuracoes');
  revalidatePath('/casa');
  revalidatePath('/');
  return { ok: true };
}
