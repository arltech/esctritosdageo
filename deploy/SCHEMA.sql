-- ===========================================================================
-- Escritos da Geo — SCHEMA DEDICADO 'escritos' EM ARLIA
-- ===========================================================================
-- Esta versão FOI APLICADA via MCP no projeto ARLIA (kodzqdvrthkxyafbrroo).
-- Mantida aqui pra referência + idempotência (re-rodar não quebra).
--
-- Cole este arquivo no SQL Editor do Supabase pra reaplicar em outro
-- projeto que coexista com outras apps no mesmo banco.
--
-- Por que schema dedicado?
--   ARLIA tem trafia/ss_*/arlbrief_* etc. já em produção.
--   Função 'handle_new_user' já existe no trafia → reescrever quebraria.
--   Schema 'escritos' isolado evita TODOS os conflitos.
-- ===========================================================================

create extension if not exists pgcrypto;

-- ===========================================================================
-- 1. SCHEMA + GRANTS
-- ===========================================================================
create schema if not exists escritos;

grant usage on schema escritos to anon, authenticated, service_role;
grant all on all tables    in schema escritos to anon, authenticated, service_role;
grant all on all sequences in schema escritos to anon, authenticated, service_role;
grant all on all functions in schema escritos to anon, authenticated, service_role;

alter default privileges in schema escritos
  grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema escritos
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema escritos
  grant all on functions to anon, authenticated, service_role;

-- ===========================================================================
-- 2. UTIL: set_updated_at em escritos (não toca a function pública do trafia)
-- ===========================================================================
create or replace function escritos.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- 3. PROFILES
-- ===========================================================================
create table if not exists escritos.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null default 'Geovana',
  bio           text,
  avatar_path   text,
  tagline       text,
  location      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on escritos.profiles;
create trigger profiles_set_updated_at
  before update on escritos.profiles
  for each row execute procedure escritos.set_updated_at();

-- Função separada (NÃO chamar 'handle_new_user' — colide com trafia)
create or replace function escritos.handle_new_escritos_user()
returns trigger
language plpgsql
security definer
set search_path = escritos, public
as $$
begin
  insert into escritos.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Geovana'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_escritos on auth.users;
create trigger on_auth_user_created_escritos
  after insert on auth.users
  for each row execute procedure escritos.handle_new_escritos_user();

alter table escritos.profiles enable row level security;

drop policy if exists "profiles_select_public" on escritos.profiles;
create policy "profiles_select_public"
  on escritos.profiles for select
  using (true);

drop policy if exists "profiles_update_own" on escritos.profiles;
create policy "profiles_update_own"
  on escritos.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on escritos.profiles;
create policy "profiles_delete_own"
  on escritos.profiles for delete
  using (auth.uid() = id);

-- ===========================================================================
-- 4. TEXTS
-- ===========================================================================
do $$ begin
  create type escritos.text_status as enum ('private', 'public');
exception
  when duplicate_object then null;
end $$;

create table if not exists escritos.texts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null default '',
  body_markdown   text not null default '',
  body_html       text not null default '',
  slug            text,
  status          escritos.text_status not null default 'private',
  published_at    timestamptz,
  tags            text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists texts_user_id_idx
  on escritos.texts(user_id);
create index if not exists texts_user_id_created_at_idx
  on escritos.texts(user_id, created_at desc);
create unique index if not exists texts_slug_public_unique
  on escritos.texts(slug)
  where status = 'public' and slug is not null;
create index if not exists texts_tags_idx
  on escritos.texts using gin (tags);

drop trigger if exists texts_set_updated_at on escritos.texts;
create trigger texts_set_updated_at
  before update on escritos.texts
  for each row execute procedure escritos.set_updated_at();

alter table escritos.texts enable row level security;

drop policy if exists "texts_select_own_or_public" on escritos.texts;
create policy "texts_select_own_or_public"
  on escritos.texts for select
  using ((auth.uid() = user_id) or (status = 'public'));

drop policy if exists "texts_insert_own" on escritos.texts;
create policy "texts_insert_own"
  on escritos.texts for insert
  with check (auth.uid() = user_id);

drop policy if exists "texts_update_own" on escritos.texts;
create policy "texts_update_own"
  on escritos.texts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "texts_delete_own" on escritos.texts;
create policy "texts_delete_own"
  on escritos.texts for delete
  using (auth.uid() = user_id);

-- ===========================================================================
-- 5. WALL_ITEMS
-- ===========================================================================
do $$ begin
  create type escritos.wall_item_status as enum ('private', 'public');
exception
  when duplicate_object then null;
end $$;

create table if not exists escritos.wall_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  image_path    text not null,
  caption       text,
  tilt_deg      smallint not null default 0 check (tilt_deg between -15 and 15),
  status        escritos.wall_item_status not null default 'private',
  published_at  timestamptz,
  on_home       boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists wall_items_user_created_idx
  on escritos.wall_items (user_id, created_at desc);
create index if not exists wall_items_public_idx
  on escritos.wall_items (published_at desc nulls last)
  where status = 'public';
create index if not exists wall_items_on_home_idx
  on escritos.wall_items (created_at desc)
  where on_home = true;

alter table escritos.wall_items enable row level security;

drop policy if exists "wall_items_owner_select" on escritos.wall_items;
create policy "wall_items_owner_select"
  on escritos.wall_items for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "wall_items_owner_insert" on escritos.wall_items;
create policy "wall_items_owner_insert"
  on escritos.wall_items for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "wall_items_owner_update" on escritos.wall_items;
create policy "wall_items_owner_update"
  on escritos.wall_items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "wall_items_owner_delete" on escritos.wall_items;
create policy "wall_items_owner_delete"
  on escritos.wall_items for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "wall_items_public_select" on escritos.wall_items;
create policy "wall_items_public_select"
  on escritos.wall_items for select
  to anon, authenticated
  using (status = 'public');

drop policy if exists "wall_items_on_home_select" on escritos.wall_items;
create policy "wall_items_on_home_select"
  on escritos.wall_items for select
  to anon, authenticated
  using (on_home = true);

-- ===========================================================================
-- 6. STORAGE BUCKETS (prefixados pra coexistir com outros apps)
-- ===========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'escritos-wall-images',
  'escritos-wall-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'escritos-avatars',
  'escritos-avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ===========================================================================
-- 7. STORAGE POLICIES (bucket-prefixadas)
-- ===========================================================================
drop policy if exists "escritos_wall_images_owner_upload" on storage.objects;
create policy "escritos_wall_images_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'escritos-wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "escritos_wall_images_owner_select" on storage.objects;
create policy "escritos_wall_images_owner_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'escritos-wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "escritos_wall_images_owner_delete" on storage.objects;
create policy "escritos_wall_images_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'escritos-wall-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "escritos_avatars_owner_upload" on storage.objects;
create policy "escritos_avatars_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'escritos-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "escritos_avatars_owner_update" on storage.objects;
create policy "escritos_avatars_owner_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'escritos-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "escritos_avatars_owner_delete" on storage.objects;
create policy "escritos_avatars_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'escritos-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ===========================================================================
-- AÇÕES MANUAIS PÓS-SQL (NÃO no SQL Editor — Dashboard)
-- ===========================================================================
--
-- 1. Settings > API > Exposed schemas
--    Adicionar 'escritos' ao lado de 'public, graphql_public'.
--    Sem isso o cliente Supabase não enxerga o schema.
--
-- 2. Authentication > Users > Add user
--    Email: lucas@arltech.emp.br (ou outro — bate com ALLOWED_EMAIL no .env)
--    Password: senha forte
--    Auto Confirm User: ON
--
-- 3. Settings > API: copiar URL + anon + service_role pras env vars.
-- ===========================================================================
