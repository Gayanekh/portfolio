"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ease } from "@/components/template-landing/ui";

// The scroll effects /template-landing's sections share, in the manner of a
// Framer site: words rising out of their lines, blocks rising into place,
// and parallax tied to the scroll. With reduced motion the page's
// MotionConfig drops the movement (things simply appear), and the
// scroll-linked hooks hold still.

// Reduced motion, but only once the page has hydrated: the server can't
// know the setting, so the first render always matches its HTML and the
// still version follows straight after.
const noop = () => () => {};
export function useStill() {
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return hydrated && !!reduced;
}

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

// A line of text whose words rise one after another out of their lines
// once in view. Screen readers get the plain text.
export function Words({ text, delay = 0, stagger = 0.06 }: { text: string; delay?: number; stagger?: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: stagger, delayChildren: delay }}>
        {words.map((word, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
              <motion.span className="inline-block" variants={{ hidden: { y: "110%" }, shown: { y: "0%", transition: { duration: 0.95, ease } } }}>
                {word}
              </motion.span>
            </span>
          </span>
        ))}
      </motion.span>
    </>
  );
}

// A block that rises and fades into place once a little of it is in view.
export function Rise({ children, className, delay = 0, y = 56 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// Variants for lists whose items rise one after another (the list gets
// `stagger`, each item `riseItem`).
export const stagger = { hidden: {}, shown: { transition: { staggerChildren: 0.08 } } };
export const riseItem = { hidden: { opacity: 0, y: 40 }, shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } };

// How far through the screen an element is (0 entering at the bottom, 1
// leaving at the top, unless `offset` says otherwise), mapped to `range`.
// Still under reduced motion: it stays at the range's resting value.
export function useScrollValue<T extends HTMLElement>(range: [number, number], offset: Offset = ["start end", "end start"], rest = range[1]) {
  const ref = useRef<T>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const value: MotionValue<number> = useTransform(scrollYProgress, [0, 1], still ? [rest, rest] : range);
  return [ref, value] as const;
}
