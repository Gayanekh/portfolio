import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { createClient } from "@/lib/supabase/server";
import { getSafeNext } from "@/lib/auth-routing";

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const next = getSafeNext(params.next);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(next);

  return <AuthForm mode="register" next={next} />;
}
