"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoveRight, Shuffle } from "lucide-react";
import { StyleChips, other, useStageScale } from "@/components/landing/Styler";
import { fit } from "@/components/landing/landing-ui";
import { useScrollValue } from "@/components/landing/scroll-fx";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { FontCard, PaletteCard, glowOf, signature } from "@/components/template-detail/StyleCards";
import { COLOR_PALETTES, FONT_PACKS, findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import { DESIGN } from "@/components/other-landing/content";
import { Heading, Reveal } from "@/components/other-landing/parts";
import { buttonArrow, buttons, colors, ease, focusRing, frame, section, type } from "@/components/other-landing/ui";

// Wide screens preview the template's desktop layout; phones its phone layout.
const WIDE = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useWide = () => useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);

// /template-landing's Make it yours, under this page's heading: the real
// template restyling live, the palette and font cards over its right edge
// (two chips over its corner below xl), a glow in the chosen palette behind
// it, and a foot naming the pairing with Get started and Shuffle. It grows to
// full size as it scrolls up the screen.
export default function Design() {
  const [palette, setPalette] = useState(COLOR_PALETTES[0].id);
  const [font, setFont] = useState(FONT_PACKS[0].id);
  const wide = useWide();
  const stageRef = useStageScale();
  const [growRef, grow] = useScrollValue<HTMLDivElement>([0.86, 1], ["start end", "start 0.3"]);
  const template = getTemplateDetail(DESIGN.template);
  if (!template) return null;

  const activePalette = findPalette(palette);
  const activeFont = findFontPack(font);
  const shuffle = () => {
    setPalette(other(COLOR_PALETTES, palette));
    setFont(other(FONT_PACKS, font));
  };

  return (
    <section id="make-it-yours" aria-labelledby="design-title" className={`${frame} ${section} ${themeFontVariables}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Heading id="design-title" label={DESIGN.label} lines={DESIGN.title} />
        <Reveal>
          <p className={`m-0 max-w-[26rem] ${type.body} ${colors.body}`}>{DESIGN.text}</p>
        </Reveal>
      </div>

      <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.1, ease }} className="relative isolate mt-[clamp(2.5rem,4vw,3.5rem)]">
        <motion.div ref={growRef} style={{ scale: grow }} className="relative origin-top">
          <AnimatePresence initial={false}>
            <motion.div key={activePalette.id} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }} className="pointer-events-none absolute inset-0 -z-10">
              <span style={{ backgroundColor: glowOf(activePalette) }} className="absolute -right-24 -top-24 size-[34rem] max-w-full rounded-full opacity-15 blur-3xl lg:opacity-30" />
              <span style={{ backgroundColor: glowOf(activePalette) }} className="absolute -bottom-24 left-1/3 size-[28rem] max-w-full rounded-full opacity-10 blur-3xl lg:opacity-20" />
            </motion.div>
          </AnimatePresence>

          <div ref={stageRef} className="relative">
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
              <PaletteCard value={palette} onChange={setPalette} mark="ol-design-palette" />
              <FontCard value={font} onChange={setFont} accent={signature(activePalette)} mark="ol-design-font" />
            </div>
          </div>

          {/* The foot: what the template is showing now, and the buttons. */}
          <div className={`mt-10 flex flex-col gap-5 border-0 border-t border-solid ${colors.line} pt-6 sm:flex-row sm:items-center sm:justify-between`}>
            <p aria-live="polite" className={`m-0 flex min-w-0 items-center gap-2.5 ${type.small} ${colors.quiet}`}>
              <span aria-hidden="true" className="flex shrink-0 -space-x-1">
                {activePalette.swatches.map((swatch, index) => <span key={index} className={`size-3.5 rounded-full ring-2 ring-white transition-colors duration-500 ${swatch}`} />)}
              </span>
              <span className="min-w-0">
                <span className="font-medium text-[#090909]">{template.name}</span> in {activePalette.name}, with {activeFont.name} type
              </span>
            </p>
            <div className="flex shrink-0 gap-2">
              <Link href={DESIGN.start.href} className={buttons.dark}>
                {DESIGN.start.label}
                <MoveRight aria-hidden="true" className={buttonArrow} />
              </Link>
              <button type="button" onClick={shuffle} className={`${focusRing} ${buttons.light} cursor-pointer border-0`}>
                <Shuffle aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/button:rotate-12" />
                {DESIGN.shuffle}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
