"use client";

import Link from "next/link";
import { type FormEvent, type MouseEvent, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Set by the auth links so the next route's heading takes focus on mount.
let focusHeadingOnMount = false;
const requestHeadingFocus = () => { focusHeadingOnMount = true; };

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
const fieldClass = "grid gap-[7px]";
// Labels stay for assistive tech; placeholders carry the visible prompt.
const labelClass = "sr-only";
// Field size and type, plus the soft hover shadow kept for these auth fields;
// the shared Input supplies border, radius and the other states.
const inputClass =
  "h-[46px] w-full min-w-0 px-3.5 text-base font-normal text-foreground placeholder:text-muted-foreground transition-[color,background-color,border-color,box-shadow] hover:shadow-[0_0.25rem_0.25rem_0_rgb(6_3_24/0.03)] read-only:hover:shadow-none disabled:hover:shadow-none";
const textLinkClass = `${focusRing} rounded font-semibold text-foreground underline decoration-1 underline-offset-[3px]`;

interface LoginExperienceProps {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
  showPassword: boolean;
  verified: boolean;
  mode: "login" | "register";
  firstName: string;
  lastName: string;
  confirmPassword: string;
  message: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  loginHref: string;
  registerHref: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function LoginExperience({ email, password, error, isLoading, showPassword, verified, mode, firstName, lastName, confirmPassword, message, onFirstNameChange, onLastNameChange, onConfirmPasswordChange, loginHref, registerHref, onEmailChange, onPasswordChange, onTogglePassword, onSubmit }: LoginExperienceProps) {
  const isRegister = mode === "register";
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusHeadingOnMount) {
      focusHeadingOnMount = false;
      heading.current?.focus({ preventScroll: true });
    }
  }, []);

  // Auth links stay inert while a submission is in flight.
  function onAuthLinkClick(event: MouseEvent<HTMLAnchorElement>, target: "login" | "register") {
    if (isLoading || target === mode) {
      event.preventDefault();
      return;
    }
    requestHeadingFocus();
  }

  const describedBy = error ? "login-error" : undefined;

  return (
    <div data-mode={mode} className="group/auth flex flex-1 flex-col">
      <div className="mx-auto my-auto grid w-full max-w-[400px] gap-[18px] pb-6 pt-7 min-[861px]:py-6">

        <div className="grid gap-2 text-center">
          <h1 ref={heading} tabIndex={-1} className="text-[clamp(30px,3vw,38px)] font-semibold leading-[1.05] tracking-[-0.04em] outline-none">{isRegister ? "Welcome to Portory" : "Welcome back"}</h1>
          <p className="text-[15.5px] text-muted-foreground">{isRegister ? "Create your account and start building your portfolio." : "Log in to keep editing your portfolio."}</p>
        </div>

        {!isRegister && verified && <div data-status className="rounded-xl bg-success/10 px-3.5 py-2.5 text-sm text-success-foreground" role="status">Email verified successfully. You can now sign in.</div>}

        <form onSubmit={onSubmit} className="grid gap-3.5" aria-busy={isLoading}>
          {isRegister && <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
            <div className={fieldClass}><label htmlFor="first-name" className={labelClass}>First name</label><Input id="first-name" name="firstName" required autoComplete="given-name" placeholder="Enter first name" value={firstName} onChange={(event) => onFirstNameChange(event.target.value)} className={inputClass} /></div>
            <div className={fieldClass}><label htmlFor="last-name" className={labelClass}>Last name</label><Input id="last-name" name="lastName" required autoComplete="family-name" placeholder="Enter last name" value={lastName} onChange={(event) => onLastNameChange(event.target.value)} className={inputClass} /></div>
          </div>}
          <div className={fieldClass}>
            <label htmlFor="email" className={labelClass}>Email</label>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="Enter email address" value={email} onChange={(event) => onEmailChange(event.target.value)} className={inputClass} aria-describedby={describedBy} />
          </div>
          <div className={fieldClass}>
            <label htmlFor="password" className={labelClass}>Password</label>
            <div className="relative">
              <Input id="password" name="password" type={showPassword ? "text" : "password"} required minLength={6} autoComplete={isRegister ? "new-password" : "current-password"} placeholder={isRegister ? "Create a password" : "Enter password"} value={password} onChange={(event) => onPasswordChange(event.target.value)} className={`${inputClass} pr-[70px]`} aria-describedby={isRegister ? ["password-hint", describedBy].filter(Boolean).join(" ") : describedBy} />
              <button type="button" aria-pressed={showPassword} onClick={onTogglePassword} className={`${focusRing} absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[13.5px] font-semibold text-foreground`}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {isRegister && <p id="password-hint" className="text-[13px] leading-[1.45] text-muted-foreground">At least 6 characters.</p>}
            {!isRegister && <p className="mt-0.5 text-right text-[13.5px]"><Link href="#" className={`${focusRing} rounded font-medium text-foreground underline decoration-1 underline-offset-[3px]`}>Forgot password?</Link></p>}
          </div>
          {isRegister && <div className={fieldClass}>
            <label htmlFor="confirm-password" className={labelClass}>Confirm password</label>
            <Input id="confirm-password" name="confirmPassword" type={showPassword ? "text" : "password"} required minLength={6} autoComplete="new-password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => onConfirmPasswordChange(event.target.value)} className={inputClass} aria-describedby={describedBy} />
          </div>}
          {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
          {error && <p id="login-error" className="text-[13.5px] font-normal text-destructive" role="alert">{error}</p>}
          <Button type="submit" disabled={isLoading} className={`${focusRing} mt-1.5 h-[50px] w-full gap-2.5 rounded-full bg-foreground px-5 text-[15px] font-semibold text-white shadow-none transition-[background-color,transform] duration-150 hover:bg-foreground/90 focus-visible:ring-0 enabled:active:translate-y-px disabled:pointer-events-auto disabled:cursor-wait disabled:opacity-60`}>
            {isLoading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {isLoading ? (isRegister ? "Creating account..." : "Logging in...") : (isRegister ? "Create Account" : "Log In")}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {isRegister ? "Already have an account? " : "New to Portory? "}
        <Link href={isRegister ? loginHref : registerHref} aria-disabled={isLoading || undefined} onClick={(event) => onAuthLinkClick(event, isRegister ? "login" : "register")} className={`${textLinkClass} aria-disabled:pointer-events-none aria-disabled:opacity-50`}>
          {isRegister ? "Log in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
