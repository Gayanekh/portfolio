"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { authDisplay } from "@/components/auth/auth-fonts";
import { fluidText } from "@/components/landing/landing-ui";
import { requestHeadingFocus, textLinkClass } from "@/components/auth/LoginExperience";
import { createClient } from "@/lib/supabase/client";

interface VerifyEmailFormProps {
  email: string;
  next: string;
}

const status = "rounded bg-foreground/[0.05] px-3.5 py-3 text-sm leading-relaxed text-foreground/80";

// The second step of signing up, in the login form's design: the account
// waits for its email to be confirmed. The email holds a link (Supabase's
// "Confirm signup" email); it comes back through /auth/callback, which
// confirms the account and leads on to log in. Here: where the link went, a
// way to send it again, and a way back if the address was wrong.
export default function VerifyEmailForm({ email, next }: VerifyEmailFormProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [supabase] = useState(() => createClient());
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const resend = async () => {
    if (!email || isSending || cooldown > 0) return;
    setIsSending(true);
    setMessage("");
    setError("");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?${new URLSearchParams({ next })}` },
    });

    if (resendError) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Signup confirmation email resend failed", {
          email,
          errorCode: resendError.code,
          errorStatus: resendError.status,
          errorMessage: resendError.message,
        });
      }
      setError("Unable to send the email again. Please try again in a minute.");
    } else {
      setMessage("A new email is on its way.");
      setCooldown(30);
    }
    setIsSending(false);
  };

  return (
    <div className="grid w-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
      <div className="grid gap-2">
        <h1 ref={heading} tabIndex={-1} className={`${authDisplay.className} ${fluidText.authFormTitle} font-light leading-tight tracking-[-0.035em] outline-none`}>
          Check your email
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-foreground/70">
          We sent a confirmation link to <span className="block break-words font-medium text-foreground">{email || "your email"}</span>
        </p>
        <p className="text-[0.9375rem] leading-relaxed text-foreground/70">Open it to confirm your address and finish signing up, then log in.</p>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className={status} role="status">
          {message}
        </p>
      )}

      <div className="grid gap-3 text-sm text-foreground/60">
        <p>
          Didn&apos;t get it? Check your spam folder, or{" "}
          <button type="button" onClick={resend} disabled={!email || isSending || cooldown > 0} className={`${textLinkClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}>
            {isSending ? "sending…" : cooldown > 0 ? `send again in ${cooldown}s` : "send it again"}
          </button>
        </p>
        <p>
          Already confirmed?{" "}
          <Link href={`/login?${new URLSearchParams({ next })}`} onClick={requestHeadingFocus} className={textLinkClass}>
            Log in
          </Link>
        </p>
        <p>
          Wrong email?{" "}
          <Link href={`/register?${new URLSearchParams({ next })}`} onClick={requestHeadingFocus} className={textLinkClass}>
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
}
