"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { FontCard, PaletteCard, signature } from "@/components/template-detail/StyleCards";
import { COLOR_PALETTES, FONT_PACKS, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import { DESIGN } from "@/components/template-landing/content";
import { Words } from "@/components/template-landing/scroll-fx";
import { corner, cornerLink, ease, frame, grid, type } from "@/components/template-landing/ui";

// Wide screens preview the template's desktop layout; phones its phone layout.
const WIDE = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useWide = () => useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);

// Make it yours, laid out like the Moire reference's "Recognition": the
// label and title from the first line; then a wide picture across the two
// middle columns (the real template, restyling live, opening from its top as
// it comes into view) with a vertical label at its left edge naming it; and
// in the fourth column the home page's palette and font cards, stacked, which
// restyle it. The intro and Get started sit in the first column.
export default function Design() {
  const [palette, setPalette] = useState(COLOR_PALETTES[0].id);
  const [font, setFont] = useState(FONT_PACKS[0].id);
  const wide = useWide();
  const template = getTemplateDetail(DESIGN.template);
  if (!template) return null;

  return (
    <section id="make-it-yours" data-caption="design" aria-labelledby="tl-design-title" className={`relative scroll-mt-20 border-0 border-t border-solid border-[var(--line)] py-[clamp(5rem,12vh,9rem)] ${themeFontVariables}`}>
      <div className={`${frame} ${grid} gap-y-[clamp(2.5rem,6vh,4rem)]`}>
        {/* The heading, from the first line. */}
        <div className="flex flex-col gap-2 lg:col-span-4">
          <p className={`m-0 ${type.kicker}`}>{DESIGN.label}</p>
          <h2 id="tl-design-title" className={`m-0 ${type.heading}`}>
            <Words text={`${DESIGN.title}.`} />
          </h2>
        </div>

        {/* Column 1: the intro and Get started, at the picture's foot. */}
        <div className="order-last flex flex-col items-start gap-5 lg:order-none lg:row-start-2 lg:self-end lg:pr-[clamp(1rem,1.75vw,2rem)]">
          <p className={`m-0 max-w-[24rem] ${type.body} text-[var(--dim)]`}>{DESIGN.text}</p>
          <Link href={DESIGN.start.href} className={`${cornerLink} text-[1.125rem]`}>
            {DESIGN.start.label}
            <span aria-hidden="true" className={corner} />
          </Link>
        </div>

        {/* Columns 2 and 3: the live template, wide, with its vertical label. */}
        <div className="relative min-w-0 lg:col-span-2 lg:col-start-2 lg:row-start-2">
          <span aria-hidden="true" className="absolute right-full top-[clamp(2.5rem,5vw,4rem)] hidden -translate-x-[0.9rem] whitespace-nowrap text-[0.875rem] [writing-mode:vertical-rl] rotate-180 lg:block">
            {template.name}
          </span>
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.2, ease }}
            className="overflow-hidden"
          >
            <PreviewFrame template={template} device={wide ? "desktop" : "mobile"} palette={palette} font={font} fill fillPhone height={wide ? "aspect-[16/7]" : "h-[min(70vh,40rem)]"} />
          </motion.div>
        </div>

        {/* Column 4: the home page's palette and font cards, stacked. */}
        <div className="flex min-w-0 flex-col justify-center gap-4 text-[#1a1a1a] lg:col-start-4 lg:row-start-2 lg:pl-[clamp(1rem,1.75vw,2rem)]">
          <PaletteCard value={palette} onChange={setPalette} mark="tl-design-palette" />
          <FontCard value={font} onChange={setFont} accent={signature(findPalette(palette))} mark="tl-design-font" />
        </div>
      </div>
    </section>
  );
}
