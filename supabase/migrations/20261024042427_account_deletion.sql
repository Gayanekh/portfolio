-- Account deletion: a signed-in user can delete their own account, and only
-- their own.
--
-- The app holds no service-role key (and should not need one for this), so
-- deletion runs through a narrow SECURITY DEFINER function that deletes the
-- caller's row in auth.users. The existing ON DELETE CASCADE foreign keys
-- remove the user's profile (profiles_id_fkey) and portfolio
-- (portfolios_user_id_fkey) with it; Supabase removes their sessions and
-- identities.
--
-- Not covered here: the user's images in the portfolio-images bucket.
-- Storage objects cannot be deleted with SQL (Supabase blocks direct deletes
-- from storage.objects); the app removes them through the Storage API first,
-- which the bucket's delete policy allows for the user's own folder.
--
-- Rollback: supabase/rollbacks/20261024042427_account_deletion.down.sql
-- Checks:   supabase/tests/fix4_verify.sql, section "Account deletion"

begin;

create function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
begin
  if caller is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;
  delete from auth.users where id = caller;
end;
$$;

comment on function public.delete_own_account() is
  'Deletes the calling user''s account; their profile and portfolio follow through ON DELETE CASCADE.';

alter function public.delete_own_account() owner to postgres;

-- Signed-in users only.
revoke all on function public.delete_own_account() from public, anon, authenticated, service_role;
grant execute on function public.delete_own_account() to authenticated;

notify pgrst, 'reload schema';

commit;
