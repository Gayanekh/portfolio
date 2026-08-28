"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/profile";
import { getSafeNext } from "@/lib/auth-routing";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  next: string;
  verified?: boolean;
}

export default function AuthForm({ mode, next, verified = false }: AuthFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isRegister && (!firstName.trim() || !lastName.trim())) {
      setError("First name and last name are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
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

    if (isRegister && result.data.user && result.data.session) {
      const { error: profileError } = await createProfile(
        supabase,
        result.data.user.id,
        firstName.trim(),
        lastName.trim(),
      );
      if (profileError) {
        console.error("Profile creation failed after registration", {
          userId: result.data.user.id,
          code: profileError.code,
        });
        setError(
          "Your account was created, but your profile could not be saved.",
        );
        setIsLoading(false);
        return;
      }
    }

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
        next: getSafeNext(next),
      });
      router.replace(`/verify-email?${verifyParams.toString()}`);
      return;
    }

    router.replace(getSafeNext(next));
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <p className="mb-4 text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/45">
        Portory
      </p>
      <h1 className="text-4xl font-light tracking-tight text-foreground">
        {isRegister ? "Create your account." : "Welcome back."}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-foreground/50">
        {isRegister
          ? "Start building a portfolio worth sharing."
          : "Sign in to continue building your portfolio."}
      </p>

      {!isRegister && verified && (
        <div
          className="mt-6 rounded-md border border-border/70 bg-white px-4 py-3 text-sm text-foreground/65"
          role="status"
        >
          <p>Email verified successfully.</p>
          <p className="mt-1 text-foreground/50">You can now sign in.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        {isRegister && (
          <>
            <div>
              <label
                htmlFor="first-name"
                className="mb-1.5 block text-xs text-foreground/60"
              >
                First name
              </label>
              <input
                id="first-name"
                type="text"
                required
                autoComplete="name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="w-full rounded-md border border-border/70 bg-white px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:ring-1 focus:ring-foreground/10"
              />
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="mb-1.5 block text-xs text-foreground/60"
              >
                Last name
              </label>
              <input
                id="last-name"
                type="text"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="w-full rounded-md border border-border/70 bg-white px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:ring-1 focus:ring-foreground/10"
              />
            </div>
          </>
        )}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs text-foreground/60"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-border/70 bg-white px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:ring-1 focus:ring-foreground/10"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs text-foreground/60"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-border/70 bg-white px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:ring-1 focus:ring-foreground/10"
          />
        </div>
        {isRegister && (
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-xs text-foreground/60"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-md border border-border/70 bg-white px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:ring-1 focus:ring-foreground/10"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="text-sm text-foreground/60" role="status">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-foreground px-4 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? isRegister
              ? "Creating account..."
              : "Signing in..."
            : isRegister
              ? "Create Account"
              : "Sign In"}
        </button>
      </form>

      <p className="mt-8 text-sm text-foreground/50">
        {isRegister ? "Already have an account? " : "New to Portory? "}
        <Link
          href={`${isRegister ? "/login" : "/register"}?next=${encodeURIComponent(next)}`}
          className="text-foreground underline underline-offset-4"
        >
          {isRegister ? "Sign in" : "Create account"}
        </Link>
      </p>
    </div>
  );
}
