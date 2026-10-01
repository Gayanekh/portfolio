-- fix3_verify.sql
--
-- Checks for FIX 3 stage A (20260929072428): the portfolio-images bucket.
--
-- The SQL blocks are READ-ONLY: every block is a plain SELECT or runs inside
-- `begin read only; ... rollback;`. Upload, list and delete behaviour can
-- only be tested through the Storage API, so section H (a PowerShell script
-- at the end of this file) does that over HTTP. Run section H against
-- STAGING only. It creates test objects, records every path it tries, and
-- deletes them again.
--
-- The Supabase SQL editor only shows the result of the last statement, so run
-- each numbered block on its own. Replace <placeholders> before running.
-- Section H needs two confirmed test users, A and B, with passwords.


-- =====================================================================
-- Before stage A
-- =====================================================================

-- P1. Nothing to collide with.
-- Expect: bucket_exists = false, fix3_policies = 0.
select exists (select 1 from storage.buckets where id = 'portfolio-images') as bucket_exists,
       (select count(*) from pg_policies
         where schemaname = 'storage' and tablename = 'objects'
           and policyname in ('Users can upload their own portfolio images',
                              'Users can view their own portfolio images',
                              'Users can delete their own portfolio images')) as fix3_policies;

-- P2. Full audit of every existing storage.objects policy.
-- Lists all of them, with no filtering on what the expressions contain.
--
-- Permissive policies OR together, so a permissive policy for anon,
-- authenticated or public (= every role) also applies to the new bucket
-- unless its expression is false for every row with
-- bucket_id = 'portfolio-images'. For each row with needs_review = true,
-- read `using_expr` (SELECT/UPDATE/DELETE) and `check_expr` (INSERT/UPDATE)
-- and confirm that. Treat anything you cannot prove (function calls,
-- negations such as bucket_id <> 'x', OR branches without a bucket
-- condition, expressions with no bucket condition at all) as reaching the
-- bucket. If any policy reaches it: stop, do not apply stage A.
--
-- Restrictive policies (needs_review = false, mode = RESTRICTIVE) cannot
-- widen access, but they AND with the FIX 3 policies and may block uploads;
-- section H will show that.
--
-- The migration refuses to run while any needs_review = true row exists,
-- unless the reviewed set is acknowledged with P3.
select policyname,
       permissive                                                   as mode,
       cmd,
       roles,
       qual                                                         as using_expr,
       with_check                                                   as check_expr,
       permissive = 'PERMISSIVE'
         and roles && array['public', 'anon', 'authenticated']::name[] as needs_review
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by needs_review desc, policyname;

-- P3. Fingerprint of the policies P2 marks needs_review = true.
-- Same query as the guard in the migration. Record both values.
-- If reviewed_count = 0, stage A can be applied as is.
-- If reviewed_count > 0 and P2's review found no policy that reaches the
-- bucket, apply stage A in the SQL editor with this line pasted above the
-- migration text, in the same run:
--   select set_config('portory.fix3_ack_policy_fingerprint', '<fingerprint>', false);
-- If the policies change between the review and the apply, the fingerprint
-- no longer matches and the migration aborts. Review again.
select count(*) as reviewed_count,
       coalesce(md5(string_agg(
         format('%s|%s|%s|%s|%s', policyname, cmd, roles::text,
                coalesce(qual, ''), coalesce(with_check, '')),
         E'\n' order by policyname)), '') as fingerprint
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and permissive = 'PERMISSIVE'
  and roles && array['public', 'anon', 'authenticated']::name[]
  and policyname not in ('Users can upload their own portfolio images',
                         'Users can view their own portfolio images',
                         'Users can delete their own portfolio images');


-- =====================================================================
-- After stage A
-- =====================================================================

-- A1. Bucket configuration.
-- Expect 1 row: public = true, file_size_limit = NULL (no bucket-specific
--   limit; the project-wide upload limit in Dashboard > Storage > Settings
--   applies), allowed_mime_types = {image/jpeg,image/png,image/webp,image/gif}.
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'portfolio-images';

-- A2. The FIX 3 policies, by name.
-- Expect exactly 3 rows, mode = PERMISSIVE, roles = {authenticated}:
--   delete: cmd DELETE, check_expr NULL, using_expr = bucket + own folder
--   upload: cmd INSERT, using_expr NULL, check_expr = bucket + own folder + name pattern
--   view:   cmd SELECT, check_expr NULL, using_expr = bucket + own folder
select policyname, permissive as mode, cmd, roles,
       qual as using_expr, with_check as check_expr
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and policyname in ('Users can upload their own portfolio images',
                     'Users can view their own portfolio images',
                     'Users can delete their own portfolio images')
order by policyname;

-- A3. Stage A changed no other policy.
-- Re-run P3. Expect the same reviewed_count and fingerprint as before
-- stage A. Re-run P2. Expect the same rows as before plus the three FIX 3
-- policies, and no FIX 3 policy with anon or public in roles and no UPDATE.

-- A4. RLS is on for storage.objects.
-- Expect: relrowsecurity = true.
select c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_class c
where c.oid = 'storage.objects'::regclass;

-- A5. Anonymous callers see no object rows in the bucket, even while
-- objects exist. Run when section H pauses.
-- Expect: visible_to_anon = 0 (or ERROR 42501 if anon has no table grant;
-- both mean anonymous callers cannot list objects).
begin read only;
set local role anon;
select count(*) as visible_to_anon
from storage.objects
where bucket_id = 'portfolio-images';
rollback;

-- A6. A signed-in user sees only their own folder.
-- Run when section H pauses, once with user A's email and once with user
-- B's. Replace <user-email> in all three places. Same impersonation as
-- fix2_verify.sql B4.
-- Expect: identity_ok = true, running_as = authenticated,
--         own_rows >= 1, other_users_rows = 0.
begin read only;
select set_config('portory.test_user_id',
         coalesce((select id::text from auth.users
                   where email = '<user-email>'), 'NOT FOUND'), true),
       set_config('request.jwt.claim.sub',
         coalesce((select id::text from auth.users
                   where email = '<user-email>'), ''), true),
       set_config('request.jwt.claims',
         json_build_object(
           'sub',  (select id::text from auth.users
                    where email = '<user-email>'),
           'role', 'authenticated')::text, true);
set local role authenticated;
select current_setting('portory.test_user_id')                   as looked_up_id,
       current_user                                              as running_as,
       auth.uid()::text = current_setting('portory.test_user_id') as identity_ok,
       count(*) filter (where (storage.foldername(name))[1] =  auth.uid()::text) as own_rows,
       count(*) filter (where (storage.foldername(name))[1] <> auth.uid()::text) as other_users_rows
from storage.objects
where bucket_id = 'portfolio-images';
rollback;

-- A7. Cleanup check for one section H run.
-- Paste the array the script prints at the end in place of
-- array['<paths>']. Checks only this run's paths; other objects in the
-- bucket are not assumed absent and are reported separately.
-- Expect: sees_all_rows = true, run_objects_left = 0.
-- other_objects_in_bucket is informational (real user uploads, other runs).
select (select rolbypassrls or rolsuper from pg_roles
         where rolname = current_user)                            as sees_all_rows,
       count(*) filter (where name = any (array['<paths>']))       as run_objects_left,
       count(*) filter (where name <> all (array['<paths>']))      as other_objects_in_bucket,
       string_agg(name, ', ') filter (where name = any (array['<paths>'])) as run_objects_left_names
from storage.objects
where bucket_id = 'portfolio-images';


-- =====================================================================
-- Diagnostics
-- =====================================================================

-- D1. Evaluate the upload policy for one path, predicate by predicate.
-- Read-only. Replace <user-email> (3 places) and <object-path> (1 place),
-- e.g. <user-id>/<uuid>.png for that user.
-- folder_is_own and name_matches_pattern use this file's copy of the policy;
-- deployed_passes evaluates the WITH CHECK expression actually stored in
-- the database (pg_policy), so drift between file and database shows up as
-- a difference between them.
-- Expect for a valid own-folder path: identity_ok = true,
--   running_as = authenticated, first_folder = the user's id,
--   bucket_matches, folder_is_own and name_matches_pattern = true,
--   deployed_passes = <passes>true</passes>.
-- If all are true but the HTTP upload is still refused, the request did not
-- run as this user: check that it sends "Authorization: Bearer <user token>".
begin read only;
select set_config('portory.test_user_id',
         coalesce((select id::text from auth.users
                   where email = '<user-email>'), 'NOT FOUND'), true),
       set_config('request.jwt.claim.sub',
         coalesce((select id::text from auth.users
                   where email = '<user-email>'), ''), true),
       set_config('request.jwt.claims',
         json_build_object(
           'sub',  (select id::text from auth.users
                    where email = '<user-email>'),
           'role', 'authenticated')::text, true);
set local role authenticated;
with t as (select '<object-path>'::text as path, 'portfolio-images'::text as bucket),
     p as (select pg_get_expr(polwithcheck, polrelid) as check_expr
           from pg_policy
           where polrelid = 'storage.objects'::regclass
             and polname = 'Users can upload their own portfolio images')
select current_user                                               as running_as,
       auth.uid()::text = current_setting('portory.test_user_id') as identity_ok,
       t.path,
       storage.foldername(t.path)                                 as folders,
       (storage.foldername(t.path))[1]                            as first_folder,
       t.bucket = 'portfolio-images'                              as bucket_matches,
       (storage.foldername(t.path))[1] = (select auth.uid())::text as folder_is_own,
       t.path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif)$'
                                                                  as name_matches_pattern,
       query_to_xml(format(
         'select (%s) as passes from (select %L::text as bucket_id, %L::text as name) as o',
         p.check_expr, t.bucket, t.path), false, true, '')        as deployed_passes,
       p.check_expr                                               as deployed_check_expr
from t, p;
rollback;


-- =====================================================================
-- H. Storage API over HTTP (PowerShell 5.1 or later, STAGING only)
-- =====================================================================
--
-- The script below is inside a block comment, so it is copied verbatim.
-- Paste PART 1 and PART 2 into one PowerShell window.
--
-- How it keeps cleanup safe:
--   - Every path it attempts, including ones expected to be refused, is a
--     fresh UUID-based name. It is written to attempted-paths.txt BEFORE the
--     request, so a request that unexpectedly succeeds is still cleaned up.
--   - All files go in a new, uniquely named temporary directory.
--   - Cleanup runs in `finally`, so it also runs after an error. It signs in
--     again, deletes each recorded path with its folder owner's token, then
--     checks each path again.
--   - It only touches recorded paths; it never assumes the bucket is empty.
--     Paths that no test user can delete (for example a root-level object,
--     which exists only if a test unexpectedly succeeded) are listed for
--     manual cleanup.
--   - If the window closes mid-run: paste PART 1 again, then run
--     Cleanup '<old run directory>\attempted-paths.txt'
--   - A7 is the authoritative check. The Storage API check uses the owner's
--     own SELECT access.
--   - Before any test it checks that both sessions carry a token whose sub
--     is the user's id and whose role is authenticated. A request without a
--     token runs as anon, and its refusal looks exactly like a policy
--     failure ("new row violates row-level security policy").
--
-- Refused requests may come back as HTTP 400, 403 or 415 depending on the
-- Storage version; the script treats any non-200 upload as refused and
-- prints the response body for review. Tokens are secrets: do not paste the
-- script's variables into chats, issues or commits, and do not save this
-- block with real passwords filled in.

/*
# ---------------- PART 1: settings and functions ----------------
$u     = '<staging-project-url>'       # https://<ref>.supabase.co, no trailing slash
$k     = '<staging publishable key>'
$credA = @{ email = '<user-a-email>'; password = '<user-a-password>' }
$credB = @{ email = '<user-b-email>'; password = '<user-b-password>' }
$img   = '<path to a small .png file>'
$pauseForSql = $true                   # pause before the delete tests so A5/A6 can run

$dir = Join-Path ([IO.Path]::GetTempPath()) ('fix3-verify-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $dir | Out-Null
$attemptLog = Join-Path $dir 'attempted-paths.txt'
$results = New-Object System.Collections.ArrayList
Write-Host "Run directory: $dir"

function Login($cred) {
  Invoke-RestMethod -Method Post "$u/auth/v1/token?grant_type=password" `
    -Headers @{ apikey = $k } -ContentType 'application/json' `
    -Body ($cred | ConvertTo-Json)
}

# PowerShell variable names are case-insensitive ($a is $A). Keep every
# variable name in this script distinct regardless of case.

# Refuses to continue unless the session has a token for this user with
# role = authenticated. Without it, requests silently run as anon.
function AssertSession($session, $label) {
  if (-not $session -or -not $session.access_token -or -not $session.user.id) {
    throw "${label}: sign-in returned no access token or user id"
  }
  $part = $session.access_token.Split('.')[1].Replace('-', '+').Replace('_', '/')
  switch ($part.Length % 4) { 2 { $part += '==' } 3 { $part += '=' } }
  $claims = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($part)) | ConvertFrom-Json
  if ($claims.sub -ne $session.user.id -or $claims.role -ne 'authenticated') {
    throw "${label}: token sub/role do not match the signed-in user (role = $($claims.role))"
  }
}

function NewPath($folder, $ext) { "$folder/$([guid]::NewGuid()).$ext" }

function Call($method, $url, $token, $headers = @(), $data = @()) {
  $out = Join-Path $dir ([guid]::NewGuid().ToString() + '.out')
  $h = @('-H', "apikey: $k")
  if ($token) { $h += @('-H', "Authorization: Bearer $token") }
  foreach ($x in $headers) { $h += @('-H', $x) }
  $code = & curl.exe -s -o $out -w '%{http_code}' -X $method $url @h @data
  $body = ''
  if (Test-Path $out) { $body = [string](Get-Content $out -Raw) }
  [pscustomobject]@{ Code = [int]$code; Body = $body }
}

function JsonData($obj) {
  $p = Join-Path $dir ([guid]::NewGuid().ToString() + '.json')
  $obj | ConvertTo-Json -Compress | Set-Content -Path $p -Encoding ascii
  @('--data-binary', "@$p")
}

function Names($r) {
  if ($r.Code -ne 200) { return @() }
  $j = ConvertFrom-Json $r.Body
  @($j | Where-Object { $_ -and $_.name } | ForEach-Object { $_.name })
}

function Exists($path, $token) {
  $out = Join-Path $dir 'head.out'
  $code = & curl.exe -s -I -o $out -w '%{http_code}' `
    "$u/storage/v1/object/portfolio-images/$path" `
    -H "apikey: $k" -H "Authorization: Bearer $token"
  $code -eq '200'
}

function Record($test, $expect, $pass, $r) {
  $snippet = [string]$r.Body
  if ($snippet.Length -gt 160) { $snippet = $snippet.Substring(0, 160) }
  [void]$results.Add([pscustomobject]@{
    Test = $test; Expect = $expect; Http = $r.Code; Pass = [bool]$pass; Body = $snippet })
}

# Records the path before sending, so cleanup covers unexpected successes.
function Attempt($method, $test, $expect, $token, $path, $type, $upsert = 'false') {
  Add-Content -Path $attemptLog -Value $path -Encoding ascii
  $r = Call $method "$u/storage/v1/object/portfolio-images/$path" $token `
         @("Content-Type: $type", "x-upsert: $upsert") @('--data-binary', "@$img")
  Record $test $expect (($r.Code -eq 200) -eq ($expect -eq 'allowed')) $r
}

function List($token, $prefix) {
  Call 'POST' "$u/storage/v1/object/list/portfolio-images" $token `
    @('Content-Type: application/json') (JsonData @{ prefix = $prefix; limit = 1000 })
}

function Remove($token, $paths) {
  Call 'DELETE' "$u/storage/v1/object/portfolio-images" $token `
    @('Content-Type: application/json') (JsonData @{ prefixes = @($paths) })
}

function Cleanup($logPath) {
  $paths = @()
  if (Test-Path $logPath) {
    # -split yields plain strings. Lines from Get-Content carry PSPath etc.,
    # which ConvertTo-Json (Windows PowerShell 5.1) would send as objects,
    # and Storage rejects the delete with "prefixes/0 must be string".
    $paths = @((Get-Content $logPath -Raw) -split "\r?\n" | Where-Object { $_ } | Sort-Object -Unique)
  }
  Write-Host "Cleanup: $($paths.Count) recorded path(s) from $logPath"
  if ($paths.Count -eq 0) { return }
  $sqlArray = 'array[' + (($paths | ForEach-Object { "'" + $_.Replace("'", "''") + "'" }) -join ', ') + ']'
  try { $ca = Login $credA; $cb = Login $credB }
  catch {
    Write-Host 'Sign-in failed during cleanup; nothing was deleted. Manual cleanup needed for:' -ForegroundColor Red
    $paths | ForEach-Object { Write-Host "  $_" }
    Write-Host "A7 array: $sqlArray"
    return
  }
  $owners = @{ ($ca.user.id) = $ca.access_token; ($cb.user.id) = $cb.access_token }
  $manual = @(); $left = @()
  foreach ($p in $paths) {
    $folder = $p.Split('/')[0]
    if (-not $p.Contains('/') -or -not $owners.ContainsKey($folder)) { $manual += $p; continue }
    $tok = $owners[$folder]
    if (Exists $p $tok) {
      $rm = Remove $tok @($p)
      if ($rm.Code -ne 200) { Write-Host "  delete failed for ${p}: HTTP $($rm.Code) $($rm.Body)" -ForegroundColor Red }
    }
    if (Exists $p $tok) { $left += $p }
  }
  if ($left.Count -gt 0) {
    Write-Host 'Still present after delete (clean up in the Dashboard):' -ForegroundColor Red
    $left | ForEach-Object { Write-Host "  $_" }
  }
  if ($manual.Count -gt 0) {
    Write-Host 'Not deletable by a test user; check in A7 and remove in the Dashboard if present:' -ForegroundColor Yellow
    $manual | ForEach-Object { Write-Host "  $_" }
  }
  if ($left.Count -eq 0 -and $manual.Count -eq 0) { Write-Host 'Cleanup: no recorded path remains (Storage API check).' }
  Write-Host "Run A7 with: $sqlArray"
  Write-Host "Delete $dir after A7 passes."
}

# ---------------- PART 2: tests, then cleanup ----------------
try {
  $sessionA = Login $credA; $sessionB = Login $credB
  AssertSession $sessionA 'User A'; AssertSession $sessionB 'User B'
  $idA = $sessionA.user.id; $idB = $sessionB.user.id
  $ta = $sessionA.access_token; $tb = $sessionB.access_token
  if ($idA -eq $idB) { throw 'User A and user B must be different users' }
  $pA = NewPath $idA 'png'; $pB = NewPath $idB 'png'
  $leafA = $pA.Split('/')[-1]

  Attempt 'POST' 'H1 A uploads to own folder' 'allowed' $ta $pA 'image/png'
  $r = Call 'GET' "$u/storage/v1/object/public/portfolio-images/$pA" $null
  $r.Body = ''
  Record 'H2 public URL readable without sign-in' 'allowed' ($r.Code -eq 200) $r
  Attempt 'POST' 'H3 B uploads to own folder' 'allowed' $tb $pB 'image/png'

  Attempt 'POST' 'H4 A uploads into B''s folder' 'refused' $ta (NewPath $idB 'png') 'image/png'
  Attempt 'POST' 'H5 anonymous upload' 'refused' $null (NewPath $idA 'png') 'image/png'

  Attempt 'POST' 'H6a nested folder' 'refused' $ta "$idA/sub-$([guid]::NewGuid())/$([guid]::NewGuid()).png" 'image/png'
  Attempt 'POST' 'H6b name is not a uuid' 'refused' $ta "$idA/photo-$([guid]::NewGuid()).png" 'image/png'
  Attempt 'POST' 'H6c uppercase extension' 'refused' $ta (NewPath $idA 'PNG') 'image/png'
  Attempt 'POST' 'H6d svg extension' 'refused' $ta (NewPath $idA 'svg') 'image/png'
  Attempt 'POST' 'H6e object at bucket root' 'refused' $ta "$([guid]::NewGuid()).png" 'image/png'

  Attempt 'POST' 'H7a SVG content type' 'refused' $ta (NewPath $idA 'png') 'image/svg+xml'
  Attempt 'POST' 'H7b HTML content type' 'refused' $ta (NewPath $idA 'png') 'text/html'

  Attempt 'POST' 'H8a re-upload existing name' 'refused' $ta $pA 'image/png'
  Attempt 'POST' 'H8b upsert existing name' 'refused' $ta $pA 'image/png' 'true'
  Attempt 'PUT'  'H8c update existing object' 'refused' $ta $pA 'image/png'

  $r = List $null $idA
  Record 'H9a anonymous list of A''s folder' 'refused' ((Names $r).Count -eq 0) $r
  $r = List $ta $idA
  Record 'H9b A lists own folder' 'allowed' ((Names $r) -contains $leafA) $r
  $r = List $ta $idB
  Record 'H9c A lists B''s folder' 'refused' ((Names $r).Count -eq 0) $r

  if ($pauseForSql) {
    Write-Host "Test objects now exist:`n  $pA`n  $pB"
    Read-Host 'Run A5, and A6 for both users, in the SQL editor. Press Enter to continue' | Out-Null
  }

  $r = Remove $ta @($pB)
  Record 'H10 A deletes B''s object' 'refused' (((Names $r).Count -eq 0) -and (Exists $pB $tb)) $r
  $r = Remove $null @($pB)
  Record 'H11 anonymous delete' 'refused' (((Names $r).Count -eq 0) -and (Exists $pB $tb)) $r
  $r = Remove $ta @($pA)
  $deleted = @(Names $r | Where-Object { $_ -like "*$leafA" })
  Record 'H12 A deletes own object' 'allowed' (($deleted.Count -eq 1) -and -not (Exists $pA $ta)) $r
}
catch {
  Write-Host "Test run stopped early: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
  Cleanup $attemptLog
  $results | Format-Table Test, Expect, Http, Pass -AutoSize
  $failed = @($results | Where-Object { -not $_.Pass })
  Write-Host "Failed: $($failed.Count) of $($results.Count) (expected 21 results)"
  $failed | Format-List Test, Expect, Http, Body
}
*/


-- =====================================================================
-- After a rollback
-- =====================================================================

-- R1. The rollback file ends with this state report; re-run it here if
-- needed. Expect rollback_state = COMPLETE. PARTIAL means the policies are
-- gone but the bucket remains; that is not a complete rollback. Follow the
-- steps in the rollback file's header.
select case
         when bucket.id is null and policies.remaining = 0 then 'COMPLETE'
         else 'PARTIAL'
       end                                                     as rollback_state,
       policies.remaining                                      as fix3_policies_remaining,
       bucket.id is not null                                   as bucket_exists,
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
