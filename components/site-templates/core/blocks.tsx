"use client";

import { useRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useField, useSectionId, useTemplate } from "./context";

// The building blocks of every site template. All styling lives here, as
// variants: a template picks options and never writes its own classes, so
// templates stay short and alike. Colours come only from the theme tokens
// (card, foreground, muted-foreground, border, primary) and fonts from
// font-sans / font-display, so palettes and font packs restyle every block.
// `@xl:` is the desktop layout, measured on the page's width (36rem), so
// tablets and small windows keep it and only phones stack.

// Text blocks take a `field` (editable text of the section) or children.
type Content = { field: string; children?: never } | { field?: never; children: ReactNode };

function FieldText({ field }: { field: string }) {
  return <>{useField(field).node}</>;
}
const content = (props: Content) => (props.field ? <FieldText field={props.field} /> : props.children);

/* ---------- Layout ---------- */

const section = cva("", {
  variants: {
    spacing: {
      none: "",
      // A header: tight under, more room over from the desktop layout up.
      sm: "pb-3 pt-5 @xl:pt-8",
      // A footer or a thin band.
      xs: "py-6 @xl:py-8",
      md: "py-14 @xl:py-20",
      lg: "py-20 @xl:py-28",
      // Right under the header, such as a hero.
      hero: "pb-16 pt-2 @xl:pb-24 @xl:pt-0",
      // A hero that fills the rest of the screen under a MenuHeader (6.75rem
      // tall), so the page opens on exactly one full view. Phones keep the
      // natural height.
      screen: "pb-16 pt-2 @xl:grid @xl:h-[calc(100svh-6.75rem)] @xl:min-h-[34rem] @xl:pb-0 @xl:pt-0",
      // A hero filling the whole screen, for a page whose header takes no
      // room (a SideRail). Phones keep the natural height, clear of the menu button.
      viewport: "pb-16 pt-20 @xl:grid @xl:h-[100svh] @xl:min-h-[34rem] @xl:pb-0 @xl:pt-[6.75rem]",
      // Room above only, for a section whose content fills the screens below.
      start: "pt-20 @xl:pt-28",
      // Room below only, for a section that opens with a PinnedTitle.
      end: "pb-20 @xl:pb-28",
      // At least one full screen, as on a stacking page.
      full: "min-h-[100svh] py-20 @xl:py-28",
    },
    // The side margins: `wide` for airy, editorial pages.
    // `rail`: wide, with room on the right for a SideRail.
    gutter: { normal: "px-5 @xl:px-8", wide: "px-5 @xl:px-[9cqw]", rail: "px-5 @xl:pl-[9cqw] @xl:pr-[max(9cqw,7.5rem)]" },
    divider: { true: "border-t border-foreground/15", false: "" },
    // Stays at the top of the screen while the page scrolls (a header).
    pinned: { true: "sticky top-0 z-40", false: "" },
    // Cuts off what reaches past the screen's sides (such as a band running
    // to the edge), without breaking anything pinned inside.
    clip: { true: "overflow-x-clip", false: "" },
  },
  defaultVariants: { spacing: "md", gutter: "normal", divider: false, pinned: false, clip: false },
});

export type SectionVariants = VariantProps<typeof section>;

// The content of every section: centred, never wider than 1600px, so very
// wide screens get more margin instead of stretched lines and images. A
// full-screen section passes its height on to its content.
const contentWidth = cva("mx-auto w-full max-w-[1600px]", {
  variants: { spacing: { screen: "@xl:grid", viewport: "@xl:grid", none: "", sm: "", xs: "", md: "", lg: "", hero: "", full: "", start: "", end: "" } },
});

// A section's outer element. It carries the section id, so menu links reach
// it; its background and dividers run full width, its content up to 1600px.
export function Section({
  as: Tag = "section",
  children,
  ...variants
}: { as?: "section" | "header" | "footer"; children: ReactNode } & VariantProps<typeof section>) {
  return (
    <Tag data-section={useSectionId()} className={section(variants)}>
      <div className={contentWidth({ spacing: variants.spacing })}>{children}</div>
    </Tag>
  );
}

const stack = cva("flex flex-col", {
  variants: {
    // `xl`: between the large blocks of a long section, such as an about page;
    // `loose`: the same blocks with a Rule between them.
    gap: { none: "", xs: "gap-2", sm: "gap-4", md: "gap-6", lg: "gap-10", loose: "gap-12 @xl:gap-16", xl: "gap-20 @xl:gap-28" },
    align: { start: "items-start", center: "items-center text-center", stretch: "" },
  },
  defaultVariants: { gap: "sm", align: "stretch" },
});

export function Stack({ children, ...variants }: { children: ReactNode } & VariantProps<typeof stack>) {
  return <div className={stack(variants)}>{children}</div>;
}

const columns = cva("grid grid-cols-1", {
  variants: {
    layout: {
      halves: "@xl:grid-cols-2",
      wideStart: "@xl:grid-cols-[1.1fr_1fr]",
      narrowStart: "@xl:grid-cols-[1fr_1.4fr]",
      // Text beside a large image, as in a portrait hero.
      split: "@xl:grid-cols-[1fr_1.8fr]",
      // A small label on the left and the content on the right, as in an
      // about page.
      labelled: "@xl:grid-cols-[1fr_1.2fr]",
      // The PosterHero's columns (36:46), the second a little way in, where
      // its portrait and the projects' images stand. Use with gap `none`.
      poster: "@xl:grid-cols-[36fr_46fr] @xl:[&>*:nth-child(2)]:pl-[4cqw]",
      // Two halves and a narrow column at the end, such as round links.
      pairEnd: "@xl:grid-cols-[1fr_1fr_auto]",
    },
    gap: { none: "gap-6 @xl:gap-0", md: "gap-8 @xl:gap-[5cqw]", lg: "gap-10 @xl:gap-[6cqw]" },
    align: { start: "items-start", center: "items-center", end: "items-end" },
  },
  defaultVariants: { layout: "halves", gap: "md", align: "start" },
});

// Two columns from the desktop layout up, stacked below it.
export function Columns({ children, ...variants }: { children: ReactNode } & VariantProps<typeof columns>) {
  return <div className={columns(variants)}>{children}</div>;
}

const grid = cva("grid grid-cols-1", {
  variants: {
    // Wider grids add columns in steps, so cards never get too narrow.
    cols: { 2: "@xl:grid-cols-2", 3: "@xl:grid-cols-2 @3xl:grid-cols-3", 4: "@xl:grid-cols-2 @5xl:grid-cols-4" },
    // `wide`: more room between rows, for image-led cards.
    // `tight`: small items such as client names.
    gap: { md: "gap-12 @xl:gap-8", wide: "gap-12 @xl:gap-x-8 @xl:gap-y-16", tight: "gap-x-6 gap-y-7" },
  },
  defaultVariants: { cols: 3, gap: "md" },
});

// Cards in a row from the desktop layout up.
export function Grid({ children, ...variants }: { children: ReactNode } & VariantProps<typeof grid>) {
  return <div className={grid(variants)}>{children}</div>;
}

/* ---------- Text ---------- */

const heading = cva("m-0", {
  variants: {
    size: {
      // A name or statement filling a hero.
      hero: "text-[length:clamp(3.5rem,6.6cqw,7.5rem)] leading-[0.92]",
      display: "text-[length:clamp(2.75rem,7cqw,5.25rem)] leading-[1.02]",
      xl: "text-[length:clamp(2.25rem,5cqw,3.75rem)] leading-none",
      lg: "text-[2.125rem] leading-tight",
      md: "text-xl leading-snug",
    },
    font: {
      display: "font-display font-black tracking-[-0.02em]",
      // The display font at a lighter weight, for grotesk-style templates.
      displaySoft: "font-display font-medium tracking-[-0.035em]",
      sans: "font-normal",
    },
  },
  defaultVariants: { size: "xl", font: "display" },
});

export function Heading({ level = 2, ...props }: Content & { level?: 1 | 2 | 3 } & VariantProps<typeof heading>) {
  const Tag = `h${level}` as const;
  return <Tag className={heading({ size: props.size, font: props.font })}>{content(props)}</Tag>;
}

const body = cva("", {
  variants: {
    size: {
      sm: "text-sm leading-[1.7]",
      md: "text-[15px] leading-relaxed",
      // A short introduction under a hero heading.
      lead: "text-[length:clamp(1rem,1.1cqw,1.25rem)] leading-[1.6]",
      lg: "text-[length:clamp(1.125rem,2cqw,1.5rem)] leading-normal",
      // Medium and a little tight, as the PosterHero's tagline.
      statement: "text-[length:clamp(1.05rem,1.35cqw,1.35rem)] font-medium leading-snug tracking-[-0.01em]",
      xl: "text-xl",
    },
    tone: { default: "", muted: "text-muted-foreground" },
    // `mono`: the template's typewriter face, as in a list of details.
    font: { sans: "", mono: "font-mono text-[14px] leading-[1.65] tracking-[0.01em]" },
    // Line length: `tight` for a two-line intro, `narrow` for a short paragraph.
    measure: { none: "", tight: "max-w-[26rem]", narrow: "max-w-[30rem]", wide: "max-w-[40rem]" },
  },
  defaultVariants: { size: "md", tone: "default", font: "sans", measure: "none" },
});

export function Body(props: Content & VariantProps<typeof body>) {
  return <div className={body({ size: props.size, tone: props.tone, font: props.font, measure: props.measure })}>{content(props)}</div>;
}

const eyebrow = cva("text-[11px] font-medium uppercase tracking-[0.1em]", {
  variants: { tone: { default: "", muted: "text-muted-foreground" } },
  defaultVariants: { tone: "default" },
});

// A small uppercase label, such as a date or "Full ingredients".
export function Eyebrow(props: Content & VariantProps<typeof eyebrow>) {
  return <div className={eyebrow({ tone: props.tone })}>{content(props)}</div>;
}

const posterTitle = cva("m-0 font-display uppercase tracking-[-0.03em] [overflow-wrap:anywhere]", {
  variants: {
    size: {
      // As the PosterHero's name, the largest on the page.
      xl: "text-[length:clamp(3.25rem,7.4cqw,8.5rem)] font-black leading-[0.86]",
      // A section's title: well under the name, and a step lighter.
      section: "text-[length:clamp(2.25rem,4.4cqw,4.75rem)] font-bold leading-[0.9]",
      // A project's or a block's title.
      lg: "text-[length:clamp(2rem,3.6cqw,4.25rem)] font-black leading-[0.9]",
      // A name in a list, such as a company or a client.
      sm: "text-[length:clamp(1.25rem,1.6cqw,1.6rem)] font-black leading-none",
    },
  },
  defaultVariants: { size: "xl" },
});

// A title in heavy capitals, as a fashion poster's, ending in a full stop
// (unless `stop` is false, or it already ends in one).
export function PosterTitle({ field, level = 2, stop = true, size }: { field: string; level?: 1 | 2 | 3 | 4; stop?: boolean } & VariantProps<typeof posterTitle>) {
  const { value, editing, node } = useField(field);
  const Tag = `h${level}` as const;
  const ended = !stop || !value || /[.!?]$/.test(value);
  return <Tag className={posterTitle({ size })}>{editing ? node : ended ? value : `${value}.`}</Tag>;
}

// A small label in the accent colour, in capitals, such as a discipline or a
// row's name.
export function AccentLabel({ field }: { field: string }) {
  return (
    <span className="inline-block self-start bg-primary px-2 py-1 text-[11px] font-medium uppercase leading-none tracking-[0.06em] text-card">
      {useField(field).node}
    </span>
  );
}

/* ---------- Motion ---------- */

const revealEase = [0.22, 1, 0.36, 1] as const;

// Brings its content in once it scrolls into view, after `delay` seconds.
// `rise`: fades up a little, for text and small pieces. `mask`: slides up
// from behind an invisible edge, for large headings. Shows the content
// still for visitors who ask for reduced motion.
export function Reveal({ effect = "rise", delay = 0, children }: { effect?: "rise" | "mask"; delay?: number; children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  // The frame is watched, not the content: content hidden behind the mask
  // edge never counts as in view.
  const frameInView = useInView(frameRef, { once: true });
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div>{children}</div>;

  if (effect === "mask") {
    return (
      // A little room below, so descenders (g, y) are not cut off.
      <div ref={frameRef} className="-mb-[0.12em] overflow-hidden pb-[0.12em]">
        <motion.div
          initial={{ y: "105%" }}
          animate={{ y: frameInView ? "0%" : "105%" }}
          transition={{ duration: 1.1, ease: revealEase, delay }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: revealEase, delay }}
    >
      {children}
    </motion.div>
  );
}

// A section's title that stays at the top of the screen while the rest of
// the section scrolls up under it. Put it first, in a section with `end` spacing.
export function PinnedTitle({ children }: { children: ReactNode }) {
  return <div className="sticky top-0 z-10 bg-card pb-12 pt-20 @xl:pb-16 @xl:pt-28">{children}</div>;
}

// A row's label that stays in view, just under the PinnedTitle, while the
// row's content scrolls; the next row's label then takes over. Its offset is
// the PinnedTitle's height (padding 7rem + 4rem, and an xl heading).
// From the desktop layout up; on phones the label sits above its content.
export function PinnedLabel({ children }: { children: ReactNode }) {
  return <div className="@xl:sticky @xl:top-[calc(11rem+clamp(2.25rem,5cqw,3.75rem))]">{children}</div>;
}

// Small boxed labels, such as disciplines, wrapping onto more rows as needed.
export function Tags({ children }: { children: ReactNode }) {
  return <div className="flex max-w-[24rem] flex-wrap gap-2.5">{children}</div>;
}

// One boxed label whose text is a field. An empty one is left out of the
// page (but stays in the editor, so it can be filled in again).
// With a `delay`, it rises into view after that many seconds.
export function Tag({ field, delay }: { field: string; delay?: number }) {
  const { value, editing, node } = useField(field);
  if (!value && !editing) return null;
  const tag = <span className="block border border-foreground/25 px-4 py-2.5 text-[13px] leading-none tracking-[0.03em]">{node}</span>;
  return delay === undefined ? tag : <Reveal delay={delay}>{tag}</Reveal>;
}

/* ---------- Links and buttons ---------- */

const link = cva("inline-block text-foreground no-underline", {
  variants: {
    size: {
      // Small, underlined capitals.
      small: "border-b border-foreground pb-1 text-xs uppercase tracking-[0.12em]",
      // Plain text with a fine underline, darkening on hover, as in a list
      // of contact details.
      underline: "border-0 border-b border-solid border-foreground/35 pb-0.5 text-[15px] leading-snug transition-colors duration-300 hover:border-foreground",
      // Large capitals, as an email address set as a headline, turning to the
      // accent on hover.
      display: "font-display text-[length:clamp(1.6rem,3cqw,3.1rem)] font-bold uppercase leading-none tracking-[-0.02em] [overflow-wrap:anywhere] transition-colors duration-300 hover:text-primary",
      // Plain words, brightening on hover, as a row of links on a dark band.
      plain: "text-[15px] text-current opacity-75 transition-opacity duration-300 hover:opacity-100",
      // The same in the typewriter face, a solid underline fading on hover.
      mono: "border-0 border-b border-solid border-foreground pb-px font-mono text-[14px] leading-snug tracking-[0.01em] transition-opacity duration-300 hover:opacity-55",
      // Large and quiet, darkening on hover, as in a contact block.
      large: "font-display text-[length:clamp(1.5rem,2.4cqw,2.25rem)] leading-tight [overflow-wrap:anywhere] tracking-[-0.03em] text-muted-foreground/70 transition-colors duration-300 hover:text-foreground",
    },
  },
  defaultVariants: { size: "small" },
});

// A link whose text is a field, such as an email address. Its address comes
// from `href` (given the text), or from another field, `hrefField`. While
// editing it is plain text, so it can be typed into.
export function FieldLink({
  field,
  href,
  hrefField,
  size,
}: { field: string; href?: (value: string) => string; hrefField?: string } & VariantProps<typeof link>) {
  const { value, editing, node } = useField(field);
  const target = useField(hrefField ?? field).value;
  if (editing) return <span className={link({ size })}>{node}</span>;
  return (
    <a href={hrefField ? target : (href?.(value) ?? value)} className={link({ size })} {...(hrefField ? { target: "_blank", rel: "noreferrer" } : {})}>
      {value}
    </a>
  );
}

const arrowButton = cva(
  "group/arrow inline-flex h-12 cursor-pointer items-center gap-4 self-start border border-solid px-6 text-[11px] font-medium uppercase tracking-[0.14em] no-underline transition-colors duration-500",
  {
    variants: {
      tone: {
        // A thin outline, darkening on hover.
        outline: "border-foreground/20 bg-transparent text-foreground hover:border-foreground",
        // Filled with the accent, turning black on hover: the main action.
        accent: "border-primary bg-primary text-card hover:border-foreground hover:bg-foreground",
        // Filled black, turning to the accent on hover.
        dark: "border-foreground bg-foreground text-card hover:border-primary hover:bg-primary",
      },
    },
    defaultVariants: { tone: "outline" },
  },
);

// A square-cornered button with a thin arrow that stretches out on hover,
// such as Discover more. Its text is a field. It runs `onClick`, or with
// `href` (or the address in the field `hrefField`) it is a link opening
// that address in a new tab (while editing, a plain button, so its text can
// be typed into).
export function ArrowButton({
  field,
  onClick,
  href: address,
  hrefField,
  tone,
}: { field: string; onClick?: () => void; href?: string; hrefField?: string } & VariantProps<typeof arrowButton>) {
  const { node, editing } = useField(field);
  const linked = useField(hrefField ?? field).value;
  const href = address ?? (hrefField ? linked : undefined);
  const inner = (
    <>
      <span>{node}</span>
      <span aria-hidden="true" className="relative h-px w-6 bg-current transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/arrow:w-11">
        <span className="absolute -right-px top-1/2 size-[7px] -translate-y-1/2 rotate-45 border-r border-t border-current" />
      </span>
    </>
  );
  if (href && !editing) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={arrowButton({ tone })}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={editing ? undefined : onClick} className={arrowButton({ tone })}>
      {inner}
    </button>
  );
}

const row = cva("flex items-start gap-4", {
  variants: {
    // `between`: pushed to both ends, such as a role and its dates; it
    // wraps on narrow screens.
    justify: { start: "", between: "flex-wrap justify-between gap-x-8 gap-y-2" },
    align: { start: "", center: "items-center", baseline: "items-baseline" },
  },
  defaultVariants: { justify: "start", align: "start" },
});

// Items side by side, such as a logo beside a name.
export function Row({ children, ...variants }: { children: ReactNode } & VariantProps<typeof row>) {
  return <div className={row(variants)}>{children}</div>;
}

const tile = cva("grid shrink-0 place-items-center font-display tracking-[-0.02em]", {
  variants: {
    size: { md: "size-12 text-lg", sm: "size-9 text-[13px]" },
    tone: { light: "bg-foreground/[0.06] text-foreground", dark: "bg-foreground text-card", accent: "bg-primary text-card" },
    // `square`: sharp corners and heavier, as the PosterHero's black square.
    shape: { rounded: "rounded-lg", square: "font-black" },
  },
  defaultVariants: { size: "md", tone: "light", shape: "rounded" },
});

// A small square with initials or a mark, standing in for a logo.
export function Tile({ field, ...variants }: { field: string } & VariantProps<typeof tile>) {
  return <span className={tile(variants)}>{useField(field).node}</span>;
}

// A detail as a label and its value on one line, such as "Email us" and an
// address: the label quiet, in the typewriter face, in its own column.
export function Detail({ field, children }: { field: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 @xl:grid-cols-[9.5rem_1fr]">
      <span className="font-mono text-[14px] tracking-[0.01em] text-muted-foreground">{useField(field).node}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// The distance from the content's edges to the screen's, in a `rail` Section
// (its margins, and the room either side of the 1600px content width).
const bleed =
  "-mx-5 @xl:-ml-[calc(9cqw+max(0px,(100cqw-9cqw-max(9cqw,7.5rem)-1600px)/2))] @xl:-mr-[calc(max(9cqw,7.5rem)+max(0px,(100cqw-9cqw-max(9cqw,7.5rem)-1600px)/2))]";

const band = cva(bleed, {
  variants: {
    tone: { soft: "bg-foreground/[0.04]", dark: "bg-foreground text-card", accent: "bg-primary text-card" },
  },
  defaultVariants: { tone: "soft" },
});

const bandInner = cva("px-5 @xl:pl-[9cqw] @xl:pr-[max(9cqw,7.5rem)]", {
  variants: {
    // `screen`: at least a full screen tall, its content centred in it.
    // `flush`: no room above and below, for content that sets its own.
    height: { auto: "py-16 @xl:py-24", screen: "py-16 @xl:flex @xl:min-h-[100svh] @xl:items-center @xl:py-24", flush: "" },
  },
  defaultVariants: { height: "auto" },
});

// A band running edge to edge across the screen (in a `rail` Section), its
// content lined up with the rest of the page: `soft` a light tint, `dark`
// the text colour, `accent` the accent colour, their text light.
export function Band({ children, tone, height }: { children: ReactNode } & VariantProps<typeof band> & VariantProps<typeof bandInner>) {
  return (
    <div data-band={tone ?? "soft"} className={band({ tone })}>
      <div className={bandInner({ height })}>
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </div>
    </div>
  );
}

// A lead-in, a long arrow drawing itself towards a link, and the link:
// "Have a project in mind? ——→ Say hello". The link's address is the field
// `hrefField`, through `href` if given (such as an email into a mail link).
export function ArrowLead({ field, linkField, hrefField, href: toHref }: { field: string; linkField: string; hrefField: string; href?: (value: string) => string }) {
  const still = useReducedMotion();
  const lead = useField(field).node;
  const { node, editing } = useField(linkField);
  const target = useField(hrefField).value;
  const href = toHref ? toHref(target) : target;
  return (
    <div className="flex w-full max-w-[46rem] items-center gap-5 text-[length:clamp(1.1rem,1.7cqw,1.7rem)] tracking-[-0.02em] @xl:gap-8">
      <span className="shrink-0 opacity-80">{lead}</span>
      <span aria-hidden="true" className="relative h-px flex-1">
        <motion.span
          className="absolute inset-0 origin-left bg-current"
          initial={still ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
        />
        <span className="absolute -right-px top-1/2 size-2.5 -translate-y-1/2 rotate-45 border-0 border-r border-t border-solid border-current" />
      </span>
      {editing ? (
        <span className="shrink-0">{node}</span>
      ) : (
        <a href={href} className="shrink-0 text-current no-underline transition-colors duration-300 hover:text-primary">
          {node}
        </a>
      )}
    </div>
  );
}

// A round link with a short mark in it (such as "in" for LinkedIn), filling
// black on hover. Its mark is `field`, its name (for screen readers)
// `labelField` and its address `hrefField`.
export function RoundLink({ field, labelField, hrefField }: { field: string; labelField: string; hrefField: string }) {
  const { node, editing } = useField(field);
  const label = useField(labelField).value;
  const href = useField(hrefField).value;
  const round =
    "grid size-12 place-items-center rounded-full bg-foreground/[0.07] text-[13px] font-semibold lowercase text-foreground no-underline transition-colors duration-300 hover:bg-foreground hover:text-card";
  if (editing) return <span className={round}>{node}</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={round}>
      {node}
    </a>
  );
}

// A thin line between items. With `draw`, it draws itself from the left
// once it comes into view.
export function Rule({ draw = false }: { draw?: boolean }) {
  const still = useReducedMotion();
  if (!draw || still) return <hr className="m-0 border-0 border-t border-foreground/10" />;
  return (
    <motion.hr
      className="m-0 origin-left border-0 border-t border-foreground/15"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

const accentBand = cva("relative", {
  variants: {
    // `edge`: runs on to the screen's right edge (in a `rail` Section with
    // `clip`). `inset`: a thin bar within its box, such as a sheet's footer.
    reach: {
      edge: "-mr-5 h-[clamp(2.5rem,6svh,4.5rem)] @xl:-mr-[calc(max(9cqw,7.5rem)+max(0px,(100cqw-9cqw-max(9cqw,7.5rem)-1600px)/2))]",
      inset: "h-3",
    },
  },
  defaultVariants: { reach: "edge" },
});

// The PosterHero's accent band, as a closing mark: it sweeps in from the
// right once in view, a small black square at its start.
export function AccentBand(variants: VariantProps<typeof accentBand>) {
  const still = useReducedMotion();
  const inset = variants.reach === "inset";
  return (
    <div aria-hidden="true" className={accentBand(variants)}>
      <motion.div
        className="absolute inset-0 origin-right bg-primary"
        initial={still ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        className={inset ? "absolute bottom-0 left-0 size-3 bg-foreground" : "absolute bottom-0 left-0 size-[clamp(1.25rem,2cqw,2rem)] bg-foreground"}
        initial={still ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: revealEase, delay: 1 }}
      />
    </div>
  );
}

// One part of a long section, named by its `field` for a SectionLabel.
export function Chapter({ field, children }: { field: string; children: ReactNode }) {
  return (
    <div data-label-item data-label-name={useField(field).value}>
      {children}
    </div>
  );
}

const button = cva("cursor-pointer text-xs uppercase tracking-[0.12em] text-foreground transition-colors duration-200 disabled:cursor-default disabled:opacity-30", {
  variants: {
    variant: {
      outline: "h-[46px] rounded-full border-[1.5px] border-foreground bg-transparent px-6 hover:bg-foreground hover:text-card",
      ghost: "border-0 bg-transparent",
    },
    // `fill` takes the room left in its row.
    width: { auto: "", fill: "flex-1" },
  },
  defaultVariants: { variant: "outline", width: "auto" },
});

export function Button({ variant, width, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>) {
  return <button type="button" {...props} className={button({ variant, width })} />;
}

// The site menu: one link per section with a `menu` name. Following a link
// scrolls to its section, or in the editor switches to it.
const menuList = cva("m-0 flex list-none p-0", {
  variants: {
    size: {
      // A row of small links, as in a header.
      inline: "justify-center gap-[18px] @xl:gap-11",
      // Plain small words in a row, as in a poster-like header.
      small: "gap-[2.5cqw]",
      // Large links one under another, as in a menu panel.
      large: "flex-col gap-1",
    },
  },
  defaultVariants: { size: "inline" },
});

const menuLink = cva("text-foreground no-underline transition-colors duration-300", {
  variants: {
    size: {
      inline: "border-b pb-1 text-[11px] uppercase tracking-[0.12em]",
      small: "border-b border-transparent pb-0.5 text-[13px] hover:border-foreground/40",
      large: "font-display text-[length:clamp(2rem,4.5cqw,3.5rem)] font-medium leading-tight tracking-[-0.03em]",
    },
    current: { true: "", false: "" },
  },
  compoundVariants: [
    { size: "inline", current: true, className: "border-foreground" },
    { size: "inline", current: false, className: "border-transparent hover:border-foreground/40" },
    { size: "large", current: false, className: "text-foreground/45 hover:text-foreground" },
  ],
  defaultVariants: { size: "inline", current: false },
});

// `onFollow` runs after a link is followed (to close a menu panel).
// The links are the template's sections with a `menu` name, or `items` with
// `onPick` (such as the panels of a pinned story).
export function Menu({
  size,
  onFollow,
  items,
  onPick,
  active,
}: VariantProps<typeof menuList> & {
  onFollow?: () => void;
  items?: { id: string; label: string }[];
  onPick?: (id: string) => void;
  active?: string;
}) {
  const { template, current, navigate } = useTemplate();
  const links = items ?? template.sections.filter((item) => item.menu).map(({ id, menu }) => ({ id, label: menu ?? id }));
  const selected = active ?? current;
  const follow = (event: MouseEvent, id: string) => {
    event.preventDefault();
    if (onPick) onPick(id);
    else navigate(id);
    onFollow?.();
  };
  return (
    <nav>
      <ul className={menuList({ size })}>
        {links.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(event) => follow(event, id)}
              aria-current={selected === id ? "location" : undefined}
              className={menuLink({ size, current: selected === id })}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Media ---------- */

const media = cva("w-full overflow-hidden bg-muted", {
  variants: {
    ratio: {
      square: "aspect-square",
      tall: "aspect-[3/4]",
      portrait: "aspect-[4/5]",
      landscape: "aspect-[4/3]",
      wide: "aspect-[16/9]",
      // As tall as its row from the desktop layout up (a full-screen hero),
      // 3:4 on phones.
      fill: "aspect-[3/4] @xl:aspect-auto @xl:self-stretch",
      // A wide band across the middle of a full-screen hero, room above and
      // below it, 3:4 on phones.
      band: "aspect-[3/4] @xl:aspect-auto @xl:h-[60svh] @xl:self-center",
    },
    // Shown above the text on phones, in its place from the desktop layout up.
    mobileFirst: { true: "order-first @xl:order-none", false: "" },
    // `mono`: black and white, turning to colour (and zooming gently) on hover.
    tone: {
      color: "",
      mono: "group/media [&_img]:grayscale [&_img]:transition-[filter,transform] [&_img]:duration-700 hover:[&_img]:scale-[1.03] hover:[&_img]:grayscale-0",
    },
    // From the desktop layout up, reaches past the section's right margin
    // (in a section with the `rail` gutter): `rail` to the SideRail's edge,
    // `edge` to the edge of the screen, under the rail (also past the 1600px
    // content width on very wide screens).
    bleed: {
      none: "",
      rail: "@xl:w-auto @xl:-mr-[calc(max(9cqw,7.5rem)-5rem)]",
      edge: "@xl:w-auto @xl:-mr-[calc(max(9cqw,7.5rem)+max(0px,(100cqw-9cqw-max(9cqw,7.5rem)-1600px)/2))]",
    },
  },
  defaultVariants: { ratio: "landscape", mobileFirst: false, bleed: "none", tone: "color" },
});

// Which part of an image stays in view when its box crops it: the middle,
// or `top` (a little above the middle, where faces usually are).
const imageFocus = cva("block h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.03]", {
  variants: { focus: { center: "", top: "object-[50%_12%]" } },
  defaultVariants: { focus: "center" },
});

function FieldImage({ field, label, focus }: { field: string; label?: string } & VariantProps<typeof imageFocus>) {
  const src = useField(field).value;
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- user images from any host
    <img
      src={src}
      alt={label ?? ""}
      loading="lazy"
      decoding="async"
      className={imageFocus({ focus })}
    />
  );
}

// An image box: the image whose address is the section's `field`, or
// `children` as artwork. `label` describes it (without one it is decorative).
// Inside a Card, the image zooms in slightly on hover. `focus` picks the part
// kept in view when the box crops the image.
export function Media({
  field,
  children,
  label,
  focus,
  ...variants
}: { field?: string; children?: ReactNode; label?: string } & VariantProps<typeof media> & VariantProps<typeof imageFocus>) {
  return (
    <div role={label && !field ? "img" : undefined} aria-label={field ? undefined : label} aria-hidden={label ? undefined : true} className={media(variants)}>
      {field ? <FieldImage field={field} label={label} focus={focus} /> : children}
    </div>
  );
}

// A portrait's frame, as the PosterHero's: not too wide, with a small black
// square at its lower corner.
export function Portrait({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-[22rem]">
      {children}
      <span aria-hidden="true" className="absolute -bottom-3 -right-3 size-[clamp(1.25rem,2cqw,2rem)] bg-foreground" />
    </div>
  );
}

// A project or post: its image and text, with the image zooming on hover.
export function Card({ children }: { children: ReactNode }) {
  return <article className="group/card flex flex-col gap-3">{children}</article>;
}
