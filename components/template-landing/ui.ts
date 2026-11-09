// The look of /template-landing, after the reference it was given (a
// four-column grid with full-height hairlines, giant uppercase words around
// a picture, quiet small type, corner-bracket links, a light/dark switch)
// and told in Portory's own words and templates. Every section takes its
// classes from here. The page has a light and a dark theme: each is a set of
// colour variables on the root, and everything reads them, so switching
// is one class.

import { fontVariables } from "@/components/editorial-landing/ui";

// The type of /landing (and /editorial-landing): Inter Tight for all text,
// headings and body alike, Geist Mono for the small uppercase labels, and
// Instrument Serif italic for a headline's accent words.
export const fonts = `${fontVariables} font-[family-name:var(--el-sans)] [--font-1:var(--el-sans)] [--font-heading:var(--el-sans)] [&_.font-mono]:font-[family-name:var(--el-mono)]`;
export const serif = "font-[family-name:var(--el-serif)] font-normal italic tracking-[-0.02em]";

export const ease = [0.22, 1, 0.36, 1] as const;
export const pad = (n: number) => String(n).padStart(2, "0");

// The two themes. --bg the page, --fg the type, --dim quiet type, --line the
// hairlines, --card a raised surface, --dot the halftone, --accent one signal
// colour, --warm the warm off-white some sections sit on.
export const themes = {
  light: "[--bg:#ffffff] [--warm:#ffffff] [--fg:#16171a] [--dim:#6b6b6b] [--line:rgb(22_23_26/0.11)] [--card:#e8e8e7] [--dot:rgb(22_23_26/0.28)] [--accent:#bb4e1c]",
  dark: "[--bg:#16171a] [--warm:#16171a] [--fg:#efefed] [--dim:#7d7d7d] [--line:rgb(239_239_237/0.12)] [--card:#1f2024] [--dot:rgb(239_239_237/0.22)] [--accent:#d96a3a]",
};

// The page's frame: up to 1440px wide, centred, with a margin either side
// growing from 24px on phones to 48px on large screens.
export const frame = "mx-auto w-full max-w-[90rem] px-[clamp(1.5rem,3vw,3rem)]";
// Where the content starts and ends across a full-width box: the frame's edge
// (for things placed absolutely, like the hero's).
export const side = "max(clamp(1.5rem,3vw,3rem),calc((100%_-_90rem)/2_+_clamp(1.5rem,3vw,3rem)))";
export const grid = "grid grid-cols-1 lg:grid-cols-4";

export const type = {
  // Every section's heading, as in the Moire reference: a small label over one large line.
  kicker: "text-[length:clamp(0.9375rem,calc(0.9rem_+_0.2vw),1.125rem)]",
  heading: "font-[family-name:var(--font-1)] text-[length:clamp(2.25rem,calc(1.4rem_+_3vw),4.75rem)] font-medium leading-[1.02] tracking-[-0.035em]",
  // A section's statement or title.
  statement: "font-[family-name:var(--font-1)] text-[length:clamp(1.9rem,calc(1.3rem_+_2.6vw),4.6rem)] font-semibold leading-[1.02] tracking-[-0.045em]",
  title: "font-[family-name:var(--font-1)] text-[length:clamp(2.1rem,calc(1.4rem_+_3vw),5.2rem)] font-semibold leading-[0.98] tracking-[-0.05em]",
  name: "font-[family-name:var(--font-1)] text-[length:clamp(1.25rem,calc(1rem_+_0.9vw),2.1rem)] font-semibold leading-[1.05] tracking-[-0.035em]",
  lead: "text-[length:clamp(1.05rem,calc(0.95rem_+_0.45vw),1.5rem)] leading-[1.25] tracking-[-0.015em]",
  body: "text-[length:clamp(0.9375rem,calc(0.9rem_+_0.12vw),1.0625rem)] leading-[1.45]",
  small: "text-[0.875rem] leading-[1.35]",
};

export const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";

// A link with a small corner bracket at its top right, which steps out on hover.
export const cornerLink = `${focusRing} group/corner relative inline-flex w-fit items-center rounded-[4px] pr-3 font-semibold tracking-[-0.02em] text-[var(--fg)] no-underline`;
export const corner = "pointer-events-none absolute right-0 top-0 size-[0.4rem] border-0 border-r-2 border-t-2 border-solid border-current transition-transform duration-300 group-hover/corner:-translate-y-0.5 group-hover/corner:translate-x-0.5";

// The halftone dots, fading out towards the middle.
export const dots = "pointer-events-none bg-[radial-gradient(circle,var(--dot)_1px,transparent_1.3px)] bg-[size:11px_11px]";

