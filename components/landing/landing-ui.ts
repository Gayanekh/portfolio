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

/* ---------- Responsive system ----------
   Screens (Tailwind's own, used site-wide; set them here, not per section):
     phone   < 640px          (no prefix)
     tablet  sm 640 · md 768
     laptop  lg 1024          (e.g. 1366×768)
     desktop xl 1280 · 2xl 1536
     large   3xl 1920 · 4xl 2400 (Full HD and up; tailwind.config.ts)
   The landing was designed on a 2560×1440 screen. Text widths are fluid and
   capped (see `text` below). Big showcase blocks also scale with the
   screen's HEIGHT: `fit` sizes equal the design on screens 1440px tall and
   up and shrink in proportion below (Full HD's 1080px, laptops' 768px), so
   a block meant to fit one screen still does. */
export const fit = {
  // Vertical padding of a full section (md:py-32; from lg, 8rem on a
  // 1440px-tall screen and less on shorter ones). Phones and tablets keep
  // their design: every `fit` size starts at lg.
  sectionY: "md:py-32 lg:py-[min(8rem,8.9svh)]",
  // "Make it yours": the live template's window (46rem tall at 1440px).
  previewHeight: "h-[min(76vh,46rem)] lg:h-[min(46rem,51.1svh)]",
  // The templates slider's card: 1280×700 at 1440px tall, its width also
  // capped by the screen's height so the card's height fits the screen.
  slideWidth: "lg:w-[min(1280px,calc(100vw-9rem),88.9svh)]",
} as const;

// Every heading and text size of the site's own pages, by name, so a size is
// changed here once. Each grows with the screen and is capped; where a phone
// needs its own size, the md: part takes over from tablets up.
export const fluidText = {
  // The landing's hero headline.
  heroTitle: "text-[length:clamp(2.5rem,11vw,3.5rem)] md:text-[length:clamp(2.75rem,4.6vw,4.5rem)] lg:text-[length:clamp(2.75rem,min(4.6vw,calc(28.8px+1.6875vw)),4.5rem)]",
  // A page's own title (the templates page).
  pageTitle: "text-[length:clamp(2.5rem,9vw,3.5rem)] md:text-[length:clamp(3rem,5vw,5rem)] lg:text-[length:clamp(3rem,min(5vw,calc(32px+1.875vw)),5rem)]",
  // The account page's name.
  profileName: "text-[length:clamp(2.4rem,5.5vw,3.6rem)] lg:text-[length:clamp(2.4rem,min(5.5vw,calc(23.04px+1.35vw)),3.6rem)]",
  // The editor sidebar's template name.
  editorTitle: "text-[length:clamp(1.9rem,5vw,2.25rem)]",
  // "How it works": its title, the big step numbers and each step's title.
  stepsTitle: "text-[length:clamp(2.25rem,3.2vw,3.5rem)] lg:text-[length:clamp(2.25rem,min(3.2vw,calc(22.4px+1.3125vw)),3.5rem)]",
  stepNumber: "text-[length:clamp(4rem,6vw,5.75rem)] lg:text-[length:clamp(4rem,min(6vw,calc(36.8px+2.15625vw)),5.75rem)]",
  stepTitle: "text-[length:clamp(1.25rem,1.6vw,1.5rem)]",
  // Features: the feature in view (also bound by the screen's height).
  featureTitle: "text-[length:clamp(1.75rem,3.4vw,3rem)] md:text-[length:clamp(1.25rem,min(3.4vw,4svh),3rem)] lg:text-[length:clamp(1.25rem,min(3.4vw,4svh,calc(19.2px+1.125vw)),3rem)]",
  // A template's title on a slider card.
  cardTitle: "text-[length:clamp(1.6rem,7vw,2.25rem)] md:text-[length:clamp(1.75rem,3vw,2.75rem)] lg:text-[length:clamp(1.75rem,min(3vw,calc(17.6px+1.03125vw)),2.75rem)]",
  // The closing call to action.
  ctaTitle: "text-[length:clamp(1.75rem,3.5vw,3.25rem)] lg:text-[length:clamp(1.75rem,min(3.5vw,calc(20.8px+1.21875vw)),3.25rem)]",
  // An FAQ question; the footer's lead line.
  question: "text-[length:clamp(1.15rem,1.8vw,1.5rem)]",
  footerLead: "text-[length:clamp(1.15rem,1.6vw,1.45rem)]",
  // The sign-in pages' big serif headline (smaller on short screens).
  authTitle: "text-[clamp(48px,7vw,116px)] lg:text-[length:clamp(48px,min(7vw,calc(46.4px+2.71875vw)),116px)] [@media(min-width:861px)_and_(max-height:760px)]:text-[length:clamp(48px,min(5.6vw,calc(35.2px+2.0625vw)),88px)]",
} as const;

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
  about: "text-[length:clamp(1.4rem,7vw,2.6rem)] md:text-[length:clamp(2.025rem,2.75vw,2.75rem)] lg:text-[length:clamp(2.025rem,min(2.75vw,calc(17.6px+1.03125vw)),2.75rem)]",
  // text-5xl / 2xl:text-6xl (statement band)
  statement: "text-[length:clamp(1.5rem,7.5vw,2.8rem)] md:text-[length:clamp(2.025rem,2.75vw,2.75rem)] 2xl:text-[length:clamp(2.475rem,min(3.3vw,calc(21.12px+1.2375vw)),3.3rem)]",
  // text-6xl / 2xl:text-7xl (section titles)
  title: "text-[length:clamp(1.7rem,8.5vw,3.3rem)] md:text-[length:clamp(2.475rem,3.3vw,3.3rem)] 2xl:text-[length:clamp(3rem,min(4vw,calc(25.6px+1.5vw)),4rem)]",
  // text-6xl / md:text-7xl / 2xl:text-8xl (hero), sized for the column inside the hero card
  hero: "text-[length:clamp(1.7rem,8.5vw,3.3rem)] md:text-[length:clamp(1.9rem,3.2vw,3.25rem)] 2xl:text-[length:clamp(3rem,min(3.4vw,calc(23.04px+1.35vw)),3.6rem)]",
} as const;

// Large left- or centre-aligned section title, its small label and lead line
// (the FAQ and features sections).
export const displayTitle = "m-0 text-balance text-[length:clamp(2.25rem,4vw,3.75rem)] lg:text-[length:clamp(2.25rem,min(4vw,calc(24px+1.40625vw)),3.75rem)] font-medium leading-[0.98] tracking-[-0.045em]";
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
