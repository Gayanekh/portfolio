"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Link2, Lock, MoveRight, Shuffle } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import PreviewFrame from "@/components/template-detail/PreviewFrame";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { COLOR_PALETTES, FONT_PACKS, findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import { ColorChoices, FontChoices } from "@/components/template-editor/StylesPanel";
import { displayTitle, ease, focusRing, kicker, lead, solidButton } from "@/components/landing/landing-ui";
import { STORY } from "@/components/new-landing/content";

// How it works and Design as one story (chapters 02 to 04 of the page), told
// on one real template that stays on screen while the chapters scroll past
// beside it (above it on phones):
//
// - Add your work: the template is a draft being filled in.
// - Style: the palette and font pickers restyle it (as in the editor's Site
//   styles). Only the preview changes; the landing page keeps its own colours.
// - Publish: the template goes live at its own address.
//
// A progress row over the preview shows the four steps (01, Choose, is the
// templates slider above) and links to each. A status line on the preview
// changes with the chapter, so the visitor always knows what is happening to
// "their" site. Nothing here is boxed in: the chapters sit on the page and the
// preview's glow fades out into it.

const CHAPTERS = [STORY.write, STORY.style, STORY.publish];

// Wide screens put the preview beside the chapters; phones pin it above them.
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
const number = (i: number) => String(i + 1).padStart(2, "0");

const groupLabel = "m-0 flex items-baseline justify-between gap-3 p-0 text-sm font-semibold text-foreground";
const row = "flex items-center justify-between gap-6 border-t border-foreground/10 py-4 last:border-b";

function Chapter({ index, setRef, children }: { index: number; setRef: (element: HTMLDivElement | null) => void; children?: React.ReactNode }) {
  const chapter = CHAPTERS[index];
  return (
    // On phones the anchor stops below the pinned preview.
    <div
      id={chapter.id}
      ref={setRef}
      className="flex scroll-mt-[calc(30svh+10rem)] flex-col justify-center gap-8 py-[clamp(3.5rem,calc(-4rem_+_15.625vw),6rem)] lg:min-h-svh lg:scroll-mt-0"
    >
      <Reveal className="flex flex-col gap-5">
        <p className={kicker}>{chapter.tag}</p>
        <h2 className={displayTitle}>{chapter.title}</h2>
        <p className={`${lead} max-w-[32rem]`}>{chapter.text}</p>
      </Reveal>
      {children && <Reveal delay={0.1}>{children}</Reveal>}
    </div>
  );
}

export default function Story() {
  const wide = useWide();
  const [active, setActive] = useState(0);
  const [palette, setPalette] = useState(COLOR_PALETTES[0].id);
  const [font, setFont] = useState(FONT_PACKS[0].id);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  // The chapter crossing a line across the screen is the active one: the
  // middle on wide screens, the middle of the space below the preview on phones.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(chapterRefs.current.indexOf(entry.target as HTMLDivElement));
        }
      },
      { rootMargin: wide ? "-50% 0px -50% 0px" : "-70% 0px -29% 0px" },
    );
    chapterRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, [wide]);

  const template = getTemplateDetail(STORY.template);
  if (!template) return null;

  const activePalette = findPalette(palette);
  const activeFont = findFontPack(font);
  const shuffle = () => {
    setPalette(other(COLOR_PALETTES, palette));
    setFont(other(FONT_PACKS, font));
  };
  const setRef = (i: number) => (element: HTMLDivElement | null) => {
    chapterRefs.current[i] = element;
  };

  // What is happening to the site in this chapter, on a line over the preview.
  const status = [
    <>
      <Lock aria-hidden="true" className="size-3.5 shrink-0" />
      {STORY.write.status}
    </>,
    <>
      <span aria-hidden="true" className="flex shrink-0 -space-x-1">
        {activePalette.swatches.map((swatch, i) => <span key={i} className={`size-3.5 rounded-full ring-2 ring-white transition-colors duration-500 ${swatch}`} />)}
      </span>
      <span className="truncate">
        <span className="font-medium text-foreground">{template.name}</span> in {activePalette.name}, with {activeFont.name} type
      </span>
    </>,
    <>
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-success" />
      <span className="truncate">
        <span className="font-medium text-foreground">{STORY.publish.live}</span> · {STORY.publish.address}
      </span>
    </>,
  ][active];

  return (
    <section aria-label={STORY.label} className={`relative ${themeFontVariables}`}>
      <div className="mx-auto grid w-content-width grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-16">
        {/* The stage: pinned while the chapters scroll. On phones it pins to the top,
            behind the floating header, on the page's own background, fading out at its foot
            so the chapters slip under it without an edge. */}
        <div className="sticky top-0 z-10 order-1 -mx-[7.5vw] flex flex-col gap-4 bg-background px-[7.5vw] pb-3 pt-[clamp(5rem,calc(2rem_+_6.25vw),6rem)] lg:order-2 lg:top-0 lg:mx-0 lg:h-svh lg:justify-center lg:bg-transparent lg:px-0 lg:pb-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full h-10 bg-gradient-to-b from-background to-transparent lg:hidden" />

          <nav aria-label="Steps" className="flex gap-3">
            {STORY.progress.map((step, i) => {
              // Step 01 (the slider) is behind the visitor once the story starts.
              const reached = i <= active + 1;
              const current = i === active + 1;
              return (
                <a key={step.href} href={step.href} aria-current={current ? "step" : undefined} className={`${focusRing} group flex min-w-0 flex-1 flex-col gap-2 rounded-sm no-underline`}>
                  <span className="relative h-0.5 overflow-hidden rounded-full bg-foreground/10">
                    <motion.span initial={false} animate={{ scaleX: reached ? 1 : 0 }} transition={{ duration: 0.6, ease }} className="absolute inset-0 origin-left bg-primary" />
                  </span>
                  <span
                    className={`flex min-w-0 items-baseline gap-1.5 text-[length:clamp(0.75rem,calc(0.555rem_+_0.8vw),0.875rem)] transition-colors duration-300 leading-[clamp(1rem,calc(0.61rem_+_1.6vw),1.25rem)] ${
                      current ? "text-foreground" : reached ? "text-foreground/55" : "text-foreground/35 group-hover:text-foreground/60"
                    }`}
                  >
                    <span className="font-mono text-[0.7rem]">{number(i)}</span>
                    <span className="truncate font-medium">{step.short}</span>
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="relative isolate flex justify-center">
            {/* The palette's glow, behind the preview and fading into the page. It is
                strongest while styling. */}
            <motion.div aria-hidden="true" initial={false} animate={{ opacity: active === 1 ? 1 : 0.45 }} transition={{ duration: 0.8, ease }} className="pointer-events-none absolute inset-0 -z-10 lg:-inset-16">
              <AnimatePresence initial={false}>
                <motion.div key={activePalette.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }} className="absolute inset-0">
                  <span className={`absolute -right-[10%] -top-[10%] size-[60%] rounded-full opacity-40 blur-3xl ${activePalette.swatches[2]}`} />
                  <span className={`absolute -bottom-[10%] -left-[5%] size-[50%] rounded-full opacity-50 blur-3xl ${activePalette.swatches[1]}`} />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <PreviewFrame
              template={template}
              device={wide ? "desktop" : "mobile"}
              palette={palette}
              font={font}
              fill
              address={active === 2 ? STORY.publish.address : undefined}
              height="h-[30svh] lg:h-[min(66svh,44rem)]"
            />

            {/* The status line: one pill that reshapes as the chapter changes. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[clamp(0.75rem,calc(-0.75rem_+_3.125vw),1.25rem)] flex justify-center px-3">
              <motion.p
                layout
                aria-live="polite"
                transition={{ duration: 0.5, ease }}
                className="m-0 flex max-w-full items-center gap-2 overflow-hidden rounded-full bg-white/90 px-4 py-2 text-[0.8125rem] text-neutral-500 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_12px_30px_-12px_rgb(0_0_0/0.35)] ring-1 ring-foreground/5 backdrop-blur-xl"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease }}
                    className="flex min-w-0 items-center gap-2"
                  >
                    {status}
                  </motion.span>
                </AnimatePresence>
              </motion.p>
            </div>
          </div>
        </div>

        {/* The chapters. */}
        <div className="order-2 lg:order-1">
          <Chapter index={0} setRef={setRef(0)}>
            {/* The editor's sections, partway through. */}
            <ul className="m-0 flex max-w-[32rem] list-none flex-col p-0">
              {STORY.write.fields.map((field) => (
                <li key={field.label} className={row}>
                  <span className="font-medium text-foreground">{field.label}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
                    <Check aria-hidden="true" className="size-3.5 text-success" />
                    {field.value}
                  </span>
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter index={1} setRef={setRef(1)}>
            {/* The editor's own pickers (compact), so this matches Site styles there. */}
            <div className="flex max-w-[24rem] flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className={groupLabel}>
                  Colors <span className="font-normal text-neutral-500">{activePalette.name}</span>
                </p>
                <ColorChoices value={palette} onChange={setPalette} compact />
              </div>
              <div className="flex flex-col gap-3">
                <p className={groupLabel}>
                  Fonts <span className="font-normal text-neutral-500">{activeFont.name}</span>
                </p>
                <FontChoices value={font} onChange={setFont} compact />
              </div>
              <button
                type="button"
                onClick={shuffle}
                className={`${focusRing} group inline-flex h-11 w-fit cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded border border-black/15 bg-white px-4 text-[0.95rem] font-medium text-black transition-colors hover:border-black/40`}
              >
                <Shuffle aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:rotate-12" />
                {STORY.style.shuffle}
              </button>
            </div>
          </Chapter>

          <Chapter index={2} setRef={setRef(2)}>
            <div className="flex max-w-[32rem] flex-col gap-6">
              <p className={`${row} m-0`}>
                <span className="flex min-w-0 items-center gap-2 truncate font-medium text-foreground">
                  <Link2 aria-hidden="true" className="size-4 shrink-0 text-neutral-500" />
                  {STORY.publish.address}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-neutral-600">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
                  {STORY.publish.live}
                </span>
              </p>
              <Link href={STORY.publish.start.href} className={`${solidButton} group h-12 w-fit`}>
                {STORY.publish.start.label}
                <MoveRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Chapter>
        </div>
      </div>
    </section>
  );
}
