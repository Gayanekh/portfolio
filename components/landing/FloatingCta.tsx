"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Art } from "@/components/landing/sample-portfolios";
import { ease, focusRing } from "@/components/landing/landing-ui";

const HERO_CTA = "hero-cta";
const NAV_CARD = '[data-nav-card="true"]';

// Beside the compact nav card (to its left) on wide screens; centred at the bottom of
// the screen when there is no room there.
const SIDE = "right-[calc(50%+min(min(85vw,clamp(40rem,72.5vw,100rem))*0.92,48rem)/2+10px)] top-[22px] xl:top-[25px] 2xl:top-[29px]";
const BOTTOM = "inset-x-4 bottom-4 flex justify-center";

// The hero's "Create Your Portfolio" again, shown only once the original has
// scrolled up out of view. Same destination as the hero button. Rendered
// outside the nav because the nav's transform would break fixed positioning.
export default function FloatingCta() {
  const [show, setShow] = useState(false);
  const [side, setSide] = useState(false);

  useEffect(() => {
    const target = document.getElementById(HERO_CTA);
    if (!target) return;
    // Side placement needs a wide screen and room left of the nav card for
    // the button at the current text size.
    const fitsBeside = () => {
      const card = document.querySelector<HTMLElement>(NAV_CARD);
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return window.matchMedia("(min-width: 1024px)").matches && !!card && card.getBoundingClientRect().left - 10 >= 15 * rem;
    };
    const observer = new IntersectionObserver(([entry]) => {
      setSide(fitsBeside());
      setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    const onResize = () => setSide(fitsBeside());
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const hidden = side ? { opacity: 0, x: 24, scale: 0.94 } : { opacity: 0, y: 24, scale: 0.94 };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={side ? "side" : "bottom"}
          initial={hidden}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={hidden}
          transition={{ duration: 0.45, ease }}
          className={`pointer-events-none fixed z-[1000] ${side ? SIDE : BOTTOM}`}
        >
          <Link
            href="/templates"
            className={`${focusRing} pointer-events-auto inline-flex min-h-12 max-w-full items-center gap-2.5 rounded-full bg-foreground py-1.5 pl-1.5 pr-[18px] text-sm font-semibold text-white no-underline shadow-[0_8px_24px_-8px_rgb(0_0_0/0.45)] transition-transform duration-200 active:scale-[0.97] motion-reduce:transition-none`}
          >
            <span aria-hidden="true" className="block size-9 shrink-0 overflow-hidden rounded-full border-2 border-white/85 bg-foreground/80"><Art name="river" /></span>
            <span className="min-w-0">Create Your Portfolio</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
