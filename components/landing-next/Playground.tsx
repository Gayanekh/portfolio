"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Shuffle } from "lucide-react";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { themeFontVariables } from "@/components/template-detail/theme-options";
import { PLAYGROUND } from "@/components/landing-next/content";
import { Headline, Label, Reveal, useWide } from "@/components/landing-next/kit";
import { button, buttonArrow, focusRing, font, grain, shell, space, type } from "@/components/landing-next/ui";

// A different random pick from a list.
const other = <T extends { id: string }>(list: T[], current: string) => {
  const rest = list.filter((item) => item.id !== current);
  return rest[Math.floor(Math.random() * rest.length)].id;
};

const groupLabel = `${font.mono} text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--mist)]`;

// The playground, back in the night: on one side the editor's own palettes
// (each as its row of swatches) and font pairings (each named in its own
// type), with Shuffle; on the other a real template, live, restyling the
// moment one is picked, floating on an iris glow. A pill slides to the
// pick. Phones see the template's phone layout.
// `caption` adds a line under it naming the pairing on show.
export default function Playground({ copy = PLAYGROUND, index = "03", caption = false }: { copy?: typeof PLAYGROUND; index?: string; caption?: boolean }) {
  const wide = useWide();
  const [palette, setPalette] = useState(copy.palettes[0].id);
  const [font_, setFont] = useState(copy.fonts[0].id);
  const template = getTemplateDetail(copy.template);
  const activePalette = copy.palettes.find((p) => p.id === palette) ?? copy.palettes[0];
  const activeFont = copy.fonts.find((f) => f.id === font_) ?? copy.fonts[0];
  const shuffle = () => {
    setPalette(other(copy.palettes, palette));
    setFont(other(copy.fonts, font_));
  };

  return (
    <section id="playground" aria-label={copy.label} className={`relative isolate overflow-hidden rounded-[clamp(2rem,4vw,4.5rem)] bg-[var(--ink)] text-[var(--bone)] ${space} ${themeFontVariables}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute right-[-10%] top-[20%] size-[min(64rem,110vw)] rounded-full bg-[radial-gradient(circle,rgb(157_140_255/0.35),transparent_60%)]" />
        <span className="absolute bottom-[-30%] left-[-10%] size-[min(48rem,90vw)] rounded-full bg-[radial-gradient(circle,rgb(255_179_138/0.18),transparent_62%)]" />
        <span className={`absolute inset-0 mix-blend-overlay ${grain}`} />
      </div>

      <div className={`${shell} grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end`}>
        <div className="flex flex-col gap-6">
          <Reveal>
            <Label index={index} tone="dark">
              {copy.label}
            </Label>
          </Reveal>
          <Headline tone="dark" text={copy.title} className={`max-w-[14ch] ${type.title}`} />
        </div>
        <Reveal delay={0.1}>
          <p className={`m-0 ${type.lead} text-[var(--bone)]/70`}>{copy.text}</p>
        </Reveal>
      </div>

      <div className={`${shell} mt-[clamp(2.5rem,5vw,5rem)] grid gap-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-[4vw]`}>
        {/* The pickers. */}
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className={groupLabel}>{copy.colours}</span>
            <div role="radiogroup" aria-label={copy.colours} className="grid grid-cols-2 gap-1.5">
              {copy.palettes.map((option) => {
                const on = option.id === palette;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPalette(option.id)}
                    className={`${focusRing} group/swatch relative flex cursor-pointer items-center gap-2.5 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[0.875rem] transition-colors duration-300 ${on ? "text-[var(--bone)]" : "text-[var(--bone)]/55 hover:text-[var(--bone)]"}`}
                  >
                    {on && <motion.span layoutId="next-palette-pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} className="absolute inset-0 rounded-lg bg-white/[0.09] ring-1 ring-white/15" />}
                    <span aria-hidden="true" className="relative flex shrink-0 -space-x-1">
                      {option.swatches.map((swatch, k) => (
                        <span key={k} className={`size-4 rounded-full ring-2 ring-[var(--ink)] transition-transform duration-300 group-hover/swatch:-translate-y-0.5 ${swatch}`} />
                      ))}
                    </span>
                    <span className="relative">{option.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className={groupLabel}>{copy.type}</span>
            <div role="radiogroup" aria-label={copy.type} className="grid grid-cols-2 gap-1.5">
              {copy.fonts.map((option) => {
                const on = option.id === font_;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setFont(option.id)}
                    className={`${focusRing} relative flex cursor-pointer items-baseline gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left transition-colors duration-300 ${on ? "text-[var(--bone)]" : "text-[var(--bone)]/55 hover:text-[var(--bone)]"}`}
                  >
                    {on && <motion.span layoutId="next-font-pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} className="absolute inset-0 rounded-lg bg-white/[0.09] ring-1 ring-white/15" />}
                    <span aria-hidden="true" className={`relative text-[1.25rem] leading-none ${option.heading}`}>Aa</span>
                    <span className="relative text-[0.875rem]">{option.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={shuffle} className={button.ghost}>
              <Shuffle aria-hidden="true" className="size-4 transition-transform duration-500 group-hover/button:rotate-180" />
              {copy.shuffle}
            </button>
            <Link href={copy.start.href} className={button.light}>
              {copy.start.label}
              <MoveRight aria-hidden="true" className={buttonArrow} />
            </Link>
          </div>
        </Reveal>

        {/* The live template. */}
        <Reveal delay={0.15} className="relative flex min-w-0 justify-center [&>*]:min-w-0">
          {template && <PreviewFrame template={template} device={wide ? "desktop" : "mobile"} palette={palette} font={font_} fill={wide} height={wide ? "aspect-[16/10]" : "h-[min(40rem,72svh)]"} />}
        </Reveal>
      </div>

      {caption && template && (
        <p aria-live="polite" className={`${shell} m-0 mt-8 flex items-center gap-3 border-0 border-t border-solid border-white/10 pt-6 text-[0.875rem] text-[var(--bone)]/55`}>
          <span aria-hidden="true" className="flex shrink-0 -space-x-1">
            {activePalette.swatches.map((swatch, k) => (
              <span key={k} className={`size-3.5 rounded-full ring-2 ring-[var(--ink)] transition-colors duration-500 ${swatch}`} />
            ))}
          </span>
          <span>
            <span className="font-medium text-[var(--bone)]">{template.name}</span> in {activePalette.name}, with {activeFont.name} type
          </span>
        </p>
      )}
    </section>
  );
}
