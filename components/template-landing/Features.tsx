"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Lock, MousePointerClick, Repeat, Smartphone, type LucideIcon } from "lucide-react";
import { FEATURES as CARDS } from "@/components/other-landing/content";
import FeatureArt from "@/components/template-landing/FeatureArt";
import Label from "@/components/template-landing/Label";
import { ease, frame, serif, themes } from "@/components/template-landing/ui";

const FEATURES = {
  label: "Features",
  // Two lines, as on /landing: the second ends on the one word in the serif italic.
  title: [{ lead: "Everything you need,", soft: "" }, { lead: "nothing in the", soft: "way." }],
};

const ICONS: Record<(typeof CARDS.items)[number]["id"], LucideIcon> = {
  screens: Smartphone,
  switch: Repeat,
  address: Link2,
  edit: MousePointerClick,
  draft: Lock,
};

// The address card in the page's one address form.
const ADDRESS_TEXT = "Publish to portory.net/you and share one link everywhere.";


// Features: the label on the left and the title in two lines from the grid's
// second line (its last word in the serif italic). Under it, after the Opus
// reference's process row (the user asked for it) in the page's own card
// design: the five features in one row of cards, one open and wide with its
// number, icon, a small drawing of the feature (FeatureArt), its title and
// line; the others narrow, with the number, icon and a greyed title.
// Pointing at a card (or focusing or tapping it) opens it while the others
// narrow. On phones and tablets all five stack, each open. They rise into
// place as the section comes in. The section is dark (the page's dark theme
// colours, the user asked), the cards near-black with a fine outline, as on Opus.
export default function Features() {
  const [open, setOpen] = useState(0);
  return (
    <section id="features" data-caption="features" aria-labelledby="tl-features-title" className={`relative scroll-mt-20 bg-[var(--bg)] text-[var(--fg)] py-[clamp(4.5rem,8.2vw,7.5rem)] ${themes.dark}`}>
      <div className={`${frame} grid gap-10 lg:grid-cols-4 lg:gap-0`}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease }} className="flex flex-col gap-1.5">
          <Label>{FEATURES.label}</Label>
        </motion.div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:col-span-3">
          {/* The title's lines rise out of their masks together, set off by the title coming into view. */}
          <motion.h2 id="tl-features-title" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="m-0 text-[length:clamp(2.25rem,calc(1.6rem_+_2.2vw),3.5rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            {FEATURES.title.map(({ lead, soft }, i) => (
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
        </div>
      </div>

      <ul className={`${frame} m-0 mt-14 flex list-none flex-col gap-[0.625rem] lg:h-[clamp(23rem,29vw,27rem)] lg:flex-row`}>
        {CARDS.items.map((item, i) => {
          const Icon = ICONS[item.id];
          const wide = open === i;
          return (
            <motion.li
              key={item.id}
              tabIndex={0}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              aria-expanded={wide}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1, ease, delay: i * 0.06 }}
              className={`group relative flex min-w-0 cursor-pointer flex-col justify-between gap-4 overflow-hidden border border-solid border-[var(--line)] bg-[#0a0a0a] p-[clamp(1.25rem,1.8vw,1.75rem)] outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[var(--fg)] motion-reduce:transition-none  lg:basis-0 ${wide ? "lg:grow-[2.6]" : "lg:grow"}`}
            >
              {/* Top: the number and the icon. */}
              <span className="flex items-center justify-between font-mono text-[0.75rem] tracking-[0.04em] text-[color-mix(in_srgb,var(--fg)_55%,transparent)]">
                {String(i + 1).padStart(2, "0")}
                <Icon aria-hidden="true" strokeWidth={2} className={`size-5 transition-colors duration-500 ${wide ? "text-[var(--fg)]" : "text-[color-mix(in_srgb,var(--fg)_40%,transparent)] max-lg:text-[var(--fg)]"}`} />
              </span>
              {/* The middle: the card's drawing, in the open card (always, on phones and tablets). */}
              <span className={`grid flex-1 place-items-center py-6 transition-[opacity,transform] duration-500 motion-reduce:transition-none lg:min-w-[20rem] ${wide ? "scale-100 opacity-100 delay-150" : "lg:pointer-events-none lg:scale-95 lg:opacity-0"}`}>
                <FeatureArt id={item.id} />
              </span>
              {/* The foot: the title, and the line in the open card. */}
              <span className="flex flex-col gap-2">
                {/* The title keeps one width, a closed card's (the row's width less its four gaps, over 6.6 shares, less the padding), so it wraps the same way open or closed and does not re-wrap, and jump, while the cards resize. */}
                <h3 className={`m-0 lg:w-[calc((min(100vw,90rem)_-_2*clamp(1.5rem,3vw,3rem)_-_2.5rem)/6.6_-_2*clamp(1.25rem,1.8vw,1.75rem)_-_2px)] text-[length:clamp(1.125rem,calc(0.95rem_+_0.4vw),1.375rem)] font-medium leading-[1.2] tracking-[-0.02em] transition-colors duration-500 ${wide ? "text-[var(--fg)]" : "text-[color-mix(in_srgb,var(--fg)_45%,transparent)] max-lg:text-[var(--fg)]"}`}>{item.title}</h3>
                <p className={`m-0 max-w-[24rem] text-[0.9375rem] leading-[1.5] text-[var(--dim)] overflow-hidden transition-[opacity,max-height] duration-500 motion-reduce:transition-none lg:min-w-[20rem] ${wide ? "max-h-24 opacity-100 delay-200" : "lg:pointer-events-none lg:max-h-0 lg:opacity-0"}`}>
                  {item.id === "address" ? ADDRESS_TEXT : item.text}
                </p>
              </span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
