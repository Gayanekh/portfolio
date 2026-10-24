-- fix4_verify.sql
--
-- READ-ONLY checks for FIX 4 (20261024042426 profiles access) and account
-- deletion (20261024042427). Nothing here writes: every block is a plain
-- SELECT or runs inside `begin read only; ... rollback;`.
--
-- The Supabase SQL editor only shows the result of the last statement, so run
-- each numbered block on its own. Replace <placeholders> before running.


-- =====================================================================
-- Before FIX 4 (the problem, DB-2)
-- =====================================================================

-- P1. Users and profiles.
-- Expect before: profiles = 0 (or fewer than users). After: users_without_profile = 0.
select (select count(*) from auth.users)    as users,
       (select count(*) from public.profiles) as profiles,
       (select count(*) from auth.users u
         where not exists (select 1 from public.profiles p where p.id = u.id)) as users_without_profile;

-- P2. Privileges of authenticated on profiles.
-- Expect before: all false. After: can_select = true, can_insert = false,
-- can_delete = false, update_first/last/avatar = true, update_id = false.
select has_table_privilege('authenticated', 'public.profiles', 'SELECT')            as can_select,
       has_table_privilege('authenticated', 'public.profiles', 'INSERT')            as can_insert,
       has_table_privilege('authenticated', 'public.profiles', 'DELETE')            as can_delete,
       has_column_privilege('authenticated', 'public.profiles', 'first_name', 'UPDATE') as update_first,
       has_column_privilege('authenticated', 'public.profiles', 'last_name', 'UPDATE')  as update_last,
       has_column_privilege('authenticated', 'public.profiles', 'avatar_url', 'UPDATE') as update_avatar,
       has_column_privilege('authenticated', 'public.profiles', 'id', 'UPDATE')         as update_id;


-- =====================================================================
-- After FIX 4
-- =====================================================================

-- F1. Re-run P1 and P2 and compare with the expectations above.

-- F2. The trigger on auth.users.
-- Expect 1 row: tgname = create_profile_after_signup, enabled = 'O'.
select t.tgname, t.tgenabled as enabled, p.proname as calls
from pg_trigger t
join pg_proc p on p.oid = t.tgfoid
where t.tgrelid = 'auth.users'::regclass and not t.tgisinternal
  and t.tgname = 'create_profile_after_signup';

-- F3. The functions: definer only where needed, fixed search path, and no
-- API role can call them.
-- Expect 2 rows, proconfig = {search_path=""} and every *_exec = false;
--   create_profile_for_new_user: prosecdef = true
--   profile_from_auth_user:      prosecdef = false
select p.proname, p.prosecdef, p.proconfig,
       has_function_privilege('anon', p.oid, 'EXECUTE')          as anon_exec,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_exec,
       has_function_privilege('service_role', p.oid, 'EXECUTE')  as service_exec
from pg_proc p
where p.pronamespace = 'public'::regnamespace
  and p.proname in ('create_profile_for_new_user', 'profile_from_auth_user')
order by p.proname;

-- F4. How names are derived (pure function, no data read).
-- Expect, in order:
--   Ana | Lee        | null           (email sign-up metadata)
--   Ben | Cole       | https://x/y.jpg (Google given/family names and photo)
--   Cy  | De La Cruz | null           (Google full name only; http photo dropped)
--   dee | ''         | null           (no name: the email's local part)
select 1 as n, * from public.profile_from_auth_user('ana@x.co', '{"first_name":"Ana","last_name":"Lee"}')
union all
select 2, * from public.profile_from_auth_user('b@x.co', '{"given_name":"Ben","family_name":"Cole","picture":"https://x/y.jpg"}')
union all
select 3, * from public.profile_from_auth_user('c@x.co', '{"full_name":"Cy De La Cruz","avatar_url":"http://x/y.jpg"}')
union all
select 4, * from public.profile_from_auth_user('dee@x.co', '{}')
order by n;

-- F5. A signed-in user sees exactly their own profile.
-- Replace <user id> with a real auth.users id.
-- Expect: own_rows = 1, total_visible = 1.
begin read only;
set local role authenticated;
set local request.jwt.claims = '{"sub":"<user id>","role":"authenticated"}';
select (select count(*) from public.profiles where id = '<user id>') as own_rows,
       (select count(*) from public.profiles)                       as total_visible;
rollback;

-- F6. Anonymous visitors still cannot read profiles.
-- Expect: ERROR 42501 permission denied for table profiles.
begin read only;
set local role anon;
select count(*) from public.profiles;
rollback;


-- =====================================================================
-- Account deletion
-- =====================================================================

-- D1. Only signed-in users can call it.
-- Expect 1 row: prosecdef = true, proconfig = {search_path=""},
-- anon_exec = false, auth_exec = true, service_exec = false.
select p.proname, p.prosecdef, p.proconfig,
       has_function_privilege('anon', p.oid, 'EXECUTE')          as anon_exec,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_exec,
       has_function_privilege('service_role', p.oid, 'EXECUTE')  as service_exec
from pg_proc p
where p.pronamespace = 'public'::regnamespace and p.proname = 'delete_own_account';

-- D2. Anonymous callers are refused.
-- Expect: ERROR 42501 permission denied for function delete_own_account.
begin read only;
set local role anon;
select public.delete_own_account();
rollback;

-- D3. Deleting for real is NOT tested here (it cannot be undone). Test it in
-- the app with a throwaway account on a non-production project: sign up,
-- save a portfolio with an image, delete the account, then re-run P1 and
-- check the user, profile, portfolio and images are gone.
