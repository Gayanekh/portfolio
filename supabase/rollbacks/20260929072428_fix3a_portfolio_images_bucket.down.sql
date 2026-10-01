-- Rollback for FIX 3, stage A.
--
-- Before running: revert any application code that uploads to, or links
-- images in, portfolio-images.
--
-- What this file does: drops the three policies stage A created, then
-- reports the resulting state in its last statement. It never deletes the
-- bucket and never deletes storage.objects rows. Deleting object rows with
-- SQL leaves the stored files behind, and deleting the bucket row with SQL
-- bypasses the Storage API's own checks, so both are left to the Dashboard or
-- the Storage API.
--
-- Once the policies are dropped, users can no longer upload, list or delete
-- their own images. Public URLs keep working while the bucket exists.
--
-- Result (rollback_state):
--   COMPLETE  No FIX 3 policies and no portfolio-images bucket remain.
--   PARTIAL   The policies are dropped but the bucket still exists. This is
--             NOT a complete rollback. To finish it:
--     1. If object_count > 0, decide what happens to those images first:
--        saved portfolio_data may still link them. User tokens can no longer
--        delete them, so a privileged user must: Dashboard > Storage >
--        portfolio-images, or the Storage API with the service-role key.
--     2. Delete the empty bucket in the Dashboard, or with
--        DELETE /storage/v1/bucket/portfolio-images and the service-role key.
--     3. Re-run this file. Expect COMPLETE.
--
-- Trust the counts only if sees_all_rows = true. object_count is read from
-- storage.objects and RLS applies to it; the postgres role used by the SQL
-- editor normally bypasses RLS. If sees_all_rows = false, check the bucket
-- in the Dashboard instead.
--
-- Limitations:
--   - Provenance: policies are matched by name and the bucket by id. This
--     file cannot tell whether they were changed after stage A (for example
--     in the Dashboard), or which objects came from the app, from tests or
--     from elsewhere. Review the bucket's contents before step 1.
--   - Re-running this file is safe: the drops use IF EXISTS and nothing is
--     deleted.
--   - Stage A cannot be re-applied while the bucket still exists: its guard
--     refuses an existing bucket. Finish the rollback first.

begin;

drop policy if exists "Users can upload their own portfolio images" on storage.objects;
drop policy if exists "Users can view their own portfolio images" on storage.objects;
drop policy if exists "Users can delete their own portfolio images" on storage.objects;

commit;

select case
         when bucket.id is null and policies.remaining = 0 then 'COMPLETE'
         else 'PARTIAL'
       end                                                     as rollback_state,
       policies.remaining                                      as fix3_policies_remaining,
       bucket.id is not null                                   as bucket_exists,
       bucket.public                                           as bucket_public,
       (select count(*) from storage.objects
         where bucket_id = 'portfolio-images')                 as object_count,
       (select rolbypassrls or rolsuper from pg_roles
         where rolname = current_user)                         as sees_all_rows
from (select count(*) as remaining
      from pg_policies
      where schemaname = 'storage' and tablename = 'objects'
        and policyname in ('Users can upload their own portfolio images',
                           'Users can view their own portfolio images',
                           'Users can delete their own portfolio images')) as policies
left join storage.buckets as bucket on bucket.id = 'portfolio-images';
