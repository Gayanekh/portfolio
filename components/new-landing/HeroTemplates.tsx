"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotionConfig, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HERO, STACK } from "@/components/new-landing/content";
import StackSlider from "@/components/new-landing/StackSlider";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";

// The hero, side by side: the headline, text and buttons on the left and the
// card stack on the right (the text first on phones).
// The section stays in place while the page scrolls, and the scroll drives
// the stack (StackSlider): each step the next template's card rises and
// covers the one before. Scrolling back plays it in reverse.

const COUNT = STACK.length;
// Scroll for each change of card: one spacer of this height per step.
const STEP = "h-[70svh]";
// Smooths the raw scroll progress, so the cards ease into place.
const SPRING = { stiffness: 400, damping: 30, mass: 0.3 };

const heroButton = `${focusRing} group inline-flex h-12 items-center gap-2 rounded-full px-6 text-[0.95rem] font-medium no-underline transition-colors`;

export default function HeroTemplates() {
  const reduced = useReducedMotionConfig();
  const trackRef = useRef<HTMLDivElement>(null);
  // 0 when the hero reaches the top of the screen, 1 when it lets go.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, SPRING);
  // Where along the stack we are: 0 … COUNT - 1. No spring with reduced motion.
  const position = useTransform(reduced ? scrollYProgress : smooth, (p) => Math.min(1, Math.max(0, p)) * (COUNT - 1));
  const [active, setActive] = useState(0);
  useMotionValueEvent(position, "change", (p) => setActive(Math.round(p)));

  // A dot scrolls the page to its card's step.
  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const start = track.getBoundingClientRect().top + window.scrollY;
    const range = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + (index / (COUNT - 1)) * range, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    // The hero stays in place for one screen plus a step per card change: the
    // spacers after the section give the track its scroll length.
    <div ref={trackRef}>
      {/* The top padding keeps the content clear of the floating header. */}
      <section aria-label="Introduction" className="sticky top-0 flex min-h-svh items-center pb-10 pt-[7.5rem] md:pt-28">
        {/* Side by side: the text on the left, the card stack on the right (stacked on phones). */}
        <div className="mx-auto grid w-content-width grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-10 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="flex max-w-[36rem] flex-col items-start gap-5"
          >
            <h1 className="m-0 text-balance text-[length:clamp(2.25rem,8vw,3rem)] font-semibold leading-[0.95] tracking-[-0.045em] md:text-[length:clamp(2.5rem,4.4vw,4.75rem)]">
              {HERO.title} <span className="text-foreground/40">{HERO.accent}</span>
            </h1>
            <p className="m-0 max-w-[36rem] text-pretty text-base leading-relaxed text-foreground/65">{HERO.text}</p>
            <div className="flex flex-wrap gap-3">
              {/* FloatingCta watches this id to show the button again once it has scrolled away. */}
              <Link id="hero-cta" href={HERO.primary.href} className={`${heroButton} ${primaryButton}`}>
                {HERO.primary.label}
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <a href={HERO.secondary.href} className={`${heroButton} border border-foreground/15 bg-white/70 text-foreground hover:bg-white`}>
                {HERO.secondary.label}
              </a>
            </div>
          </motion.div>

          {/* The card stack. */}
          <div className="flex justify-center">
            <StackSlider items={STACK} position={position} active={active} onSelect={goTo} />
          </div>
        </div>
      </section>
      {Array.from({ length: COUNT - 1 }, (_, k) => (
        <div key={k} aria-hidden="true" className={STEP} />
      ))}
    </div>
  );
}
