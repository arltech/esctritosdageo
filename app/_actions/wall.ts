'use server';

import { revalidatePath } from 'next/cache';

import { createServerSupabaseClient } from '@/lib/supabase/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = 'escritos-wall-images';

export type UploadResult = { ok: true } | { ok: false; error: string };

function extFromMime(mime: string): string {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

/**
 * Upload + insert. Retorna estado pra useActionState.
 * Em caso de erro pós-upload (insert na tabela falha), remove o arquivo órfão.
 */
export async function uploadWallItem(
  _prev: UploadResult | null,
  formData: FormData,
): Promise<UploadResult> {
  const file = formData.get('image');
  const captionRaw = formData.get('caption');

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Selecione uma imagem.' };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Formato não suportado. Use JPEG, PNG ou WebP.' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'Imagem muito grande (máx 5 MB).' };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'Sessão expirada. Entre novamente.' };
  }

  const id = crypto.randomUUID();
  const ext = extFromMime(file.type);
  const path = `${user.id}/${id}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadErr) {
    console.error('[uploadWallItem] storage upload falhou', uploadErr);
    return { ok: false, error: 'Não consegui salvar a imagem. Tente de novo.' };
  }

  const caption = typeof captionRaw === 'string' ? captionRaw.trim().slice(0, 200) : '';
  const tilt = Math.floor(Math.random() * 9) - 4; // -4..+4 graus

  const { error: insertErr } = await supabase.from('wall_items').insert({
    id,
    user_id: user.id,
    image_path: path,
    caption: caption.length > 0 ? caption : null,
    tilt_deg: tilt,
  });

  if (insertErr) {
    console.error('[uploadWallItem] insert falhou; limpando arquivo órfão', insertErr);
    await supabase.storage.from(BUCKET).remove([path]);
    return { ok: false, error: 'Salvei a imagem mas falhei ao registrar. Tente de novo.' };
  }

  revalidatePath('/casa');
  return { ok: true };
}

export async function togglePublicWallItem(formData: FormData): Promise<void> {
  const id = formData.get('id');
  if (typeof id !== 'string' || !id) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: current, error: readErr } = await supabase
    .from('wall_items')
    .select('status')
    .eq('id', id)
    .single();

  if (readErr || !current) {
    console.error('[togglePublicWallItem] read falhou', readErr);
    return;
  }

  const nextStatus = current.status === 'public' ? 'private' : 'public';
  const { error: updateErr } = await supabase
    .from('wall_items')
    .update({
      status: nextStatus,
      published_at: nextStatus === 'public' ? new Date().toISOString() : null,
    })
    .eq('id', id);

  if (updateErr) {
    console.error('[togglePublicWallItem] update falhou', updateErr);
    return;
  }

  revalidatePath('/casa');
  revalidatePath('/');
}

export async function toggleOnHomeWallItem(formData: FormData): Promise<void> {
  const id = formData.get('id');
  if (typeof id !== 'string' || !id) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: current, error: readErr } = await supabase
    .from('wall_items')
    .select('on_home')
    .eq('id', id)
    .single();

  if (readErr || !current) {
    console.error('[toggleOnHomeWallItem] read falhou', readErr);
    return;
  }

  const { error: updateErr } = await supabase
    .from('wall_items')
    .update({ on_home: !current.on_home })
    .eq('id', id);

  if (updateErr) {
    console.error('[toggleOnHomeWallItem] update falhou', updateErr);
    return;
  }

  revalidatePath('/casa');
  revalidatePath('/');
}

export async function deleteWallItem(formData: FormData): Promise<void> {
  const id = formData.get('id');
  const imagePath = formData.get('image_path');
  if (typeof id !== 'string' || !id) return;
  if (typeof imagePath !== 'string' || !imagePath) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // RLS garante que só dono apaga, mas valida path por segurança extra
  if (!imagePath.startsWith(`${user.id}/`)) {
    console.error('[deleteWallItem] tentativa de deletar arquivo de outro usuário', { imagePath });
    return;
  }

  const { error: dbErr } = await supabase.from('wall_items').delete().eq('id', id);
  if (dbErr) {
    console.error('[deleteWallItem] delete row falhou', dbErr);
    return;
  }

  await supabase.storage.from(BUCKET).remove([imagePath]);
  revalidatePath('/casa');
  revalidatePath('/');
}
