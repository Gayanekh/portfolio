-- Rollback for FIX 4 (profiles access).
--
-- Run ONLY after the account deletion migration (20261024042427) has been
-- rolled back, and after the app code that reads and updates profiles (the
-- Profile page) has been reverted or can live with 42501 again: without the
-- grants every profile read and write fails, as before FIX 4.
--
-- The profiles created by the trigger and the backfill are KEPT: they hold
-- names and photos users may have edited, and nothing else depends on them
-- being absent. Delete them by hand only if you are sure:
--   delete from public.profiles;   -- destructive, not part of this rollback

begin;

drop trigger if exists create_profile_after_signup on auth.users;
drop function if exists public.create_profile_for_new_user();
drop function if exists public.profile_from_auth_user(text, jsonb);

revoke update (first_name, last_name, avatar_url) on table public.profiles from authenticated;
revoke select on table public.profiles from authenticated;

notify pgrst, 'reload schema';

commit;
