"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { Menu } from "../core/blocks";
import { inMenu } from "../core/content";
import { useField, useSectionId, useTemplate } from "../core/context";
import { definitionOf, sectionOrder, type PageLayout } from "../core/layout";
import { scrollParent, viewOf } from "../core/scroll";
import type { TemplateDefinition } from "../core/types";

// The shared look of the panel sections (PanelSlider and the Panel*
// sections after it): a soft grey panel down the left, thin lines between
// columns, an accent column on the right, huge lowercase titles in a heavy
// grotesk, round arrow buttons and two-digit numbers that roll as they
// change. Every Panel section takes its pieces from here, so they stay alike.
//
//   [ grey  ][ title across...      ][               ][ accent ]
//   [ panel ][                      ][               ][ column ]
//
// The hero's columns (17 / 33.5 / 37.5 / 12) are `columns.hero`; sections
// with a row of equal pictures (Work, Journal) use `columns.even`: the same
// grey panel, then three equal columns.

export const ease = [0.22, 1, 0.36, 1] as const;
export const soft = [0.65, 0, 0.35, 1] as const;
export const number = (index: number) => String(index + 1).padStart(2, "0");

export const columns = {
  hero: "@xl:grid-cols-[17fr_33.5fr_37.5fr_12fr]",
  even: "@xl:grid-cols-[17fr_27.67fr_27.67fr_27.66fr]",
};

// Where each column starts, as a share of the width, for the lines.
const LINES = { hero: ["left-[50.5%]"], even: ["left-[17%]", "left-[44.67%]", "left-[72.34%]"] };

// A section's frame: the grey panel and the column lines behind its grid.
// From the desktop layout up; on phones the content simply stacks.
export function PanelFrame({ kind = "hero", grid, children, className = "" }: { kind?: keyof typeof columns; grid: string; children: ReactNode; className?: string }) {
  const id = useSectionId();
  return (
    // Followed from the menu, it stops under the pinned header (PanelHeader).
    <section data-section={id} className={`relative scroll-mt-14 overflow-hidden bg-card @xl:scroll-mt-16 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[17%] bg-foreground/[0.07] @xl:block" />
      {LINES[kind].map((left) => (
        <div key={left} aria-hidden="true" className={`pointer-events-none absolute inset-y-0 hidden border-0 border-l border-solid border-foreground/15 @xl:block ${left}`} />
      ))}
      <div className={`relative grid grid-cols-1 ${columns[kind]} ${grid}`}>{children}</div>
    </section>
  );
}

// The page's sections in the editor's order, without the pinned ones (a
// header, `stack: false`).
export const pageSections = (template: TemplateDefinition, layout?: PageLayout) =>
  sectionOrder(template, layout).filter((instance) => definitionOf(template, instance)?.stack !== false);

// This section's number on the page ("02").
export function useSectionNumber() {
  const { template, layout } = useTemplate();
  const id = useSectionId();
  return number(Math.max(0, pageSections(template, layout).indexOf(id)));
}

export function FieldValue({ field }: { field: string }) {
  return <>{useField(field).node}</>;
}

/* ---------- Type ---------- */

export const type = {
  // A small grey label in capitals, as the hero's eyebrow.
  eyebrow: "text-[length:clamp(0.75rem,1cqw,0.95rem)] uppercase tracking-[0.04em] text-muted-foreground",
  // A line in the accent colour, as the hero's subtitle.
  lead: "text-[length:clamp(1.25rem,1.6cqw,1.6rem)] font-medium leading-tight tracking-[-0.02em] text-primary",
  // Running text.
  body: "text-[15px] leading-[1.5]",
  muted: "text-[14px] leading-[1.5] text-muted-foreground",
  // A name or heading in a list or card.
  name: "font-display text-[length:clamp(1.15rem,1.5cqw,1.5rem)] font-bold leading-tight tracking-[-0.03em]",
  // A larger name, such as a service's.
  big: "font-display text-[length:clamp(1.75rem,3.4cqw,3.4rem)] font-bold leading-[0.95] tracking-[-0.05em]",
  // A number in the accent column.
  number: "font-display text-[length:clamp(1.25rem,1.6cqw,1.6rem)] font-bold",
};

const titleSize = {
  // The hero's.
  hero: "text-[length:clamp(4.5rem,17cqw,16.5rem)]",
  section: "text-[length:clamp(3.75rem,13cqw,12.5rem)]",
};

// A section's huge lowercase title, rising from behind an edge once in view.
export function PanelTitle({ field, size = "section", delay = 0 }: { field: string; size?: keyof typeof titleSize; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = useReducedMotion();
  return (
    <div ref={ref} className="-mb-[0.1em] overflow-hidden pb-[0.1em]">
      <motion.h2
        initial={still ? false : { y: "105%" }}
        animate={seen || still ? { y: "0%" } : { y: "105%" }}
        transition={{ duration: 1.1, ease, delay }}
        className={`m-0 -ml-[0.04em] whitespace-nowrap font-display font-bold leading-[0.82] tracking-[-0.06em] ${titleSize[size]}`}
      >
        <FieldValue field={field} />
      </motion.h2>
    </div>
  );
}

// Fades and drifts in once in view: up by default, or in from a side (`x`).
export function Rise({ delay = 0, x = 0, className, children }: { delay?: number; x?: number; className?: string; children: ReactNode }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? false : { opacity: 0, y: x ? 0 : 22, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// A picture's box opening once in view, as the hero's images: it sweeps open
// from one edge (`from`), the picture settling from a slight zoom.
export function Sweep({ from = "bottom", delay = 0, className = "", children }: { from?: "bottom" | "right" | "left"; delay?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const still = useReducedMotion();
  const closed = { bottom: "inset(100% 0% 0% 0%)", right: "inset(0% 0% 0% 100%)", left: "inset(0% 100% 0% 0%)" }[from];
  const open = seen || still;
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={still ? false : { clipPath: closed }}
        animate={{ clipPath: open ? "inset(0% 0% 0% 0%)" : closed }}
        transition={{ duration: 1.2, ease: soft, delay }}
      >
        <motion.div className="absolute inset-0" initial={still ? false : { scale: 1.15 }} animate={{ scale: open ? 1 : 1.15 }} transition={{ duration: 1.8, ease, delay }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

// A two-digit number rolling up or down (`direction`) as it changes.
export function RollingNumber({ value, direction = 1, className = type.number }: { value: string; direction?: number; className?: string }) {
  return (
    <span className="relative inline-grid overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: direction * 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -direction * 24, opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className={className}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// The accent block at the top of the right column, with the section's number
// under a thin line, as the hero's.
export function AccentNumber({ value, direction }: { value?: string; direction?: number }) {
  const own = useSectionNumber();
  return (
    <div className="hidden bg-primary text-card @xl:flex @xl:h-[20svh] @xl:min-h-[8rem] @xl:flex-col">
      <div className="flex-[56]" />
      <div className="grid flex-[44] place-items-center border-0 border-t border-solid border-card/35">
        <RollingNumber value={value ?? own} direction={direction} />
      </div>
    </div>
  );
}

// A figure such as "140+" counting up from zero once in view, keeping what
// comes before and after the digits. While editing, as written.
export function CountUp({ field, className }: { field: string; className: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { value, editing, node } = useField(field);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = useReducedMotion();
  const [shown, setShown] = useState<string | null>(null);
  const match = value.match(/^(\D*)(\d+)(.*)$/);

  useEffect(() => {
    if (!seen || !match || still || editing) return;
    const [, before, digits, after] = match;
    const target = Number(digits);
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / 1600);
      setShown(`${before}${Math.round(target * (1 - (1 - t) ** 3))}${after}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
    // Counts again only if the figure itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, value, still, editing]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {editing ? node : (shown ?? (seen || still ? value : (match?.[1] ?? "") + "0" + (match?.[3] ?? "")))}
    </span>
  );
}

/* ---------- Controls ---------- */

// The hero's round arrow buttons.
export const roundButton =
  "grid size-[clamp(3rem,calc(1.952rem_+_4.301cqw),3.5rem)] cursor-pointer place-items-center rounded-full border border-solid border-foreground/20 bg-transparent text-foreground transition-colors duration-300 hover:border-foreground";

// A link or button in small capitals with an arrow that slides on hover.
export const arrowLink =
  "group/link inline-flex cursor-pointer items-center gap-2 border-0 border-b border-solid border-foreground/25 bg-transparent p-0 pb-1 text-[13px] font-medium uppercase tracking-[0.08em] text-foreground no-underline transition-colors duration-300 hover:border-primary hover:text-primary";
export const arrowIcon = "size-4 transition-transform duration-300 group-hover/link:translate-x-1";

// Its children in a band running right to left without end, slowing while
// pointed at. While editing, and for reduced motion, they simply wrap.
export function Marquee({ children, speed = 50, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rate = useRef(1);
  const [hovered, setHovered] = useState(false);
  const still = useReducedMotion();
  const editing = Boolean(useTemplate().edit);
  const moving = !still && !editing;

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (!moving || !track) return;
    rate.current += ((hovered ? 0.15 : 1) - rate.current) * Math.min(1, delta / 300);
    const half = track.scrollWidth / 2;
    let next = x.get() - (speed * rate.current * delta) / 1000;
    if (half > 0 && -next >= half) next += half;
    x.set(next);
  });

  if (!moving) return <div className={`flex flex-wrap ${className}`}>{children}</div>;
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="overflow-hidden">
      <motion.div ref={trackRef} style={{ x }} className="flex w-max">
        <div className={`flex shrink-0 ${className}`}>{children}</div>
        {/* The same again, so the band never runs out */}
        <div aria-hidden="true" className={`flex shrink-0 ${className}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Menu ---------- */

// Three thin lines, crossing into an X while open.
export function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-8">
      {[0, 1, 2].map((line) => (
        <motion.span
          key={line}
          animate={open ? { top: 6, rotate: line === 1 ? 0 : line === 0 ? 45 : -45, opacity: line === 1 ? 0 : 1 } : { top: line * 5, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease }}
          className="absolute inset-x-0 h-px bg-current"
        />
      ))}
    </span>
  );
}

// The menu over the screen in the accent colour, opening from the accent
// column: the site's name and the menu in large type, the section in view
// (`active`) marked. `className` places it (over the hero, or over the view).
export function MenuPanel({ id, open, title, active, onClose, className }: { id: string; open: boolean; title: string; active: string; onClose: () => void; className: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 0% 100%)" }}
          transition={{ duration: 0.8, ease: soft }}
          className={`z-30 flex flex-col justify-center gap-8 bg-primary px-5 text-card [--foreground:var(--card)] @xl:px-[20cqw] ${className}`}
        >
          <div className="text-[13px] uppercase tracking-[0.1em] text-card/60">{title}</div>
          <Menu size="large" active={active} onFollow={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// The menu section in view (the last whose top has passed the middle of the
// view), or "" above the first; `ref` is any element of the page. It follows
// the page's scroll, or the editor canvas's.
export function useActiveSection(ref: RefObject<HTMLElement | null>) {
  const { template, content } = useTemplate();
  const [active, setActive] = useState("");
  useEffect(() => {
    const root = ref.current?.closest("[data-site-template]");
    if (!ref.current || !root) return;
    const parent = scrollParent(ref.current);
    const scroller: HTMLElement | Window = parent ?? window;
    const ids = template.sections.filter((section) => inMenu(content, section)).map((section) => section.id);
    const update = () => {
      const view = viewOf(parent);
      let current = "";
      for (const id of ids) {
        const element = root.querySelector(`[data-section="${id}"]`);
        if (element && element.getBoundingClientRect().top - view.top <= view.height / 2) current = id;
      }
      setActive(current);
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, template, content]);
  return active;
}
