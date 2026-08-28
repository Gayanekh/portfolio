import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { getSafeNext } from "@/lib/auth-routing";

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; next?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email.trim() : "";
  const next = getSafeNext(params.next);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6 py-16">
      <VerifyEmailForm email={email} next={next} />
    </main>
  );
}
