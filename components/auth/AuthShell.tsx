"use client";

import Link from "next/link";
import { createContext, useContext, useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthBadge from "@/components/auth/AuthBadge";
import AuthGlow from "@/components/auth/AuthGlow";
import { authSans, authSerif } from "@/components/auth/auth-fonts";
import { requestHeadingFocus } from "@/components/auth/LoginExperience";
import { fluidText } from "@/components/landing/landing-ui";
import { getSafeNext } from "@/lib/auth-routing";

type AuthMode = "login" | "register" | "recover";

// Lets the form tell the shell a submission is in flight, so its switch link
// stays inert like the form's own link.
const AuthBusyContext = createContext<(busy: boolean) => void>(() => {});
export const useSetAuthBusy = () => useContext(AuthBusyContext);

// The headline (three staggered lines, the last indented), the two small notes
// set beside it, and the link inviting you to the other mode.
const copy = {
  login: {
    lines: ["Welcome", "back to your", "portfolio"],
    noteTop: "Portory is where designers, photographers and makers shape their work into a portfolio worth sharing.",
    noteSide: "Log in to pick up where you left off. Your templates and every edit are waiting.",
    switchLead: "New here?",
    switchAction: "Create an account",
    target: "register",
  },
  register: {
    lines: ["Where", "your work finds", "its stage"],
    noteTop: "Choose a template, make it yours and publish a portfolio that tells your story.",
    noteSide: "Create your account in a minute. No card needed, just your name and email.",
    switchLead: "Have an account?",
    switchAction: "Log in",
    target: "login",
  },
  // Forgot password and choosing a new one.
  recover: {
    lines: ["A fresh", "start for your", "password"],
    noteTop: "It happens to everyone. A secure link sends you straight to a new password.",
    noteSide: "Your portfolio, templates and every edit stay exactly as you left them.",
    switchLead: "Remembered it?",
    switchAction: "Log in",
    target: "login",
  },
} as const;

// Entrance animations (tailwindcss-animate); none with reduced motion.
const enter = "animate-in fill-mode-both motion-reduce:animate-none";
const note = "m-0 max-w-[26ch] text-[11.5px] leading-[1.5] text-foreground/75";

// The auth page as a quiet editorial spread: soft grey and gold glows on an
// off-white page, a large light serif headline in staggered lines with small
// notes beside it, the form on the right, a turning badge and long arrow at
// the edge, and a thin labelled rule along the bottom. On desktop it fits one
// screen; below 861px the parts stack and the page scrolls. Shared by the
// /login, /register, /forgot-password and /reset-password pages.
export default function AuthShell({ header, children }: { header: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const mode: AuthMode = pathname === "/register" ? "register" : pathname === "/forgot-password" || pathname === "/reset-password" ? "recover" : "login";
  const text = copy[mode];

  // Switch to the other mode, carrying a non-default destination along.
  function onSwitch(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (busy) return;
    const next = getSafeNext(new URLSearchParams(window.location.search).get("next"));
    const query = next === getSafeNext(null) ? "" : `?${new URLSearchParams({ next })}`;
    const href = `/${text.target}${query}`;
    requestHeadingFocus();
    router.push(href);
  }

  return (
    <AuthBusyContext.Provider value={setBusy}>
      <div className={`${authSans.className} relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#f1f0ee] text-foreground antialiased min-[861px]:h-dvh`}>
        <AuthGlow />

        <header className="flex min-h-11 items-center justify-between gap-3 px-4 pt-4 sm:px-6 min-[861px]:px-12 min-[861px]:pt-6">{header}</header>

        <div className="grid flex-1 gap-14 px-4 pb-10 pt-10 sm:px-6 min-[861px]:min-h-0 min-[861px]:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] min-[861px]:items-center min-[861px]:gap-16 min-[861px]:px-12 min-[861px]:py-6 min-[1101px]:pl-[8vw] min-[1101px]:pr-[9vw]">
          {/* Headline, its notes and the switch link */}
          <section key={mode} className="grid gap-10">
            <div className={`${authSerif.className} ${fluidText.authTitle} font-light leading-[0.98] tracking-[-0.025em]`}>
              <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
                <p className={`${enter} fade-in slide-in-from-bottom-4 duration-700 m-0`}>{text.lines[0]}</p>
                <p className={`${enter} ${authSans.className} fade-in delay-500 duration-700 ${note} mt-[0.4em] tracking-normal`}>{text.noteTop}</p>
              </div>
              <p className={`${enter} fade-in slide-in-from-bottom-4 delay-100 duration-700 m-0`}>{text.lines[1]}</p>
              <div className="flex flex-wrap-reverse items-end gap-x-8 gap-y-4 min-[861px]:flex-nowrap">
                <p className={`${enter} ${authSans.className} fade-in delay-700 duration-700 ${note} mb-[0.35em] max-w-[24ch] tracking-normal min-[861px]:w-[clamp(150px,13vw,210px)] min-[861px]:shrink-0`}>{text.noteSide}</p>
                <p className={`${enter} fade-in slide-in-from-bottom-4 delay-200 duration-700 m-0`}>{text.lines[2]}</p>
              </div>
            </div>

            <div className={`${enter} fade-in delay-700 duration-700 flex items-center gap-5`}>
              <AuthBadge text="Portory · Portfolios · " />
              <p className="m-0 grid gap-1">
                <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/55">{text.switchLead}</span>
                <Link
                  href={`/${text.target}`}
                  onClick={onSwitch}
                  aria-disabled={busy || undefined}
                  className={`${authSerif.className} group inline-flex items-center gap-3 text-[22px] font-light text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50`}
                >
                  {text.switchAction}
                  <svg aria-hidden="true" viewBox="0 0 48 12" className="w-10 transition-transform duration-500 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M0 6h47M41 1l6 5-6 5" />
                  </svg>
                </Link>
              </p>
            </div>
          </section>

          {/* The form */}
          <section className={`${enter} fade-in slide-in-from-bottom-6 delay-300 duration-700 w-full max-w-[380px] min-[861px]:max-h-full min-[861px]:justify-self-end min-[861px]:overflow-y-auto min-[861px]:py-2`}>
            {children}
          </section>
        </div>

        {/* Turning badge and long arrow at the right edge */}
        <div aria-hidden="true" className="pointer-events-none absolute right-5 top-[24%] hidden flex-col items-center gap-3 min-[1101px]:flex">
          <AuthBadge text="Sign in · Portory · " />
          <svg viewBox="0 0 24 180" className="h-[22vh] max-h-[180px] w-6 text-foreground" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 0v178M2 166c5 2 9 6 10 12 1-6 5-10 10-12" />
          </svg>
        </div>

        {/* Thin labelled rule along the bottom */}
        <footer className="flex items-center gap-6 px-4 pb-5 text-[12px] font-semibold sm:px-6 min-[861px]:px-12 min-[1101px]:pl-[8vw] min-[1101px]:pr-[9vw]">
          <span>Portfolios that open doors</span>
          <span aria-hidden="true" className={`${enter} fade-in slide-in-from-left-8 duration-1000 h-px flex-1 bg-foreground/30`} />
          <span>Portory</span>
        </footer>
      </div>
    </AuthBusyContext.Provider>
  );
}
