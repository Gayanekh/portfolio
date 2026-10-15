"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Plus, X } from "lucide-react";
import AuthControls from "@/components/auth/AuthControls";
import BrandMark from "@/components/auth/BrandMark";
import { useLanding } from "@/components/landing/LandingProvider";
import FloatingCta from "@/components/landing/FloatingCta";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";

const LINKS = [
  { href: "#templates", label: "Templates" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

// Scroll position (px) after which the full bar has left the screen and the
// compact bar takes over.
const SWAP_AT = 120;

// The bar's contents. `compact` is the narrower, slightly smaller version.
// From lg the links sit in the bar; below lg a menu button opens them in a
// panel under the bar (with the sign-in buttons on phones, where the bar only
// has room for the logo and the menu button).
function Bar({ compact }: { compact: boolean }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const close = () => setOpen(false);

  return (
    <div
      data-nav-card={compact ? "true" : undefined}
      onKeyDown={(event) => event.key === "Escape" && close()}
      className={`mx-auto overflow-hidden rounded-3xl backdrop-blur-sm ${compact ? "w-[min(92%,36rem)] lg:w-[min(92%,48rem)] card" : "w-full"} ${open ? "bg-white/95 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.25)]" : ""}`}
    >
      <div className={`flex items-center gap-x-3 p-3 xl:gap-x-4 xl:p-4 2xl:gap-x-5 2xl:p-5 ${compact ? "[zoom:0.86]" : ""}`}>
        <Link href="/" aria-label="Portory home" className={`${focusRing} flex shrink-0 items-center gap-2 rounded-lg`}>
          <span className="block lg:hidden xl:block [&_img]:h-6"><BrandMark /></span>
        </Link>
        <ul className="m-0 hidden flex-1 list-none items-center justify-center gap-x-1 p-0 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${focusRing} block whitespace-nowrap rounded-full px-2.5 py-1.5 text-base font-medium no-underline transition-colors hover:bg-foreground/5 hover:text-foreground`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex shrink-0 items-center gap-2 [&_a]:no-underline">
          <div className="hidden sm:block">
            <AuthControls />
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className={`${focusRing} grid size-10 cursor-pointer place-items-center rounded-full bg-foreground/[0.06] text-foreground transition-colors hover:bg-foreground/10 lg:hidden`}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={menuId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="m-0 flex list-none flex-col border-t border-foreground/5 p-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={close}
                    className={`${focusRing} block rounded-2xl px-3 py-3 text-lg font-medium no-underline transition-colors hover:bg-foreground/5`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-foreground/5 p-4 sm:hidden [&_a]:no-underline">
              <AuthControls />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Header as in the reference recording: at the top of the page the full-width
// bar sits in the page and scrolls away with it. Once it is gone, the compact
// bar slides down from above the screen and stays fixed; scrolling back to the
// top slides it up again and the full bar is there.
export default function LandingHeader() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > SWAP_AT));
  // Pick up the starting state when the page opens part-way down.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setCompact(scrollY.get() > SWAP_AT));
    return () => cancelAnimationFrame(frame);
  }, [scrollY]);

  return (
    <>
      <FloatingCta />
      <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
        <nav
          aria-label="Main navigation"
          aria-hidden={compact || undefined}
          inert={compact}
          className="absolute left-1/2 top-5 z-[1000] -translate-x-1/2 w-content-width mx-auto"
        >
          <Bar compact={false} />
        </nav>
      </motion.div>
      <div className="pointer-events-none fixed inset-x-0 top-5 z-[1000] flex justify-center">
        <AnimatePresence>
          {compact && (
            <motion.nav
              key="compact"
              aria-label="Main navigation"
              initial={{ y: "-160%" }}
              animate={{ y: 0 }}
              exit={{ y: "-160%" }}
              transition={{ duration: 0.45, ease }}
              className="pointer-events-auto w-content-width"
            >
              <Bar compact />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
