"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, Shuffle } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { COLOR_PALETTES, FONT_PACKS, findFontPack, findPalette, themeFontVariables, type ColorPalette } from "@/components/template-detail/theme-options";
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

// The pickers as two matching cards: a large specimen of the current choice
// on the left, and the options listed down the side in small spaced capitals,
// where a short line in the chosen palette's colour marks the current one and
// glides to the next. Colours shows the palette's five colours (the page, an
// image, the accent, muted text and the text) as a stack of swatches, each
// laid over the one before and slightly turned, that fans out into a row
// under the pointer and blends to a new palette; Fonts shows "Aa" and a line
// of text in the pack.
const card = "grid grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-5 rounded-2xl bg-[#fbfaf8]/90 py-6 pl-6 pr-5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_28px_56px_-28px_rgb(0_0_0/0.4)] ring-1 ring-black/[0.04] backdrop-blur-xl";
const caption = "truncate text-[13px] tracking-[0.06em] text-neutral-600";
const glide = { type: "spring", stiffness: 300, damping: 34, mass: 0.9 } as const;

// The swatch stack: at rest each swatch overlaps the last by most of its width
// and turns a little, alternately; under the pointer they spread into a
// straight row, lifting slightly in a wave from the back.
const STACK = [-6, 4, -3, 5, -2];
const swatchMotion: Variants = {
  rest: (i: number) => ({ x: i * 18, y: 0, rotate: STACK[i], transition: { type: "spring", stiffness: 260, damping: 24 } }),
  fan: (i: number) => ({ x: i * 29, y: -4, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 20, delay: i * 0.03 } }),
};
// A colour token a palette sets, as hex (none when it keeps the template's own).
const token = (classes: string, name: string) => classes.match(new RegExp(`--${name}:(#[0-9a-f]{3,8})`, "i"))?.[1];
const hex = (swatch: string) => swatch.match(/#[0-9a-f]{3,8}/i)?.[0] ?? "#000";
// The colour a palette is known by: its accent; Ink, a dark palette, by its dark page.
const signature = (palette: ColorPalette) => (palette.id === "ink" ? (token(palette.className, "card") ?? hex(palette.swatches[3])) : (token(palette.className, "primary") ?? hex(palette.swatches[2])));
// The colour a palette glows in: always its accent, never a dark colour.
const glowOf = (palette: ColorPalette) => token(palette.className, "primary") ?? hex(palette.swatches[2]);

// The options down the side of a card.
function OptionList({ label, options, value, onChange, accent, mark }: { label: string; options: { id: string; name: string }[]; value: string; onChange: (id: string) => void; accent: string; mark: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col items-start gap-1.5">
      {options.map((option) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option.id)}
            className={`${focusRing} relative cursor-pointer rounded py-0.5 text-[10px] uppercase tracking-[0.28em] transition-colors duration-300 ${on ? "text-foreground" : "text-foreground/40 hover:text-foreground/75"}`}
          >
            {option.name}
            {on && <motion.span layoutId={mark} transition={glide} aria-hidden="true" style={{ backgroundColor: accent }} className="absolute -left-4 top-1/2 h-0.5 w-2.5 -translate-y-1/2 rounded-full transition-colors duration-500" />}
          </button>
        );
      })}
    </div>
  );
}

function PaletteCard({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const active = findPalette(value);
  const colors = [...active.swatches.slice(0, 3), active.muted, active.swatches[3]];
  return (
    <div className={card}>
      {/* The specimen: the palette's five colours. */}
      <div aria-hidden="true" className="flex min-w-0 flex-col gap-3">
        <motion.span initial="rest" animate="rest" whileHover="fan" className="relative block h-[4.5rem] w-[10.75rem] max-w-full">
          {colors.map((color, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={swatchMotion}
              className={`absolute left-0 top-1 size-14 rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.05),0_6px_14px_-8px_rgb(0_0_0/0.35)] ring-2 ring-[#fbfaf8] transition-colors duration-500 ${color}`}
            />
          ))}
        </motion.span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.35, ease }} className={caption}>
            {active.name}, in five colours
          </motion.span>
        </AnimatePresence>
      </div>
      <OptionList label="Colors" options={COLOR_PALETTES} value={value} onChange={onChange} accent={signature(active)} mark="styler-palette" />
    </div>
  );
}

function FontCard({ value, onChange, accent }: { value: string; onChange: (id: string) => void; accent: string }) {
  const active = findFontPack(value);
  return (
    <div className={card}>
      {/* The specimen. */}
      <div aria-hidden="true" className="min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.35, ease }} className="flex flex-col gap-3">
            <span className={`text-[4.5rem] leading-[0.9] text-neutral-900 ${active.heading} !font-normal`}>Aa</span>
            <span className={`${caption} ${active.body}`}>Clarity feels good</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <OptionList label="Fonts" options={FONT_PACKS} value={value} onChange={onChange} accent={accent} mark="styler-font" />
    </div>
  );
}

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
    <section id="make-it-yours" aria-label={STYLER.title} className={`${section} ${themeFontVariables} md:py-32`}>
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
              <PreviewFrame template={template} device={wide ? "desktop" : "mobile"} palette={palette} font={font} fill />
            </div>

            {/* The palettes and font packs from the editor's Site styles, as two cards. */}
            <div className="relative z-10 order-first flex flex-col gap-4 lg:absolute lg:right-0 lg:top-1/2 lg:order-none lg:w-[21rem] lg:-translate-y-1/2">
              <PaletteCard value={palette} onChange={setPalette} />
              <FontCard value={font} onChange={setFont} accent={signature(activePalette)} />
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
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
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
