"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FieldPicture } from "../../core/blocks";
import { useField, useSectionId, useTemplate } from "../../core/context";
import { CountUp } from "../panel-kit";
import { useScrollProgress } from "../nocturne/kit";
import { ease, FieldValue, Head, In, pad, side, Title, type } from "./kit";

// The Signature (Minimal) template's first sections, to the right of the
// pinned profile panel: the introduction, About and the projects.

/* ---------- Intro ---------- */

// The opening statement, as tall as the screen: a greeting, the statement
// in large type (its *marked* words in the accent with a hand-drawn swash),
// a few words and two buttons; beside it a fan of three recent pieces that
// spreads open when pointed at.
//
// Its section's fields: `hello`, `statement`, `text`, `primary`, `secondary`,
// `fan1Image`...

const FAN = [
  { rest: { rotate: -10, x: "-18%", y: "6%" }, open: { rotate: -16, x: "-55%", y: "-2%" } },
  { rest: { rotate: 2, x: "0%", y: "0%" }, open: { rotate: 0, x: "0%", y: "-10%" } },
  { rest: { rotate: 12, x: "18%", y: "8%" }, open: { rotate: 17, x: "55%", y: "2%" } },
];

export function Intro({ fan, workTarget, contactTarget }: { fan: number[]; workTarget: string; contactTarget: string }) {
  const id = useSectionId();
  const { navigate } = useTemplate();
  const still = Boolean(useReducedMotion());
  const [open, setOpen] = useState(false);
  return (
    <section data-section={id} className={`relative overflow-x-clip bg-card text-foreground ${side}`}>
      <div className={`flex min-h-0 flex-col justify-center gap-12 py-20 @4xl:min-h-[100svh] @4xl:py-16 ${pad}`}>
        <In>
          <span className="inline-flex items-center gap-2 rounded-full border border-solid border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em]">
            <motion.span animate={still ? undefined : { rotate: [0, 18, -8, 18, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.4 }} className="inline-block origin-[70%_70%]">
              👋
            </motion.span>
            <FieldValue field="hello" />
          </span>
        </In>
        <Title field="statement" as="h2" className="max-w-[18ch] font-display text-[length:clamp(2.3rem,5cqw,5rem)] font-bold leading-[1] tracking-[-0.05em]" />
        <div className="flex flex-col gap-10 @2xl:flex-row @2xl:items-end @2xl:justify-between">
          <div className="flex max-w-[26rem] flex-col gap-6">
            <In delay={0.2}>
              <p className={`m-0 ${type.body}`}>
                <FieldValue field="text" />
              </p>
            </In>
            <In delay={0.3} className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(workTarget)}
                className="group/b inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-foreground px-5 py-3 text-[14px] font-medium text-card transition-colors duration-300 hover:bg-primary"
              >
                <FieldValue field="primary" />
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/b:translate-x-1" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => navigate(contactTarget)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-solid border-foreground/20 bg-transparent px-5 py-3 text-[14px] font-medium text-foreground transition-colors duration-300 hover:border-foreground"
              >
                <FieldValue field="secondary" />
              </button>
            </In>
          </div>
          {/* The fan of recent pieces */}
          <In delay={0.35} className="self-center @2xl:self-end">
            <div
              onPointerEnter={() => setOpen(true)}
              onPointerLeave={() => setOpen(false)}
              className="relative mx-[clamp(5rem,9cqw,8rem)] h-[clamp(10rem,16cqw,14rem)] w-[clamp(7.5rem,12cqw,10.5rem)]"
            >
              {fan.map((n, i) => {
                const card = FAN[i % FAN.length];
                return (
                  <motion.div
                    key={n}
                    initial={still ? false : { opacity: 0, y: 40, rotate: 0 }}
                    animate={{ opacity: 1, ...(open && !still ? card.open : card.rest) }}
                    transition={{ duration: 0.8, ease, delay: open ? i * 0.04 : 0.5 + i * 0.1 }}
                    className={`absolute inset-0 overflow-hidden rounded-xl border-[3px] border-solid border-card shadow-[0_20px_40px_-18px_rgb(0_0_0/0.45)] ${i === 1 ? "z-10" : ""}`}
                  >
                    <FieldPicture field={`fan${n}Image`} className="absolute inset-0 block h-full w-full object-cover" />
                  </motion.div>
                );
              })}
            </div>
          </In>
        </div>
      </div>
    </section>
  );
}

/* ---------- About ---------- */

// About: the label and title, the bio beside a studio photograph that drifts
// slower than the page, then four figures counting up.
//
// Its section's fields: `label`, `title`, `body`, `body2`, `image`,
// `stat1Value`, `stat1Label`...

export function About({ stats }: { stats: number[] }) {
  const id = useSectionId();
  const { edit } = useTemplate();
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref);
  const y = useTransform(progress, [0, 1], still || edit ? ["0%", "0%"] : ["-10%", "10%"]);
  return (
    <section data-section={id} className={`relative scroll-mt-4 bg-card text-foreground ${side}`}>
      <div ref={ref} className={`py-20 @4xl:py-28 ${pad}`}>
        <Head label="label" title="title" />
        <div className="grid grid-cols-1 gap-10 @2xl:grid-cols-[1.1fr_0.9fr] @2xl:gap-[6%]">
          <div className="flex flex-col gap-5">
            <In>
              <p className="m-0 font-display text-[length:clamp(1.25rem,1.9cqw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em]">
                <FieldValue field="body" />
              </p>
            </In>
            <In delay={0.1}>
              <p className={`m-0 ${type.body}`}>
                <FieldValue field="body2" />
              </p>
            </In>
          </div>
          <In delay={0.15} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground/5">
            <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
              <FieldPicture field="image" className="absolute inset-0 block h-full w-full object-cover" />
            </motion.div>
          </In>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-solid border-border bg-border @2xl:grid-cols-4">
          {stats.map((n, i) => (
            <In key={n} delay={i * 0.08} y={14} className="flex flex-col gap-2 bg-card p-5 @4xl:p-6">
              <CountUp field={`stat${n}Value`} className="font-display text-[length:clamp(2.2rem,3.6cqw,3.4rem)] font-bold leading-none tracking-[-0.05em]" />
              <span className="text-[13px] leading-snug text-muted-foreground">
                <FieldValue field={`stat${n}Label`} />
              </span>
            </In>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */

// The projects in two columns, the second set lower so they interlock; each
// card's picture zooms when pointed at and a round "View project" follows the
// pointer over it; under it, its name, discipline and year.
//
// Its section's fields: `label`, `title`, `intro`, `viewLabel`, and for each
// project (`project1`...): Title, Category, Year, Image and Url.

function ProjectCard({ n, index }: { n: number; index: number }) {
  const { edit } = useTemplate();
  const url = useField(`project${n}Url`).value;
  const title = useField(`project${n}Title`).value;
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 320, damping: 28 });
  const sy = useSpring(cy, { stiffness: 320, damping: 28 });
  const [over, setOver] = useState(false);
  return (
    <In delay={(index % 2) * 0.12} className={index % 2 === 1 ? "@2xl:mt-20" : undefined}>
      <article
        onPointerMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          cx.set(event.clientX - box.left);
          cy.set(event.clientY - box.top);
        }}
        onPointerEnter={() => setOver(true)}
        onPointerLeave={() => setOver(false)}
        className="group/project relative flex flex-col gap-4"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground/5">
          <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:scale-[1.06]">
            <FieldPicture field={`project${n}Image`} alt={title} className="absolute inset-0 block h-full w-full object-cover" />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-card/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground backdrop-blur-md">
            <FieldValue field={`project${n}Category`} />
          </span>
          {!edit && (
            <motion.span
              aria-hidden="true"
              style={{ x: sx, y: sy }}
              animate={{ scale: over ? 1 : 0, opacity: over ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute -left-[2.75rem] -top-[2.75rem] grid size-[5.5rem] place-items-center rounded-full bg-primary text-center font-mono text-[10px] uppercase leading-tight tracking-[0.1em] text-card"
            >
              <FieldValue field="viewLabel" />
            </motion.span>
          )}
        </div>
        <div className="flex items-start justify-between gap-4">
          <h3 className={`m-0 ${type.name}`}>
            <a href={edit ? undefined : url || undefined} target="_blank" rel="noreferrer" className="text-foreground no-underline after:absolute after:inset-0">
              <FieldValue field={`project${n}Title`} />
            </a>
          </h3>
          <span className="flex shrink-0 items-center gap-2 pt-1 font-mono text-[12px] text-muted-foreground">
            <FieldValue field={`project${n}Year`} />
            <ArrowUpRight className="size-4 text-foreground transition-transform duration-500 group-hover/project:-translate-y-0.5 group-hover/project:translate-x-0.5 group-hover/project:text-primary" strokeWidth={1.75} />
          </span>
        </div>
      </article>
    </In>
  );
}

export function Projects({ projects }: { projects: number[] }) {
  const id = useSectionId();
  return (
    <section data-section={id} className={`relative scroll-mt-4 bg-card text-foreground ${side}`}>
      <div className={`py-20 @4xl:py-28 ${pad}`}>
        <Head label="label" title="title" intro="intro" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 @2xl:grid-cols-2">
          {projects.map((n, i) => (
            <ProjectCard key={n} n={n} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
