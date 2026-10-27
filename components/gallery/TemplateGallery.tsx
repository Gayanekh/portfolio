"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BackToHome from "@/components/BackToHome";
import BackToTop from "@/components/BackToTop";
import GalleryCard from "@/components/gallery/GalleryCard";
import { GALLERY_STYLES, SHOWN_TEMPLATES, type GalleryStyle } from "@/components/gallery/gallery-templates";
import LandingHeader from "@/components/landing/LandingHeader";
import { accentText, ease, focusRing, fluidText } from "@/components/landing/landing-ui";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

// Every Portory template on one page, under the landing page's header (without
// its section links), after the reference gallery: a large
// heading with a short description beside it, a results count with style
// filters, and a grid of template previews. Cards open the builder in the
// same tab; a back-to-top button appears once you've scrolled.
export default function TemplateGallery() {
  const [style, setStyle] = useState<GalleryStyle | "all">("all");
  const [hovered, setHovered] = useState<GalleryStyle | "all" | null>(null);

  const shown = style === "all" ? SHOWN_TEMPLATES : SHOWN_TEMPLATES.filter((t) => t.style === style);
  // Only the styles some template has (a filter with nothing in it is left out).
  const styles = GALLERY_STYLES.filter((option) => option.id === "all" || SHOWN_TEMPLATES.some((t) => t.style === option.id));

  return (
    <div data-site-scale className="relative min-h-screen bg-background text-foreground">
      <LandingHeader links={false} />

      <main className="mx-auto w-content-width pb-24 pt-[clamp(7rem,calc(4.456rem_+_9.467vw),9rem)]">
        <motion.div {...rise(0)}>
          <BackToHome className="mb-8" />
        </motion.div>

        <div className="@container grid grid-cols-1 gap-6 md:grid-cols-[1.15fr_1fr] md:gap-[min(4rem,6.5%)]">
          <motion.h1
            {...rise(0.05)}
            className={`m-0 text-balance ${fluidText.pageTitle} font-medium leading-[1.02] tracking-[-0.035em]`}
          >
           Templates
          </motion.h1>
          <motion.p {...rise(0.15)} className="m-0 max-w-[34rem] text-[length:clamp(1rem,calc(0.841rem_+_0.592vw),1.125rem)] md:text-[length:clamp(0.9375rem,min(calc(0.841rem_+_0.592vw),1.818cqi),1.125rem)] leading-relaxed text-foreground/70 md:pt-3">
Find the perfect Portory template for your style, showcase your work, and make it your own.          </motion.p>
        </div>

        <motion.div {...rise(0.25)} className="mt-[clamp(3.5rem,calc(1.592rem_+_7.101vw),5rem)] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p aria-live="polite" className="m-0 text-sm font-medium">
            <motion.span key={shown.length} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className={`${accentText} inline-block`}>
              {shown.length}
            </motion.span>{" "}
            {shown.length === 1 ? "Result" : "Results"}
          </p>
          {/* Plain filters, moving like the landing page's template tabs: a
              dark pill marks the chosen one and slides to the one hovered,
              then back when the pointer leaves */}
          <div role="group" aria-label="Filter by style" onMouseLeave={() => setHovered(null)} className="flex flex-wrap gap-1">
            {styles.map((option) => {
              const active = option.id === style;
              const lit = (hovered ?? style) === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStyle(option.id)}
                  onMouseEnter={() => setHovered(option.id)}
                  className={`${focusRing} relative cursor-pointer rounded px-3 py-1.5 text-[0.8125rem] font-medium transition-colors duration-200 ${lit ? "text-white" : "text-foreground"}`}
                >
                  {lit && <motion.span layoutId="gallery-filter" transition={{ type: "spring", stiffness: 420, damping: 36 }} aria-hidden="true" className="absolute inset-0 rounded bg-foreground" />}
                  <span className="relative">{option.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.ul layout style={{ rowGap: "clamp(1.75rem, calc(1.432rem + 1.183vw), 2.25rem)" }} className="m-0 mt-[clamp(1.5rem,calc(0.864rem_+_2.367vw),2.25rem)] grid grid-cols-1 gap-x-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((template, i) => (
              <GalleryCard key={template.id} template={template} index={i} />
            ))}
          </AnimatePresence>
        </motion.ul>

      </main>

      <BackToTop />
    </div>
  );
}
