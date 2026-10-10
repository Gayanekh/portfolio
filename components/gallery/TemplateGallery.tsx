"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowLeft, ArrowUp } from "lucide-react";
import AuthControls from "@/components/auth/AuthControls";
import BrandMark from "@/components/auth/BrandMark";
import GalleryCard from "@/components/gallery/GalleryCard";
import { GALLERY_STYLES, GALLERY_TEMPLATES, type GalleryStyle } from "@/components/gallery/gallery-templates";
import { ease, focusRing } from "@/components/landing/landing-ui";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

// Every Portory template on one page, after the reference gallery: a large
// heading with a short description beside it, a results count with style
// filters, and a grid of template previews. Cards open the builder in the
// same tab; a back-to-top button appears once you've scrolled.
export default function TemplateGallery() {
  const [style, setStyle] = useState<GalleryStyle | "all">("all");
  const [showTop, setShowTop] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShowTop(y > 600));

  const shown = style === "all" ? GALLERY_TEMPLATES : GALLERY_TEMPLATES.filter((t) => t.style === style);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-content-width items-center justify-between gap-4 py-5">
        <Link href="/" aria-label="Portory home" className={`${focusRing} flex items-center rounded-lg [&_img]:h-6`}>
          <BrandMark />
        </Link>
        <div className="flex items-center gap-2 [&_a]:no-underline">
          <AuthControls />
        </div>
      </header>

      <main className="mx-auto w-content-width pb-24 pt-10 md:pt-16">
        <motion.div {...rise(0)}>
          <Link href="/" className={`${focusRing} group mb-8 inline-flex items-center gap-1.5 rounded-full text-sm text-foreground/60 no-underline transition-colors hover:text-foreground`}>
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.15fr_1fr] md:gap-16">
          <motion.h1
            {...rise(0.05)}
            className="m-0 text-balance text-[length:clamp(2.5rem,9vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.035em] md:text-[length:clamp(3rem,5vw,5rem)]"
          >
            Find the template that fits your work.
          </motion.h1>
          <motion.p {...rise(0.15)} className="m-0 max-w-[34rem] text-base leading-relaxed text-foreground/70 md:pt-3 md:text-lg">
            Whether you teach, photograph, consult or build, there is a Portory template made for the way you work.
            Every one is responsive, easy to edit with a live preview, and ready to publish on your own portory.net link.
          </motion.p>
        </div>

        <motion.div {...rise(0.25)} className="mt-14 flex flex-col gap-4 md:mt-20 md:flex-row md:items-center md:justify-between">
          <p aria-live="polite" className="m-0 text-sm font-medium">
            <motion.span key={shown.length} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className="inline-block">
              {shown.length}
            </motion.span>{" "}
            {shown.length === 1 ? "Result" : "Results"}
          </p>
          <div role="group" aria-label="Filter by style" className="flex flex-wrap gap-1 rounded-full bg-foreground/5 p-1">
            {GALLERY_STYLES.map((option) => {
              const active = option.id === style;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStyle(option.id)}
                  className={`${focusRing} relative cursor-pointer rounded-full px-3.5 py-1.5 text-sm transition-colors ${active ? "text-background" : "text-foreground/65 hover:text-foreground"}`}
                >
                  {active && <motion.span layoutId="gallery-filter" transition={{ duration: 0.4, ease }} className="absolute inset-0 rounded-full bg-foreground" />}
                  <span className="relative">{option.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.ul layout className="m-0 mt-8 grid grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((template, i) => (
              <GalleryCard key={template.id} template={template} index={i} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </main>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease }}
            className={`${focusRing} fixed bottom-6 right-6 z-50 grid size-11 cursor-pointer place-items-center rounded-full bg-foreground text-background shadow-[0_8px_24px_-8px_rgb(0_0_0/0.4)]`}
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
