import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/PasswordRecovery";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Choose a new password | Portory" };

// Choosing a new password: the reset link (through /auth/callback) signed the
// visitor in; without a session the link has expired.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <ResetPasswordForm signedIn={Boolean(user)} />;
}
