"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotionConfig, useScroll, type Variants } from "framer-motion";
import { ArrowLeftRight, Check, Lock } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { PEOPLE, TEMPLATES, TEMPLATE_IMAGE } from "@/components/landing/sample-portfolios";
import { displayTitle, ease, focusRing, kicker, lead, section, fluidText } from "@/components/landing/landing-ui";
import { scrollPageTo } from "@/lib/scroll";

// Content from the landing-redesign branch's "Everything you need" section.
type FeatureVisual = "templates" | "edit" | "phone" | "address" | "switch" | "draft";

const INTRO = {
  kicker: "Features",
  title: "Everything you need to present your work",
  text: "No code, no fiddling with layouts. Just your work, shown well.",
};

const FEATURES: { visual: FeatureVisual; title: string; text: string }[] = [
  { visual: "templates", title: "Designed templates", text: "Start from a layout made for your kind of work, with sample content to show the way." },
  { visual: "edit", title: "Edit on the page", text: "Click any text in the live preview and type. What you see is what visitors get." },
  { visual: "phone", title: "Right on every screen", text: "Every template adapts to phones. Check it in the phone preview before you publish." },
  { visual: "switch", title: "Change template any time", text: "Switch layouts whenever you like. Your content stays the same; only the design changes." },
  { visual: "draft", title: "Drafts stay private", text: "Edits stay in your draft until you publish them, so visitors never see half-finished work." },
  { visual: "address", title: "Your own address", text: "Publish to portory.net/your-name and share one link everywhere." },
];

const SAMPLES = TEMPLATES.slice(0, 3).map((template) => ({ name: PEOPLE[template.sample].name, image: TEMPLATE_IMAGE[template.id] }));
const COUNT = FEATURES.length;
// Scroll for each change of feature while pinned: one spacer of this height per step.
const STEP = "h-[45svh] md:h-[60svh]";

const description =
  "m-0 mx-auto max-w-[34rem] pb-[clamp(0.25rem,calc(-0.068rem_+_1.183vw),0.5rem)] md:mx-0 pt-[clamp(0.5rem,calc(-0.136rem_+_2.367vw),1rem)] text-[length:clamp(0.875rem,calc(0.716rem_+_0.592vw),1rem)] leading-relaxed text-neutral-600 min-h-[calc(3lh+0.75rem)] md:min-h-[calc(3lh+1.5rem)]";

// True below md. On the server and first render it is false (the md+ layout).
const PHONE = "(max-width: 767px)";
const subscribePhone = (onChange: () => void) => {
  const query = window.matchMedia(PHONE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const usePhone = () => useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE).matches, () => false);

const photo = (i: number) => SAMPLES[i % SAMPLES.length].image;
const line = "h-2 rounded-full bg-black/10";
const floating = "bg-white shadow-[0_12px_30px_-16px_rgb(0_0_0/0.3)]";
// The three fanned template cards: left, middle, right (centred, then shifted and tilted).
const FAN = ["-translate-x-[78%] -rotate-[8deg]", "-translate-x-1/2", "-translate-x-[22%] rotate-[8deg]"];

// A small, quiet picture of each feature, drawn from the product's parts.
function Visual({ kind }: { kind: FeatureVisual }) {
  switch (kind) {
    case "templates":
      return (
        <div className="relative h-full w-full">
          {FAN.map((place, i) => (
            <div
              key={place}
              className={`absolute left-1/2 top-1/2 aspect-[4/3] w-[58%] -translate-y-1/2 overflow-hidden rounded-lg bg-white p-1.5 shadow-[0_12px_30px_-12px_rgb(0_0_0/0.35)] ${place}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- remote sample photo */}
              <img src={photo(i)} alt="" loading="lazy" className="h-full w-full rounded object-cover" />
            </div>
          ))}
        </div>
      );
    case "edit":
      return (
        <div className={`${floating} flex w-[82%] flex-col gap-3 rounded-xl p-6`}>
          <p className="m-0 w-fit rounded-sm px-1 text-2xl font-medium tracking-[-0.03em] outline-dashed outline-2 outline-offset-4 outline-black/40">
            {SAMPLES[0].name}
            <span className="ml-0.5 inline-block h-6 w-0.5 translate-y-1 animate-pulse bg-black" />
          </p>
          <div className={`${line} mt-2 w-full`} />
          <div className={`${line} w-4/5`} />
        </div>
      );
    case "phone":
      return (
        <div className="h-[74%] w-[50%] overflow-hidden rounded-[1.75rem] border-[6px] border-black bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote sample photo */}
          <img src={photo(2)} alt="" loading="lazy" className="h-1/2 w-full object-cover" />
          <div className="flex flex-col gap-2 p-3">
            <div className={`${line} w-3/4 bg-black/60`} />
            <div className={`${line} w-full`} />
            <div className={`${line} w-2/3`} />
          </div>
        </div>
      );
    case "switch":
      return (
        <div className="relative flex w-[86%] items-center justify-between gap-3">
          {[0, 1].map((i) => (
            <div key={i} className={`${floating} flex aspect-[3/4] w-[42%] flex-col gap-1.5 rounded-lg p-2`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- remote sample photo */}
              <img src={photo(i)} alt="" loading="lazy" className={`w-full rounded object-cover ${i ? "h-1/3" : "h-2/3"}`} />
              <div className={`${line} w-3/4`} />
              <div className={`${line} w-1/2`} />
            </div>
          ))}
          <ArrowLeftRight aria-hidden="true" className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black p-1.5 text-white" />
        </div>
      );
    case "draft":
      return (
        <div className={`${floating} flex w-[82%] flex-col gap-3 rounded-xl p-5`}>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
            <Lock aria-hidden="true" className="size-3.5" /> Draft · only you
          </span>
          <div className={`${line} w-full`} />
          <div className={`${line} w-5/6`} />
          <span className="mt-1 w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white">Publish changes</span>
        </div>
      );
    case "address":
      return (
        <div className="flex w-[86%] flex-col items-center gap-4">
          <div className={`${floating} w-full truncate rounded-full px-5 py-3 text-center text-lg tracking-[-0.01em]`}>
            <span className="text-neutral-400">portory.net/</span>
            <span className="font-medium text-black">{SAMPLES[0].name.toLowerCase().replace(/\s+/g, "-")}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-sm text-white">
            <Check aria-hidden="true" className="size-3.5" /> Published
          </span>
        </div>
      );
  }
}

// Going forward, the next card rises from below and covers the current one,
// which shrinks from its top edge and fades (as in the hero's card stack).
// Going back plays it in reverse.
const card: Variants = {
  enter: (dir: number) => (dir > 0 ? { y: "100%", scale: 1, opacity: 1, zIndex: 2 } : { y: 0, scale: 0.7, opacity: 0, zIndex: 1 }),
  center: { y: 0, scale: 1, opacity: 1 },
  exit: (dir: number) => (dir > 0 ? { y: 0, scale: 0.7, opacity: 0, zIndex: 1 } : { y: "100%", scale: 1, opacity: 1, zIndex: 2 }),
};


// The features as a slider: a picture card with a dot rail beside it and the
// titles (the active one dark with its line below, the others grey). It is
// pinned for a stretch of scroll, one step per feature, and a title or dot
// scrolls to its feature. From md up the heading pins with it and the titles
// sit beside the card; on phones only the slider pins, the card on top and the
// titles centred below it, so it fits one screen.
export default function Features() {
  const reduced = useReducedMotionConfig();
  const phone = usePhone();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (target: number) => setState((current) => (current[0] === target ? current : [target, target > current[0] ? 1 : -1]));

  // On phones the heading scrolls past before the slider pins, so the pinned
  // stretch starts that far into the track; from md up it starts at once.
  const pinLead = () => {
    const heading = sliderRef.current?.previousElementSibling as HTMLElement | null | undefined;
    return heading && window.matchMedia(PHONE).matches ? heading.offsetHeight : 0;
  };

  // 0 when the pinned slider reaches the top of the screen, 1 when it lets go;
  // each feature has an equal share.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const track = trackRef.current;
    if (!track) return;
    const range = track.offsetHeight - window.innerHeight;
    const lead = pinLead();
    const pinned = range > lead ? (p * range - lead) / (range - lead) : p;
    select(Math.min(COUNT - 1, Math.max(0, Math.floor(pinned * COUNT))));
  });

  const show = (next: number) => {
    const target = (next + COUNT) % COUNT;
    const track = trackRef.current;
    if (!track) return select(target);
    // Scroll to the middle of the feature's share of the pinned stretch.
    const lead = pinLead();
    const start = track.getBoundingClientRect().top + window.scrollY + lead;
    const range = track.offsetHeight - window.innerHeight - lead;
    scrollPageTo(start + ((target + 0.5) / COUNT) * range, { immediate: !!reduced });
  };

  const onTabKey = (event: React.KeyboardEvent) => {
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    const target = event.key === "Home" ? 0 : event.key === "End" ? COUNT - 1 : step ? (index + step + COUNT) % COUNT : null;
    if (target === null) return;
    event.preventDefault();
    tabRefs.current[target]?.focus({ preventScroll: true });
    show(target);
  };

  const active = FEATURES[index];

  return (
    <section id="features" aria-label={INTRO.title} className={`${section} md:py-0`}>
      {/* The track: from md up the heading and slider are pinned together, filling
          the screen below the floating header, while the spacers after them
          scroll past, one per feature change. */}
      <div ref={trackRef}>
        <div className="contents md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:gap-[clamp(2rem,calc(0.5rem_+_3.125vw),2.5rem)] md:pb-6 md:pt-20">
          <Reveal className="mx-auto flex w-content-width flex-col gap-5">
            <p className={kicker}>{INTRO.kicker}</p>
            <h2 className={displayTitle}>{INTRO.title}</h2>
            <p className={`${lead} max-w-[36rem]`}>{INTRO.text}</p>
          </Reveal>

          <div
            ref={sliderRef}
            className="sticky top-0 mx-auto grid h-svh w-content-width grid-cols-[auto_minmax(0,1fr)] content-center items-center gap-x-[clamp(1rem,calc(-1.08rem_+_6.4vw),3rem)] gap-y-[clamp(1.75rem,calc(0.796rem_+_3.55vw),2.5rem)] pb-4 pt-[4.5rem] md:static md:h-auto md:grid-cols-[auto_minmax(0,0.85fr)_minmax(0,1.15fr)] md:content-normal md:pb-0 md:pt-0"
          >
            {/* The dot rail: the same feature as the titles, for the pointer. */}
            <div aria-hidden="true" className="flex flex-col items-center gap-2">
              {FEATURES.map((feature, k) => (
                <button
                  key={feature.title}
                  type="button"
                  tabIndex={-1}
                  onClick={() => show(k)}
                  className={`w-1.5 cursor-pointer rounded border-0 p-0 transition-[height,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    k === index ? "h-[1.375rem] bg-primary" : "h-1.5 bg-foreground/35 hover:bg-foreground/60"
                  }`}
                />
              ))}
            </div>

            {/* The picture card. */}
            <div
              id="features-panel"
              role="tabpanel"
              aria-labelledby={`features-tab-${index}`}
              className="relative isolate aspect-[5/4] w-full max-w-[min(30rem,calc(34svh*1.25))] justify-self-center overflow-hidden rounded-3xl bg-neutral-200 md:aspect-[4/5] md:max-w-[min(34rem,calc((100svh-21rem)*0.8))]"
            >
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={active.visual}
                  custom={dir}
                  variants={card}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.7, ease }}
                  aria-hidden="true"
                  className="absolute inset-0 grid origin-top place-items-center bg-neutral-200"
                >
                  <Visual kind={active.visual} />
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-6">
                <span className="whitespace-nowrap rounded-full bg-foreground/80 px-3 py-2 text-xs font-bold leading-none text-white backdrop-blur-md">{active.title}</span>
              </div>
            </div>

            {/* The titles; the active one opens its line. Each line keeps room for
                three rows, so the centred list doesn't shift as features change.
                On phones the line moves over at once and the titles slide into
                place, so the list's height never changes and nothing jumps. */}
            <div role="tablist" aria-label="Features" aria-orientation="vertical" className="col-span-2 flex flex-col items-center gap-[clamp(0.625rem,calc(0.148rem_+_1.775vw),1rem)] text-center md:col-span-1 md:items-stretch md:text-left">
              {FEATURES.map((feature, k) => {
                const selected = k === index;
                return (
                  <motion.div key={feature.title} layout={phone ? "position" : false} transition={{ duration: 0.5, ease }} className="w-full">
                    <button
                      ref={(element) => {
                        tabRefs.current[k] = element;
                      }}
                      type="button"
                      role="tab"
                      id={`features-tab-${k}`}
                      aria-selected={selected}
                      aria-controls="features-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => show(k)}
                      onKeyDown={onTabKey}
                      className={`${focusRing} block w-full cursor-pointer text-center md:w-auto md:text-left ${fluidText.featureTitle} font-medium leading-[1.05] tracking-[-0.045em] transition-colors duration-300 ${
                        selected ? "text-foreground" : "text-foreground/30 hover:text-foreground/55"
                      }`}
                    >
                      {feature.title}
                    </button>
                    {phone ? (
                      selected && (
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease, delay: 0.08 }}
                          className={description}
                        >
                          {feature.text}
                        </motion.p>
                      )
                    ) : (
                      <AnimatePresence initial={false}>
                        {selected && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.5, ease }}
                            className="overflow-hidden"
                          >
                            <motion.p
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.45, ease, delay: 0.08 }}
                              className={description}
                            >
                              {feature.text}
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        {Array.from({ length: COUNT - 1 }, (_, k) => (
          <div key={k} aria-hidden="true" className={STEP} />
        ))}

      </div>
    </section>
  );
}
