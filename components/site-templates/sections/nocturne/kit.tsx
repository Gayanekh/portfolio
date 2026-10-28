"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";
import { useField, useSectionId, useTemplate } from "../../core/context";
import { FieldValue, number, pageSections } from "../panel-kit";

// The shared look of the Nocturne sections: a near-black page with a fine
// film grain, warm off-white text, one accent, a serif display face (with
// italics for emphasis), a sans for reading and a typewriter face for small
// "registration" labels ([02] — UI/UX DESIGN), as on a print proof. Every
// Nocturne section takes its pieces from here, so they stay alike.

export const ease = [0.22, 1, 0.36, 1] as const;
export const soft = [0.65, 0, 0.35, 1] as const;
export { FieldValue };

// The content's side margins and width, the same in every section.
export const gutter = "px-5 @xl:px-[5cqw]";

export const type = {
  // A small label in the typewriter face.
  label: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
  // A section's title, in the serif.
  title: "font-display text-[length:clamp(2.75rem,7.2cqw,7.5rem)] font-light leading-[0.95] tracking-[-0.035em]",
  // A large statement.
  statement: "font-display text-[length:clamp(1.6rem,3cqw,3rem)] font-light leading-[1.12] tracking-[-0.02em]",
  // A card's or row's name.
  name: "font-display text-[length:clamp(1.35rem,2.1cqw,2.1rem)] font-normal leading-[1.05] tracking-[-0.02em]",
  body: "text-[15px] leading-[1.6] text-foreground/80",
  muted: "text-[14px] leading-[1.6] text-muted-foreground",
};

/* ---------- Frame ---------- */

// Film grain over a section, drawn once as an SVG noise tile.
const GRAIN =
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")]";

export function Grain() {
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-[1] opacity-[0.07] mix-blend-overlay ${GRAIN}`} />;
}

// A section's outer element: the page colour, grain, and its id for the menu.
export function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const id = useSectionId();
  return (
    <section data-section={id} className={`relative scroll-mt-16 bg-card text-foreground ${className}`}>
      <Grain />
      <div className="relative z-[2]">{children}</div>
    </section>
  );
}

// This section's number among the page's sections ("03").
export function useNumber() {
  const { template, layout } = useTemplate();
  const id = useSectionId();
  return number(Math.max(0, pageSections(template, layout).indexOf(id)));
}

// The registration label opening a section: [03] — the field's words, and a
// hairline running on to the edge, drawing itself once in view.
export function Label({ field }: { field: string }) {
  const n = useNumber();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true });
  const still = useReducedMotion();
  return (
    <div ref={ref} className={`flex items-center gap-4 ${type.label}`}>
      <span className="text-primary">[{n}]</span>
      <span className="whitespace-nowrap">
        <FieldValue field={field} />
      </span>
      <motion.span
        aria-hidden="true"
        initial={still ? false : { scaleX: 0 }}
        animate={{ scaleX: seen || still ? 1 : 0 }}
        transition={{ duration: 1.4, ease: soft, delay: 0.2 }}
        className="h-px flex-1 origin-left bg-border"
      />
    </div>
  );
}

/* ---------- Type in motion ---------- */

// Words between * and * set in the serif's italic, in the accent.
const parts = (text: string) => text.split(/(\*[^*]+\*)/).filter(Boolean);

// A title whose words rise one after another from behind their own edge once
// in view; *words* in italics, in the accent. While editing, as written.
export function SplitTitle({ field, className = type.title, as: Tag = "h2", delay = 0 }: { field: string; className?: string; as?: "h1" | "h2" | "h3"; delay?: number }) {
  const { value, editing, node } = useField(field);
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = useReducedMotion();
  if (editing) return <Tag className={`m-0 ${className}`}>{node}</Tag>;
  let i = 0;
  return (
    <Tag ref={ref} aria-label={value.replace(/\*/g, "")} className={`m-0 ${className}`}>
      {parts(value).map((part, p) => {
        const marked = part.startsWith("*");
        return (
          <span key={p} aria-hidden="true" className={marked ? "italic text-primary" : undefined}>
            {(marked ? part.slice(1, -1) : part).split(/(\s+)/).map((word, w) => {
              if (!word.trim()) return word;
              const at = i++;
              return (
                <span key={w} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={still ? false : { y: "110%" }}
                    animate={{ y: seen || still ? "0%" : "110%" }}
                    transition={{ duration: 1.1, ease, delay: delay + at * 0.06 }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}

// Fades up into place once in view.
export function In({ delay = 0, y = 24, className, children }: { delay?: number; y?: number; className?: string; children: ReactNode }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Scroll ---------- */

export { useScrollProgress, useWide } from "../../core/viewport";

/* ---------- Pointer ---------- */

// Tilts its content in 3D towards the pointer, a soft light following it.
export function Tilt({ children, className = "", max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const still = useReducedMotion();
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const lx = useMotionValue(50);
  const ly = useMotionValue(50);
  const [over, setOver] = useState(false);
  return (
    <div className={`[perspective:1200px] ${className}`}>
      <motion.div
        onPointerMove={(event) => {
          if (still) return;
          const box = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width;
          const y = (event.clientY - box.top) / box.height;
          ry.set((x - 0.5) * max * 2);
          rx.set(-(y - 0.5) * max * 2);
          lx.set(x * 100);
          ly.set(y * 100);
        }}
        onPointerEnter={() => setOver(true)}
        onPointerLeave={() => {
          setOver(false);
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {children}
        <Shine x={lx} y={ly} on={over} />
      </motion.div>
    </div>
  );
}

function Shine({ x, y, on }: { x: MotionValue<number>; y: MotionValue<number>; on: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Painted straight onto the element: it changes on every pointer move.
    const paint = () => {
      if (ref.current) ref.current.style.background = `radial-gradient(circle at ${x.get()}% ${y.get()}%, rgb(255 255 255 / 0.16), transparent 55%)`;
    };
    const offX = x.on("change", paint);
    const offY = y.on("change", paint);
    return () => {
      offX();
      offY();
    };
  }, [x, y]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
    />
  );
}

// Its content pulled a little towards the pointer while it is near, springing
// back when it leaves.
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const still = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 14 });
  const y = useSpring(0, { stiffness: 180, damping: 14 });
  return (
    <motion.div
      onPointerMove={(event) => {
        if (still) return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - box.left - box.width / 2) * strength);
        y.set((event.clientY - box.top - box.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x, y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
