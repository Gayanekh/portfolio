"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import AuthControls from "@/components/auth/AuthControls";
import { useAccount } from "@/components/auth/useAccount";
import Logo from "@/components/brand/Logo";
import { LOGIN, NAV, REGISTER, START } from "@/components/template-landing/content";
import { corner, cornerLink, ease, focusRing, frame, grid, type } from "@/components/template-landing/ui";

// Signed out: Log in (and, in the menu, Create an account). Signed in: the
// account itself with its menu, as everywhere on Portory, in this page's ink.
function Account({ menu = false, hidden = false, onPick }: { menu?: boolean; hidden?: boolean; onPick?: () => void }) {
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
      <Link href={LOGIN.href} tabIndex={hidden ? -1 : undefined} onClick={onPick} className={quiet}>
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

// The scroll position after which the top bar hands over to the pill.
const SWAP_AT = 140;

// The header, in two states that cross-fade (neither moves, so nothing
// shakes). At the top, a bar in the grid's columns: the wordmark, the
// sections, and Log in (or the account) and Get started with its corner bracket. Once the page
// scrolls, a small outlined pill in the middle, the wordmark and Menu,
// which opens a panel with the sections, the start link and the account; Escape or a
// link closes it. On phones only the pill shows.
export default function Header() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  // Only crossing the line changes anything, so scrolling re-renders nothing.
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > SWAP_AT));
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* The top bar. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-500 max-lg:hidden ${compact ? "pointer-events-none opacity-0" : "opacity-100"}`}
        aria-hidden={compact || undefined}
      >
        <div className={`${frame} ${grid} h-[4.5rem] items-center`}>
          <Link href="/" aria-label="Portory home" tabIndex={compact ? -1 : undefined} className={`${focusRing} w-fit rounded-[4px] lg:pl-0`}>
            <Logo className="h-[1.4rem] w-auto !text-[var(--fg)]" title={null} />
          </Link>
          <nav aria-label="Sections" className="hidden lg:col-span-2 lg:flex lg:justify-center">
            <ul className="m-0 flex list-none gap-[clamp(1rem,2vw,2rem)] p-0">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a href={link.href} tabIndex={compact ? -1 : undefined} className={`${focusRing} rounded-[4px] ${type.body} text-[var(--dim)] no-underline transition-colors duration-300 hover:text-[var(--fg)]`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden items-center justify-end gap-[clamp(1rem,2vw,2rem)] lg:flex">
            <Account hidden={compact} />
            <Link href={START.href} tabIndex={compact ? -1 : undefined} className={`${cornerLink} text-[1.125rem]`}>
              {START.label}
              <span aria-hidden="true" className={corner} />
            </Link>
          </div>
        </div>
      </header>

      {/* The pill, once the page has scrolled (always on phones). */}
      <div className={`fixed inset-x-0 top-[clamp(0.75rem,2vh,1.25rem)] z-50 flex justify-center px-4 transition-opacity duration-500 ${compact ? "opacity-100" : "pointer-events-none opacity-0 max-lg:pointer-events-auto max-lg:opacity-100"}`}>
        <div className="relative">
          <div className="flex h-11 items-center gap-1 rounded-[10px] border border-solid border-[var(--fg)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] pl-5 pr-1.5 backdrop-blur-xl">
            <Link href="/" aria-label="Portory home" className={`${focusRing} rounded-[4px] pr-4`}>
              <Logo className="h-[1.15rem] w-auto !text-[var(--fg)]" title={null} />
            </Link>
            <span aria-hidden="true" className="h-full w-px bg-[color-mix(in_srgb,var(--fg)_30%,transparent)]" />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="template-landing-menu"
              onClick={() => setOpen(!open)}
              className={`${focusRing} flex h-9 cursor-pointer items-center gap-3 rounded-[6px] border-0 bg-transparent px-3 ${type.small} font-medium text-[var(--fg)]`}
            >
              Menu
              <span aria-hidden="true" className="relative block h-2 w-4">
                <span className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.nav
                id="template-landing-menu"
                aria-label="Menu"
                initial={{ opacity: 0, y: -8, clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0, y: -8, clipPath: "inset(0% 0% 100% 0%)" }}
                transition={{ duration: 0.45, ease }}
                className="absolute left-1/2 top-[calc(100%+0.5rem)] flex w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-5 rounded-[10px] border border-solid border-[var(--fg)] bg-[var(--card)] p-5"
              >
                <ul className="m-0 flex list-none flex-col p-0">
                  {NAV.map((link, i) => (
                    <motion.li key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease, delay: 0.05 + i * 0.04 }}>
                      <a href={link.href} onClick={() => setOpen(false)} className={`${focusRing} block rounded-[4px] py-1.5 ${type.name} text-[var(--fg)] no-underline transition-colors hover:text-[var(--accent)]`}>
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
                <Link href={START.href} onClick={() => setOpen(false)} className={`${cornerLink} text-[1.0625rem]`}>
                  {START.label}
                  <span aria-hidden="true" className={corner} />
                </Link>
                <div className="border-0 border-t border-solid border-[var(--line)] pt-4">
                  <Account menu onPick={() => setOpen(false)} />
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
