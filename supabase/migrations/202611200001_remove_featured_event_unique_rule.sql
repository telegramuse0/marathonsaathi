begin;

-- Remove the old one-featured-race rule whether it exists as a table
-- constraint or as the partial unique index created by the earlier migration.
alter table public.marathons
  drop constraint if exists marathons_single_featured_event_idx;

drop index if exists public.marathons_single_featured_event_idx;

commit;

