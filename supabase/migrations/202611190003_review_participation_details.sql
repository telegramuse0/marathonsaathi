begin;

alter table public.event_feedback
  add column if not exists bib_number text,
  add column if not exists distance text;

alter table public.event_feedback
  drop constraint if exists event_feedback_bib_number_check,
  add constraint event_feedback_bib_number_check
    check (bib_number is null or char_length(trim(bib_number)) between 1 and 30),
  drop constraint if exists event_feedback_distance_check,
  add constraint event_feedback_distance_check
    check (distance is null or char_length(trim(distance)) between 1 and 60);

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
  );

commit;
