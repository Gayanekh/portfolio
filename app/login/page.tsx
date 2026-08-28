import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { createClient } from "@/lib/supabase/server";
import { getSafeNext } from "@/lib/auth-routing";

interface LoginPageProps {
  searchParams: Promise<{ next?: string; verified?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = getSafeNext(params.next);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(next);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6 py-16">
      <AuthForm mode="login" next={next} verified={params.verified === "1"} />
    </main>
  );
}
