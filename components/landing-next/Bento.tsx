"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeftRight, Check, Link2, Lock } from "lucide-react";
import { FEATURES, ROOMS } from "@/components/landing-next/content";
import { Headline, Label, Reveal, trackPointer } from "@/components/landing-next/kit";
import { ease, font, shadow, shell, space, type } from "@/components/landing-next/ui";

// Steps through `count` states every `ms` while motion is allowed.
function useCycle(count: number, ms: number) {
  const still = useReducedMotion();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (still) return;
    const timer = window.setInterval(() => setAt((i) => (i + 1) % count), ms);
    return () => window.clearInterval(timer);
  }, [count, ms, still]);
  return at;
}

// A card of the bento: a soft iris light following the pointer over it, its
// picture on top and its name and line below.
function Card({ title, text, className = "", children, delay = 0 }: { title: string; text: string; className?: string; children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay} className={className}>
      <article
        onPointerMove={trackPointer}
        className={`group/card relative isolate flex h-full min-h-[clamp(17rem,24vw,24rem)] flex-col overflow-hidden rounded-2xl bg-white p-[clamp(1.25rem,2vw,2rem)] ring-1 ring-black/[0.05] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 ${shadow.card}`}
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 [background:radial-gradient(26rem_circle_at_var(--x,50%)_var(--y,50%),rgb(157_140_255/0.18),transparent_60%)] group-hover/card:opacity-100" />
        <div className="relative grid flex-1 place-items-center py-6">{children}</div>
        <h3 className={`m-0 ${type.small}`}>{title}</h3>
        <p className={`m-0 mt-2 max-w-[30rem] ${type.body} text-[var(--ink)]/60`}>{text}</p>
      </article>
    </Reveal>
  );
}

// Three templates fanned out, spreading wider under the pointer.
function Fan() {
  const place = ["-rotate-[9deg] -translate-x-[62%] group-hover/card:-translate-x-[86%] group-hover/card:-rotate-[13deg]", "z-10 -translate-y-[6%] group-hover/card:-translate-y-[14%]", "rotate-[9deg] translate-x-[62%] group-hover/card:translate-x-[86%] group-hover/card:rotate-[13deg]"];
  return (
    <div className="relative h-[clamp(9rem,13vw,13rem)] w-full">
      {ROOMS.slice(0, 3).map((room, i) => (
        <span key={room.id} className={`absolute left-1/2 top-1/2 -ml-[clamp(4.5rem,6.5vw,6.5rem)] -mt-[clamp(4.5rem,6.5vw,6.5rem)] size-[clamp(9rem,13vw,13rem)] overflow-hidden rounded-xl ring-4 ring-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${shadow.card} ${place[i]}`}>
          <Image src={room.square} alt="" fill sizes="13rem" className="object-cover" />
        </span>
      ))}
    </div>
  );
}

// A name being typed on the page, outlined like an editable field.
function EditDemo() {
  const still = useReducedMotion();
  const name = FEATURES.items.edit.sample;
  return (
    <div className="flex w-full max-w-[18rem] flex-col gap-3">
      <span className={`w-fit rounded-md px-1.5 ${font.display} text-[1.75rem] font-semibold tracking-[-0.04em] outline-dashed outline-2 outline-offset-4 outline-[var(--iris-deep)]/60`}>
        {Array.from(name).map((letter, i) => (
          <motion.span key={i} initial={still ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.07, duration: 0.01 }}>
            {letter}
          </motion.span>
        ))}
        <span className="ml-0.5 inline-block h-6 w-[2px] translate-y-1 animate-pulse bg-[var(--iris-deep)]" />
      </span>
      <span className="h-2 w-full rounded-full bg-[var(--ink)]/10" />
      <span className="h-2 w-4/5 rounded-full bg-[var(--ink)]/10" />
    </div>
  );
}

// A phone and a laptop showing the same page.
function Screens() {
  return (
    <div className="relative flex items-end gap-3">
      <span className="relative block aspect-[16/10] w-[clamp(9rem,12vw,12rem)] overflow-hidden rounded-md border-[5px] border-solid border-[var(--ink)]">
        <Image src={ROOMS[2].image} alt="" fill sizes="12rem" className="object-cover object-top" />
      </span>
      <span className="relative -mb-2 block aspect-[9/18] w-[clamp(3.5rem,4.5vw,4.5rem)] overflow-hidden rounded-[0.9rem] border-[4px] border-solid border-[var(--ink)] transition-transform duration-700 group-hover/card:-translate-y-2">
        <Image src={ROOMS[2].square} alt="" fill sizes="5rem" className="object-cover" />
      </span>
    </div>
  );
}

// Two templates trading places, the content staying.
function Switch() {
  const at = useCycle(2, 2200);
  return (
    <div className="relative flex items-center gap-4">
      {[0, 1].map((slot) => {
        const room = ROOMS[(slot + at) % 2 === 0 ? 0 : 4];
        return (
          <span key={slot} className="relative block size-[clamp(5rem,7vw,7rem)] overflow-hidden rounded-lg ring-1 ring-black/10">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={room.id} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.7, ease }} className="absolute inset-0">
                <Image src={room.square} alt="" fill sizes="7rem" className="object-cover" />
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
      <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--ink)] text-white ring-4 ring-white">
        <ArrowLeftRight aria-hidden="true" className="size-4" />
      </span>
    </div>
  );
}

// A draft turning published, and back.
function Draft() {
  const at = useCycle(2, 2600);
  const [draft, published] = FEATURES.items.draft.states;
  return (
    <div className="relative h-11 w-[13rem] overflow-hidden rounded-full bg-[var(--bone)] ring-1 ring-black/[0.06]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={at}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease }}
          className={`absolute inset-0 flex items-center justify-center gap-2 text-[0.9375rem] font-medium ${at ? "bg-emerald-600 text-white" : "text-[var(--ink)]/70"}`}
        >
          {at ? <Check aria-hidden="true" className="size-4" /> : <Lock aria-hidden="true" className="size-4" />}
          {at ? published : draft}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// An address whose name keeps changing.
function Address() {
  const names = FEATURES.items.address.names;
  const at = useCycle(names.length, 2000);
  return (
    <div className={`flex items-center gap-1 ${font.display} text-[length:clamp(1.5rem,4vw,4rem)] font-semibold tracking-[-0.045em]`}>
      <Link2 aria-hidden="true" className="mr-2 size-[0.7em] shrink-0 text-[var(--iris-deep)]" />
      <span className="text-[var(--ink)]/30">portory.net/</span>
      <span className="relative inline-grid overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.span key={names[at]} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.35, ease }} className="block">
            {names[at]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}

// The features as a bento of white cards on bone, each with a small live
// picture of what it means.
// `lead` adds a line under the title.
export default function Bento({ copy = FEATURES, index = "04", lead }: { copy?: typeof FEATURES; index?: string; lead?: string }) {
  const f = copy.items;
  return (
    <section id="features" aria-label={copy.label} className={`bg-[var(--bone)] text-[var(--ink)] ${space}`}>
      <div className={`${shell} flex flex-col gap-6`}>
        <Reveal>
          <Label index={index}>{copy.label}</Label>
        </Reveal>
        <Headline text={copy.title} className={`max-w-[18ch] ${type.title}`} />
        {lead && (
          <Reveal delay={0.1}>
            <p className={`m-0 max-w-[36rem] ${type.lead} text-[var(--ink)]/65`}>{lead}</p>
          </Reveal>
        )}
      </div>
      <div className={`${shell} mt-[clamp(2.5rem,5vw,5rem)] grid gap-4 md:grid-cols-2 lg:grid-cols-6`}>
        <Card title={f.templates.title} text={f.templates.text} className="lg:col-span-4">
          <Fan />
        </Card>
        <Card title={f.edit.title} text={f.edit.text} className="lg:col-span-2" delay={0.05}>
          <EditDemo />
        </Card>
        <Card title={f.screens.title} text={f.screens.text} className="lg:col-span-2">
          <Screens />
        </Card>
        <Card title={f.switch.title} text={f.switch.text} className="lg:col-span-2" delay={0.05}>
          <Switch />
        </Card>
        <Card title={f.draft.title} text={f.draft.text} className="lg:col-span-2" delay={0.1}>
          <Draft />
        </Card>
        <Card title={f.address.title} text={f.address.text} className="md:col-span-2 lg:col-span-6">
          <Address />
        </Card>
      </div>
    </section>
  );
}
