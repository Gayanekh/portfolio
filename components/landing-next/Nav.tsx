"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, MoveRight, X } from "lucide-react";
import AuthControls from "@/components/auth/AuthControls";
import { useAccount } from "@/components/auth/useAccount";
import Logo from "@/components/brand/Logo";
import { HERO, NAV } from "@/components/landing-next/content";
import { ease, focusRing, font } from "@/components/landing-next/ui";

// The section in view (the last whose top has passed the upper third).
function useActive(links: { href: string; label: string }[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const update = () => {
      let current = "";
      for (const link of links) {
        const section = document.querySelector(link.href);
        if (section && section.getBoundingClientRect().top < window.innerHeight / 3) current = link.href;
      }
      setActive((previous) => (previous === current ? previous : current));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [links]);
  return active;
}

const getStarted = `${focusRing} group/start inline-flex h-10 items-center gap-2 rounded-[4px] bg-[var(--bone)] px-4 text-[0.875rem] font-medium text-[var(--ink)] no-underline shadow-[0_8px_24px_-10px_rgb(157_140_255/0.7)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_10px_30px_-8px_rgb(157_140_255/0.95)] active:scale-[0.97]`;

// Signed out: Log in as a quiet link and Get started (to this world's
// templates page). Signed in: the account itself, its menu as everywhere on
// Portory, in the bar's light ink, then Get started.
function Account({ start }: { start: string }) {
  const { account } = useAccount();
  return (
    <div className="flex items-center gap-1.5">
      {account ? (
        <div className="[--foreground:var(--bone)]">
          <AuthControls start={false} />
        </div>
      ) : (
        <Link href="/login" className={`${focusRing} rounded-[4px] px-4 py-2 text-[0.875rem] text-[var(--bone)]/75 no-underline transition-colors hover:text-[var(--bone)]`}>
          Log in
        </Link>
      )}
      <Link href={start} className={getStarted}>
        Get started
        <MoveRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/start:translate-x-0.5" />
      </Link>
    </div>
  );
}

// The bar at the top: the wordmark, the sections (a soft pill sliding to the
// one pointed at, or the one in view) and the account. It never moves, so
// nothing shakes while scrolling: at the very top it is clear over the night
// hero, and once the page scrolls a dark frosted glass fades in behind it,
// same size, with a thin iris-to-peach line along its foot showing how far
// down the page you are. On phones the links open in a glass sheet. On the
// world's other pages (`home` set) the links lead back to the landing.
export default function Nav({ home = "", links = NAV, start = HERO.primary.href }: { home?: string; links?: { href: string; label: string }[]; start?: string }) {
  const active = useActive(links);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [glass, setGlass] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  // Only crossing the line changes anything, so scrolling re-renders nothing.
  useMotionValueEvent(scrollY, "change", (y) => setGlass(y > 24));
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const lit = hovered ?? active;
  const solid = glass || open;

  return (
    <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="fixed inset-x-0 top-0 z-50 px-[clamp(0.75rem,2vw,1.5rem)] pt-[clamp(0.75rem,1.2vw,1rem)]">
      <div className="relative mx-auto max-w-[78rem]">
        <div
          className={`relative flex h-[3.75rem] items-center gap-4 overflow-hidden rounded-2xl pl-5 pr-2 text-[var(--bone)] ring-1 backdrop-blur-xl transition-[background-color,box-shadow] duration-500 ${
            solid ? "bg-[rgb(17_16_24/0.9)] shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)] ring-white/10" : "bg-transparent shadow-none ring-transparent"
          }`}
        >
          <Link href={home || "/"} aria-label="Portory home" className={`${focusRing} rounded-[4px]`}>
            <Logo className="h-[1.5rem] w-auto !text-[var(--bone)]" title={null} />
          </Link>

          <nav aria-label="Sections" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <ul onMouseLeave={() => setHovered(null)} className="m-0 flex list-none gap-0.5 p-0">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={home + link.href}
                    aria-current={active === link.href ? "location" : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    className={`${focusRing} relative block rounded-lg px-4 py-2 text-[0.875rem] no-underline transition-colors duration-300 ${lit === link.href ? "text-[var(--bone)]" : "text-[var(--bone)]/65"}`}
                  >
                    {lit === link.href && <motion.span layoutId="next-nav-pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} className="absolute inset-0 rounded-lg bg-white/[0.09]" />}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto hidden lg:block">
            <Account start={start} />
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="next-menu"
            aria-label={open ? "Close the menu" : "Open the menu"}
            onClick={() => setOpen(!open)}
            className={`${focusRing} ml-auto grid size-11 cursor-pointer place-items-center rounded-xl border-0 bg-white/[0.08] text-[var(--bone)] ring-1 ring-white/10 lg:hidden`}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>

          {/* How far down the page: a thin glowing line along the foot. */}
          <motion.span
            aria-hidden="true"
            style={{ scaleX: scrollYProgress }}
            className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-[var(--iris)] to-[var(--peach)] transition-opacity duration-500 ${solid ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="next-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] flex origin-top flex-col gap-6 rounded-2xl bg-[rgb(17_16_24/0.92)] p-6 text-[var(--bone)] shadow-[0_30px_70px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/10 backdrop-blur-xl lg:hidden"
            >
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {links.map((link, i) => (
                  <motion.li key={link.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease, delay: 0.05 + i * 0.04 }}>
                    <a href={home + link.href} onClick={() => setOpen(false)} className={`${focusRing} ${font.display} block py-1.5 text-[1.75rem] font-semibold tracking-[-0.04em] text-[var(--bone)] no-underline`}>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="border-0 border-t border-solid border-white/10 pt-5">
                <Account start={start} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
