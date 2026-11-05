"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Cover from "@/components/other-landing/Cover";
import CoverPhoto from "@/components/template-landing/CoverPhoto";
import { GRID } from "@/components/template-landing/content";
import Button from "@/components/template-landing/Button";
import Label from "@/components/template-landing/Label";
import { ease, focusRing, frame, serif } from "@/components/template-landing/ui";


// The cards in the Endcap reference's selected-work manner (the user asked),
// all one size: near-square, two to a row filling their columns, the right one
// set lower; on phones they stack, full width, as 3:2 rectangles (the user asked).
// Each opens its demo in a new tab. Under
// each cover, after the Opus reference's project cards (the user asked): the
// name on the left and, on the right of the same line, its tags as small
// outlined pills (they wrap under the name when there is no room).

export default function Templates() {
  return (
    <section id="templates" data-caption="templates" aria-labelledby="tl-templates-title" className={`${frame} relative scroll-mt-20 py-[clamp(4.5rem,8.2vw,7.5rem)]`}>
      {/* The header, in the page's section-title manner (as Features'): on the left
          "01 — Templates" over a small mono line; from the grid's second line the
          title in two lines rising out of masks (its last word in the serif italic),
          and on the right, small, a quiet line (the user moved it there). */}
      <div className="grid gap-10 lg:grid-cols-4 lg:gap-0">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease }} className="flex flex-col gap-1.5">
          <Label>{GRID.label}</Label>
        </motion.div>
        <div className="flex flex-col gap-[clamp(1.25rem,2vw,1.75rem)] lg:col-span-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <motion.h2 id="tl-templates-title" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="m-0 text-[length:clamp(2.25rem,calc(1.6rem_+_2.2vw),3.5rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            {GRID.title.map(({ lead, soft }, i) => (
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
            {GRID.text}
          </motion.p>
        </div>
      </div>
      <ul className="m-0 mt-[clamp(3rem,5vw,4.5rem)] grid list-none grid-cols-1 items-start gap-x-[clamp(1rem,2.2vw,2rem)] gap-y-[clamp(3rem,7vw,6.5rem)] p-0 md:grid-cols-2">
        {GRID.items.map((item, i) => {
          const shape = "landscape";
          return (
            <motion.li key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -5% 0px" }} transition={{ duration: 1, ease, delay: (i % 2) * 0.08 }} className="md:even:mt-[clamp(3rem,7vw,6.25rem)]">
              <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${focusRing} group block rounded-[10px] text-[var(--fg)] no-underline`}>
                <span className="relative block">
                  {item.photo ? <CoverPhoto src={item.photo.src} ground={item.photo.ground} focus={item.photo.focus} name={item.name} shape={shape} fit={!item.photo.fill && !item.photo.contain} whole={item.photo.fill} contain={item.photo.contain} corner={item.photo.corner} /> : <Cover src={item.screen} name={item.name} shape={shape} drift />}
                  {/* After the Opus reference: on hover a white circle with an arrow in the primary colour comes up at the card's bottom right. */}
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-[clamp(1rem,1.8vw,1.5rem)] right-[clamp(1rem,1.8vw,1.5rem)] grid size-14 translate-y-2 scale-90 place-items-center rounded-full bg-white text-[var(--accent)] opacity-0 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.25)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                    <ArrowUpRight className="size-6" strokeWidth={1.75} />
                  </span>
                </span>
                <span className="mt-[clamp(0.75rem,1.1vw,1rem)] flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
                  <span className="text-[length:clamp(1.5rem,calc(1.1rem_+_1vw),2.125rem)] font-normal leading-[1.1] tracking-[-0.035em]">{item.name}</span>
                  <span className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-[10px] border border-solid border-[color-mix(in_srgb,var(--fg)_40%,transparent)] px-2.5 py-[0.3rem] text-[0.875rem] leading-[1.2] tracking-[-0.01em] text-[color-mix(in_srgb,var(--fg)_70%,transparent)]">
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>
              </a>
            </motion.li>
          );
        })}
      </ul>
      {/* Every template, under the grid, centred, in the page's button style. */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -5% 0px" }} transition={{ duration: 0.9, ease }} className="mt-[clamp(3rem,5vw,4.5rem)] flex justify-center">
        <Button href={GRID.link.href} label={GRID.link.label} tone="light" />
      </motion.div>
    </section>
  );
}
