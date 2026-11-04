"use client";

import { useSyncExternalStore, type PointerEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { accent, ease, font } from "@/components/landing-next/ui";

// The new landing's shared motion pieces. MotionConfig on the page's root
// keeps them still for reduced motion.

const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

// Fades and drifts up once in view.
export function Reveal({ delay = 0, className, children }: { delay?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 1, ease, delay }}>
      {children}
    </motion.div>
  );
}

// Words between * and * are a headline's accent.
const parts = (text: string) => text.split(/(\*[^*]+\*)/).filter(Boolean);
export const plain = (text: string) => text.replace(/\*/g, "");

// A headline whose words rise one after another from behind their own line
// once in view; *marked* words take the accent (`tone` picks the glow on
// ink or deep iris on bone). `now` plays it at once (the hero's).
export function Headline({ text, as: Tag = "h2", tone = "light", className, delay = 0, now = false }: { text: string; as?: "h1" | "h2" | "p"; tone?: "dark" | "light"; className: string; delay?: number; now?: boolean }) {
  const Motion = motion[Tag];
  let i = 0;
  // The accent goes on the moving word itself: a gradient clipped to text on
  // a parent isn't painted through its transformed children.
  const word = (piece: string, key: number, marked: boolean) => {
    const at = i++;
    return (
      // Room on every side, so an italic's overhang is never cut off.
      <span key={key} className="-mx-[0.08em] -mb-[0.16em] inline-block overflow-hidden px-[0.08em] pb-[0.16em] align-bottom">
        <motion.span className={`inline-block ${marked ? accent[tone] : ""}`} variants={{ hidden: { y: "108%" }, shown: { y: "0%", transition: { duration: 1.05, ease, delay: delay + at * 0.06 } } }}>
          {piece}
        </motion.span>
      </span>
    );
  };
  const play = now ? { animate: "shown" } : { whileInView: "shown", viewport: VIEWPORT };
  return (
    <Motion initial="hidden" {...play} aria-label={plain(text)} className={`m-0 ${className}`}>
      {parts(text).map((part, p) => {
        const marked = part.startsWith("*");
        const words = (marked ? part.slice(1, -1) : part).split(/(\s+)/).map((piece, w) => (piece.trim() ? word(piece, w, marked) : piece));
        return (
          <span key={p} aria-hidden="true">
            {words}
          </span>
        );
      })}
    </Motion>
  );
}

// A small numbered label: "01 — How it works".
export function Label({ index, children, tone = "light" }: { index?: string; children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={`m-0 flex items-center gap-3 ${font.mono} text-[0.75rem] uppercase tracking-[0.18em] ${tone === "dark" ? "text-[var(--mist)]" : "text-[var(--ink)]/55"}`}>
      {index && <span className={tone === "dark" ? "text-[var(--peach)]" : "text-[var(--iris-deep)]"}>{index}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
      {children}
    </p>
  );
}

// Whether the screen is at least 1024px wide (true on the server).
const WIDE = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
export const useWide = () => useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);

// Sets --x and --y (px) on a surface to where the pointer is over it, for a
// spotlight drawn in CSS (radial-gradient at var(--x) var(--y)).
export function trackPointer(event: PointerEvent<HTMLElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--x", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--y", `${event.clientY - box.top}px`);
}
