-- FIX 4: profiles that exist and that their owner can read and edit (DB-2).
--
-- Before: authenticated has RLS policies on public.profiles but no table
-- privileges, so every profile read and write fails with 42501, and no
-- profile has ever been created (the app falls back to sign-up metadata).
--
-- After (the target access model in docs/database-security.md):
--   - authenticated can SELECT its own row and UPDATE only first_name,
--     last_name and avatar_url of its own row (RLS keeps it to its own row).
--   - Nobody inserts profiles through the API: a trigger on auth.users creates
--     one for every new account, named from its sign-up metadata (email
--     sign-up: first_name/last_name; Google: given_name/family_name, else
--     full_name/name), else from the email, and with Google's photo if any.
--   - Existing accounts without a profile get one the same way (backfill).
--
-- The app's own profile inserts (createProfile in the auth callback and
-- sign-up) fail today and keep failing after this (no INSERT grant); the
-- trigger replaces them, and the code that calls them is removed alongside.
--
-- Rollback: supabase/rollbacks/20261024042426_fix4_profiles_access.down.sql
-- Checks:   supabase/tests/fix4_verify.sql

begin;

-- ===== Privileges =====

grant select on table public.profiles to authenticated;
grant update (first_name, last_name, avatar_url) on table public.profiles to authenticated;

-- ===== Profile for every account =====

-- The name and photo a new profile starts with, from an auth user's metadata.
-- first_name must not be blank (profiles_first_name_not_blank), so it falls
-- back to the part of the email before the @, then to 'Friend'.
create function public.profile_from_auth_user(p_email text, p_meta jsonb)
returns table (first_name text, last_name text, avatar_url text)
language sql
immutable
set search_path = ''
as $$
  with parts as (
    select
      nullif(trim(coalesce(p_meta->>'first_name', p_meta->>'given_name', '')), '') as given,
      nullif(trim(coalesce(p_meta->>'last_name', p_meta->>'family_name', '')), '') as family,
      nullif(trim(coalesce(p_meta->>'full_name', p_meta->>'name', '')), '') as full_name,
      nullif(trim(split_part(coalesce(p_email, ''), '@', 1)), '') as email_name,
      nullif(trim(coalesce(p_meta->>'avatar_url', p_meta->>'picture', '')), '') as photo
  )
  select
    left(coalesce(given, split_part(full_name, ' ', 1), email_name, 'Friend'), 100),
    left(coalesce(
      family,
      case when given is null and full_name like '% %' then trim(substr(full_name, strpos(full_name, ' ') + 1)) end,
      ''
    ), 100),
    case when photo like 'https://%' then left(photo, 2000) end
  from parts;
$$;

comment on function public.profile_from_auth_user(text, jsonb) is
  'FIX 4: the starting first name, last name and photo of a profile, from an auth user''s email and metadata.';

-- Trigger on auth.users: creates the new account's profile. SECURITY DEFINER
-- because it writes public.profiles, which no API role can insert into.
create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
  select new.id, p.first_name, p.last_name, p.avatar_url
  from public.profile_from_auth_user(new.email, new.raw_user_meta_data) as p
  on conflict (id) do nothing;
  return new;
end;
$$;

comment on function public.create_profile_for_new_user() is
  'FIX 4: trigger on auth.users that creates the new account''s profile.';

alter function public.profile_from_auth_user(text, jsonb) owner to postgres;
alter function public.create_profile_for_new_user() owner to postgres;

-- New functions in public inherit Supabase's default EXECUTE grants; reset
-- them. Neither is called through the API.
revoke all on function public.profile_from_auth_user(text, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.create_profile_for_new_user() from public, anon, authenticated, service_role;

create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

-- ===== Backfill =====

insert into public.profiles (id, first_name, last_name, avatar_url)
select u.id, p.first_name, p.last_name, p.avatar_url
from auth.users as u
cross join lateral public.profile_from_auth_user(u.email, u.raw_user_meta_data) as p
on conflict (id) do nothing;

notify pgrst, 'reload schema';

commit;
