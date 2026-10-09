// Shared Tailwind class strings for the landing page, matching the reference
// template's visual system: theme ink on the global background, card surfaces with a
// hairline shadow, 1rem radii, gradient black pill buttons and a fluid type
// scale (viewport-based on phones, clamped on larger screens). Mobile sizes
// keep a rem floor and cap so text still grows with browser text zoom.

export const ease = [0.22, 1, 0.36, 1] as const;

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground";

export const section = "scroll-mt-24 py-20";

export const card = "";
export const primaryButton =
  "bg-[linear-gradient(var(--foreground),color-mix(in_srgb,var(--foreground),black_30%))] text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.12),inset_0_-1px_1px_0_rgb(23_23_23/0.4),0_0_0_0.5px_rgb(255_255_255/0.06),0_1px_2px_0_rgb(23_23_23/0.4),0_4px_8px_-1px_rgb(23_23_23/0.25),0_12px_24px_-4px_rgb(23_23_23/0.2),0_24px_48px_-8px_rgb(23_23_23/0.15)]";
export const secondaryButton = "bg-card text-foreground shadow-[0_1px_2px_0_rgb(23_23_23/0.04)]";
// Secondary button placed on a card surface.
export const secondaryOnCard = "bg-white text-foreground shadow-[0_1px_2px_0_rgb(23_23_23/0.04)]";
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

export const tag = `${card} ${text.sm} mb-1 w-fit rounded-2xl px-3 py-1`;
export const sectionTitle = `${text.title} m-0 text-balance text-center font-[550] leading-[1.15] tracking-[-0.025em] md:max-w-[80%]`;
export const sectionIntro = `${text.lgXl} m-0 text-balance text-center leading-snug md:max-w-[70%]`;
