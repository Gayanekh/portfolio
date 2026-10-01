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
