"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Cover from "@/components/other-landing/Cover";
import CoverPhoto from "@/components/template-landing/CoverPhoto";
import { GRID } from "@/components/template-landing/content";
import Button from "@/components/template-landing/Button";
import Label from "@/components/template-landing/Label";
import { ease, focusRing, frame, pad, serif } from "@/components/template-landing/ui";


// The cards in the Endcap reference's selected-work manner (the user asked),
// all one size: near-square cards two to a row, the right one set lower. On
// phones they stack. Each opens its demo in a new tab. Under
// each cover, after the Endcap reference's selected work (the user asked): a
// dark hairline, then the number on the left and beside it the name, large,
// over its kind in small grey.

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
          <motion.h2 id="tl-templates-title" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="m-0 text-[clamp(2rem,3.3vw,3rem)] font-medium leading-[0.96] tracking-[-0.055em]">
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
          const shape = "tile";
          return (
            <motion.li key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -5% 0px" }} transition={{ duration: 1, ease, delay: (i % 2) * 0.08 }} className="md:even:mt-[clamp(3rem,7vw,6.25rem)]">
              <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${focusRing} group block rounded-[10px] text-[var(--fg)] no-underline`}>
                <span className="relative block">
                  {item.photo ? <CoverPhoto src={item.photo.src} ground={item.photo.ground} focus={item.photo.focus} name={item.name} shape={shape} fit={!item.photo.fill} whole={item.photo.fill} /> : <Cover src={item.screen} name={item.name} shape={shape} drift />}
                  {/* After the Opus reference: on hover a white circle with an arrow in the primary colour comes up at the card's bottom right. */}
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-[clamp(1rem,1.8vw,1.5rem)] right-[clamp(1rem,1.8vw,1.5rem)] grid size-14 translate-y-2 scale-90 place-items-center rounded-full bg-white text-[var(--accent)] opacity-0 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.25)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                    <ArrowUpRight className="size-6" strokeWidth={1.75} />
                  </span>
                </span>
                <span className="mt-[clamp(1rem,1.5vw,1.375rem)] grid grid-cols-[clamp(2.75rem,4.7vw,4.25rem)_minmax(0,1fr)] border-0 border-t border-solid border-[var(--fg)] pt-[clamp(1.5rem,2.5vw,2.25rem)]">
                  <span className="pt-[0.75em] font-mono text-[0.8125rem] font-medium tracking-[0.02em]">{pad(i + 1)}</span>
                  <span className="flex min-w-0 flex-col gap-[clamp(0.375rem,0.7vw,0.625rem)]">
                    <span className="text-[length:clamp(1.125rem,calc(0.9rem_+_0.6vw),1.5rem)] font-medium leading-[1.15] tracking-[-0.03em]">{item.name}</span>
                    <span className="text-[0.8125rem] leading-[1.4] tracking-[-0.005em] text-[var(--dim)]">{item.tags.join(" · ")}</span>
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
