"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy, Plus, Star } from "lucide-react";
import { FieldPicture } from "../../core/blocks";
import { readField } from "../../core/content";
import { useField, useSectionId, useTemplate } from "../../core/context";
import { plainText } from "../../core/rich-format";
import { pageSections } from "../panel-kit";
import { Magnetic, useScrollProgress } from "../nocturne/kit";
import { ease, FieldValue, Head, In, pad, side, soft, type } from "./kit";

// The Signature (Minimal) template's later sections, to the right of the
// pinned profile panel: services, stack, experience, awards, testimonials and
// contact.

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const id = useSectionId();
  return (
    <section data-section={id} className={`relative scroll-mt-4 bg-card text-foreground ${side} ${className}`}>
      <div className={`py-20 @4xl:py-28 ${pad}`}>{children}</div>
    </section>
  );
}

/* ---------- Services ---------- */

// The services as rows that open one at a time (the first open to begin
// with): a number, the name, and a plus turning into a cross; opened, a few
// words and what it covers as chips, one after another. While editing all
// are open.
//
// Its section's fields: `label`, `title`, `intro`, and for each service
// (`service1`...): Name, Text, and Item1...

export function Services({ services, items }: { services: number[]; items: number[] }) {
  const { content, edit } = useTemplate();
  const section = useSectionId();
  const [open, setOpen] = useState(0);
  const still = useReducedMotion();
  return (
    <Frame>
      <Head label="label" title="title" intro="intro" />
      <ul className="m-0 list-none border-0 border-t border-solid border-border p-0">
        {services.map((n, i) => {
          const shown = Boolean(edit) || open === i;
          const list = items.filter((m) => plainText(readField(content, section, `service${n}Item${m}`)));
          return (
            <li key={n} className="border-0 border-b border-solid border-border">
              <In delay={i * 0.08} y={12}>
                <button
                  type="button"
                  aria-expanded={shown}
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="group/service flex w-full cursor-pointer items-center gap-5 border-0 bg-transparent py-6 text-left text-foreground @4xl:py-8"
                >
                  <span className="w-8 font-mono text-[12px] text-muted-foreground">0{i + 1}</span>
                  <span className={`flex-1 font-display text-[length:clamp(1.6rem,3cqw,2.8rem)] font-bold leading-none tracking-[-0.045em] transition-colors duration-300 ${shown ? "text-primary" : "group-hover/service:text-primary"}`}>
                    <FieldValue field={`service${n}Name`} />
                  </span>
                  <motion.span animate={{ rotate: shown ? 135 : 0 }} transition={{ duration: 0.5, ease }} className={`grid size-10 shrink-0 place-items-center rounded-full border border-solid ${shown ? "border-primary bg-primary text-card" : "border-border"}`}>
                    <Plus className="size-4" strokeWidth={1.75} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {shown && (
                    <motion.div
                      initial={still ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: soft }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-5 pb-8 pl-[3.25rem] @2xl:flex-row @2xl:items-start @2xl:justify-between @2xl:gap-10">
                        <p className={`m-0 max-w-[24rem] ${type.body}`}>
                          <FieldValue field={`service${n}Text`} />
                        </p>
                        <div className="flex flex-wrap gap-2 @2xl:max-w-[24rem] @2xl:justify-end">
                          {list.map((m, j) => (
                            <motion.span
                              key={m}
                              initial={still ? false : { opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.5, ease, delay: 0.15 + j * 0.05 }}
                              className="rounded-full border border-solid border-border bg-foreground/[0.03] px-3.5 py-1.5 text-[13px]"
                            >
                              <FieldValue field={`service${n}Item${m}`} />
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </In>
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}

/* ---------- Stack ---------- */

// The tools, as tiles: a square with the tool's initials (turning to the
// accent and turning a little when pointed at), its name and what it is used
// for.
//
// Its section's fields: `label`, `title`, and for each tool (`tool1`...):
// Name and Use.

export function Stack({ tools }: { tools: number[] }) {
  const { content } = useTemplate();
  const section = useSectionId();
  const initials = (n: number) =>
    plainText(readField(content, section, `tool${n}Name`))
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2);
  return (
    <Frame>
      <Head label="label" title="title" />
      <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @6xl:grid-cols-3">
        {tools.map((n, i) => (
          <In key={n} delay={(i % 3) * 0.07} y={14}>
            <div className="group/tool flex items-center gap-4 rounded-2xl border border-solid border-border p-4 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-foreground font-display text-[15px] font-bold text-card transition-[background-color,transform] duration-500 group-hover/tool:-rotate-6 group-hover/tool:bg-primary">
                {initials(n)}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold">
                  <FieldValue field={`tool${n}Name`} />
                </span>
                <span className="text-[13px] text-muted-foreground">
                  <FieldValue field={`tool${n}Use`} />
                </span>
              </span>
            </div>
          </In>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- Experience ---------- */

// The roles on a timeline whose line fills as the page scrolls through it, a
// dot on each role turning to the accent as the line reaches it.
//
// Its section's fields: `label`, `title`, and for each role (`job1`...):
// Role, Company, Years and Text.

export function Experience({ jobs }: { jobs: number[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const progress = useScrollProgress(ref);
  const still = useReducedMotion();
  const fill = useTransform(progress, [0.15, 0.75], [still ? 1 : 0, 1]);
  return (
    <Frame>
      <Head label="label" title="title" />
      <ol ref={ref} className="relative m-0 list-none p-0 pl-8">
        <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-border" />
        <motion.span aria-hidden="true" style={{ scaleY: fill }} className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-primary" />
        {jobs.map((n, i) => (
          <li key={n} className="relative pb-10 last:pb-0">
            <motion.span
              aria-hidden="true"
              initial={still ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -30% 0px" }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="absolute -left-8 top-1.5 size-[11px] rounded-full border-2 border-solid border-card bg-primary shadow-[0_0_0_1px_var(--primary)]"
            />
            <In delay={i * 0.05} y={14} className="grid grid-cols-1 gap-2 @2xl:grid-cols-[9rem_1fr] @2xl:gap-6">
              <span className="pt-1 font-mono text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                <FieldValue field={`job${n}Years`} />
              </span>
              <span className="flex flex-col gap-1.5">
                <span className={type.name}>
                  <FieldValue field={`job${n}Role`} />
                </span>
                <span className="text-[14px] font-medium text-primary">
                  <FieldValue field={`job${n}Company`} />
                </span>
                <span className={`max-w-[34rem] ${type.muted}`}>
                  <FieldValue field={`job${n}Text`} />
                </span>
              </span>
            </In>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

/* ---------- Awards ---------- */

// The awards as rows; pointing at one floods it with ink from below, its
// words turning light and its arrow turning.
//
// Its section's fields: `label`, `title`, and for each award (`award1`...):
// Title, Org, Year and Url.

export function Awards({ awards }: { awards: number[] }) {
  const { edit, content } = useTemplate();
  const section = useSectionId();
  return (
    <Frame>
      <Head label="label" title="title" />
      <ul className="m-0 list-none overflow-hidden rounded-2xl border border-solid border-border p-0">
        {awards.map((n, i) => {
          const url = plainText(readField(content, section, `award${n}Url`));
          return (
            <li key={n} className="border-0 border-b border-solid border-border last:border-b-0">
              <In delay={i * 0.06} y={10}>
                <a
                  href={edit || !url ? undefined : url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/award relative grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 overflow-hidden px-5 py-5 text-foreground no-underline @2xl:grid-cols-[1.4fr_1fr_auto_auto]"
                >
                  <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/award:scale-y-100" />
                  <span className="relative text-[16px] font-semibold transition-colors duration-500 group-hover/award:text-card">
                    <FieldValue field={`award${n}Title`} />
                  </span>
                  <span className="relative col-start-1 row-start-2 text-[14px] text-muted-foreground transition-colors duration-500 group-hover/award:text-card/70 @2xl:col-start-auto @2xl:row-start-auto">
                    <FieldValue field={`award${n}Org`} />
                  </span>
                  <span className="relative hidden font-mono text-[12px] text-muted-foreground transition-colors duration-500 group-hover/award:text-card/70 @2xl:block">
                    <FieldValue field={`award${n}Year`} />
                  </span>
                  <span className="relative row-span-2 grid size-9 place-items-center rounded-full border border-solid border-border transition-all duration-500 group-hover/award:rotate-45 group-hover/award:border-primary group-hover/award:bg-primary group-hover/award:text-card @2xl:row-span-1">
                    <ArrowUpRight className="size-4" strokeWidth={1.75} />
                  </span>
                </a>
              </In>
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}

/* ---------- Testimonials ---------- */

// What clients say, as cards in a strip that can be dragged sideways (and
// flung); each card a quote, five stars, and the person.
//
// Its section's fields: `label`, `title`, `hint`, and for each quote
// (`quote1`...): Text, Name, Role and Image.

export function Voices({ quotes }: { quotes: number[] }) {
  const { edit } = useTemplate();
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (viewRef.current && trackRef.current) setLeft(Math.min(0, viewRef.current.clientWidth - trackRef.current.scrollWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewRef.current) observer.observe(viewRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <Frame className="overflow-hidden">
      <Head label="label" title="title" intro="hint" />
      <div ref={viewRef}>
        <motion.div
          ref={trackRef}
          drag={edit ? false : "x"}
          dragConstraints={{ left, right: 0 }}
          dragElastic={0.12}
          style={{ x }}
          className={`flex w-max gap-4 ${edit ? "" : "cursor-grab active:cursor-grabbing"}`}
        >
          {quotes.map((n, i) => (
            <In key={n} delay={i * 0.08} className="w-[min(82vw,22rem)] shrink-0 @4xl:w-[24rem]">
              <figure className={`m-0 flex h-full select-none flex-col justify-between gap-8 rounded-2xl p-6 ${i % 2 ? "bg-foreground text-card" : "border border-solid border-border bg-card"}`}>
                <div className="flex flex-col gap-4">
                  <span className="flex gap-0.5 text-primary">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="size-3.5 fill-current" />
                    ))}
                  </span>
                  <blockquote className="m-0 font-display text-[18px] font-medium leading-[1.4] tracking-[-0.015em]">
                    “<FieldValue field={`quote${n}Text`} />”
                  </blockquote>
                </div>
                <figcaption className="flex items-center gap-3">
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-foreground/10">
                    <FieldPicture field={`quote${n}Image`} className="pointer-events-none absolute inset-0 block h-full w-full object-cover" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[14px] font-semibold">
                      <FieldValue field={`quote${n}Name`} />
                    </span>
                    <span className={`text-[13px] ${i % 2 ? "text-card/60" : "text-muted-foreground"}`}>
                      <FieldValue field={`quote${n}Role`} />
                    </span>
                  </span>
                </figcaption>
              </figure>
            </In>
          ))}
        </motion.div>
      </div>
    </Frame>
  );
}

/* ---------- Contact ---------- */

// The last page: a huge line (its *marked* words with the swash), the email
// set large and pulled towards the pointer, a copy button, the phone and the
// places to follow; then the footer with Back to top.
//
// Its section's fields: `label`, `title`, `text`, `email`, `phone`,
// `primary`, `copy`, `copied`, `social1Label`, `social1Url`..., `copyright`,
// `top`.

export function Contact({ socials }: { socials: number[] }) {
  const { template, layout, edit, navigate } = useTemplate();
  const email = useField("email").value;
  const phone = useField("phone").value;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard refused: nothing to do.
    }
  };
  return (
    <Frame>
      <div className="flex flex-col gap-12">
        <Head label="label" title="title" />
        <In>
          <p className={`m-0 -mt-6 max-w-[30rem] ${type.body}`}>
            <FieldValue field="text" />
          </p>
        </In>
        <div className="relative overflow-hidden rounded-[26px] bg-primary p-6 text-card @4xl:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border border-solid border-card/25" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-6 size-60 rounded-full border border-solid border-card/20" />
          <div className="relative flex flex-col gap-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-card/70">Email</span>
            <Magnetic strength={0.15}>
              <a href={edit ? undefined : `mailto:${email}`} className="group/mail block font-display text-[length:clamp(1.6rem,4cqw,3.6rem)] font-bold leading-none tracking-[-0.045em] text-card no-underline [overflow-wrap:anywhere]">
                <FieldValue field="email" />
                <span className="ml-2 inline-block transition-transform duration-500 group-hover/mail:-translate-y-1 group-hover/mail:translate-x-1">↗</span>
              </a>
            </Magnetic>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={edit ? undefined : `mailto:${email}?subject=New%20project`}
                className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-[14px] font-semibold text-[color:var(--ink)] no-underline [--ink:var(--foreground)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <FieldValue field="primary" />
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </a>
              <button type="button" onClick={copy} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-solid border-card/40 bg-transparent px-4 py-3 text-[14px] text-card">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={copied ? "y" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease }} className="inline-flex items-center gap-2">
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    <FieldValue field={copied ? "copied" : "copy"} />
                  </motion.span>
                </AnimatePresence>
              </button>
              <a href={edit ? undefined : `tel:${phone.replace(/[^\d+]/g, "")}`} className="text-[14px] text-card/85 no-underline hover:text-card">
                <FieldValue field="phone" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {socials.map((n, i) => (
            <In key={n} delay={i * 0.06} y={10}>
              <SocialLink n={n} />
            </In>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-0 border-t border-solid border-border pt-6 @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <span className="text-[13px] text-muted-foreground">
            <FieldValue field="copyright" />
          </span>
          <button
            type="button"
            onClick={() => navigate(pageSections(template, layout)[0])}
            className="group/top inline-flex w-fit cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
          >
            <FieldValue field="top" />
            <span className="grid size-8 place-items-center rounded-full bg-foreground text-card transition-colors duration-300 group-hover/top:bg-primary">
              <ArrowUp className="size-3.5 transition-transform duration-300 group-hover/top:-translate-y-0.5" strokeWidth={2} />
            </span>
          </button>
        </div>
      </div>
    </Frame>
  );
}

function SocialLink({ n }: { n: number }) {
  const { edit } = useTemplate();
  const url = useField(`social${n}Url`).value;
  return (
    <a
      href={edit ? undefined : url || undefined}
      target="_blank"
      rel="noreferrer"
      className="group/social inline-flex items-center gap-2 rounded-full border border-solid border-border px-4 py-2.5 text-[14px] text-foreground no-underline transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-card"
    >
      <FieldValue field={`social${n}Label`} />
      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/social:rotate-45" strokeWidth={2} />
    </a>
  );
}

