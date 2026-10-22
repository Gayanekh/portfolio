// Shared Tailwind class strings for the landing page, matching the reference
// template's visual system: theme ink on the global background, card surfaces with a
// hairline shadow, 1rem radii, flat brand-colour buttons and a fluid type
// scale (viewport-based on phones, clamped on larger screens). Mobile sizes
// keep a rem floor and cap so text still grows with browser text zoom.

export const ease = [0.22, 1, 0.36, 1] as const;

// An eased fade, as gradient stops from 0 to 1 (an ease-in-out curve sampled
// along it), so a fade between sections has no visible start or end. `stop`
// turns an amount (0 to 1) and a position (%) into one stop.
const EASED = [0, 0.013, 0.049, 0.104, 0.175, 0.259, 0.352, 0.45, 0.55, 0.648, 0.741, 0.825, 0.896, 0.951, 0.987, 1];
export const easedStops = (stop: (amount: number, at: number) => string) => EASED.map((amount, i) => stop(amount, (i / (EASED.length - 1)) * 100)).join(", ");

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground";

export const section = "scroll-mt-24 py-20";

export const card = "";
// Flat brand colour (white text on it is readable as is), one soft
// shadow that lifts on hover, a slightly deeper shade on hover, and a slight
// press when clicked.
export const primaryButton =
  "bg-primary text-white shadow-[0_1px_2px_rgb(23_23_23/0.12)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-[color:color-mix(in_srgb,var(--primary),black_14%)] hover:shadow-[0_6px_16px_-6px_color-mix(in_srgb,var(--primary),transparent_35%)] active:scale-[0.97] disabled:hover:bg-primary disabled:hover:shadow-[0_1px_2px_rgb(23_23_23/0.12)] disabled:active:scale-100";
export const secondaryButton = "bg-card text-foreground ring-1 ring-inset ring-foreground/10 transition-[background-color,transform] duration-200 hover:bg-foreground/[0.04] active:scale-[0.97]";
// Secondary button placed on a card surface.
export const secondaryOnCard = "bg-white text-foreground ring-1 ring-inset ring-foreground/10 transition-[background-color,transform] duration-200 hover:bg-neutral-50 active:scale-[0.97]";
export const glassPill =
  "rounded-full border border-white/20 bg-white/15 font-medium text-white backdrop-blur-xl";

/* Type scale (mobile vw / md+ clamp), named after the reference's steps. */
export const text = {
  xs: "text-[length:clamp(0.6rem,2.75vw,0.8rem)] md:text-[length:clamp(0.54rem,0.72vw,0.72rem)]",
  sm: "text-[length:clamp(0.65rem,3vw,0.9rem)] md:text-[length:clamp(0.615rem,0.82vw,0.82rem)]",
  base: "text-[length:clamp(0.7rem,3.25vw,1rem)] md:text-[length:clamp(0.69rem,0.92vw,0.92rem)]",
  // text-base on phones, text-lg from md (hero lede)
  baseLg: "text-[length:clamp(0.7rem,3.25vw,1rem)] md:text-[length:clamp(0.75rem,1vw,1rem)]",
  // text-lg on phones, text-xl from md (section intros, FAQ questions)
  lgXl: "text-[length:clamp(0.75rem,3.5vw,1.05rem)] md:text-[length:clamp(0.825rem,1.1vw,1.1rem)]",
  // text-lg / md:text-xl / lg:text-2xl (work captions)
  caption: "text-[length:clamp(0.75rem,3.5vw,1.05rem)] md:text-[length:clamp(0.825rem,1.1vw,1.1rem)] lg:text-[length:clamp(0.975rem,1.3vw,1.3rem)]",
  "2xl": "text-[length:clamp(0.95rem,5vw,1.4rem)] md:text-[length:clamp(0.975rem,1.3vw,1.3rem)]",
  // text-4xl / md:text-5xl (about statement)
  about: "text-[length:clamp(1.4rem,7vw,2.6rem)] md:text-[length:clamp(2.025rem,2.75vw,2.75rem)]",
  // text-5xl / 2xl:text-6xl (statement band)
  statement: "text-[length:clamp(1.5rem,7.5vw,2.8rem)] md:text-[length:clamp(2.025rem,2.75vw,2.75rem)] 2xl:text-[length:clamp(2.475rem,3.3vw,3.3rem)]",
  // text-6xl / 2xl:text-7xl (section titles)
  title: "text-[length:clamp(1.7rem,8.5vw,3.3rem)] md:text-[length:clamp(2.475rem,3.3vw,3.3rem)] 2xl:text-[length:clamp(3rem,4vw,4rem)]",
  // text-6xl / md:text-7xl / 2xl:text-8xl (hero), sized for the column inside the hero card
  hero: "text-[length:clamp(1.7rem,8.5vw,3.3rem)] md:text-[length:clamp(1.9rem,3.2vw,3.25rem)] 2xl:text-[length:clamp(3rem,3.4vw,3.6rem)]",
} as const;

// Large left- or centre-aligned section title, its small label and lead line
// (the FAQ and features sections).
export const displayTitle = "m-0 text-balance text-[length:clamp(2.25rem,4vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.045em]";
// The brand colour (--primary) as the landing's one accent. Small text uses a
// slightly deeper shade, so it stays readable on the light page.
export const accentText = "text-[color:color-mix(in_srgb,var(--primary),black_13%)]";
const kickerBase = "m-0 text-sm font-medium uppercase tracking-[0.08em]";
export const kicker = `${kickerBase} ${accentText}`;
// The same label on a dark band, where the brand colour itself reads well.
export const kickerOnDark = `${kickerBase} text-primary`;
export const lead = "m-0 text-pretty text-lg leading-snug text-neutral-600 md:text-xl";
// Plain brand-colour button (the address form and the styler).
export const solidButton = `${focusRing} inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-primary px-6 text-[0.95rem] font-medium text-white no-underline transition-[background-color,transform] duration-200 hover:bg-[color:color-mix(in_srgb,var(--primary),black_14%)] active:scale-[0.97]`;

export const tag = `${card} ${text.sm} mb-1 w-fit rounded-2xl px-3 py-1`;
export const sectionTitle = `${text.title} m-0 text-balance text-center font-[550] leading-[1.15] tracking-[-0.025em] md:max-w-[80%]`;
export const sectionIntro = `${text.lgXl} m-0 text-balance text-center leading-snug md:max-w-[70%]`;
