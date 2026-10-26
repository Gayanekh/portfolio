"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotionConfig, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { ease, focusRing } from "@/components/landing/landing-ui";
import { scrollPageTo } from "@/lib/scroll";

const HERO_CTA = "hero-cta";
const CLAIM_ADDRESS = "claim-address";

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
