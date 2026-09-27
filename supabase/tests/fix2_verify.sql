-- fix2_verify.sql
--
-- READ-ONLY checks for FIX 2 (20260927014741 stage A, 20260927014742 stage B).
-- Nothing here writes: every block is a plain SELECT or runs inside
-- `begin read only; ... rollback;`.
--
-- The Supabase SQL editor only shows the result of the last statement, so run
-- each numbered block on its own. Replace <placeholders> before running.
-- Slugs below are the staging test data:
--   alex-tester  published, draft differs from the published snapshot
--   sam-tester   draft only (user B)


-- =====================================================================
-- After stage A
-- =====================================================================

-- A1. Function definitions and privileges.
-- Expect 2 rows: prosecdef = true, provolatile = 's', proconfig = {search_path=""}.
--   get_published_portfolio: anon_exec = true,  auth_exec = true, service_exec = false
--   is_slug_available:       anon_exec = false, auth_exec = true, service_exec = false
select p.proname, p.prosecdef, p.provolatile, p.proconfig,
       has_function_privilege('anon', p.oid, 'EXECUTE')          as anon_exec,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_exec,
       has_function_privilege('service_role', p.oid, 'EXECUTE')  as service_exec
from pg_proc p
where p.pronamespace = 'public'::regnamespace
  and p.proname in ('get_published_portfolio', 'is_slug_available')
order by p.proname;

-- A2. Anonymous read through the function.
-- Expect: published_rows = 1, draft_rows = 0, missing_rows = 0, live_bio = 'LIVE bio v1'.
begin read only;
set local role anon;
select (select count(*) from public.get_published_portfolio('alex-tester'))  as published_rows,
       (select count(*) from public.get_published_portfolio('sam-tester'))   as draft_rows,
       (select count(*) from public.get_published_portfolio('no-such-slug')) as missing_rows,
       (select published_portfolio_data->>'aboutBody'
          from public.get_published_portfolio('alex-tester'))               as live_bio;
rollback;

-- A3. Anonymous callers cannot use the slug check.
-- Expect: ERROR 42501 permission denied for function is_slug_available.
begin read only;
set local role anon;
select public.is_slug_available('sam-tester');
rollback;

-- A4. Signed-in slug check sees drafts too.
-- Expect: sam_tester = false, alex_tester = false, sam_tester_2 = true.
begin read only;
set local role authenticated;
select public.is_slug_available('sam-tester')   as sam_tester,
       public.is_slug_available('alex-tester')  as alex_tester,
       public.is_slug_available('sam-tester-2') as sam_tester_2;
rollback;


-- =====================================================================
-- After stage B
-- =====================================================================

-- B1. Policies and anon table privilege.
-- Expect: portfolio_policies = 4, public_read_policy = 0, anon_can_select = false.
select (select count(*) from pg_policies
         where schemaname = 'public' and tablename = 'portfolios')        as portfolio_policies,
       (select count(*) from pg_policies
         where schemaname = 'public' and tablename = 'portfolios'
           and policyname = 'Anyone can read published portfolios')       as public_read_policy,
       has_table_privilege('anon', 'public.portfolios', 'SELECT')          as anon_can_select;

-- B2. Anonymous direct table read is refused (the original exposure test).
-- Expect: ERROR 42501 permission denied for table portfolios.
begin read only;
set local role anon;
select count(*) from public.portfolios;
rollback;

-- B3. The public page path still works for anonymous visitors.
-- Re-run A2. Expect the same result.

-- B4. A signed-in user sees only their own row.
-- <user-uuid>: e.g. user A's id from auth.users.
-- Expect: visible_rows = 1 for a user with a portfolio, other_users_rows = 0.
begin read only;
set local role authenticated;
select set_config('request.jwt.claims',
                  json_build_object('sub', '<user-uuid>', 'role', 'authenticated')::text,
                  true);
select count(*)                                                 as visible_rows,
       count(*) filter (where user_id <> '<user-uuid>'::uuid)   as other_users_rows
from public.portfolios;
rollback;

-- B5. Over HTTP with the anonymous key (run in PowerShell, not here):
--   curl.exe -s "<project-url>/rest/v1/portfolios?select=id" -H "apikey: <publishable key>"
--     Expect: HTTP 401 with code 42501.
--   curl.exe -s -X POST "<project-url>/rest/v1/rpc/get_published_portfolio" `
--     -H "apikey: <publishable key>" -H "Content-Type: application/json" `
--     -d '{\"p_slug\":\"alex-tester\"}'
--     Expect: one object with template_id and published_portfolio_data only.


-- =====================================================================
-- After a rollback
-- =====================================================================

-- R1. After rolling back stage B.
-- Expect: portfolio_policies = 5, public_read_policy = 1, anon_can_select = true.
-- Re-run B1.

-- R2. After rolling back stage A.
-- Expect: 0 rows.
select proname from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('get_published_portfolio', 'is_slug_available');
