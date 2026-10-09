"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import BoldPreview from "@/components/templates/BoldPreview";
import MinimalPreview from "@/components/templates/MinimalPreview";
import { demoPortfolioData } from "@/components/templates/demo-data";
import { templates } from "@/components/templates/template-data";

// Live template previews rendered at this width, then scaled to the panel.
const PREVIEW_WIDTH = 900;
const SLIDE_MS = 6000;
const ease = [0.22, 1, 0.36, 1] as const;
const previewData = { ...demoPortfolioData, showScrollProgress: false };
const glassButton =
  "grid place-items-center rounded-full border text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function AuthShowcase() {
  const reducedMotion = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [scale, setScale] = useState(0);
  const template = templates[index];
  const stopped = paused || held || Boolean(reducedMotion);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / PREVIEW_WIDTH));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (stopped) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % templates.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [stopped, index]);

  const go = (step: number) => setIndex((current) => (current + step + templates.length) % templates.length);

  return (
    <aside aria-label="Portfolio templates" className="hidden min-w-0 min-[861px]:block">
      <div
        ref={panel}
        role="group"
        aria-roledescription="carousel"
        aria-label="Portfolio templates"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(1);
          if (event.key === "ArrowLeft") go(-1);
        }}
        className="sticky top-4 isolate h-[calc(100dvh_-_32px)] min-h-[520px] overflow-hidden rounded-[28px] bg-white"
      >
        {templates.map((item, i) => {
          const on = i === index;
          return (
            <motion.div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${templates.length}: ${item.name} template`}
              aria-hidden={!on}
              initial={false}
              animate={reducedMotion ? { opacity: on ? 1 : 0 } : { opacity: on ? 1 : 0, scale: on ? 1.07 : 1.02 }}
              transition={{
                opacity: { duration: reducedMotion ? 0.2 : 0.9, ease },
                scale: on ? { duration: 7, ease: "linear" } : { duration: 1.2, ease },
              }}
              className="pointer-events-none absolute inset-0 overflow-hidden bg-white"
            >
              <motion.div
                inert
                initial={false}
                animate={{ scale: scale || 1, opacity: scale ? 1 : 0 }}
                transition={{ duration: 0 }}
                className="w-[900px] origin-top-left"
              >
                {item.id === "bold" ? <BoldPreview data={previewData} /> : <MinimalPreview data={previewData} />}
              </motion.div>
            </motion.div>
          );
        })}

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgb(0_0_0/0)_45%,rgb(0_0_0/0.22)_60%,rgb(0_0_0/0.72)_100%)]" />
        {/* Curved cutout at the top-left corner that seats the back button. */}
        <div aria-hidden="true" className="absolute left-0 top-0 z-[2] h-[84px] w-[84px] rounded-br-[28px] bg-white before:absolute before:left-[84px] before:top-0 before:h-7 before:w-7 before:bg-[radial-gradient(circle_at_100%_100%,transparent_27.5px,#fff_28px)] before:content-[''] after:absolute after:left-0 after:top-[84px] after:h-7 after:w-7 after:bg-[radial-gradient(circle_at_100%_100%,transparent_27.5px,#fff_28px)] after:content-['']" />
        <Link
          href="/"
          aria-label="Back to home"
          className="group/back absolute left-2 top-2 z-[3] grid h-[60px] w-[60px] place-items-center rounded-full border border-foreground/15 bg-white text-foreground transition-[border-color,transform] duration-200 hover:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground active:scale-[.94]"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5 transition-transform duration-300 group-hover/back:-translate-x-[3px]" />
        </Link>

        <div className="absolute inset-x-3 bottom-3 z-[3] flex items-end gap-2">
          <div className="grid min-w-0 flex-1 gap-1.5 rounded-2xl border border-white/[0.24] bg-white/[0.12] px-4 py-3.5 text-white backdrop-blur-[16px] backdrop-saturate-[1.2]">
            <div className="flex items-center justify-between gap-2.5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={template.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3, ease }}
                  className="text-[15px] font-semibold leading-[1.2] tracking-[-0.02em]"
                >
                  {template.name} template
                </motion.p>
              </AnimatePresence>
              <button
                type="button"
                aria-pressed={paused}
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                onClick={() => setPaused((value) => !value)}
                className={`${glassButton} h-7 w-7 shrink-0 border-white/30 hover:border-white/50 hover:bg-white/20`}
              >
                {paused ? <Play aria-hidden="true" className="h-3 w-3 fill-current" /> : <Pause aria-hidden="true" className="h-3 w-3 fill-current" />}
              </button>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: reducedMotion ? 0 : 0.3, ease }}
                className="grid gap-1.5"
              >
                <p aria-live="polite" className="text-[13.5px] leading-[1.45] text-white/[0.86]">{template.description.split(". ")[0]}.</p>
                <p className="text-xs tabular-nums text-white/[0.66]">
                  {template.tagline} · shown with {demoPortfolioData.name}&apos;s example · {index + 1} of {templates.length}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="grid shrink-0 gap-2">
            <button type="button" aria-label="Next template" onClick={() => go(1)} className={`${glassButton} h-10 w-10 border-white/[0.32] bg-white/[0.08] backdrop-blur-[10px] hover:border-white/50 hover:bg-white/20 active:scale-[.92]`}>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Previous template" onClick={() => go(-1)} className={`${glassButton} h-10 w-10 border-white/[0.32] bg-white/[0.08] backdrop-blur-[10px] hover:border-white/50 hover:bg-white/20 active:scale-[.92]`}>
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

