"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, motionValue, useMotionValue, useReducedMotion, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FieldPicture } from "../core/blocks";
import { useField, useSectionId, useTemplate } from "../core/context";
import { glideTo, scrollParent, viewOf } from "../core/scroll";
import DeckSlider from "./DeckSlider";

// The Deck template's opening, after the Portory landing page:
//
//   [ name, line, buttons ][ a deck of project images ]
//   ...scrolling...
//   [        Projects: tabs and a slider of cards       ]
//
// The intro stays in place while each scroll step brings the next project's
// image onto a deck beside the name, each rising while the one before is
// still moving. Scrolling on, the images leave the deck one after another
// and glide into the slider below, each onto its own card's image, the top
// one in the middle; the cards' frames fade in around them. While editing,
// or with reduced motion, nothing is pinned and the slider simply shows.
//
// The images live in one overlay over both parts, so the same image travels
// the whole way; their places are worked out from the scroll position (in
// the editor's canvas or on the page) on every frame.
//
// Its section's fields: `name`, `accent`, `text`, `primaryLabel`,
// `primaryUrl`, `secondaryLabel`; `workTag`, `workTitle`, `workIntro`,
// `viewLabel`; and for each project (`project1`...): Title, Category, Text,
// Image and Url.

const ease = [0.22, 1, 0.36, 1] as const;
// Scroll (share of the view) between one image starting to rise and the
// next; each takes RISE steps to arrive. Then a pause once all are shown.
const STEP = 0.35;
const RISE = 3;
const HOLD = 0.4;
// Deck images are 16:10.
const RATIO = 0.625;
// Each image's place on the deck: offset as a share of the image.
const DECK = [
  { x: -0.06, y: -0.07 },
  { x: 0.05, y: -0.025 },
  { x: -0.03, y: 0.02 },
  { x: 0.035, y: 0.065 },
];
// In the glide into the slider, each image starts this much later.
const STAGGER = 0.08;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

type Pose = Record<"x" | "y" | "w" | "h" | "opacity", MotionValue<number>>;
const newPose = (): Pose => ({ x: motionValue(0), y: motionValue(0), w: motionValue(0), h: motionValue(0), opacity: motionValue(0) });

function FieldValue({ field }: { field: string }) {
  return <>{useField(field).node}</>;
}

const pill = "group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-solid px-6 text-[0.95rem] font-medium no-underline transition-colors duration-300";
const tone = {
  solid: "border-foreground bg-foreground text-card hover:border-primary hover:bg-primary",
  outline: "border-foreground/15 bg-transparent text-foreground hover:border-foreground",
};

// A rounded button whose text is a field: a link to the address in
// `hrefField`, or it runs `onClick`. While editing, a plain button, so its
// text can be typed into.
function PillButton({ field, hrefField, onClick, solid = false, children }: { field: string; hrefField?: string; onClick?: () => void; solid?: boolean; children?: ReactNode }) {
  const { node, editing } = useField(field);
  const href = useField(hrefField ?? field).value;
  const className = `${pill} ${solid ? tone.solid : tone.outline}`;
  if (hrefField && href && !editing) {
    return (
      <a href={href} className={className}>
        {node}
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={editing ? undefined : onClick} className={className}>
      {node}
      {children}
    </button>
  );
}

// One travelling image. The slider's cards carry the links, so it is decorative.
function DeckImage({ field, pose, index, top }: { field: string; pose: Pose; index: number; top: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: pose.x, y: pose.y, width: pose.w, height: pose.h, opacity: pose.opacity, zIndex: top ? 99 : index + 1 }}
      className="absolute left-0 top-0 overflow-hidden rounded-2xl bg-card shadow-[0_2px_6px_rgb(0_0_0/0.06),0_30px_60px_-28px_rgb(0_0_0/0.4)] ring-1 ring-foreground/10 will-change-transform"
    >
      <FieldPicture field={field} priority={index === 0} className="absolute inset-0 block h-full w-full object-cover" />
    </motion.div>
  );
}

// The label under the deck: which project has just arrived.
function DeckLabel({ prefix, index, count }: { prefix: string; index: number; count: number }) {
  const title = useField(`${prefix}Title`).value;
  const category = useField(`${prefix}Category`).value;
  return (
    <p aria-live="polite" className="m-0 flex items-baseline justify-center gap-3 text-sm">
      <span className="tabular-nums text-muted-foreground">{index + 1} / {count}</span>
      <span className="font-medium">{title}</span>
      {category && <span className="hidden text-muted-foreground @xl:inline">{category}</span>}
    </p>
  );
}

export default function DeckShowcase({ projects }: { projects: number[] }) {
  const id = useSectionId();
  const { edit } = useTemplate();
  const editing = Boolean(edit);
  const still = Boolean(useReducedMotion()) || editing;
  const count = projects.length;
  const top = count - 1;
  const prefix = (at: number) => `project${projects[at]}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [poses] = useState(() => projects.map(newPose));
  // The first image drops onto the deck on load; the rest come with scrolling.
  const intro = useMotionValue(0);
  // How far the images have travelled into the slider (0 to 1).
  const arrival = useMotionValue(still ? 1 : 0);
  const [shown, setShown] = useState(0);

  const update = () => {
    const root = rootRef.current;
    const track = trackRef.current;
    const deck = deckRef.current;
    const slider = sliderRef.current;
    if (!root || !track || !deck || !slider) return;
    if (still) {
      arrival.set(1);
      poses.forEach((pose) => pose.opacity.set(0));
      return;
    }
    const view = viewOf(scrollParent(root));
    const vh = view.height;
    const R = root.getBoundingClientRect();
    const D = deck.getBoundingClientRect();
    // How far the intro has been scrolled while it stays in place.
    const scrolled = view.top - track.getBoundingClientRect().top;
    const step = STEP * vh;
    // 0 while the slider is below the view, 1 once it is well in view.
    const fall = clamp((vh * 0.95 - (slider.getBoundingClientRect().top - view.top)) / (vh * 0.8));
    arrival.set(fall);
    const deckW = Math.min(D.width * 0.96, (D.height * 0.92) / RATIO);
    const deckH = deckW * RATIO;

    let last = 0;
    poses.forEach((pose, i) => {
      // This project's card nearest the middle of the view (the slider repeats them).
      let target: HTMLElement | null = null;
      let nearest = Infinity;
      slider.querySelectorAll<HTMLElement>(`[data-deck-project="${prefix(i)}"]`).forEach((card) => {
        const box = card.getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - (R.left + R.width / 2));
        if (distance < nearest) {
          nearest = distance;
          target = card;
        }
      });
      // Its image: the card's second column.
      const pane = (target as HTMLElement | null)?.firstElementChild?.lastElementChild;
      if (!(pane instanceof HTMLElement)) return;
      const S = pane.getBoundingClientRect();

      const reveal = i === 0 ? intro.get() : clamp((scrolled - (i - 1) * step) / (step * RISE));
      if (reveal >= 0.5) last = i;
      const r = easeOut(reveal);
      const at = DECK[i % DECK.length];
      // On the deck; before its step, below the view.
      const dx = D.left + D.width / 2 + at.x * deckW - deckW / 2 - R.left;
      const dy = D.top + D.height / 2 + at.y * deckH - deckH / 2 - R.top + (1 - r) * vh * 0.85;
      // Into its card's image, each a little after the one under it; one
      // whose card is outside the view fades away on the way.
      const f = easeInOut(clamp((fall - i * STAGGER) / (1 - STAGGER * (count - 1))));
      pose.x.set(lerp(dx, S.left - R.left, f));
      pose.y.set(lerp(dy, S.top - R.top, f));
      pose.w.set(lerp(deckW, S.width, f));
      pose.h.set(lerp(deckH, S.height, f));
      const visible = Math.max(clamp(reveal * 3), f);
      const outside = S.right < R.left || S.left > R.right;
      const fade = outside ? clamp((f - 0.35) / 0.45) : 0;
      // Once all have landed, the slider's own images take over.
      pose.opacity.set(fall >= 1 ? 0 : visible * (1 - fade));
    });
    setShown(last);
  };

  // Keep the latest closure for the listeners below.
  const updateRef = useRef(update);
  useEffect(() => {
    updateRef.current = update;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const parent = scrollParent(root);
    const scroller: HTMLElement | Window = parent ?? window;
    const run = () => updateRef.current();
    const drop = animate(intro, 1, { duration: 1.1, delay: 0.35, ease, onUpdate: run });
    const observer = new ResizeObserver(run);
    observer.observe(root);
    scroller.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    run();
    return () => {
      drop.stop();
      observer.disconnect();
      scroller.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
    };
  }, [intro, still]);

  const goToProjects = () => {
    const target = sliderRef.current;
    if (target) glideTo(target);
  };

  return (
    <section data-section={id} ref={rootRef} className="relative overflow-x-clip">
      {/* The intro stays in place for one view plus a step per project. */}
      <div ref={trackRef} style={still ? undefined : { height: `calc(100svh + ${((count - 2 + RISE) * STEP + HOLD) * 100}svh)` }}>
        <div className={`${still ? "" : "sticky top-0"} flex min-h-[100svh] items-center`}>
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-8 px-5 py-20 @xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] @xl:gap-[5cqw] @xl:px-8">
            <motion.div
              initial={still ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="flex flex-col items-start gap-6"
            >
              <h1 className="m-0 text-balance font-display text-[length:clamp(2.5rem,9cqw,3.25rem)] font-medium leading-[0.95] tracking-[-0.045em] @xl:text-[length:clamp(2.75rem,4.6cqw,5.25rem)]">
                <FieldValue field="name" /> <span className="text-muted-foreground">
                  <FieldValue field="accent" />
                </span>
              </h1>
              <p className="m-0 max-w-[34rem] text-pretty text-base leading-relaxed text-muted-foreground @xl:text-lg">
                <FieldValue field="text" />
              </p>
              <div className="flex flex-wrap gap-3">
                <PillButton field="primaryLabel" hrefField="primaryUrl" solid>
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </PillButton>
                <PillButton field="secondaryLabel" onClick={goToProjects} />
              </div>
            </motion.div>

            {!still && (
              <div className="flex flex-col gap-4">
                {/* Where the deck sits; the images themselves are in the overlay. */}
                <div ref={deckRef} aria-hidden="true" className="h-[42svh] w-full @xl:aspect-[16/11] @xl:h-auto @xl:max-h-[72svh]" />
                <DeckLabel prefix={prefix(shown)} index={shown} count={count} />
              </div>
            )}
            {still && <div ref={deckRef} aria-hidden="true" className="hidden" />}
          </div>
        </div>
      </div>

      <div ref={sliderRef} className="pb-20 pt-12 @xl:pb-28">
        <div className="mx-auto mb-8 flex w-full max-w-[1600px] flex-col items-center gap-2 px-5 text-center @xl:mb-10 @xl:px-8">
          <span className="mb-1 rounded-full border border-solid border-foreground/10 px-3 py-1 text-xs font-medium">
            <FieldValue field="workTag" />
          </span>
          <h2 className="m-0 max-w-[48rem] text-balance font-display text-[length:clamp(1.9rem,8cqw,3.3rem)] font-medium leading-[1.1] tracking-[-0.03em] @xl:text-[length:clamp(2.4rem,3.3cqw,3.6rem)]">
            <FieldValue field="workTitle" />
          </h2>
          <p className="m-0 max-w-[36rem] text-balance text-lg leading-snug text-muted-foreground">
            <FieldValue field="workIntro" />
          </p>
        </div>
        <DeckSlider projects={projects} start={top} arrival={arrival} editing={editing} />
      </div>

      {/* The travelling images, over the intro and on into the slider. */}
      {!still && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
          {poses.map((pose, i) => (
            <DeckImage key={projects[i]} field={`${prefix(i)}Image`} pose={pose} index={i} top={i === top} />
          ))}
        </div>
      )}
    </section>
  );
}
