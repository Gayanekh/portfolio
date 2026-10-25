import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AccountPage from "@/components/account/AccountPage";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your account | Portory" };

// The signed-in user's account settings. Signed out, the visitor logs in
// first and comes back here.
export default async function Account() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?${new URLSearchParams({ next: "/account" })}`);

  // Created with the account (a database trigger, FIX 4); the fallbacks only
  // cover an account whose profile is somehow missing.
  const { data: profile } = await supabase.from("profiles").select("first_name, last_name, avatar_url").eq("id", user.id).maybeSingle();
  const providers = (user.identities ?? []).map((identity) => identity.provider);

  return (
    <AccountPage
      userId={user.id}
      email={user.email ?? ""}
      memberSince={user.created_at}
      firstName={profile?.first_name ?? String(user.user_metadata?.first_name ?? "")}
      lastName={profile?.last_name ?? String(user.user_metadata?.last_name ?? "")}
      avatarUrl={profile?.avatar_url ?? null}
      hasPassword={providers.includes("email")}
      withGoogle={providers.includes("google")}
    />
  );
}
