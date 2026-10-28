"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TEMPLATES_ALL, WORK } from "@/components/template-landing/content";
import { Words, useStill } from "@/components/template-landing/scroll-fx";
import { arrow, arrowLink, ease, focusRing, opusFrame } from "@/components/template-landing/ui";

type Room = (typeof TEMPLATES_ALL)[number];

// How far each picture travels inside its frame while the frame crosses the
// screen (the picture is this much taller than the frame).
const DRIFT = 150;
// The arrow button's entrance: up from below the frame's edge, fading in.
const BUTTON = { duration: 0.4, ease: [0.55, 0.055, 0.675, 0.19] as const };

// The reference's six places on its twelve-column grid, in order, measured
// at 1800px wide (one column 150px): each cell's span, the padding that
// sets its card off inside it (in container widths, so the composition
// scales as one picture), and the picture's shape. Wide pictures use the
// template's 16:10 screenshot, square ones its square screenshot.
const PLACES = [
  { span: "lg:col-span-5", pad: "lg:pt-[13.333cqw] lg:pr-[8.889cqw] lg:pb-[6.667cqw]", shape: "aspect-square", wide: false },
  { span: "lg:col-span-7", pad: "", shape: "aspect-[1050/711]", wide: true },
  { span: "lg:col-span-6", pad: "lg:pt-[13.333cqw] lg:px-[6.667cqw]", shape: "aspect-square", wide: false },
  { span: "lg:col-span-6", pad: "lg:pl-[4.444cqw] lg:pr-[8.889cqw]", shape: "aspect-square", wide: false },
  { span: "lg:col-span-7", pad: "lg:pt-[8.889cqw] lg:pr-[6.667cqw]", shape: "aspect-[930/629]", wide: true },
  { span: "lg:col-span-5", pad: "lg:pl-[6.667cqw] lg:pb-[6.667cqw]", shape: "aspect-square", wide: false },
];

// One template: its picture in a rounded frame, drifting down inside it as
// the frame crosses the screen; under it the name and what it works best
// with, as small outlined tags. Pointed at or focused, a round button with
// an arrow rises into the frame's bottom right corner. It opens the live
// demo in a new tab. Each card rises into place as it arrives.
function Card({ room, place, index }: { room: Room; place: (typeof PLACES)[number]; index: number }) {
  const still = useStill();
  const frameRef = useRef<HTMLSpanElement>(null);
  const [hot, setHot] = useState(false);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : DRIFT]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease, delay: (index % 2) * 0.12 }}
      className={`flex items-start ${place.span} ${place.pad}`}
    >
      <Link
        href={room.href}
        target="_blank"
        rel="noopener"
        aria-label={`${room.name}: open the live demo (new tab)`}
        onPointerEnter={() => setHot(true)}
        onPointerLeave={() => setHot(false)}
        onFocus={() => setHot(true)}
        onBlur={() => setHot(false)}
        className={`${focusRing} flex w-full flex-col gap-3 rounded-[12px] text-[var(--fg)] no-underline`}
      >
        <span ref={frameRef} className={`relative block overflow-hidden rounded-[12px] bg-[var(--card)] ${place.shape}`}>
          <motion.span style={{ y: drift }} className="absolute inset-x-0 top-[-150px] block h-[calc(100%+150px)]">
            <Image
              src={place.wide ? room.image : room.square}
              alt=""
              fill
              quality={90}
              sizes={place.wide ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 36vw, 100vw"}
              priority={index < 2}
              className={`object-cover ${place.wide ? "object-top" : "object-center"}`}
            />
          </motion.span>
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={hot ? { y: 0, opacity: 1 } : { y: 84, opacity: 0 }}
            transition={BUTTON}
            className="absolute bottom-6 right-6 grid size-14 place-items-center rounded-full bg-white text-[var(--accent)]"
          >
            <ArrowUpRight strokeWidth={1.75} className="size-7" />
          </motion.span>
        </span>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h3 className="m-0 font-[family-name:var(--font-1)] text-[length:clamp(1.5rem,calc(1.372rem_+_0.523vw),2rem)] font-medium leading-[1.2] tracking-[-0.02em]">{room.name}</h3>
          <span className="flex flex-wrap justify-end gap-2">
            {room.needs.map((need) => (
              <span key={need} className="rounded-[10px] border border-solid border-[color-mix(in_srgb,var(--fg)_30%,transparent)] px-2.5 py-[0.3125rem] text-[0.875rem] font-medium leading-[1.4] tracking-[-0.02em] text-[color-mix(in_srgb,var(--fg)_60%,transparent)]">
                {need}
              </span>
            ))}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// The call under the templates, as in the reference: from just past the
// middle, a large title that fades in as it rises up the screen (with the
// scroll, smoothed), the footer's line and Get started, underlined with a
// large arrow.
function Call() {
  const still = useStill();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: titleRef, offset: ["start 0.82", "start 0.3"] });
  const fade = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 140, damping: 30 });

  return (
    <div className="mt-28 flex flex-col items-start lg:ml-[50.667cqw] lg:mt-[11.111cqw]">
      <motion.h2
        ref={titleRef}
        style={{ opacity: still ? 1 : fade }}
        className="m-0 font-[family-name:var(--font-1)] text-[length:clamp(2.75rem,calc(1.73rem_+_4.183vw),6.75rem)] font-medium leading-[0.96] tracking-[-0.04em]"
      >
        {WORK.cta.title}
      </motion.h2>
      <p className="m-0 mt-[1.875rem] max-w-[31.25rem] text-[length:clamp(1.125rem,calc(1.029rem_+_0.392vw),1.5rem)] font-medium leading-[1.4] tracking-[-0.04em] text-[color-mix(in_srgb,var(--fg)_60%,transparent)]">
        {WORK.cta.text}
      </p>
      <Link
        href={WORK.cta.link.href}
        className={`${focusRing} group/arrow mt-[1.875rem] inline-flex items-center gap-2 rounded-[2px] border-0 border-b-2 border-solid border-current pb-1 text-[length:clamp(1.5rem,calc(1.372rem_+_0.523vw),2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--fg)] no-underline`}
      >
        {WORK.cta.link.label}
        <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-8 text-[var(--accent)] transition-transform duration-300 group-hover/arrow:-translate-y-0.5 group-hover/arrow:translate-x-0.5" />
      </Link>
    </div>
  );
}

// The templates, laid out like the reference's "Our work": a pill label at
// the left, then the title, a line and "See all templates" from the fourth
// column; below, the six templates staggered over a twelve-column grid in
// three rows (five and seven columns, six and six, seven and five), each
// set off inside its cell so no two line up. Phones and tablets stack them.
// The section is solid, like the reference: the page's hairlines stop here.
export default function Work() {
  return (
    <section id="templates" data-caption="templates" aria-labelledby="tl-work-title" className="relative scroll-mt-20 bg-[var(--bg)] py-[clamp(5rem,12vh,9rem)]">
      <div className={opusFrame}>
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12">
          <p className="m-0 inline-flex w-fit items-center gap-2 self-start rounded-[20px] border border-solid border-[var(--line)] py-2 pl-4 pr-[1.125rem] lg:col-span-3">
            <span aria-hidden="true" className="grid size-4 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
              <span className="size-2 rounded-full bg-[var(--accent)]" />
            </span>
            <span className="text-[0.875rem] font-medium uppercase leading-[1.2] tracking-[0.02em]">{WORK.label}</span>
          </p>
          <div className="flex flex-col items-start lg:col-span-9">
            <h2 id="tl-work-title" className="m-0 font-[family-name:var(--font-1)] text-[length:clamp(2.5rem,calc(1.99rem_+_2.09vw),4.5rem)] font-medium leading-none tracking-[-0.04em]">
              <Words text={WORK.title} />
            </h2>
            <p className="m-0 mt-[1.875rem] max-w-[41.25rem] text-[length:clamp(1.0625rem,calc(1.015rem_+_0.196vw),1.25rem)] font-medium leading-[1.4] tracking-[-0.02em] text-[color-mix(in_srgb,var(--fg)_60%,transparent)]">
              {WORK.text}
            </p>
            <Link href={WORK.all.href} className={`${arrowLink} mt-[3.125rem] font-medium text-[var(--fg)]`}>
              {WORK.all.label}
              <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className={arrow} />
            </Link>
          </div>
        </div>

        <div className="@container mt-20">
          <div className="grid grid-cols-1 items-start gap-y-12 lg:grid-cols-12 lg:gap-y-0">
            {TEMPLATES_ALL.slice(0, PLACES.length).map((room, i) => (
              <Card key={room.id} room={room} place={PLACES[i]} index={i} />
            ))}
          </div>
          <Call />
        </div>
      </div>
    </section>
  );
}
