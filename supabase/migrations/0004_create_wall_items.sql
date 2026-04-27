-- Migration: 0004_create_wall_items
-- Cria tabela wall_items (mural collage da home) + bucket privado wall-images.
-- Política: dono-only em tudo (RLS + storage policies).

-- ============================================================================
-- TABLE: wall_items
-- ============================================================================

create table public.wall_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_path text not null,
  caption text,
  tilt_deg smallint not null default 0 check (tilt_deg between -15 and 15),
  created_at timestamptz not null default now()
);

create index wall_items_user_created_idx
  on public.wall_items (user_id, created_at desc);

alter table public.wall_items enable row level security;

create policy "wall_items_owner_select"
  on public.wall_items for select
  to authenticated
  using (auth.uid() = user_id);

create policy "wall_items_owner_insert"
  on public.wall_items for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "wall_items_owner_delete"
  on public.wall_items for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================================
-- STORAGE: wall-images bucket
-- ============================================================================
-- Bucket privado; acesso via signed URLs gerados server-side.
-- Path convention: "{user_id}/{wall_item_id}.{ext}"

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wall-images',
  'wall-images',
  false,
  5242880,                                            -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "wall_images_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "wall_images_owner_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "wall_images_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
