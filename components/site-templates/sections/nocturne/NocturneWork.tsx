"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FieldPicture } from "../../core/blocks";
import { useField, useTemplate } from "../../core/context";
import { FieldValue, Frame, gutter, Label, SplitTitle, type, useScrollProgress, useWide } from "./kit";

// Selected work: a horizontal gallery pinned while the page scrolls. The
// introduction first, then one tall card per project sliding in from the
// right as the visitor scrolls down; a line at the foot fills as they go and
// a counter says where they are. Pointing at a card brings its picture from
// grey into colour, slides up "View case" and a round accent "View" follows
// the pointer. While editing, on phones, and for reduced motion the cards
// sit in a row that scrolls sideways on its own (one under another on
// phones).
//
// Its section's fields: `label`, `title`, `intro`, `hint`, `viewLabel`, and
// for each project (`work1`...): Title, Category, Year, Tags, Image and Url.

const pad = (n: number) => String(n).padStart(2, "0");

export default function NocturneWork({ works }: { works: number[] }) {
  const { edit } = useTemplate();
  const still = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wide = useWide(ref);
  const pinned = wide && !edit && !still;
  const progress = useScrollProgress(ref, true);

  // How far the track travels: its width less the view's.
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - track.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [pinned]);
  const x = useTransform(progress, (p) => -p * distance);
  const smooth = useSpring(x, { stiffness: 120, damping: 30, mass: 0.6 });
  const [at, setAt] = useState(1);
  useEffect(() => progress.on("change", (p) => setAt(Math.min(works.length, Math.floor(p * works.length) + 1))), [progress, works.length]);

  const intro = (
    <div className="flex shrink-0 flex-col justify-between gap-10 @xl:w-[34cqw] @xl:pr-[4cqw]">
      <div className="flex flex-col gap-8">
        <Label field="label" />
        <SplitTitle field="title" />
        <p className={`m-0 max-w-[26rem] ${type.body}`}>
          <FieldValue field="intro" />
        </p>
      </div>
      {pinned && (
        <span className={`flex items-center gap-3 ${type.label}`}>
          <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-primary">
            →
          </motion.span>
          <FieldValue field="hint" />
        </span>
      )}
    </div>
  );

  if (!pinned) {
    return (
      <Frame>
        <div ref={ref} className={`flex flex-col gap-12 py-24 @xl:py-32 ${gutter}`}>
          {intro}
          <div className={`flex flex-col gap-14 ${wide ? "flex-row gap-[3cqw] overflow-x-auto pb-4" : ""}`}>
            {works.map((n, i) => (
              <Card key={n} n={n} index={i} total={works.length} className={wide ? "h-[34rem] w-[40cqw] shrink-0" : "aspect-[4/5] w-full"} />
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      {/* Tall enough to scroll the whole track through while it is pinned */}
      <div ref={ref} style={{ height: `${100 + works.length * 55}svh` }} className="relative">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <motion.div ref={trackRef} style={{ x: smooth }} className={`flex items-stretch gap-[3cqw] pt-16 ${gutter}`}>
            {intro}
            {works.map((n, i) => (
              <Card key={n} n={n} index={i} total={works.length} className="h-[68svh] w-[40cqw] shrink-0" />
            ))}
            <div aria-hidden="true" className="w-[10cqw] shrink-0" />
          </motion.div>
          <Progress progress={progress} at={at} total={works.length} />
        </div>
      </div>
    </Frame>
  );
}

function Progress({ progress, at, total }: { progress: MotionValue<number>; at: number; total: number }) {
  return (
    <div className={`absolute inset-x-0 bottom-[5svh] flex items-center gap-6 ${gutter}`}>
      <span className={`tabular-nums ${type.label}`}>
        <span className="text-foreground">{pad(at)}</span> / {pad(total)}
      </span>
      <span className="relative h-px flex-1 bg-border">
        <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-primary" />
      </span>
    </div>
  );
}

// One project: its picture (grey until pointed at), its number and category
// over it, and its name, tags and year under; a round "View" follows the
// pointer over it.
function Card({ n, index, total, className }: { n: number; index: number; total: number; className: string }) {
  const { edit } = useTemplate();
  const url = useField(`work${n}Url`).value;
  const title = useField(`work${n}Title`).value;
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 300, damping: 28 });
  const sy = useSpring(cy, { stiffness: 300, damping: 28 });
  const [over, setOver] = useState(false);

  return (
    <article
      onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        cx.set(event.clientX - box.left);
        cy.set(event.clientY - box.top);
      }}
      onPointerEnter={() => setOver(true)}
      onPointerLeave={() => setOver(false)}
      className={`group/work relative flex flex-col ${className}`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[3px] bg-foreground/5">
        <div className="absolute inset-0 transition-[transform,filter] duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] [filter:grayscale(0.9)_brightness(0.7)] group-hover/work:scale-[1.05] group-hover/work:[filter:grayscale(0)_brightness(0.95)]">
          <FieldPicture field={`work${n}Image`} alt={title} className="absolute inset-0 block h-full w-full object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
          <span className={`${type.label} text-foreground`}>
            {pad(index + 1)} / {pad(total)}
          </span>
          <span className="rounded-full border border-solid border-foreground/30 bg-card/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-md">
            <FieldValue field={`work${n}Category`} />
          </span>
        </div>
        {/* The round "View", following the pointer */}
        {!edit && (
          <motion.span
            aria-hidden="true"
            style={{ x: sx, y: sy }}
            animate={{ scale: over ? 1 : 0, opacity: over ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute -left-12 -top-12 grid size-24 place-items-center rounded-full bg-primary font-mono text-[11px] uppercase tracking-[0.14em] text-card"
          >
            <FieldValue field="viewLabel" />
          </motion.span>
        )}
      </div>
      <div className="flex items-end justify-between gap-6 pt-5">
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className={`m-0 ${type.name}`}>
            <a href={edit ? undefined : url || undefined} target="_blank" rel="noreferrer" className="text-foreground no-underline after:absolute after:inset-0">
              <FieldValue field={`work${n}Title`} />
            </a>
          </h3>
          <span className="truncate text-[13px] text-muted-foreground">
            <FieldValue field={`work${n}Tags`} />
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-2 font-mono text-[12px] text-muted-foreground">
          <FieldValue field={`work${n}Year`} />
          <ArrowUpRight aria-hidden="true" className="size-4 text-foreground transition-transform duration-500 group-hover/work:-translate-y-1 group-hover/work:translate-x-1 group-hover/work:text-primary" strokeWidth={1.5} />
        </span>
      </div>
    </article>
  );
}
