// The look of /template-landing, after the reference it was given (a
// four-column grid with full-height hairlines, giant uppercase words around
// a picture, quiet small type, corner-bracket links, a light/dark switch)
// and told in Portory's own words and templates. Every section takes its
// classes from here. The page has a light and a dark theme: each is a set of
// colour variables on the root, and everything reads them, so switching
// is one class.

export const ease = [0.22, 1, 0.36, 1] as const;
export const pad = (n: number) => String(n).padStart(2, "0");

// The two themes. --bg the page, --fg the type, --dim quiet type, --line the
// hairlines, --card a raised surface, --dot the halftone, --accent one signal colour.
export const themes = {
  light: "[--bg:#ffffff] [--fg:#0d0d0d] [--dim:#8c8c8c] [--line:rgb(13_13_13/0.11)] [--card:#f4f4f2] [--dot:rgb(13_13_13/0.28)] [--accent:#ff4d1a]",
  dark: "[--bg:#0f0f0f] [--fg:#efefed] [--dim:#7d7d7d] [--line:rgb(239_239_237/0.12)] [--card:#191919] [--dot:rgb(239_239_237/0.22)] [--accent:#ff6a3d]",
};

// The page's frame: a margin each side and four equal columns inside it.
export const frame = "mx-auto w-full px-[clamp(1rem,1.75vw,2rem)]";
// The Opus reference's frame, for the templates section: 60px margins
// at Full HD (narrower on smaller screens), the content never wider than
// 1800px and centred beyond that.
export const opusFrame = "mx-auto w-full max-w-[calc(1800px+2*clamp(1rem,3.125vw,3.75rem))] px-[clamp(1rem,3.125vw,3.75rem)]";
export const grid = "grid grid-cols-1 lg:grid-cols-4";

export const type = {
  // The hero's two giant words, bold as in the Moire reference, sized to the
  // middle two columns they stand in (marked @container).
  giant: "font-[family-name:var(--font-1)] text-[length:27cqi] font-bold uppercase leading-[0.8] tracking-[-0.045em]",
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

// An underlined link with an arrow that steps out on hover (the arrow is an
// ArrowUpRight icon with `arrow`).
export const arrowLink = `${focusRing} group/arrow inline-flex w-fit items-center gap-2 rounded-[2px] border-0 border-b border-solid border-current pb-1 text-[1.25rem] tracking-[-0.02em] no-underline transition-colors duration-300`;
export const arrow = "size-[1.15rem] text-[var(--accent)] transition-transform duration-300 group-hover/arrow:-translate-y-0.5 group-hover/arrow:translate-x-0.5";

// The halftone dots, fading out towards the middle.
export const dots = "pointer-events-none bg-[radial-gradient(circle,var(--dot)_1px,transparent_1.3px)] bg-[size:11px_11px]";
