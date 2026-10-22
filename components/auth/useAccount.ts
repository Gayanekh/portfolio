"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/auth-routing";

type Profile = {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

export interface Account {
  fullName: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
}

// The signed-in account (its name from the profile, else the sign-up details,
// else the email), kept in step with signing in and out, and signing out
// (back to the home page). `account` is null while signed out; `loading`
// until the first check is done.
export function useAccount() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      const { data } = await supabase.from("profiles").select("first_name, last_name, avatar_url").eq("id", userId).maybeSingle();
      setProfile(data);
    };
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) await loadProfile(data.user.id);
      else setProfile(null);
      setLoading(false);
    };
    loadUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  let account: Account | null = null;
  if (user) {
    const firstName = profile?.first_name?.trim() || String(user.user_metadata?.first_name || "").trim();
    const lastName = profile?.last_name?.trim() || String(user.user_metadata?.last_name || "").trim();
    const email = user.email || "";
    const emailName = email.split("@")[0] || "Account";
    const emailParts = emailName.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    account = {
      fullName: [firstName, lastName].filter(Boolean).join(" ") || emailName,
      email,
      initials:
        firstName || lastName
          ? getInitials(firstName, lastName)
          : emailParts.length > 1
            ? `${emailParts[0][0]}${emailParts[1][0]}`.toUpperCase()
            : emailName.slice(0, 2).toUpperCase(),
      avatarUrl: profile?.avatar_url ?? null,
    };
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Unable to sign out", { code: error.code });
      return false;
    }
    setUser(null);
    setProfile(null);
    router.replace("/");
    router.refresh();
    return true;
  };

  return { account, loading, signOut };
}
