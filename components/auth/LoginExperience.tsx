"use client";

import Link from "next/link";
import { type FormEvent, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import BrandMark from "./BrandMark";
import LoginIllustration from "./LoginIllustration";

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
  onModeChange: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function LoginExperience({ email, password, error, isLoading, showPassword, verified, mode, firstName, lastName, confirmPassword, message, onFirstNameChange, onLastNameChange, onConfirmPasswordChange, onModeChange, onEmailChange, onPasswordChange, onTogglePassword, onSubmit }: LoginExperienceProps) {
  const reducedMotion = useReducedMotion();
  const isRegister = mode === "register";
  const direction = isRegister ? 1 : -1;
  const switched = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <div className="login-composition relative isolate mx-auto grid max-w-[1440px] overflow-hidden rounded-[28px] border border-[#e8e3ef] shadow-[0_24px_90px_-40px_rgba(57,39,91,0.2)] sm:rounded-[36px] lg:grid-cols-[55%_45%]">
      <LoginIllustration />
      <div className="login-form-area relative z-10 flex flex-col px-6 sm:px-12 lg:pl-8 lg:pr-12 xl:pl-12 xl:pr-20">
        <Link href="/" className="login-back login-focus group ml-auto inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs text-[#64616e] transition-colors hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> Back to home
        </Link>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={mode}
          custom={direction}
          data-mode={mode}
          initial="enter"
          exit="exit"
          variants={{
            enter: (travel: number) => ({ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : travel * 16 }),
            exit: (travel: number) => ({ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : travel * -16 }),
          }}
          onAnimationComplete={() => { if (switched.current) heading.current?.focus({ preventScroll: true }); }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="login-form-group mx-auto flex w-full max-w-[410px] flex-col"
        >
          <BrandMark />
          <h1 ref={heading} tabIndex={-1} className="login-heading text-[clamp(2.25rem,3.5vw,3rem)] font-medium leading-[1.08] tracking-[-0.055em]">{isRegister ? "Create your account" : "Welcome back"}</h1>
          <p className="login-subtitle text-sm leading-6 text-[#6c6877]">{isRegister ? "Start building your portfolio with Portory." : "Log in to your Portory account"}</p>

          {!isRegister && verified && <div className="login-status rounded-xl border border-[#b9e2d0] bg-[#f0fbf5] px-4 py-3 text-sm text-[#276749]" role="status">Email verified successfully. You can now sign in.</div>}

          <form onSubmit={onSubmit} className="login-fields" aria-busy={isLoading}>
            {isRegister && <div className="grid grid-cols-2 gap-3">
              <div><label htmlFor="first-name" className="mb-2 block text-xs font-medium text-[#494550]">First name</label><div className="login-input-wrap"><input id="first-name" name="firstName" required autoComplete="given-name" value={firstName} onChange={(event) => onFirstNameChange(event.target.value)} className="login-input w-full" /></div></div>
              <div><label htmlFor="last-name" className="mb-2 block text-xs font-medium text-[#494550]">Last name</label><div className="login-input-wrap"><input id="last-name" name="lastName" required autoComplete="family-name" value={lastName} onChange={(event) => onLastNameChange(event.target.value)} className="login-input w-full" /></div></div>
            </div>}
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium text-[#494550]">Email address</label>
              <div className="login-input-wrap">
                <Mail aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-[#827d8e]" />
                <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => onEmailChange(event.target.value)} className="login-input" aria-describedby={error ? "login-error" : undefined} />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-medium text-[#494550]">Password</label>
              <div className="login-input-wrap">
                <LockKeyhole aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-[#827d8e]" />
                <input id="password" name="password" type={showPassword ? "text" : "password"} required minLength={6} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Enter your password" value={password} onChange={(event) => onPasswordChange(event.target.value)} className="login-input" aria-describedby={error ? "login-error" : undefined} />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={onTogglePassword} className="login-focus -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#827d8e] hover:text-foreground">
                  {showPassword ? <EyeOff aria-hidden="true" className="h-[18px] w-[18px]" /> : <Eye aria-hidden="true" className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>
            {isRegister && <div><label htmlFor="confirm-password" className="mb-2 block text-xs font-medium text-[#494550]">Confirm password</label><div className="login-input-wrap"><LockKeyhole aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-[#827d8e]" /><input id="confirm-password" name="confirmPassword" type={showPassword ? "text" : "password"} required minLength={6} autoComplete="new-password" value={confirmPassword} onChange={(event) => onConfirmPasswordChange(event.target.value)} className="login-input" /></div></div>}
            {!isRegister && <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs">
              <label className="flex min-h-8 items-center gap-2 text-[#64616e]" title="Portory already keeps your session signed in on this browser.">
                <input type="checkbox" checked readOnly aria-readonly="true" className="login-focus h-4 w-4 rounded accent-[#6D5DF5]" /> Keep me signed in
              </label>
              <Link href="#" className="login-focus rounded py-2 font-medium text-[#5948cf] hover:underline">Forgot password?</Link>
            </div>
            }
            {message && <p role="status" className="text-sm text-[#64616e]">{message}</p>}
            {error && <p id="login-error" className="text-sm text-red-700" role="alert">{error}</p>}
            <button type="submit" disabled={isLoading} className="login-focus login-submit group inline-flex h-[54px] w-full items-center justify-center gap-3 rounded-[13px] px-5 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-70">
              {isLoading ? <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />{isRegister ? "Creating account..." : "Logging in..."}</> : <>{isRegister ? "Create account" : "Log in"} <ArrowRight aria-hidden="true" className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="login-separator flex items-center gap-4 text-xs text-[#827d8e]"><span className="h-px flex-1 bg-[#e6e3eb]" /><span>or</span><span className="h-px flex-1 bg-[#e6e3eb]" /></div>
          <button type="button" className="login-focus flex h-[54px] w-full items-center justify-center gap-3 rounded-[13px] border border-[#e2dfe7] bg-white text-sm font-medium transition-colors hover:bg-[#f7f5ff]">
            <span aria-hidden="true" className="text-base font-semibold text-[#4285f4]">G</span> Continue with Google
          </button>
          <p className="login-signup text-center text-xs leading-6 text-[#6c6877]">{isRegister ? "Already have an account? " : "New to Portory? "}<button type="button" disabled={isLoading} onClick={() => { switched.current = true; onModeChange(); }} className="login-focus rounded font-medium text-[#5948cf] hover:underline disabled:opacity-50">{isRegister ? "Log in" : "Create an account"}</button></p>
        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
