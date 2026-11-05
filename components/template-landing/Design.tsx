"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { StyleChips, other, useStageScale } from "@/components/landing/Styler";
import { fit } from "@/components/landing/landing-ui";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { FontCard, PaletteCard, signature } from "@/components/template-detail/StyleCards";
import { COLOR_PALETTES, FONT_PACKS, findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import { DESIGN } from "@/components/template-landing/content";
import Label from "@/components/template-landing/Label";
import Button from "@/components/template-landing/Button";
import { ease, frame, serif } from "@/components/template-landing/ui";

// Wide screens preview the template's desktop layout; phones its phone layout.
const WIDE = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useWide = () =>
  useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );

// The heading, in Features' manner: two lines, the last word in the serif italic.
const TITLE = [
  { lead: "Make it yours", soft: "" },
  { lead: "in a", soft: "click." },
];

// Make it yours, laid out like the FAQ (the user asked): on the left, held in
// place, the label, the title in two lines rising out of masks (its last word
// in the serif italic) and the line; on the right, across three columns, the home page's own
// "Make it yours" composition (components/landing/Styler): the real template
// restyling live, the palette and font cards over its right edge (no glow
// behind it: the user removed it), and a foot naming the pairing with Get started and
// Shuffle.
export default function Design() {
  const [palette, setPalette] = useState(COLOR_PALETTES[0].id);
  const [font, setFont] = useState(FONT_PACKS[0].id);
  const wide = useWide();
  const stageRef = useStageScale();
  const template = getTemplateDetail(DESIGN.template);
  if (!template) return null;

  const activePalette = findPalette(palette);
  const activeFont = findFontPack(font);
  const shuffle = () => {
    setPalette(other(COLOR_PALETTES, palette));
    setFont(other(FONT_PACKS, font));
  };

  return (
    <section id="make-it-yours" data-caption="design" aria-labelledby="tl-design-title" className={`relative scroll-mt-20 py-[clamp(4.5rem,8.2vw,7.5rem)] ${themeFontVariables}`}>
      <div className={`${frame} grid gap-10 lg:grid-cols-4 lg:gap-0`}>
        {/* On the left, held while the preview passes (as in the FAQ; the user asked): the label, the title and the line. */}
        <div className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start lg:pr-[clamp(1rem,2vw,2.5rem)]">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease }} className="flex flex-col gap-6">
            <Label>{DESIGN.label}</Label>
          </motion.div>
          {/* The title's lines rise out of their masks together, set off by the title coming into view. */}
          <motion.h2 id="tl-design-title" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="m-0 text-[length:clamp(2.25rem,calc(1.6rem_+_2.2vw),3.5rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            {TITLE.map(({ lead, soft }, i) => (
              <span key={lead} className="block overflow-hidden pb-[0.08em] sm:whitespace-nowrap lg:whitespace-normal 2xl:whitespace-nowrap">
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
          {/* The section's line, small, under the title. */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="m-0 max-w-[21rem] text-[0.875rem] leading-[1.5] tracking-[-0.005em] text-[var(--dim)]"
          >
            {DESIGN.text}
          </motion.p>
        </div>

        {/* On the right, the home page's composition: the live template as the base layer with the palette
          and font cards over its right edge (two chips over its corner below xl), and a foot naming the pairing with Get
          started and Shuffle. It rises in once, like every section; nothing on it moves
          with the scroll (a scaling live preview made the page stutter). */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease }} className="relative isolate min-w-0 lg:col-span-3">
          <div className="relative">
            {/* The pickers' smallest labels (9–10px, shared with the editor) set at 11–12px here, so they read on a landing page. */}
            <div ref={stageRef} className="relative [&_.text-\[0\.5625rem\]]:text-[0.6875rem] [&_.text-\[10px\]]:text-[0.75rem]">
              <div className="relative isolate flex min-w-0 justify-center lg:justify-start xl:mr-[calc(12rem*var(--s,1))]">
                <span aria-hidden="true" className="absolute inset-y-4 left-0 right-2 -z-10 rounded-[3rem] bg-white/50 blur-3xl lg:hidden" />
                <span aria-hidden="true" className="absolute inset-x-[14%] top-0 -z-10 hidden h-8 -translate-y-1/3 rounded-full bg-black/[0.05] blur-2xl lg:block" />
                <span aria-hidden="true" className="absolute inset-x-[12%] bottom-0 -z-10 hidden h-10 translate-y-1/3 rounded-full bg-black/[0.09] blur-2xl lg:block" />
                {/* The template is a picture here, not a page: it does not take the scroll (or clicks) from the page; the pickers restyle it. */}
                <div className="relative w-full text-[#1a1a1a] [&_iframe]:pointer-events-none">
                  <PreviewFrame template={template} device={wide ? "desktop" : "mobile"} palette={palette} font={font} fill fillPhone height={wide ? fit.previewDesktop : fit.previewHeight} />
                  <StyleChips palette={palette} font={font} onPalette={setPalette} onFont={setFont} accent={signature(activePalette)} />
                </div>
              </div>
              <div className="absolute right-0 top-1/2 z-10 hidden w-[21rem] origin-right -translate-y-1/2 scale-[var(--s,1)] flex-col gap-4 text-[#1a1a1a] xl:flex">
                <PaletteCard value={palette} onChange={setPalette} mark="tl-design-palette" />
                <FontCard value={font} onChange={setFont} accent={signature(activePalette)} mark="tl-design-font" />
              </div>
            </div>

            {/* The foot: what the template is showing now, and the buttons. */}
            <div className="mt-8 flex flex-col gap-5 border-0 border-t border-solid border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className="m-0 flex min-w-0 items-center gap-2.5 text-[0.8125rem] text-[var(--dim)]">
                <span aria-hidden="true" className="flex shrink-0 -space-x-1">
                  {activePalette.swatches.map((swatch, index) => (
                    <span key={index} className={`size-3.5 rounded-full ring-2 ring-white transition-colors duration-500 ${swatch}`} />
                  ))}
                </span>
                <span className="min-w-0">
                  <span className="font-medium text-[var(--fg)]">{template.name}</span> · {activePalette.name} colours · {activeFont.name} fonts
                </span>
              </p>
              <div className="flex shrink-0 gap-3">
                <Button href={DESIGN.start.href} label={DESIGN.start.label} />
                <Button onClick={shuffle} label="Shuffle" tone="light" icon={<Shuffle aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/button:rotate-12" />} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
