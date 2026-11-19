begin;

alter table public.event_feedback
  add column if not exists owner_token text;

revoke select on public.event_feedback from anon, authenticated;
grant select (id, event_id, runner_name, bib_number, distance, route_rating, organization_rating, water_rating, overall_rating, comment, is_verified, created_at)
  on public.event_feedback to anon, authenticated;

drop policy if exists "Public can submit race reviews" on public.event_feedback;
create policy "Public can submit race reviews"
  on public.event_feedback for insert to anon, authenticated
  with check (
    is_verified = true
    and char_length(trim(runner_name)) between 2 and 60
    and char_length(trim(coalesce(bib_number, ''))) between 1 and 30
    and char_length(trim(coalesce(distance, ''))) between 1 and 60
    and char_length(trim(coalesce(owner_token, ''))) >= 64
  );

create or replace function public.edit_own_event_feedback(
  p_review_id bigint,
  p_owner_token text,
  p_runner_name text,
  p_bib_number text,
  p_distance text,
  p_route_rating smallint,
  p_organization_rating smallint,
  p_water_rating smallint,
  p_overall_rating smallint,
  p_comment text
) returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  changed_count integer;
begin
  update public.event_feedback
    set runner_name = trim(p_runner_name),
        bib_number = trim(p_bib_number),
        distance = trim(p_distance),
        route_rating = p_route_rating,
        organization_rating = p_organization_rating,
        water_rating = p_water_rating,
        overall_rating = p_overall_rating,
        comment = nullif(trim(coalesce(p_comment, '')), '')
    where id = p_review_id and owner_token = p_owner_token;
  get diagnostics changed_count = row_count;
  return changed_count = 1;
end;
$$;

create or replace function public.delete_own_event_feedback(
  p_review_id bigint,
  p_owner_token text
) returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  changed_count integer;
begin
  delete from public.event_feedback
    where id = p_review_id and owner_token = p_owner_token;
  get diagnostics changed_count = row_count;
  return changed_count = 1;
end;
$$;

revoke all on function public.edit_own_event_feedback(bigint, text, text, text, text, smallint, smallint, smallint, smallint, text) from public;
revoke all on function public.delete_own_event_feedback(bigint, text) from public;
grant execute on function public.edit_own_event_feedback(bigint, text, text, text, text, smallint, smallint, smallint, smallint, text) to anon, authenticated;
grant execute on function public.delete_own_event_feedback(bigint, text) to anon, authenticated;

commit;

