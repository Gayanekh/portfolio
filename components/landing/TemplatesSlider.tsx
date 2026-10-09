"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotionConfig,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, ExternalLink, Pause, Play } from "lucide-react";
import { useLanding } from "@/components/landing/LandingProvider";
import { Reveal, SplitWords } from "@/components/landing/Reveal";
import ScaledPreview from "@/components/landing/ScaledPreview";
import { CtaLink } from "@/components/landing/Section";
import { PEOPLE, STYLE_LABEL, TEMPLATES, type TemplateId } from "@/components/landing/sample-portfolios";
import { templates as appTemplates } from "@/components/templates/template-data";
import { ease, focusRing, glassPill, secondaryOnCard, sectionIntro, sectionTitle, text } from "@/components/landing/landing-ui";

// One headline per template; everything else comes from the template data.
const HEADLINE: Record<TemplateId, string> = {
  atelier: "Projects first, words second",
  ledger: "A clear record of what you do",
  gallery: "Big images and room to breathe",
  chapter: "Case studies with real outcomes",
};

const GAP = 20;
const COUNT = TEMPLATES.length;
// The four cards are rendered three times in a row. The slider always sits in
// the middle copy, so there is a card on both sides; when it reaches the end
// of that copy the track is moved back by one copy, which looks identical.
const SLIDES = Array.from({ length: COUNT * 3 }, (_, k) => k);
const HOME = COUNT;
const AUTOPLAY_MS = 4500;
const lower = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2);
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const wrap = (value: number) => ((value % COUNT) + COUNT) % COUNT;

// Where the first three templates sit in the hero before scrolling: offset
// from the centre of the hero's right column (px at the 1152px reference
// width), tilt and scale. They fly from here onto the slider card's preview.
const FAN = [
  { x: -130, y: 0, rotate: -5, scale: 1.22, mobileScale: 0.65 },
  { x: -30, y: -32, rotate: 0, scale: 1.17, mobileScale: 0.6 },
  { x: 90, y: 0, rotate: 5, scale: 1.12, mobileScale: 0.55 },
];
// The flight is finished at this share of the scroll range, so the hand-off to
// the real previews happens while nothing is moving.
const LAND = 0.97;
// Hero cards are landscape (height = width × this) and reshape into the
// slider's pane as they fly; the photo is cropped, never stretched.
const HERO_RATIO = 0.8;

function usePose() {
  return { x: useMotionValue(0), y: useMotionValue(0), rotate: useMotionValue(0), w: useMotionValue(0), h: useMotionValue(0) };
}

// One hero template. It is the same preview the slider card shows; it only
// differs by a white frame, tilt and shadow that fade out as it lands.
function FanCard({
  index,
  pose,
  flight,
  position,
}: {
  index: number;
  pose: ReturnType<typeof usePose>;
  flight: MotionValue<number>;
  position: MotionValue<number>;
}) {
  const { openPreview } = useLanding();
  const template = TEMPLATES[index];
  const frame = useTransform(flight, (f) => 1 - f);
  const inner = useTransform(flight, [0, 1], [0.94, 1]);
  const radius = useTransform(flight, [0, 1], [18, 16]);
  // The card for the active template lands and hands over to the real preview;
  // the others merge into it and fade out on the way.
  const opacity = useTransform([flight, position] as const, ([f, p]: number[]) => (index === wrap(p) ? (f >= 1 ? 0 : 1) : 1 - clamp((f - 0.45) / 0.45)));
  const pointerEvents = useTransform(opacity, (o) => (o < 0.5 ? "none" : "auto"));
  const z = useTransform(position, (p) => (wrap(p) === index ? 35 : 30 - index * 10));
  return (
    <motion.button
      type="button"
      onClick={() => openPreview(template.id, template.sample)}
      aria-label={`Preview the ${template.name} template`}
      style={{ x: pose.x, y: pose.y, rotate: pose.rotate, opacity, pointerEvents, zIndex: z, width: pose.w, height: pose.h }}
      className={`${focusRing} absolute left-0 top-0 block cursor-pointer rounded-[1.5rem] will-change-transform`}
    >
      <motion.span
        aria-hidden="true"
        style={{ opacity: frame }}
        className="absolute inset-0 rounded-[inherit] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_22px_44px_-18px_rgb(0_0_0/0.3)] ring-1 ring-foreground/5"
      />
      <motion.span style={{ scale: inner, borderRadius: radius }} className="absolute inset-0 block overflow-hidden bg-white">
        <ScaledPreview template={template.id} person={template.sample} base={1100} className="absolute inset-0" />
        <motion.span style={{ opacity: frame }} className={`${glassPill} ${text.xs} absolute bottom-3 left-3 px-3 py-1.5`}>
          {STYLE_LABEL[template.style]}
        </motion.span>
      </motion.span>
    </motion.button>
  );
}

// A slider card's preview. The active one stays hidden until its fan card has
// landed on it; the others simply appear with the card shells. A placeholder
// shows until fonts are ready, so there is never an empty frame.
function PreviewPane({
  slide,
  flight,
  position,
  ready,
  paneRef,
}: {
  slide: number;
  flight: MotionValue<number>;
  position: MotionValue<number>;
  ready: boolean;
  paneRef: (element: HTMLDivElement | null) => void;
}) {
  const template = TEMPLATES[slide % COUNT];
  const flies = slide % COUNT < FAN.length;
  const opacity = useTransform([flight, position] as const, ([f, p]: number[]) => (slide === p ? (f >= 1 ? 1 : 0) : clamp((f - 0.8) / 0.2)));
  return (
    <motion.div
      ref={paneRef}
      style={flies ? { opacity } : undefined}
      className="relative h-full min-h-80 overflow-hidden rounded-2xl bg-white md:aspect-square md:max-w-full"
    >
      <ScaledPreview template={template.id} person={template.sample} base={1100} className="absolute inset-0 h-full w-full min-h-0 rounded-2xl" />
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
    </motion.div>
  );
}

// "Templates for every kind of work": an autoplaying slider in the style of the
// reference. Heading and tabs sit inside the content width; the card rail is
// allowed to run past it so the neighbouring cards show on both sides. The
// section clips that overflow, so the page never scrolls sideways.
//
// The hero's template cards continue into this section: while the rail
// scrolls in, three fan cards (an overlay inside this section) are moved from
// their hero positions onto the active card's preview, tracking it live. When
// they arrive the real preview takes over.
export default function TemplatesSlider() {
  const reduced = useReducedMotionConfig();
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  // Absolute position of the active card, as state so neighbours can be told apart.
  const [pos, setPos] = useState(HOME);
  // The Previous / Next control shows while the mouse is anywhere over the
  // carousel and outside the active card; its label follows the side the
  // pointer is on. `label` keeps the last side so the text does not swap while
  // the control fades out over the active card.
  const [hovered, setHovered] = useState(false);
  const [side, setSide] = useState<"prev" | "next" | null>(null);
  const [label, setLabel] = useState<"prev" | "next">("next");
  const showHint = hovered && side !== null;
  const [step, setStep] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [landed, setLanded] = useState(false);
  const [ready, setReady] = useState(false);
  // null = the visitor has not chosen; autoplay then follows reduced motion.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const playing = chosen ?? !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const paneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef(HOME);
  const offsetRef = useRef(0);
  const lock = useRef(false);
  const landedRef = useRef(false);
  const inView = useInView(railRef, { amount: 0.25 });

  const x = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const hintX = useSpring(pointerX, { stiffness: 700, damping: 50 });
  const hintY = useSpring(pointerY, { stiffness: 700, damping: 50 });
  // Absolute position of the active card (HOME..HOME+COUNT-1 when at rest).
  const position = useMotionValue(HOME);
  // 0 while the cards sit in the hero, 1 once they have landed in the slider.
  const flight = useMotionValue(0);
  const shell = useTransform(flight, [0.55, 0.95], [0, 1]);
  const poses = [usePose(), usePose(), usePose()];

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

  // Size of a preview pane, used for the flying cards.
  useEffect(() => {
    const pane = paneRefs.current[HOME];
    if (!pane) return;
    const observer = new ResizeObserver(() => setSize({ w: pane.offsetWidth, h: pane.offsetHeight }));
    observer.observe(pane);
    return () => observer.disconnect();
  }, []);

  // The previews are drawn from local markup, so "loaded" means their fonts
  // are ready. Until then each pane shows a placeholder, and autoplay waits.
  useEffect(() => {
    let alive = true;
    const fonts = typeof document !== "undefined" ? document.fonts?.ready : undefined;
    Promise.resolve(fonts).then(() => {
      if (alive) requestAnimationFrame(() => alive && setReady(true));
    });
    return () => { alive = false; };
  }, []);

  // Progress of the flight, and the pose of each fan card along it.
  const updateRef = useRef<() => void>(() => {});
  const update = () => {
    const section = sectionRef.current;
    const rail = railRef.current;
    const target = document.getElementById("hero-fan-target");
    if (!section || !rail) return;
    if (reduced || !target) {
      flight.set(1);
      setLanded(true);
      return;
    }
    if (!size.w) return;
    const vh = window.innerHeight;
    const end = Math.min(Math.max(vh * 0.5, 440), vh * 0.8);
    const progress = clamp((vh - rail.getBoundingClientRect().top) / (vh - end));
    const f = Math.min(1, progress / LAND);
    flight.set(f);
    setLanded(f >= 1);
    // Keep placing the cards once more on arrival, so the hand-off is exact.
    const settled = landedRef.current && f >= 1;
    landedRef.current = f >= 1;
    if (settled) return;

    const S = section.getBoundingClientRect();
    const T = target.getBoundingClientRect();
    const width = windowRef.current?.offsetWidth ?? 1152;
    const unit = width / 1152;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const pane = paneRefs.current[posRef.current];
    if (!pane) return;
    const P = pane.getBoundingClientRect();
    poses.forEach((pose, i) => {
      const hx = T.left + T.width / 2 + FAN[i].x * unit;
      const hy = T.top + T.height / 2 + FAN[i].y * unit;
      const px = P.left + P.width / 2;
      const py = P.top + P.height / 2;
      const heroWidth = (desktop ? (width - 24) / 3 : width) * (desktop ? FAN[i].scale : FAN[i].mobileScale);
      const w = heroWidth + (P.width - heroWidth) * f;
      const h = heroWidth * HERO_RATIO + (P.height - heroWidth * HERO_RATIO) * f;
      pose.w.set(w);
      pose.h.set(h);
      pose.x.set(hx + (px - hx) * f - S.left - w / 2);
      pose.y.set(hy + (py - hy) * f - S.top - h / 2);
      pose.rotate.set(FAN[i].rotate * (1 - f));
    });
  };
  // Keep the latest closure for the scroll and resize listeners below.
  useEffect(() => {
    updateRef.current = update;
  });
  useMotionValueEvent(scrollY, "change", () => updateRef.current());
  useMotionValueEvent(x, "change", () => updateRef.current());
  useEffect(() => {
    updateRef.current();
  }, [size, step, index, reduced]);
  useEffect(() => {
    const observer = new ResizeObserver(() => updateRef.current());
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  // One move at a time. Reaching either end of the middle copy moves the track
  // back by a whole copy, which changes nothing the visitor can see.
  const moveTo = useCallback(
    (target: number) => {
      if (lock.current || !step || target === posRef.current) return;
      lock.current = true;
      posRef.current = target;
      position.set(target);
      setPos(target);
      setIndex(wrap(target));
      let released = false;
      const finish = () => {
        if (released) return;
        released = true;
        const home = HOME + wrap(posRef.current);
        if (home !== posRef.current) {
          posRef.current = home;
          position.set(home);
          setPos(home);
          x.jump(offsetRef.current - home * step);
        }
        lock.current = false;
      };
      animate(x, offsetRef.current - target * step, { duration: reduced ? 0 : 0.8, ease, onComplete: finish });
      // Safety net: never leave the slider locked if the animation is interrupted.
      window.setTimeout(finish, 1300);
    },
    [step, reduced, x, position],
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

  // Autoplay: advance one card per interval while it is playing, the slider
  // has landed, its previews are ready and it is on screen. Choosing a tab
  // restarts the interval because `index` changes.
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
      <section ref={sectionRef} aria-label="Templates for every kind of work" className="relative overflow-x-clip py-20">
        {/* The hero's templates, travelling down onto the slider card. */}
        <div inert={landed} className="pointer-events-none absolute left-0 top-0 z-30">
          {size.w > 0 && poses.map((pose, i) => <FanCard key={TEMPLATES[i].id} index={i} pose={pose} flight={flight} position={position} />)}
        </div>

        <div className="w-content-width mx-auto flex flex-col items-center gap-2">
          <Reveal className="mb-1 w-fit rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs font-medium"><p className="m-0">Templates</p></Reveal>
          <SplitWords as="h2" text="Templates for every kind of work" className={sectionTitle} />
          <SplitWords as="p" text="Four layouts, each shown with an example person. Select a card to open the templates." className={sectionIntro} />
          <Reveal className="mt-4 md:mt-5">
            <div role="tablist" aria-label="Template" className="relative inline-flex max-w-full flex-wrap justify-center gap-1 rounded-full bg-foreground/[0.04] p-1">
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
                    className={`${focusRing} relative cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${active ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
                  >
                    {active && <motion.span layoutId="tpl-tab-pill" aria-hidden="true" transition={{ duration: 0.4, ease }} className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.1)]" />}
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
              <div className="flex flex-col">
                {/* Not clipped: the neighbouring cards are meant to extend past the content width. */}
                <div>
              <motion.div style={{ x }} aria-live={playing ? "off" : "polite"} className="flex">
                {SLIDES.map((slide) => {
                  const template = TEMPLATES[slide % COUNT];
                  const person = PEOPLE[template.sample];
                  // Only the middle copy is exposed to assistive technology.
                  const copy = Math.floor(slide / COUNT) !== 1;
                  return (
                    <motion.article
                      key={slide}
                      id={copy ? undefined : `tpl-slide-${template.id}`}
                      aria-roledescription="slide"
                      aria-label={`${slide % COUNT + 1} of ${COUNT}`}
                      aria-hidden={copy || undefined}
                      className="relative mb-10 mr-5 w-full flex-none select-none md:w-[80%] lg:aspect-[1280/700] lg:w-[min(1280px,calc(100vw-9rem))]"
                    >
                      <motion.div
                        style={{ opacity: shell }}
                        className="grid h-full grid-cols-1 gap-4 rounded-[2rem]  p-3 card  md:grid-cols-2 md:gap-8 md:p-4"
                      >
                        <div className="flex min-w-0 flex-col justify-between gap-8 p-3 md:p-6">
                          <div className="flex flex-col items-start gap-4">
                            <span className="rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs font-medium">{STYLE_LABEL[template.style]}</span>
                            <h3 className="m-0 text-balance text-[length:clamp(1.6rem,7vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em] md:text-[length:clamp(1.75rem,3vw,2.75rem)]">{HEADLINE[template.id]}</h3>
                            <p className={`${text.base} m-0 text-balance leading-snug text-foreground/75`}>
                              {template.name} is good for {lower(template.bestFor)}. It works best with {template.needs.map(lower).join(", ")}.
                            </p>
                            <span aria-hidden="true" className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                              Open templates <ArrowUpRight className="size-4" />
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground/10 text-sm font-semibold md:size-11">{initials(person.name)}</span>
                            <div className="flex min-w-0 flex-col">
                              <span className={`${text.base} truncate font-semibold leading-snug`}>{person.name}</span>
                              <span className={`${text.base} truncate leading-snug text-foreground/60`}>{person.role} · {person.location}</span>
                            </div>
                          </div>
                        </div>
                        <PreviewPane slide={slide} flight={flight} position={position} ready={ready} paneRef={(element) => { paneRefs.current[slide] = element; }} />
                      </motion.div>
                      {/* The active card opens the templates page; its neighbours move the carousel. */}
                      {slide === pos && (
                        <Link
                          href="/templates"
                          tabIndex={copy ? -1 : undefined}
                          aria-hidden={copy || undefined}
                          aria-label={`Open ${template.name} in the templates`}
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
                    </motion.article>
                  );
                })}
              </motion.div>
                </div>
              </div>
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

          <motion.div style={{ opacity: shell }}>
            <div className="mt-6 flex items-center justify-center gap-4 pr-4">
              <div aria-hidden="true" className="flex items-center gap-1.5 ml-auto">
                {TEMPLATES.map((template, i) => (
                  <span key={template.id} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25"}`} />
                ))}
              </div>
              <button
                type="button"
                aria-label={playing ? "Pause autoplay" : "Start autoplay"}
                onClick={() => setChosen(!playing)}
                className={`${focusRing} ml-auto grid size-10 cursor-pointer place-items-center rounded-full border border-foreground/10 bg-white text-foreground transition-colors hover:border-foreground/20`}
              >
                {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
              </button>
            </div>
            <p className="sr-only" aria-live="polite">{playing ? "" : `${TEMPLATES[index].name}, ${index + 1} of ${COUNT}`}</p>
     
          </motion.div>
        </div>
      </section>
    </div>
  );
}
