"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
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
  const quiet = `${focusRing} rounded-[4px] ${menu ? type.body : "block text-[0.9375rem] leading-[1.3] tracking-[-0.01em]"} text-[var(--dim)] no-underline transition-colors duration-300 hover:text-[var(--fg)]`;
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
// On another page (`base`, e.g. "/" from /templates) the section links lead back
// to the home page's sections; with `sections={false}` there are none (only the
// wordmark and the account, on every screen, and no menu).
// `width` sets the row's width (the page's own frame by default), so the wordmark and
// the account line up with another page's content.
export default function Header({ base = "", sections = true, width = frame }: { base?: string; sections?: boolean; width?: string } = {}) {
  const [open, setOpen] = useState(false);
  // At the top the header sits on the page; scrolling down it moves away with the
  // page; scrolling back up it slides in, fixed at the top on a white bar, and stays
  // until the page scrolls down again (the user asked). Below the first screen's top
  // 80px a little scrolling either way is ignored, so it does not flicker.
  const still = useReducedMotion();
  const { scrollY } = useScroll();
  const last = useRef(0);
  const [pinned, setPinned] = useState(false);
  const [away, setAway] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - last.current;
    last.current = y;
    if (y < 80) {
      setPinned(false);
      setAway(false);
      return;
    }
    if (delta > 4) setAway(true);
    else if (delta < -4) {
      setAway(false);
      setPinned(true);
    }
  });
  const hidden = away && !open;
  const floating = pinned && !hidden;
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Open, no box (the user chose it, to match the type-only hero): the wordmark
          on the frame's left edge, above "Your website,"; on the right edge, on wide
          screens, the sections as small soft grey links, close together, turning dark on hover, and,
          a little apart, the account (Log in); below lg the Menu button (the word and
          its two lines) opening the panel. Fixed, shown on the way back up (above). */}
      <motion.div
        initial={false}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={still ? { duration: 0 } : { duration: 0.45, ease }}
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 py-[clamp(0.75rem,2vh,1.25rem)] transition-[background-color,backdrop-filter] duration-300 ${floating ? "bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-xl" : "bg-transparent"}`}
      >
        <div className={`${width} flex h-12 items-center justify-between`}>
          <div className="contents">
            <Link href="/" aria-label="Portory home" className={`${focusRing} pointer-events-auto flex h-11 items-center rounded-[4px]`}>
              {/* The logo in its own colour (#2d2d2d), a little small (the user asked). */}
              <Logo className="h-[1.3rem] w-auto" title={null} />
            </Link>
            <nav aria-label="Sections" className={`pointer-events-auto flex items-center ${sections ? "max-lg:hidden" : ""}`}>
              {sections && (
                <ul className="m-0 flex list-none items-center gap-[clamp(1rem,1.4vw,1.5rem)] p-0">
                  {NAV.filter((link) => link.href !== "#faq").map((link) => (
                    <li key={link.href}>
                      <a href={base + link.href} className={`${focusRing} block rounded-[4px] text-[0.9375rem] font-normal leading-[1.3] tracking-[-0.01em] text-[var(--dim)] no-underline transition-colors duration-300 hover:text-[var(--fg)]`}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {sections && <span aria-hidden="true" className="mx-[clamp(1rem,1.4vw,1.5rem)] block h-4 w-px bg-[var(--line)]" />}
              <Account />
            </nav>
            {sections && (
              <button
                type="button"
                aria-expanded={open}
                aria-controls="template-landing-menu"
                onClick={() => setOpen(!open)}
                className={`${focusRing} group/menu pointer-events-auto -mr-1 flex lg:hidden h-11 cursor-pointer items-center gap-3 rounded-[4px] border-0 bg-transparent px-1 text-[1.0625rem] font-medium leading-none tracking-[-0.01em] text-[var(--fg)]`}
              >
                Menu
                {/* Two equal lines in the word's own stroke and height (round ends, as the
                  letters'), so the icon reads as part of the word; on hover they draw closer. */}
                <span aria-hidden="true" className="relative block h-[0.55em] w-[1.15em] transition-transform duration-300 group-hover/menu:scale-x-[0.8]">
                  <span className={`absolute left-0 top-0 h-[0.1em] w-full rounded-full bg-current transition-transform duration-500 ${open ? "translate-y-[0.225em] rotate-45" : ""}`} />
                  <span className={`absolute bottom-0 left-0 h-[0.1em] w-full rounded-full bg-current transition-transform duration-500 ${open ? "-translate-y-[0.225em] -rotate-45" : ""}`} />
                </span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* The menu: a light panel (the user asked; the page's soft grey) sliding in from
          the right over a faint veil, holding the wordmark and a close button, the
          sections between hairlines (each word rolling up letter by letter on hover),
          an outlined start button and the account, small, at its foot. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="veil" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} onClick={() => setOpen(false)} className="fixed inset-0 z-[60] bg-[rgb(13_13_13/0.12)]" />
            <motion.nav
              key="panel"
              id="template-landing-menu"
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[24rem] flex-col border-0 border-l border-solid border-[rgb(13_13_13/0.08)] bg-[#f3f3f1] px-8 pb-8 pt-8 text-[#0d0d0d] shadow-[-24px_0_60px_-30px_rgb(0_0_0/0.25)] max-sm:px-6"
            >
              <div className="flex items-center justify-between">
                <Link href="/" aria-label="Portory home" onClick={() => setOpen(false)} className={`${focusRing} rounded-[4px]`}>
                  <Logo className="h-7 w-auto !text-[#0d0d0d]" title={null} />
                </Link>
                <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className={`${focusRing} grid size-10 cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent p-0 text-[#0d0d0d]`}>
                  <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
                </button>
              </div>

              <ul className="m-0 mt-auto flex list-none flex-col p-0">
                {NAV.map((link, i) => (
                  <motion.li key={link.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.05 }} className="border-0 border-t border-solid border-[rgb(13_13_13/0.11)] last:border-b">
                    <a href={base + link.href} onClick={() => setOpen(false)} className={`${focusRing} group block rounded-[4px] py-3 text-[clamp(1.625rem,2vw,1.875rem)] font-normal leading-[1.2] tracking-[-0.03em] text-[#0d0d0d] no-underline`}>
                      <Roll text={link.label} />
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.25 + NAV.length * 0.05 }} className="mt-10">
                <Link
                  href={START.href}
                  onClick={() => setOpen(false)}
                  className={`${focusRing} grid h-12 place-items-center rounded-[10px] border border-solid border-[#0d0d0d] bg-transparent text-[1rem] font-medium text-[#0d0d0d] no-underline transition-colors duration-300 hover:bg-[#0d0d0d] hover:text-[#f3f3f1]`}
                >
                  {START.label}
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease, delay: 0.5 }} className="mt-auto pt-10 text-[0.9375rem] [--dim:#6b6b6b] [--fg:#0d0d0d]">
                <Account menu onPick={() => setOpen(false)} />
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
