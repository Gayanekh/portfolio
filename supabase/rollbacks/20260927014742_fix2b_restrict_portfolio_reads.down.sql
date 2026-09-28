-- Rollback for FIX 2, stage B.
--
-- Restores the public read policy and the anon SELECT grant exactly as they
-- are in the baseline (20260926233831). Takes effect immediately and
-- re-opens the draft exposure. Safe to run while the stage A code is live.
--
-- Roll back in reverse order: this file first, then stage A's rollback.

begin;

create policy "Anyone can read published portfolios" on public.portfolios
  as permissive for select to anon, authenticated
  using ((status = 'published'::text));

grant select on table public.portfolios to anon;

notify pgrst, 'reload schema';

commit;
