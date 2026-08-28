"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/auth-routing";

type Profile = {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

export default function AuthControls() {
  const router = useRouter();
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      const { data: nextProfile } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      setProfile(nextProfile);
    };

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (!data.user) {
        setProfile(null);
        return;
      }
      await loadProfile(data.user.id);
    };

    loadUser();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
          setIsMenuOpen(false);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  if (user) {
    const metadataFirstName = String(user.user_metadata?.first_name || "").trim();
    const metadataLastName = String(user.user_metadata?.last_name || "").trim();
    const firstName = profile?.first_name?.trim() || metadataFirstName;
    const lastName = profile?.last_name?.trim() || metadataLastName;
    const email = user.email || "";
    const emailName = email.split("@")[0] || "Account";
    const fullName =
      [firstName, lastName].filter(Boolean).join(" ") || emailName;
    const emailParts = emailName.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const initials = firstName || lastName
      ? getInitials(firstName, lastName)
      : emailParts.length > 1
        ? `${emailParts[0][0]}${emailParts[1][0]}`.toUpperCase()
        : emailName.slice(0, 2).toUpperCase();

    const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Unable to sign out", { code: error.code });
        return;
      }
      setUser(null);
      setProfile(null);
      setIsMenuOpen(false);
      router.replace("/");
      router.refresh();
    };

    return (
      <div className="hidden items-center gap-3 sm:flex">
        <div
          className="relative"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsMenuOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsMenuOpen(false);
              accountTriggerRef.current?.focus();
            } else if (
              event.key === "ArrowDown" &&
              event.target === accountTriggerRef.current
            ) {
              event.preventDefault();
              setIsMenuOpen(true);
            }
          }}
        >
          <button
            ref={accountTriggerRef}
            type="button"
            aria-label={`Account menu for ${fullName}`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-foreground/[0.08] text-[10px] font-mono text-foreground/70 outline-none transition-colors hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full z-50 w-64 pt-2">
              <div
                role="menu"
                aria-label="Account menu"
                className="rounded-lg border border-border/60 bg-white p-4 shadow-xl shadow-black/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-foreground/[0.08] text-[10px] font-mono text-foreground/70">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{fullName}</p>
                    {email && (
                      <p className="mt-0.5 truncate text-xs text-foreground/45">
                        {email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="my-4 border-t border-border/60" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={signOut}
                  className="w-full rounded px-2 py-1.5 text-left text-xs text-foreground/60 transition-colors hover:bg-foreground/[0.04] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
        <Link
          href="/templates"
          className="rounded-md bg-foreground px-4 py-2 text-xs text-primary-foreground transition-opacity hover:opacity-80"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-4 sm:flex">
      <Link
        href="/login"
        className="text-xs text-foreground/55 transition-colors hover:text-foreground"
      >
        Sign In
      </Link>
      <Link
        href="/templates"
        className="rounded-md bg-foreground px-4 py-2 text-xs text-primary-foreground transition-opacity hover:opacity-80"
      >
        Get Started
      </Link>
    </div>
  );
}
