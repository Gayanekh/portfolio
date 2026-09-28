# Database security

This document records how Portory's Supabase database is secured, what the
production database looked like when it was audited, and which problems are
known but not yet fixed.

- **Verified:** 2026-09-26, against the production project, using read-only
  catalog queries and a read-only role simulation. Nothing was changed.
- **Schema source of truth:**
  [`supabase/migrations/20260926233831_baseline.sql`](../supabase/migrations/20260926233831_baseline.sql),
  generated from the production catalog on 2026-09-26 at 23:38:31 UTC
  (Postgres 17.6). See [supabase/README.md](../supabase/README.md).
- **Status:** this describes the current state, known problems included. The
  target model in section 4 is not implemented yet.

## 1. How the app reaches the database

- The app uses only the publishable key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`),
  from the browser (`lib/supabase/client.ts`) and from the server with the
  visitor's cookies (`lib/supabase/server.ts`). No service-role key is used.
- Requests run as `anon` (signed out) or `authenticated` (signed in), so
  table privileges plus RLS policies are the only access control. Checks in
  the API routes can be bypassed by calling the REST API directly with the
  public key.
- Exposed APIs: PostgREST only. `pg_graphql` is not installed.

## 2. Verified production state

### Tables

`public.portfolios`

| Column | Type | Null | Default |
|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` |
| `user_id` | uuid | no | |
| `slug` | text | no | |
| `template_id` | text | no | |
| `portfolio_data` | jsonb | no | `'{}'` |
| `published_portfolio_data` | jsonb | yes | null |
| `status` | text | no | `'draft'` |
| `created_at` | timestamptz | no | `now()` |
| `updated_at` | timestamptz | no | `now()` |
| `published_at` | timestamptz | yes | |

`public.profiles`

| Column | Type | Null | Default |
|---|---|---|---|
| `id` | uuid | no | |
| `first_name` | text | no | |
| `last_name` | text | no | `''` |
| `avatar_url` | text | yes | |
| `created_at` | timestamptz | no | `now()` |
| `updated_at` | timestamptz | no | `now()` |

### Constraints and indexes

| Table | Name | Definition |
|---|---|---|
| portfolios | `portfolios_pkey` | PRIMARY KEY (`id`) |
| portfolios | `portfolios_slug_key` | UNIQUE (`slug`) |
| portfolios | `portfolios_user_id_unique` | UNIQUE (`user_id`): one portfolio per user |
| portfolios | `portfolios_status_check` | CHECK `status` in (`draft`, `published`) |
| portfolios | `portfolios_user_id_fkey` | FK `user_id` → `auth.users(id)` ON DELETE CASCADE |
| portfolios | `portfolios_user_id_idx` | btree (`user_id`), duplicates the unique index |
| portfolios | `portfolios_published_slug_idx` | btree (`slug`) WHERE `status = 'published'` |
| profiles | `profiles_pkey` | PRIMARY KEY (`id`) |
| profiles | `profiles_id_fkey` | FK `id` → `auth.users(id)` ON DELETE CASCADE |
| profiles | `profiles_first_name_not_blank` | CHECK `length(trim(first_name)) > 0` |

There is no CHECK on `template_id` or on the slug format.

### Row level security

RLS is enabled (not forced) on both tables.

| Table | Policy | Command | Roles | Condition |
|---|---|---|---|---|
| portfolios | Anyone can read published portfolios | SELECT | anon, authenticated | `status = 'published'` |
| portfolios | Users can read their own portfolios | SELECT | authenticated | `(select auth.uid()) = user_id` |
| portfolios | Users can create their own portfolios | INSERT | authenticated | check `(select auth.uid()) = user_id` |
| portfolios | Users can update their own portfolios | UPDATE | authenticated | using and check `(select auth.uid()) = user_id` |
| portfolios | Users can delete their own portfolios | DELETE | authenticated | `(select auth.uid()) = user_id` |
| profiles | Users can view their own profile | SELECT | authenticated | `auth.uid() = id` |
| profiles | Users can create their own profile | INSERT | authenticated | check `auth.uid() = id` |
| profiles | Users can update their own profile | UPDATE | authenticated | using and check `auth.uid() = id` |

The portfolio policies use `(select auth.uid())`, which Postgres evaluates
once per query. The profile policies call `auth.uid()` directly, which is
evaluated per row; Supabase's performance advisor flags that form.

### Table privileges

From the baseline's grants. anon and authenticated were also checked with
`has_table_privilege`.

| Role | Table | SELECT | INSERT | UPDATE | DELETE | TRUNCATE | REFERENCES, TRIGGER, MAINTAIN |
|---|---|---|---|---|---|---|---|
| anon | portfolios | yes | no | no | no | yes | yes |
| anon | profiles | no | no | no | no | yes | yes |
| authenticated | portfolios | yes | yes | yes | yes | yes | yes |
| authenticated | profiles | **no** | **no** | **no** | no | yes | yes |
| service_role | portfolios | **no** | **no** | **no** | **no** | yes | yes |
| service_role | profiles | **no** | **no** | **no** | **no** | yes | yes |

There are no column-level grants on either table.

`service_role` bypasses RLS but not table privileges, so a request made with
the service-role key cannot read or write either table. The app does not use
that key today; any future server-side job that does will need grants first.

`MAINTAIN` (Postgres 17) allows VACUUM, ANALYZE, REINDEX and LOCK TABLE.
Like TRUNCATE, it cannot be reached through PostgREST.

### Roles

| Role | Can log in | Bypasses RLS | Superuser |
|---|---|---|---|
| anon | no | no | no |
| authenticated | no | no | no |
| authenticator | yes | no | no |
| service_role | no | yes | no |

`anon` and `authenticated` cannot `CREATE` in the `public` schema.

### Functions and triggers

| Function | Security | search_path | Used by |
|---|---|---|---|
| `rls_auto_enable()` | DEFINER, owner `postgres` | `pg_catalog` | event trigger `ensure_rls` |
| `set_updated_at()` | INVOKER | `""` | trigger `portfolios_set_updated_at` (BEFORE UPDATE on portfolios) |
| `set_profiles_updated_at()` | INVOKER | `public` | trigger `profiles_set_updated_at` (BEFORE UPDATE on profiles) |

EXECUTE on all three is granted to `PUBLIC` only (Postgres's default), which
is how `anon` and `authenticated` hold it; revoking it would have to be
`FROM PUBLIC`. None of them can be called directly: they return `trigger` /
`event_trigger`.

`ensure_rls` fires on `ddl_command_end` for CREATE TABLE, CREATE TABLE AS and
SELECT INTO, and enables RLS on new tables in `public`. It creates no policies
or grants, so **a new table is inaccessible to the API until policies and
grants are added for it.** This is intentional; keep it.

If enabling RLS fails, `rls_auto_enable` only writes a `LOG` line and the
`CREATE TABLE` still succeeds, leaving that table without RLS. Check RLS
status after creating any table.

There is no trigger that creates a profile when a user signs up.

### Other

- Extensions: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`,
  `uuid-ossp`.
- Migration history: none (`supabase_migrations.schema_migrations` does not
  exist). The schema was created outside the CLI; the baseline file records
  it but has never been applied through the CLI.
- Data at audit time: 7 auth users (6 confirmed, all with first and last name
  metadata), 0 profiles, 2 portfolios (1 draft, 1 published with a snapshot),
  no orphaned rows.

## 3. Known issues

| ID | Issue | Severity | Evidence | Planned fix |
|---|---|---|---|---|
| DB-1 | Unpublished drafts are publicly readable. Anyone with the public key can read `portfolio_data`, `user_id` and timestamps of published rows, because RLS filters rows, not columns. Every save after publishing lands in `portfolio_data`. | High | Anonymous role test: draft column readable and different from the published snapshot | FIX 2 |
| DB-2 | Profiles never get created. `authenticated` has RLS policies but no table privileges on `profiles`, so every profile read/write fails with `42501`. | High | 7 users, 0 profiles | FIX 4 |
| DB-3 | Users can bypass API validation by writing their own portfolio row directly through REST (any `template_id`, slug, JSON). | Medium | INSERT/UPDATE grants plus ownership-only policies | FIX 5 |
| DB-4 | Slug check cannot see other users' drafts, so a colliding first save fails on `portfolios_slug_key`. | Low–Medium | Policies plus unique index | FIX 2, FIX 6 |
| DB-5 | API roles hold TRUNCATE, REFERENCES, TRIGGER and MAINTAIN. Not reachable: PostgREST cannot issue them, and the roles cannot log in or create objects. | Low | Privilege and role checks, baseline | FIX 11 |
| DB-6 | EXECUTE on the three public functions through the PUBLIC grant. Not exploitable. | Informational | Function checks, baseline | FIX 11 |
| DB-7 | `portfolios_user_id_idx` duplicates `portfolios_user_id_unique`. | Low | Index definitions | FIX 11 |
| DB-8 | No migration workflow in use and no automated security tests. The baseline exists in the repo; tests do not. | Medium | Migration history missing | FIX 1 (baseline), later fixes (tests) |
| DB-9 | `service_role` has no SELECT/INSERT/UPDATE/DELETE on either table. Not used by the app today, but it blocks any future server-side job using the service-role key. | Informational | Baseline grants | Decide in FIX 4 / FIX 7 |
| DB-10 | Profile policies call `auth.uid()` per row instead of `(select auth.uid())`. | Low | Baseline policies | FIX 11 |
| DB-11 | `rls_auto_enable` swallows errors, so a failed RLS enable leaves a new table without RLS. | Low | Function body | Document; revisit if tables are added often |

## 4. Target access model

This is where the planned fixes lead. **None of it is implemented yet.**

| Table | anon | authenticated, own row | authenticated, other rows |
|---|---|---|---|
| portfolios | none on the table; published `template_id` + `published_portfolio_data` by slug through a dedicated function | SELECT, INSERT, UPDATE, DELETE | none |
| profiles | none | SELECT; UPDATE of `first_name`, `last_name`, `avatar_url` | none |

Profiles are created by a trigger on `auth.users`, not by application code.
The DELETE policy on portfolios stays: it only covers the user's own row and
will be needed for deleting a portfolio or account.

## 5. Read-only verification queries

Run these in the SQL editor one at a time (the editor only shows the last
result). They change nothing.

```sql
-- RLS status
select c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_class c
where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'p')
order by 1;
```

```sql
-- Policies
select tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public' order by tablename, policyname;
```

```sql
-- Effective privileges of the API roles
select r.role, t.tbl, p.priv, has_table_privilege(r.role, t.tbl, p.priv) as allowed
from (values ('anon'), ('authenticated')) r(role),
     (values ('public.profiles'), ('public.portfolios')) t(tbl),
     (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'), ('TRUNCATE')) p(priv)
order by 1, 2, 3;
```

```sql
-- What an anonymous visitor can read (counts only)
begin read only;
set local role anon;
select count(*) as rows_visible_to_anon,
       count(*) filter (where status <> 'published') as non_published_visible,
       count(*) filter (where portfolio_data is not null) as draft_column_readable,
       count(*) filter (where portfolio_data is distinct from published_portfolio_data) as draft_differs_from_live,
       count(*) filter (where user_id is not null) as user_id_readable
from public.portfolios;
rollback;
```

```sql
-- Profile coverage (counts only)
select (select count(*) from auth.users) as users,
       (select count(*) from public.profiles) as profiles,
       (select count(*) from auth.users u
          where not exists (select 1 from public.profiles p where p.id = u.id)) as users_without_profile;
```
