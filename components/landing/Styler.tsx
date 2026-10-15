"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Shuffle } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { COLOR_PALETTES, FONT_PACKS, findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import { displayTitle, ease, focusRing, kicker, lead, section, solidButton } from "@/components/landing/landing-ui";

// Content from the landing-redesign branch's "Make it yours" section.
const STYLER = {
  kicker: "Design",
  title: "Make it yours in a click",
  text: "Pick a colour palette and a font pairing, and the whole template changes with you. Try it on a real template.",
  template: "persona",
  start: { href: "/templates", label: "Get started" },
};

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

const groupLabel = "m-0 flex items-baseline justify-between gap-3 p-0 text-sm font-semibold text-foreground";
const optionBase = `${focusRing} relative cursor-pointer rounded-xl bg-neutral-100 transition-colors hover:bg-neutral-200/70`;

// The highlight that slides to the chosen option in a group.
function Selected({ group }: { group: string }) {
  return <motion.span layoutId={`styler-${group}`} transition={{ duration: 0.35, ease }} className="absolute inset-0 rounded-xl bg-white shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_20px_-10px_rgb(0_0_0/0.25)] ring-1 ring-foreground/15" />;
}

// "Make it yours": the same palette and font pack choices as a template's
// detail page, on a panel beside a real template that restyles as you pick.
// The panel glows in the chosen palette, a caption names the current
// pairing and Shuffle tries a random one.
export default function Styler() {
  const [palette, setPalette] = useState(COLOR_PALETTES[0].id);
  const [font, setFont] = useState(FONT_PACKS[0].id);
  const wide = useWide();
  const template = getTemplateDetail(STYLER.template);
  if (!template) return null;

  const activePalette = findPalette(palette);
  const activeFont = findFontPack(font);
  const shuffle = () => {
    setPalette(other(COLOR_PALETTES, palette));
    setFont(other(FONT_PACKS, font));
  };

  return (
    <section id="make-it-yours" aria-label={STYLER.title} className={`${section} ${themeFontVariables} md:py-32`}>
      <div className="mx-auto flex w-content-width flex-col gap-10 md:gap-14">
        <Reveal className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className={kicker}>{STYLER.kicker}</p>
            <h2 className={displayTitle}>{STYLER.title}</h2>
          </div>
          <p className={lead}>{STYLER.text}</p>
        </Reveal>

        {/* The stage: controls and preview on one panel, glowing in the palette's colours. */}
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-neutral-100 p-3 md:p-5 lg:p-6">
          <AnimatePresence initial={false}>
            <motion.div
              key={activePalette.id}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease }}
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <span className={`absolute -right-32 -top-32 size-[34rem] rounded-full opacity-40 blur-3xl ${activePalette.swatches[2]}`} />
              <span className={`absolute -bottom-40 -left-24 size-[28rem] rounded-full opacity-50 blur-3xl ${activePalette.swatches[1]}`} />
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-6">
            {/* Controls. */}
            <div className="flex flex-col gap-7 rounded-3xl bg-white/85 p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_20px_40px_-24px_rgb(0_0_0/0.25)] ring-1 ring-foreground/5 backdrop-blur-xl md:p-6">
              <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
                <legend className={groupLabel}>
                  Colour palette <span className="font-normal text-neutral-500">{activePalette.name}</span>
                </legend>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PALETTES.map((option) => (
                    <button key={option.id} type="button" aria-pressed={option.id === palette} aria-label={option.name} title={option.name} onClick={() => setPalette(option.id)} className={`${optionBase} h-14 p-1.5`}>
                      {option.id === palette && <Selected group="palette" />}
                      <span className="relative grid h-full grid-cols-2 overflow-hidden rounded-lg ring-1 ring-foreground/10">
                        {option.swatches.map((swatch) => <span key={swatch} className={swatch} />)}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
                <legend className={groupLabel}>
                  Font pairing <span className="font-normal text-neutral-500">{activeFont.name}</span>
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_PACKS.map((option) => (
                    <button key={option.id} type="button" aria-pressed={option.id === font} aria-label={option.name} onClick={() => setFont(option.id)} className={`${optionBase} flex h-20 flex-col items-start justify-between px-3 py-2.5 text-left`}>
                      {option.id === font && <Selected group="font" />}
                      <span className={`relative text-2xl leading-none ${option.heading}`}>Aa</span>
                      <span className={`relative text-[0.7rem] leading-none text-foreground/65 ${option.body}`}>{option.name}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* What the preview is showing now. */}
              <p aria-live="polite" className="m-0 flex items-center gap-3 rounded-2xl bg-neutral-100 p-3 text-sm text-neutral-600">
                <span aria-hidden="true" className="flex shrink-0 -space-x-1.5">
                  {activePalette.swatches.map((swatch) => <span key={swatch} className={`size-5 rounded-full ring-2 ring-white ${swatch}`} />)}
                </span>
                <span className="min-w-0">
                  <span className="font-medium text-foreground">{template.name}</span> in {activePalette.name}, with {activeFont.name} type
                </span>
              </p>

              <div className="mt-auto flex gap-2">
                <Link href={STYLER.start.href} className={`${solidButton} group h-12 min-w-0 flex-1`}>
                  {STYLER.start.label}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <button
                  type="button"
                  onClick={shuffle}
                  className={`${focusRing} group inline-flex h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black/15 bg-white px-4 text-[0.95rem] font-medium text-black transition-colors hover:border-black/40`}
                >
                  <Shuffle aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:rotate-12" />
                  Shuffle
                </button>
              </div>
            </div>

            {/* The live template. */}
            <div className="flex min-w-0 justify-center">
              <PreviewFrame template={template} device={wide ? "desktop" : "mobile"} palette={palette} font={font} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
