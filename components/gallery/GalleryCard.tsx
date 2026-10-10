"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { GalleryTemplate } from "@/components/gallery/gallery-templates";
import LiveThumbnail from "@/components/template-detail/LiveThumbnail";
import { templateDetailHref } from "@/components/template-detail/template-registry";
import { ease, focusRing } from "@/components/landing/landing-ui";

const MotionLink = motion.create(Link);

// One template in the gallery, after the reference: a framed preview that
// lifts on hover while the page inside slowly scrolls, with the template's
// name and an arrow sliding in at the bottom. Opens the template's own page
// in this tab. A real template shows itself live instead of a photo.
export default function GalleryCard({ template, index }: { template: GalleryTemplate; index: number }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease } }}
      transition={{ duration: 0.7, ease, delay: Math.min(index, 8) * 0.06 }}
      className="list-none"
    >
      <MotionLink
        href={templateDetailHref(template.id)}
        aria-label={`View the ${template.name} template, for ${template.bestFor.toLowerCase()}`}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        variants={{ rest: { y: 0 }, hover: { y: -6 } }}
        transition={{ duration: 0.45, ease }}
        className={`${focusRing} group block rounded-lg no-underline`}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-foreground/5 ring-1 ring-foreground/10 transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-20px_rgb(0_0_0/0.35)]">
          {/* Taller than the frame, so hovering can scroll through it. */}
          {template.live ? (
            <motion.div
              variants={{ rest: { y: "0%" }, hover: { y: "-22%" } }}
              transition={{ duration: 2.4, ease }}
              className="absolute inset-x-0 top-0 h-[128%] w-full"
            >
              <LiveThumbnail id={template.id} />
            </motion.div>
          ) : (
          <motion.img
            src={template.image}
            alt=""
            loading={index < 6 ? "eager" : "lazy"}
            decoding="async"
            variants={{ rest: { y: "0%" }, hover: { y: "-22%" } }}
            transition={{ duration: 2.4, ease }}
            className="absolute inset-x-0 top-0 block h-[128%] w-full object-cover"
          />
          )}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
            <motion.span
              variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35, ease }}
              className="rounded-full bg-foreground/75 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md"
            >
              {template.name}
            </motion.span>
            <motion.span
              aria-hidden="true"
              variants={{ rest: { opacity: 0, scale: 0.8 }, hover: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.35, ease }}
              className="grid size-9 place-items-center rounded-full bg-white text-foreground shadow-[0_2px_8px_rgb(0_0_0/0.15)]"
            >
              <ArrowUpRight className="size-4" />
            </motion.span>
          </div>
        </div>      
      </MotionLink>
    </motion.li>
  );
}
