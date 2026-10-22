"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import AuthControls from "@/components/auth/AuthControls";
import Logo from "@/components/brand/Logo";
import FloatingCta, { CreateButton, frostedCard, useHeroCtaGone } from "@/components/landing/FloatingCta";
import { ease, focusRing } from "@/components/landing/landing-ui";

const LINKS = [
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

// The links, with a highlight that slides to the one hovered (or, when none
// is, to the section in view, marked by a dot as well).
function Links({ active }: { active: string | null }) {
  const pill = useId();
  const [hovered, setHovered] = useState<string | null>(null);
  const lit = hovered ?? active;

  return (
    <ul onMouseLeave={() => setHovered(null)} className="m-0 hidden flex-1 list-none items-center justify-center gap-x-0.5 p-0 lg:flex">
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
              className={`${focusRing} relative flex items-center gap-2 whitespace-nowrap rounded px-3.5 py-2 text-[15px] font-medium no-underline transition-colors duration-200 ${
                lit === link.href ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {lit === link.href && (
                <motion.span layoutId={pill} transition={{ type: "spring", stiffness: 420, damping: 36 }} className="absolute inset-0 rounded bg-foreground/[0.06]" />
              )}
              <AnimatePresence initial={false}>
                {current && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    aria-hidden="true"
                    className="relative size-1.5 rounded-full bg-primary"
                  />
                )}
              </AnimatePresence>
              <span className="relative">{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// The bar's contents. `compact` is the narrower, floating version (frosted,
// with the reading progress along its bottom edge). From lg the links sit in
// the bar; below lg a menu button opens them in a panel under the bar (with
// the sign-in buttons on phones, where the bar only has room for the logo and
// the menu button).
function Bar({ compact, active, heroCtaGone = false }: { compact: boolean; active: string | null; heroCtaGone?: boolean }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const close = () => setOpen(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 });

  return (
    <div className={`relative mx-auto ${compact ? "w-[min(92%,36rem)] lg:w-[min(92%,48rem)]" : "w-full"}`}>
      {/* From xl, once the hero's button has scrolled away, "Create your
          portfolio" sits beside the compact bar: the same height, top and card */}
      <AnimatePresence>
        {compact && heroCtaGone && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.4, ease }}
            className="absolute inset-y-0 right-full mr-2.5 hidden xl:flex"
          >
            <CreateButton />
          </motion.div>
        )}
      </AnimatePresence>
      <div
        onKeyDown={(event) => event.key === "Escape" && close()}
        className={`relative overflow-hidden transition-[background-color,box-shadow] duration-300 ${
          compact
            ? frostedCard
            : `w-full rounded-2xl ${open ? "bg-white/95 shadow-[0_0_0_1px_rgb(0_0_0/0.05),0_20px_40px_-20px_rgb(0_0_0/0.25)] backdrop-blur-xl" : ""}`
        }`}
      >
        <div className={`flex items-center gap-x-3 xl:gap-x-4 ${compact ? "p-2.5 pl-4 [zoom:0.86] xl:p-3 xl:pl-5" : "p-3 xl:p-4 2xl:p-5"}`}>
          <Link href="/" aria-label="Portory home" className={`${focusRing} flex shrink-0 items-center rounded`}>
            <span className="block lg:hidden xl:block">
              <Logo className={`${compact ? "h-8" : "h-9"} w-auto transition-[height] duration-300`} />
            </span>
          </Link>

          <Links active={active} />

          <div className="ml-auto flex shrink-0 items-center gap-2 [&_a]:no-underline">
            {/* Scrolled, "Create your portfolio" leads to the templates, so the bar leaves out Get started and shows the account as its avatar */}
            <div className="hidden sm:block">
              <AuthControls start={!compact} avatarOnly={compact} />
            </div>
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

        {/* The compact bar's reading progress, along its bottom edge */}
        {compact && <motion.span aria-hidden="true" style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary" />}
      </div>
    </div>
  );
}

// At the top of the page the full-width bar sits in the page and scrolls away
// with it. Once it is gone, the compact bar slides down from above the screen
// and stays fixed; scrolling back to the top slides it up again and the full
// bar is there.
export default function LandingHeader() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const active = useActiveSection();
  const heroCtaGone = useHeroCtaGone();

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > SWAP_AT));
  // Pick up the starting state when the page opens part-way down.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setCompact(scrollY.get() > SWAP_AT));
    return () => cancelAnimationFrame(frame);
  }, [scrollY]);

  return (
    <>
      <FloatingCta />
      <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        <nav
          aria-label="Main navigation"
          aria-hidden={compact || undefined}
          inert={compact}
          className="absolute left-1/2 top-5 z-[1000] -translate-x-1/2 w-content-width mx-auto"
        >
          <Bar compact={false} active={active} />
        </nav>
      </motion.div>
      <div className="pointer-events-none fixed inset-x-0 top-5 z-[1000] flex justify-center">
        <AnimatePresence>
          {compact && (
            <motion.nav
              key="compact"
              aria-label="Main navigation"
              initial={{ y: "-160%", opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "-160%", opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease }}
              className="pointer-events-auto w-content-width"
            >
              <Bar compact active={active} heroCtaGone={heroCtaGone} />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
