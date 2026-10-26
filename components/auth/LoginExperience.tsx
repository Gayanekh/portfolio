"use client";

import Link from "next/link";
import { type FormEvent, type MouseEvent, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authSerif } from "@/components/auth/auth-fonts";
import { fluidText } from "@/components/landing/landing-ui";

// Set by the auth links so the next route's heading takes focus on mount.
let focusHeadingOnMount = false;
export const requestHeadingFocus = () => { focusHeadingOnMount = true; };

// New passwords: Supabase accepts 6, the form asks for 8 like the hint says.
export const MIN_PASSWORD_LENGTH = 8;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
// Labels stay for assistive tech; placeholders carry the visible prompt.
export const labelClass = "sr-only";
// Underlined fields on the open page: the shared Input supplies the
// states; only the bottom border shows, brightening on hover and focus.
export const inputClass =
  "h-11 w-full min-w-0 rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 text-[0.9375rem] font-normal text-foreground placeholder:text-foreground/45 hover:border-foreground/50 focus:border-foreground disabled:bg-transparent disabled:text-foreground/50 disabled:hover:border-foreground/25 read-only:bg-transparent";
export const quietLinkClass = `${focusRing} rounded text-foreground/55 transition-colors hover:text-foreground`;
export const textLinkClass = `${focusRing} rounded font-medium text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[3px] transition-colors hover:decoration-foreground`;
export const iconButtonClass = `${focusRing} grid size-8 place-items-center rounded text-foreground/55 transition-colors hover:text-foreground`;
// The outline button, filling black on hover.
export const buttonClass = `${focusRing} h-12 w-full gap-2.5 rounded border border-foreground bg-transparent px-5 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-foreground shadow-none transition-[background-color,color,transform] duration-300 enabled:hover:bg-foreground enabled:hover:text-white focus-visible:ring-0 enabled:active:translate-y-px disabled:pointer-events-auto disabled:cursor-wait disabled:opacity-60`;
export const spinner = <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />;

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-[1.125rem]">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
    </svg>
  );
}

interface LoginExperienceProps {
  mode: "login" | "register";
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  error: string;
  message: string;
  isLoading: boolean;
  isGoogleLoading: boolean;
  showPassword: boolean;
  verified: boolean;
  loginHref: string;
  registerHref: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoogle: () => void;
}

// The auth form, structured like Pinterest's: a welcome heading and line,
// email and password (an eye to show it; on sign-up a hint below),
// "Forgot your password?" when logging in, the submit button, then
// "or" and Continue with Google, and the link to the other mode.
export default function LoginExperience(props: LoginExperienceProps) {
  const { mode, email, password, error, message, isLoading, isGoogleLoading, showPassword } = props;
  const isRegister = mode === "register";
  const busy = isLoading || isGoogleLoading;
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusHeadingOnMount) {
      focusHeadingOnMount = false;
      heading.current?.focus({ preventScroll: true });
    }
  }, []);

  // Auth links stay inert while a submission is in flight.
  function onAuthLinkClick(event: MouseEvent<HTMLAnchorElement>, target: "login" | "register") {
    if (busy || target === mode) {
      event.preventDefault();
      return;
    }
    requestHeadingFocus();
  }

  const describedBy = error ? "login-error" : undefined;
  const passwordHint = `Use ${MIN_PASSWORD_LENGTH} or more letters, numbers and symbols.`;

  return (
    <div data-mode={mode} className="group/auth grid w-full gap-6 [@media(max-height:720px)]:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
      <div className="grid gap-2">
        <h1 ref={heading} tabIndex={-1} className={`${authSerif.className} ${fluidText.authFormTitle} font-light leading-tight tracking-[-0.02em] outline-none`}>{isRegister ? "Welcome to Portory" : <>Welcome back<span className="sm:hidden"> to your portfolio</span></>}</h1>
        <p className="text-[0.9375rem] leading-relaxed text-foreground/70">{isRegister ? "Join Portory for free to build a portfolio worth sharing." : "Log in to keep editing your portfolio."}</p>
      </div>

      {!isRegister && props.verified && <div data-status className="rounded bg-success/10 px-3.5 py-2.5 text-sm text-success-foreground" role="status">Email verified successfully. You can now sign in.</div>}

      <form onSubmit={props.onSubmit} className="grid gap-4" aria-busy={isLoading}>
        {isRegister && <div className="grid grid-cols-2 gap-4 max-[420px]:grid-cols-1">
          <div><label htmlFor="first-name" className={labelClass}>First name</label><Input id="first-name" name="firstName" required autoComplete="given-name" placeholder="First name" value={props.firstName} onChange={(event) => props.onFirstNameChange(event.target.value)} className={inputClass} /></div>
          <div><label htmlFor="last-name" className={labelClass}>Last name</label><Input id="last-name" name="lastName" required autoComplete="family-name" placeholder="Last name" value={props.lastName} onChange={(event) => props.onLastNameChange(event.target.value)} className={inputClass} /></div>
        </div>}
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder={isRegister ? "Enter your email" : "Email"} value={email} onChange={(event) => props.onEmailChange(event.target.value)} className={inputClass} aria-describedby={describedBy} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password" className={labelClass}>{isRegister ? "Create a password" : "Password"}</label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={isRegister ? MIN_PASSWORD_LENGTH : 6}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder={isRegister ? "Create a password" : "Password"}
              value={password}
              onChange={(event) => props.onPasswordChange(event.target.value)}
              className={`${inputClass} pr-11`}
              aria-describedby={isRegister ? ["password-hint", describedBy].filter(Boolean).join(" ") : describedBy}
            />
            <span className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center">
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={props.onTogglePassword} className={iconButtonClass}>
                {showPassword ? <EyeOff aria-hidden="true" className="size-[1.125rem]" /> : <Eye aria-hidden="true" className="size-[1.125rem]" />}
              </button>
            </span>
          </div>
          {isRegister && <p id="password-hint" className="text-[0.8125rem] text-foreground/50">{passwordHint}</p>}
          {!isRegister && <p className="text-[0.8125rem]"><Link href={`/forgot-password${email ? `?${new URLSearchParams({ email })}` : ""}`} aria-disabled={busy || undefined} onClick={(event) => (busy ? event.preventDefault() : requestHeadingFocus())} className={`${quietLinkClass} font-medium aria-disabled:pointer-events-none aria-disabled:opacity-50`}>Forgot your password?</Link></p>}
        </div>
        {message && <p role="status" className="text-sm text-foreground/70">{message}</p>}
        {error && <p id="login-error" className="text-[0.8125rem] text-destructive" role="alert">{error}</p>}
        <Button type="submit" disabled={busy} className={`${buttonClass} mt-2`}>
          {isLoading && spinner}
          {isLoading ? (isRegister ? "Creating account..." : "Logging in...") : (isRegister ? "Create account" : "Log in")}
        </Button>
      </form>

      <p aria-hidden="true" className="flex items-center gap-4 text-[0.75rem] uppercase tracking-[0.2em] text-foreground/50">
        <span className="h-px flex-1 bg-foreground/15" />or<span className="h-px flex-1 bg-foreground/15" />
      </p>

      <Button type="button" onClick={props.onGoogle} disabled={busy} className={`${buttonClass} text-[0.875rem] font-medium normal-case tracking-normal`}>
        {isGoogleLoading ? spinner : <GoogleMark />}
        Continue with Google
      </Button>

      <p className="text-sm text-foreground/60">
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <Link href={isRegister ? props.loginHref : props.registerHref} aria-disabled={busy || undefined} onClick={(event) => onAuthLinkClick(event, isRegister ? "login" : "register")} className={`${textLinkClass} aria-disabled:pointer-events-none aria-disabled:opacity-50`}>
          {isRegister ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
