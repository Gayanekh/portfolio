"use client";

import { motion, useReducedMotion } from "framer-motion";

// A small round badge: text set around a circle, turning slowly, with a dot
// at its centre. With reduced motion it stays still.
export default function AuthBadge({ text, className = "" }: { text: string; className?: string }) {
  const reducedMotion = useReducedMotion();
  // The circle's id, made from the text (not useId), so it is the same in the
  // server's HTML and the browser, and differs between badges on a page.
  const circleId = `auth-badge-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

  return (
    <span aria-hidden="true" className={`relative grid size-[4.5rem] shrink-0 place-items-center ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        {...(reducedMotion ? {} : { animate: { rotate: 360 }, transition: { duration: 18, ease: "linear" as const, repeat: Infinity } })}
      >
        <defs>
          <path id={circleId} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <text className="fill-foreground text-[0.7188rem] uppercase tracking-[0.18em]">
          <textPath href={`#${circleId}`}>{text}</textPath>
        </text>
      </motion.svg>
      <span className="size-2.5 rounded-full border border-foreground" />
    </span>
  );
}
