import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/PasswordRecovery";

export const metadata: Metadata = { title: "Forgot your password? | Portory" };

interface ForgotPasswordPageProps {
  searchParams: Promise<{ email?: string; expired?: string }>;
}

// Asks for a reset link. `email` comes from the login form; `expired` from a
// reset link that no longer works.
export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;
  return <ForgotPasswordForm email={params.email?.slice(0, 320)} expired={params.expired === "1"} />;
}
