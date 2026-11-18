alter table public.marathons
  add column if not exists location_details text,
  add column if not exists awards text,
  add column if not exists runner_benefits text,
  add column if not exists rating numeric(2, 1) default 5.0;
