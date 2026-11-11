import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeNext } from "@/lib/auth-routing";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNext(requestUrl.searchParams.get("next"));
  // A password reset link: signed in for the reset, on to choosing a new
  // password; a link that no longer works goes back to ask for a new one.
  const recovery = requestUrl.searchParams.get("flow") === "recovery";
  const supabase = await createClient();

  if (recovery) {
    const { error: recoveryError } = code ? await supabase.auth.exchangeCodeForSession(code) : { error: new Error("No code") };
    if (recoveryError) {
      console.error("Password reset link could not be used", { message: recoveryError.message });
      return NextResponse.redirect(new URL("/forgot-password?expired=1", requestUrl.origin));
    }
    return NextResponse.redirect(new URL("/reset-password", requestUrl.origin));
  }

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

  // The account's profile is created with it, from its sign-up or Google
  // name (a database trigger, FIX 4); nothing to create here.

  if (!user) {
    console.error("Supabase auth callback completed without a user");
    return NextResponse.redirect(loginUrl());
  }

  // Google sign-in, and the link in the verification email: keep the session and
  // go straight on to the page the visitor was heading for (`next`), so nobody has
  // to log in again right after confirming.
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
