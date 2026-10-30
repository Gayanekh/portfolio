"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepScreen } from "@/components/landing/Steps";
import { STEPS } from "@/components/template-landing/content";
import { useStill } from "@/components/template-landing/scroll-fx";
import { corner, cornerLink, ease, focusRing, frame, grid, pad, type } from "@/components/template-landing/ui";

const COUNT = STEPS.items.length;
const AUTOPLAY_MS = 6000;

const arrow = `${focusRing} grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[var(--fg)] transition-colors duration-300 hover:bg-[var(--card)]`;

// How it works, laid out like the Moire reference's testimonials, with no
// heading of its own (named for screen readers); then, on the page's columns, the home
// page's picture of the step (its small browser window) on a grey panel
// filling the first column, the step's line set large across the second and
// third, and in the fourth previous and next at the top and, at the foot, the
// step's title, its number and its link. It moves on by itself while on
// screen and not pointed at.
export default function Steps() {
  const still = useStill();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const step = STEPS.items[index];
  const go = (by: number) => setIndex((i) => (i + by + COUNT) % COUNT);

  useEffect(() => {
    if (still || held || !inView) return;
    const timer = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, held, inView, still]);

  const change = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: still ? 0 : 0.45, ease } };

  return (
    <section
      ref={ref}
      id="how-it-works"
      data-caption="steps"
      aria-label={STEPS.label}
      aria-roledescription="carousel"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      className="relative scroll-mt-20"
    >
      {/* The row, on a band tinted across the page (the column lines show through it), as in the reference. */}
      <div className="border-0 border-y border-solid border-[var(--line)] bg-[color-mix(in_srgb,var(--fg)_4%,transparent)] py-[clamp(2.5rem,7vh,4rem)]">
      <div className={`${frame} ${grid} gap-y-8`}>

        {/* Column 1: the home page's picture of the step (its browser window), filling the column edge to edge. */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={index} {...change} aria-hidden="true" className="w-full overflow-hidden bg-neutral-50 text-[#1a1a1a]">
              <div className="flex h-7 items-center gap-1 border-0 border-b border-solid border-black/5 bg-white px-3">
                <span className="size-1.5 rounded-full bg-black/15" />
                <span className="size-1.5 rounded-full bg-black/15" />
                <span className="size-1.5 rounded-full bg-black/15" />
                <span className="ml-1.5 min-w-0 flex-1 truncate rounded bg-black/[0.05] px-2 py-0.5 text-center text-[0.625rem] text-black/50">{step.url}</span>
              </div>
              <StepScreen step={index} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Columns 2 and 3: the step's line, set large. */}
        <div className="flex items-center lg:col-span-2 lg:px-[clamp(1rem,1.75vw,2rem)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={index} {...change} className="m-0 font-[family-name:var(--font-1)] text-[length:clamp(1.25rem,calc(0.95rem_+_0.8vw),1.875rem)] font-medium leading-[1.2] tracking-[-0.025em]">
              {step.text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Column 4: previous and next above; the step's title, number and link below. */}
        <div className="flex flex-col justify-between gap-8">
          <div className="flex gap-1">
            <button type="button" aria-label="Previous step" onClick={() => go(-1)} className={arrow}>
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button type="button" aria-label="Next step" onClick={() => go(1)} className={arrow}>
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={index} {...change} aria-live="polite" className="flex flex-col items-start gap-1">
              <p className={`m-0 ${type.body}`}>{step.title}</p>
              <p className={`m-0 ${type.small} tabular-nums text-[var(--dim)]`}>
                Step {pad(index + 1)} / {pad(COUNT)}
              </p>
              <Link href={step.cta.href} className={`${cornerLink} mt-4 text-[1rem]`}>
                {step.cta.label}
                <span aria-hidden="true" className={corner} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </div>
    </section>
  );
}
