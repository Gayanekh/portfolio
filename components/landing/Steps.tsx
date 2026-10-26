"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotionConfig } from "framer-motion";
import { ArrowDown, ArrowUp, Check, Copy, Link2, MoveRight, Plus } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { PEOPLE, TEMPLATES, TEMPLATE_IMAGE } from "@/components/landing/sample-portfolios";
import { displayTitle, ease, focusRing, kicker, lead, section, fit, fluidText } from "@/components/landing/landing-ui";

// How it works on the landing page: the three steps on one canvas.
// (The scrolling HowItWorks section is kept for use in other layouts.)
const INTRO = {
  kicker: "How it works",
  title: "From blank page to published link",
  text: "Three steps, and you can change anything later. Portory keeps every one of them simple.",
};

const STEPS = [
  { short: "Choose", title: "Choose a template", label: "Templates", text: "Pick a layout that suits how you like to present your work. Switch any time; your content stays put.", url: "portory.net/templates", cta: { href: "/templates", label: "See the templates" } },
  { short: "Add your work", title: "Add your information and work", label: "Editor", text: "Fill in your details and work samples one section at a time. The live preview shows exactly how your page will look.", url: "portory.net/editor", cta: { href: "/register", label: "Start your portfolio" } },
  { short: "Publish", title: "Publish and share", label: "Live", text: "Get a portory.net address to send to anyone. Edit any time and publish your changes when they're ready.", url: "portory.net/lena-fischer", cta: { href: "/register", label: "Get started" } },
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

// The hatched square the reference sets beside the step and the picture.
const hatch = "bg-[repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_0.5rem)]";

// How it works as one canvas, after the "The Story." reference: a light page
// with a dark band down its right side, one step at a time. On the light side
// a small vertical "Step 01" label with a hatched square, a large faded
// number behind the step's bold title, its note and a link, and the three
// steps named along the foot; the product at that step, in a small browser
// window, sits across the edge of the dark band, and the band carries
// up/down arrows with a dot per step. The steps move on by themselves while
// on screen, pausing under the pointer or focus (still with reduced motion).
// Below lg the same pieces stack: the step on light, then the window over the
// start of the dark band, then the arrows and dots.
export default function Steps() {
  const reduced = useReducedMotionConfig();
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const inView = useInView(canvasRef, { amount: 0.4 });
  const playing = !reduced && !hovered && !focused && inView;

  // Autoplay; choosing a step restarts the wait because `step` changes.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setStep((s) => (s + 1) % COUNT), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [step, playing]);

  const go = (i: number) => setStep((i + COUNT) % COUNT);
  const item = STEPS[step];
  const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.45, ease } };

  const arrow = (dir: 1 | -1) => (
    <button
      type="button"
      aria-label={dir < 0 ? "Previous step" : "Next step"}
      onClick={() => go(step + dir)}
      className={`${focusRing} grid size-10 cursor-pointer place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white`}
    >
      {dir < 0 ? (
        <ArrowUp aria-hidden="true" strokeWidth={1.25} className="size-7 max-lg:-rotate-90" />
      ) : (
        <ArrowDown aria-hidden="true" strokeWidth={1.25} className="size-7 max-lg:-rotate-90" />
      )}
    </button>
  );

  return (
    <section id="how-it-works" aria-label={INTRO.kicker} className={`${section} ${fit.sectionY}`}>
      <div className="mx-auto flex w-content-width flex-col gap-[clamp(2.5rem,calc(0.456rem_+_6.5vw),4rem)]">
        <Reveal className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,min(26rem,42%))] lg:gap-[min(4rem,6.5%)]">
          <div className="@container flex flex-col gap-5 [--fit:8.47cqi]">
            <p className={kicker}>{INTRO.kicker}</p>
            <h2 className={displayTitle}>{INTRO.title}</h2>
          </div>
          <p className={lead}>{INTRO.text}</p>
        </Reveal>

        <Reveal>
          {/* The canvas. Its sizes: --win the window, --rail the arrows'
              column, --pad and --gap the spacing; the dark band covers the
              rail and just under half the window. */}
          <div
            ref={canvasRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
            className="relative isolate flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_40px_80px_-48px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.04] [--gap:clamp(1.5rem,3vw,3.5rem)] [--pad:clamp(1.5rem,4.5vw,5rem)] [--rail:3.5rem] [--win:clamp(17.5rem,27vw,27rem)] lg:grid lg:min-h-[clamp(32rem,40vw,46rem)] lg:grid-cols-[minmax(0,1fr)_var(--win)_var(--rail)] lg:items-center lg:gap-x-[var(--gap)] lg:px-[var(--pad)] lg:py-[clamp(2.5rem,4vw,4.5rem)]"
          >
            <span aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[calc(var(--pad)+var(--rail)+var(--gap)+var(--win)*0.45)] bg-foreground lg:block" />

            {/* The step, on the light side. */}
            <div className="flex h-full flex-col justify-between gap-10 px-[var(--pad)] pb-10 pt-8 lg:px-0 lg:py-0">
              <p className="m-0 text-[0.8125rem] tabular-nums text-foreground/45">
                {number(step)} <span className="text-foreground/25">/ {number(COUNT - 1)}</span>
              </p>

              <div className="relative pl-[clamp(2.25rem,3.5vw,3.75rem)] pt-[clamp(3.5rem,5vw,5rem)]">
                {/* The vertical label and its hatched square. */}
                <div aria-hidden="true" className="absolute left-0 top-0 flex flex-col items-center gap-3 text-foreground/20">
                  <span className={`size-[clamp(2.75rem,4vw,3.75rem)] ${hatch}`} />
                  <span className="rotate-180 text-[0.75rem] tracking-[0.12em] text-foreground/55 [writing-mode:vertical-rl]">Step {number(step)}</span>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} {...fade} className="relative">
                    <span aria-hidden="true" className={`pointer-events-none absolute -left-[0.08em] -top-[0.42em] select-none ${fluidText.stepNumber} font-bold leading-none tracking-[-0.04em] text-foreground/[0.05]`}>
                      {number(step)}
                    </span>
                    <h3 className={`relative m-0 ${fluidText.stepTitle} font-medium leading-[1.08] tracking-[-0.03em] text-foreground`}>{item.title}.</h3>
                    <p className="relative m-0 mt-5 max-w-[28rem] text-pretty text-base leading-relaxed text-foreground/55">{item.text}</p>
                    <Link href={item.cta.href} className={`${focusRing} group relative mt-7 inline-flex items-center gap-2 rounded text-[0.95rem] font-medium text-foreground no-underline`}>
                      {item.cta.label}
                      <MoveRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* The steps named along the foot; each shows its step. */}
              <div role="group" aria-label="Steps" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
                {STEPS.map((s, i) => (
                  <span key={s.short} className="flex items-center gap-3">
                    {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-foreground/25" />}
                    <button
                      type="button"
                      aria-pressed={i === step}
                      onClick={() => go(i)}
                      className={`${focusRing} cursor-pointer rounded transition-colors duration-300 ${i === step ? "text-foreground" : "text-foreground/45 hover:text-foreground/75"}`}
                    >
                      {s.short}
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* The product at this step, across the edge of the dark band (on
                phones, over the start of it). */}
            <div className="relative bg-[linear-gradient(180deg,transparent_42%,var(--foreground)_42%)] px-[var(--pad)] pb-6 lg:bg-none lg:p-0">
              <span aria-hidden="true" className={`absolute bottom-0 right-[calc(var(--pad)-1.25rem)] size-[clamp(3.5rem,5vw,5rem)] text-white/25 lg:-bottom-[clamp(2rem,3vw,3rem)] lg:-right-[clamp(1.5rem,2.5vw,2.5rem)] ${hatch}`} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} {...fade} aria-hidden="true" className="relative mx-auto w-full max-w-[24rem] overflow-hidden rounded-xl bg-neutral-50 shadow-[0_2px_4px_rgb(0_0_0/0.08),0_40px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-black/[0.06] lg:max-w-none">
                  <div className="flex h-8 items-center gap-1 border-b border-foreground/5 bg-white px-3">
                    <span className="size-1.5 rounded-full bg-foreground/15" />
                    <span className="size-1.5 rounded-full bg-foreground/15" />
                    <span className="size-1.5 rounded-full bg-foreground/15" />
                    <span className="ml-1.5 min-w-0 flex-1 truncate rounded bg-foreground/[0.05] px-2 py-0.5 text-center text-[0.65rem] text-foreground/50">{item.url}</span>
                  </div>
                  <StepScreen step={step} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* The dark band's arrows and a dot per step (a row on phones). */}
            <div className="flex items-center justify-center gap-5 bg-foreground pb-8 pt-4 lg:flex-col lg:bg-transparent lg:p-0">
              {arrow(-1)}
              <div className="flex items-center gap-2.5 lg:flex-col">
                {STEPS.map((s, i) => (
                  <button
                    key={s.short}
                    type="button"
                    aria-label={`Step ${number(i)}: ${s.short}`}
                    aria-current={i === step ? "step" : undefined}
                    onClick={() => go(i)}
                    className={`${focusRing} grid size-5 cursor-pointer place-items-center rounded-full focus-visible:outline-white`}
                  >
                    <span className={`block rounded-full transition-all duration-500 ${i === step ? "size-2 bg-white" : "size-1.5 bg-white/35"}`} />
                  </button>
                ))}
              </div>
              {arrow(1)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
