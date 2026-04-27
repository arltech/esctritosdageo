-- Migration 0003 — Texts table
-- Núcleo do produto. Texto pode estar privado (default) ou público (opt-in
-- consciente). RLS: leitura própria + leitura pública seletiva por status.

create type public.text_status as enum ('private', 'public');

create table public.texts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  body_markdown text not null default '',
  body_html text not null default '',
  slug text,
  status public.text_status not null default 'private',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices
create index texts_user_id_idx on public.texts(user_id);
create index texts_user_id_created_at_idx on public.texts(user_id, created_at desc);

-- Slug único apenas entre textos públicos (privados podem ter slug=null livremente)
create unique index texts_slug_public_unique
  on public.texts(slug)
  where status = 'public' and slug is not null;

-- Trigger updated_at (reusa função criada na 0002)
create trigger texts_set_updated_at
  before update on public.texts
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.texts enable row level security;

-- SELECT: própria autora vê tudo + textos public lidos por qualquer um (sem auth)
create policy "texts_select_own_or_public"
  on public.texts for select
  using (
    (auth.uid() = user_id)
    or (status = 'public')
  );

-- INSERT: apenas com próprio user_id
create policy "texts_insert_own"
  on public.texts for insert
  with check (auth.uid() = user_id);

-- UPDATE: apenas próprios textos
create policy "texts_update_own"
  on public.texts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: apenas próprios textos
create policy "texts_delete_own"
  on public.texts for delete
  using (auth.uid() = user_id);
