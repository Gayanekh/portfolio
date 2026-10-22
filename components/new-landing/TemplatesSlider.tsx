"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotionConfig, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { Reveal, SplitWords } from "@/components/landing/Reveal";
import { STYLE_LABEL } from "@/components/landing/sample-portfolios";
import { TEMPLATES, TEMPLATES_INTRO } from "@/components/new-landing/content";
import { ease, focusRing, sectionIntro, sectionTitle, text } from "@/components/landing/landing-ui";

// The landing page's templates slider (components/landing/TemplatesSlider),
// with the real templates and their screenshots in place of the sample ones.
// Its look and behaviour are the same; the home page hero's card flight is
// left out, as this page's hero brings its own (HeroTemplates).

const GAP = 20;
const COUNT = TEMPLATES.length;
// The cards are rendered three times in a row. The slider always sits in
// the middle copy, so there is a card on both sides; when it reaches the end
// of that copy the track is moved back by one copy, which looks identical.
const SLIDES = Array.from({ length: COUNT * 3 }, (_, k) => k);
const HOME = COUNT;
const AUTOPLAY_MS = 4500;
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2);
const wrap = (value: number) => ((value % COUNT) + COUNT) % COUNT;

// A slider card's preview: the template's screenshot. A placeholder shows
// until the page's fonts are ready, so there is never an empty frame. The
// screenshot itself waits for the hero's card to land on it (`shown`).
function PreviewPane({ slide, ready, shown }: { slide: number; ready: boolean; shown: MotionValue<number> }) {
  const template = TEMPLATES[slide % COUNT];
  return (
    <div className="relative h-full min-h-80 overflow-hidden rounded-2xl bg-white md:aspect-square md:max-w-full">
      <motion.div style={{ opacity: shown }} className="absolute inset-0 h-full w-full min-h-0 overflow-hidden rounded-2xl bg-foreground/5">
        <Image src={template.image} alt="" fill quality={90} sizes="(min-width: 1024px) 640px, (min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
      </motion.div>
      <AnimatePresence>
        {!ready && (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 animate-pulse bg-foreground/[0.06]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// "Templates for every kind of work": an autoplaying slider. Heading and tabs
// sit inside the content width; the card rail is allowed to run past it so
// the neighbouring cards show on both sides. The section clips that
// overflow, so the page never scrolls sideways. It opens on `start`, the
// template on top of the hero's pile.
//
// `arrival` (0 to 1) is how far the hero's cards have travelled into the
// slider: the card frames fade in as they come, the screenshots show once
// they have landed (each card lands on its own slide, found by its
// data-template), and autoplay waits until then.
export default function TemplatesSlider({ start = 0, arrival }: { start?: number; arrival?: MotionValue<number> }) {
  const reduced = useReducedMotionConfig();
  const fallback = useMotionValue(1);
  const progress = arrival ?? fallback;
  const shell = useTransform(progress, [0.55, 0.95], [0, 1]);
  const shown = useTransform(progress, (p): number => (p >= 1 ? 1 : 0));
  const [landed, setLanded] = useState(!arrival);
  useMotionValueEvent(progress, "change", (p) => setLanded(p >= 1));
  const [index, setIndex] = useState(start);
  // Absolute position of the active card, as state so neighbours can be told apart.
  const [pos, setPos] = useState(HOME + start);
  // The Previous / Next control shows while the mouse is anywhere over the
  // carousel and outside the active card; its label follows the side the
  // pointer is on. `label` keeps the last side so the text does not swap while
  // the control fades out over the active card.
  const [hovered, setHovered] = useState(false);
  const [side, setSide] = useState<"prev" | "next" | null>(null);
  const [label, setLabel] = useState<"prev" | "next">("next");
  const showHint = hovered && side !== null;
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  // null = the visitor has not chosen; autoplay then follows reduced motion.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const playing = chosen ?? !reduced;

  const windowRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(HOME + start);
  const offsetRef = useRef(0);
  const lock = useRef(false);
  const inView = useInView(railRef, { amount: 0.25 });

  const x = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const hintX = useSpring(pointerX, { stiffness: 700, damping: 50 });
  const hintY = useSpring(pointerY, { stiffness: 700, damping: 50 });

  // Card sizes come from CSS (full width on phones, 80% of the content width
  // on tablets, up to 1280×700 on desktops), so the card is measured. The track
  // moves one card plus the gap, and is offset so the active card sits centred
  // with its neighbours showing either side.
  useEffect(() => {
    const element = windowRef.current;
    const card = element?.querySelector("article");
    if (!element || !card) return;
    const observer = new ResizeObserver(() => {
      const width = element.offsetWidth;
      const next = card.offsetWidth + GAP;
      offsetRef.current = (width - card.offsetWidth) / 2;
      setStep(next);
      x.set(offsetRef.current - posRef.current * next);
    });
    observer.observe(element);
    observer.observe(card);
    return () => observer.disconnect();
  }, [x]);

  // "Loaded" means the page's fonts are ready. Until then each pane shows a
  // placeholder, and autoplay waits.
  useEffect(() => {
    let alive = true;
    const fonts = typeof document !== "undefined" ? document.fonts?.ready : undefined;
    Promise.resolve(fonts).then(() => {
      if (alive) requestAnimationFrame(() => alive && setReady(true));
    });
    return () => { alive = false; };
  }, []);

  // One move at a time. Reaching either end of the middle copy moves the track
  // back by a whole copy, which changes nothing the visitor can see.
  const moveTo = useCallback(
    (target: number) => {
      if (lock.current || !step || target === posRef.current) return;
      lock.current = true;
      posRef.current = target;
      setPos(target);
      setIndex(wrap(target));
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
      // Safety net: never leave the slider locked if the animation is interrupted.
      window.setTimeout(finish, 1300);
    },
    [step, reduced, x],
  );

  // Left of the active card's resting slot is "Previous", right of it is "Next";
  // over it the control hides so the card itself can be clicked. The slot does
  // not move with the track, so the zones stay put during transitions.
  const zoneAt = (clientX: number): "prev" | "next" | null => {
    const element = windowRef.current;
    if (!element || !step) return null;
    const left = element.getBoundingClientRect().left + offsetRef.current;
    const right = left + step - GAP;
    return clientX < left ? "prev" : clientX > right ? "next" : null;
  };

  const updateSide = (clientX: number) => {
    const next = zoneAt(clientX);
    setSide((current) => (current === next ? current : next));
    if (next) setLabel((current) => (current === next ? current : next));
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
    updateSide(event.clientX);
  };

  // Touch taps emulate mouseenter, so only devices that can hover show the control.
  const onMouseEnter = (event: React.MouseEvent) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = railRef.current?.getBoundingClientRect();
    if (rect) {
      // Start the control under the cursor instead of springing in from a corner.
      pointerX.set(event.clientX - rect.left);
      pointerY.set(event.clientY - rect.top);
      hintX.jump(event.clientX - rect.left);
      hintY.jump(event.clientY - rect.top);
      updateSide(event.clientX);
    }
    setHovered(true);
  };

  const select = (to: number) => moveTo(posRef.current + ((to - wrap(posRef.current) + COUNT + 1) % COUNT) - 1);

  // Autoplay: advance one card per interval while it is playing, its previews
  // are ready and it is on screen. Choosing a tab restarts the interval
  // because `index` changes.
  useEffect(() => {
    if (!playing || !ready || !landed || !inView || !step) return;
    const timer = window.setTimeout(() => moveTo(posRef.current + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, ready, landed, inView, step, index, moveTo]);

  const onTabKey = (event: React.KeyboardEvent, current: number) => {
    const target = event.key === "ArrowRight" ? current + 1 : event.key === "ArrowLeft" ? current - 1 : event.key === "Home" ? 0 : event.key === "End" ? COUNT - 1 : null;
    if (target === null) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(COUNT - 1, target));
    document.getElementById(`tpl-tab-${TEMPLATES[next].id}`)?.focus();
    select(next);
  };

  return (
    <div id="templates">
      <section aria-label={TEMPLATES_INTRO.title} className="relative overflow-x-clip py-20">
        <div className="w-content-width mx-auto flex flex-col items-center gap-2">
          <Reveal className="mb-1 w-fit rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs font-medium"><p className="m-0">{TEMPLATES_INTRO.tag}</p></Reveal>
          <SplitWords as="h2" text={TEMPLATES_INTRO.title} className={sectionTitle} />
          <SplitWords as="p" text={TEMPLATES_INTRO.text} className={sectionIntro} />
          <Reveal className="mt-4 md:mt-5">
            <div role="tablist" aria-label="Template" className="relative inline-flex max-w-full flex-wrap justify-center gap-1 rounded bg-foreground/[0.04] p-1">
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
                    {active && <motion.span layoutId="tpl-tab-pill" aria-hidden="true" transition={{ duration: 0.4, ease }} className="absolute inset-0 rounded bg-white shadow-[0_1px_3px_rgb(0_0_0/0.1)]" />}
                    <span className="relative">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <div className="mt-8 md:mt-10">
          <div
            ref={railRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="Templates"
            onPointerMove={onPointerMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={() => setHovered(false)}
            className={`relative ${landed ? "" : "pointer-events-none"}`}
          >
            <div ref={windowRef} className="w-content-width mx-auto">
              {/* Not clipped: the neighbouring cards are meant to extend past the content width. */}
              <motion.div style={{ x }} aria-live={playing ? "off" : "polite"} className="flex">
                {SLIDES.map((slide) => {
                  const template = TEMPLATES[slide % COUNT];
                  // Only the middle copy is exposed to assistive technology.
                  const copy = Math.floor(slide / COUNT) !== 1;
                  return (
                    <article
                      key={slide}
                      id={copy ? undefined : `tpl-slide-${template.id}`}
                      aria-roledescription="slide"
                      aria-label={`${slide % COUNT + 1} of ${COUNT}`}
                      aria-hidden={copy || undefined}
                      data-template={template.id}
                      className="relative mb-10 mr-5 w-full flex-none select-none md:w-[80%] lg:aspect-[1280/700] lg:w-[min(1280px,calc(100vw-9rem))]"
                    >
                      <motion.div style={{ opacity: shell }} className="grid h-full grid-cols-1 gap-4 rounded-[2rem] p-3 card md:grid-cols-2 md:gap-8 md:p-4">
                        <div className="flex min-w-0 flex-col justify-between gap-8 p-3 md:p-6">
                          <div className="flex flex-col items-start gap-4">
                            <span className="rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs font-medium">{STYLE_LABEL[template.style]}</span>
                            <h3 className="m-0 text-balance text-[length:clamp(1.6rem,7vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em] md:text-[length:clamp(1.75rem,3vw,2.75rem)]">{template.name}</h3>
                            <p className={`${text.base} m-0 text-balance leading-snug text-foreground/75`}>{template.description}</p>
                            <span aria-hidden="true" className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                              {TEMPLATES_INTRO.link} <ArrowUpRight className="size-4" />
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground/10 text-sm font-semibold md:size-11">{initials(template.name)}</span>
                            <div className="flex min-w-0 flex-col">
                              <span className={`${text.base} truncate font-semibold leading-snug`}>Best for</span>
                              <span className={`${text.base} truncate leading-snug text-foreground/60`}>{template.bestFor}</span>
                            </div>
                          </div>
                        </div>
                        <PreviewPane slide={slide} ready={ready} shown={shown} />
                      </motion.div>
                      {/* The active card opens its template; its neighbours move the carousel. */}
                      {slide === pos && (
                        <Link
                          href={template.href}
                          tabIndex={copy ? -1 : undefined}
                          aria-hidden={copy || undefined}
                          aria-label={`${TEMPLATES_INTRO.link}: ${template.name}`}
                          className={`${focusRing} absolute inset-0 z-10 rounded-[2rem]`}
                        />
                      )}
                      {Math.abs(slide - pos) === 1 && (
                        <button
                          type="button"
                          tabIndex={copy ? -1 : undefined}
                          aria-hidden={copy || undefined}
                          aria-label={slide < pos ? "Previous template" : "Next template"}
                          onClick={() => moveTo(slide)}
                          className={`${focusRing} absolute inset-0 z-10 cursor-pointer rounded-[2rem] [@media(hover:hover)]:cursor-none`}
                        />
                      )}
                    </article>
                  );
                })}
              </motion.div>
            </div>

            {/* "Previous" / "Next" follow the pointer while it is over the carousel. Always
                mounted, so clicks and slide transitions never hide or restart it. */}
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

          <div className="mt-6 flex items-center justify-center gap-4 pr-4">
            <div aria-hidden="true" className="ml-auto flex items-center gap-1.5">
              {TEMPLATES.map((template, i) => (
                <span key={template.id} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25"}`} />
              ))}
            </div>
            <button
              type="button"
              aria-label={playing ? "Pause autoplay" : "Start autoplay"}
              onClick={() => setChosen(!playing)}
              className={`${focusRing} ml-auto grid size-10 cursor-pointer place-items-center rounded border border-foreground/10 bg-white text-foreground transition-colors hover:border-foreground/20`}
            >
              {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">{playing ? "" : `${TEMPLATES[index].name}, ${index + 1} of ${COUNT}`}</p>
        </div>
      </section>
    </div>
  );
}
