"use client";

import { useId } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ease, focusRing } from "@/components/landing/landing-ui";
import { COLOR_PALETTES, FONT_PACKS, findFontPack, findPalette, type ColorPalette } from "@/components/template-detail/theme-options";

// The palette and font pack pickers as two matching cards: a large specimen of
// the current choice on the left, and the options listed down the side in
// small spaced capitals, where a short line in the chosen palette's colour
// marks the current one and glides to the next. Colours shows the palette's
// five colours (the page, an image, the accent, muted text and the text) as a
// stack of swatches, each laid over the one before and slightly turned, that
// fans out into a row under the pointer and blends to a new palette; Fonts
// shows "Aa" and a line of text in the pack. Shared by the landing page's
// "Make it yours" and the editor's Site styles; `compact` is the narrower
// card for the editor's Styles tab (StylePickers).

// The card surface: off-white, a hairline ring and a soft shadow (shallower
// when compact, so it fits the editor's narrow sidebar).
const surface = (compact: boolean) =>
  `rounded-2xl bg-[#fbfaf8]/90 ring-1 ring-black/[0.04] backdrop-blur-xl ${
    compact ? "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_12px_24px_-16px_rgb(0_0_0/0.28)]" : "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_28px_56px_-28px_rgb(0_0_0/0.4)]"
  }`;
// Compact cards sit together in one card (StylePickers), so they have no surface of
// their own.
const card = (compact: boolean) => `grid grid-cols-[minmax(0,1fr)_6.5rem] items-center ${compact ? "gap-3 py-5 pl-5 pr-3" : `${surface(false)} gap-5 py-6 pl-6 pr-5`}`;
const spaced = "text-[10px] uppercase tracking-[0.28em]";
const caption = "truncate text-[13px] tracking-[0.06em] text-neutral-600";
const glide = { type: "spring", stiffness: 300, damping: 34, mass: 0.9 } as const;

// The swatch stack: at rest each swatch overlaps the last by most of its width
// and turns a little, alternately; under the pointer they spread into a
// straight row, lifting slightly in a wave from the back. Compact cards
// space them closer, so the row stays clear of the options.
const STACK = [-6, 4, -3, 5, -2];
const swatchMotion = (rest: number, fan: number): Variants => ({
  rest: (i: number) => ({ x: i * rest, y: 0, rotate: STACK[i], transition: { type: "spring", stiffness: 260, damping: 24 } }),
  fan: (i: number) => ({ x: i * fan, y: -4, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 20, delay: i * 0.03 } }),
});
const SWATCHES = { full: swatchMotion(18, 29), compact: swatchMotion(13, 20) };

// A colour token a palette sets, as hex (none when it keeps the template's own).
const token = (classes: string, name: string) => classes.match(new RegExp(`--${name}:(#[0-9a-f]{3,8})`, "i"))?.[1];
const hex = (swatch: string) => swatch.match(/#[0-9a-f]{3,8}/i)?.[0] ?? "#000";
// The colour a palette is known by: its accent; Ink, a dark palette, by its dark page.
export const signature = (palette: ColorPalette) => (palette.id === "ink" ? (token(palette.className, "card") ?? hex(palette.swatches[3])) : (token(palette.className, "primary") ?? hex(palette.swatches[2])));
// The colour a palette glows in: always its accent, never a dark colour.
export const glowOf = (palette: ColorPalette) => token(palette.className, "primary") ?? hex(palette.swatches[2]);

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
            className={`${focusRing} ${spaced} relative cursor-pointer rounded py-0.5 transition-colors duration-300 ${on ? "text-foreground" : "text-foreground/40 hover:text-foreground/75"}`}
          >
            {option.name}
            {on && <motion.span layoutId={mark} transition={glide} aria-hidden="true" style={{ backgroundColor: accent }} className="absolute -left-4 top-1/2 h-0.5 w-2.5 -translate-y-1/2 rounded-full transition-colors duration-500" />}
          </button>
        );
      })}
    </div>
  );
}

// `mark` names the gliding line, so it stays unique per page.
export function PaletteCard({ value, onChange, mark, compact = false }: { value: string; onChange: (id: string) => void; mark: string; compact?: boolean }) {
  const active = findPalette(value);
  const colors = [...active.swatches.slice(0, 3), active.muted, active.swatches[3]];
  return (
    <div className={card(compact)}>
      {/* The specimen: the palette's five colours. */}
      <div aria-hidden="true" className="flex min-w-0 flex-col gap-3">
        <motion.span initial="rest" animate="rest" whileHover="fan" className={`relative block max-w-full ${compact ? "h-[3.75rem] w-[8.5rem]" : "h-[4.5rem] w-[10.75rem]"}`}>
          {colors.map((color, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={compact ? SWATCHES.compact : SWATCHES.full}
              className={`absolute left-0 top-1 rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.05),0_6px_14px_-8px_rgb(0_0_0/0.35)] ring-2 ring-[#fbfaf8] transition-colors duration-500 ${compact ? "size-12" : "size-14"} ${color}`}
            />
          ))}
        </motion.span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.35, ease }} className={caption}>
            {active.name}, in five colours
          </motion.span>
        </AnimatePresence>
      </div>
      <OptionList label="Colors" options={COLOR_PALETTES} value={value} onChange={onChange} accent={signature(active)} mark={mark} />
    </div>
  );
}

// `accent` is the chosen palette's colour, for the line marking the font.
export function FontCard({ value, onChange, accent, mark, compact = false }: { value: string; onChange: (id: string) => void; accent: string; mark: string; compact?: boolean }) {
  const active = findFontPack(value);
  return (
    <div className={card(compact)}>
      {/* The specimen. */}
      <div aria-hidden="true" className="min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.35, ease }} className="flex flex-col gap-3">
            <span className={`leading-[0.9] text-neutral-900 ${compact ? "text-[3.75rem]" : "text-[4.5rem]"} ${active.heading} !font-normal`}>Aa</span>
            <span className={`${caption} ${active.body}`}>Clarity feels good</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <OptionList label="Fonts" options={FONT_PACKS} value={value} onChange={onChange} accent={accent} mark={mark} />
    </div>
  );
}

// The editor's Styles tab: both pickers, always open, as one card on their
// surface with a hairline between them.
export function StylePickers({ palette, font, onPalette, onFont }: { palette: string; font: string; onPalette: (id: string) => void; onFont: (id: string) => void }) {
  const marks = useId();
  return (
    <div className={`${surface(true)} overflow-hidden`}>
      <PaletteCard value={palette} onChange={onPalette} mark={`${marks}-palette`} compact />
      <div className="border-t border-black/[0.06]">
        <FontCard value={font} onChange={onFont} accent={signature(findPalette(palette))} mark={`${marks}-font`} compact />
      </div>
    </div>
  );
}
