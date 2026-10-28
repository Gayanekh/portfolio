"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, MoveRight } from "lucide-react";
import { GALLERY_STYLES, SHOWN_TEMPLATES, type GalleryStyle } from "@/components/gallery/gallery-templates";
import { getSiteTemplate, siteTemplateEditorHref } from "@/components/site-templates/registry";
import LiveThumbnail from "@/components/template-detail/LiveThumbnail";
import { CATALOGUE } from "@/components/landing-next/content";
import { Headline, Label, trackPointer } from "@/components/landing-next/kit";
import { ease, focusRing, font, grain, pad, shadow, shell, type } from "@/components/landing-next/ui";

type Template = (typeof SHOWN_TEMPLATES)[number];

// Only the styles some template has (a filter with nothing in it is left out).
const STYLES = GALLERY_STYLES.filter((option) => option.id === "all" || SHOWN_TEMPLATES.some((t) => t.style === option.id));
// A style's name on a card ("Image-led"; "Case study" for one of the case studies).
const styleName = (style: GalleryStyle) => (style === "case" ? "Case study" : GALLERY_STYLES.find((option) => option.id === style)?.label ?? style);

// One template in a browser window: its live page, which scrolls slowly
// while pointed at (or focused), an iris light following the pointer, and
// Preview and Use template rising over its foot. Under it its number, name,
// style (or In progress) and who it suits. The window and the name open the
// demo in a new tab; Use template opens the editor.
function Card({ template, index }: { template: Template; index: number }) {
  const site = getSiteTemplate(template.id);
  // Minimal, an earlier template, has its own editor at the same address shape.
  const editorHref = site ? siteTemplateEditorHref(template.id) : `/templates/editor/${template.id}`;
  const inProgress = site?.inProgress;
  const [focused, setFocused] = useState(false);
  const shown = focused ? "hover" : "rest";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease } }}
      transition={{ duration: 0.8, ease, delay: Math.min(index, 8) * 0.07 }}
      className="flex list-none flex-col gap-4"
    >
      <motion.div
        initial="rest"
        animate={shown}
        whileHover="hover"
        onPointerMove={trackPointer}
        onFocus={() => setFocused(true)}
        onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
        variants={{ rest: { y: 0 }, hover: { y: -6 } }}
        transition={{ duration: 0.5, ease }}
        className={`group/card relative overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] ${shadow.card}`}
      >
        <span className="flex h-8 items-center gap-1.5 border-0 border-b border-solid border-black/[0.06] px-3">
          <span className="size-2 rounded-full bg-black/15" />
          <span className="size-2 rounded-full bg-black/15" />
          <span className="size-2 rounded-full bg-black/15" />
          <span className={`mx-auto truncate rounded-md bg-black/[0.04] px-3 py-0.5 ${font.mono} text-[0.625rem] text-black/45`}>portory.net/{template.id}</span>
        </span>
        <Link
          href={template.href}
          target="_blank"
          rel="noopener"
          aria-label={`Preview the ${template.name} template (opens in a new tab)`}
          className={`${focusRing} relative block aspect-[16/10] overflow-hidden focus-visible:ring-inset`}
        >
          {/* Taller than the window, so pointing at it scrolls through it. */}
          <motion.span variants={{ rest: { y: "0%" }, hover: { y: "-22%" } }} transition={{ duration: 2.6, ease }} className="absolute inset-x-0 top-0 block h-[128%] w-full">
            {template.live ? (
              <LiveThumbnail id={template.id} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- a placeholder photo for a template without a demo
              <img src={template.image} alt="" loading={index < 6 ? "eager" : "lazy"} decoding="async" className="block h-full w-full object-cover" />
            )}
          </motion.span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [background:radial-gradient(22rem_circle_at_var(--x,50%)_var(--y,50%),rgb(157_140_255/0.22),transparent_60%)] group-hover/card:opacity-100" />
        </Link>

        {/* Preview and Use template, over the window's foot on hover or focus. */}
        <motion.div
          variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease }}
          className={`absolute inset-x-3 bottom-3 flex justify-end gap-2 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:!opacity-100 [@media(hover:none)]:!transform-none ${focused ? "" : "pointer-events-none group-hover/card:pointer-events-auto"}`}
        >
          <Link
            href={template.href}
            target="_blank"
            rel="noopener"
            tabIndex={-1}
            className="inline-flex h-10 items-center gap-1.5 rounded-[4px] bg-white/85 px-3.5 text-[0.8125rem] font-medium text-[var(--ink)] no-underline shadow-[0_4px_14px_rgb(0_0_0/0.18)] backdrop-blur-md transition-colors hover:bg-white"
          >
            <Eye aria-hidden="true" className="size-4" />
            {CATALOGUE.preview}
          </Link>
          <Link
            href={editorHref}
            aria-label={`Use the ${template.name} template`}
            className={`${focusRing} group/use inline-flex h-10 items-center gap-1.5 rounded-[4px] bg-[var(--ink)] px-3.5 text-[0.8125rem] font-medium text-[var(--bone)] no-underline shadow-[0_6px_20px_-4px_rgb(90_69_224/0.6)] transition-colors hover:bg-[var(--iris-deep)]`}
          >
            {CATALOGUE.use}
            <MoveRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/use:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 gap-y-1 px-0.5">
        <span className={`${font.mono} text-[0.75rem] text-[var(--iris-deep)]`}>{pad(index + 1)}</span>
        <Link href={template.href} target="_blank" rel="noopener" tabIndex={-1} className={`truncate ${type.small} text-[var(--ink)] no-underline decoration-[var(--iris-deep)] decoration-2 underline-offset-4 hover:underline`}>
          {template.name}
        </Link>
        {inProgress ? (
          <span title={inProgress.note} className={`${font.mono} rounded-full bg-[var(--peach)]/30 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.14em] text-[#9a4a1f]`}>
            {CATALOGUE.progress}
          </span>
        ) : (
          <span className={`${font.mono} text-[0.6875rem] uppercase tracking-[0.16em] text-[var(--ink)]/45`}>{styleName(template.style)}</span>
        )}
        <span />
        <p className={`col-span-2 m-0 truncate ${type.body} text-[var(--ink)]/60`}>{template.bestFor}</p>
      </div>
    </motion.li>
  );
}

// The new world's templates page: a night header with the headline, the
// style filters (a soft pill sliding to the one pointed at, or the one
// chosen) and the count rolling as it changes; then a bone sheet rising over
// it with every template as a live window, three across on wide screens.
// The same templates, filters and actions as the Portory templates page.
export default function Catalogue() {
  const [style, setStyle] = useState<GalleryStyle | "all">("all");
  const [hovered, setHovered] = useState<GalleryStyle | "all" | null>(null);
  const shown = style === "all" ? SHOWN_TEMPLATES : SHOWN_TEMPLATES.filter((t) => t.style === style);
  const lit = hovered ?? style;

  return (
    <>
      <section aria-label={CATALOGUE.label} className="relative isolate overflow-hidden bg-[var(--ink)] pb-[clamp(7rem,12vw,12rem)] pt-[clamp(7.5rem,13vw,11rem)] text-[var(--bone)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute right-[-15%] top-[-30%] size-[min(70rem,130vw)] rounded-full bg-[radial-gradient(circle,rgb(157_140_255/0.38),transparent_60%)]" />
          <span className="absolute bottom-[-50%] left-[-10%] size-[min(56rem,110vw)] rounded-full bg-[radial-gradient(circle,rgb(255_179_138/0.2),transparent_62%)]" />
          <span className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:clamp(3rem,6vw,6rem)_clamp(3rem,6vw,6rem)] [mask-image:radial-gradient(ellipse_at_70%_20%,#000_10%,transparent_65%)]" />
          <span className={`absolute inset-0 mix-blend-overlay ${grain}`} />
        </div>

        <div className={`${shell} flex flex-col gap-8`}>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease }}>
            <Link href={CATALOGUE.back.href} className={`${focusRing} group/back inline-flex items-center gap-2 rounded-[4px] text-[0.875rem] text-[var(--bone)]/70 no-underline transition-colors hover:text-[var(--bone)]`}>
              <ArrowLeft aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/back:-translate-x-1" />
              {CATALOGUE.back.label}
            </Link>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
            <div className="flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 }}>
                <Label tone="dark">{CATALOGUE.label}</Label>
              </motion.div>
              <Headline as="h1" now tone="dark" delay={0.15} text={CATALOGUE.title} className={`max-w-[13ch] ${type.title}`} />
            </div>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.4 }} className={`m-0 ${type.lead} text-[var(--bone)]/70`}>
              {CATALOGUE.text}
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.55 }} className="flex flex-col gap-4 border-0 border-t border-solid border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div role="group" aria-label={CATALOGUE.filter} onMouseLeave={() => setHovered(null)} className="flex flex-wrap gap-1">
              {STYLES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={option.id === style}
                  onClick={() => setStyle(option.id)}
                  onMouseEnter={() => setHovered(option.id)}
                  className={`${focusRing} relative cursor-pointer rounded-lg border-0 bg-transparent px-4 py-2 text-[0.9375rem] transition-colors duration-300 ${lit === option.id ? "text-[var(--bone)]" : "text-[var(--bone)]/55"}`}
                >
                  {lit === option.id && <motion.span layoutId="catalogue-filter" transition={{ type: "spring", stiffness: 400, damping: 34 }} className="absolute inset-0 rounded-lg bg-white/[0.09] ring-1 ring-white/15" />}
                  <span className="relative">{option.label}</span>
                </button>
              ))}
            </div>
            <p aria-live="polite" className={`m-0 flex items-baseline gap-2 ${font.mono} text-[0.75rem] uppercase tracking-[0.18em] text-[var(--mist)]`}>
              <span className="relative inline-grid overflow-hidden">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span key={shown.length} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease }} className={`${font.serif} text-[1.75rem] normal-case tracking-normal text-[var(--peach)]`}>
                    {shown.length}
                  </motion.span>
                </AnimatePresence>
              </span>
              {shown.length === 1 ? CATALOGUE.results[0] : CATALOGUE.results[1]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* The bone sheet, rising over the night with rounded shoulders. */}
      <section className="relative z-10 -mt-[clamp(3rem,6vw,6rem)] rounded-t-[clamp(2rem,4vw,4.5rem)] bg-[var(--bone)] pb-[clamp(5rem,9vw,9rem)] pt-[clamp(3rem,6vw,6rem)] shadow-[0_-30px_80px_-20px_rgb(0_0_0/0.5)]">
        <motion.ul layout className={`${shell} m-0 grid grid-cols-1 gap-x-[clamp(1.25rem,2.4vw,2.5rem)] gap-y-[clamp(2.5rem,4vw,4rem)] p-0 sm:grid-cols-2 lg:grid-cols-3`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((template, i) => (
              <Card key={template.id} template={template} index={i} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>
    </>
  );
}
