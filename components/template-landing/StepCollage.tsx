"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import StepIcon, { StepPiece } from "@/components/template-landing/StepIcon";
import { ease } from "@/components/template-landing/ui";

// How it works' picture, after the Monolog reference's services (the user
// asked): three rounded blocks, one large and two small, set differently for
// each step. When the step changes the blocks glide to their new places and
// their drawings change, each new one traced by the invisible pen (StepIcon).
// Decorative; the step's text says it. With reduced motion the blocks jump.

// Each step's blocks as left, top, width and height in % of the picture:
// the large one first, then the two small ones.
const LAYOUTS = [
  [
    { l: 34, t: 0, w: 66, h: 66 },
    { l: 0, t: 33.5, w: 32, h: 32.5 },
    { l: 68, t: 67.5, w: 32, h: 32.5 },
  ],
  [
    { l: 0, t: 34, w: 66, h: 66 },
    { l: 68, t: 34, w: 32, h: 32 },
    { l: 34, t: 0, w: 66, h: 32 },
  ],
  [
    { l: 34, t: 17, w: 66, h: 66 },
    { l: 0, t: 0, w: 32, h: 32 },
    { l: 0, t: 68, w: 32, h: 32 },
  ],
];

// The blocks' surfaces: a soft tint of the primary colour for the large one
// (the highlight; the user asked, as white vanished on the white page), the
// page's grey card, and dark.
const SKINS = [
  "bg-[color-mix(in_srgb,var(--accent)_10%,#fff)] text-[#16171a]",
  "bg-[var(--card)] text-[#16171a]",
  "bg-[#16171a] text-[#efefed]",
];

export default function StepCollage({ step, className = "" }: { step: number; className?: string }) {
  const still = useReducedMotion();
  const layout = LAYOUTS[step] ?? LAYOUTS[0];
  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      {layout.map((b, slot) => (
        <motion.div
          key={slot}
          initial={false}
          animate={{ left: `${b.l}%`, top: `${b.t}%`, width: `${b.w}%`, height: `${b.h}%` }}
          transition={still ? { duration: 0 } : { duration: 1, ease }}
          className={`absolute overflow-hidden rounded-[clamp(0.875rem,1.6vw,1.5rem)] ${SKINS[slot]}`}
        >
          <AnimatePresence initial={false}>
            <motion.div key={step} exit={{ opacity: 0, transition: { duration: 0.3 } }} className={`absolute ${slot === 0 ? "inset-[16%]" : "inset-[18%]"}`}>
              {slot === 0 ? <StepIcon step={step} /> : <StepPiece step={step} slot={slot as 1 | 2} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
