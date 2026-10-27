"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FieldPicture } from "../core/blocks";
import { useField, useTemplate } from "../core/context";
import { arrowIcon, ease, FieldValue, soft } from "./panel-kit";

// A short "about me" in a corner of the hero: a small frame whose pictures
// take turns (each sweeping in from the right over the last, settling from a
// slight zoom, as the hero's), a bar per picture filling in the accent while
// it shows, the name, a line and Read more, which glides to `target`.
// Pointing at it pauses; following the frame or a bar shows that picture.
// While editing, and for reduced motion, the pictures only change on a click.
//
// Its section's fields: `peekLabel`, `peekName`, `peekRole`, `peekMore`, and
// `peek1Image`... (one per `images`).

const HOLD = 4.5;

export default function AboutPeek({ images, target }: { images: number[]; target: string }) {
  const { edit, navigate } = useTemplate();
  const still = Boolean(useReducedMotion());
  const auto = !still && !edit;
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const name = useField("peekName").value;
  const count = images.length;

  const show = (to: number) => {
    const next = (to + count) % count;
    if (next === index) return;
    setPrevious(index);
    setIndex(next);
  };

  // How far the current picture's time has run (0 to 1); it stops while paused.
  const progress = useMotionValue(0);
  useEffect(() => progress.set(0), [index, progress]);
  useAnimationFrame((_, delta) => {
    if (!auto || paused) return;
    const next = progress.get() + delta / (HOLD * 1000);
    progress.set(next >= 1 ? 0 : next);
    if (next >= 1) show(index + 1);
  });

  const picture = (at: number, label: string) => (
    <FieldPicture field={`peek${images[at]}Image`} alt={label} className="absolute inset-0 block h-full w-full object-cover" />
  );

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="flex flex-col gap-[clamp(0.6rem,1.1svh,0.9rem)]">
      {/* The label, and a bar per picture */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          <FieldValue field="peekLabel" />
        </span>
        <div className="flex flex-1 gap-1">
          {images.map((n, at) => (
            <button
              key={n}
              type="button"
              aria-label={`Show photo ${at + 1}`}
              aria-current={at === index}
              onClick={() => show(at)}
              className="relative h-[3px] flex-1 cursor-pointer overflow-hidden border-0 bg-foreground/15 p-0"
            >
              {at === index && auto ? (
                <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-primary" />
              ) : (
                <span className={`absolute inset-0 origin-left bg-primary transition-transform duration-300 ${at <= index ? "scale-x-100" : "scale-x-0"}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-[clamp(0.75rem,1cqw,1rem)]">
        {/* The frame: the last picture under the next one sweeping over it */}
        <button
          type="button"
          aria-label={`Next photo of ${name}`}
          onClick={() => show(index + 1)}
          className="relative aspect-[4/5] w-[clamp(4.25rem,4.6cqw,5.5rem)] shrink-0 cursor-pointer overflow-hidden border-0 bg-foreground/10 p-0"
        >
          {previous !== null && <div className="absolute inset-0">{picture(previous, "")}</div>}
          <motion.div
            key={index}
            className="absolute inset-0 overflow-hidden"
            initial={previous !== null && !still ? { clipPath: "inset(0% 0% 0% 100%)" } : false}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1, ease: soft }}
          >
            <motion.div className="absolute inset-0" initial={previous !== null && !still ? { scale: 1.2 } : false} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }}>
              {picture(index, name)}
            </motion.div>
          </motion.div>
        </button>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-display text-[15px] font-bold leading-tight tracking-[-0.01em]">
            <FieldValue field="peekName" />
          </span>
          <span className="text-[13px] leading-snug text-muted-foreground">
            <FieldValue field="peekRole" />
          </span>
          <button
            type="button"
            onClick={() => navigate(target)}
            className="group/link mt-1 inline-flex w-fit cursor-pointer items-center gap-1.5 whitespace-nowrap border-0 bg-transparent p-0 text-[12px] font-medium uppercase tracking-[0.08em] text-primary"
          >
            <FieldValue field="peekMore" />
            <ArrowRight aria-hidden="true" className={arrowIcon} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
