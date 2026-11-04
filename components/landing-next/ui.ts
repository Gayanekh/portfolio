// The look of the new landing ("Exhibit"): a portfolio builder presented as
// a night gallery opening into a daylight studio. Deep ink rooms and warm
// bone walls, an iris-to-peach glow as its signature, a characterful
// grotesque for headlines with serif italic accents, and mono labels.
// Every section takes its classes from here, so the page stays one piece.
// Sizes are single clamp()s from a 390px phone to a 2560px screen, in rem so
// the page scales above Full HD with the rest of the site.

export const ease = [0.22, 1, 0.36, 1] as const;
export const pad = (n: number) => String(n).padStart(2, "0");

// The page's colours, set once on its root.
export const palette = "[--ink:#0b0a0f] [--ink-2:#16141d] [--bone:#f4f1ea] [--bone-2:#e8e3d8] [--iris:#9d8cff] [--iris-deep:#5a45e0] [--peach:#ffb38a] [--mist:#a8a4b4]";

// The content's width, the same in every section.
export const shell = "mx-auto w-[min(90vw,92rem)]";

export const font = {
  display: "font-[family-name:var(--nl-display)]",
  serif: "font-[family-name:var(--nl-serif)] font-normal italic tracking-[-0.01em]",
  mono: "font-[family-name:var(--nl-mono)]",
};

// The accent words of a headline: the glow on ink, deep iris on bone.
export const accent = {
  dark: `${font.serif} bg-gradient-to-r from-[var(--iris)] via-[#c9b8ff] to-[var(--peach)] bg-clip-text pr-[0.08em] text-transparent`,
  light: `${font.serif} pr-[0.08em] text-[var(--iris-deep)]`,
};

export const type = {
  // The hero's headline: 54px on phones to 200px at 2560px.
  mega: `${font.display} text-[length:clamp(3.375rem,calc(1.73rem_+_6.75vw),12.5rem)] font-semibold leading-[0.88] tracking-[-0.05em]`,
  // A section's headline: 38px to 104px.
  title: `${font.display} text-[length:clamp(2.375rem,calc(1.634rem_+_3.04vw),6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]`,
  // A card's or step's headline: 24px to 44px.
  heading: `${font.display} text-[length:clamp(1.5rem,calc(1.275rem_+_0.92vw),2.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]`,
  small: `${font.display} text-[length:clamp(1.15rem,calc(1.05rem_+_0.4vw),1.6rem)] font-semibold leading-tight tracking-[-0.03em]`,
  // An intro paragraph: 16px to 21px.
  lead: "text-[length:clamp(1rem,calc(0.944rem_+_0.23vw),1.3125rem)] leading-relaxed",
  body: "text-[length:clamp(0.9375rem,calc(0.91rem_+_0.1vw),1.0625rem)] leading-relaxed",
  // A small label in capitals.
  label: `${font.mono} text-[0.75rem] uppercase tracking-[0.18em]`,
};

// The vertical space of a section.
export const space = "py-[clamp(5.5rem,calc(3.5rem_+_7vw),12rem)]";

export const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--iris)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

// Square-cornered buttons (4px).
const base = `${focusRing} group/button relative inline-flex h-[3.25rem] cursor-pointer items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-[4px] border-0 px-6 text-[0.9375rem] font-medium no-underline transition-[background-color,border-color,color,box-shadow,transform] duration-300 active:scale-[0.97]`;
export const button = {
  // Bone on ink, an iris glow lifting on hover.
  light: `${base} bg-[var(--bone)] text-[var(--ink)] shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_12px_40px_-12px_rgb(157_140_255/0.55)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.4),0_18px_60px_-10px_rgb(157_140_255/0.9)]`,
  ghost: `${base} border border-solid border-white/20 bg-white/[0.04] text-[var(--bone)] backdrop-blur-md hover:border-white/50 hover:bg-white/[0.08]`,
  // Ink on bone.
  ink: `${base} bg-[var(--ink)] text-[var(--bone)] hover:bg-[var(--iris-deep)]`,
  outline: `${base} border border-solid border-[var(--ink)]/15 bg-transparent text-[var(--ink)] hover:border-[var(--ink)]/50`,
};
export const buttonArrow = "size-[1.125rem] transition-transform duration-300 group-hover/button:translate-x-1";

// Layered soft shadows: a close contact shadow, then wider, fainter ones.
export const shadow = {
  card: "shadow-[0_1px_2px_rgb(11_10_15/0.06),0_12px_28px_-12px_rgb(11_10_15/0.18),0_40px_80px_-30px_rgb(11_10_15/0.28)]",
  float: "shadow-[0_2px_6px_rgb(0_0_0/0.3),0_30px_70px_-20px_rgb(0_0_0/0.7)]",
};

// Faint film grain (an SVG noise tile) laid over a surface.
export const grain =
  "pointer-events-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")] opacity-[0.07]";
