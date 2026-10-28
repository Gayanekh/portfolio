"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Check, MoveRight } from "lucide-react";
import { COLOR_PALETTES } from "@/components/template-detail/theme-options";
import { Headline, Label } from "@/components/landing-next/kit";
import { button, buttonArrow, ease, focusRing, font, shadow, shell, type } from "@/components/landing-next/ui";
import { HERO, ROOMS } from "@/components/line-landing/content";

const COUNT = ROOMS.length;
const DEPTH = { stiffness: 120, damping: 20, mass: 0.6 };
const PALETTE = COLOR_PALETTES[0];

// A piece of the composition that drifts with the pointer by its depth.
function Float({ px, py, depth, className, children }: { px: MotionValue<number>; py: MotionValue<number>; depth: number; className: string; children: React.ReactNode }) {
  const x = useSpring(useTransform(px, (v) => v * depth), DEPTH);
  const y = useSpring(useTransform(py, (v) => v * depth), DEPTH);
  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

const chip = `rounded-xl bg-[rgb(22_20_29/0.82)] text-[var(--bone)] ring-1 ring-white/10 backdrop-blur-xl ${shadow.float}`;

// The hero, side by side over the mesh: on the left the label, the home
// page's headline with its second sentence glowing, the text, Get started and
// See the templates, a way to log in, and three facts. On the right a browser
// window shows the real templates one after another, crossfading; around it
// small pieces float at different depths and drift with the pointer: what's
// showing, a palette, a published address and a phone. Stacked on phones.
export default function Hero() {
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const room = ROOMS[index];
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  useEffect(() => {
    if (still) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % COUNT), HERO.autoplayMs);
    return () => window.clearTimeout(timer);
  }, [index, still]);

  const lean = (event: PointerEvent<HTMLElement>) => {
    if (still || event.pointerType !== "mouse") return;
    px.set(event.clientX / window.innerWidth - 0.5);
    py.set(event.clientY / window.innerHeight - 0.5);
  };

  return (
    <section onPointerMove={lean} aria-label="Introduction" className="relative z-10 flex min-h-svh items-center pb-[clamp(4rem,10vh,7rem)] pt-[clamp(7rem,16vh,10rem)]">
      {/* A soft glow behind the composition. */}
      <span aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[10%] -z-10 size-[min(64rem,120vw)] rounded-full bg-[radial-gradient(circle,rgb(157_140_255/0.22),transparent_62%)]" />

      <div className={`${shell} grid items-center gap-[clamp(3rem,6vw,6rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]`}>
        <div className="flex flex-col items-start gap-7">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <Label tone="dark">{HERO.label}</Label>
          </motion.div>
          <Headline as="h1" now tone="dark" delay={0.15} text={HERO.title} className={`max-w-[11ch] ${font.display} text-[length:clamp(3rem,calc(1.6rem_+_4.8vw),8.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]`} />
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.55 }} className={`m-0 max-w-[30rem] ${type.lead} text-[var(--bone)]/70`}>
            {HERO.text}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.7 }} className="flex flex-wrap gap-3">
            <Link href={HERO.primary.href} className={button.light}>
              {HERO.primary.label}
              <MoveRight aria-hidden="true" className={buttonArrow} />
            </Link>
            <a href={HERO.secondary.href} className={button.ghost}>
              {HERO.secondary.label}
            </a>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.85 }} className={`m-0 ${type.body} text-[var(--bone)]/55`}>
            {HERO.account.lead}{" "}
            <Link href={HERO.account.href} className={`${focusRing} rounded-[4px] font-medium text-[var(--bone)] underline decoration-[var(--iris)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--iris)]`}>
              {HERO.account.label}
            </Link>
          </motion.p>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className={`m-0 mt-2 flex list-none flex-col gap-2.5 border-0 border-t border-solid border-white/10 p-0 pt-6 ${type.body} text-[var(--bone)]/75`}>
            {HERO.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-[var(--iris)]/20 text-[var(--iris)]">
                  <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                </span>
                {fact}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* The composition: the templates in a window, and the floating pieces. */}
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.3, ease, delay: 0.2 }} className="relative mx-auto w-full max-w-[44rem] py-[clamp(2rem,5vw,4rem)]">
          <Float px={px} py={py} depth={-14} className="relative">
            <Link href={room.href} target="_blank" rel="noopener" aria-label={`Open the ${room.name} demo (new tab)`} className={`${focusRing} block overflow-hidden rounded-xl bg-[var(--ink-2)] ring-1 ring-white/10 ${shadow.float}`}>
              <span className="flex h-8 items-center gap-1.5 border-0 border-b border-solid border-white/10 px-3.5">
                <span className="size-2 rounded-full bg-white/20" />
                <span className="size-2 rounded-full bg-white/20" />
                <span className="size-2 rounded-full bg-white/20" />
                <span className={`mx-auto rounded-md bg-white/[0.06] px-3 py-0.5 ${font.mono} text-[0.6875rem] text-white/50`}>portory.net/{room.id}</span>
              </span>
              <span className="relative block aspect-[16/10] overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.span key={room.id} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease }} className="absolute inset-0">
                    <Image src={room.image} alt="" fill priority={index === 0} quality={90} sizes="(min-width: 1024px) 44rem, 100vw" className="object-cover object-top" />
                  </motion.span>
                </AnimatePresence>
              </span>
            </Link>
          </Float>

          <Float px={px} py={py} depth={26} className={`absolute -left-[4%] top-[2%] flex items-center gap-3 px-4 py-3 ${chip}`}>
            <span className="relative grid size-2 place-items-center">
              <span className="absolute inset-0 rounded-full bg-[var(--iris)]/60 motion-safe:animate-ping" />
              <span className="size-2 rounded-full bg-[var(--iris)]" />
            </span>
            <span className={`${font.mono} text-[0.6875rem] uppercase tracking-[0.16em] text-[var(--mist)]`}>{HERO.showing}</span>
            <span className="relative h-[1.25em] min-w-[5.5rem] overflow-hidden text-[0.9375rem] font-medium">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span key={room.id} initial={{ y: "110%" }} animate={{ y: "0%" }} exit={{ y: "-110%" }} transition={{ duration: 0.5, ease }} className="block">
                  {room.name}
                </motion.span>
              </AnimatePresence>
            </span>
          </Float>

          <Float px={px} py={py} depth={34} className={`absolute -bottom-[2%] -left-[6%] hidden flex-col gap-2 px-4 py-3 sm:flex ${chip}`}>
            <span className={`${font.mono} text-[0.625rem] uppercase tracking-[0.16em] text-[var(--mist)]`}>
              {HERO.palette} · {PALETTE.name}
            </span>
            <span aria-hidden="true" className="flex -space-x-1">
              {[...PALETTE.swatches, PALETTE.muted].map((swatch, i) => (
                <span key={i} className={`size-5 rounded-full ring-2 ring-[var(--ink-2)] ${swatch}`} />
              ))}
            </span>
          </Float>

          <Float px={px} py={py} depth={22} className={`absolute -bottom-[5%] right-[4%] flex items-center gap-3 px-4 py-3 ${chip}`}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[0.75rem] font-medium text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {HERO.published}
            </span>
            <span className={`${font.mono} text-[0.75rem] text-[var(--bone)]/80`}>{HERO.address}</span>
          </Float>

          <Float px={px} py={py} depth={44} className={`absolute -right-[5%] top-[14%] hidden w-[18%] min-w-[5.5rem] overflow-hidden rounded-[1.1rem] border-[4px] border-solid border-[var(--ink-2)] sm:block ${shadow.float}`}>
            <span className="relative block aspect-[9/18]">
              <AnimatePresence initial={false}>
                <motion.span key={room.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease }} className="absolute inset-0">
                  <Image src={room.square} alt="" fill sizes="8rem" className="object-cover" />
                </motion.span>
              </AnimatePresence>
            </span>
          </Float>
        </motion.div>
      </div>
    </section>
  );
}
