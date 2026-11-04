"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { STEPS } from "@/components/template-landing/content";
import StepCollage from "@/components/template-landing/StepCollage";
import Label from "@/components/template-landing/Label";
import { ease, frame, serif } from "@/components/template-landing/ui";

// What the section says, in the page's manner: titles in two parts, the last
// in the serif italic.
const INTRO = {
  title: [
    { lead: "From blank page", soft: "" },
    { lead: "to", soft: "published link." },
  ],
  text: "No code, no setup you won’t understand. Three steps, a live preview the whole way, and a link at the end you can share anywhere.",
};
// Each step, mixing the user's references: a hatched square, "Step 0X" on its
// side, a very large pale number behind a large title (a word and a serif
// italic phrase), the line in grey and, under a hairline, what the step covers
// as a short list in two columns: a small square in the primary colour and the
// word in small mono capitals, like the section labels (the user asked for
// this in place of tag pills and a link). Its picture is in the collage (StepCollage).
const ROWS = [
  { caps: "Choose", soft: "a template", tags: ["Portfolio", "Photography", "Events", "Switch any time"] },
  { caps: "Make it", soft: "yours", tags: ["Colours", "Fonts", "Layout", "Live preview"] },
  { caps: "Publish", soft: "and share", tags: ["portory.net/you", "One link", "Free"] },
];

// A step's row, its opacity following the scroll so the steps hand over to
// each other: a row is full while it sits in the middle of the screen, fades in
// (rising a little) as it comes up from below and fades out as it leaves at the
// top, so the one above fades out while the one below fades in. The first is
// full from the start and only fades out. Static with reduced motion. While it
// is at the middle of the screen it is the step the collage shows (onActive).
function ScrollRow({ first, onActive, className, children }: { first: boolean; onActive: () => void; className: string; children: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const FADED = 0.08;
  const opacity = useTransform(scrollYProgress, [0, 0.38, 0.62, 0.95], still ? [1, 1, 1, 1] : first ? [1, 1, 1, FADED] : [FADED, 1, 1, FADED]);
  const y = useTransform(scrollYProgress, [0, 0.38], still || first ? [0, 0] : [36, 0]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.3 && v < 0.7) onActive();
  });
  return (
    <motion.li ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.li>
  );
}

// How it works, after the Monolog reference's services (the user asked): the
// heading at the top as in the other sections (the label on the left, the
// title in two lines rising out of masks from the grid's second line, its last
// words in the serif italic, and the line beside it); under it the steps on
// the left, one to most of a screen's height, and on the right the collage
// held in place, showing the step at the middle of the screen. On phones and
// tablets each step has its own collage under its text.
// The section's orange is the street drawing's (the dark theme's shade, #d96a3a; the
// user asked), for its drawings, the list's squares and the collage's tint.
export default function Steps() {
  const [active, setActive] = useState(0);
  return (
    <section id="how-it-works" data-caption="steps" aria-labelledby="tl-steps-title" className="relative scroll-mt-20 bg-[var(--warm)] py-[clamp(4.5rem,8.2vw,7.5rem)] [--accent:#d96a3a]">
      <div className={`${frame} grid gap-10 lg:grid-cols-4 lg:gap-0`}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease }} className="flex flex-col gap-1.5">
          <Label>{STEPS.label}</Label>
        </motion.div>
        <div className="flex flex-col gap-6 lg:col-span-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          {/* The title's lines rise out of their masks together, set off by the title coming into view. */}
          <motion.h2 id="tl-steps-title" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="m-0 text-[clamp(2rem,3.3vw,3rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            {INTRO.title.map(({ lead, soft }, i) => (
              <span key={lead} className="block overflow-hidden pb-[0.08em] sm:whitespace-nowrap">
                <motion.span variants={{ hidden: { y: "105%" }, shown: { y: "0%", transition: { duration: 1, ease, delay: i * 0.08 } } }} className="block">
                  {lead}
                  {soft && (
                    <>
                      {" "}
                      <span className={`${serif} tracking-[-0.03em]`}>{soft}</span>
                    </>
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease, delay: 0.15 }} className="m-0 max-w-[21rem] pb-[0.35rem] text-[0.875rem] leading-[1.5] tracking-[-0.005em] text-[var(--dim)]">
            {INTRO.text}
          </motion.p>
        </div>
      </div>

      <div className={`${frame} mt-[clamp(3rem,6vw,5rem)] grid lg:grid-cols-4`}>
        {/* The steps, handing over to each other with the scroll (ScrollRow). */}
        <ol className="m-0 list-none p-0 lg:col-span-2">
          {STEPS.items.map((step, i) => {
            const row = ROWS[i];
            return (
              <ScrollRow
                key={step.title}
                first={i === 0}
                onActive={() => setActive(i)}
                className="group flex flex-col gap-10 border-0 border-t border-solid border-[var(--line)] py-[clamp(2rem,3.4vw,3rem)] lg:min-h-[72vh] lg:justify-center lg:border-t-0"
              >
                <div className="relative flex min-w-0 flex-col pl-[clamp(2.75rem,4vw,3.5rem)]">
                  {/* After the user's "Step 03" reference: a hatched square, the step set on
                      its side, a very large pale number behind and the title over it. */}
                  <span aria-hidden="true" className="absolute left-0 top-0 block size-[clamp(3.75rem,5vw,4.75rem)] bg-[repeating-linear-gradient(135deg,var(--line)_0_1px,transparent_1px_8px)]" />
                  <span aria-hidden="true" className="absolute bottom-[clamp(4.5rem,6vw,6rem)] left-[0.6rem] font-mono text-[0.75rem] tracking-[0.12em] text-[var(--dim)] [writing-mode:vertical-rl] rotate-180">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="pointer-events-none absolute left-[clamp(2rem,3vw,2.75rem)] top-[clamp(1rem,1.6vw,1.5rem)] select-none text-[clamp(6rem,10vw,9.5rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-[color-mix(in_srgb,var(--fg)_5%,transparent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative m-0 mt-[clamp(3.75rem,5.4vw,5.25rem)] text-[clamp(2rem,3.2vw,3rem)] font-medium leading-[1.02] tracking-[-0.045em]">
                    {row.caps} <span className={`${serif} font-normal tracking-[-0.02em]`}>{row.soft}.</span>
                  </h3>
                  <p className="m-0 mt-4 max-w-[25rem] text-[clamp(1rem,1.15vw,1.0625rem)] leading-[1.55] tracking-[-0.01em] text-[var(--dim)]">{step.text}</p>
                  <ul className="m-0 mt-6 grid max-w-[25rem] list-none grid-cols-2 gap-x-6 gap-y-2.5 border-0 border-t border-solid border-[var(--line)] p-0 pt-5">
                    {row.tags.map((tag) => (
                      <li key={tag} className="flex items-center gap-2.5 font-mono text-[0.75rem] uppercase leading-[1.3] tracking-[0.06em] text-[var(--fg)]">
                        <span aria-hidden="true" className="block size-[0.4375rem] shrink-0 bg-[var(--accent)]" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <StepCollage step={i} className="aspect-[5/6] w-full max-w-[22rem] lg:hidden" />
              </ScrollRow>
            );
          })}
        </ol>
        {/* The collage, held at the middle of the screen while the steps pass. */}
        <div className="hidden lg:col-span-2 lg:flex lg:justify-center">
          <StepCollage step={active} className="sticky top-[max(6rem,calc(50vh_-_min(15rem,34vh)))] aspect-[5/6] h-[min(30rem,68vh)] self-start" />
        </div>
      </div>
    </section>
  );
}
