"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useStillAfterHydration } from "../../core/motion";
import { FieldPicture } from "../../core/blocks";
import { useField, useSectionId, useTemplate } from "../../core/context";
import { ease, FieldValue, number, pageSections, Rise } from "../panel-kit";

// The shared look of the Showcase sections ("Daylight"): a chalk-white page,
// ink type, a cobalt accent for what can be clicked and a sun-yellow
// highlighter swept behind the words that matter. Headlines in a tight
// geometric sans, small notes in a mono set in brackets — (like this) — and
// every picture in a "window": square-cornered, opening from a frame once in
// view. One dark "ink" section (About) inverts the page. Every Showcase
// section takes its pieces from here, so they stay alike.

export { ease, FieldValue, Rise };

// The content's side margins, the same in every section.
export const gutter = "px-5 @xl:px-[4cqw]";
// A section's top and bottom space.
export const space = "py-24 @xl:py-[9cqw]";

export const type = {
  // A small note in the mono, in capitals.
  label: "font-mono text-[11px] uppercase tracking-[0.14em]",
  // A note in brackets.
  aside: "font-mono text-[12px] leading-[1.5] text-muted-foreground",
  // A huge headline, as the contact's.
  display: "font-display text-[length:clamp(3rem,8.4cqw,9rem)] font-semibold leading-[0.9] tracking-[-0.055em]",
  // A section's title.
  title: "font-display text-[length:clamp(2.5rem,6cqw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]",
  // A statement, as the hero's and About's.
  statement: "font-display text-[length:clamp(1.5rem,2.9cqw,3rem)] font-medium leading-[1.08] tracking-[-0.035em]",
  // A shorter statement, set in the space beside the hero's name.
  lead: "font-display text-[length:clamp(1.4rem,2.5cqw,4rem)] font-medium leading-[1.08] tracking-[-0.035em]",
  // A project's or a service's name.
  name: "font-display text-[length:clamp(1.5rem,3.3cqw,3.6rem)] font-semibold leading-[0.95] tracking-[-0.045em]",
  body: "text-[15px] leading-[1.6] text-foreground/75",
};

// The square-cornered buttons: solid ink turning cobalt, and an outline.
export const button = {
  solid:
    "group/roll inline-flex h-12 cursor-pointer items-center gap-3 rounded-[4px] border-0 bg-foreground px-5 text-[14px] font-medium text-card no-underline transition-colors duration-300 hover:bg-primary",
  outline:
    "group/roll inline-flex h-12 cursor-pointer items-center gap-3 rounded-[4px] border border-solid border-foreground/20 bg-transparent px-5 text-[14px] font-medium text-foreground no-underline transition-colors duration-300 hover:border-foreground",
};

/* ---------- Frame ---------- */

// The ink section's colours: the page's own, the other way round, with the
// sun as its accent (cobalt is too dark on ink).
const INK =
  "[--card:var(--ink)] [--foreground:var(--paper)] [--primary:var(--sun)] [--border:color-mix(in_srgb,var(--paper)_14%,transparent)] [--muted-foreground:color-mix(in_srgb,var(--paper)_56%,transparent)]";

// A section's outer element: its id for the menu, and its tone (the page's,
// or ink for the dark section).
export function Frame({ tone = "paper", className = "", children }: { tone?: "paper" | "ink"; className?: string; children: ReactNode }) {
  const id = useSectionId();
  return (
    <section data-section={id} className="relative scroll-mt-16 [--ink:var(--foreground)] [--paper:var(--card)]">
      <div className={`relative bg-card text-foreground ${tone === "ink" ? INK : ""} ${className}`}>{children}</div>
    </section>
  );
}

// This section's number among the page's sections ("03").
function useNumber() {
  const { template, layout } = useTemplate();
  const id = useSectionId();
  return number(Math.max(0, pageSections(template, layout).indexOf(id)));
}

// The label opening a section: its number in brackets, then the field's words.
export function Label({ field }: { field: string }) {
  return (
    <div className={`flex items-center gap-3 ${type.label}`}>
      <span className="text-primary">({useNumber()})</span>
      <span className="text-muted-foreground">
        <FieldValue field={field} />
      </span>
    </div>
  );
}

// A field's words in brackets, in the mono.
export function Aside({ field, className = "" }: { field: string; className?: string }) {
  return (
    <span className={`${type.aside} ${className}`}>
      (<FieldValue field={field} />)
    </span>
  );
}

/* ---------- Type in motion ---------- */

// Words between * and * get the highlighter.
const parts = (text: string) => text.split(/(\*[^*]+\*)/).filter(Boolean);

// A title whose words rise one after another from behind their own edge once
// in view, then the sun-yellow highlighter sweeps in behind the *marked*
// words. While editing, as written.
export function Title({ field, as: Tag = "h2", className = type.title, delay = 0 }: { field: string; as?: "h1" | "h2" | "h3" | "p"; className?: string; delay?: number }) {
  const { value, editing, node } = useField(field);
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = Boolean(useStillAfterHydration());
  if (editing) return <Tag className={`m-0 ${className}`}>{node}</Tag>;
  const shown = seen || still;
  const total = value.split(/\s+/).length;
  let i = 0;
  const word = (text: string, key: number) => {
    const at = i++;
    return (
      <span key={key} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
        <motion.span
          className="inline-block"
          initial={still ? false : { y: "110%" }}
          animate={{ y: shown ? "0%" : "110%" }}
          transition={{ duration: 1, ease, delay: delay + at * 0.05 }}
        >
          {text}
        </motion.span>
      </span>
    );
  };
  return (
    <Tag ref={ref} aria-label={value.replace(/\*/g, "")} className={`m-0 ${className}`}>
      {parts(value).map((part, p) => {
        const words = (part.startsWith("*") ? part.slice(1, -1) : part).split(/(\s+)/).map((piece, w) => (piece.trim() ? word(piece, w) : piece));
        if (!part.startsWith("*")) return <span key={p} aria-hidden="true">{words}</span>;
        return (
          <span key={p} aria-hidden="true" className="relative isolate inline-block text-[color:var(--ink)]">
            <motion.span
              className="absolute inset-x-[-0.08em] bottom-[0.06em] top-[0.2em] -z-10 origin-left rounded-[2px] bg-[var(--sun)]"
              initial={still ? false : { scaleX: 0 }}
              animate={{ scaleX: shown ? 1 : 0 }}
              transition={{ duration: 0.9, ease, delay: delay + total * 0.05 + 0.25 }}
            />
            {words}
          </span>
        );
      })}
    </Tag>
  );
}

// A field's letters rising one after another once in view, as the name in
// the hero and the footer. While editing, as written.
export function Letters({ field, className = "", delay = 0 }: { field: string; className?: string; delay?: number }) {
  const { value, editing, node } = useField(field);
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  const still = Boolean(useStillAfterHydration());
  if (editing) return <span className={className}>{node}</span>;
  return (
    <span ref={ref} aria-hidden="true" className={`-mb-[0.1em] overflow-hidden pb-[0.1em] ${className}`}>
      {Array.from(value).map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={still ? false : { y: "105%", rotate: 6 }}
          animate={seen || still ? { y: "0%", rotate: 0 } : { y: "105%", rotate: 6 }}
          transition={{ duration: 1.1, ease, delay: delay + i * 0.045 }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

// Its words rolling up to a copy of themselves while their link or button
// (a `group/roll`) is pointed at. While editing, as written.
export function Roll({ children }: { children: ReactNode }) {
  const { edit } = useTemplate();
  if (edit) return <>{children}</>;
  const move = "block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span className={`${move} group-hover/roll:-translate-y-full`}>{children}</span>
      <span aria-hidden="true" className={`absolute inset-0 translate-y-full ${move} group-hover/roll:translate-y-0`}>
        {children}
      </span>
    </span>
  );
}

/* ---------- Pictures ---------- */

// An image field's picture in a window: once in view the frame opens from a
// smaller inset to its full size while the picture settles from a zoom.
// `children` lie over the picture (a caption, crop marks). While editing,
// and for reduced motion, it is simply there.
export function Window({ field, alt = "", className = "", priority, children }: { field: string; alt?: string; className?: string; priority?: boolean; children?: ReactNode }) {
  const { edit } = useTemplate();
  const still = Boolean(useStillAfterHydration()) || Boolean(edit);
  const viewport = { once: true, margin: "0px 0px -12% 0px" };
  return (
    <motion.div
      initial={still ? false : { clipPath: "inset(10% 8% 10% 8% round 4px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 4px)" }}
      viewport={viewport}
      transition={{ duration: 1.4, ease }}
      className={`relative overflow-hidden rounded-[4px] bg-foreground/10 ${className}`}
    >
      <motion.div initial={still ? false : { scale: 1.22 }} whileInView={{ scale: 1 }} viewport={viewport} transition={{ duration: 1.8, ease }} className="absolute inset-0">
        <FieldPicture field={field} alt={alt} priority={priority} className="absolute inset-0 block h-full w-full object-cover" />
      </motion.div>
      {children}
    </motion.div>
  );
}

// A viewfinder's four corner marks over a picture.
export function CropMarks() {
  const corner = "absolute size-5 border-solid border-white/85";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-4 z-[3]">
      <span className={`${corner} left-0 top-0 border-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-0 border-b border-r`} />
    </div>
  );
}

// A small green light, glowing: open for work.
export function Dot() {
  return (
    <span aria-hidden="true" className="relative inline-grid size-2 shrink-0 place-items-center">
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70 motion-reduce:animate-none" />
      <span className="size-2 rounded-full bg-emerald-500" />
    </span>
  );
}
