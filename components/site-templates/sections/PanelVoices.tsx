"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FieldPicture } from "../core/blocks";
import { useTemplate } from "../core/context";
import { AccentNumber, ease, FieldValue, number, PanelFrame, PanelTitle, Rise, roundButton, type } from "./panel-kit";

// What clients say, as the hero's slider:
//
//   [ eyebrow ][                       ][              ][ 02 ]
//   [ title (huge)                     ][              ][    ]
//   [   “     ][ the quote, large                      ][ 01 ]
//   [         ][ face, name, role      ][ ‹ ›  ———     ][ 03 ]
//
// The quote leaves and the next drifts in from the side it travels from, the
// accent number rolling to it; the other numbers, in the accent column, show
// theirs. The quotes take turns on their own (a thin line filling as the time
// runs), pausing while pointed at; not while editing or for reduced motion.
//
// Its section's fields: `eyebrow`, `title`, and for each quote (`voice1`...):
// Quote, Name, Role and Image.

const HOLD = 8;
const DRIFT = 28;

const place = {
  eyebrow: "px-5 pt-14 @xl:col-start-1 @xl:row-start-1 @xl:px-[3.2cqw] @xl:pt-[2.4cqw]",
  accent: "@xl:col-start-4 @xl:row-start-1",
  title: "px-5 pt-4 @xl:col-span-2 @xl:col-start-1 @xl:row-start-2 @xl:px-[3.2cqw]",
  mark: "hidden @xl:col-start-1 @xl:row-start-3 @xl:block @xl:px-[3.2cqw] @xl:pt-[6svh]",
  quote: "px-5 pt-10 @xl:col-span-2 @xl:col-start-2 @xl:row-start-3 @xl:min-h-[34svh] @xl:pl-[3.3cqw] @xl:pr-[4cqw] @xl:pt-[8svh]",
  person: "px-5 pt-8 @xl:col-start-2 @xl:row-start-4 @xl:self-center @xl:pl-[3.3cqw] @xl:pt-0",
  controls: "flex items-center gap-4 px-5 pb-16 pt-8 @xl:col-start-3 @xl:row-start-4 @xl:h-[20svh] @xl:px-[2.6cqw] @xl:py-0",
  others: "hidden bg-primary @xl:col-start-4 @xl:row-span-2 @xl:row-start-3 @xl:flex @xl:flex-col @xl:items-center @xl:justify-center @xl:gap-[2.5svh]",
};

export default function PanelVoices({ voices }: { voices: number[] }) {
  const { edit } = useTemplate();
  const still = Boolean(useReducedMotion());
  const auto = !still && !edit;
  const [{ index, direction }, setState] = useState({ index: 0, direction: 1 });
  const [paused, setPaused] = useState(false);
  const count = voices.length;
  const prefix = `voice${voices[index]}`;

  const show = (to: number, way?: number) => {
    const target = (to + count) % count;
    if (target === index) return;
    setState({ index: target, direction: way ?? (target > index ? 1 : -1) });
  };

  const progress = useMotionValue(0);
  useEffect(() => progress.set(0), [index, progress]);
  useAnimationFrame((_, delta) => {
    if (!auto || paused) return;
    const next = progress.get() + delta / (HOLD * 1000);
    progress.set(next >= 1 ? 0 : next);
    if (next >= 1) show(index + 1, 1);
  });

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <PanelFrame grid="@xl:grid-rows-[20svh_auto_auto_auto]">
        <div className={place.eyebrow}>
          <Rise>
            <div className={type.eyebrow}>
              <FieldValue field="eyebrow" />
            </div>
          </Rise>
        </div>

        <div className={place.accent}>
          <AccentNumber value={number(index)} direction={direction} />
        </div>

        <div className={place.title}>
          <PanelTitle field="title" />
        </div>

        <div className={place.mark} aria-hidden="true">
          <Rise>
            <span className="block font-display text-[length:clamp(6rem,11cqw,11rem)] font-bold leading-[0.7] text-primary">“</span>
          </Rise>
        </div>

        <div className={place.quote} aria-live="polite">
          <Change index={index} direction={direction} still={still}>
            <blockquote className="m-0 font-display text-[length:clamp(1.4rem,2.5cqw,2.6rem)] font-medium leading-[1.18] tracking-[-0.035em]">
              <FieldValue field={`${prefix}Quote`} />
            </blockquote>
          </Change>
        </div>

        <div className={place.person}>
          <Change index={index} direction={direction} still={still}>
            <div className="flex items-center gap-4">
              <span className="relative block size-14 shrink-0 overflow-hidden rounded-full bg-foreground/[0.07]">
                <FieldPicture field={`${prefix}Image`} className="absolute inset-0 block h-full w-full object-cover grayscale" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={type.name}>
                  <FieldValue field={`${prefix}Name`} />
                </span>
                <span className="text-[13px] text-muted-foreground">
                  <FieldValue field={`${prefix}Role`} />
                </span>
              </span>
            </div>
          </Change>
        </div>

        <div className={place.controls}>
          <button type="button" aria-label="Previous quote" onClick={() => show(index - 1, -1)} className={roundButton}>
            <ChevronLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button type="button" aria-label="Next quote" onClick={() => show(index + 1, 1)} className={roundButton}>
            <ChevronRight className="size-4" strokeWidth={1.5} />
          </button>
          {auto && (
            <span aria-hidden="true" className="relative ml-2 h-px flex-1 overflow-hidden bg-foreground/15">
              <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-primary" />
            </span>
          )}
          <span className="ml-auto font-display text-sm font-bold @xl:hidden">
            <span className="text-primary">{number(index)}</span>
            <span className="text-muted-foreground"> / {String(count).padStart(2, "0")}</span>
          </span>
        </div>

        {/* The other numbers */}
        <div className={place.others}>
          {voices.map((_, at) =>
            at === index ? null : (
              <button
                key={at}
                type="button"
                aria-label={`Show quote ${at + 1}`}
                onClick={() => show(at)}
                className={`cursor-pointer border-0 bg-transparent text-card/45 transition-colors duration-300 hover:text-card ${type.number}`}
              >
                {number(at)}
              </button>
            ),
          )}
        </div>
      </PanelFrame>
    </div>
  );
}

// The current quote's part: it leaves quickly, the next drifting in after it.
function Change({ index, direction, still, children }: { index: number; direction: number; still: boolean; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={index}
        initial={still ? false : { opacity: 0, x: direction * DRIFT }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.9, ease, delay: 0.1 } }}
        exit={still ? undefined : { opacity: 0, x: -direction * DRIFT * 0.5, transition: { duration: 0.3, ease } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
