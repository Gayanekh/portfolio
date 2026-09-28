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
