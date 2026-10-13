"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";
import { ArrowButton } from "./blocks";
import { useField } from "./context";
import { scrollParent, viewOf } from "./scroll";

// Projects one per screen, in the look of a fashion poster: a black-and-white
// image on one side, crossed by an accent band running to the screen's edge,
// and beside it the title in heavy capitals, the number in an accent label
// on a thin line reaching into the image, a short text and a View project button.
//
// The images stretch like rubber: while the page scrolls, an image's leading
// edge moves with the page and its trailing edge lags behind, so it grows
// longer the faster the scroll (the leaving image down from its top, the
// arriving one rising with its bottom trailing), then shrinks smoothly back
// to its size as the page comes to rest. The picture also drifts slowly
// inside the frame.
//
// When a project comes into view it plays one soft timeline, everything
// moving the way the image sweeps (leftwards for an image on the left,
// rightwards for one on the right): first the image unveils sideways from
// the edge facing the text, its picture settling from a slight zoom; the
// band sweeps in from the screen's edge; then the line draws from the
// number into the image; then the text drifts in
// piece by piece. As it leaves, the text falls behind the image and fades.
// Each time, so scrolling back replays it. Reduced motion shows everything still.
//
// A project's fields, by prefix (`fields="project1"`): project1Title,
// project1Label, project1Text, project1Image, project1Cta (the button's
// text) and project1Url (its link).

const ease = [0.22, 1, 0.36, 1] as const;

// Where the element is in the view: `progress` is 0 while it is below the
// screen, 0.5 when centred in it, 1 once it has left at the top; `top` is its
// top edge in pixels from the top of the view. Works in the editor's canvas
// and on the page.
function useViewPosition(ref: RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0.5);
  const top = useMotionValue(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const parent = scrollParent(element);
    const scroller: HTMLElement | Window = parent ?? window;
    const update = () => {
      const view = viewOf(parent);
      const box = element.getBoundingClientRect();
      const passed = (view.height - (box.top - view.top)) / (view.height + box.height);
      progress.set(Math.min(1, Math.max(0, passed)));
      top.set(box.top - view.top);
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, progress, top]);
  return { progress, top };
}

/* ---------- Layout ---------- */

// One project: a full screen from the desktop layout up, in the same two
// columns as the PosterHero (36:46), so the text lines up with the hero's
// and the image stands where its portrait does; on phones the image above
// the text.
const slide = cva("grid grid-cols-1 gap-y-6 py-12 @xl:min-h-[100svh] @xl:content-center @xl:py-0", {
  variants: {
    // Which side the image is on.
    side: {
      start: "@xl:grid-cols-[46fr_36fr]",
      end: "@xl:grid-cols-[36fr_46fr]",
    },
  },
  defaultVariants: { side: "start" },
});

// The image's frame. From the desktop layout up its height is a share of the
// screen and its width follows the shape, so projects differ in size.
// (Its picture stretches out of it while the page scrolls; see ElasticImage.)
const frame = cva("relative w-full @xl:w-auto", {
  variants: {
    shape: {
      tall: "aspect-[5/8] @xl:h-[62svh]",
      wide: "aspect-[10/9] @xl:h-[42svh]",
      portrait: "aspect-[5/6] @xl:h-[56svh]",
      slim: "aspect-[1/2] max-h-[80svh] @xl:max-h-none @xl:h-[58svh]",
    },
    // In its column a little way in from the text, as the hero's portrait.
    side: { start: "@xl:mr-[4cqw] @xl:justify-self-end", end: "@xl:order-last @xl:ml-[4cqw] @xl:justify-self-start" },
  },
  defaultVariants: { shape: "portrait", side: "start" },
});

export type ProjectShape = NonNullable<VariantProps<typeof frame>["shape"]>;

// The text beside the image, as tall as it: the title at the top, the number
// a third of the way down, the text below it and the arrow at the bottom.
const column = "flex flex-col gap-5 @xl:grid @xl:grid-rows-[auto_1fr_auto_2fr_auto_1.2fr_auto] @xl:gap-0 @xl:py-[1.5svh]";

/* ---------- Pieces ---------- */

// How far the trailing edge lags, in seconds of scrolling (0.05s at
// 1000px/s is 50px), and the longest the image may grow (a tenth).
const LAG = 0.05;
const STRETCH = 0.1;
// The spring the stretch follows: slow and a little overdamped, so it eases
// in and shrinks back softly, without a bounce.
const RUBBER = { stiffness: 80, damping: 22, mass: 1 };

// The picture, stretching like rubber. The trailing edge's lag (pixels,
// positive while the page moves up) follows the scroll speed on the spring;
// the image grows by it away from the leading edge: down from the top while
// the page moves up, up from the bottom while it moves down.
function ElasticImage({
  field,
  label,
  progress,
  top,
  still,
  revealed,
}: { field: string; label: string; progress: MotionValue<number>; top: MotionValue<number>; still: boolean; revealed: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const src = useField(field).value;
  const lag = useSpring(useTransform(useVelocity(top), (speed) => -speed * LAG), RUBBER);
  const scaleY = useTransform(lag, (pixels) => {
    const height = ref.current?.offsetHeight || 1;
    return 1 + Math.min(STRETCH, Math.abs(pixels) / height);
  });
  const transformOrigin = useTransform(lag, (pixels) => (pixels >= 0 ? "50% 0%" : "50% 100%"));
  const drift = useTransform(progress, [0, 1], ["-4%", "4%"]);
  return (
    <motion.div
      ref={ref}
      style={still ? undefined : { scaleY, transformOrigin }}
      className="absolute inset-0 overflow-hidden bg-muted will-change-transform"
    >
      {src && (
        <motion.img
          src={src}
          alt={label}
          loading="lazy"
          decoding="async"
          style={still ? undefined : { y: drift }}
          initial={{ scale: still ? 1 : ZOOM }}
          animate={{ scale: still || revealed ? 1 : ZOOM }}
          transition={revealed ? TIMELINE.zoom : { duration: 0 }}
          className="absolute inset-x-0 -top-[5%] block h-[110%] w-full object-cover contrast-[1.05] grayscale"
        />
      )}
    </motion.div>
  );
}

// A project's entrance, one soft timeline, all moving the same way as the
// image's sweep: first the image unveils (its picture settling from a
// slight zoom), then the line draws, then the text drifts in piece by piece.
// Delays and durations in seconds.
const soft = [0.65, 0, 0.35, 1] as const;
const TIMELINE = {
  image: { delay: 0, duration: 1, ease: soft },
  zoom: { delay: 0, duration: 1.3, ease },
  band: { delay: 0.3, duration: 0.9, ease: soft },
  square: { delay: 0.9, duration: 0.45, ease },
  line: { delay: 0.45, duration: 0.8, ease: soft },
  text: { delay: 0.65, duration: 0.75, ease },
  // Between one piece of text and the next.
  stagger: 0.08,
};
// How far in the picture starts, and how far (pixels) the text drifts.
const ZOOM = 1.1;
const DRIFT = 28;
// Hiding again, once the project has left.
const hide = { duration: 0.35 };

// A piece of text of the timeline, the `step`th: it fades in drifting from
// `from` pixels sideways, and hides again quickly once out.
function Enter({ shown, from, step, className, children }: { shown: boolean; from: number; step: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: from }}
      animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: from }}
      transition={shown ? { ...TIMELINE.text, delay: TIMELINE.text.delay + step * TIMELINE.stagger } : hide}
    >
      {children}
    </motion.div>
  );
}

// The number on its line. The line reaches across the gap into the image,
// and draws the way the image swept: from the number into the image. From
// the desktop layout up only.
const line = cva("hidden h-px bg-foreground/40 @xl:block", {
  variants: {
    side: {
      // The image on the left: the line ends just before the number.
      start: "absolute right-[calc(100%+0.75rem)] top-1/2 w-[12cqw] origin-right",
      // The image on the right: the line runs from the number into it.
      end: "-mr-[12cqw] flex-1 origin-left",
    },
  },
});

// The number comes in with the text (as its `step`th piece); the line before it.
function Marker({
  field,
  side,
  shown,
  still,
  from,
  step,
  className,
}: { field: string; side: "start" | "end"; shown: boolean; still: boolean; from: number; step: number; className?: string }) {
  return (
    <div className={`relative flex items-center gap-3 ${className ?? ""}`}>
      <Enter shown={shown} from={from} step={step}>
        <span className="block bg-primary px-2 py-1 text-[11px] font-medium uppercase leading-none tracking-[0.06em] text-card">{useField(field).node}</span>
      </Enter>
      <motion.span
        aria-hidden="true"
        className={line({ side })}
        initial={still ? false : { scaleX: 0 }}
        animate={still || shown ? { scaleX: 1 } : { scaleX: 0 }}
        transition={shown ? TIMELINE.line : hide}
      />
    </div>
  );
}

// The project's button, as the hero's Discover more: "View project", opening
// the project's link. Without a link it is left out of the page (it stays in
// the editor, as a reminder to add one).
function ProjectButton({ field, urlField }: { field: string; urlField: string }) {
  const { value, editing } = useField(urlField);
  if (!value && !editing) return null;
  return <ArrowButton field={field} href={value} />;
}

// Unveils the image sideways, from the edge facing the text (where the line
// touches it) to the far one. Vertically it leaves room, so the stretch is
// never cut.
function LineReveal({ side, revealed, still, children }: { side: "start" | "end"; revealed: boolean; still: boolean; children: ReactNode }) {
  const open = "inset(-30% 0% -30% 0%)";
  // The image on the left opens from its right edge, on the right from its left.
  const closed = side === "start" ? "inset(-30% 0% -30% 100%)" : "inset(-30% 100% -30% 0%)";
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ clipPath: still ? open : closed }}
      animate={{ clipPath: still || revealed ? open : closed }}
      transition={revealed ? TIMELINE.image : { duration: 0 }}
    >
      {children}
    </motion.div>
  );
}

// A light accent band across the image (the accent at a little over half
// strength, softer than the hero's): it tints the picture
// where they meet (multiply) and runs on to the screen's edge away from the
// text, a small black square at its end by the text. It sweeps in from the
// screen's edge after the image has begun to open.
const band = cva("pointer-events-none absolute top-[56%] h-[28%] bg-primary/55 mix-blend-multiply", {
  variants: {
    side: {
      start: "-left-[100cqw] right-[22%] origin-left",
      end: "-right-[100cqw] left-[22%] origin-right",
    },
  },
});
const square = cva("absolute bottom-0 size-[clamp(1.25rem,2cqw,2rem)] bg-foreground", {
  variants: { side: { start: "right-0", end: "left-0" } },
});

function Band({ side, revealed, still }: { side: "start" | "end"; revealed: boolean; still: boolean }) {
  const shown = still || revealed;
  return (
    <motion.div
      aria-hidden="true"
      className={band({ side })}
      initial={{ scaleX: still ? 1 : 0 }}
      animate={{ scaleX: shown ? 1 : 0 }}
      transition={revealed ? TIMELINE.band : { duration: 0 }}
    >
      <motion.div
        className={square({ side })}
        initial={{ scale: still ? 1 : 0 }}
        animate={{ scale: shown ? 1 : 0 }}
        transition={revealed ? TIMELINE.square : { duration: 0 }}
      />
    </motion.div>
  );
}

// A project's title, as the hero's name: capitals ending in a full stop, a
// step lighter (bold).
function ProjectTitle({ field }: { field: string }) {
  const { value, editing, node } = useField(field);
  return (
    <h3 className="m-0 font-display text-[length:clamp(2rem,3.6cqw,4.25rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] [overflow-wrap:anywhere]">
      {editing ? node : `${value}.`}
    </h3>
  );
}

/* ---------- The project ---------- */

export function ProjectSlide({ fields, side = "start", shape }: { fields: string; side?: "start" | "end"; shape?: ProjectShape }) {
  const ref = useRef<HTMLElement>(null);
  const { progress, top } = useViewPosition(ref);
  const inView = useInView(ref, { amount: 0.45 });
  const reduceMotion = useReducedMotion();
  const still = Boolean(reduceMotion);
  const shown = still || inView;
  // The image stays revealed while any of the project is on screen, and
  // closes again (unseen) once it is gone, ready to replay.
  const onScreen = useInView(ref);
  const [revealed, setRevealed] = useState(false);
  if (shown && !revealed) setRevealed(true);
  else if (!shown && !onScreen && revealed) setRevealed(false);
  const title = useField(`${fields}Title`).value;
  const text = useField(`${fields}Text`).node;

  // Leaving at the top, the text falls behind the image and fades.
  const lag = useTransform(progress, [0.5, 1], [0, 160]);
  const fade = useTransform(progress, [0.5, 0.7], [1, 0]);
  // The text drifts the way the image swept: right to left beside an image
  // on the left (which opens leftwards), left to right beside one on the right.
  const from = still ? 0 : side === "start" ? DRIFT : -DRIFT;

  return (
    <article ref={ref} data-label-item className={slide({ side })}>
      <div className={frame({ shape, side })}>
        <LineReveal side={side} revealed={revealed} still={still}>
          <ElasticImage field={`${fields}Image`} label={title} progress={progress} top={top} still={still} revealed={revealed} />
        </LineReveal>
        <Band side={side} revealed={revealed} still={still} />
      </div>
      <motion.div style={still ? undefined : { y: lag, opacity: fade }} className={column}>
        <Enter shown={shown} from={from} step={0} className="@xl:row-start-1">
          <ProjectTitle field={`${fields}Title`} />
        </Enter>
        <Marker field={`${fields}Label`} side={side} shown={shown} still={still} from={from} step={1} className="@xl:row-start-3" />
        <Enter shown={shown} from={from} step={2} className="@xl:row-start-5 @xl:pl-[3cqw]">
          <div className="max-w-[24rem] text-[length:clamp(0.95rem,1.15cqw,1.15rem)] font-medium leading-snug tracking-[-0.01em]">
            {text}
          </div>
        </Enter>
        <Enter shown={shown} from={from} step={3} className="@xl:row-start-7">
          <ProjectButton field={`${fields}Cta`} urlField={`${fields}Url`} />
        </Enter>
      </motion.div>
    </article>
  );
}

