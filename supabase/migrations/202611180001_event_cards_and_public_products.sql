alter table public.marathons
  add column if not exists schedule text,
  add column if not exists photos_url text,
  add column if not exists results_url text;

create policy "Public can read active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);
