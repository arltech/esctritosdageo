-- Migration: 0006_profile_avatar_tagline_location
-- Expande profiles com campos editáveis pela autora + bucket público de avatares.

-- ============================================================================
-- ALTER profiles
-- ============================================================================

alter table public.profiles
  add column avatar_path text,
  add column tagline text,
  add column location text;

-- Constraint de tamanho (sem CHECK pesado — limites no client + boundary action)
comment on column public.profiles.tagline is 'Frase curta da autora — max ~80 char no UI';
comment on column public.profiles.location is 'Cidade/país opcional — max ~80 char no UI';
comment on column public.profiles.avatar_path is 'Caminho relativo no bucket avatars: {user_id}/avatar.{ext}';

-- ============================================================================
-- STORAGE: bucket avatars (público de leitura)
-- ============================================================================
-- Avatares são naturalmente públicos: aparecem na landing e em textos publicados.
-- Acesso de leitura é livre; escrita/deleção requer autenticação + ownership do path.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,                                                -- public-read
  2097152,                                             -- 2 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "avatars_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Leitura é livre via bucket público — não precisa policy SELECT explícita.
