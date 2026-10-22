"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotionConfig } from "framer-motion";
import { ArrowRight, Check, Copy, Link2, Plus } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { PEOPLE, TEMPLATES, TEMPLATE_IMAGE } from "@/components/landing/sample-portfolios";
import { focusRing, kicker, section } from "@/components/landing/landing-ui";

// How it works on the landing page: the three steps in an editorial grid.
// (The scrolling HowItWorks section is kept for use in other layouts.)
const INTRO = {
  kicker: "How it works",
  title: "From blank page to published link",
  text: "Three steps, and you can change anything later. Portory keeps every one of them simple.",
};

const STEPS = [
  { short: "Choose", title: "Choose a template", label: "Templates", text: "Pick a layout that suits how you like to present your work. Switch any time; your content stays put.", url: "portory.net/templates" },
  { short: "Add your work", title: "Add your information and work", label: "Editor", text: "Fill in your details and work samples one section at a time. The live preview shows exactly how your page will look.", url: "portory.net/editor" },
  { short: "Publish", title: "Publish and share", label: "Live", text: "Get a portory.net address to send to anyone. Edit any time and publish your changes when they're ready.", url: "portory.net/lena-fischer" },
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

// How it works as an editorial grid, columns divided by hairlines and nothing
// boxed in: the intro in the first column (the heading set light and large,
// pointing on to the steps), then one column per step with a large light
// number, a short line naming the step, its title, a small label, the product
// at that step in a little browser window and a short note. The steps move on
// by themselves while on screen: the active one's number darkens and a line
// fills along its top, while the others dim a little. Hovering, focusing or
// clicking a column shows it and pauses; reduced motion stays still. On
// phones the step columns scroll sideways.
export default function Steps() {
  const reduced = useReducedMotionConfig();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { amount: 0.4 });
  const playing = !reduced && !paused && inView;

  // Autoplay; choosing a step restarts the interval because `step` changes.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setStep((s) => (s + 1) % COUNT), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [step, playing]);

  const show = (i: number) => {
    setPaused(true);
    setStep(i);
  };

  return (
    <section id="how-it-works" aria-label={INTRO.kicker} className={`${section} md:py-32`}>
      <Reveal>
        <div
          ref={gridRef}
          onMouseLeave={() => setPaused(false)}
          onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setPaused(false)}
          className="mx-auto grid w-content-width grid-cols-1 border-y border-foreground/10 lg:min-h-[40rem] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2.75fr)]"
        >
          {/* The intro column: the section's label in the accent colour (as on the
              other sections), the heading, and the intro at the foot. */}
          <div className="flex flex-col justify-between gap-12 py-10 lg:py-8 lg:pr-10">
            <p className={kicker}>{INTRO.kicker}</p>
            <div className="flex items-end justify-between gap-6">
              <h2 className="m-0 max-w-[14ch] text-balance text-[length:clamp(2.25rem,4vw,3.5rem)] font-light leading-[1.08] tracking-[-0.03em] text-foreground">{INTRO.title}.</h2>
              <ArrowRight aria-hidden="true" strokeWidth={1} className="mb-3 hidden size-9 shrink-0 text-foreground/70 lg:block" />
            </div>
            <p className="m-0 max-w-[19rem] text-sm leading-snug text-foreground/55">{INTRO.text}</p>
          </div>

          {/* The step columns: side by side from lg, a sideways scroll before that. */}
          <div className="-mx-[7.5vw] flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain border-t border-foreground/10 px-[7.5vw] [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:border-t-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
            {STEPS.map((item, i) => {
              const on = i === step;
              return (
                <article
                  key={item.title}
                  onMouseEnter={() => show(i)}
                  onFocus={() => show(i)}
                  className="relative flex w-[78vw] max-w-[22rem] shrink-0 snap-start flex-col border-l border-foreground/10 px-4 pb-8 pt-6 sm:w-[20rem] lg:w-auto lg:max-w-none lg:px-5"
                >
                  {/* The line along the column's top, filling while this step plays. */}
                  <span aria-hidden="true" className="absolute inset-x-0 -top-px h-px overflow-hidden">
                    {on && (
                      <motion.span
                        key={`${step}-${playing}`}
                        initial={{ scaleX: playing ? 0 : 1 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: playing ? AUTOPLAY_MS / 1000 : 0, ease: "linear" }}
                        className="absolute inset-0 origin-left bg-primary"
                      />
                    )}
                  </span>

                  <span aria-hidden="true" className={`select-none text-[length:clamp(4rem,6vw,5.75rem)] font-light leading-[0.85] tracking-[-0.04em] transition-colors duration-500 ${on ? "text-foreground/80" : "text-foreground/[0.12]"}`}>
                    {number(i)}
                  </span>

                  <div className={`mt-12 flex flex-col gap-3 transition-opacity duration-500 lg:mt-20 ${on ? "opacity-100" : "opacity-55"}`}>
                    <p className="m-0 text-[13px] text-foreground/60">
                      Step {number(i)} — {item.short}
                    </p>
                    <h3 className="m-0">
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setStep(i)}
                        className={`${focusRing} cursor-pointer rounded text-left text-[length:clamp(1.25rem,1.6vw,1.5rem)] font-light leading-[1.2] tracking-[-0.01em] text-foreground`}
                      >
                        {item.title}
                      </button>
                    </h3>

                    <p className="m-0 mt-6 text-[13px] text-foreground/60">{item.label}</p>
                    {/* The product at this step. */}
                    <div aria-hidden="true" className="overflow-hidden rounded-lg bg-neutral-50 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_18px_36px_-22px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.05]">
                      <div className="flex h-7 items-center gap-1 border-b border-foreground/5 bg-white px-2.5">
                        <span className="size-1.5 rounded-full bg-foreground/15" />
                        <span className="size-1.5 rounded-full bg-foreground/15" />
                        <span className="size-1.5 rounded-full bg-foreground/15" />
                        <span className="ml-1.5 min-w-0 flex-1 truncate rounded bg-foreground/[0.05] px-2 py-0.5 text-center text-[0.65rem] text-foreground/50">{item.url}</span>
                      </div>
                      <StepScreen step={i} />
                    </div>
                    <p className="m-0 text-[13px] leading-snug text-foreground/50">{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
