"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { STEPS } from "@/components/template-landing/content";
import { Words, useScrollValue } from "@/components/template-landing/scroll-fx";
import { corner, cornerLink, ease, focusRing, frame, grid, pad, type } from "@/components/template-landing/ui";

const COUNT = STEPS.items.length;
const AUTOPLAY_MS = 5200;

// How it works, the home page's three steps: the label, title and intro
// across the top; then, in the grid's columns, the step's number huge and faint in
// the first column, its picture in the second (wiping up as the step
// changes), its words in the third, and every step listed in the fourth (the
// one on show dark, the others grey; pointing at or focusing one shows it).
// Each step names its address and has its own link, as on the home page.
// A hairline under the list fills while a step is on show. It moves on by
// itself while on screen and not pointed at.
export default function Steps() {
  const still = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const step = STEPS.items[index];
  const running = !still && !held && inView;
  // The big number drifts up against the scroll.
  const [numberRef, drift] = useScrollValue<HTMLDivElement>([120, -120], undefined, 0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % COUNT), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, running]);

  return (
    <section
      ref={ref}
      id="how-it-works"
      data-caption="steps"
      aria-labelledby="tl-steps-title"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      className="relative scroll-mt-20 border-0 border-y border-solid border-[var(--line)]"
    >
      <div className={`${frame} ${grid} gap-y-6 pt-[clamp(4rem,10vh,7rem)]`}>
        <p className={`m-0 ${type.body}`}>{STEPS.label}</p>
        <h2 id="tl-steps-title" className={`m-0 lg:col-span-2 ${type.title}`}>
          <Words text={STEPS.title} />
        </h2>
        <p className={`m-0 self-end ${type.body} text-[var(--dim)] lg:pl-[clamp(1rem,1.75vw,2rem)]`}>{STEPS.text}</p>
      </div>
      <div className={`${frame} ${grid} gap-y-8 py-[clamp(3rem,8vh,5rem)]`}>
        <motion.div ref={numberRef} style={{ y: drift }} className="flex flex-col justify-end gap-6 lg:pr-[clamp(1rem,1.75vw,2rem)]">
          <span aria-hidden="true" className="relative block h-[1em] overflow-hidden font-[family-name:var(--font-1)] text-[length:clamp(6rem,14vw,16rem)] font-semibold leading-[0.8] tracking-[-0.07em] text-[color-mix(in_srgb,var(--fg)_12%,transparent)]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={index} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.7, ease }} className="block">
                {pad(index + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.3, ease }}
          className="relative aspect-[3/4] overflow-hidden bg-[var(--card)] lg:aspect-auto lg:min-h-[34rem]"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 1 }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
              className="absolute inset-0"
            >
              <Image src={step.image} alt="" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="flex items-end lg:px-[clamp(1rem,1.75vw,2rem)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={index} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="flex flex-col gap-3">
              <span className={`${type.small} text-[var(--accent)]`}>{step.url}</span>
              <h3 className={`m-0 ${type.name}`}>{step.title}</h3>
              <p className={`m-0 ${type.body} text-[var(--dim)]`}>{step.text}</p>
              <Link href={step.cta.href} className={`${cornerLink} mt-3 text-[1.125rem]`}>
                {step.cta.label}
                <span aria-hidden="true" className={corner} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <ul className="m-0 flex list-none flex-col gap-1 p-0 lg:pl-[clamp(1rem,1.75vw,2rem)]">
          {STEPS.items.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                aria-pressed={i === index}
                onPointerEnter={() => setIndex(i)}
                onFocus={() => setIndex(i)}
                onClick={() => setIndex(i)}
                className={`${focusRing} cursor-pointer rounded-[4px] border-0 bg-transparent p-0 text-left ${type.name} transition-colors duration-300 ${i === index ? "text-[var(--fg)]" : "text-[var(--dim)] hover:text-[var(--fg)]"}`}
              >
                {item.title}
              </button>
              {i === index && (
                <span aria-hidden="true" className="mt-2 block h-px bg-[var(--line)]">
                  <motion.span
                    key={`${index}-${running}`}
                    initial={{ scaleX: running ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: running ? AUTOPLAY_MS / 1000 : 0.3, ease: "linear" }}
                    className="block h-full origin-left bg-[var(--accent)]"
                  />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
