"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotionConfig, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ease } from "@/components/landing/landing-ui";

// The home page's scroll effects, in the manner of a Framer site: titles
// whose words rise out of their lines, lists that arrive one item after
// another, and values tied to the scroll (parallax, growing, opening). They
// follow the page's MotionConfig, so the footer's "Reduce motion" switch and
// the system setting both turn them off: things then simply appear and the
// scroll-linked values hold still.

// Reduced motion (the switch or the system), but only once the page has
// hydrated: the server can't know it, so the first render matches its HTML.
const noop = () => () => {};
export function useStill() {
  const reduced = useReducedMotionConfig();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return hydrated && !!reduced;
}

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

// How far through the screen an element is (by default 0 as it enters at
// the bottom, 1 as it leaves at the top), mapped to `range`. Under reduced
// motion it rests at `rest` (the range's end unless given).
export function useScrollValue<T extends HTMLElement>(range: [number, number], offset: Offset = ["start end", "end start"], rest = range[1]) {
  const ref = useRef<T>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const value: MotionValue<number> = useTransform(scrollYProgress, [0, 1], still ? [rest, rest] : range);
  return [ref, value] as const;
}

// A title whose words rise one after another out of their lines once in
// view. Screen readers get the plain text.
export function MaskWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.6 }} transition={{ staggerChildren: 0.07, delayChildren: delay }}>
        {words.map((word, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
              <motion.span className="inline-block" variants={{ hidden: { y: "110%" }, shown: { y: "0%", transition: { duration: 0.9, ease } } }}>
                {word}
              </motion.span>
            </span>
          </span>
        ))}
      </motion.span>
    </>
  );
}

// Lists whose items rise one after another: `stagger` on the list,
// `riseItem` on each item.
export const stagger = { hidden: {}, shown: { transition: { staggerChildren: 0.09 } } };
export const riseItem = { hidden: { opacity: 0, y: 36 }, shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } };
