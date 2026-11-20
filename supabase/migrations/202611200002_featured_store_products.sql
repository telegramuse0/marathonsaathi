alter table public.products
  add column if not exists is_featured boolean not null default false;

create index if not exists products_active_featured_created_idx
  on public.products (is_active, is_featured, created_at desc);

