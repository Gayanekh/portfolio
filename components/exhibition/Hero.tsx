"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ARTIST, WORKS } from "@/components/exhibition/content";
import { ease } from "@/components/landing-next/ui";

const COUNT = WORKS.length;
// The fan, measured on the MaraArt reference: each step from the middle
// moves a card about a fifth of its width out, shrinks it by about 15% and
// turns it 7 degrees, so the row bends and fades towards both edges.
const STEP = 19;
const SHRINK = 0.153;
const TURN = 7;
// How the fan settles on the next painting: quick, soft, no bounce.
const SETTLE = { stiffness: 140, damping: 24, mass: 0.9 };

// One painting in the fan, placed by how far it is from the one in the middle
// (`at`, a running number, so cards glide between places). The middle one
// sits on top; a card further out than six places is hidden.
function FanCard({ work, index, at, open, onPick }: { work: (typeof WORKS)[number]; index: number; at: MotionValue<number>; open: MotionValue<number>; onPick: (index: number) => void }) {
  const offset = useTransform([at, open] as const, ([a, o]: number[]) => (index - a) * o);
  const x = useTransform(offset, (k) => `${k * STEP}%`);
  const scale = useTransform(offset, (k) => Math.max(0, 1 - Math.abs(k) * SHRINK));
  const rotate = useTransform(offset, (k) => -k * TURN);
  const zIndex = useTransform(offset, (k) => 100 - Math.round(Math.abs(k) * 10));
  const opacity = useTransform(offset, (k) => Math.min(1, Math.max(0, 6.5 - Math.abs(k))));
  return (
    <motion.button
      type="button"
      onClick={() => onPick(index)}
      aria-label={`Show ${work.title}`}
      style={{ x, scale, rotate, zIndex, opacity }}
      className="absolute inset-0 cursor-pointer overflow-hidden rounded-[4px] border-0 bg-[#1e1e1e] p-0 shadow-[0_30px_60px_-25px_rgb(0_0_0/0.7)] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
      <img src={work.image} alt="" loading={index < 4 ? "eager" : "lazy"} draggable={false} className="block h-full w-full select-none object-cover" />
    </motion.button>
  );
}

// The background: the painting in the middle, enlarged and blurred to a wash
// of its colours, fading into the next as the fan turns.
function Wash({ work, index, at }: { work: (typeof WORKS)[number]; index: number; at: MotionValue<number> }) {
  const opacity = useTransform(at, (a) => Math.max(0, 1 - Math.abs(index - a)));
  return <motion.img src={work.image} alt="" style={{ opacity }} className="absolute inset-0 h-full w-full scale-[1.2] object-cover blur-[60px]" />;
}

// The hero, after the MaraArt reference: no words, only the paintings, fanned
// out round the one in the middle over a blurred wash of its colours. The
// hero stays on screen while the page scrolls, and each step of the scroll
// brings the next painting to the middle, the fan gliding and settling; after
// the last one the page carries on. Clicking a painting brings it forward.
// On arrival the fan opens out from the middle. Reduced motion: no opening,
// and the fan moves without gliding.
export default function Hero() {
  const still = Boolean(useReducedMotion());
  const ref = useRef<HTMLElement>(null);

  // Which painting is in the middle: the scroll picks a whole number, the
  // fan glides to it.
  const target = useMotionValue(0);
  const glide = useSpring(target, SETTLE);
  const at = still ? target : glide;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => target.set(Math.round(p * (COUNT - 1))));

  // The fan opening on arrival.
  const open = useMotionValue(still ? 1 : 0);
  useEffect(() => {
    if (still) return;
    const controls = animate(open, 1, { duration: 1.4, ease, delay: 0.3 });
    return () => controls.stop();
  }, [open, still]);

  // Clicking a painting scrolls to its place, which brings it to the middle.
  const pick = (index: number) => {
    const section = ref.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const run = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (run * index) / (COUNT - 1), behavior: still ? "auto" : "smooth" });
  };

  return (
    <section ref={ref} id="top" aria-label={`${ARTIST.name}, ${ARTIST.show}`} style={{ height: `calc(100svh + ${COUNT - 1} * 35svh)` }} className="relative bg-[var(--ink)]">
      <h1 className="sr-only">
        {ARTIST.name}, {ARTIST.show}
      </h1>
      <div className="sticky top-0 grid h-svh place-items-center overflow-clip">
        {/* The wash of colour, darkened to sit in the page's night. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {WORKS.map((work, i) => (
            <Wash key={work.id} work={work} index={i} at={at} />
          ))}
          <span className="absolute inset-0 bg-[rgb(20_20_20/0.55)]" />
        </div>

        {/* The fan. */}
        <motion.div
          initial={still ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease }}
          className="relative aspect-[3/2] w-[min(78vw,calc(56svh*1.5))] sm:w-[min(44vw,calc(62svh*1.5))]"
        >
          {WORKS.map((work, i) => (
            <FanCard key={work.id} work={work} index={i} at={at} open={open} onPick={pick} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
