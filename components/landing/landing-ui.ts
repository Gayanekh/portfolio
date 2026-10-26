// Shared Tailwind class strings for the landing page, matching the reference
// template's visual system: theme ink on the global background, card surfaces with a
// hairline shadow, 1rem radii, flat brand-colour buttons and a fluid type
// scale that follows the screen's width smoothly. Sizes are in rem, so text
// still grows with browser text zoom.

export const ease = [0.22, 1, 0.36, 1] as const;

// An eased fade, as gradient stops from 0 to 1 (an ease-in-out curve sampled
// along it), so a fade between sections has no visible start or end. `stop`
// turns an amount (0 to 1) and a position (%) into one stop.
const EASED = [0, 0.013, 0.049, 0.104, 0.175, 0.259, 0.352, 0.45, 0.55, 0.648, 0.741, 0.825, 0.896, 0.951, 0.987, 1];
export const easedStops = (stop: (amount: number, at: number) => string) => EASED.map((amount, i) => stop(amount, (i / (EASED.length - 1)) * 100)).join(", ");

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground";

/* ---------- Responsive system ----------
   Screens (Tailwind's own, used site-wide; set them here, not per section):
     phone   < 640px          (no prefix)
     tablet  sm 640 · md 768
     laptop  lg 1024          (e.g. 1366×768)
     desktop xl 1280 · 2xl 1536
     large   3xl 1920 · 4xl 2400 (Full HD and up; tailwind.config.ts)
   Screens only change a layout (columns, what shows). Sizes never jump at
   one: every text size, padding, margin and gap is one clamp() — a minimum,
   a part that grows with the screen's width, and a maximum:
     text-[length:clamp(2.5rem,calc(2.141rem_+_1.475vw),4.5rem)]
   is 40px (2.5rem) on a 390px-wide screen, growing steadily to 72px
   (4.5rem) at 2560px. To size MIN px at screen W1 up to MAX px at W2:
     vw  = (MAX − MIN) / (W2 − W1) × 100
     rem = (MIN − vw × W1 / 100) / 16
     clamp(MIN/16 rem, calc(rem + vw), MAX/16 rem)
   (In Tailwind classes "_" stands for a space.) Portfolio templates use cqw
   (their own frame's width) in place of vw. Widths use %, min() and
   max-width; images and cards keep their aspect ratio.
   Above Full HD the whole page scales as one picture: the root size (1rem)
   grows with the screen from 1920px (globals.css, pages marked
   data-site-scale), so write sizes in rem or vw, never px, or they won't
   follow. Big showcase blocks also
   scale with the screen's HEIGHT: `fit` sizes equal the design on screens
   1440px tall and up and shrink in proportion below (Full HD's 1080px,
   laptops' 768px), so a block meant to fit one screen still does. */
export const fit = {
  // Vertical padding of a full section: 5rem on phones, 8rem from 1024px
  // wide, and less on screens under 1440px tall (8.9svh, never under 5rem).
  sectionY: "[--fluid:clamp(5rem,calc(3.155rem_+_7.571vw),8rem)] py-[min(var(--fluid),max(5rem,8.9svh))]",
  // "Make it yours": the live template's window. Desktop previews (1024px and
  // up) keep a 16:10 shape at the column's full width, like the templates
  // slider; the phone preview is 76% of the screen's height, at most 46rem.
  previewDesktop: "aspect-[16/10]",
  previewHeight: "h-[min(76vh,46rem)]",
  // The templates slider's card, sized like squarespace.com's "Grow your
  // business" slider: the full width at 3:4 on phones and 4:3 on tablets,
  // and from 1024px up 61.8% of the screen's width at 16:10 (844×528 at
  // 1366px, 1187×742 at 1920px), so it grows and shrinks with the screen.
  slideWidth: "aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/10] lg:w-[61.8vw]",
} as const;

// Every heading and text size of the site's own pages, by name, so a size is
// changed here once: each a single clamp() from its phone size to its
// largest size (see the note above).
export const fluidText = {
  // The landing's hero headline and text. From md up they sit in the narrow
  // left column (marked @container) and shrink with it, like a picture: the
  // headline stays 17% of the column's width (its share at 1366px), so it
  // keeps its line breaks on every screen; the text down to 14px.
  heroTitle: "text-[length:clamp(2.68rem,calc(2.111rem_+_1.493vw),4.5rem)] md:text-[length:clamp(2rem,min(17.04cqi,calc(2.111rem_+_1.493vw)),4.5rem)]",
  heroText: "text-base md:text-[length:clamp(0.875rem,5.03cqi,1rem)]",
  // A page's own title (the templates page).
  // From md up its grid is marked @container and the title stays 5.875% of
  // the grid's width (its share at 1366px), so it keeps its line breaks.
  pageTitle: "text-[length:clamp(2.5rem,calc(2.047rem_+_1.86vw),5rem)] md:text-[length:clamp(1.75rem,min(calc(2.047rem_+_1.86vw),5.875cqi),5rem)]",
  // The account page's name.
  profileName: "text-[length:clamp(2.4rem,calc(1.44rem_+_1.35vw),3.6rem)]",
  // The editor sidebar's template name.
  editorTitle: "text-[length:clamp(1.9rem,calc(0rem_+_5vw),2.25rem)]",
  // "How it works": the big faded number behind a step (96px on phones,
  // about 141px at 1366px, 186px at Full HD) and the step's title.
  stepNumber: "text-[length:clamp(6rem,calc(2rem_+_8vw),12rem)]",
  stepTitle: "text-[length:clamp(1.75rem,calc(1rem_+_1.5vw),3rem)]",
  // Features: the feature in view (also bound by the screen's height).
  featureTitle: "[--fluid:clamp(1.75rem,calc(1.212rem_+_1.117vw),3rem)] text-[length:clamp(1.25rem,min(var(--fluid),4svh),3rem)]",
  // A template's title on a slider card.
  cardTitle: "text-[length:clamp(1.706rem,calc(1.297rem_+_0.908vw),2.75rem)]",
  // The closing call to action.
  ctaTitle: "text-[length:clamp(1.75rem,calc(1.134rem_+_1.387vw),3.25rem)]",
  // An FAQ question; the footer's lead line.
  question: "text-[length:clamp(1.15rem,calc(0rem_+_1.801vw),1.5rem)]",
  footerLead: "text-[length:clamp(1.15rem,calc(0rem_+_1.6vw),1.45rem)]",
  // The sign-in pages' big serif headline, also bound by the screen's height
  // so it fits short screens.
  // From 861px up it also stays 11.7% of its column (marked @container; its
  // share at 1366px), so its lines never rewrap as the window narrows.
  authTitle: "[--fluid:clamp(3rem,calc(1.744rem_+_3.864vw),7.25rem)] text-[length:max(2.5rem,min(var(--fluid),max(3rem,11svh),11.7cqi))]",
  // The form's heading: 38px, and from 861px (form beside the headline)
  // 10.2% of the form's column (its share at 1366px), down to 24px.
  authFormTitle: "text-[2.375rem] min-[861px]:text-[length:clamp(1.5rem,10.2cqi,2.375rem)]",
} as const;

export const section = "scroll-mt-24 py-20";

// Flat brand colour (white text on it is readable as is), one soft
// shadow that lifts on hover, a slightly deeper shade on hover, and a slight
// press when clicked.
export const primaryButton =
  "bg-primary text-white shadow-[0_1px_2px_rgb(23_23_23/0.12)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-[color:color-mix(in_srgb,var(--primary),black_14%)] hover:shadow-[0_6px_16px_-6px_color-mix(in_srgb,var(--primary),transparent_35%)] active:scale-[0.97] disabled:hover:bg-primary disabled:hover:shadow-[0_1px_2px_rgb(23_23_23/0.12)] disabled:active:scale-100";
export const secondaryButton = "bg-card text-foreground ring-1 ring-inset ring-foreground/10 transition-[background-color,transform] duration-200 hover:bg-foreground/[0.04] active:scale-[0.97]";export const glassPill =
  "rounded-full border border-white/20 bg-white/15 font-medium text-white backdrop-blur-xl";

/* Type scale, named after the reference's steps (phone sizes / tablet and up). */
export const text = {
  xs: "text-[length:clamp(0.671rem,calc(0.562rem_+_0.149vw),0.8rem)]",
  sm: "text-[length:clamp(0.731rem,calc(0.611rem_+_0.181vw),0.9rem)]",
  base: "text-[length:clamp(0.792rem,calc(0.652rem_+_0.218vw),1rem)]",
  // text-base on phones, text-lg from md (hero lede)
  baseLg: "text-[length:clamp(0.792rem,calc(0.666rem_+_0.24vw),1rem)]",
  // text-lg on phones, text-xl from md (section intros, FAQ questions)
  lgXl: "text-[length:clamp(0.853rem,calc(0.733rem_+_0.263vw),1.1rem)]",
  // text-lg / md:text-xl / lg:text-2xl (work captions)
  caption: "text-[length:clamp(0.853rem,calc(0.673rem_+_0.474vw),1.3rem)]",
  "2xl": "text-[length:clamp(1.219rem,calc(1.073rem_+_0.204vw),1.4rem)]",
  // text-4xl / md:text-5xl (about statement)
  about: "text-[length:clamp(1.707rem,calc(1.413rem_+_0.839vw),2.75rem)]",
  // text-5xl / 2xl:text-6xl (statement band)
  statement: "text-[length:clamp(1.829rem,calc(1.328rem_+_1.232vw),3.3rem)]",
  // text-6xl / 2xl:text-7xl (section titles)
  title: "text-[length:clamp(2.072rem,calc(1.592rem_+_1.505vw),4rem)]",
  // text-6xl / md:text-7xl / 2xl:text-8xl (hero), sized for the column inside the hero card
  hero: "text-[length:clamp(2.072rem,calc(1.22rem_+_1.567vw),3.6rem)]",
} as const;

// Large left- or centre-aligned section title, its small label and lead line
// (the FAQ and features sections). A column can keep the title's line breaks
// as it narrows by marking itself @container and setting --fit to the
// title's share of its width at 1366px (e.g. [--fit:8.47cqi]); the title
// then shrinks with the column, like a picture.
export const displayTitle = "m-0 text-balance text-[length:clamp(1.75rem,min(calc(1.5rem_+_1.406vw),var(--fit,100vw)),3.75rem)] font-medium leading-[0.98] tracking-[-0.045em]";
// The brand colour (--primary) as the landing's one accent. Small text uses a
// slightly deeper shade, so it stays readable on the light page.
export const accentText = "text-[color:color-mix(in_srgb,var(--primary),black_13%)]";
const kickerBase = "m-0 text-sm font-medium uppercase tracking-[0.08em]";
export const kicker = `${kickerBase} ${accentText}`;
// The same label on a dark band, where the brand colour itself reads well.
export const kickerOnDark = `${kickerBase} text-primary`;
// A section's subtitle, set like the hero's paragraph (16px, relaxed lines,
// soft ink); on a dark band the section gives its own colour.
export const lead = "m-0 text-pretty text-base leading-relaxed text-foreground/65";
// Plain brand-colour button (the address form and the styler).
export const solidButton = `${focusRing} inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded bg-primary px-6 text-[0.95rem] font-medium text-white no-underline transition-[background-color,transform] duration-200 hover:bg-[color:color-mix(in_srgb,var(--primary),black_14%)] active:scale-[0.97]`;