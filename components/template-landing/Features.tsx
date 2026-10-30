"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Visual, type FeatureVisual } from "@/components/landing/Features";
import { FEATURES, START } from "@/components/template-landing/content";
import { useStill, Words } from "@/components/template-landing/scroll-fx";
import { ease, focusRing, frame, grid, pad, type } from "@/components/template-landing/ui";

const COUNT = FEATURES.items.length;
// How long each feature stays before the next while it plays by itself.
const AUTOPLAY_MS = 5200;
// The home page's picture for each feature, in the same order.
const VISUALS: FeatureVisual[] = ["templates", "edit", "phone", "switch", "draft", "address"];

// Features, laid out like How it works: across the top, a small label over
// the title set large, the intro and a small dark button. Then, in the grid's
// columns: the feature's number large, light and regular weight at the foot
// of its column, level with the drawing's foot on the section's bottom line,
// the home page's drawing of it (wiping up as it changes), its title and line,
// and every feature listed (the one on show dark, a hairline under it filling
// while it is on show). Pointing at or focusing one shows it; it moves on by
// itself while on screen and not pointed at.
export default function Features() {
  const still = useStill();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const feature = FEATURES.items[index];
  const running = !still && !held && inView;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % COUNT), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, running]);

  return (
    <section
      ref={ref}
      id="features"
      data-caption="features"
      aria-labelledby="tl-features-title"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      className="relative scroll-mt-20"
    >
      <div className={`${frame} ${grid} pt-[clamp(5rem,12vh,9rem)]`}>
        {/* The heading: a small label over one large line, the intro and the button. */}
        <div className="flex flex-col items-start gap-2 lg:col-span-4">
          <p className={`m-0 ${type.kicker}`}>{FEATURES.label}</p>
          <h2 id="tl-features-title" className={`m-0 ${type.heading}`}>
            <Words text={`${FEATURES.title}.`} />
          </h2>
          <p className={`m-0 mt-[clamp(0.75rem,1.5vw,1.25rem)] max-w-[34rem] ${type.body} text-[var(--dim)]`}>{FEATURES.text}</p>
          <Link
            href={START.href}
            className={`${focusRing} group mt-[clamp(1rem,2vw,1.5rem)] inline-flex items-center gap-3 rounded-[4px] bg-[var(--fg)] py-1.5 pl-3 pr-1.5 font-mono text-[0.8125rem] uppercase tracking-[0.12em] text-[var(--bg)] no-underline transition-opacity hover:opacity-85`}
          >
            {START.label}
            <span aria-hidden="true" className="grid size-[1.375rem] place-items-center rounded-[3px] border border-solid border-current">
              <ArrowUpRight strokeWidth={2} className="size-3.5 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
            </span>
          </Link>
        </div>
      </div>

      <div className={`${frame} ${grid} gap-y-8 pt-[clamp(3rem,8vh,5rem)]`}>
        {/* The number, large, light and regular weight, at the column's foot level with the picture's. */}
        <div className="flex flex-col justify-end lg:pr-[clamp(1rem,1.75vw,2rem)]">
          <span aria-hidden="true" className="relative block h-[0.86em] overflow-hidden font-[family-name:var(--font-1)] text-[length:clamp(6rem,14vw,16rem)] font-normal leading-[0.86] tracking-[-0.06em] text-[color-mix(in_srgb,var(--fg)_7%,transparent)]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={index} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.7, ease }} className="block">
                {pad(index + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        {/* The home page's drawing of the feature, wiping up as it changes. */}
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.3, ease }}
          className="relative aspect-[3/4] overflow-hidden bg-neutral-200 lg:aspect-auto lg:min-h-[34rem]"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 1 }}
              transition={{ duration: still ? 0 : 1, ease: [0.65, 0, 0.35, 1] }}
              className="absolute inset-0 grid place-items-center bg-neutral-200"
            >
              <div className="grid aspect-[4/5] w-[92%] place-items-center">
                <Visual kind={VISUALS[index] ?? "templates"} />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Its title and line. */}
        <div className="flex items-end pb-[clamp(3rem,8vh,5rem)] lg:px-[clamp(1rem,1.75vw,2rem)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={index} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="flex flex-col gap-3">
              <span className={`${type.small} text-[var(--accent)]`}>Feature {pad(index + 1)}</span>
              <h3 className={`m-0 ${type.name}`}>{feature.title}</h3>
              <p className={`m-0 ${type.body} text-[var(--dim)]`}>{feature.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Every feature, the one on show dark with its hairline filling. */}
        <ul className="m-0 flex list-none flex-col gap-1 p-0 pb-[clamp(3rem,8vh,5rem)] lg:pl-[clamp(1rem,1.75vw,2rem)]">
          {FEATURES.items.map((item, i) => (
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
