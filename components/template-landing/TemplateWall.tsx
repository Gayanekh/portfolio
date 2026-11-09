"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

// The hero picture: a wall of the templates' pictures, tilted, ported from the gallery
// of samrichmond.framer.website (read from its code, the user asked): four
// columns, 16px apart, turned 5 degrees as one block and clipped by the band;
// each column is a vertical ticker moving at 30px/s (measured on a 500px
// column, so it scales with the column's width), the second one in the
// opposite direction; the pictures have 6px corners. It fills its frame
// (sized in the frame's own width, so the four columns always span it). Decorative. It stops when off screen
// and with reduced motion.
// Only the templates section's own cover pictures (the user asked), the six, in a different order in each column.
const COVERS = ["gallery-cover-c", "minimal-cover-c", "nocturne-cover-b", "persona-cover-c", "showcase-cover-e", "exhibition-cover-b"];
const cover = (name: string) => ({ src: `/images/landing-covers/${name}.webp`, ratio: "2000/1870" });
const COLUMNS = [[0, 2, 4, 1, 3, 5], [3, 5, 1, 4, 0, 2], [4, 1, 5, 2, 3, 0], [2, 0, 3, 5, 1, 4]].map((order) => order.map((i) => cover(COVERS[i])));
// The reference's column is 500px, its speed 30px/s: 0.06 column widths a second.
const SPEED = 0.06;

function Column({ pictures, reverse, paused, offset }: { pictures: typeof COLUMNS[number]; reverse: boolean; paused: boolean; offset: number }) {
  const copy = useRef<HTMLDivElement>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const el = copy.current;
    if (!el) return;
    const measure = () => {
      // One copy's height over the column's width gives the time of one slide at a steady speed.
      if (el.offsetWidth) setSeconds(el.offsetHeight / (el.offsetWidth * SPEED));
    };
    measure();
    const watcher = new ResizeObserver(measure);
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  return (
    <div className="relative w-[var(--col)] flex-none overflow-hidden">
      <div style={{ animation: seconds ? `wall-tick ${seconds}s linear ${-seconds * offset}s infinite ${reverse ? "reverse" : "normal"}` : undefined, animationPlayState: paused ? "paused" : "running" }} className="flex flex-col will-change-transform">
        {[0, 1].map((n) => (
          <div key={n} ref={n === 0 ? copy : undefined} aria-hidden="true" className="flex flex-col gap-[var(--gap)] pb-[var(--gap)]">
            {pictures.map((picture, i) => (
              <span key={i} style={{ aspectRatio: picture.ratio }} className="relative block w-full overflow-hidden rounded-[6px]">
                <Image src={picture.src} alt="" fill sizes="(min-width: 1024px) 24vw, 50vw" className="object-cover" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TemplateWall() {
  const reduced = useReducedMotion();
  const band = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = band.current;
    if (!el) return;
    const watcher = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  return (
    <div ref={band} aria-hidden="true" style={{ "--col": "24cqw", "--gap": "1cqw" } as React.CSSProperties} className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[var(--bg)] [container-type:size]">
      <div className="flex h-[calc(var(--col)*4.1)] flex-none rotate-[5deg] gap-[var(--gap)]">
        {COLUMNS.map((pictures, i) => (
          <Column key={i} pictures={pictures} reverse={i === 1} paused={reduced || !onScreen} offset={[0, 0.35, 0.7, 0.15][i]} />
        ))}
      </div>
    </div>
  );
}
