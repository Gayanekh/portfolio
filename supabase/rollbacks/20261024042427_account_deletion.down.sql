-- Rollback for account deletion.
--
-- Run ONLY after the app's Delete account button has been reverted (or can
-- live with the call failing): without this function it gets an error.
-- Accounts already deleted cannot be restored by this or any rollback.

begin;

drop function if exists public.delete_own_account();

notify pgrst, 'reload schema';

commit;
