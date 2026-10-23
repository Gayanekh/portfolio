"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

// A small round badge: text set around a circle, turning slowly, with a dot
// at its centre. With reduced motion it stays still.
export default function AuthBadge({ text, className = "" }: { text: string; className?: string }) {
  const reducedMotion = useReducedMotion();
  const circleId = useId();

  return (
    <span aria-hidden="true" className={`relative grid size-[72px] shrink-0 place-items-center ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        {...(reducedMotion ? {} : { animate: { rotate: 360 }, transition: { duration: 18, ease: "linear" as const, repeat: Infinity } })}
      >
        <defs>
          <path id={circleId} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <text className="fill-foreground text-[11.5px] uppercase tracking-[0.18em]">
          <textPath href={`#${circleId}`}>{text}</textPath>
        </text>
      </motion.svg>
      <span className="size-2.5 rounded-full border border-foreground" />
    </span>
  );
}
