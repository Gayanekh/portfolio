-- FIX 2, stage B (subtractive).
--
-- Removes public read access to public.portfolios, which exposed the draft
-- (portfolio_data), user_id and timestamps of every published portfolio.
-- Signed-in users keep reading, writing and deleting their own row.
--
-- Apply ONLY after stage A (20260927014741) is applied AND the code that reads
-- through get_published_portfolio / is_slug_available is deployed to every
-- environment using this database (production, preview, local). Otherwise
-- public portfolio pages return 404.
--
-- Rollback: supabase/rollbacks/20260927014742_fix2b_restrict_portfolio_reads.down.sql
-- Checks:   supabase/tests/fix2_verify.sql, section "After stage B"

begin;

do $$
begin
  if to_regprocedure('public.get_published_portfolio(text)') is null
     or to_regprocedure('public.is_slug_available(text)') is null then
    raise exception 'FIX 2 stage A is not applied; aborting stage B';
  end if;
end
$$;

drop policy "Anyone can read published portfolios" on public.portfolios;
revoke select on table public.portfolios from anon;

notify pgrst, 'reload schema';

commit;
