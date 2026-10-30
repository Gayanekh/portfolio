"use client";

import { motion } from "framer-motion";
import type { WORKS } from "@/components/exhibition/content";

// Its place on the wall: span and start on the twelve columns, its shape and
// how far it drops.
export type Place = { col: string; shape: string; drop: string };

// A long, soft ease-out: quick to start, then a slow glide into place.
const GLIDE = [0.16, 1, 0.3, 1] as const;

// One work in the hang: it fades in and rises into place once, the first
// time it comes on screen (in a short stagger with its neighbours), the
// painting settling from a touch larger inside its edge, and its museum
// label following a moment later. Started a little before it is in view,
// over a longer, gentler curve, so it glides rather than pops.
export default function HangWork({ work, place, index }: { work: (typeof WORKS)[number]; place: Place; index: number }) {
  const delay = (index % 3) * 0.12;
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 1.6, ease: GLIDE, delay }}
      className={`${place.col} ${place.drop} [will-change:transform,opacity]`}
    >
      <figure className="m-0 flex flex-col gap-3">
        <span className={`group/work relative block overflow-hidden bg-[var(--bone-2)] ${place.shape}`}>
          <motion.span
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -5% 0px" }}
            transition={{ duration: 2, ease: GLIDE, delay }}
            className="absolute inset-0 block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
            <img src={work.image} alt={`${work.title}, ${work.year}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/work:scale-[1.04]" />
          </motion.span>
        </span>
        <motion.figcaption
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          transition={{ duration: 1.2, ease: GLIDE, delay: delay + 0.35 }}
          className="flex flex-col gap-0.5 text-[0.8125rem] leading-snug"
        >
          <span className="font-semibold text-[var(--bone)]">{work.title}</span>
          <span className="text-[var(--bone)]">
            {work.year}, {work.medium.toLowerCase()}, {work.size}
          </span>
        </motion.figcaption>
      </figure>
    </motion.li>
  );
}
