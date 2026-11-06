"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PERSON, type PROJECTS } from "@/components/gayane/content";
import { ease, focusRing } from "@/components/template-landing/ui";

// The parts every page of /gayane-khachatryan is built from, a mix of two references
// in Gayane's own colour. From Anri: the line down the middle with a dot travelling
// it as the page scrolls, the large light name, the framed portrait, work rows split
// into a picture and a bordered card, numbered points. From Maelle: columns that hold
// still while the other scrolls, fine dividing lines, and the motion: on load the words
// sharpen and rise one by one and the rest fades in; a picture settles from a slight
// zoom as it enters, and dims under the pointer; links change colour.
export const link = `${focusRing} rounded-[2px] text-[var(--fg)] no-underline transition-colors duration-200 hover:text-[var(--accent)]`;
export const hairline = "border-0 border-t border-solid border-[var(--line)]";
// The page's margins; on phones the left one leaves room for the line.
export const margins = "pl-8 pr-4 lg:px-[clamp(1.5rem,4.2vw,3.75rem)]";
export const halves = "lg:grid lg:grid-cols-2";
const leftPane = "pl-8 pr-4 lg:pl-[clamp(1.5rem,4.2vw,3.75rem)] lg:pr-[clamp(1.5rem,4.2vw,3.75rem)]";
const rightPane = "pl-8 pr-4 lg:pl-[clamp(1.5rem,4.2vw,3.75rem)] lg:pr-[clamp(1.5rem,4.2vw,3.75rem)]";

export const type = {
  title: "m-0 text-[length:clamp(2.75rem,5.4vw,5rem)] font-light leading-none tracking-[-0.04em]",
  section: "m-0 text-[length:clamp(2.25rem,4.2vw,3.75rem)] font-light leading-[1.05] tracking-[-0.035em]",
  statement: "m-0 text-[length:clamp(1.25rem,1.8vw,1.625rem)] font-normal leading-[1.2] tracking-[-0.025em]",
  heading: "m-0 text-[length:clamp(1.0625rem,calc(1rem_+_0.1vw),1.25rem)] font-normal tracking-[-0.02em]",
  label: "text-[0.9375rem] font-medium tracking-[-0.02em]",
  body: "text-[0.9375rem] leading-[1.5] tracking-[-0.005em]",
  small: "text-[0.875rem] tracking-[-0.01em]",
};

export const space = {
  section: "mt-[clamp(5rem,10vw,9rem)]",
};

// The half that holds still under the header on large screens, filling the screen.
export function StillHalf({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col justify-between gap-12 pb-10 pt-[clamp(2.5rem,6vw,5.5rem)] lg:sticky lg:top-11 lg:h-[calc(100svh_-_2.75rem)] lg:self-start lg:pb-8 ${leftPane} ${className}`}>{children}</div>;
}

// The half that scrolls.
export function FlowHalf({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`min-w-0 pt-[clamp(1rem,6vw,5.5rem)] ${rightPane} ${className}`}>{children}</div>;
}

export function Dot({ className = "size-2" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 rounded-full bg-[var(--accent)] ${className}`} />;
}

// Motion here animates `transform`, `opacity` and `filter` so the compositor runs it,
// and those skip Motion's reduced-motion handling, so movement and blur are stopped by hand.
const still = { duration: 0 };

// A line whose words sharpen and rise into place one by one, on load.
export function Words({ text, delay = 0, step = 0.02 }: { text: string; delay?: number; step?: number }) {
  const reduced = useReducedMotion();
  return text.split(" ").map((word, i) => (
    <span key={i}>
      {i > 0 && " "}
      <motion.span
        initial={{ opacity: 0, filter: "blur(5px)", transform: "translateY(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }}
        transition={{ type: "spring", duration: 0.6, bounce: 0, delay: delay + i * step, ...(reduced && { filter: still, transform: still }) }}
        className="inline-block"
      >
        {word}
      </motion.span>
    </span>
  ));
}

// Fades in on load.
export function Fade({ children, delay = 0, duration = 0.8, className }: { children: ReactNode; delay?: number; duration?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration, ease: [0.44, 0, 0.56, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
}

// A panel's contents, settling from a slight zoom each time they enter the screen.
function Settle({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.span initial={{ transform: "scale(1.03)" }} whileInView={{ transform: "scale(1)" }} viewport={{ margin: "0px 0px -4% 0px" }} transition={reduced ? still : { duration: 1.5, ease }} className="absolute inset-0 block transition-[filter] duration-500 group-hover:brightness-90">
      {children}
    </motion.span>
  );
}

// The big section title with its small accent note.
export function SectionTitle({ title, note, id }: { title: string; note?: string; id?: string }) {
  return (
    <div className="mb-[clamp(2rem,4vw,3.5rem)]">
      <h2 id={id} className={type.section}>
        {title}
      </h2>
      {note && <p className={`m-0 mt-2 text-[var(--accent)] ${type.body}`}>{note}</p>}
    </div>
  );
}

// A project: its picture on one side of the line, on the other a bordered card
// with its name, kind, year and line. Without a picture its name fills the panel.
export function ProjectRow({ project }: { project: (typeof PROJECTS)[number] }) {
  const content = (
    <span className={`relative z-10 block bg-[var(--bg)] ${halves}`}>
      <span className="relative block aspect-[4/3] overflow-hidden bg-[var(--panel)] [container-type:inline-size]">
        <Settle>
          {project.image ? (
            <span className="absolute inset-x-[8%] top-[9%] block aspect-[4/3] overflow-hidden rounded-t-[6px] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)]">
              <Image src={project.image} alt={`The ${project.name} home page`} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover object-top" />
            </span>
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[20cqw] font-light tracking-[-0.05em] text-[var(--fg)]">{project.name}</span>
          )}
        </Settle>
      </span>
      <span className="flex flex-col justify-end gap-3 border border-solid border-[var(--line)] p-[clamp(1rem,1.6vw,1.5rem)] max-lg:border-t-0 lg:border-l-0">
        <span className={`text-[var(--fg)] ${type.heading}`}>{project.name}</span>
        <span className={`text-[var(--dim)] ${type.body}`}>{project.kind}</span>
        <span className={`text-[var(--accent)] ${type.body}`}>{project.year}</span>
        <span className={`max-w-[28rem] text-[var(--dim)] ${type.body}`}>{project.line}</span>
      </span>
    </span>
  );
  return (
    <article>
      {project.href ? (
        <a href={project.href} target="_blank" rel="noopener noreferrer" className={`${focusRing} group block no-underline`}>
          {content}
        </a>
      ) : (
        <div className="group">{content}</div>
      )}
    </article>
  );
}

// Gayane's email and LinkedIn.
export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-1.5 ${type.label} ${className}`}>
      <a href={`mailto:${PERSON.email}`} className={`${link} break-all text-[1rem]`}>
        {PERSON.email}
      </a>
      <a href={PERSON.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
        LinkedIn
      </a>
    </div>
  );
}

// The framed portrait with the status under it: a monogram in the photo's place, until there is a photo.
export function Portrait({ className = "" }: { className?: string }) {
  return (
    <figure className={`m-0 border border-solid border-[var(--line)] bg-[var(--bg)] p-2.5 ${className}`}>
      <div aria-hidden="true" className="grid aspect-[4/5] place-items-center bg-[var(--fg)] text-[length:clamp(2.25rem,3.6vw,3.25rem)] font-light tracking-[-0.05em] text-white">
        GK
      </div>
      <figcaption className={`mt-2.5 flex items-center gap-2 leading-[1.25] text-[var(--dim)] ${type.small}`}>
        <Dot className="size-2" />
        {PERSON.status}
      </figcaption>
    </figure>
  );
}

// A numbered point, the number in the accent colour.
export function Numbered({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className={`flex gap-2.5 ${type.body}`}>
      <span className="w-6 shrink-0 text-[var(--accent)]">#{n}</span>
      <span>{children}</span>
    </li>
  );
}
