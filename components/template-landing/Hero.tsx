"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import { HERO, TEMPLATES_ALL } from "@/components/template-landing/content";
import { useStill } from "@/components/template-landing/scroll-fx";
import { arrow, arrowLink, dots, ease, focusRing, frame, grid, type } from "@/components/template-landing/ui";

const COUNT = TEMPLATES_ALL.length;
// How long each template stays: slowly by itself, quickly while pointed at.
const CALM_MS = 3800;
const QUICK_MS = 750;

// A giant word, its letters rising one after another.
function Word({ text, delay }: { text: string; delay: number }) {
  return (
    <span aria-hidden="true" className="-mb-[0.08em] block overflow-hidden pb-[0.08em] pr-[0.04em]">
      {Array.from(text).map((letter, i) => (
        <motion.span key={i} className="inline-block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: delay + i * 0.05 }}>
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

// The hero, after the Moire reference: in the grid's two middle columns,
// "YOUR" at the top left with a small note at the far right of its foot,
// then a wide window onto the real templates spanning both columns (a
// vertical "hover" hint at its lower left), then "WORK" and, under it, the
// headline's line with Get started, See the templates and a way to log in.
// Fields of halftone dots fade in from the outer columns. The page's own
// grid lines run behind it, unchanged.
// The window opens from its middle, then shows one template after another,
// crossfading; pointed at, it flips through them quickly, naming each.
// Scrolling away pulls the title apart: "YOUR" slides off to the left,
// "WORK" to the right, the window sinks a little and the line below lifts
// away faster than the page.
export default function Hero() {
  const still = useStill();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const room = TEMPLATES_ALL[index];
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const span = (to: number) => (still ? [0, 0] : [0, to]);
  const topX = useTransform(scrollYProgress, [0, 1], span(-45).map((v) => `${v}%`));
  const bottomX = useTransform(scrollYProgress, [0, 1], span(45).map((v) => `${v}%`));
  const sink = useTransform(scrollYProgress, [0, 1], span(90));
  const lift = useTransform(scrollYProgress, [0, 1], span(-160));

  useEffect(() => {
    if (still) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % COUNT), hovered ? QUICK_MS : CALM_MS);
    return () => window.clearTimeout(timer);
  }, [index, hovered, still]);

  return (
    <section ref={sectionRef} data-caption="top" aria-label="Introduction" className="relative flex min-h-svh flex-col justify-center pb-[clamp(3rem,8vh,5rem)] pt-[6.5rem]">
      {/* The halftone fields in the outer columns, fading towards the middle. */}
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 hidden lg:block ${frame}`}>
        <div className={`h-full ${grid}`}>
          <span className={`${dots} [mask-image:radial-gradient(ellipse_90%_60%_at_15%_60%,#000,transparent_75%)]`} />
          <span className="col-span-2" />
          <span className={`${dots} [mask-image:radial-gradient(ellipse_90%_60%_at_85%_45%,#000,transparent_75%)]`} />
        </div>
      </div>

      <div className={`relative ${frame} ${grid}`}>
        <div className="@container relative lg:col-span-2 lg:col-start-2">
          <h1 aria-label={HERO.title} className={`m-0 ${type.giant}`}>
            {/* "YOUR", and the note at the far right of its foot. */}
            <span className="flex items-end justify-between gap-4">
              <motion.span style={{ x: topX }} className="block">
                <Word text={HERO.top} delay={0.1} />
              </motion.span>
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.7 }}
                className="mb-[0.6cqi] hidden whitespace-nowrap text-right text-[length:clamp(0.8125rem,1.6cqi,1rem)] font-medium normal-case tracking-normal sm:block"
              >
                {HERO.side}
              </motion.span>
            </span>

            {/* The window onto the templates, across both columns. */}
            <motion.span aria-hidden="true" style={{ y: sink }} className="relative my-[2.2cqi] block">
              <span className="absolute bottom-0 right-full hidden origin-bottom-right -translate-x-[0.9rem] items-center gap-1.5 whitespace-nowrap text-[0.75rem] font-semibold normal-case tracking-[0.04em] [writing-mode:vertical-rl] rotate-180 lg:flex">
                <Eye className="size-3.5 rotate-90" />
                {HERO.hover.toUpperCase()}
              </span>
              <motion.span
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.2, ease, delay: 0.35 }}
                className="relative block aspect-[1000/345] overflow-hidden bg-[var(--card)]"
              >
                <AnimatePresence initial={false}>
                  <motion.span
                    key={room.id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: hovered ? 0.35 : 1.1, ease }}
                    className="absolute inset-0"
                  >
                    <Image src={room.image} alt="" fill priority={index === 0} quality={90} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[center_30%]" />
                  </motion.span>
                </AnimatePresence>
                <span className={`absolute bottom-3 left-3 rounded-[4px] bg-[var(--bg)] px-2.5 py-1 text-[0.8125rem] font-medium normal-case tracking-normal text-[var(--fg)] transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
                  {room.name}
                </span>
              </motion.span>
            </motion.span>

            {/* "WORK". */}
            <motion.span style={{ x: bottomX }} className="block">
              <Word text={HERO.bottom} delay={0.45} />
            </motion.span>
          </h1>

          {/* The headline's line, then the ways in. */}
          <motion.div style={{ y: lift }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.9 }}
              className="mt-[1.4cqi] flex flex-col gap-[clamp(1rem,2.4cqi,1.5rem)]"
            >
              <p aria-hidden="true" className={`m-0 ${type.lead}`}>{HERO.title}</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link href={HERO.primary.href} className={`${arrowLink} text-[var(--fg)]`}>
                  {HERO.primary.label}
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className={arrow} />
                </Link>
                <a href={HERO.secondary.href} className={`${arrowLink} text-[var(--dim)] hover:text-[var(--fg)]`}>
                  {HERO.secondary.label}
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className={arrow} />
                </a>
                <p className={`m-0 ${type.small} text-[var(--dim)]`}>
                  {HERO.account.lead}{" "}
                  <Link href={HERO.account.href} className={`${focusRing} rounded-[4px] font-semibold text-[var(--fg)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:decoration-current`}>
                    {HERO.account.label}
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
