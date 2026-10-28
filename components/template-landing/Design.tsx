"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { motion, useTransform } from "framer-motion";
import { Shuffle } from "lucide-react";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { COLOR_PALETTES, FONT_PACKS, findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import { DESIGN } from "@/components/template-landing/content";
import { Rise, Words, useScrollValue } from "@/components/template-landing/scroll-fx";
import { corner, cornerLink, focusRing, frame, grid, type } from "@/components/template-landing/ui";

// Wide screens preview the template's desktop layout; phones its phone layout.
const WIDE = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useWide = () => useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);

// A different random pick from a list.
const other = <T extends { id: string }>(list: T[], current: string) => {
  const rest = list.filter((item) => item.id !== current);
  return rest[Math.floor(Math.random() * rest.length)].id;
};

const option = `${focusRing} flex w-full cursor-pointer items-center gap-3 rounded-[4px] border-0 bg-transparent px-0 py-2 text-left transition-colors duration-300`;

// Make it yours, the home page's styler in the grid: the label, title and
// line across the top; then the real template (the same one the home page
// uses) across three columns, restyling live, and in the fourth the editor's
// colour palettes and font pairings as lists (the chosen one dark, a square
// filled beside it). Underneath, the pairing on show, Get started and
// Shuffle, which tries a random pairing.
export default function Design() {
  const [palette, setPalette] = useState(COLOR_PALETTES[0].id);
  const [font, setFont] = useState(FONT_PACKS[0].id);
  const wide = useWide();
  // The live template grows to full size as it scrolls up to the middle.
  const [stageRef, grow] = useScrollValue<HTMLDivElement>([0.82, 1], ["start end", "start 0.25"]);
  const round = useTransform(grow, [0.82, 1], [40, 0]);
  const template = getTemplateDetail(DESIGN.template);
  if (!template) return null;

  const activePalette = findPalette(palette);
  const activeFont = findFontPack(font);
  const shuffle = () => {
    setPalette(other(COLOR_PALETTES, palette));
    setFont(other(FONT_PACKS, font));
  };

  const mark = (on: boolean) => (
    <span aria-hidden="true" className={`size-[0.45rem] shrink-0 border border-solid border-current transition-colors duration-300 ${on ? "bg-current" : "bg-transparent"}`} />
  );

  return (
    <section id="make-it-yours" data-caption="design" aria-labelledby="tl-design-title" className={`relative scroll-mt-20 border-0 border-t border-solid border-[var(--line)] py-[clamp(5rem,12vh,9rem)] ${themeFontVariables}`}>
      <div className={`${frame} ${grid} gap-y-10`}>
        <p className={`m-0 ${type.body}`}>{DESIGN.label}</p>
        <h2 id="tl-design-title" className={`m-0 lg:col-span-2 ${type.title}`}>
          <Words text={DESIGN.title} />
        </h2>
        <p className={`m-0 self-end ${type.body} text-[var(--dim)] lg:pl-[clamp(1rem,1.75vw,2rem)]`}>{DESIGN.text}</p>

        <div ref={stageRef} className="min-w-0 lg:col-span-3 lg:pr-[clamp(1rem,1.75vw,2rem)]">
          <motion.div style={{ scale: grow, borderRadius: round }} className="origin-top overflow-hidden">
            <PreviewFrame template={template} device={wide ? "desktop" : "mobile"} palette={palette} font={font} fill fillPhone height={wide ? "aspect-[16/10]" : "h-[min(76vh,46rem)]"} />
          </motion.div>
        </div>

        <Rise delay={0.15} className="flex flex-col gap-8 lg:pl-[clamp(1rem,1.75vw,2rem)]">
          <div role="radiogroup" aria-label={DESIGN.colours} className="flex flex-col">
            <p className={`m-0 mb-2 ${type.small} text-[var(--dim)]`}>{DESIGN.colours}</p>
            {COLOR_PALETTES.map((item) => {
              const on = item.id === palette;
              return (
                <button key={item.id} type="button" role="radio" aria-checked={on} onClick={() => setPalette(item.id)} className={`${option} border-b border-solid border-[var(--line)] ${on ? "text-[var(--fg)]" : "text-[var(--dim)] hover:text-[var(--fg)]"}`}>
                  {mark(on)}
                  <span className={`flex-1 ${type.body}`}>{item.name}</span>
                  <span aria-hidden="true" className="flex">
                    {[...item.swatches.slice(0, 3), item.muted, item.swatches[3]].map((swatch, i) => (
                      <span key={i} className={`size-3.5 border border-solid border-[var(--line)] ${swatch}`} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div role="radiogroup" aria-label={DESIGN.fonts} className="flex flex-col">
            <p className={`m-0 mb-2 ${type.small} text-[var(--dim)]`}>{DESIGN.fonts}</p>
            {FONT_PACKS.map((item) => {
              const on = item.id === font;
              return (
                <button key={item.id} type="button" role="radio" aria-checked={on} onClick={() => setFont(item.id)} className={`${option} border-b border-solid border-[var(--line)] ${on ? "text-[var(--fg)]" : "text-[var(--dim)] hover:text-[var(--fg)]"}`}>
                  {mark(on)}
                  <span className={`flex-1 ${type.body}`}>{item.name}</span>
                  <span aria-hidden="true" className={`text-[1.25rem] leading-none ${item.heading}`}>Aa</span>
                </button>
              );
            })}
          </div>
        </Rise>

        <div className="flex flex-col gap-5 border-0 border-t border-solid border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between lg:col-span-4">
          <p aria-live="polite" className={`m-0 ${type.small} text-[var(--dim)]`}>
            <span className="font-semibold text-[var(--fg)]">{template.name}</span> in {activePalette.name}, with {activeFont.name} type
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <button type="button" onClick={shuffle} className={`${focusRing} group/shuffle inline-flex cursor-pointer items-center gap-2 rounded-[4px] border-0 bg-transparent p-0 text-[1.125rem] font-semibold tracking-[-0.02em] text-[var(--dim)] transition-colors hover:text-[var(--fg)]`}>
              <Shuffle aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/shuffle:rotate-12" />
              {DESIGN.shuffle}
            </button>
            <Link href={DESIGN.start.href} className={`${cornerLink} text-[1.125rem]`}>
              {DESIGN.start.label}
              <span aria-hidden="true" className={corner} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
