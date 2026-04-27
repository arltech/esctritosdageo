-- Migration: 0007_add_wall_item_on_home
-- Separa "público" de "em destaque na home". Toggles independentes:
--   status='public'  → aparece em recortes públicos (galeria geral)
--   on_home=true     → aparece em destaque na landing (curadoria)
-- Os dois são ortogonais — a Geo decide caso a caso.

alter table public.wall_items
  add column on_home boolean not null default false;

-- Index parcial pra query da landing — pequeno e quente.
create index wall_items_on_home_idx
  on public.wall_items (created_at desc)
  where on_home = true;

-- RLS: visitantes anônimos precisam ler itens marcados em destaque mesmo sem
-- estarem 'public'. Política adicional cobre essa leitura específica.
create policy "wall_items_on_home_select"
  on public.wall_items for select
  to anon, authenticated
  using (on_home = true);
