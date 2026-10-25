"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import LoginExperience, { MIN_PASSWORD_LENGTH } from "@/components/auth/LoginExperience";
import { useSetAuthBusy } from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { getSafeNext } from "@/lib/auth-routing";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  next: string;
  verified?: boolean;
}

// Logs in or signs up with email and password (sign-up then confirms the
// email), with Google as the alternative.
export default function AuthForm({ mode, next, verified = false }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isRegister = mode === "register";
  const safeNext = getSafeNext(next);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoadingState] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuthBusy = useSetAuthBusy();
  // Shared with the auth panel, whose switch link waits for the submission.
  const setIsLoading = (loading: boolean) => {
    setIsLoadingState(loading);
    setAuthBusy(loading);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isRegister && (!firstName.trim() || !lastName.trim())) {
      setError("First name and last name are required.");
      return;
    }

    const minLength = isRegister ? MIN_PASSWORD_LENGTH : 6;
    if (password.length < minLength) {
      setError(`Password must be at least ${minLength} characters.`);
      return;
    }

    setIsLoading(true);
    const result = isRegister
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(
        isRegister && result.error.message.toLowerCase().includes("already")
          ? "An account with this email already exists."
          : isRegister
            ? result.error.message
            : "Invalid email or password.",
      );
      setIsLoading(false);
      return;
    }

    // The profile is created with the account, from the first and last name
    // sent as sign-up metadata (a database trigger, FIX 4).
    if (isRegister) {
      if (result.data.session) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("Unable to clear the signup session", {
            code: signOutError.code,
          });
        }
      }

      const verifyParams = new URLSearchParams({
        email,
        next: safeNext,
      });
      router.replace(`/verify-email?${verifyParams.toString()}`);
      return;
    }

    router.replace(safeNext);
    router.refresh();
  }

  // Google returns through the auth callback, which keeps the session and
  // continues to the next page.
  async function handleGoogle() {
    setError("");
    setMessage("");
    setIsGoogleLoading(true);
    const unavailable = "Google sign-in isn't available right now. Please use your email.";
    // Check Google is switched on first: otherwise Supabase would show its
    // raw error page instead of this form.
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! },
      });
      const settings = (await response.json()) as { external?: { google?: boolean } };
      if (settings.external?.google === false) {
        setError(unavailable);
        setIsGoogleLoading(false);
        return;
      }
    } catch {
      // The check itself failed: try signing in anyway.
    }
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?${new URLSearchParams({ next: safeNext, flow: "oauth" })}` },
    });
    if (oauthError) {
      setError(unavailable);
      setIsGoogleLoading(false);
    }
  }

  // Carry a non-default destination over between the two auth routes.
  const nextQuery = safeNext === getSafeNext(null) ? "" : `?${new URLSearchParams({ next: safeNext })}`;

  return (
    <LoginExperience
      mode={mode}
      email={email} password={password} firstName={firstName} lastName={lastName}
      error={error} message={message}
      isLoading={isLoading} isGoogleLoading={isGoogleLoading} showPassword={showPassword} verified={verified}
      loginHref={`/login${nextQuery}`} registerHref={`/register${nextQuery}`}
      onEmailChange={setEmail} onPasswordChange={setPassword}
      onFirstNameChange={setFirstName} onLastNameChange={setLastName}
      onTogglePassword={() => setShowPassword((visible) => !visible)}
      onSubmit={handleSubmit}
      onGoogle={handleGoogle}
    />
  );
}
