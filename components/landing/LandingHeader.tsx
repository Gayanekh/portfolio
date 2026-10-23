"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import AuthControls from "@/components/auth/AuthControls";
import Logo from "@/components/brand/Logo";
import FloatingCta from "@/components/landing/FloatingCta";
import { ease, focusRing } from "@/components/landing/landing-ui";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#templates", label: "Templates" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

// Scroll position (px) after which the full bar has left the screen and the
// compact bar takes over.
const SWAP_AT = 120;

// The section in view (its link stays marked), or null above the first one.
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.href.slice(1))).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    // A section counts once it crosses the upper third of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen.length) setActive(`#${seen[0].target.id}`);
        else if (window.scrollY < (sections[0].offsetTop ?? 0) - window.innerHeight / 3) setActive(null);
      },
      { rootMargin: "-33% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return active;
}

// The links, with a short black underline set below them that slides to the
// one hovered (or, when none is, rests under the section in view).
function Links({ active }: { active: string | null }) {
  const pill = useId();
  const [hovered, setHovered] = useState<string | null>(null);
  const lit = hovered ?? active;

  return (
    <ul onMouseLeave={() => setHovered(null)} className="m-0 ml-auto hidden list-none items-center gap-x-4 p-0 lg:flex xl:gap-x-6">
      {LINKS.map((link) => {
        const current = link.href === active;
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={current ? "location" : undefined}
              onMouseEnter={() => setHovered(link.href)}
              onFocus={() => setHovered(link.href)}
              onBlur={() => setHovered(null)}
              className={`${focusRing} relative flex items-center whitespace-nowrap rounded px-2 py-2 text-[15px] no-underline transition-colors duration-200 ${
                lit === link.href ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {lit === link.href && (
                <motion.span layoutId={pill} transition={{ type: "spring", stiffness: 420, damping: 36 }} className="absolute inset-x-2 -bottom-1.5 h-0.5 bg-foreground" />
              )}
              <span className="relative">{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// The bar's contents. `compact` is the slimmer version that stays at the top
// of the screen once the page scrolls; its contents sit exactly where the
// full bar's do.
// From lg the links sit in the bar; below lg a menu button opens them in a
// panel under the bar (with the sign-in buttons on phones, where the bar only
// has room for the logo and the menu button). Without `links` the bar holds
// only the logo and the account buttons, on every screen size.
function Bar({ compact, active, links }: { compact: boolean; active: string | null; links: boolean }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const close = () => setOpen(false);

  return (
    <div className="relative mx-auto w-full">
      <div
        onKeyDown={(event) => event.key === "Escape" && close()}
        className={`relative overflow-hidden transition-[background-color,box-shadow] duration-300 ${
          compact
            ? ""
            : `w-full rounded-2xl ${open ? "bg-white/95 shadow-[0_0_0_1px_rgb(0_0_0/0.05),0_20px_40px_-20px_rgb(0_0_0/0.25)] backdrop-blur-xl" : ""}`
        }`}
      >
        {/* One row: the logo left; the links, then the account buttons and
            menu, grouped on the right. Without links, the full bar drops its
            side padding so the logo and Log in line up with the page content. */}
        <div
          className={`flex items-center gap-x-3 xl:gap-x-4 ${
            compact ? "py-2 pl-4 pr-2 xl:pl-5" : links ? "p-3 xl:p-4 2xl:p-5" : "py-3 xl:py-4 2xl:py-5"
          }`}
        >
          <Link href="/" aria-label="Portory home" className={`${focusRing} flex shrink-0 items-center rounded`}>
            <Logo className={`${compact ? "h-8" : "h-9"} w-auto transition-[height] duration-300`} />
          </Link>

          {links && <Links active={active} />}

          <div className={`ml-auto flex shrink-0 items-center gap-2 [&_a]:no-underline ${links ? "lg:ml-6 xl:ml-10" : ""}`}>
            <div className={links ? "hidden sm:block" : undefined}>
              <AuthControls start={links} />
            </div>
            {links && (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((value) => !value)}
                className={`${focusRing} relative grid size-10 cursor-pointer place-items-center rounded bg-foreground text-white transition-colors hover:bg-foreground/85 lg:hidden`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid place-items-center"
                  >
                    {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={menuId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="overflow-hidden lg:hidden"
            >
              <motion.ul
                initial="hidden"
                animate="shown"
                variants={{ shown: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
                className="m-0 flex list-none flex-col border-t border-foreground/[0.06] p-2"
              >
                {LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    variants={{ hidden: { opacity: 0, x: -12 }, shown: { opacity: 1, x: 0, transition: { duration: 0.35, ease } } }}
                  >
                    <a
                      href={link.href}
                      onClick={close}
                      aria-current={link.href === active ? "location" : undefined}
                      className={`${focusRing} group flex items-baseline gap-4 rounded px-3 py-3.5 no-underline transition-colors hover:bg-foreground/[0.04]`}
                    >
                      <span className="font-mono text-xs tabular-nums text-foreground/35">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-2xl font-medium tracking-[-0.02em] text-foreground">{link.label}</span>
                      {link.href === active && <span aria-hidden="true" className="ml-auto size-1.5 self-center rounded-full bg-primary" />}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="border-t border-foreground/[0.06] p-4 sm:hidden [&_a]:no-underline">
                <AuthControls />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// At the top of the page the full bar sits in the page and scrolls away with
// it. Once it is gone, the compact bar slides down and floats just below the
// top of the screen: frosted white glass, rounded to suit its buttons and softly
// shadowed, the width of the page's content. Scrolling back to the top slides
// it away and the full bar is there. Other pages pass `links={false}` for the
// same header without the section links, the menu, Get started and the
// floating button.
export default function LandingHeader({ links = true }: { links?: boolean }) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const active = useActiveSection();

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > SWAP_AT));
  // Pick up the starting state when the page opens part-way down.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setCompact(scrollY.get() > SWAP_AT));
    return () => cancelAnimationFrame(frame);
  }, [scrollY]);

  return (
    <>
      {links && <FloatingCta />}
      <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        <nav
          aria-label="Main navigation"
          aria-hidden={compact || undefined}
          inert={compact}
          className="absolute left-1/2 top-5 z-[1000] -translate-x-1/2 w-content-width mx-auto"
        >
          <Bar compact={false} active={active} links={links} />
        </nav>
      </motion.div>
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[1000] flex justify-center">
        <AnimatePresence>
          {compact && (
            <motion.nav
              key="compact"
              aria-label="Main navigation"
              initial={{ y: "-130%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-130%", opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="pointer-events-auto w-[calc(100%-1.5rem)] rounded-xl bg-white/70 shadow-[0_0_0_1px_rgb(0_0_0/0.04),0_16px_40px_-20px_rgb(0_0_0/0.3)] backdrop-blur-2xl backdrop-saturate-150 sm:w-content-width"
            >
              <Bar compact active={active} links={links} />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
