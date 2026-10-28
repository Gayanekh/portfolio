"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Link2, MousePointer2, MoveRight } from "lucide-react";
import { PROCESS, ROOMS } from "@/components/landing-next/content";
import { Headline, Label, Reveal } from "@/components/landing-next/kit";
import { ease, focusRing, font, pad, shadow, shell, space, type } from "@/components/landing-next/ui";

// The section's copy: its label, title and steps (each may carry a link).
type ProcessCopy = Pick<typeof PROCESS, "label" | "title"> & { steps: { title: string; text: string; url: string; cta?: { href: string; label: string } }[] };

const line = "h-2 rounded-full bg-[var(--ink)]/10";

// The words typed into the mock, one letter at a time while `on`.
function useTyped(text: string, on: boolean, speed = 75) {
  const still = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!on) return;
    let shown = still ? text.length - 1 : 0;
    const timer = window.setInterval(() => {
      shown += 1;
      setCount(shown);
      if (shown >= text.length) window.clearInterval(timer);
    }, still ? 0 : speed);
    return () => {
      window.clearInterval(timer);
      setCount(0);
    };
  }, [text, on, speed, still]);
  return text.slice(0, count);
}

const caret = <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-[var(--iris-deep)]" />;

// The product at each step: picking a template (a pointer glides to the
// middle one and it is chosen), filling it in (the name types itself and the
// page beside it follows) and publishing (the address types itself, then
// Publish turns into Live).
function Screen({ step }: { step: number }) {
  const still = useReducedMotion();
  const name = useTyped(PROCESS.mock.name, step === 1);
  const slug = useTyped(PROCESS.mock.slug, step === 2, 60);
  const live = step === 2 && slug.length === PROCESS.mock.slug.length;

  if (step === 0) {
    return (
      <div className="relative grid h-full grid-cols-3 content-center gap-3 p-[8%]">
        {ROOMS.slice(0, 3).map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: i === 1 ? 1 : 0.55, y: 0, scale: i === 1 ? [1, 1, 1.07] : 1 }}
            transition={{ duration: 0.6, ease, delay: i * 0.08, scale: { duration: 2, times: [0, 0.72, 1] } }}
            className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-[var(--bone-2)] ${i === 1 ? "z-10 ring-2 ring-[var(--iris-deep)] ring-offset-4 ring-offset-white" : ""}`}
          >
            <Image src={room.square} alt="" fill sizes="12rem" className="object-cover" />
            {i === 1 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, duration: 0.4, ease }} className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-[var(--iris-deep)] text-white">
                <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
              </motion.span>
            )}
          </motion.div>
        ))}
        {!still && (
          <motion.span initial={{ x: "-40%", y: "140%", opacity: 0 }} animate={{ x: "0%", y: "10%", opacity: 1 }} transition={{ duration: 1.3, ease, delay: 0.3 }} className="absolute left-1/2 top-1/2 z-20 text-[var(--ink)]">
            <MousePointer2 aria-hidden="true" className="size-7 fill-white drop-shadow" strokeWidth={1.5} />
          </motion.span>
        )}
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="grid h-full grid-cols-[1fr_1.25fr] gap-5 p-[7%]">
        <div className="flex flex-col justify-center gap-3">
          {PROCESS.mock.fields.map((label, i) => (
            <div key={label} className={`flex flex-col gap-1.5 rounded-lg border border-solid px-3 py-2.5 ${i === 0 ? "border-[var(--iris-deep)] bg-[var(--iris)]/[0.06]" : "border-black/10"}`}>
              <span className={`${font.mono} text-[0.625rem] uppercase tracking-[0.14em] text-[var(--ink)]/45`}>{label}</span>
              {i === 0 ? (
                <span className="h-5 text-[0.9375rem] font-medium">
                  {name}
                  {caret}
                </span>
              ) : (
                <span className={`${line} ${i === 1 ? "w-4/5" : "w-3/5"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-lg bg-[var(--bone)] p-5">
          <span className={`${font.mono} text-[0.625rem] uppercase tracking-[0.14em] text-[var(--ink)]/45`}>{PROCESS.mock.role}</span>
          <span className={`min-h-[2em] ${font.display} text-[length:clamp(1.5rem,2.4vw,2.6rem)] font-semibold leading-[0.95] tracking-[-0.045em]`}>{name || " "}</span>
          <span className={`${line} w-full`} />
          <span className={`${line} w-2/3`} />
          <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-md">
            <Image src={ROOMS[3].square} alt="" fill sizes="16rem" className="object-cover" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center gap-5 p-[9%]">
      <div className="flex items-center gap-2 rounded-lg border border-solid border-black/10 px-4 py-3 text-[0.9375rem]">
        <Link2 aria-hidden="true" className="size-4 text-[var(--ink)]/40" />
        <span className="text-[var(--ink)]/40">portory.net/</span>
        <span className="font-medium">
          {slug}
          {!live && caret}
        </span>
      </div>
      <div className="relative h-12 overflow-hidden rounded-[4px]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={live ? "live" : "publish"}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease }}
            className={`absolute inset-0 flex items-center justify-center gap-2 text-[0.9375rem] font-medium text-white ${live ? "bg-emerald-600" : "bg-[var(--ink)]"}`}
          >
            {live && <span className="size-2 animate-pulse rounded-full bg-white" />}
            {live ? PROCESS.mock.live : PROCESS.mock.publish}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.div animate={{ opacity: live ? 1 : 0.4, y: live ? 0 : 8 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-4 rounded-lg bg-[var(--bone)] p-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
          <Image src={ROOMS[1].square} alt="" fill sizes="4rem" className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <span className="font-semibold">{PROCESS.mock.name}</span>
          <span className={`${line} w-4/5`} />
        </div>
      </motion.div>
    </div>
  );
}

// One step's text, telling the page when it is the one in the middle of the screen.
function Step({ step, index, onShow, active }: { step: ProcessCopy["steps"][number]; index: number; onShow: (i: number) => void; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (seen) onShow(index);
  }, [seen, index, onShow]);
  return (
    <div ref={ref} className="flex min-h-[55svh] flex-col justify-center gap-4 lg:min-h-[78svh]">
      <span className={`${font.serif} text-[length:clamp(3rem,6vw,6.5rem)] leading-none transition-colors duration-500 ${active ? "text-[var(--iris-deep)]" : "text-[var(--ink)]/15"}`}>{pad(index + 1)}</span>
      <h3 className={`m-0 ${type.heading} transition-colors duration-500 ${active ? "text-[var(--ink)]" : "text-[var(--ink)]/30"}`}>{step.title}</h3>
      <p className={`m-0 max-w-[26rem] ${type.body} transition-colors duration-500 ${active ? "text-[var(--ink)]/70" : "text-[var(--ink)]/30"}`}>{step.text}</p>
      {step.cta && (
        <Link href={step.cta.href} className={`${focusRing} group/cta mt-2 inline-flex w-fit items-center gap-2 rounded-[4px] text-[0.9375rem] font-medium no-underline transition-colors duration-500 ${active ? "text-[var(--ink)]" : "text-[var(--ink)]/30"}`}>
          {step.cta.label}
          <MoveRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

// How it works: the steps scroll past on one side while a browser window on
// the other holds still and acts each one out, the window's screen wiping
// to the next as the step in the middle of the screen changes. A thin line
// beside the steps fills as they pass. On phones the window rides at the
// top while the steps scroll under it.
// `lead` adds a line under the title.
export default function Process({ copy = PROCESS, index = "02", lead }: { copy?: ProcessCopy; index?: string; lead?: string }) {
  const [active, setActive] = useState(0);
  const step = copy.steps[active];

  return (
    <section id="how-it-works" aria-label={copy.label} className={`relative bg-[var(--bone)] text-[var(--ink)] ${space}`}>
      <div className={`${shell} flex flex-col gap-6`}>
        <Reveal>
          <Label index={index}>{copy.label}</Label>
        </Reveal>
        <Headline text={copy.title} className={`max-w-[16ch] ${type.title}`} />
        {lead && (
          <Reveal delay={0.1}>
            <p className={`m-0 max-w-[36rem] ${type.lead} text-[var(--ink)]/65`}>{lead}</p>
          </Reveal>
        )}
      </div>

      <div className={`${shell} mt-[clamp(2rem,5vw,5rem)] grid gap-x-[6vw] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]`}>
        <div className="relative pl-6 lg:order-none">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-[var(--ink)]/10" />
          <motion.span aria-hidden="true" animate={{ height: `${((active + 1) / copy.steps.length) * 100}%` }} transition={{ duration: 0.8, ease }} className="absolute left-0 top-0 w-px bg-[var(--iris-deep)]" />
          {copy.steps.map((item, i) => (
            <Step key={item.title} step={item} index={i} active={i === active} onShow={setActive} />
          ))}
        </div>

        <div className="sticky top-[5.5rem] order-first z-10 mb-8 h-fit lg:top-[calc(50svh-min(19rem,33svh))] lg:order-none lg:mb-0">
          <div className={`overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] ${shadow.card}`}>
            <div className="flex h-9 items-center gap-1.5 border-0 border-b border-solid border-black/[0.06] px-3.5">
              <span className="size-2 rounded-full bg-black/15" />
              <span className="size-2 rounded-full bg-black/15" />
              <span className="size-2 rounded-full bg-black/15" />
              <span className={`mx-auto rounded-md bg-black/[0.04] px-3 py-0.5 ${font.mono} text-[0.6875rem] text-black/45`}>{step.url}</span>
            </div>
            <div className="relative aspect-[16/11] max-h-[min(34rem,58svh)] w-full lg:aspect-[16/12]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                  className="absolute inset-0 bg-white"
                >
                  <Screen step={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
