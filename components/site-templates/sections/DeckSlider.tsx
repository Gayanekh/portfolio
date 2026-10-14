"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useField, useSectionId } from "../core/context";

// The project slider of the Deck template, after the Portory landing page's
// templates slider: tabs with the project titles, a large card per project
// (its details on the left, its image on the right) with the neighbouring
// cards showing either side, "Previous" / "Next" following the pointer
// beside the middle card, dots, and autoplay with a pause button. It loops:
// the cards are drawn three times and the slider rests in the middle copy.
//
// `arrival` (0 to 1) is how far the DeckShowcase's cards have travelled
// into it: the card frames fade in as they come, the images show once they
// have landed (each lands on its own slide, found by data-deck-project), and
// autoplay waits until then. Without it the slider is simply there.
//
// Its section's fields, for each project (`project1`...): Title, Category,
// Text, Image and Url; and `viewLabel`.

const ease = [0.22, 1, 0.36, 1] as const;
const GAP = 20;
const AUTOPLAY_MS = 4500;
const number = (index: number, count: number) => `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;

function FieldValue({ field }: { field: string }) {
  return <>{useField(field).node}</>;
}

// A project's image, filling its box.
function Picture({ field, label }: { field: string; label?: string }) {
  const src = useField(field).value;
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element -- user images from any host
  return <img src={src} alt={label ?? ""} decoding="async" loading="lazy" className="absolute inset-0 block h-full w-full object-cover" />;
}

// A project's tab, named after its title.
function TabLabel({ field }: { field: string }) {
  return <>{useField(field).value}</>;
}

function Slide({
  prefix,
  index,
  count,
  copy,
  active,
  neighbour,
  frame,
  shown,
  onSelect,
}: {
  prefix: string;
  index: number;
  count: number;
  copy: boolean;
  active: boolean;
  neighbour: "prev" | "next" | null;
  frame: MotionValue<number>;
  shown: MotionValue<number>;
  onSelect: () => void;
}) {
  const id = useSectionId();
  // The project's link: the middle card opens it.
  const url = useField(`${prefix}Url`).value;
  const title = useField(`${prefix}Title`).value;
  const viewLabel = useField("viewLabel").value;

  return (
    <article
      id={copy ? undefined : `${id}-${prefix}`}
      aria-roledescription="slide"
      aria-label={`${title}, ${index + 1} of ${count}`}
      aria-hidden={copy || undefined}
      data-deck-project={prefix}
      style={{ marginRight: GAP }}
      className="relative mb-10 w-full flex-none select-none @3xl:w-[80%] @5xl:aspect-[1280/700] @5xl:w-[min(1280px,calc(100cqw-9rem))]"
    >
      <motion.div
        style={{ opacity: frame }}
        className="grid h-full grid-cols-1 gap-4 rounded-[2rem] bg-foreground/[0.04] p-3 ring-1 ring-foreground/[0.06] @3xl:grid-cols-2 @3xl:gap-8 @3xl:p-4"
      >
        <div className="flex min-w-0 flex-col justify-between gap-8 p-3 @3xl:p-6">
          <div className="flex flex-col items-start gap-4">
            <span className="rounded-full border border-solid border-foreground/10 bg-card px-3 py-1 text-xs font-medium">
              <FieldValue field={`${prefix}Category`} />
            </span>
            <h3 className="m-0 text-balance font-display text-[length:clamp(1.6rem,7cqw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em] @3xl:text-[length:clamp(1.75rem,3cqw,2.75rem)]">
              <FieldValue field={`${prefix}Title`} />
            </h3>
            <p className="m-0 text-balance text-[0.95rem] leading-snug text-muted-foreground">
              <FieldValue field={`${prefix}Text`} />
            </p>
            {url && (
              <span aria-hidden="true" className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                {viewLabel} <ArrowUpRight className="size-4" />
              </span>
            )}
          </div>
          <span className="text-sm tabular-nums text-muted-foreground">{number(index, count)}</span>
        </div>
        {/* The image. DeckShowcase's cards land on these. */}
        <div className="relative h-full min-h-80 overflow-hidden rounded-2xl bg-foreground/[0.06] @3xl:aspect-square @3xl:max-w-full">
          <motion.div style={{ opacity: shown }} className="absolute inset-0">
            <Picture field={`${prefix}Image`} label={title} />
          </motion.div>
        </div>
      </motion.div>

      {/* The middle card opens its project; its neighbours move the slider. */}
      {active && url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          tabIndex={copy ? -1 : undefined}
          aria-hidden={copy || undefined}
          aria-label={`${viewLabel}: ${title}`}
          className="absolute inset-0 z-10 rounded-[2rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground"
        />
      )}
      {neighbour && (
        <button
          type="button"
          tabIndex={copy ? -1 : undefined}
          aria-hidden={copy || undefined}
          aria-label={neighbour === "prev" ? "Previous project" : "Next project"}
          onClick={onSelect}
          className="absolute inset-0 z-10 cursor-pointer rounded-[2rem] border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground [@media(hover:hover)]:cursor-none"
        />
      )}
    </article>
  );
}

export default function DeckSlider({ projects, start = 0, arrival, editing = false }: { projects: number[]; start?: number; arrival?: MotionValue<number>; editing?: boolean }) {
  const id = useSectionId();
  const still = Boolean(useReducedMotion());
  const count = projects.length;
  const slides = Array.from({ length: count * 3 }, (_, k) => k);
  const home = count;
  const wrap = useCallback((value: number) => ((value % count) + count) % count, [count]);
  const prefix = (at: number) => `project${projects[at]}`;

  const fallback = useMotionValue(1);
  const progress = arrival ?? fallback;
  const frame = useTransform(progress, [0.55, 0.95], [0, 1]);
  const shown = useTransform(progress, (p): number => (p >= 1 ? 1 : 0));
  const [landed, setLanded] = useState(!arrival);
  useMotionValueEvent(progress, "change", (p) => setLanded(p >= 1));

  const [pos, setPos] = useState(home + start);
  const index = wrap(pos);
  const [step, setStep] = useState(0);
  // null = the visitor has not chosen; autoplay then follows reduced motion.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const playing = (chosen ?? !still) && !editing;

  const windowRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(home + start);
  const offsetRef = useRef(0);
  const lock = useRef(false);
  const inView = useInView(railRef, { amount: 0.25 });
  const x = useMotionValue(0);

  // "Previous" / "Next", following the pointer.
  const [hovered, setHovered] = useState(false);
  const [side, setSide] = useState<"prev" | "next" | null>(null);
  const [label, setLabel] = useState<"prev" | "next">("next");
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const hintX = useSpring(pointerX, { stiffness: 700, damping: 50 });
  const hintY = useSpring(pointerY, { stiffness: 700, damping: 50 });
  const showHint = hovered && side !== null;

  // The card's width comes from the layout, so it is measured: the track
  // moves one card plus the gap, offset so the middle card sits centred.
  useEffect(() => {
    const element = windowRef.current;
    const card = element?.querySelector("article");
    if (!element || !card) return;
    const observer = new ResizeObserver(() => {
      const next = card.offsetWidth + GAP;
      offsetRef.current = (element.offsetWidth - card.offsetWidth) / 2;
      setStep(next);
      x.set(offsetRef.current - posRef.current * next);
    });
    observer.observe(element);
    observer.observe(card);
    return () => observer.disconnect();
  }, [x]);

  // One move at a time; reaching either end of the middle copy moves the
  // track back a whole copy, which changes nothing the visitor can see.
  const moveTo = useCallback(
    (target: number) => {
      if (lock.current || !step || target === posRef.current) return;
      lock.current = true;
      posRef.current = target;
      setPos(target);
      let released = false;
      const finish = () => {
        if (released) return;
        released = true;
        const back = home + wrap(posRef.current);
        if (back !== posRef.current) {
          posRef.current = back;
          setPos(back);
          x.jump(offsetRef.current - back * step);
        }
        lock.current = false;
      };
      animate(x, offsetRef.current - target * step, { duration: still ? 0 : 0.8, ease, onComplete: finish });
      // Never leave the slider locked if the animation is interrupted.
      window.setTimeout(finish, 1300);
    },
    [step, still, x, home, wrap],
  );
  const select = (to: number) => moveTo(posRef.current + ((to - wrap(posRef.current) + count + 1) % count) - 1);

  // Autoplay, once the cards have landed and while the slider is on screen.
  useEffect(() => {
    if (!playing || !landed || !inView || !step) return;
    const timer = window.setTimeout(() => moveTo(posRef.current + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, landed, inView, step, pos, moveTo]);

  // Left of the middle card is "Previous", right of it "Next"; over it the
  // label hides so the card itself can be clicked.
  const zoneAt = (clientX: number): "prev" | "next" | null => {
    const element = windowRef.current;
    if (!element || !step) return null;
    const left = element.getBoundingClientRect().left + offsetRef.current;
    return clientX < left ? "prev" : clientX > left + step - GAP ? "next" : null;
  };
  const follow = (clientX: number, clientY: number, jump = false) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(clientX - rect.left);
    pointerY.set(clientY - rect.top);
    if (jump) {
      hintX.jump(clientX - rect.left);
      hintY.jump(clientY - rect.top);
    }
    const next = zoneAt(clientX);
    setSide(next);
    if (next) setLabel(next);
  };

  const onTabKey = (event: KeyboardEvent, current: number) => {
    const keys: Record<string, number> = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: count - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(count - 1, keys[event.key]));
    document.getElementById(`${id}-tab-${next}`)?.focus();
    select(next);
  };

  return (
    <div>
      <div role="tablist" aria-label="Projects" className="relative mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full bg-foreground/[0.05] p-1">
        {projects.map((n, i) => {
          const active = i === index;
          return (
            <button
              key={n}
              id={`${id}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`${id}-${prefix(i)}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(event) => onTabKey(event, i)}
              className={`relative cursor-pointer rounded-full border-0 bg-transparent px-4 py-2 text-sm font-medium transition-colors duration-300 ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {active && <motion.span layoutId={`${id}-tab`} aria-hidden="true" transition={{ duration: 0.4, ease }} className="absolute inset-0 rounded-full bg-card shadow-[0_1px_3px_rgb(0_0_0/0.1)]" />}
              <span className="relative">
                <TabLabel field={`${prefix(i)}Title`} />
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={railRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects"
        onPointerMove={(event: PointerEvent) => follow(event.clientX, event.clientY)}
        onMouseEnter={(event: MouseEvent) => {
          // Touch taps emulate mouseenter, so only devices that can hover show the label.
          if (!window.matchMedia("(hover: hover)").matches) return;
          follow(event.clientX, event.clientY, true);
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        className={`relative mt-8 @xl:mt-10 ${landed ? "" : "pointer-events-none"}`}
      >
        <div className="mx-auto w-full max-w-[1600px] px-5 @xl:px-8">
          <div ref={windowRef}>
            {/* Not clipped: the neighbouring cards run past the content width. */}
            <motion.div style={{ x }} aria-live={playing ? "off" : "polite"} className="flex">
              {slides.map((slide) => (
                <Slide
                  key={slide}
                  prefix={prefix(slide % count)}
                  index={slide % count}
                  count={count}
                  copy={Math.floor(slide / count) !== 1}
                  active={slide === pos}
                  neighbour={Math.abs(slide - pos) === 1 ? (slide < pos ? "prev" : "next") : null}
                  frame={frame}
                  shown={shown}
                  onSelect={() => moveTo(slide)}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Previous / Next, following the pointer. Always mounted, so clicks never restart it. */}
        <motion.div
          aria-hidden="true"
          style={{ x: hintX, y: hintY }}
          initial={false}
          animate={{ opacity: showHint ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute left-0 top-0 z-30"
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <motion.span
              initial={false}
              animate={{ scale: showHint ? 1 : 0.8 }}
              transition={{ duration: 0.2, ease }}
              className="block rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-[0_6px_20px_rgb(0_0_0/0.16)]"
            >
              {label === "next" ? "Next" : "Previous"}
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[1600px] items-center justify-center gap-4 px-5 @xl:px-8">
        <div aria-hidden="true" className="ml-auto flex items-center gap-1.5">
          {projects.map((n, i) => (
            <span key={n} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25"}`} />
          ))}
        </div>
        <button
          type="button"
          aria-label={playing ? "Pause autoplay" : "Start autoplay"}
          onClick={() => setChosen(!playing)}
          disabled={editing}
          className="ml-auto grid size-10 cursor-pointer place-items-center rounded-full border border-solid border-foreground/10 bg-card text-foreground transition-colors hover:border-foreground/25 disabled:cursor-default disabled:opacity-40"
        >
          {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
        </button>
      </div>
    </div>
  );
}
