-- Portory: the whole database setup for a NEW, empty Supabase project (a separate production project).
-- The baseline and every migration, in order, as one file. Run it ONCE in the new project's SQL Editor.
-- Never run this against a project that already has the Portory tables (it would try to re-create them).
-- Generated 2026-11-11T00:09Z from supabase/migrations/*.sql; the verifying checks are in supabase/tests/.

-- ============================================================
-- 20260926233831_baseline.sql
-- ============================================================
-- Baseline snapshot of the "public" schema.
-- Generated from the live catalog by supabase/scripts/export-schema-ddl.sql (read-only).
-- Server version: 17.6
-- Generated at: 2026-09-26 23:38:31 UTC
-- Objects in public NOT covered by the generator (all must be 0): views=0, sequences=0, foreign_tables=0, types=0, non_function_routines=0

SET check_function_bodies = false;

-- ===== Tables =====

CREATE TABLE public.portfolios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    slug text NOT NULL,
    template_id text NOT NULL,
    portfolio_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    published_at timestamp with time zone,
    published_portfolio_data jsonb
);
ALTER TABLE public.portfolios OWNER TO postgres;

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    first_name text NOT NULL,
    last_name text DEFAULT ''::text NOT NULL
);
ALTER TABLE public.profiles OWNER TO postgres;

-- ===== Primary key, unique and check constraints =====

ALTER TABLE public.portfolios ADD CONSTRAINT portfolios_pkey PRIMARY KEY (id);

ALTER TABLE public.portfolios ADD CONSTRAINT portfolios_slug_key UNIQUE (slug);

ALTER TABLE public.portfolios ADD CONSTRAINT portfolios_user_id_unique UNIQUE (user_id);

ALTER TABLE public.portfolios ADD CONSTRAINT portfolios_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])));

ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE public.profiles ADD CONSTRAINT profiles_first_name_not_blank CHECK ((length(TRIM(BOTH FROM first_name)) > 0));

-- ===== Foreign keys =====

ALTER TABLE public.portfolios ADD CONSTRAINT portfolios_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ===== Indexes (not backing a constraint) =====

CREATE INDEX portfolios_published_slug_idx ON public.portfolios USING btree (slug) WHERE (status = 'published'::text);

CREATE INDEX portfolios_user_id_idx ON public.portfolios USING btree (user_id);

-- ===== Functions =====

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;
ALTER FUNCTION public.rls_auto_enable() OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;
ALTER FUNCTION public.set_profiles_updated_at() OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;
ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

-- ===== Triggers =====

CREATE TRIGGER portfolios_set_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ===== Event triggers (function in public) =====

CREATE EVENT TRIGGER ensure_rls ON ddl_command_end
    WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
    EXECUTE FUNCTION public.rls_auto_enable();
ALTER EVENT TRIGGER ensure_rls OWNER TO postgres;

-- ===== Row level security =====

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===== Policies =====

CREATE POLICY "Anyone can read published portfolios" ON public.portfolios AS PERMISSIVE FOR SELECT TO anon, authenticated
    USING ((status = 'published'::text));

CREATE POLICY "Users can create their own portfolios" ON public.portfolios AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can delete their own portfolios" ON public.portfolios AS PERMISSIVE FOR DELETE TO authenticated
    USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can read their own portfolios" ON public.portfolios AS PERMISSIVE FOR SELECT TO authenticated
    USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can update their own portfolios" ON public.portfolios AS PERMISSIVE FOR UPDATE TO authenticated
    USING ((( SELECT auth.uid() AS uid) = user_id))
    WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can create their own profile" ON public.profiles AS PERMISSIVE FOR INSERT TO authenticated
    WITH CHECK ((auth.uid() = id));

CREATE POLICY "Users can update their own profile" ON public.profiles AS PERMISSIVE FOR UPDATE TO authenticated
    USING ((auth.uid() = id))
    WITH CHECK ((auth.uid() = id));

CREATE POLICY "Users can view their own profile" ON public.profiles AS PERMISSIVE FOR SELECT TO authenticated
    USING ((auth.uid() = id));

-- ===== Table and column privileges =====

REVOKE ALL ON TABLE public.portfolios FROM PUBLIC, anon, authenticated, service_role;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE public.portfolios TO anon;
GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.portfolios TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE public.portfolios TO service_role;

REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated, service_role;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE public.profiles TO anon;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE public.profiles TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE public.profiles TO service_role;

-- ===== Function privileges =====

REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO PUBLIC;

REVOKE ALL ON FUNCTION public.set_profiles_updated_at() FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_profiles_updated_at() TO PUBLIC;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO PUBLIC;

-- ============================================================
-- 20260927014741_fix2a_published_portfolio_access.sql
-- ============================================================
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

-- ============================================================
-- 20260927014742_fix2b_restrict_portfolio_reads.sql
-- ============================================================
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

-- ============================================================
-- 20260929072428_fix3a_portfolio_images_bucket.sql
-- ============================================================
-- FIX 3, stage A (additive).
--
-- Adds a Supabase Storage bucket for portfolio images, so the editor can
-- upload files directly to Storage and keep only their public URL in
-- portfolio_data instead of Base64 data URLs (which push save requests past
-- the serverless request body limit, HTTP 413). No existing object changes and
-- no deployed code uses the bucket yet, so this is safe to apply before the
-- code.
--
-- Object path: {auth.uid()}/{uuid}.{jpg|jpeg|png|webp|gif}, lowercase.
--
-- Access:
--   read     anyone who has the object URL (/storage/v1/object/public/...).
--            Public URLs are served without any policy check.
--   upload   authenticated, only into their own folder, only new objects
--   list     authenticated, only their own folder (remove() needs SELECT)
--   delete   authenticated, only in their own folder
--   update   nobody: uploads never overwrite, so upsert, update and move are
--            refused
--   anon     no policies: cannot upload, list or delete
--
-- Privacy trade-off (public bucket):
--   Every image in this bucket, including images used only in an unpublished
--   draft, can be downloaded by anyone who has its URL. The RLS on
--   public.portfolios does not protect Storage objects. Random UUID names and
--   the absence of an anonymous list policy make objects hard to find; they
--   are not authorization. Anyone who once saw a URL (a preview, a shared
--   link, browser history) can keep fetching it until the object is deleted.
--
-- Content checks:
--   allowed_mime_types checks the Content-Type the client declares, not the
--   file's bytes. The extension check in the upload policy checks the name
--   only. Neither guarantees that name, declared type and content agree.
--   Leaving SVG out of the list removes one declared type; it does not
--   inspect or sanitize content.
--
-- Size: file_size_limit is NULL on purpose. The per-image maximum is not
-- decided yet; until it is, the project-wide Storage upload limit applies.
--
-- Existing policies: Storage policies are permissive and OR together, so an
-- existing permissive policy on storage.objects can also grant access to the
-- new bucket. This migration refuses to run while any permissive policy for
-- anon/authenticated/public exists on storage.objects, unless the session
-- setting portory.fix3_ack_policy_fingerprint equals the fingerprint of
-- exactly those policies (supabase/tests/fix3_verify.sql, P2 and P3). The
-- fingerprint only proves the policies are the ones that were reviewed; the
-- review itself is manual.
--
-- Rollback: supabase/rollbacks/20260929072428_fix3a_portfolio_images_bucket.down.sql
-- Checks:   supabase/tests/fix3_verify.sql, sections "Before stage A" and "After stage A"

begin;

do $$
declare
  existing_count bigint;
  existing_fingerprint text;
  acknowledged text := current_setting('portory.fix3_ack_policy_fingerprint', true);
begin
  if to_regclass('storage.buckets') is null
     or to_regclass('storage.objects') is null
     or to_regprocedure('storage.foldername(text)') is null then
    raise exception 'Supabase Storage schema not found; aborting FIX 3 stage A';
  end if;

  if exists (select 1 from storage.buckets where id = 'portfolio-images') then
    raise exception 'Bucket portfolio-images already exists; inspect it instead of re-creating it';
  end if;

  if exists (select 1 from pg_policies
             where schemaname = 'storage' and tablename = 'objects'
               and policyname in ('Users can upload their own portfolio images',
                                  'Users can view their own portfolio images',
                                  'Users can delete their own portfolio images')) then
    raise exception 'A FIX 3 policy name already exists on storage.objects; aborting';
  end if;

  -- Keep this query identical to P3 in supabase/tests/fix3_verify.sql.
  select count(*),
         coalesce(md5(string_agg(
           format('%s|%s|%s|%s|%s', policyname, cmd, roles::text,
                  coalesce(qual, ''), coalesce(with_check, '')),
           E'\n' order by policyname)), '')
    into existing_count, existing_fingerprint
  from pg_policies
  where schemaname = 'storage' and tablename = 'objects'
    and permissive = 'PERMISSIVE'
    and roles && array['public', 'anon', 'authenticated']::name[]
    and policyname not in ('Users can upload their own portfolio images',
                           'Users can view their own portfolio images',
                           'Users can delete their own portfolio images');

  if existing_count > 0 and acknowledged is distinct from existing_fingerprint then
    raise exception 'storage.objects has % existing permissive policies for anon/authenticated/public; any of them may also apply to the new bucket. Review them with fix3_verify.sql P2, then acknowledge with P3. Aborting.', existing_count;
  end if;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  null,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Upload: the first path segment must be the caller's user id, and the whole
-- name must be exactly {uuid}/{uuid}.{ext} with a lowercase extension. The
-- folder check enforces ownership; the pattern enforces the path convention
-- (no nested folders, no chosen file names).
create policy "Users can upload their own portfolio images" on storage.objects
  as permissive for insert to authenticated
  with check (
    bucket_id = 'portfolio-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif)$'
  );

-- Own-folder SELECT. Not needed for public reads, but the Storage API's
-- remove() requires SELECT as well as DELETE. It lets a user list only their
-- own folder.
create policy "Users can view their own portfolio images" on storage.objects
  as permissive for select to authenticated
  using (
    bucket_id = 'portfolio-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own portfolio images" on storage.objects
  as permissive for delete to authenticated
  using (
    bucket_id = 'portfolio-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

commit;

-- ============================================================
-- 20261024042426_fix4_profiles_access.sql
-- ============================================================
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

-- ============================================================
-- 20261024042427_account_deletion.sql
-- ============================================================
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
