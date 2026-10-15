"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotionConfig } from "framer-motion";
import { Check, Copy, Link2, Plus } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { PEOPLE, TEMPLATES, TEMPLATE_IMAGE } from "@/components/landing/sample-portfolios";
import { displayTitle, ease, focusRing, kicker, lead, section } from "@/components/landing/landing-ui";

// How it works on the landing page: the three steps in one split panel.
// (The scrolling HowItWorks section is kept for use in other layouts.)
const INTRO = {
  kicker: "How it works",
  title: "From blank page to published link",
  text: "Three steps, and you can change anything later. Portory keeps every one of them simple.",
};

const STEPS = [
  { short: "Choose", title: "Choose a template", text: "Pick a layout that suits how you like to present your work. Switch any time; your content stays put.", url: "portory.net/templates" },
  { short: "Add your work", title: "Add your information and work", text: "Fill in your details and work samples one section at a time. The live preview shows exactly how your page will look.", url: "portory.net/editor" },
  { short: "Publish", title: "Publish and share", text: "Get a portory.net address to send to anyone. Edit any time and publish your changes when they're ready.", url: "portory.net/lena-fischer" },
];
const COUNT = STEPS.length;
// How long each step stays before the next while autoplaying.
const AUTOPLAY_MS = 6000;

const person = PEOPLE.lena;
const slug = person.name.toLowerCase().replace(/[^a-z]+/g, "-");
const number = (i: number) => String(i + 1).padStart(2, "0");
const field = "flex items-center justify-between gap-3 rounded-lg border border-foreground/10 bg-white px-3 py-2";

// The product as it looks at each step, in a small browser window.
function StepScreen({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="grid grid-cols-3 gap-2.5 p-4">
        {TEMPLATES.slice(0, 3).map((template, i) => {
          const chosen = i === 1;
          return (
            <div key={template.id} className="flex flex-col gap-1.5">
              <div className={`relative aspect-[3/4] overflow-hidden rounded-lg ${chosen ? "ring-2 ring-foreground ring-offset-2" : "opacity-70"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- remote sample photo */}
                <img src={TEMPLATE_IMAGE[template.id]} alt="" loading="lazy" className="h-full w-full object-cover" />
                {chosen && (
                  <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-foreground text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </div>
              <span className={`text-xs ${chosen ? "font-semibold text-foreground" : "text-foreground/55"}`}>{template.name}</span>
            </div>
          );
        })}
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="flex flex-col gap-2 p-4 text-sm">
        <div className={field}>
          <span className="text-foreground/50">Name</span>
          <span className="font-medium">{person.name}</span>
        </div>
        <div className={field}>
          <span className="text-foreground/50">About you</span>
          <span className="text-success-foreground">Done</span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-foreground/10 bg-white p-3">
          <span className="flex justify-between">
            <span className="text-foreground/50">Projects</span>
            <span className="text-foreground/55">2 added</span>
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(["ledger", "chapter"] as const).map((id) => (
              // eslint-disable-next-line @next/next/no-img-element -- remote sample photo
              <img key={id} src={TEMPLATE_IMAGE[id]} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" />
            ))}
            <span className="grid aspect-[4/3] place-items-center rounded-md border border-dashed border-foreground/25 text-foreground/45">
              <Plus className="size-4" />
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 p-4 text-sm">
      <div className="overflow-hidden rounded-lg border border-foreground/10">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote sample photo */}
        <img src={TEMPLATE_IMAGE.ledger} alt="" loading="lazy" className="h-20 w-full object-cover" />
        <div className="flex flex-col gap-1.5 p-3">
          <span className="font-semibold">{person.name}</span>
          <span className="h-1.5 w-4/5 rounded-full bg-foreground/10" />
          <span className="h-1.5 w-3/5 rounded-full bg-foreground/10" />
        </div>
      </div>
      <div className={field}>
        <span className="flex min-w-0 items-center gap-1.5 truncate text-foreground/70">
          <Link2 className="size-3.5 shrink-0" /> portory.net/{slug}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-foreground px-2 py-1 text-xs font-medium text-white">
          <Copy className="size-3" /> Copy
        </span>
      </div>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success-foreground">
        <span className="size-1.5 rounded-full bg-success" /> Published
      </span>
    </div>
  );
}

// The steps in one rounded panel, split light and dark: the active step's
// text sits on the light side over a large faint step number, and the product
// at that step floats across the split. The tabs below the text choose a
// step; the steps also move on by themselves while on screen, with a line
// filling under the active tab, and pause on hover, on focus and with
// reduced motion.
export default function Steps() {
  const reduced = useReducedMotionConfig();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(panelRef, { amount: 0.4 });
  const playing = !reduced && !paused && inView;

  // Autoplay; choosing a step restarts the interval because `step` changes.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setStep((s) => (s + 1) % COUNT), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [step, playing]);

  const onTabKey = (event: React.KeyboardEvent) => {
    const move = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!move) return;
    event.preventDefault();
    const next = (step + move + COUNT) % COUNT;
    tabRefs.current[next]?.focus();
    setStep(next);
  };

  const active = STEPS[step];

  return (
    <section id="how-it-works" aria-label={INTRO.kicker} className={`${section} md:py-32`}>
      <div className="mx-auto flex w-content-width flex-col gap-10 md:gap-14">
        <Reveal className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className={kicker}>{INTRO.kicker}</p>
            <h2 className={displayTitle}>{INTRO.title}</h2>
          </div>
          <p className={lead}>{INTRO.text}</p>
        </Reveal>

        <Reveal>
          <div
            ref={panelRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setPaused(false)}
            className="relative isolate grid grid-cols-1 overflow-hidden rounded-[2rem] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_30px_60px_-30px_rgb(0_0_0/0.25)] ring-1 ring-foreground/5 md:min-h-[34rem] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
          >
            {/* The dark side of the split (wider screens; phones put the picture on its own dark band). */}
            <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[40%] bg-foreground md:block" />

            {/* The step's text over its faint number, and the step tabs. */}
            <div className="order-2 flex flex-col justify-between gap-10 p-6 md:order-1 md:p-12 lg:p-16">
              <div id="steps-panel" role="tabpanel" aria-labelledby={`steps-tab-${step}`} className="relative min-h-[15rem] md:min-h-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease }}
                    className="relative flex flex-col gap-4"
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute -left-2 -top-4 -z-10 select-none text-[length:clamp(6rem,26vw,8rem)] font-semibold leading-none tracking-[-0.06em] text-foreground/[0.05] md:-top-20 md:text-[length:clamp(8rem,18vw,13rem)]">
                      {number(step)}
                    </span>
                    <p className={kicker}>Step {number(step)}</p>
                    <h3 className="m-0 max-w-[26rem] text-balance text-[length:clamp(1.9rem,6vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[length:clamp(2.1rem,3.4vw,3.25rem)]">
                      {active.title}
                    </h3>
                    <p className="m-0 max-w-[28rem] text-base leading-relaxed text-neutral-600 md:text-lg">{active.text}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div role="tablist" aria-label="Steps" className="grid grid-cols-3 gap-3">
                {STEPS.map((item, i) => {
                  const selected = i === step;
                  return (
                    <button
                      key={item.title}
                      ref={(element) => {
                        tabRefs.current[i] = element;
                      }}
                      type="button"
                      role="tab"
                      id={`steps-tab-${i}`}
                      aria-selected={selected}
                      aria-controls="steps-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setStep(i)}
                      onKeyDown={onTabKey}
                      className={`${focusRing} group flex cursor-pointer flex-col gap-2.5 text-left`}
                    >
                      {/* The line fills while this step plays. */}
                      <span className="relative h-0.5 w-full overflow-hidden rounded-full bg-foreground/10">
                        {selected && (
                          <motion.span
                            key={`${step}-${playing}`}
                            initial={{ scaleX: playing ? 0 : 1 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: playing ? AUTOPLAY_MS / 1000 : 0, ease: "linear" }}
                            className="absolute inset-0 origin-left bg-primary"
                          />
                        )}
                      </span>
                      <span className={`flex flex-col gap-0.5 transition-colors duration-300 ${selected ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/70"}`}>
                        <span className="font-mono text-xs">{number(i)}</span>
                        <span className="text-sm font-medium leading-snug">{item.short}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The product at this step, floating across the split. */}
            <div aria-hidden="true" className="relative order-1 grid min-h-[25rem] place-items-center bg-foreground px-6 py-10 md:order-2 md:min-h-0 md:place-items-start md:items-center md:bg-transparent md:px-4 md:py-12">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.55, ease }}
                  className="w-full max-w-[22rem] overflow-hidden rounded-2xl bg-neutral-50 shadow-[0_2px_6px_rgb(0_0_0/0.08),0_40px_80px_-24px_rgb(0_0_0/0.55)] ring-1 ring-black/5 md:max-w-[24rem]"
                >
                  <div className="flex h-9 items-center gap-1.5 border-b border-foreground/5 bg-white px-3">
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-foreground/[0.05] px-2 py-1 text-center text-[0.7rem] text-foreground/50">{active.url}</span>
                  </div>
                  <StepScreen step={step} />
                </motion.div>
              </AnimatePresence>
              <span className="absolute bottom-4 right-5 font-mono text-xs text-white/45 md:bottom-6 md:right-8">
                {number(step)} / {number(COUNT - 1)}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
