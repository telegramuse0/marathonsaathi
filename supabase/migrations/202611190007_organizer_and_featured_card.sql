begin;

alter table public.marathons
  add column if not exists organizer_contact_name text,
  add column if not exists organizer_email text,
  add column if not exists organizer_phone text,
  add column if not exists organizer_website text,
  add column if not exists lowest_price integer;

-- Keep the first upcoming featured event and clear any additional selections.
with chosen as (
  select id from public.marathons
  where is_featured = true
  order by (date < current_date), date asc, id asc
  limit 1
)
update public.marathons
set is_featured = (id in (select id from chosen))
where is_featured = true;

create unique index if not exists marathons_single_featured_event_idx
  on public.marathons (is_featured)
  where is_featured = true;

commit;

