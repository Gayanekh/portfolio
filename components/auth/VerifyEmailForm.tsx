"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/profile";

interface VerifyEmailFormProps {
  email: string;
  next: string;
}

export default function VerifyEmailForm({ email, next }: VerifyEmailFormProps) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || isVerifying || code.length !== 6) return;
    setIsVerifying(true);
    setMessage("");
    setError("");

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });

    if (verifyError || !data.user) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Email signup OTP verification failed", {
          verificationType: "signup",
          email,
          tokenLength: code.length,
          errorCode: verifyError?.code,
          errorStatus: verifyError?.status,
          errorMessage: verifyError?.message,
          returnedUser: Boolean(data.user),
        });
      }
      setError("Invalid or expired verification code.");
      setIsVerifying(false);
      return;
    }

    const firstName = String(data.user.user_metadata?.first_name || "").trim();
    const lastName = String(data.user.user_metadata?.last_name || "").trim();
    if (firstName && lastName) {
      const { error: profileError } = await createProfile(
        supabase,
        data.user.id,
        firstName,
        lastName,
      );
      if (profileError) {
        console.error("Profile creation failed after email OTP verification", {
          userId: data.user.id,
          code: profileError.code,
        });
      }
    } else {
      console.error("Verified user is missing profile name metadata", {
        userId: data.user.id,
      });
    }

    if (data.session) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Unable to clear session after email OTP verification", {
          code: signOutError.code,
        });
      }
    }

    const loginParams = new URLSearchParams({ verified: "1", next });
    router.replace(`/login?${loginParams.toString()}`);
    router.refresh();
  };

  const resendVerification = async () => {
    if (!email || isSending || cooldown > 0) return;
    setIsSending(true);
    setMessage("");
    setError("");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Signup verification code resend failed", {
          verificationType: "signup",
          email,
          errorCode: resendError.code,
          errorStatus: resendError.status,
          errorMessage: resendError.message,
        });
      }
      setError("Unable to resend the verification code. Please try again.");
    } else {
      setMessage("Code sent.");
      setCooldown(30);
    }
    setIsSending(false);
  };

  return (
    <div className="w-full max-w-md">
      <p className="mb-4 text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/45">
        Portory
      </p>
      <h1 className="text-4xl font-light tracking-tight text-foreground">
        Verify your email.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-foreground/50">
        We sent a verification code to:
      </p>
      <p className="mt-2 break-all text-sm text-foreground">{email}</p>

      <form onSubmit={verifyCode} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="verification-code"
            className="mb-1.5 block text-xs text-foreground/60"
          >
            Verification code
          </label>
          <input
            id="verification-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            required
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full rounded-md border border-border/70 bg-white px-3.5 py-3 text-center font-mono text-lg tracking-[0.35em] text-foreground outline-none transition focus:border-foreground/40 focus:ring-1 focus:ring-foreground/10"
          />
        </div>

        <button
          type="submit"
          disabled={!email || code.length !== 6 || isVerifying}
          className="w-full rounded-md bg-foreground px-4 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>
      </form>

      {error && (
        <p className="mt-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-6 text-sm text-foreground/60" role="status">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={resendVerification}
        disabled={!email || isSending || cooldown > 0}
        className="mt-8 text-sm text-foreground underline underline-offset-4 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSending
          ? "Sending..."
          : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend code"}
      </button>

      <p className="mt-8 text-sm text-foreground/50">
        Wrong email?{" "}
        <Link
          href={`/register?next=${encodeURIComponent(next)}`}
          className="text-foreground underline underline-offset-4"
        >
          Go back
        </Link>
      </p>
    </div>
  );
}
