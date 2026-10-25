"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotionConfig, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { TEMPLATES, TEMPLATES_INTRO } from "@/components/new-landing/content";
import { ease, focusRing, text, fluidText } from "@/components/landing/landing-ui";

const COUNT = TEMPLATES.length;
const GAP = 20;
// The cards are drawn three times in a row and the slider always rests in
// the middle copy, so there are cards on both sides; at either end of it the
// track jumps back a whole copy, which looks identical.
const SLIDES = Array.from({ length: COUNT * 3 }, (_, k) => k);
const HOME = COUNT;
const wrap = (value: number) => ((value % COUNT) + COUNT) % COUNT;
const lower = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

const roundButton = `${focusRing} grid size-10 cursor-pointer place-items-center rounded border border-foreground/10 bg-white text-foreground transition-colors hover:border-foreground/20`;

// One slide, as on the current landing page: a light card with the template's
// details on the left (number, name, description, link, who it is for) and its
// screenshot on the right. Every card is the same size; the middle one opens
// its template, the ones beside it move the slider.
function Slide({
  slide,
  fall,
  active,
  neighbour,
  onSelect,
  paneRef,
}: {
  slide: number;
  fall: MotionValue<number>;
  active: boolean;
  neighbour: "prev" | "next" | null;
  onSelect: () => void;
  paneRef: (index: number, element: HTMLDivElement | null) => void;
}) {
  const template = TEMPLATES[slide % COUNT];
  // Only the middle copy is exposed to assistive technology, and it is where
  // the hero's cards land.
  const middle = Math.floor(slide / COUNT) === 1;
  // The centre card's screenshot appears when the hero's top card lands on
  // it; the others fade in over the end of the fall.
  const target = middle && active;
  const shown = useTransform(fall, (f) => (target ? (f >= 1 ? 1 : 0) : Math.min(1, Math.max(0, (f - 0.8) / 0.2))));

  return (
    <article
      id={middle ? `tpl-slide-${template.id}` : undefined}
      aria-roledescription="slide"
      aria-label={`${template.name}, ${(slide % COUNT) + 1} of ${COUNT}`}
      aria-hidden={!middle || undefined}
      style={{ marginRight: GAP }}
      className="relative mb-10 w-full flex-none select-none md:w-[80%] lg:aspect-[1280/700] lg:w-[min(1280px,calc(100vw-9rem))]"
    >
      <div className="card grid h-full grid-cols-1 gap-4 rounded-[2rem] p-3 md:grid-cols-2 md:gap-8 md:p-4">
        <div className="flex min-w-0 flex-col justify-between gap-8 p-3 md:p-6">
          <div className="flex flex-col items-start gap-4">
            <span className="rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs font-medium tabular-nums">
              {String((slide % COUNT) + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
            </span>
            <h3 className={`m-0 text-balance ${fluidText.cardTitle} font-medium leading-[1.05] tracking-[-0.03em]`}>{template.name}</h3>
            <p className={`${text.base} m-0 text-balance leading-snug text-foreground/75`}>{template.description}</p>
            <span aria-hidden="true" className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
              {TEMPLATES_INTRO.link} <ArrowUpRight className="size-4" />
            </span>
          </div>
          <p className={`${text.base} m-0 leading-snug text-foreground/60`}>For {lower(template.bestFor)}</p>
        </div>
        {/* The screenshot. The hero's falling pile lands on the centre one. */}
        <div
          ref={middle ? (element) => paneRef(slide % COUNT, element) : undefined}
          className="relative h-full min-h-80 overflow-hidden rounded-2xl bg-white md:aspect-square md:max-w-full"
        >
          <motion.div style={{ opacity: shown }} className="absolute inset-0">
            <Image src={template.image} alt="" fill sizes="(min-width: 1024px) 640px, (min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
          </motion.div>
        </div>
      </div>
      {neighbour ? (
        <button
          type="button"
          tabIndex={middle ? undefined : -1}
          aria-hidden={!middle || undefined}
          aria-label={neighbour === "prev" ? "Previous template" : "Next template"}
          onClick={onSelect}
          className={`${focusRing} absolute inset-0 z-10 cursor-pointer rounded-[2rem] [@media(hover:hover)]:cursor-none`}
        />
      ) : (
        <Link
          href={template.href}
          tabIndex={middle ? undefined : -1}
          aria-hidden={!middle || undefined}
          aria-label={`${TEMPLATES_INTRO.link}: ${template.name}`}
          className={`${focusRing} absolute inset-0 z-10 rounded-[2rem]`}
        />
      )}
    </article>
  );
}

// "Templates for every kind of work" as a slider: tabs with the template
// names, then a row of same-size cards that moves one card to the left at a
// time, so each new template comes in from the right. "Previous" / "Next"
// follows the pointer beside the middle card; arrows, dots and autoplay with
// a pause button.
//
// The hero's falling pile drops onto the centre card's screenshot: the
// middle copy's screenshots register through `paneRef`, the centre template
// is reported through `onCenter`, and `fall` (0 to 1) fades the screenshots
// in. The track's position is the shared `x`, so the falling cards can
// follow it. It starts on `start`, the template on top of the hero's pile.
export default function TemplateSlider({
  x,
  fall,
  landed,
  start,
  onCenter,
  paneRef,
}: {
  x: MotionValue<number>;
  fall: MotionValue<number>;
  landed: boolean;
  start: number;
  onCenter: (index: number) => void;
  paneRef: (index: number, element: HTMLDivElement | null) => void;
}) {
  const reduced = useReducedMotionConfig();
  const [pos, setPos] = useState(HOME + start);
  const [step, setStep] = useState(0);
  // null = the visitor has not chosen; autoplay then follows reduced motion.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const playing = chosen ?? !reduced;
  const index = wrap(pos);

  const windowRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(HOME + start);
  const offsetRef = useRef(0);
  const lock = useRef(false);
  const inView = useInView(railRef, { amount: 0.25 });
  useEffect(() => {
    onCenter(index);
  }, [index, onCenter]);

  // The Previous / Next label that follows the pointer.
  const [hovered, setHovered] = useState(false);
  const [side, setSide] = useState<"prev" | "next" | null>(null);
  const [label, setLabel] = useState<"prev" | "next">("next");
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const hintX = useSpring(pointerX, { stiffness: 700, damping: 50 });
  const hintY = useSpring(pointerY, { stiffness: 700, damping: 50 });
  const showHint = hovered && side !== null;

  // The card's width comes from CSS, so it is measured: the track moves one
  // card plus the gap, offset so the current card sits in the middle.
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
        const home = HOME + wrap(posRef.current);
        if (home !== posRef.current) {
          posRef.current = home;
          setPos(home);
          x.jump(offsetRef.current - home * step);
        }
        lock.current = false;
      };
      animate(x, offsetRef.current - target * step, { duration: reduced ? 0 : 0.8, ease, onComplete: finish });
      // Never leave the slider locked if the animation is interrupted.
      window.setTimeout(finish, 1300);
    },
    [step, reduced, x],
  );
  const select = (to: number) => moveTo(posRef.current + ((to - wrap(posRef.current) + COUNT + 1) % COUNT) - 1);
  // The row moves left: the next template comes in from the right.
  const forward = () => moveTo(posRef.current + 1);
  const back = () => moveTo(posRef.current - 1);

  // Autoplay, once the cards have landed and while the slider is on screen.
  // Any move restarts the wait, because `pos` changes.
  useEffect(() => {
    if (!playing || !landed || !inView || !step) return;
    const timer = window.setTimeout(() => moveTo(posRef.current + 1), TEMPLATES_INTRO.autoplayMs);
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

  const onTabKey = (event: React.KeyboardEvent, current: number) => {
    const keys: Record<string, number> = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: COUNT - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(COUNT - 1, keys[event.key]));
    document.getElementById(`tpl-tab-${TEMPLATES[next].id}`)?.focus();
    select(next);
  };

  return (
    <>
      <div role="tablist" aria-label="Template" className="relative mx-auto mt-4 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded bg-foreground/[0.04] p-1 md:mt-5">
        {TEMPLATES.map((template, i) => {
          const active = i === index;
          return (
            <button
              key={template.id}
              id={`tpl-tab-${template.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`tpl-slide-${template.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(event) => onTabKey(event, i)}
              className={`${focusRing} relative cursor-pointer rounded px-4 py-2 text-sm font-medium transition-colors duration-300 ${active ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
            >
              {active && <motion.span layoutId="new-landing-tab" aria-hidden="true" transition={{ duration: 0.4, ease }} className="absolute inset-0 rounded bg-white shadow-[0_1px_3px_rgb(0_0_0/0.1)]" />}
              <span className="relative">{template.name}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={railRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Templates"
        onPointerMove={(event) => follow(event.clientX, event.clientY)}
        onMouseEnter={(event) => {
          // Touch taps emulate mouseenter, so only devices that can hover show the label.
          if (!window.matchMedia("(hover: hover)").matches) return;
          follow(event.clientX, event.clientY, true);
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        className={`relative mt-8 md:mt-10 ${landed ? "" : "pointer-events-none"}`}
      >
        <div ref={windowRef} className="mx-auto w-content-width">
          {/* Not clipped: the neighbouring cards run past the content width. */}
          <motion.div style={{ x }} aria-live={playing ? "off" : "polite"} className="flex">
            {SLIDES.map((slide) => (
              <Slide
                key={slide}
                slide={slide}
                fall={fall}
                active={slide === pos}
                neighbour={Math.abs(slide - pos) === 1 ? (slide < pos ? "prev" : "next") : null}
                onSelect={() => moveTo(slide)}
                paneRef={paneRef}
              />
            ))}
          </motion.div>
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
              className="block rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground shadow-[0_6px_20px_rgb(0_0_0/0.16)]"
            >
              {label === "next" ? "Next" : "Previous"}
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-6 flex w-content-width items-center justify-between gap-4">
        <div className="flex gap-2">
          <button type="button" aria-label="Previous template" onClick={back} className={roundButton}>
            <ArrowLeft aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-label="Next template" onClick={forward} className={roundButton}>
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
        <div aria-hidden="true" className="flex items-center gap-1.5">
          {TEMPLATES.map((template, i) => (
            <span key={template.id} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25"}`} />
          ))}
        </div>
        <button type="button" aria-label={playing ? "Pause autoplay" : "Start autoplay"} onClick={() => setChosen(!playing)} className={roundButton}>
          {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{playing ? "" : `${TEMPLATES[index].name}, ${index + 1} of ${COUNT}`}</p>
    </>
  );
}
