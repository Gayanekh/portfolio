// The look of /other-landing, after the Framewell reference (its type now
// /template-landing's): white ground,
// near-black type with one serif italic word in each heading, a small square
// before every section's label, light grey cards with square corners, and a
// lot of air. Every section takes its classes from here.

import { fonts as templateFonts, serif as templateSerif } from "@/components/template-landing/ui";

// /template-landing's type (the user asked for it): Inter Tight for all text
// and headings, Instrument Serif italic for a heading's soft words, Geist
// Mono for the small labels.
export const fonts = templateFonts;
export const serif = templateSerif;

export const ease = [0.22, 1, 0.36, 1] as const;
export const pad = (n: number) => String(n).padStart(2, "0");

// Colours, measured on the reference.
export const colors = {
  page: "bg-white text-[#090909]",
  // A page that borrows these sections can set --ol-card to its own card colour.
  card: "bg-[var(--ol-card,#f7f7f7)]",
  body: "text-[#4a4a4a]",
  quiet: "text-[#777]",
  dim: "text-[#999]",
  line: "border-[#090909]/15",
};

// One colour grade for every picture on the page, so covers, screenshots and
// portraits read as one soft set: a little desaturated and flattened. (A
// pastel wash laid over them was removed at the user's request.)
export const grade = "[filter:saturate(0.55)_contrast(0.88)]";

// A template's cover, after the references the user gave: the site's own
// screens as tilted browser windows, centred and kept small on a muted
// ground with diagonal bands (#f0f0f2, #bab8b3 and a step between), in a
// card with soft rounded corners. The box is a size container and the
// windows are sized in cqmin (its shorter side), so a wide card keeps more
// ground around them and a square one reads the same at any width.
// Its colours can be set by the page (--cv-ground, --cv-band, --cv-strip,
// --cv-window, --cv-dot); /template-landing warms them for its off-white page.
export const cover = {
  box: "relative block overflow-hidden rounded-[10px] bg-[var(--cv-ground,#f0f0f2)] [container-type:size]",
  // The two shapes of card, after the reference's works grid, and a cover
  // filling its (positioned) parent, as /template-landing's hero shows it.
  square: "aspect-square",
  wide: "aspect-[946/640]",
  // /template-landing's grid, in the Endcap reference's sizes: a near-square
  // card and a full-width banner.
  tile: "aspect-[670/626]",
  banner: "aspect-[1328/581]",
  fill: "!absolute inset-0 !rounded-none",
  // Where the windows sit: the whole box unless a parent sets --cover-zoom
  // (their share of the box) and --cover-x / --cover-y (their centre).
  focus: "absolute left-[var(--cover-x,50%)] top-[var(--cover-y,50%)] h-[calc(var(--cover-zoom,1)*100%)] w-[calc(var(--cover-zoom,1)*100%)] -translate-x-1/2 -translate-y-1/2 [container-type:size]",
  band: "pointer-events-none absolute inset-0 bg-[var(--cv-band,#bab8b3)] [clip-path:polygon(46%_100%,100%_14%,100%_100%)]",
  strip: "pointer-events-none absolute inset-0 bg-[var(--cv-strip,#d8d6d1)] [clip-path:polygon(84%_100%,100%_70%,100%_100%)]",
  stage:
    "absolute inset-0 grid place-items-center [transform:perspective(160cqmin)_rotateX(34deg)_rotateZ(-16deg)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:perspective(160cqmin)_rotateX(30deg)_rotateZ(-14deg)_translateY(-1.5cqmin)]",
  window: "relative block overflow-hidden rounded-[1.2cqmin] bg-[var(--cv-window,#f7f7f8)] shadow-[0_3cqmin_6cqmin_-1cqmin_rgb(70_66_58/0.28)]",
  front: "w-[64cqmin] [grid-area:1/1] -translate-x-[6cqmin] translate-y-[5cqmin]",
  back: "w-[50cqmin] [grid-area:1/1] translate-x-[17cqmin] -translate-y-[17cqmin]",
  bar: "flex h-[3.2cqmin] items-center gap-[0.7cqmin] px-[1.4cqmin]",
  dot: "size-[0.9cqmin] rounded-full bg-[var(--cv-dot,#d6d5d8)]",
  screen: "relative block aspect-[16/10]",
};

// The reference's faint outlined tags beside a work's name.
export const tag = "rounded-[6px] border border-solid border-[#090909]/[0.08] px-2 py-0.5 text-[0.8125rem] leading-[1.4] text-[#a3a3a3]";

// Up to 1440px wide, centred, 16px from the edge on phones and 50px on desktop.
export const frame = "mx-auto w-full max-w-[90rem] px-[clamp(1rem,3.5vw,3.125rem)]";
export const section = "scroll-mt-20 py-[clamp(4.5rem,8vw,7.5rem)]";
// The gap between cards.
export const gap = "gap-[clamp(0.75rem,1.4vw,1.25rem)]";

// 51 / 40 / 32 / 20px at 1440, as on the reference.
export const type = {
  hero: "m-0 text-[length:clamp(2.5rem,calc(2.24rem_+_1.05vw),4rem)] font-normal leading-[1.04] tracking-[-0.045em]",
  heading: "m-0 text-[length:clamp(2rem,calc(1.8rem_+_0.76vw),3rem)] font-medium leading-[1.04] tracking-[-0.055em]",
  statement: "m-0 text-[length:clamp(1.5rem,calc(1.31rem_+_0.76vw),2.5rem)] font-medium leading-[1.14] tracking-[-0.03em]",
  title: "m-0 text-[length:clamp(1.125rem,calc(1.06rem_+_0.2vw),1.375rem)] font-medium leading-[1.25] tracking-[-0.02em]",
  number: "text-[length:clamp(2.25rem,calc(1.9rem_+_1vw),3.25rem)] font-semibold leading-none tracking-[-0.05em]",
  // The closing call's question (90px at 1660) and its centred line (64px).
  closing: "m-0 text-[length:clamp(3rem,calc(1.55rem_+_4.2vw),6.5rem)] font-medium leading-[1] tracking-[-0.06em]",
  closingLine: "text-[length:clamp(2.25rem,calc(1.35rem_+_2.7vw),4.5rem)] font-medium leading-[1.05] tracking-[-0.06em]",
  lead: "text-[length:clamp(1.125rem,calc(1.05rem_+_0.3vw),1.5rem)] leading-[1.4] tracking-[-0.02em]",
  body: "text-[1rem] leading-[1.45] tracking-[-0.005em]",
  small: "text-[0.875rem] leading-[1.4]",
  // The small labels, in /template-landing's mono.
  label: "font-mono text-[0.71875rem] uppercase tracking-[0.04em]",
};

export const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-[#090909] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

// The reference's buttons, with Portory's square corners: ink, and light grey.
const button = `${focusRing} group/button inline-flex h-[2.5rem] w-fit items-center gap-3 rounded-[4px] px-5 text-[0.875rem] font-medium tracking-[-0.01em] no-underline transition-colors duration-300`;
export const buttons = {
  dark: `${button} bg-[#090909] text-white hover:bg-[#333]`,
  light: `${button} bg-[#e6e6e6] text-[#090909] hover:bg-[#d9d9d9]`,
};
export const buttonArrow = "size-4 transition-transform duration-300 group-hover/button:translate-x-1";
