"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, MoveRight, Pause, Play } from "lucide-react";
import { siteTemplateEditorHref } from "@/components/site-templates/registry";
import { Headline, Label, Reveal } from "@/components/landing-next/kit";
import { button, buttonArrow, ease, focusRing, font, shadow, shell, space, type } from "@/components/landing-next/ui";
import { ROOMS, TEMPLATES } from "@/components/line-landing/content";

const COUNT = ROOMS.length;
const round = `${focusRing} grid size-11 cursor-pointer place-items-center rounded-full border border-solid border-white/15 bg-white/[0.04] text-[var(--bone)] backdrop-blur-md transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.08]`;

// The home page's templates, over the mesh: its heading and text, then a
// tab for every template (a soft pill sliding to the one chosen or pointed
// at; arrow keys move between them), the chosen template in a large window
// that crossfades, and beside it a glass panel with its style, pitch, who it
// is made for and what it works best with, Preview (the demo, in a new tab)
// and Use template (the editor). Under it the autoplay: a bar per template,
// the chosen one filling over the interval, previous and next, pause or
// play, and every template. It pauses under the pointer and off screen.
export default function Templates() {
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  // null: the visitor hasn't chosen, so autoplay follows reduced motion.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const playing = chosen ?? !still;
  const running = playing && !held && inView;
  const room = ROOMS[index];
  const lit = hovered ?? index;

  const go = (next: number) => setIndex((next + COUNT) % COUNT);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(index + 1), TEMPLATES.autoplayMs);
    return () => window.clearTimeout(timer);
  }, [index, running]);

  const onTabKey = (event: KeyboardEvent, current: number) => {
    const target = event.key === "ArrowRight" ? current + 1 : event.key === "ArrowLeft" ? current - 1 : event.key === "Home" ? 0 : event.key === "End" ? COUNT - 1 : null;
    if (target === null) return;
    event.preventDefault();
    const next = (target + COUNT) % COUNT;
    document.getElementById(`ll-tab-${ROOMS[next].id}`)?.focus();
    go(next);
  };

  return (
    <section id="templates" aria-label={TEMPLATES.title.replace(/\*/g, "")} className={`relative z-10 scroll-mt-20 text-[var(--bone)] ${space}`}>
      <div className={`${shell} grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end`}>
        <div className="flex flex-col gap-6">
          <Reveal>
            <Label index="01" tone="dark">
              {TEMPLATES.label}
            </Label>
          </Reveal>
          <Headline tone="dark" text={TEMPLATES.title} className={`max-w-[14ch] ${type.title}`} />
        </div>
        <Reveal delay={0.1}>
          <p className={`m-0 ${type.lead} text-[var(--bone)]/70`}>{TEMPLATES.text}</p>
        </Reveal>
      </div>

      <Reveal className={`${shell} mt-[clamp(2rem,4vw,3.5rem)]`}>
        <div role="tablist" aria-label="Template" onMouseLeave={() => setHovered(null)} className="flex flex-wrap gap-1">
          {ROOMS.map((item, i) => (
            <button
              key={item.id}
              id={`ll-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls="ll-template-panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => go(i)}
              onKeyDown={(event) => onTabKey(event, i)}
              onMouseEnter={() => setHovered(i)}
              className={`${focusRing} relative cursor-pointer rounded-lg border-0 bg-transparent px-4 py-2.5 text-[0.9375rem] transition-colors duration-300 ${lit === i ? "text-[var(--bone)]" : "text-[var(--bone)]/55"}`}
            >
              {lit === i && <motion.span layoutId="ll-tab-pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} className="absolute inset-0 rounded-lg bg-white/[0.09] ring-1 ring-white/15" />}
              <span className="relative">{item.name}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <div ref={ref} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} className={`${shell} mt-6`}>
        <div id="ll-template-panel" role="tabpanel" aria-labelledby={`ll-tab-${room.id}`} className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          {/* The window. */}
          <Link href={room.href} target="_blank" rel="noopener" aria-label={`Preview the ${room.name} template (opens in a new tab)`} className={`${focusRing} group/window block overflow-hidden rounded-xl bg-[var(--ink-2)] ring-1 ring-white/10 ${shadow.float}`}>
            <span className="flex h-9 items-center gap-1.5 border-0 border-b border-solid border-white/10 px-3.5">
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className={`mx-auto rounded-md bg-white/[0.06] px-3 py-0.5 ${font.mono} text-[0.6875rem] text-white/50`}>portory.net/{room.id}</span>
            </span>
            <span className="relative block aspect-[16/10] overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.span key={room.id} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }} className="absolute inset-0">
                  <Image src={room.image} alt={`The ${room.name} template`} fill quality={90} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-top transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/window:scale-[1.03]" />
                </motion.span>
              </AnimatePresence>
            </span>
          </Link>

          {/* The panel. */}
          <div className="flex flex-col justify-between gap-8 rounded-xl bg-white/[0.04] p-[clamp(1.5rem,2.5vw,2.5rem)] ring-1 ring-white/10 backdrop-blur-xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={room.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-solid border-white/15 px-3 py-1 text-[0.8125rem] text-[var(--bone)]/80">{room.styleLabel}</span>
                  <span className={`${font.mono} text-[0.75rem] text-[var(--mist)]`}>
                    <span className="text-[var(--peach)]">{String(index + 1).padStart(2, "0")}</span> / {String(COUNT).padStart(2, "0")}
                  </span>
                </div>
                <h3 className={`m-0 ${type.heading}`}>{room.headline}</h3>
                <dl className="m-0 flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5 border-0 border-t border-solid border-white/10 pt-4">
                    <dt className={`${font.mono} text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--mist)]`}>{TEMPLATES.made}</dt>
                    <dd className={`m-0 ${type.body} text-[var(--bone)]/80`}>{room.bestFor}.</dd>
                  </div>
                  <div className="flex flex-col gap-2 border-0 border-t border-solid border-white/10 pt-4">
                    <dt className={`${font.mono} text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--mist)]`}>{TEMPLATES.needs}</dt>
                    <dd className="m-0 flex flex-wrap gap-1.5">
                      {room.needs.map((need) => (
                        <span key={need} className="rounded-full bg-white/[0.06] px-3 py-1 text-[0.8125rem] text-[var(--bone)]/80 ring-1 ring-white/10">
                          {need}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-wrap gap-3">
              <Link href={room.href} target="_blank" rel="noopener" className={button.ghost}>
                <Eye aria-hidden="true" className="size-4" />
                {TEMPLATES.preview}
              </Link>
              <Link href={siteTemplateEditorHref(room.id)} className={button.light}>
                {TEMPLATES.use}
                <MoveRight aria-hidden="true" className={buttonArrow} />
              </Link>
            </div>
          </div>
        </div>

        {/* The autoplay. */}
        <div className="mt-6 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <Link href={TEMPLATES.all.href} className={`${focusRing} group/all inline-flex w-fit items-center gap-2 rounded-[4px] text-[0.9375rem] font-medium text-[var(--bone)] no-underline`}>
            {TEMPLATES.all.label}
            <MoveRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/all:translate-x-1" />
          </Link>
          <div aria-hidden="true" className="flex items-center gap-1.5 justify-self-center">
            {ROOMS.map((item, i) => (
              <motion.span key={item.id} initial={false} animate={{ width: i === index ? 44 : 8 }} transition={{ type: "spring", stiffness: 260, damping: 32 }} className="relative h-1.5 overflow-hidden rounded-full bg-white/15">
                {i === index && (
                  <motion.span
                    key={`${index}-${running}`}
                    initial={{ x: running ? "-100%" : "0%" }}
                    animate={{ x: "0%" }}
                    transition={running ? { duration: TEMPLATES.autoplayMs / 1000, ease: "linear" } : { duration: 0.3, ease }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--iris)] to-[var(--peach)]"
                  />
                )}
              </motion.span>
            ))}
          </div>
          <div className="flex gap-2 justify-self-end">
            <button type="button" aria-label="Previous template" onClick={() => go(index - 1)} className={round}>
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button type="button" aria-label={playing ? "Pause autoplay" : "Start autoplay"} onClick={() => setChosen(!playing)} className={round}>
              {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            </button>
            <button type="button" aria-label="Next template" onClick={() => go(index + 1)} className={round}>
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {playing ? "" : `${room.name}, ${index + 1} of ${COUNT}`}
        </p>
      </div>
    </section>
  );
}
