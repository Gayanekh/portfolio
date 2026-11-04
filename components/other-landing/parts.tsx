"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { buttonArrow, buttons, colors, ease, serif, type } from "@/components/other-landing/ui";

// A line with its *starred* words in the serif italic, as /template-landing sets them.
export function Dim({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") ? (
          <span key={i} className={`${serif} tracking-[-0.03em]`}>
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

// A section's small uppercase label, after a little square.
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`m-0 flex items-center gap-2.5 ${type.label} ${colors.body} ${className}`}>
      <span aria-hidden="true" className="size-1.5 bg-[#4a4a4a]" />
      {children}
    </p>
  );
}

// A section's label over its heading; a heading of several lines breaks
// where the reference breaks it.
export function Heading({ label, lines, center = false, id }: { label: string; lines: string | readonly string[]; center?: boolean; id?: string }) {
  const all = typeof lines === "string" ? [lines] : lines;
  return (
    <div className={`flex flex-col gap-[clamp(0.75rem,1vw,1rem)] ${center ? "items-center text-center" : ""}`}>
      <Label>{label}</Label>
      <h2 id={id} className={type.heading}>
        {all.map((line, i) => (
          <span key={i} className="block">
            <Dim text={line} />
          </span>
        ))}
      </h2>
    </div>
  );
}

export function Button({ href, label, tone = "dark", newTab = false }: { href: string; label: string; tone?: keyof typeof buttons; newTab?: boolean }) {
  return (
    <Link href={href} className={buttons[tone]} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
      <MoveRight aria-hidden="true" className={buttonArrow} />
    </Link>
  );
}

// Lines that rise out of their masks together, one a moment after the other,
// the first time they come into view (/template-landing's title reveal).
export function MaskLines({ lines }: { lines: readonly string[] }) {
  const still = useReducedMotion();
  return (
    <motion.span initial={still ? false : "hidden"} whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="block">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span variants={{ hidden: { y: "105%" }, shown: { y: "0%", transition: { duration: 1, ease, delay: i * 0.08 } } }} className="block">
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// Rises into place the first time it scrolls into view, a moment after the
// block before it (`order`).
export function Reveal({ children, order = 0, className = "" }: { children: ReactNode; order?: number; className?: string }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease, delay: order * 0.08 }}
    >
      {children}
    </motion.div>
  );
}
