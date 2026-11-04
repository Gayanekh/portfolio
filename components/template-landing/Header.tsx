"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AuthControls from "@/components/auth/AuthControls";
import { useAccount } from "@/components/auth/useAccount";
import Logo from "@/components/brand/Logo";
import { LOGIN, NAV, REGISTER, START } from "@/components/template-landing/content";
import { ease, focusRing, frame, type } from "@/components/template-landing/ui";

// Signed out: Log in (and, in the menu, Create an account). Signed in: the
// account itself with its menu, as everywhere on Portory, in this page's ink.
function Account({ menu = false, onPick }: { menu?: boolean; onPick?: () => void }) {
  const { account } = useAccount();
  if (account)
    return (
      <div className="[--foreground:var(--fg)]">
        <AuthControls start={false} />
      </div>
    );
  const quiet = `${focusRing} rounded-[4px] ${menu ? type.body : "text-[1.125rem]"} text-[var(--dim)] no-underline transition-colors duration-300 hover:text-[var(--fg)]`;
  return (
    <div className={`flex items-center ${menu ? "gap-6" : "gap-[clamp(1rem,2vw,2rem)]"}`}>
      <Link href={LOGIN.href} onClick={onPick} className={quiet}>
        {LOGIN.label}
      </Link>
      {menu && (
        <Link href={REGISTER.href} onClick={onPick} className={quiet}>
          {REGISTER.label}
        </Link>
      )}
    </div>
  );
}

// A word that rolls on hover, after the reference: each letter slides up out
// of view, one a moment after the other, as its copy rises from below.
function Roll({ text }: { text: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="sr-only">{text}</span>
      {[0, 1].map((copy) => (
        <span key={copy} aria-hidden="true" className={copy ? "absolute inset-0 block" : "block"}>
          {[...text].map((letter, i) => (
            <span
              key={i}
              style={{ transitionDelay: `${i * 15}ms` }}
              className={`inline-block whitespace-pre transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${copy ? "translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0" : "group-hover:-translate-y-full group-focus-visible:-translate-y-full"}`}
            >
              {letter}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

// The header, as on the Monolog reference: no row of links, only the
// wordmark on the left and Menu on the right, at the top of the page (not fixed),
// which opens the side panel (below); Escape, the veil, the close button or
// a link closes it.
export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* As on the Monolog reference: the wordmark at the top left and the menu
          button at the top right, on the frame's edges; they sit at the top of the
          page and scroll away with it (not fixed). */}
      <div className="pointer-events-none absolute inset-x-0 top-[clamp(0.75rem,2vh,1.25rem)] z-50">
        <div className={`${frame} flex items-center justify-between`}>
          <Link href="/" aria-label="Portory home" className={`${focusRing} pointer-events-auto flex h-11 items-center rounded-[4px]`}>
            {/* The plain wordmark, as /other-landing's header has it (the user asked). */}
            <Logo className="h-7 w-auto !text-[var(--fg)]" title={null} />
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="template-landing-menu"
            onClick={() => setOpen(!open)}
            className={`${focusRing} group/menu pointer-events-auto flex h-11 cursor-pointer items-stretch gap-[5px] rounded-[10px] border-0 bg-transparent p-0 ${type.small} font-medium text-[var(--fg)]`}
          >
            {/* Two outlined parts, "menu" and the lines, rounded, a small space between
                them; pointed at (or focused, or open) the space closes, the seam goes and
                they read as one outlined button. */}
            <span className={`flex items-center rounded-[10px] border border-solid border-[var(--fg)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] px-4 backdrop-blur-xl transition-[border-radius,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/menu:rounded-r-none group-hover/menu:border-r-transparent group-focus-visible/menu:rounded-r-none group-focus-visible/menu:border-r-transparent ${open ? "rounded-r-none border-r-transparent" : ""}`}>menu</span>
            <span className={`grid w-11 place-items-center rounded-[10px] border border-solid border-[var(--fg)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-xl transition-[border-radius,margin,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/menu:-ml-[6px] group-hover/menu:rounded-l-none group-hover/menu:border-l-transparent group-focus-visible/menu:-ml-[6px] group-focus-visible/menu:rounded-l-none group-focus-visible/menu:border-l-transparent ${open ? "-ml-[6px] rounded-l-none border-l-transparent" : ""}`}>
              <span aria-hidden="true" className="relative block h-[9px] w-4">
                <span className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ${open ? "translate-y-[3.75px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`} />
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* The menu, after the Monolog reference: the page veiled in a warm grey and a
          dark panel sliding in from the right, holding the wordmark and a close
          button, the sections set large between hairlines (each word rolling up
          letter by letter on hover), the start button and the account at its foot. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="veil" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} onClick={() => setOpen(false)} className="fixed inset-0 z-[60] bg-[rgb(105_102_99/0.3)]" />
            <motion.nav
              key="panel"
              id="template-landing-menu"
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[29rem] flex-col bg-[#0f0f0f] px-10 pb-10 pt-10 text-[#f8f7f6] max-sm:px-6"
            >
              <div className="flex items-center justify-between">
                <Link href="/" aria-label="Portory home" onClick={() => setOpen(false)} className={`${focusRing} rounded-[4px]`}>
                  <Logo className="h-[1.6rem] w-auto !text-[#f8f7f6]" title={null} />
                </Link>
                <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className={`${focusRing} grid size-10 cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent p-0 text-[#f8f7f6]`}>
                  <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
                </button>
              </div>

              <ul className="m-0 mt-auto flex list-none flex-col p-0">
                {NAV.map((link, i) => (
                  <motion.li key={link.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.05 }} className={i ? "border-0 border-t border-solid border-white/15" : ""}>
                    <a href={link.href} onClick={() => setOpen(false)} className={`${focusRing} group block rounded-[4px] py-2.5 text-[2rem] font-normal leading-[1.2] tracking-[-0.01em] text-[#f8f7f6] no-underline`}>
                      <Roll text={link.label} />
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.25 + NAV.length * 0.05 }} className="mt-10">
                <Link href={START.href} onClick={() => setOpen(false)} className={`${focusRing} grid h-14 place-items-center rounded-[8px] bg-[#f8f7f6] text-[1.0625rem] text-[#0f0f0f] no-underline transition-opacity hover:opacity-85`}>
                  {START.label}
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease, delay: 0.5 }} className="mt-auto pt-12 [--dim:rgb(248_247_246/0.6)] [--fg:#f8f7f6]">
                <Account menu onPick={() => setOpen(false)} />
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
