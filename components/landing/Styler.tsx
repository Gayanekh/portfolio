"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoveRight, Shuffle } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { FontCard, PaletteCard, glowOf, signature } from "@/components/template-detail/StyleCards";
import { COLOR_PALETTES, FONT_PACKS, findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import { displayTitle, ease, focusRing, kicker, lead, section, solidButton, fit } from "@/components/landing/landing-ui";

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

// "Make it yours": the same palette and font pack pickers as the editor's
// Site styles (compact), beside a real template that restyles as you pick.
// Both sit on the page with no panel around them; a glow in the chosen
// palette fades out behind the template, a caption names the current
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
    <section id="make-it-yours" aria-label={STYLER.title} className={`${section} ${themeFontVariables} ${fit.sectionY}`}>
      <div className="mx-auto flex w-content-width flex-col gap-12 md:gap-20">
        <Reveal className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className={kicker}>{STYLER.kicker}</p>
            <h2 className={displayTitle}>{STYLER.title}</h2>
          </div>
          <p className={lead}>{STYLER.text}</p>
        </Reveal>

        {/* The stage: the template and its pickers as one piece, no panel around
            them. The palette's colours glow behind the preview and fade out into
            the page, so the section has no edges. */}
        <Reveal className="relative isolate">
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
              {/* Both in the palette's accent: its other colours can be near black
                  (Ink, Sun, Linen), which would glow as a grey cloud. */}
              <span style={{ backgroundColor: glowOf(activePalette) }} className="absolute -right-24 -top-24 size-[34rem] max-w-full rounded-full opacity-15 blur-3xl lg:opacity-30" />
              <span style={{ backgroundColor: glowOf(activePalette) }} className="absolute -bottom-24 left-1/3 size-[28rem] max-w-full rounded-full opacity-10 blur-3xl lg:opacity-20" />
            </motion.div>
          </AnimatePresence>

          {/* One composition: the live template as the base layer, with the two
              picker cards floating over its right edge like an editor's panel on
              the site (beside it, above the template, on phones). */}
          <div className="flex flex-col gap-10 lg:relative lg:block">
            {/* The live template, crisp, with a soft shadow along its top and
                bottom so it sits apart from the page without a hard frame. On
                phones it sits on a soft halo instead. */}
            <div className="relative isolate flex min-w-0 justify-center lg:mr-[12rem] lg:justify-start">
              <span aria-hidden="true" className="absolute inset-y-4 left-0 right-2 -z-10 rounded-[3rem] bg-white/50 blur-3xl lg:hidden" />
              <span aria-hidden="true" className="absolute inset-x-[14%] top-0 -z-10 hidden h-8 -translate-y-1/3 rounded-full bg-black/[0.05] blur-2xl lg:block" />
              <span aria-hidden="true" className="absolute inset-x-[12%] bottom-0 -z-10 hidden h-10 translate-y-1/3 rounded-full bg-black/[0.09] blur-2xl lg:block" />
              <PreviewFrame template={template} device={wide ? "desktop" : "mobile"} palette={palette} font={font} fill height={fit.previewHeight} />
            </div>

            {/* The palettes and font packs from the editor's Site styles, as two cards. */}
            <div className="relative z-10 order-first flex flex-col gap-4 lg:absolute lg:right-0 lg:top-1/2 lg:order-none lg:w-[21rem] lg:-translate-y-1/2">
              <PaletteCard value={palette} onChange={setPalette} mark="styler-palette" />
              <FontCard value={font} onChange={setFont} accent={signature(activePalette)} mark="styler-font" />
            </div>
          </div>

          {/* The composition's foot: what the template is showing now, and the buttons. */}
          <div className="mt-10 flex flex-col gap-5 border-t border-foreground/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="m-0 flex min-w-0 items-center gap-2.5 text-[13px] text-neutral-500">
              <span aria-hidden="true" className="flex shrink-0 -space-x-1">
                {activePalette.swatches.map((swatch, index) => <span key={index} className={`size-3.5 rounded-full ring-2 ring-white transition-colors duration-500 ${swatch}`} />)}
              </span>
              <span className="min-w-0">
                <span className="font-medium text-foreground">{template.name}</span> in {activePalette.name}, with {activeFont.name} type
              </span>
            </p>

            <div className="flex shrink-0 gap-2">
              <Link href={STYLER.start.href} className={`${solidButton} group h-12 min-w-0 flex-1 sm:flex-none`}>
                {STYLER.start.label}
                <MoveRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={shuffle}
                className={`${focusRing} group inline-flex h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded border border-black/15 bg-white px-4 text-[0.95rem] font-medium text-black transition-colors hover:border-black/40`}
              >
                <Shuffle aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:rotate-12" />
                Shuffle
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
