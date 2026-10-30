"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SHOWCASE, WORKS } from "@/components/exhibition/content";
import { underline } from "@/components/exhibition/ui";
import { ease, focusRing } from "@/components/landing-next/ui";

// After the hero, as on the Archivio reference: the works in one row at the
// same height, each its own shape, wide gaps between them. It scrolls
// sideways (arrows, trackpad or swipe); the arrows step one work at a time.
// Under it a single link, set in small capitals and underlined, to the
// works page, opened in a new tab.
export default function Showcase() {
  const still = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
  };

  // Scroll to the start of the next (or previous) work.
  const step = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const inset = parseFloat(getComputedStyle(el).paddingLeft);
    const starts = [...el.children].map((item) => (item as HTMLElement).offsetLeft - inset);
    const target = direction > 0 ? starts.find((s) => s > el.scrollLeft + 4) : starts.reverse().find((s) => s < el.scrollLeft - 4);
    el.scrollTo({ left: target ?? (direction > 0 ? el.scrollWidth : 0), behavior: still ? "auto" : "smooth" });
  };

  const arrow = `${focusRing} grid size-8 cursor-pointer place-items-center rounded border-0 bg-transparent p-0 text-[var(--bone)] transition-opacity disabled:cursor-default disabled:opacity-30`;

  return (
    <section aria-label="Works from the show" className="relative py-[clamp(4rem,10vh,8rem)]">
      <ul
        ref={track}
        onScroll={update}
        className="relative m-0 flex list-none snap-x snap-proximity gap-[clamp(2.5rem,7vw,8rem)] overflow-x-auto scroll-px-[5vw] p-0 px-[5vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {WORKS.map((work, i) => (
          <motion.li
            key={work.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease, delay: Math.min(i, 4) * 0.1 }}
            className="shrink-0 snap-start"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
            <img src={work.image} alt={`${work.title}, ${work.year}`} loading={i < 4 ? "eager" : "lazy"} className="block h-[clamp(16rem,30vw,34rem)] w-auto max-w-none shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]" />
          </motion.li>
        ))}
      </ul>

      <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-col items-center gap-[clamp(2rem,5vh,3.5rem)]">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label={SHOWCASE.previous} className={arrow}>
            <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
          <span aria-hidden="true" className="size-1 rounded-full bg-[var(--bone)]" />
          <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label={SHOWCASE.next} className={arrow}>
            <ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        <Link href={SHOWCASE.href} target="_blank" rel="noopener" className={underline}>
          {SHOWCASE.label}
        </Link>
      </div>
    </section>
  );
}
