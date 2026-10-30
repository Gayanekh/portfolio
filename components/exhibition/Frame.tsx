"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FRAMED, WORKS } from "@/components/exhibition/content";
import { font } from "@/components/landing-next/ui";

const WORK = WORKS.find((work) => work.id === FRAMED.workId) ?? WORKS[0];

// After the hero, as in the Painted Sky reference: one painting fills the
// screen, then, as the page scrolls, it draws back to its size on the wall,
// unframed, and its museum label appears beneath it. Held on screen (sticky)
// while it happens. With reduced motion it is simply the painting and its label.
export default function Frame() {
  const still = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  // How much the frame must grow to fill the screen at the start.
  const [fill, setFill] = useState(1.6);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setFill(Math.max(window.innerWidth / frame.offsetWidth, window.innerHeight / frame.offsetHeight) * 1.04);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], still ? [1, 1] : [fill, 1]);
  const label = useTransform(scrollYProgress, [0.62, 0.8], still ? [1, 1] : [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.62, 0.8], still ? [0, 0] : [16, 0]);

  return (
    <section ref={ref} aria-label={`${WORK.title}, framed`} className={`relative ${still ? "" : "h-[260svh]"}`}>
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden">
        <div className="flex flex-col items-center gap-[clamp(1.5rem,4svh,2.5rem)]">
          <motion.div ref={frameRef} style={{ scale }} className="relative w-[min(78vw,calc(62svh*1.5))]">
            {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
            <img src={WORK.image} alt={`${WORK.title}, ${WORK.year}`} className="relative block aspect-[3/2] w-full object-cover" />
          </motion.div>

          {/* The museum label. */}
          <motion.dl style={{ opacity: label, y: labelY }} className="m-0 grid w-[min(78vw,calc(62svh*1.5))] grid-cols-1 gap-x-10 gap-y-1 text-[0.875rem] text-[var(--bone)] sm:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-1">
              <dt className="font-semibold text-[var(--bone)]">{WORK.title}</dt>
              <dd className="m-0 text-[var(--mist)]">
                {WORK.year}, {WORK.medium.toLowerCase()}, {WORK.size}
              </dd>
            </div>
            <div className={`grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 ${font.mono} text-[0.75rem] uppercase tracking-[0.14em]`}>
              <dt className="text-[var(--mist)]">{FRAMED.note}</dt>
              <dd className="m-0">{FRAMED.show}</dd>
              <dt className="text-[var(--mist)]">Room</dt>
              <dd className="m-0">{FRAMED.room.replace("Room ", "")}</dd>
            </div>
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
