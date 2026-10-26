"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotionConfig, useScroll } from "framer-motion";
import { ArrowRight, ArrowUp } from "lucide-react";
import { Art } from "@/components/landing/sample-portfolios";
import { ease, focusRing } from "@/components/landing/landing-ui";
import { scrollPageTo } from "@/lib/scroll";

const HERO_CTA = "hero-cta";
const CLAIM_ADDRESS = "claim-address";

// A frosted card, for the floating button.
export const frostedCard = "rounded-2xl bg-white/75 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_12px_32px_-12px_rgb(0_0_0/0.22)] backdrop-blur-xl backdrop-saturate-150";

// Whether the hero's "Create Your Portfolio" has scrolled up out of view.
export function useHeroCtaGone() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const target = document.getElementById(HERO_CTA);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setGone(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return gone;
}

// The hero's "Create Your Portfolio" again, as a frosted card: a sample
// portfolio, the words and an arrow that nudges on hover. Same destination
// as the hero button.
export function CreateButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/templates"
      className={`${focusRing} ${frostedCard} group pointer-events-auto flex items-center gap-3 whitespace-nowrap py-2 pl-2 pr-4 text-sm font-semibold text-foreground no-underline transition-colors duration-200 hover:bg-white/90 ${className}`}
    >
      <span aria-hidden="true" className="block size-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/[0.06]">
        <Art name="river" />
      </span>
      Create your portfolio
      <ArrowRight aria-hidden="true" className="size-4 text-foreground/60 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}

// Scrolling this far in one direction counts as a change of direction.
const TURN = 8;

// On phones, Back to top floats in the bottom-right corner once the hero's
// button has scrolled away (the page's own Back to top is hidden on phones).
// It slides away while you scroll down to read, comes back when you scroll
// up, and stays away from "Claim your address" on.
// Rendered outside the nav because the nav's transform would break fixed
// positioning.
export default function FloatingCta() {
  const gone = useHeroCtaGone();
  const reduced = useReducedMotionConfig();
  const { scrollY } = useScroll();
  const [up, setUp] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? y);
    if (Math.abs(delta) >= TURN) setUp(delta < 0);
    const claim = document.getElementById(CLAIM_ADDRESS);
    setAtEnd(Boolean(claim && claim.getBoundingClientRect().top < window.innerHeight));
  });

  return (
    <AnimatePresence>
      {gone && up && !atEnd && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{ duration: 0.45, ease }}
          className="pointer-events-none fixed inset-x-4 bottom-4 z-[1000] flex justify-end gap-2 sm:hidden"
        >
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => scrollPageTo(0, { immediate: !!reduced })}
            className={`${focusRing} pointer-events-auto grid size-14 shrink-0 cursor-pointer place-items-center rounded border-0 bg-foreground text-background shadow-[0_8px_24px_-8px_rgb(0_0_0/0.4)]`}
          >
            <ArrowUp aria-hidden="true" className="size-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
