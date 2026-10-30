"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotionConfig, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TEMPLATES, TEMPLATE_PITCH } from "@/components/new-landing/content";
import { STYLE_LABEL } from "@/components/landing/sample-portfolios";
import { ease, focusRing } from "@/components/template-landing/ui";

const COUNT = TEMPLATES.length;
// The section is 3.5 screens tall and pinned the whole way. It sits one
// screen up under the hero (which slides away over it) and the next section
// starts one screen before its end (sliding up over it), leaving half a
// screen of scroll with the templates alone.

// The templates, after the Moire reference: a full-screen picture fixed in
// place underneath the page. The hero slides up off it like a sheet and the
// next section slides up over it. The templates change by hand, not by
// scroll: pointed at, the picture shows "Previous" or "Next" following the
// cursor (by the half it is over), and a click there moves on (crossfading);
// the two halves are buttons, so taps and the keyboard work too. Over it: the templates' names top left (the one on show bright,
// pointing at one jumps to it), its style top right, the title and its pitch
// bottom right, See all templates bottom left. A dark fade keeps the words legible.
export default function Showcase() {
  const reduced = useReducedMotionConfig();
  const [index, setIndex] = useState(0);
  const go = (by: number) => setIndex((i) => (i + by + COUNT) % COUNT);
  // The label following the cursor, and which half it is over (null: off the picture).
  const [side, setSide] = useState<"prev" | "next" | null>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hintX = useSpring(px, { stiffness: 700, damping: 50 });
  const hintY = useSpring(py, { stiffness: 700, damping: 50 });
  const track = (event: React.PointerEvent, half: "prev" | "next") => {
    if (event.pointerType === "touch") return;
    px.set(event.clientX);
    py.set(event.clientY);
    setSide(half);
  };



  const room = TEMPLATES[index];
  return (
    <section id="templates" aria-roledescription="carousel" aria-label="Templates" className="relative z-0 -mt-[100svh] h-[350svh]">
      {/* The corner caption's marker: where the templates come into view, one screen down (the section starts under the hero). */}
      <span aria-hidden="true" data-caption="templates" className="absolute top-[100svh] block h-0" />
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.div key={room.id} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.9, ease }} className="absolute inset-0">
                <Image src={room.image} alt={`The ${room.name} template`} fill sizes="100vw" quality={90} className="object-cover object-top" />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* The two halves: Previous and Next. */}
          <div className="absolute inset-0 z-[1] flex" onPointerLeave={() => setSide(null)}>
            <button type="button" aria-label="Previous template" onClick={() => go(-1)} onPointerMove={(e) => track(e, "prev")} className={`${focusRing} h-full flex-1 cursor-pointer border-0 bg-transparent p-0 [@media(hover:hover)]:cursor-none`} />
            <button type="button" aria-label="Next template" onClick={() => go(1)} onPointerMove={(e) => track(e, "next")} className={`${focusRing} h-full flex-1 cursor-pointer border-0 bg-transparent p-0 [@media(hover:hover)]:cursor-none`} />
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/35 bg-[linear-gradient(90deg,rgb(0_0_0/0.55),transparent_45%),linear-gradient(0deg,rgb(0_0_0/0.75),transparent_55%),linear-gradient(180deg,rgb(0_0_0/0.5),transparent_35%)]" />

          <div className="pointer-events-none absolute inset-0 z-[2] text-white [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
            {/* The names, top left. */}
            <ul className="absolute left-[clamp(1rem,1.75vw,2rem)] top-[clamp(5rem,10vh,7rem)] m-0 flex list-none flex-col p-0">
              {TEMPLATES.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => setIndex(i)}
                    className={`${focusRing} cursor-pointer border-0 bg-transparent p-0 text-left text-[length:clamp(1.125rem,calc(0.8rem_+_0.9vw),1.75rem)] font-medium leading-[1.1] tracking-[-0.03em] transition-colors duration-300 ${i === index ? "text-white" : "text-white/35 hover:text-white/70"}`}
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Its style, top right. */}
            <p className="absolute right-[clamp(1rem,1.75vw,2rem)] top-[clamp(5rem,10vh,7rem)] m-0 text-right text-[0.8125rem] leading-tight text-white/80">
              {STYLE_LABEL[room.style]}
              <br />
              {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
            </p>

            {/* The title and the pitch, bottom right. */}
            <div className="absolute bottom-[clamp(2rem,8vh,5rem)] right-[clamp(1rem,1.75vw,2rem)] w-[min(30rem,calc(100%-2rem))]">
              <h2 className="m-0 text-[length:clamp(1.5rem,calc(1rem_+_1.4vw),2.5rem)] font-medium leading-tight tracking-[-0.03em]">Templates worth a second look.</h2>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={room.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }} className="m-0 mt-2 text-[0.9375rem] leading-snug text-white/85">
                  {room.name}: {TEMPLATE_PITCH[room.id]?.headline ?? room.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* See all, bottom left; the current one opens its demo. */}
            <div className="absolute bottom-[clamp(2rem,8vh,5rem)] left-[clamp(1rem,1.75vw,2rem)] flex flex-col gap-3">
              <Link href={room.href} target="_blank" rel="noopener" className={`${focusRing} group inline-flex w-fit items-center gap-1.5 rounded text-[0.9375rem] text-white/80 no-underline hover:text-white`}>
                Open the {room.name} demo
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/templates" className={`${focusRing} w-fit rounded text-[1.25rem] font-semibold text-white no-underline`}>
                See all templates
              </Link>
            </div>
          </div>
        </div>
        {/* "Previous" / "Next", following the cursor over the picture. */}
        <motion.div aria-hidden="true" style={{ x: hintX, y: hintY }} initial={false} animate={{ opacity: side ? 1 : 0 }} transition={{ duration: 0.15 }} className="pointer-events-none fixed left-0 top-0 z-30">
          <motion.span initial={false} animate={{ scale: side ? 1 : 0.8 }} transition={{ duration: 0.2, ease }} className="block -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-[0_6px_20px_rgb(0_0_0/0.25)]">
            {side === "prev" ? "Previous" : "Next"}
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
