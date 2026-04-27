-- Migration: 0008_add_text_tags
-- Adiciona array de tags em texts. Chips livres definidos pela autora,
-- minúsculas/sem acento normalizadas no client. Index GIN pra filtros futuros.

alter table public.texts
  add column tags text[] not null default '{}';

create index texts_tags_idx on public.texts using gin (tags);

comment on column public.texts.tags is 'Array de tags livres — normalizadas em lowercase no client antes de inserir.';
