"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { MoveRight } from "lucide-react";
import { HERO, ROOMS } from "@/components/landing-next/content";
import { Headline, Label } from "@/components/landing-next/kit";
import { button, buttonArrow, ease, focusRing, font, grain, type } from "@/components/landing-next/ui";

const COUNT = ROOMS.length;
const STEP = 360 / COUNT;
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const TILT = { stiffness: 90, damping: 20, mass: 0.8 };

// One template on the ring: placed round the circle by its angle and turned
// to face out, darkening as it swings to the back. It opens its live demo.
function RingCard({ room, index, spin, radius }: { room: (typeof ROOMS)[number]; index: number; spin: MotionValue<number>; radius: MotionValue<number> }) {
  const angle = useTransform(spin, (s) => s + index * STEP);
  // Whole pixels, so the server's first render and the browser's agree.
  const x = useTransform([angle, radius] as const, ([a, r]: number[]) => Math.round(Math.sin(rad(a)) * r));
  const z = useTransform([angle, radius] as const, ([a, r]: number[]) => Math.round(Math.cos(rad(a)) * r));
  const shade = useTransform(angle, (a) => (1 - Math.cos(rad(a))) * 0.4);
  return (
    <motion.div style={{ x, z, rotateY: angle }} className="absolute left-1/2 top-1/2 -ml-[calc(var(--card)/2)] -mt-[calc(var(--card)/2)] aspect-square w-[var(--card)] [transform-style:preserve-3d]">
      {/* Its back, seen as it swings away: dark, with the template's name. */}
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center rounded-[1.1rem] bg-[var(--ink-2)] ring-1 ring-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <span className={`${font.serif} text-[length:clamp(1.25rem,2vw,2.25rem)] text-[var(--bone)]/40`}>{room.name}</span>
      </span>
      <Link href={room.href} target="_blank" rel="noopener" aria-label={`Open the ${room.name} demo (new tab)`} className={`${focusRing} group/card relative block h-full w-full overflow-hidden rounded-[1.1rem] bg-[var(--ink-2)] ring-1 ring-white/10 [backface-visibility:hidden]`}>
        <Image src={room.square} alt="" fill sizes="(min-width: 1024px) 17rem, 9rem" priority={index < 3} className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.06]" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
          <span className={`${font.mono} text-[0.625rem] uppercase tracking-[0.16em] text-white/85`}>{room.name}</span>
        </span>
        <motion.span style={{ opacity: shade }} className="absolute inset-0 bg-[var(--ink)]" />
      </Link>
    </motion.div>
  );
}

// The hero, at night: the headline over a ring of the real templates turning
// slowly in space, lit by an iris and a peach glow. With a mouse the ring
// leans towards the pointer and turns a little with it; while the hero is
// held on screen, scrolling spins it faster and flies the camera into it as
// the words fade, until the next section rises over it like a sheet.
// Reduced motion keeps the ring still.
export default function Hero() {
  const still = Boolean(useReducedMotion());
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // The ring's radius, from the stage's width.
  const radius = useMotionValue(420);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => radius.set(Math.min(stage.offsetWidth * (stage.offsetWidth < 700 ? 0.44 : 0.36), 640)));
    observer.observe(stage);
    return () => observer.disconnect();
  }, [radius]);

  // Turning: a slow drift over time, faster with the scroll.
  const drift = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (!still) drift.set(drift.get() + delta * 0.0065);
  });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const spin = useTransform([drift, scrollYProgress] as const, ([d, p]: number[]) => d + p * 150);

  // Leaning towards the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const leanX = useSpring(useTransform(py, [-0.5, 0.5], [-4, -16]), TILT);
  const leanY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), TILT);
  const lean = (event: PointerEvent<HTMLDivElement>) => {
    if (still || event.pointerType !== "mouse") return;
    px.set(event.clientX / window.innerWidth - 0.5);
    py.set(event.clientY / window.innerHeight - 0.5);
  };

  // The camera flying in, the words leaving.
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 2.3]);
  const ringY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const wordsY = useTransform(scrollYProgress, [0, 0.3], [0, -90]);
  const footOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section ref={ref} aria-label="Introduction" className="relative h-[190svh] bg-[var(--ink)] text-[var(--bone)] lg:h-[230svh]">
      <div onPointerMove={lean} className="sticky top-0 h-svh overflow-hidden">
        {/* The night: two glows breathing, a faint grid fading out, the grain. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.span
            animate={still ? undefined : { scale: [1, 1.12, 1], opacity: [0.55, 0.8, 0.55] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-[58%] size-[min(80rem,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(157_140_255/0.42),transparent_60%)]"
          />
          <motion.span
            animate={still ? undefined : { x: ["-6%", "6%", "-6%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-30%] left-1/2 size-[min(60rem,110vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_179_138/0.28),transparent_62%)]"
          />
          <span className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:clamp(3rem,6vw,6rem)_clamp(3rem,6vw,6rem)] [mask-image:radial-gradient(ellipse_at_50%_40%,#000_10%,transparent_65%)]" />
          <span className={`absolute inset-0 mix-blend-overlay ${grain}`} />
        </div>

        {/* The ring of templates. */}
        <motion.div
          ref={stageRef}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease, delay: 0.2 }}
          className="absolute inset-x-0 bottom-[40svh] top-[22svh] [--card:clamp(7rem,15vw,17rem)] [perspective:1800px] sm:bottom-[30svh] lg:bottom-[-4svh] lg:top-[30svh]"
        >
          <motion.div style={still ? { rotateX: -10 } : { rotateX: leanX, rotateY: leanY, scale: ringScale, y: ringY }} className="absolute inset-0 [transform-style:preserve-3d]">
            {ROOMS.map((room, i) => (
              <RingCard key={room.id} room={room} index={i} spin={spin} radius={radius} />
            ))}
          </motion.div>
        </motion.div>

        {/* The words over it. */}
        <motion.div style={still ? undefined : { opacity: wordsOpacity, y: wordsY }} className="pointer-events-none relative z-10 flex flex-col items-center px-5 pt-[clamp(7rem,15svh,10rem)] text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
            <Label tone="dark">{HERO.label}</Label>
          </motion.div>
          <Headline as="h1" now tone="dark" delay={0.2} text={HERO.title} className={`mt-6 max-w-[12ch] ${type.mega} [text-shadow:0_4px_60px_rgb(11_10_15/0.6)]`} />
        </motion.div>

        {/* The foot: the line, the calls to action, the facts. */}
        <motion.div style={still ? undefined : { opacity: footOpacity }} className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--ink)] via-[rgb(11_10_15/0.85)] to-transparent pb-[clamp(1.5rem,4svh,3rem)] pt-24">
          <div className="mx-auto flex w-[min(90vw,92rem)] flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.7 }} className={`m-0 max-w-[26rem] ${type.lead} text-[var(--bone)]/75`}>
              {HERO.text}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.85 }} className="flex flex-wrap gap-3">
              <Link href={HERO.primary.href} className={button.light}>
                {HERO.primary.label}
                <MoveRight aria-hidden="true" className={buttonArrow} />
              </Link>
              <a href={HERO.secondary.href} className={button.ghost}>
                {HERO.secondary.label}
              </a>
            </motion.div>
          </div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1.1 }} className={`mx-auto mt-8 hidden w-[min(90vw,92rem)] list-none justify-between border-0 border-t border-solid border-white/10 p-0 pt-5 sm:flex ${font.mono} text-[0.75rem] uppercase tracking-[0.18em] text-[var(--mist)]`}>
            {HERO.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[var(--iris)]" />
                {fact}
              </li>
            ))}
            <li className="flex items-center gap-2 text-[var(--bone)]">
              {HERO.scroll}
              <motion.span animate={still ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} aria-hidden="true">
                ↓
              </motion.span>
            </li>
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
