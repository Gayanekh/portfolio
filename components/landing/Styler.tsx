"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

// The composition's scale (--s on the stage): 1 at Full HD's width (87rem,
// 1392px) and above (the root size then grows with the screen, so rem sizes
// already do). Narrower, the cards shrink steadily but more gently than the
// stage (60% fixed, 40% with its width: 0.87 at 1280px), so their small
// capitals stay readable; below xl they fold into two chips (StyleChips).
const STAGE_WIDTH_REM = 87;
function useStageScale() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const s = Math.min(1, 0.6 + 0.4 * (stage.offsetWidth / (STAGE_WIDTH_REM * rem)));
      stage.style.setProperty("--s", s.toFixed(4));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// Below xl: the palette and font pickers as two small chips floating over the
// template's top-right corner, each showing the current choice itself (the
// palette's five colours, or "Aa" in the font) with its name. A chip opens
// its full card over the template, under the chips; the choice restyles the
// template at once, and a click outside or Escape closes it.
function StyleChips({ palette, font, onPalette, onFont, accent }: { palette: string; font: string; onPalette: (id: string) => void; onFont: (id: string) => void; accent: string }) {
  const [open, setOpen] = useState<"palette" | "font" | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => !ref.current?.contains(event.target as Node) && setOpen(null);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const activePalette = findPalette(palette);
  const activeFont = findFontPack(font);
  const colors = [...activePalette.swatches.slice(0, 3), activePalette.muted, activePalette.swatches[3]];
  const chip = (id: "palette" | "font", label: string, name: string, specimen: React.ReactNode) => (
    <button
      type="button"
      aria-expanded={open === id}
      aria-controls={`styler-${id}-picker`}
      onClick={() => setOpen((current) => (current === id ? null : id))}
      className={`${focusRing} flex min-w-0 cursor-pointer items-center gap-2 rounded-xl bg-[#fbfaf8]/90 py-1.5 pl-2 pr-3 text-left shadow-[0_1px_2px_rgb(0_0_0/0.05),0_12px_28px_-14px_rgb(0_0_0/0.4)] ring-1 backdrop-blur-xl transition-[box-shadow] duration-200 ${open === id ? "ring-foreground/60" : "ring-black/[0.06] hover:ring-black/20"}`}
    >
      {specimen}
      <span className="flex min-w-0 flex-col">
        <span className="text-[0.5625rem] uppercase leading-tight tracking-[0.18em] text-foreground/45">{label}</span>
        <span className="truncate text-[0.8125rem] font-medium leading-tight text-foreground">{name}</span>
      </span>
    </button>
  );
  return (
    <div ref={ref} className="xl:hidden">
      <div className="absolute right-2.5 top-[2.875rem] z-20 flex gap-1.5">
        {chip(
          "palette",
          "Colours",
          activePalette.name,
          <span aria-hidden="true" className="flex shrink-0 -space-x-1.5">
            {colors.map((color, i) => <span key={i} className={`size-4 rounded-[0.3rem] ring-[1.5px] ring-[#fbfaf8] transition-colors duration-500 ${color}`} />)}
          </span>,
        )}
        {chip("font", "Fonts", activeFont.name, <span aria-hidden="true" className={`shrink-0 text-[1.375rem] leading-none text-neutral-900 ${activeFont.heading} !font-normal`}>Aa</span>)}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            id={`styler-${open}-picker`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className="absolute right-2.5 top-[6rem] z-20 w-[min(21rem,calc(100%-1.25rem))] origin-top-right"
          >
            {open === "palette" ? <PaletteCard value={palette} onChange={onPalette} mark="styler-palette-pick" /> : <FontCard value={font} onChange={onFont} accent={accent} mark="styler-font-pick" />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const stageRef = useStageScale();
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
      <div className="mx-auto flex w-content-width flex-col gap-[clamp(3rem,calc(0.456rem_+_9.467vw),5rem)]">
        <Reveal className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,min(26rem,42%))] lg:gap-[min(4rem,6.5%)]">
          <div className="@container flex flex-col gap-5 [--fit:8.47cqi]">
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
              the site. From xl up the three scale together with the section
              (--s, set by useStageScale); below xl the cards fold into two chips
              over its top-right corner showing the current colours and font
              (StyleChips). */}
          <div ref={stageRef} className="relative">
            {/* The live template, crisp, with a soft shadow along its top and
                bottom so it sits apart from the page without a hard frame. On
                phones it sits on a soft halo instead. */}
            <div className="relative isolate flex min-w-0 justify-center lg:justify-start xl:mr-[calc(12rem*var(--s,1))]">
              <span aria-hidden="true" className="absolute inset-y-4 left-0 right-2 -z-10 rounded-[3rem] bg-white/50 blur-3xl lg:hidden" />
              <span aria-hidden="true" className="absolute inset-x-[14%] top-0 -z-10 hidden h-8 -translate-y-1/3 rounded-full bg-black/[0.05] blur-2xl lg:block" />
              <span aria-hidden="true" className="absolute inset-x-[12%] bottom-0 -z-10 hidden h-10 translate-y-1/3 rounded-full bg-black/[0.09] blur-2xl lg:block" />
              <div className="relative w-full">
                <PreviewFrame template={template} device={wide ? "desktop" : "mobile"} palette={palette} font={font} fill fillPhone height={wide ? fit.previewDesktop : fit.previewHeight} />
                <StyleChips palette={palette} font={font} onPalette={setPalette} onFont={setFont} accent={signature(activePalette)} />
              </div>
            </div>

            {/* The palettes and font packs from the editor's Site styles, as two
                cards over the template's right edge, scaled with the section. */}
            <div className="absolute right-0 top-1/2 z-10 hidden w-[21rem] origin-right -translate-y-1/2 scale-[var(--s,1)] flex-col gap-4 xl:flex">
              <PaletteCard value={palette} onChange={setPalette} mark="styler-palette" />
              <FontCard value={font} onChange={setFont} accent={signature(activePalette)} mark="styler-font" />
            </div>
          </div>

          {/* The composition's foot: what the template is showing now, and the buttons. */}
          <div className="mt-10 flex flex-col gap-5 border-t border-foreground/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="m-0 flex min-w-0 items-center gap-2.5 text-[0.8125rem] text-neutral-500">
              <span aria-hidden="true" className="flex shrink-0 -space-x-1">
                {activePalette.swatches.map((swatch, index) => <span key={index} className={`size-3.5 rounded-full ring-2 ring-white transition-colors duration-500 ${swatch}`} />)}
              </span>
              <span className="min-w-0">
                <span className="font-medium text-foreground">{template.name}</span> in {activePalette.name}, with {activeFont.name} type
              </span>
            </p>

            <div className="flex shrink-0 gap-2">
              <Link href={STYLER.start.href} className={`${solidButton} group h-11 max-h-[44px] min-w-0 flex-1 sm:flex-none`}>
                {STYLER.start.label}
                <MoveRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={shuffle}
                className={`${focusRing} group inline-flex h-11 max-h-[44px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded border border-black/15 bg-white px-4 text-[0.95rem] font-medium text-black transition-colors hover:border-black/40`}
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
