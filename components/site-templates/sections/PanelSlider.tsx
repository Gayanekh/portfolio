"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FieldPicture, Menu } from "../core/blocks";
import { useField, useSectionId } from "../core/context";

// A poster-like opening screen with a slider of series, in panels:
//
//   [ site title ][ menu            ][          ][ ≡  ]
//   [ eyebrow                       ][  image          ]
//   [ HUGE TITLE across both        ][  (to the edge)  ]
//   [ panel     ][ subtitle, text   ][ ‹  ›     ][ 02 ]
//
// A grey panel on the left, a thin line down the middle, and an accent
// column on the right holding the menu button, the current number and the
// other numbers. Following a number or the arrows changes the series: the
// new image sweeps over the old one in the direction of travel, settling
// from a slight zoom, then its text follows the same way, the title rising
// from behind an edge. On phones: the title bar, the image, the controls,
// then the text.
//
// Its section's fields: `siteTitle`, and for each slide (by prefix,
// `slide1`...): Eyebrow, Title, Subtitle, Text and Image.

const ease = [0.22, 1, 0.36, 1] as const;
const soft = [0.65, 0, 0.35, 1] as const;
const number = (index: number) => String(index + 1).padStart(2, "0");

// The change of series, in seconds: the image sweeps first, then the text.
const TIMING = {
  image: { duration: 1.2, ease: soft },
  zoom: { duration: 1.6, ease },
  text: { duration: 0.9, ease, delay: 0.35 },
  stagger: 0.1,
  out: { duration: 0.3, ease },
};
// How far in a new picture starts, and how far (pixels) the text drifts.
const ZOOM = 1.12;
const DRIFT = 28;

// The panels' places from the desktop layout up (four columns, three rows);
// on phones two columns, the title bar on the first row.
const grid =
  "relative grid grid-cols-[1fr_auto] overflow-hidden bg-card @xl:h-[100svh] @xl:min-h-[38rem] @xl:grid-cols-[17fr_33.5fr_37.5fr_12fr] @xl:grid-rows-[20fr_60fr_20fr]";
const place = {
  panel: "hidden bg-foreground/[0.07] @xl:col-start-1 @xl:row-span-3 @xl:row-start-1 @xl:block",
  divider: "pointer-events-none hidden border-0 border-l border-solid border-foreground/15 @xl:col-start-3 @xl:row-span-3 @xl:row-start-1 @xl:block",
  title: "self-center px-5 py-4 @xl:col-start-1 @xl:row-start-1 @xl:self-start @xl:px-[3.2cqw] @xl:pt-[2.4cqw]",
  menu: "hidden @xl:col-start-2 @xl:row-start-1 @xl:block @xl:pl-[3.3cqw] @xl:pt-[2.4cqw]",
  accentTop: "flex flex-col bg-primary text-card @xl:col-start-4 @xl:row-start-1",
  image: "relative col-span-2 aspect-[4/5] overflow-hidden bg-foreground/[0.07] @xl:col-span-2 @xl:col-start-3 @xl:row-start-2 @xl:aspect-auto",
  controls: "col-span-2 flex items-center justify-between gap-3 px-5 py-4 @xl:col-span-1 @xl:col-start-3 @xl:row-start-3 @xl:justify-end @xl:px-[2.2cqw] @xl:py-0",
  accentBottom: "hidden bg-primary @xl:col-start-4 @xl:row-start-3 @xl:flex @xl:flex-col @xl:items-center @xl:justify-center @xl:gap-[2.5svh]",
  heading: "z-10 col-span-2 px-5 pt-6 @xl:col-span-2 @xl:col-start-1 @xl:row-start-2 @xl:self-start @xl:px-[3.2cqw] @xl:pt-[6svh]",
  body: "col-span-2 px-5 pb-14 pt-8 @xl:col-span-1 @xl:col-start-2 @xl:row-span-2 @xl:row-start-2 @xl:self-end @xl:pb-[12svh] @xl:pl-[3.3cqw] @xl:pr-[3cqw] @xl:pt-0",
};

/* ---------- Pieces ---------- */

function FieldValue({ field }: { field: string }) {
  return <>{useField(field).node}</>;
}

// A slide's picture, filling the image panel.
function Picture({ field, label }: { field: string; label: string }) {
  return <FieldPicture field={field} alt={label} priority className="absolute inset-0 block h-full w-full object-cover" />;
}

// The current slide's text: it leaves quickly, and the next comes in after
// the image has begun to sweep, drifting the same way.
function SlideText({ index, direction, moved, still, children }: { index: number; direction: number; moved: boolean; still: boolean; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={index}
        initial={moved && !still ? "out" : false}
        animate="in"
        exit={still ? undefined : "gone"}
        variants={{
          out: {},
          in: { transition: { staggerChildren: TIMING.stagger, delayChildren: TIMING.text.delay } },
          gone: { opacity: 0, x: -direction * DRIFT * 0.5, transition: TIMING.out },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// A piece of a slide's text, drifting in from `direction`.
function Piece({ direction, className, children }: { direction: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      variants={{ out: { opacity: 0, x: direction * DRIFT }, in: { opacity: 1, x: 0, transition: { duration: TIMING.text.duration, ease } } }}
    >
      {children}
    </motion.div>
  );
}

// The huge title, rising from behind an edge.
function Title({ field }: { field: string }) {
  return (
    <div className="-mb-[0.1em] overflow-hidden pb-[0.1em]">
      <motion.h1
        variants={{ out: { y: "105%" }, in: { y: "0%", transition: { duration: 1.1, ease } } }}
        className="m-0 -ml-[0.04em] whitespace-nowrap font-display text-[length:clamp(4.5rem,17cqw,16.5rem)] font-bold leading-[0.82] tracking-[-0.06em]"
      >
        <FieldValue field={field} />
      </motion.h1>
    </div>
  );
}

const roundButton =
  "grid size-[clamp(3rem,calc(1.952rem_+_4.301cqw),3.5rem)] cursor-pointer place-items-center rounded-full border border-solid border-foreground/20 bg-transparent text-foreground transition-colors duration-300 hover:border-foreground";

// Three thin lines, crossing into an X while open.
function MenuIcon({ open }: { open: boolean }) {
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

/* ---------- The slider ---------- */

export default function PanelSlider({ slides }: { slides: number[] }) {
  const id = useSectionId();
  const siteTitle = useField("siteTitle");
  const still = Boolean(useReducedMotion());
  const [open, setOpen] = useState(false);
  // The slide showing, the one before it (left under the sweep), and which
  // way the change went (1: forwards).
  const [{ index, previous, direction }, setState] = useState({ index: 0, previous: 0, direction: 1 });
  const moved = index !== previous;
  const count = slides.length;
  const prefix = (at: number) => `slide${slides[at]}`;
  const title = useField(`${prefix(index)}Title`).value;

  const show = (to: number, way?: number) => {
    const target = (to + count) % count;
    if (target === index) return;
    setState({ index: target, previous: index, direction: way ?? (target > index ? 1 : -1) });
  };

  // The new image opens from the edge it travels from: going forwards it
  // sweeps in from the right, going back from the left.
  const closed = direction > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

  return (
    <section data-section={id} aria-roledescription="carousel" aria-label={siteTitle.value} className={grid}>
      <div className={place.panel} />
      <div className={place.divider} />

      <div className={place.title}>
        <div className="font-display text-[15px] font-bold tracking-[0.01em]">{siteTitle.node}</div>
      </div>

      <div className={place.menu}>
        <Menu size="small" />
      </div>

      {/* The menu button, and the current number under a thin line */}
      <div className={place.accentTop}>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          onClick={() => setOpen((o) => !o)}
          className="relative z-40 grid size-14 cursor-pointer place-items-center border-0 bg-transparent text-card @xl:size-auto @xl:flex-[56]"
        >
          <MenuIcon open={open} />
        </button>
        <div className="hidden overflow-hidden border-0 border-t border-solid border-card/35 @xl:grid @xl:flex-[44] @xl:place-items-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={index}
              initial={{ y: direction * 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -direction * 24, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="font-display text-[length:clamp(1.25rem,1.6cqw,1.6rem)] font-bold"
            >
              {number(index)}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* The image: the last one under the new one sweeping over it */}
      <div className={place.image}>
        {moved && <Picture key={`under-${previous}`} field={`${prefix(previous)}Image`} label="" />}
        <motion.div
          key={index}
          className="absolute inset-0 overflow-hidden"
          initial={moved && !still ? { clipPath: closed } : false}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={TIMING.image}
        >
          <motion.div
            className="absolute inset-0"
            initial={moved && !still ? { scale: ZOOM } : false}
            animate={{ scale: 1 }}
            transition={TIMING.zoom}
          >
            <Picture field={`${prefix(index)}Image`} label={title} />
          </motion.div>
        </motion.div>
      </div>

      {/* Back and next; on phones also where we are */}
      <div className={place.controls}>
        <span className="font-display text-sm font-bold @xl:hidden">
          <span className="text-primary">{number(index)}</span>
          <span className="text-muted-foreground"> / {number(count - 1)}</span>
        </span>
        <div className="flex gap-3">
          <button type="button" aria-label="Previous series" onClick={() => show(index - 1, -1)} className={roundButton}>
            <ChevronLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button type="button" aria-label="Next series" onClick={() => show(index + 1, 1)} className={roundButton}>
            <ChevronRight className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* The other numbers */}
      <div className={place.accentBottom}>
        {slides.map((_, at) =>
          at === index ? null : (
            <button
              key={at}
              type="button"
              aria-label={`Show series ${at + 1}`}
              onClick={() => show(at)}
              className="cursor-pointer border-0 bg-transparent font-display text-[length:clamp(1.25rem,1.6cqw,1.6rem)] font-bold text-card/45 transition-colors duration-300 hover:text-card"
            >
              {number(at)}
            </button>
          ),
        )}
      </div>

      {/* The eyebrow and the huge title, across the panel and the middle */}
      <div className={place.heading} aria-live="polite">
        <SlideText index={index} direction={direction} moved={moved} still={still}>
          <Piece direction={direction}>
            <div className="text-[length:clamp(0.8rem,1.1cqw,1rem)] uppercase tracking-[0.02em] text-muted-foreground">
              <FieldValue field={`${prefix(index)}Eyebrow`} />
            </div>
          </Piece>
          <Title field={`${prefix(index)}Title`} />
        </SlideText>
      </div>

      {/* The subtitle, in the accent colour, and the text */}
      <div className={place.body}>
        <SlideText index={index} direction={direction} moved={moved} still={still}>
          <Piece direction={direction}>
            <div className="text-[length:clamp(1.25rem,1.6cqw,1.6rem)] font-medium leading-tight tracking-[-0.02em] text-primary">
              <FieldValue field={`${prefix(index)}Subtitle`} />
            </div>
          </Piece>
          <Piece direction={direction} className="mt-[5svh]">
            <div className="max-w-[22rem] text-[15px] leading-[1.4]">
              <FieldValue field={`${prefix(index)}Text`} />
            </div>
          </Piece>
        </SlideText>
      </div>

      {/* The menu, opening over the screen from the accent column */}
      <AnimatePresence>
        {open && (
          <motion.div
            id={`${id}-menu`}
            initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 0% 100%)" }}
            transition={{ duration: 0.8, ease: soft }}
            className="absolute inset-0 z-30 flex flex-col justify-center gap-8 bg-primary px-5 text-card [--foreground:var(--card)] @xl:px-[20cqw]"
          >
            <div className="text-[13px] uppercase tracking-[0.1em] text-card/60">{siteTitle.value}</div>
            <Menu size="large" onFollow={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
