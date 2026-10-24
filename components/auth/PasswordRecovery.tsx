"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authSerif } from "@/components/auth/auth-fonts";
import { useSetAuthBusy } from "@/components/auth/AuthShell";
import {
  MIN_PASSWORD_LENGTH,
  buttonClass,
  iconButtonClass,
  inputClass,
  labelClass,
  requestHeadingFocus,
  spinner,
  textLinkClass,
} from "@/components/auth/LoginExperience";
import { createClient } from "@/lib/supabase/client";

// Forgetting a password, in the login form's design: ask for a reset link
// (ForgotPasswordForm), then choose a new password from that link
// (ResetPasswordForm). The link passes through /auth/callback (flow=recovery),
// which signs the visitor in for the reset and sends them to /reset-password.

// The heading and line over each form; the heading takes focus when a link
// brought the visitor here (as the login form's does).
function Intro({ title, text }: { title: string; text: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="grid gap-2">
      <h1 ref={heading} tabIndex={-1} className={`${authSerif.className} text-[38px] font-light leading-tight tracking-[-0.02em] outline-none`}>
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-foreground/70">{text}</p>
    </div>
  );
}

const panel = "grid w-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none";
const status = "rounded bg-foreground/[0.05] px-3.5 py-3 text-sm leading-relaxed text-foreground/80";

function BackToLogin() {
  return (
    <p className="text-sm text-foreground/60">
      Remembered it?{" "}
      <Link href="/login" onClick={requestHeadingFocus} className={textLinkClass}>
        Log in
      </Link>
    </p>
  );
}

// Asks for the account's email and sends a reset link. The answer is the same
// whether or not an account exists, so the form never reveals who has one.
// `expired`: the visitor came back from a link that no longer works.
export function ForgotPasswordForm({ email: initialEmail = "", expired = false }: { email?: string; expired?: boolean }) {
  const supabase = createClient();
  const setAuthBusy = useSetAuthBusy();
  const [email, setEmail] = useState(initialEmail);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusyState] = useState(false);
  const setBusy = (value: boolean) => {
    setBusyState(value);
    setAuthBusy(value);
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const { error: sendError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?${new URLSearchParams({ flow: "recovery" })}`,
    });
    setBusy(false);
    // Too many requests is worth saying; any other failure reads the same as
    // success, so the form never reveals whether an account exists.
    if (sendError?.status === 429) {
      setError("Too many requests. Please wait a minute and try again.");
      return;
    }
    if (sendError) console.error("Password reset email failed", { status: sendError.status, code: sendError.code });
    setSentTo(email.trim());
  }

  if (sentTo) {
    return (
      <div className={panel}>
        <Intro title="Check your email" text="If an account exists for that email, a link to choose a new password is on its way." />
        <p role="status" className={status}>
          We sent it to <strong className="font-semibold text-foreground">{sentTo}</strong>. The link works once and expires in an hour. Check your spam folder if it
          does not arrive in a few minutes.
        </p>
        <Button type="button" onClick={() => setSentTo("")} className={buttonClass}>
          Use another email
        </Button>
        <BackToLogin />
      </div>
    );
  }

  return (
    <div className={panel}>
      <Intro title="Forgot your password?" text="Enter your account's email and we'll send you a link to choose a new one." />
      {expired && (
        <p role="alert" className={status}>
          That link has expired or was already used. Request a new one below.
        </p>
      )}
      <form onSubmit={onSubmit} className="grid gap-4" aria-busy={busy}>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            aria-describedby={error ? "recover-error" : undefined}
          />
        </div>
        {error && (
          <p id="recover-error" role="alert" className="text-[13px] text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy} className={`${buttonClass} mt-2`}>
          {busy && spinner}
          {busy ? "Sending..." : "Send reset link"}
        </Button>
      </form>
      <BackToLogin />
    </div>
  );
}

// Chooses a new password, signed in by the reset link. Without a session (the
// page opened directly, or the link expired) it says so and offers a new link.
export function ResetPasswordForm({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  const setAuthBusy = useSetAuthBusy();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusyState] = useState(false);
  const setBusy = (value: boolean) => {
    setBusyState(value);
    setAuthBusy(value);
  };

  if (!signedIn) {
    return (
      <div className={panel}>
        <Intro title="This link has expired" text="Reset links work once and expire after an hour. Request a new one and use it on this device." />
        <Link href="/forgot-password" onClick={requestHeadingFocus} className={`${buttonClass} inline-flex items-center justify-center no-underline`}>
          Send a new link
        </Link>
        <BackToLogin />
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) return setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setBusy(false);
      setError(
        updateError.code === "same_password"
          ? "Choose a password different from your current one."
          : updateError.code === "weak_password"
            ? "That password is too easy to guess. Try a longer one."
            : "Your password could not be changed. Request a new link and try again.",
      );
      return;
    }
    setDone(true);
    // Signed in with the new password: on to the templates.
    window.setTimeout(() => {
      setBusy(false);
      router.replace("/templates");
    }, 1400);
  }

  if (done) {
    return (
      <div className={panel}>
        <Intro title="Password changed" text="You're signed in with your new password. Taking you to your templates..." />
        <span className="flex justify-center">{spinner}</span>
      </div>
    );
  }

  return (
    <div className={panel}>
      <Intro title="Choose a new password" text={`Use ${MIN_PASSWORD_LENGTH} or more letters, numbers and symbols.`} />
      <form onSubmit={onSubmit} className="grid gap-4" aria-busy={busy}>
        {(
          [
            ["new-password", "New password", password, setPassword],
            ["confirm-password", "Repeat new password", confirm, setConfirm],
          ] as const
        ).map(([id, label, value, onChange], index) => (
          <div key={id} className="relative">
            <label htmlFor={id} className={labelClass}>
              {label}
            </label>
            <Input
              id={id}
              name={id}
              type={show ? "text" : "password"}
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              placeholder={label}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className={`${inputClass} pr-11`}
              aria-describedby={error ? "reset-error" : undefined}
            />
            {index === 0 && (
              <span className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center">
                <button type="button" aria-label={show ? "Hide passwords" : "Show passwords"} aria-pressed={show} onClick={() => setShow((value) => !value)} className={iconButtonClass}>
                  {show ? <EyeOff aria-hidden="true" className="size-[18px]" /> : <Eye aria-hidden="true" className="size-[18px]" />}
                </button>
              </span>
            )}
          </div>
        ))}
        {error && (
          <p id="reset-error" role="alert" className="text-[13px] text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy} className={`${buttonClass} mt-2`}>
          {busy && spinner}
          {busy ? "Saving..." : "Save new password"}
        </Button>
      </form>
    </div>
  );
}
