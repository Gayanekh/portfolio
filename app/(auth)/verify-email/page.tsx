import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { getSafeNext } from "@/lib/auth-routing";

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; next?: string }>;
}

// The second step of signing up, in the same layout as /login and /register.
export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email.trim() : "";
  const next = getSafeNext(params.next);

  return <VerifyEmailForm email={email} next={next} />;
}
