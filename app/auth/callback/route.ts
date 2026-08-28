import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProfile } from "@/lib/profile";
import { getSafeNext } from "@/lib/auth-routing";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNext(requestUrl.searchParams.get("next"));
  const supabase = await createClient();

  const loginUrl = (verified = false) => {
    const url = new URL("/login", requestUrl.origin);
    url.searchParams.set("next", next);
    if (verified) url.searchParams.set("verified", "1");
    return url;
  };

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error("Supabase auth callback exchange failed", {
        code: exchangeError.code,
        status: exchangeError.status,
      });
      return NextResponse.redirect(loginUrl());
    }
  } else {
    console.error("Supabase auth callback received no authorization code");
    return NextResponse.redirect(loginUrl());
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const firstName = String(user.user_metadata?.first_name || "").trim();
    const lastName = String(user.user_metadata?.last_name || "").trim();
    if (firstName && lastName) {
      const { error: profileError } = await createProfile(
        supabase,
        user.id,
        firstName,
        lastName,
      );
      if (profileError) {
        console.error("Profile creation failed during auth callback", {
          userId: user.id,
          code: profileError.code,
        });
      }
    } else {
      console.error("Auth callback user is missing profile name metadata", {
        userId: user.id,
      });
    }
  } else {
    console.error("Supabase auth callback completed without a user");
    return NextResponse.redirect(loginUrl());
  }

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    console.error("Unable to clear session after email verification", {
      code: signOutError.code,
    });
  }

  return NextResponse.redirect(loginUrl(true));
}
