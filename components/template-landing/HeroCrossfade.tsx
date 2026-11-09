"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useReducedMotion } from "motion/react";

// The hero picture's slideshow, ported from Framer's "Cinematic Crossfade"
// component (read from its live preview's code): every slide stays 6s; the next
// one fades in over 1.2s (easeInOut) while the old one fades out over the same
// 1.2s, both at once, so there is never a gap; each slide's picture zooms slowly
// from 100% to 108% on a linear curve lasting the slide's time plus the fade
// (7.2s), so it is still moving as it fades out. The clock only runs while the
// picture is on screen (>=10% in view), the page is visible and the pointer is
// not over it (pause on hover). With reduced motion it is one still picture.
const SLIDE = 6;
const FADE = 1.2;
const ZOOM = 8;

// `ground` is the picture's own edge colour (shown while it loads); `focus` is the part of it kept when the wide frame crops it.
export type Slide = { src: string; name: string; ground: string; focus: string };

export default function HeroCrossfade({ slides }: { slides: Slide[] }) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLSpanElement>(null);
  const clock = useRef(0);
  const [index, setIndex] = useState(0);
  const [onScreen, setOnScreen] = useState(true);
  const [hovered, setHovered] = useState(false);
  const count = slides.length;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const watcher = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.1 });
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  // Fetch the other slides' screenshots ahead, so a fade never waits for a picture.
  useEffect(() => {
    slides.slice(1).forEach(({ src }) => {
      const img = new window.Image();
      img.src = `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=75`;
    });
  }, [slides]);

  const running = !reduced && onScreen && !hovered && count > 1;
  // useAnimationFrame stops with the tab; the time of a frame is capped so a long pause does not skip a slide.
  useAnimationFrame((_, delta) => {
    if (!running) return;
    clock.current += Math.min(delta, 100) / 1000;
    if (clock.current >= SLIDE) {
      clock.current = 0;
      setIndex((i) => (i + 1) % count);
    }
  });

  const slide = slides[index % count];
  return (
    <span ref={root} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="absolute inset-0 block overflow-hidden" >
      <AnimatePresence>
        <motion.span key={index} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : FADE, ease: "easeInOut" }} className="absolute inset-0 block" style={{ backgroundColor: slide.ground }}>
          <motion.span initial={{ scale: 1 }} animate={{ scale: reduced ? 1 : 1 + ZOOM / 100 }} transition={{ duration: SLIDE + FADE, ease: "linear" }} className="absolute inset-0 block will-change-transform">
            {/* The whole cover, uncropped, in the middle; its own blurred, enlarged copy fills the sides, and the cover's edges fade into it so no seam shows. */}
            <Image src={slide.src} alt="" aria-hidden="true" fill sizes="(min-width: 768px) 70vw, 100vw" className="scale-125 object-cover blur-[28px]" />
            <Image src={slide.src} alt={`The ${slide.name} template`} fill priority={index === 0} sizes="(min-width: 768px) 70vw, 100vw" className="object-contain [mask-image:linear-gradient(90deg,transparent,black_14%,black_86%,transparent)]" />
          </motion.span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
