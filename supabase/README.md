# Supabase

This folder holds the database schema for Portory as version-controlled SQL.
See [docs/database-security.md](../docs/database-security.md) for the verified
production state, the access model and the known issues.

## Layout

| Path | Purpose |
|---|---|
| `scripts/export-schema-ddl.sql` | Read-only query that prints the current `public` schema as DDL. Used to capture the baseline. |
| `migrations/20260926233831_baseline.sql` | Snapshot of production as it was before any tracked change, known problems included. **Never run it against production.** |
| `migrations/<timestamp>_<name>.sql` | Every later schema, policy or grant change, one per file, each with a rollback script. |
| `rollbacks/<timestamp>_<name>.down.sql` | Undoes the migration with the same timestamp. Kept out of `migrations/` so the CLI never runs it. |
| `tests/<name>_verify.sql` | Read-only checks for a change, run before and after applying it. |

Migration files must be named `<YYYYMMDDHHMMSS>_<name>.sql` (UTC); the CLI
silently skips anything else. Use LF line endings.

Roll back in reverse order: undo the newest applied migration first. Each
rollback file states what must be true before it runs, such as which code
must be deployed or reverted.

There is no `config.toml` yet. It will be added with `supabase init` when the
Supabase CLI and Docker are set up for local development.

## The baseline

Production has never been managed with migrations: the CLI's migration history
table does not exist. The baseline records the schema exactly as it was on
2026-09-26, including known problems, so that every later fix is a reviewable
diff on top of it.

How it was captured (repeat the same steps for a fresh snapshot):

1. In the Supabase Dashboard, open **SQL Editor**, paste
   `scripts/export-schema-ddl.sql` and run it. It only reads the system
   catalogs.
2. Check the header line `Objects in public NOT covered by the generator`. All
   counts must be 0. If not, stop: the snapshot would be incomplete.
3. Copy the single `baseline_sql` cell into
   `migrations/<YYYYMMDDHHMMSS>_<name>.sql`, using the UTC "Generated at" time.
4. Review the file for secrets (URLs with tokens, keys, passwords), especially
   inside function bodies, before committing it.

The only manual edit made to the baseline: the two trigger statements were
changed to call `public.set_updated_at()` and `public.set_profiles_updated_at()`
explicitly (the generator now does this itself).

Replaying the baseline (local development only) needs Postgres 17 or newer,
because of the `MAINTAIN` grants, and a role allowed to create event triggers.

Alternative, once Docker is installed:
`npx supabase db dump --db-url "<connection string>" --schema public -f <file>`.
Run it yourself and never paste the connection string into chats, issues or
commits. Note that a schema-only `pg_dump` of `public` does not include event
triggers, so `ensure_rls` must be added separately.

## Rules for the production database

- Never run `supabase db push`, `db pull`, `db reset --linked` or
  `migration repair` against production without explicit approval.
  `db pull` also writes to the remote migration history.
- Before the first `db push`, the baseline must be marked as already applied
  (`supabase migration repair --status applied 20260926233831`),
  otherwise the CLI would try to re-create existing objects. That command
  writes to production and needs approval.
- Test every migration on a local or non-production project first. Apply it
  in a transaction and keep a rollback script next to it.
- Use read-only checks to verify changes: `begin read only;` +
  `set local role anon;` (or `authenticated`) + queries + `rollback;`.
