-- ============================================================================
-- Escritos da Geo — SCHEMA COMPLETO PARA DEPLOY MANUAL
-- ============================================================================
-- Cole este arquivo INTEIRO no SQL Editor do Supabase (projeto ARLIA).
--
-- Inclui (ordem segura):
--   1. Extensões
--   2. Tabela profiles + trigger handle_new_user + trigger updated_at
--   3. Tabela texts (enum text_status) + RLS + indexes
--   4. Tabela wall_items (enum wall_item_status) + on_home + RLS + indexes
--   5. Buckets de Storage: wall-images (privado), avatars (público)
--   6. Storage policies
--
-- Idempotente onde possível ('if not exists', 'on conflict do update').
-- Rodar UMA VEZ. Após rodar, criar o usuário em Authentication > Users.
-- ============================================================================

-- ============================================================================
-- 1. EXTENSÕES
-- ============================================================================
create extension if not exists pgcrypto;

-- ============================================================================
-- 2. PROFILES
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Geovana',
  bio text,
  avatar_path text,
  tagline text,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.profiles.tagline     is 'Frase curta da autora — max ~80 char no UI';
comment on column public.profiles.location    is 'Cidade/país opcional — max ~80 char no UI';
comment on column public.profiles.avatar_path is 'Caminho relativo no bucket avatars: {user_id}/avatar.{ext}';

-- Trigger genérico: updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Trigger: ao criar usuário em auth.users, cria profile automaticamente
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Geovana'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS profiles
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- ============================================================================
-- 3. TEXTS
-- ============================================================================
do $$ begin
  create type public.text_status as enum ('private', 'public');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.texts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null default '',
  body_markdown   text not null default '',
  body_html       text not null default '',
  slug            text,
  status          public.text_status not null default 'private',
  published_at    timestamptz,
  tags            text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on column public.texts.tags is 'Array de tags livres — normalizadas em lowercase no client antes de inserir.';

create index if not exists texts_user_id_idx
  on public.texts(user_id);
create index if not exists texts_user_id_created_at_idx
  on public.texts(user_id, created_at desc);
create unique index if not exists texts_slug_public_unique
  on public.texts(slug)
  where status = 'public' and slug is not null;
create index if not exists texts_tags_idx
  on public.texts using gin (tags);

drop trigger if exists texts_set_updated_at on public.texts;
create trigger texts_set_updated_at
  before update on public.texts
  for each row execute procedure public.set_updated_at();

alter table public.texts enable row level security;

drop policy if exists "texts_select_own_or_public" on public.texts;
create policy "texts_select_own_or_public"
  on public.texts for select
  using ((auth.uid() = user_id) or (status = 'public'));

drop policy if exists "texts_insert_own" on public.texts;
create policy "texts_insert_own"
  on public.texts for insert
  with check (auth.uid() = user_id);

drop policy if exists "texts_update_own" on public.texts;
create policy "texts_update_own"
  on public.texts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "texts_delete_own" on public.texts;
create policy "texts_delete_own"
  on public.texts for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 4. WALL_ITEMS
-- ============================================================================
do $$ begin
  create type public.wall_item_status as enum ('private', 'public');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.wall_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  image_path    text not null,
  caption       text,
  tilt_deg      smallint not null default 0 check (tilt_deg between -15 and 15),
  status        public.wall_item_status not null default 'private',
  published_at  timestamptz,
  on_home       boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists wall_items_user_created_idx
  on public.wall_items (user_id, created_at desc);
create index if not exists wall_items_public_idx
  on public.wall_items (published_at desc nulls last)
  where status = 'public';
create index if not exists wall_items_on_home_idx
  on public.wall_items (created_at desc)
  where on_home = true;

alter table public.wall_items enable row level security;

drop policy if exists "wall_items_owner_select" on public.wall_items;
create policy "wall_items_owner_select"
  on public.wall_items for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "wall_items_owner_insert" on public.wall_items;
create policy "wall_items_owner_insert"
  on public.wall_items for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "wall_items_owner_update" on public.wall_items;
create policy "wall_items_owner_update"
  on public.wall_items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "wall_items_owner_delete" on public.wall_items;
create policy "wall_items_owner_delete"
  on public.wall_items for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "wall_items_public_select" on public.wall_items;
create policy "wall_items_public_select"
  on public.wall_items for select
  to anon, authenticated
  using (status = 'public');

drop policy if exists "wall_items_on_home_select" on public.wall_items;
create policy "wall_items_on_home_select"
  on public.wall_items for select
  to anon, authenticated
  using (on_home = true);

-- ============================================================================
-- 5. STORAGE BUCKETS
-- ============================================================================

-- 5.1 wall-images: PRIVADO (acesso via signed URLs) — 5 MB
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wall-images',
  'wall-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 5.2 avatars: PÚBLICO (lido livremente, escrita só dono) — 2 MB
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ============================================================================
-- 6. STORAGE POLICIES
-- ============================================================================

-- 6.1 wall-images (path convention: {user_id}/...)
drop policy if exists "wall_images_owner_upload"  on storage.objects;
create policy "wall_images_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "wall_images_owner_select"  on storage.objects;
create policy "wall_images_owner_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "wall_images_owner_delete"  on storage.objects;
create policy "wall_images_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 6.2 avatars (path convention: {user_id}/avatar.{ext})
drop policy if exists "avatars_owner_upload" on storage.objects;
create policy "avatars_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Leitura do avatars é livre via bucket public — não precisa policy SELECT explícita.

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================
-- Próximos passos (NÃO no SQL):
--
-- 1. Authentication > Providers: certifique-se que "Email" está habilitado.
--    Desabilite "Confirm email" se quiser login direto sem confirmação.
--
-- 2. Authentication > Users > Add user > Create new user
--    Email: lucas@arltech.emp.br (ou o que combinar com ALLOWED_EMAIL no .env)
--    Password: (sua senha forte)
--    Auto Confirm User: ON
--
-- 3. Project Settings > API: copie URL e anon key (e service_role) pro .env
--    NEXT_PUBLIC_SUPABASE_URL
--    NEXT_PUBLIC_SUPABASE_ANON_KEY
--    SUPABASE_SERVICE_ROLE_KEY
--    ALLOWED_EMAIL=lucas@arltech.emp.br  (mesmo do user criado)
-- ============================================================================
