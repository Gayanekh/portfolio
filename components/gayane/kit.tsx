"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { WORKS } from "@/components/gayane/content";
import { focusRing } from "@/components/template-landing/ui";
import useFinePointer from "@/components/template-landing/useFinePointer";

// The parts /gayane-khachatryan is built from, after the Kyne reference (the user
// asked for its design and all its motion): a dark page, large uppercase Space
// Grotesk headings, one accent colour (Gayane's orange) and these motions, measured
// from the reference: on load, blocks rise 60px into place over 1.3s; boxes settle up
// and grow from 95% as they come into view; pictures settle from 120% as they enter;
// section titles spell themselves in letter by letter with the scroll; rows of cards
// sharpen and grow into place with the scroll; a dot follows the pointer.
// The page's side margin, and the content's frame: at most 1600px wide plus the margins, centred, as in the reference.
export const gutter = "px-[clamp(1rem,1.67vw,1.5rem)]";
export const frame = `mx-auto w-full max-w-[1648px] ${gutter}`;
export const display = "font-[family-name:var(--gk-display)]";
export const link = `${focusRing} rounded-[2px] text-[var(--fg)] no-underline transition-colors duration-200 hover:text-[var(--accent)]`;
export const button = `${focusRing} inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-[8px] border-0 bg-[var(--accent)] px-[1.4375rem] text-[1.25rem] uppercase tracking-normal text-[#16171a] no-underline transition-colors duration-200 hover:bg-[#d8f99a]`;

export const type = {
  hero: `${display} m-0 text-[length:clamp(4.5rem,12.5vw,11.25rem)] font-medium uppercase leading-none tracking-[-0.001em]`,
  heading: `${display} m-0 text-[length:clamp(3rem,7.6vw,6.875rem)] font-medium leading-[1.1] tracking-[-0.01em]`,
  title: `${display} m-0 text-[length:clamp(1.75rem,2.8vw,2.5rem)] font-medium uppercase leading-[1.3]`,
  name: "m-0 text-[length:clamp(1.375rem,1.95vw,1.75rem)] leading-[1.3] tracking-[-0.03em]",
  body: "text-[length:clamp(1rem,1.1vw,1.125rem)] leading-[1.55] tracking-[-0.01em]",
  small: "text-[1rem] leading-[1.5]",
};

const still = { duration: 0 };

// Rises 60px into place on load (the reference's 1.3s spring).
export function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, transform: "translateY(60px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ type: "spring", duration: 1.32, bounce: 0, delay, ...(reduced && { transform: still }) }} className={className}>
      {children}
    </motion.div>
  );
}

// Settles up 30px and grows from 95% when it comes into view.
export function Pop({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, transform: "translateY(30px) scale(0.95)" }} whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }} viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.8, ease: [0.12, 0.23, 0.5, 1], delay, ...(reduced && { transform: still }) }} className={className}>
      {children}
    </motion.div>
  );
}

// A picture's contents, settling from 120% as they come into view.
export function Zoom({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.span initial={{ transform: "scale(1.2)" }} whileInView={{ transform: "scale(1)" }} viewport={{ once: true, margin: "0px 0px -6% 0px" }} transition={reduced ? still : { duration: 1.5, ease: [0.44, 0, 0.56, 1] }} className="absolute inset-0 block">
      {children}
    </motion.span>
  );
}

// A heading spelled in letter by letter as it scrolls into view (globals.css, .gk-letter),
// each word kept whole; `accent` words are in the accent colour.
export function Letters({ text, accent = [] }: { text: string; accent?: string[] }) {
  let i = 0;
  return (
    <span aria-label={text} role="text" className="block">
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden="true" className={`inline-block whitespace-nowrap ${accent.includes(word) ? "text-[var(--accent)]" : ""}`}>
          {[...word].map((letter, l) => (
            <span key={l} className="gk-letter" style={{ "--i": i++ } as React.CSSProperties}>
              {letter}
            </span>
          ))}
          {w < text.split(" ").length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

// The dot that follows the pointer, on screens with a mouse.
export function CursorDot() {
  const mouse = useFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(-40);
  const y = useMotionValue(-40);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  useEffect(() => {
    if (!mouse || reduced) return;
    const move = (event: globalThis.PointerEvent) => {
      x.set(event.clientX - 8);
      y.set(event.clientY - 8);
    };
    const leave = () => {
      x.set(-40);
      y.set(-40);
    };
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [mouse, reduced, x, y]);
  if (!mouse || reduced) return null;
  return <motion.span aria-hidden="true" style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[70] block size-4 rounded-full bg-white mix-blend-difference" />;
}

// A circle of "View project" turning around itself, following the pointer over a project.
function ViewBadge({ x, y, shown }: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring>; shown: boolean }) {
  return (
    <motion.span aria-hidden="true" style={{ x, y }} initial={false} animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.6 }} transition={{ duration: 0.3 }} className="pointer-events-none absolute left-0 top-0 z-10 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--accent)] text-[#16171a]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_9s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="gk-badge" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <text className="fill-current text-[10px] uppercase">
          <textPath href="#gk-badge" textLength="224" lengthAdjust="spacing">
            View project · View project ·
          </textPath>
        </text>
      </svg>
      <span className="text-[1.25rem]">↗</span>
    </motion.span>
  );
}

// A project: its picture (settling in) or, without one, its name on a dark panel; under
// it the name, the category and the year. A linked one shows the turning badge under
// the pointer.
export function WorkCard({ work }: { work: (typeof WORKS)[number] }) {
  const mouse = useFinePointer();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 300, damping: 30 });
  const y = useSpring(py, { stiffness: 300, damping: 30 });
  const shown = useMotionValue(0);
  const onMove = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    px.set(event.clientX - box.left);
    py.set(event.clientY - box.top);
  };
  const panel = (
    <span className="relative block aspect-[4/3] overflow-hidden rounded-[8px] bg-[var(--card)]">
      <Zoom>
        {work.image ? (
          <Image src={work.image} alt={`${work.name}: ${work.category}`} fill sizes="(min-width: 1024px) 48vw, 92vw" className="object-cover object-top" />
        ) : (
          <span className="absolute inset-0 flex flex-col justify-between p-[clamp(1.25rem,2.4vw,2.25rem)]">
            <span className={`text-[var(--dim)] ${type.small}`}>{work.tags}</span>
            <span className={`${display} text-[length:clamp(2.5rem,5.2vw,4.75rem)] font-medium uppercase leading-[0.95] tracking-[-0.02em]`}>{work.name}</span>
          </span>
        )}
      </Zoom>
      {work.href && mouse && <BadgeHost x={x} y={y} shown={shown} />}
    </span>
  );
  const caption = (
    <span className="mt-6 block">
      <span className={`block ${type.name}`}>{work.name}</span>
      <span className={`mt-2 flex justify-between gap-6 text-[var(--dim)] ${type.small}`}>
        <span>{work.category}</span>
        <span>{work.year}</span>
      </span>
    </span>
  );
  return (
    <Pop>
      <article>
        {work.href ? (
          <a href={work.href} target="_blank" rel="noopener noreferrer" onPointerMove={onMove} onPointerEnter={() => shown.set(1)} onPointerLeave={() => shown.set(0)} className={`${focusRing} block rounded-[8px] text-[var(--fg)] no-underline`}>
            {panel}
            {caption}
          </a>
        ) : (
          <div>
            {panel}
            {caption}
          </div>
        )}
      </article>
    </Pop>
  );
}

// The badge reads whether it is shown from a motion value, so following the pointer never re-renders the card.
function BadgeHost({ x, y, shown }: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring>; shown: ReturnType<typeof useMotionValue<number>> }) {
  const opacity = useSpring(shown, { stiffness: 400, damping: 35 });
  return (
    <motion.span aria-hidden="true" style={{ opacity }} className="pointer-events-none absolute inset-0 block">
      <ViewBadge x={x} y={y} shown />
    </motion.span>
  );
}

// A card's corner button: an accent square with a + that turns into a −.
export function PlusSquare({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative grid size-8 shrink-0 place-items-center rounded-[4px] bg-[var(--accent)] text-[#16171a]">
      <span className="absolute h-[1.5px] w-4 bg-current" />
      <span className={`absolute h-4 w-[1.5px] bg-current transition-transform duration-300 ${open ? "scale-y-0" : ""}`} />
    </span>
  );
}

// Gayane's photo (public/avatar.png).
export const AVATAR = "/avatar.png";

// "Connect with Gayane": her photo, the name, role and a link to write.
export function ConnectCard({ className = "" }: { className?: string }) {
  return (
    <div className={`flex w-full max-w-[26rem] gap-4 rounded-[8px] bg-[#101010] p-3 ${className}`}>
      <span className="relative block aspect-[139/127] w-[8.6875rem] shrink-0 overflow-hidden rounded-[8px]">
        <Image src={AVATAR} alt="Gayane Khachatryan" fill sizes="136px" className="object-cover object-[50%_30%]" />
      </span>
      <span className="flex min-w-0 flex-col justify-between py-1">
        <span>
          <span className="block text-[1.5rem] font-semibold leading-tight tracking-[-0.03em]">Connect with Gayane</span>
          <span className={`mt-1 block text-[var(--dim)] ${type.small}`}>Senior Product Designer</span>
        </span>
        <Link href="/gayane-khachatryan/contact" className={`${link} mt-3 text-[1.25rem] uppercase tracking-[-0.04em] !text-[var(--accent)] underline underline-offset-4 hover:!text-[var(--fg)]`}>
          Write to me
        </Link>
      </span>
    </div>
  );
}
