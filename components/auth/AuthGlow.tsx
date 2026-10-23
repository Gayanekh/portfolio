"use client";

import { motion, useReducedMotion } from "framer-motion";

// Two large blurred glows behind the auth page, one cool grey and one warm
// gold, drifting slowly; with reduced motion they sit still.
export default function AuthGlow() {
  const reducedMotion = useReducedMotion();
  const drift = (x: number[], y: number[], duration: number) =>
    reducedMotion ? {} : { animate: { x, y }, transition: { duration, ease: "easeInOut" as const, repeat: Infinity, repeatType: "mirror" as const } };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.span
        className="absolute left-[2%] top-[4%] aspect-square w-[clamp(240px,30vw,440px)] rounded-full bg-[radial-gradient(closest-side,rgb(120_120_124/0.55),rgb(120_120_124/0))] blur-2xl"
        {...drift([0, 40, -10], [0, 30, 10], 18)}
      />
      <motion.span
        className="absolute right-[6%] top-[22%] aspect-square w-[clamp(320px,44vw,680px)] rounded-full bg-[radial-gradient(closest-side,rgb(201_160_84/0.85),rgb(214_182_120/0.35)_55%,rgb(214_182_120/0))] blur-2xl"
        {...drift([0, -50, 20], [0, 40, -20], 22)}
      />
    </div>
  );
}
