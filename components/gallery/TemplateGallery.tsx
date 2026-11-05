"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BackToTop from "@/components/BackToTop";
import GalleryCard from "@/components/gallery/GalleryCard";
import { GALLERY_CATEGORIES, SHOWN_TEMPLATES, type GalleryCategory } from "@/components/gallery/gallery-templates";
import Header from "@/components/template-landing/Header";
import { fonts, frame, themes } from "@/components/template-landing/ui";
import { ease, focusRing } from "@/components/landing/landing-ui";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

// Every Portory template on one page, under the landing page's header (without
// its section links), in the landing's frame and type: the title with a short
// line beside it, the filters, and a grid of template previews. Cards open the builder in the
// same tab; a back-to-top button appears once you've scrolled.
export default function TemplateGallery() {
  const [style, setStyle] = useState<GalleryCategory | "all">("all");
  const [hovered, setHovered] = useState<GalleryCategory | "all" | null>(null);

  const shown = style === "all" ? SHOWN_TEMPLATES : SHOWN_TEMPLATES.filter((t) => t.category === style);
  // The kinds of website, only those some template has (a filter with
  // nothing in it is left out).
  const styles: { id: GalleryCategory | "all"; label: string }[] = [{ id: "all", label: "All templates" }, ...GALLERY_CATEGORIES.filter((option) => SHOWN_TEMPLATES.some((t) => t.category === option.id))];

  return (
    <div data-site-scale className="relative min-h-screen bg-white text-foreground [--background:#ffffff]">
      {/* The home page's header and its scroll behaviour (the user asked): it goes away
          as the page scrolls down and comes back, fixed, on the way up; without the home page's
          section links (the user asked), only the logo and Log in. In the home page's type and colours, on this
          page's ground. */}
      <div className={`${fonts} ${themes.light} [--bg:var(--background)]`}>
        <Header sections={false} />
      </div>

      {/* In the home page's frame, type and sizes (the user asked): the title as its
          section titles, the line small beside it. */}
      <main className={`${frame} ${fonts} ${themes.light} [--bg:var(--background)] pb-24 pt-[clamp(7rem,calc(4.456rem_+_9.467vw),9rem)]`}>
        <div className="flex flex-col gap-[clamp(1.25rem,2vw,1.75rem)] lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <motion.h1 {...rise(0.05)} className="m-0 text-[length:clamp(2.25rem,calc(1.6rem_+_2.2vw),3.5rem)] font-medium leading-[0.96] tracking-[-0.055em] text-[var(--fg)]">
            Templates
          </motion.h1>
          <motion.p {...rise(0.15)} className="m-0 max-w-[21rem] pb-[0.35rem] text-[0.875rem] leading-[1.5] tracking-[-0.005em] text-[var(--dim)]">
            Websites for every kind of work — portfolios, photography, events and more. Pick one, make it yours, publish.
          </motion.p>
        </div>

        {/* The filters (the results count was removed at the user's request). */}
        <motion.div {...rise(0.25)} className="mt-[clamp(3rem,6vw,5rem)] flex">
          {/* Plain filters, moving like the landing page's template tabs: a
              dark pill marks the chosen one and slides to the one hovered,
              then back when the pointer leaves */}
          <div role="group" aria-label="Filter by kind of website" onMouseLeave={() => setHovered(null)} className="flex flex-wrap gap-1">
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

        <motion.ul layout style={{ rowGap: "clamp(1.75rem, calc(1.432rem + 1.183vw), 2.25rem)" }} className="m-0 mt-[clamp(1.5rem,calc(0.864rem_+_2.367vw),2.25rem)] grid grid-cols-1 gap-x-[clamp(1rem,1.6vw,1.5rem)] p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
