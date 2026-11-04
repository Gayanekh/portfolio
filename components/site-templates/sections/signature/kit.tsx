"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useField, useSectionId, useTemplate } from "../../core/context";
import { FieldValue, number, pageSections } from "../panel-kit";

// The shared look of the Signature sections (the Minimal template): a warm
// paper page, ink text, one cobalt accent, a tight grotesk for display and a
// typewriter face for labels. From the split layout up (the template's own
// width at 56rem, the kit's @4xl), the Profile panel stays pinned on the left
// and every other section sits to its right, offset by `side`. Every
// Signature section takes its pieces from here, so they stay alike.

export const ease = [0.22, 1, 0.36, 1] as const;
export const soft = [0.65, 0, 0.35, 1] as const;
export { FieldValue };

// The pinned panel's share of the width, and the room the sections leave it.
export const SPLIT_PX = 896;
export const panelWidth = "@4xl:w-[38%]";
export const side = "@4xl:ml-[38%]";
// The sections' own padding.
export const pad = "px-5 @xl:px-[6%] @4xl:px-[5%]";

export const type = {
  label: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
  title: "font-display text-[length:clamp(2.4rem,5.2cqw,5rem)] font-bold leading-[0.95] tracking-[-0.045em]",
  statement: "font-display text-[length:clamp(1.7rem,3.3cqw,3.2rem)] font-medium leading-[1.08] tracking-[-0.035em]",
  name: "font-display text-[length:clamp(1.15rem,1.5cqw,1.45rem)] font-semibold leading-tight tracking-[-0.025em]",
  body: "text-[15px] leading-[1.65] text-foreground/75",
  muted: "text-[14px] leading-[1.6] text-muted-foreground",
};

// Whether the page is wide enough for the split layout.
export function useSplit(ref: RefObject<HTMLElement | null>) {
  const [split, setSplit] = useState(false);
  useEffect(() => {
    const root = ref.current?.closest("[data-site-template]");
    if (!root) return;
    const observer = new ResizeObserver(() => setSplit(root.clientWidth >= SPLIT_PX));
    observer.observe(root);
    return () => observer.disconnect();
  }, [ref]);
  return split;
}

// A section to the right of the pinned panel.
export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  const id = useSectionId();
  return (
    <section data-section={id} className={`relative scroll-mt-4 bg-card text-foreground ${side} ${className}`}>
      <div className={`py-20 @4xl:py-28 ${pad}`}>{children}</div>
    </section>
  );
}

// This section's number among the page's sections ("03").
export function useNumber() {
  const { template, layout } = useTemplate();
  const id = useSectionId();
  return number(Math.max(0, pageSections(template, layout).indexOf(id)));
}

// A section's label: its number in a small round badge, its name, and a dot
// line running to the edge, drawing itself once in view.
export function Label({ field }: { field: string }) {
  const n = useNumber();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true });
  const still = useReducedMotion();
  return (
    <div ref={ref} className={`flex items-center gap-3 ${type.label}`}>
      <span className="grid h-6 min-w-6 place-items-center rounded-full bg-foreground px-1.5 text-[10px] text-card">{n}</span>
      <span className="whitespace-nowrap text-foreground">
        <FieldValue field={field} />
      </span>
      <motion.span
        aria-hidden="true"
        initial={still ? false : { scaleX: 0 }}
        animate={{ scaleX: seen || still ? 1 : 0 }}
        transition={{ duration: 1.3, ease: soft, delay: 0.15 }}
        className="h-px flex-1 origin-left bg-[repeating-linear-gradient(90deg,var(--border)_0_4px,transparent_4px_8px)]"
      />
    </div>
  );
}

// Words between * and *: in the accent, with a hand-drawn swash under them
// that draws itself once in view.
function Marked({ children, delay }: { children: ReactNode; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = useReducedMotion();
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap text-primary">
      {children}
      <svg aria-hidden="true" viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-[0.12em] left-0 h-[0.22em] w-full overflow-visible">
        <motion.path
          d="M2 9 C 40 2, 80 13, 120 6 S 180 4, 198 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          initial={still ? false : { pathLength: 0 }}
          animate={{ pathLength: seen || still ? 1 : 0 }}
          transition={{ duration: 0.9, ease, delay: delay + 0.5 }}
        />
      </svg>
    </span>
  );
}

// A title whose words rise one after another once in view; *words* marked
// (see Marked). While editing, as written.
export function Title({ field, className = type.title, as: Tag = "h2" }: { field: string; className?: string; as?: "h1" | "h2" | "h3" | "p" }) {
  const { value, editing, node } = useField(field);
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = useReducedMotion();
  if (editing) return <Tag className={`m-0 ${className}`}>{node}</Tag>;
  let at = 0;
  const word = (text: string, key: string) => {
    const i = at++;
    return (
      <span key={key} className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom">
        <motion.span
          className="inline-block"
          initial={still ? false : { y: "110%", rotate: 4 }}
          animate={seen || still ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 4 }}
          transition={{ duration: 1, ease, delay: i * 0.05 }}
        >
          {text}
        </motion.span>
      </span>
    );
  };
  return (
    <Tag ref={ref} aria-label={value.replace(/\*/g, "")} className={`m-0 ${className}`}>
      {value
        .split(/(\*[^*]+\*)/)
        .filter(Boolean)
        .map((part, p) => {
          const marked = part.startsWith("*");
          const words = (marked ? part.slice(1, -1) : part).split(/(\s+)/).map((w, j) => (w.trim() ? word(w, `${p}-${j}`) : w));
          return (
            <span key={p} aria-hidden="true">
              {marked ? <Marked delay={at * 0.05}>{words}</Marked> : words}
            </span>
          );
        })}
    </Tag>
  );
}

// Fades up into place once in view.
export function In({ delay = 0, y = 22, className, children }: { delay?: number; y?: number; className?: string; children: ReactNode }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// A section's heading row: its label, then the title and (optionally) a few
// words beside it.
export function Head({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return (
    <div className="mb-12 flex flex-col gap-6 @4xl:mb-16">
      <Label field={label} />
      <div className="flex flex-col gap-5 @2xl:flex-row @2xl:items-end @2xl:justify-between @2xl:gap-10">
        <Title field={title} />
        {intro && (
          <In delay={0.15} className="@2xl:max-w-[22rem] @2xl:pb-2">
            <p className={`m-0 ${type.muted}`}>
              <FieldValue field={intro} />
            </p>
          </In>
        )}
      </div>
    </div>
  );
}
