-- Rollback for FIX 2, stage A.
--
-- Run ONLY after stage B has been rolled back AND the application code has
-- been reverted to reading public.portfolios directly. The FIX 2 code calls
-- these functions, so dropping them first breaks /p/[slug] and first saves.

begin;

drop function if exists public.is_slug_available(text);
drop function if exists public.get_published_portfolio(text);

notify pgrst, 'reload schema';

commit;
