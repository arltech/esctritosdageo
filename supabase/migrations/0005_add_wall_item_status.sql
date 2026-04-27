-- Migration: 0005_add_wall_item_status
-- Adiciona status público/privado em wall_items (mesmo pattern de texts.status).
-- RLS atualizada pra permitir anon SELECT em itens públicos.

-- ============================================================================
-- Enum + columns
-- ============================================================================

create type public.wall_item_status as enum ('private', 'public');

alter table public.wall_items
  add column status public.wall_item_status not null default 'private',
  add column published_at timestamptz;

-- Index para consultas públicas ordenadas por publicação
create index wall_items_public_idx
  on public.wall_items (published_at desc nulls last)
  where status = 'public';

-- ============================================================================
-- RLS — substituir SELECT antigo, adicionar UPDATE
-- ============================================================================

drop policy "wall_items_owner_select" on public.wall_items;

-- Dono autenticado vê todos os próprios (privados + públicos)
create policy "wall_items_owner_select"
  on public.wall_items for select
  to authenticated
  using (auth.uid() = user_id);

-- Qualquer um (anon ou autenticado) vê itens marcados como públicos
create policy "wall_items_public_select"
  on public.wall_items for select
  to anon, authenticated
  using (status = 'public');

-- Dono pode atualizar status (e qualquer outro campo no futuro)
create policy "wall_items_owner_update"
  on public.wall_items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
