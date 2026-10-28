"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { GALLERY, ROOMS } from "@/components/landing-next/content";
import { Headline, Label, Reveal, useWide } from "@/components/landing-next/kit";
import { button, buttonArrow, ease, focusRing, font, pad, shadow, shell, type } from "@/components/landing-next/ui";

const COUNT = ROOMS.length;

// A template in a browser window: its opening screen, a "View" disc
// following the pointer over it, and under it its number, name, style,
// pitch and demo link. The whole window opens the demo in a new tab.
function Room({ room, index }: { room: (typeof ROOMS)[number]; index: number }) {
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const x = useSpring(cx, { stiffness: 500, damping: 40 });
  const y = useSpring(cy, { stiffness: 500, damping: 40 });
  const [over, setOver] = useState(false);
  const move = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    cx.set(event.clientX - box.left);
    cy.set(event.clientY - box.top);
  };
  return (
    <article className="group/room flex w-[min(82vw,26rem)] shrink-0 snap-center flex-col gap-5 lg:w-[min(56vw,54rem)]">
      <Link
        href={room.href}
        target="_blank"
        rel="noopener"
        aria-label={`Open the ${room.name} demo (new tab)`}
        onPointerMove={move}
        onPointerEnter={(event) => {
          move(event);
          x.jump(cx.get());
          y.jump(cy.get());
          setOver(event.pointerType === "mouse");
        }}
        onPointerLeave={() => setOver(false)}
        className={`${focusRing} relative block overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:cursor-none ${shadow.card} hover:-translate-y-1.5`}
      >
        <span className="flex h-9 items-center gap-1.5 border-0 border-b border-solid border-black/[0.06] px-3.5">
          <span className="size-2 rounded-full bg-black/15" />
          <span className="size-2 rounded-full bg-black/15" />
          <span className="size-2 rounded-full bg-black/15" />
          <span className={`mx-auto rounded-md bg-black/[0.04] px-3 py-0.5 ${font.mono} text-[0.6875rem] text-black/45`}>portory.net/{room.id}</span>
        </span>
        <span className="relative block aspect-[16/10] overflow-hidden">
          <Image src={room.image} alt={`The ${room.name} template`} fill sizes="(min-width: 1024px) 56vw, 82vw" className="object-cover object-top transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/room:scale-[1.035]" />
        </span>
        <motion.span
          aria-hidden="true"
          style={{ x, y }}
          initial={false}
          animate={{ scale: over ? 1 : 0, opacity: over ? 1 : 0 }}
          transition={{ duration: 0.35, ease }}
          className="pointer-events-none absolute left-0 top-0 -ml-12 -mt-12 grid size-24 place-items-center rounded-full bg-[var(--ink)] text-[0.8125rem] font-medium text-[var(--bone)] shadow-[0_10px_40px_-8px_rgb(90_69_224/0.8)]"
        >
          {GALLERY.view}
        </motion.span>
      </Link>
      <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1">
        <span className={`${font.mono} text-[0.75rem] text-[var(--iris-deep)]`}>{pad(index + 1)}</span>
        <h3 className={`m-0 ${type.heading}`}>{room.name}</h3>
        <span className={`${font.mono} text-[0.6875rem] uppercase tracking-[0.16em] text-[var(--ink)]/45`}>{room.styleLabel}</span>
        <span />
        <p className={`m-0 col-span-2 max-w-[34rem] ${type.body} text-[var(--ink)]/65`}>{room.headline}</p>
      </div>
    </article>
  );
}

// The templates: a bone sheet rising over the night hero with rounded
// shoulders. On wide screens the section holds still while the scroll
// carries the templates sideways past the viewer, a line filling with the
// walk and the template in front named; on phones they scroll sideways by
// touch, snapping one at a time. The walk ends on a card to see them all.
export default function Gallery() {
  const wide = useWide();
  const still = Boolean(useReducedMotion());
  const pinned = wide && !still;
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const travel = useMotionValue(0);
  const [front, setFront] = useState(0);

  // How far the rail travels: its width past the screen's, set as --travel
  // so the section is tall enough to carry it.
  useEffect(() => {
    const track = trackRef.current;
    const rail = railRef.current;
    if (!track || !rail) return;
    const observer = new ResizeObserver(() => {
      const distance = Math.max(0, rail.scrollWidth - window.innerWidth);
      travel.set(distance);
      track.style.setProperty("--travel", `${distance}px`);
    });
    observer.observe(rail);
    return () => observer.disconnect();
  }, [travel]);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, travel] as const, ([p, t]: number[]) => -p * t);
  useMotionValueEvent(scrollYProgress, "change", (p) => setFront(Math.min(COUNT - 1, Math.floor(p * COUNT))));

  return (
    <section id="templates" aria-label={GALLERY.label} className="relative z-10 -mt-[55svh] scroll-mt-0 rounded-t-[clamp(2rem,4vw,4.5rem)] bg-[var(--bone)] text-[var(--ink)] shadow-[0_-30px_80px_-20px_rgb(0_0_0/0.6)]">
      <div className={`${shell} grid gap-8 pb-[clamp(3rem,5vw,5rem)] pt-[clamp(5rem,9vw,9rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end`}>
        <div className="flex flex-col gap-6">
          <Reveal>
            <Label index="01">{GALLERY.label}</Label>
          </Reveal>
          <Headline text={GALLERY.title} className={`max-w-[14ch] ${type.title}`} />
        </div>
        <Reveal delay={0.1}>
          <p className={`m-0 ${type.lead} text-[var(--ink)]/65`}>{GALLERY.text}</p>
        </Reveal>
      </div>

      <div ref={trackRef} className={pinned ? "relative h-[calc(var(--travel,0px)+100svh)]" : "relative"}>
        <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center gap-10 overflow-hidden" : "flex flex-col gap-8 pb-24"}>
          <motion.div
            ref={railRef}
            style={pinned ? { x } : undefined}
            className={`flex gap-[clamp(1.25rem,2.5vw,3rem)] px-[5vw] ${pinned ? "w-max" : "snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none]"}`}
          >
            {ROOMS.map((room, i) => (
              <Room key={room.id} room={room} index={i} />
            ))}
            {/* The end of the walk. */}
            <div className="flex w-[min(82vw,26rem)] shrink-0 snap-center flex-col justify-center gap-6 rounded-xl bg-[var(--ink)] p-[clamp(2rem,4vw,4rem)] text-[var(--bone)] lg:w-[min(34vw,32rem)]">
              <Headline as="p" tone="dark" text={GALLERY.end.title} className={type.title} />
              <Link href={GALLERY.end.href} className={`${button.light} w-fit`}>
                {GALLERY.end.label}
                <MoveRight aria-hidden="true" className={buttonArrow} />
              </Link>
            </div>
          </motion.div>

          {pinned && (
            <div className={`${shell} flex items-center gap-6`}>
              <span className={`${font.mono} w-[11rem] shrink-0 text-[0.75rem] uppercase tracking-[0.16em] text-[var(--ink)]/55`}>
                <span className="text-[var(--iris-deep)]">{pad(front + 1)}</span> / {pad(COUNT)} · {ROOMS[front].name}
              </span>
              <span className="relative h-px flex-1 bg-[var(--ink)]/15">
                <motion.span style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-[var(--ink)]" />
              </span>
              <Link href={ROOMS[front].href} target="_blank" rel="noopener" className={`${focusRing} group/demo inline-flex shrink-0 items-center gap-1.5 rounded-[4px] text-[0.875rem] font-medium text-[var(--ink)] no-underline`}>
                {GALLERY.demo}
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/demo:-translate-y-0.5 group-hover/demo:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
