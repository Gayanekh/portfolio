-- FIX 2, stage A (additive).
--
-- Adds two narrow read functions so the app no longer needs public read access
-- to public.portfolios. No existing object changes, so the currently deployed
-- app keeps working. Stage B (20260927014742) removes the public read path and
-- must only be applied after the code that calls these functions is deployed.
--
-- Rollback: supabase/rollbacks/20260927014741_fix2a_published_portfolio_access.down.sql
-- Checks:   supabase/tests/fix2_verify.sql, section "After stage A"

begin;

-- Public read path for /p/[slug]: only the published snapshot of one portfolio.
-- SECURITY DEFINER because anon has no table access after stage B. It runs as
-- the table owner, which bypasses RLS because RLS is not forced on this table.
create function public.get_published_portfolio(p_slug text)
returns table (template_id text, published_portfolio_data jsonb)
language sql
stable
security definer
set search_path = ''
as $$
  select p.template_id, p.published_portfolio_data
  from public.portfolios as p
  where p.slug = p_slug
    and p.status = 'published'
    and p.published_portfolio_data is not null;
$$;

comment on function public.get_published_portfolio(text) is
  'Public read path for /p/[slug]. Returns only the published snapshot of one portfolio.';

-- Slug check for a user's first save. Sees every row, drafts included, and
-- returns only true/false.
create function public.is_slug_available(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.portfolios as p where p.slug = p_slug);
$$;

comment on function public.is_slug_available(text) is
  'Slug availability for first save. Checks all portfolios, drafts included; returns only a boolean.';

alter function public.get_published_portfolio(text) owner to postgres;
alter function public.is_slug_available(text) owner to postgres;

-- New functions in public inherit Supabase's default EXECUTE grants; reset them.
revoke all on function public.get_published_portfolio(text) from public, anon, authenticated, service_role;
revoke all on function public.is_slug_available(text) from public, anon, authenticated, service_role;
grant execute on function public.get_published_portfolio(text) to anon, authenticated;
grant execute on function public.is_slug_available(text) to authenticated;

notify pgrst, 'reload schema';

commit;
