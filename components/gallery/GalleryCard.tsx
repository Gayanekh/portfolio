"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, MoveRight } from "lucide-react";
import { GALLERY_STYLES, type GalleryTemplate } from "@/components/gallery/gallery-templates";
import LiveThumbnail from "@/components/template-detail/LiveThumbnail";
import { getSiteTemplate, siteTemplateEditorHref } from "@/components/site-templates/registry";
import { ease, focusRing } from "@/components/landing/landing-ui";

const MotionLink = motion.create(Link);

// A style's name on a card ("Image-led"; "Case study" for one of the case studies).
const styleName = (style: GalleryTemplate["style"]) => (style === "case" ? "Case study" : GALLERY_STYLES.find((option) => option.id === style)?.label ?? style);

// One template in the gallery: a framed preview that lifts on hover while the
// page inside slowly scrolls, with Preview and Use template sliding in over
// its foot; under it, always shown, its name, its style, who it suits and,
// for a template still being built, an "In progress" tag. The preview and
// the name open the template's demo in a new tab; Use template opens it in
// the editor.
export default function GalleryCard({ template, index }: { template: GalleryTemplate & { href: string }; index: number }) {
  const site = getSiteTemplate(template.id);
  // Minimal, an earlier template, has its own editor at the same address shape.
  const editorHref = site ? siteTemplateEditorHref(template.id) : `/templates/editor/${template.id}`;
  const inProgress = site?.inProgress;
  // Keyboard focus anywhere in the preview shows its actions, as hover does.
  const [focused, setFocused] = useState(false);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease } }}
      transition={{ duration: 0.7, ease, delay: Math.min(index, 8) * 0.06 }}
      className="flex list-none flex-col gap-3"
    >
      {/* The preview and its two actions share one hover (and keyboard focus). */}
      <motion.div
        initial="rest"
        animate={focused ? "hover" : "rest"}
        whileHover="hover"
        onFocus={() => setFocused(true)}
        onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
        className="group relative"
      >
        <MotionLink
          href={template.href}
          target="_blank"
          rel="noopener"
          aria-label={`Preview the ${template.name} template (opens in a new tab)`}
          variants={{ rest: { y: 0 }, hover: { y: -6 } }}
          transition={{ duration: 0.45, ease }}
          className={`${focusRing} block rounded-2xl no-underline`}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-foreground/5 ring-1 ring-foreground/10 transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-20px_rgb(0_0_0/0.35)]">
            {/* Taller than the frame, so hovering can scroll through it. */}
            {template.live ? (
              <motion.div variants={{ rest: { y: "0%" }, hover: { y: "-22%" } }} transition={{ duration: 2.4, ease }} className="absolute inset-x-0 top-0 h-[128%] w-full">
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
          </div>
        </MotionLink>

        {/* Preview and Use template, over the preview's foot on hover or focus */}
        <motion.div
          variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: -6 } }}
          transition={{ duration: 0.35, ease }}
          className={`absolute inset-x-3 bottom-3 flex justify-end gap-2 ${focused ? "" : "pointer-events-none group-hover:pointer-events-auto"}`}
        >
          <Link
            href={template.href}
            target="_blank"
            rel="noopener"
            tabIndex={-1}
            className="inline-flex h-9 items-center gap-1.5 rounded bg-white/90 px-3 text-[0.8125rem] font-medium text-foreground no-underline shadow-[0_2px_8px_rgb(0_0_0/0.15)] backdrop-blur-md transition-colors hover:bg-white"
          >
            <Eye aria-hidden="true" className="size-4" />
            Preview
          </Link>
          <Link
            href={editorHref}
            aria-label={`Use the ${template.name} template`}
            className={`${focusRing} group/use inline-flex h-9 items-center gap-1.5 rounded bg-foreground px-3 text-[0.8125rem] font-medium text-white no-underline shadow-[0_2px_8px_rgb(0_0_0/0.2)] transition-colors hover:bg-foreground/85`}
          >
            Use template
            <MoveRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/use:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Under the preview, after the reference: the name and who it suits on
          the left, a small tag on the right (its style, or In progress) */}
      <div className="flex items-center justify-between gap-4 px-0.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link href={template.href} target="_blank" rel="noopener" tabIndex={-1} className="truncate text-[0.9375rem] font-semibold tracking-[-0.01em] text-foreground no-underline hover:underline hover:underline-offset-4">
            {template.name}
          </Link>
          <p className="m-0 truncate text-[0.8125rem] leading-snug text-foreground/55">{template.bestFor}</p>
        </div>
        {inProgress ? (
          <span title={inProgress.note} className="shrink-0 rounded-lg bg-amber-100 px-3 py-1.5 text-[0.8125rem] font-semibold text-amber-800">
            In progress
          </span>
        ) : (
          <span className="shrink-0 rounded-lg bg-foreground/[0.06] px-3 py-1.5 text-[0.8125rem] font-semibold text-foreground/75">{styleName(template.style)}</span>
        )}
      </div>
    </motion.li>
  );
}
