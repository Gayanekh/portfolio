"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { GALLERY_STYLES, categoryLabel, type GalleryTemplate } from "@/components/gallery/gallery-templates";
import dynamic from "next/dynamic";
import ViewArea from "@/components/gallery/ViewArea";
import Cover from "@/components/other-landing/Cover";
import { ease, focusRing } from "@/components/landing/landing-ui";

// The live preview (a whole template in a frame) loads only for a card that shows one.
const LiveThumbnail = dynamic(() => import("@/components/template-detail/LiveThumbnail"), { ssr: false });

const MotionLink = motion.create(Link);

// A style's name on a card ("Image-led"; "Case study" for one of the case studies).
const styleName = (style: GalleryTemplate["style"]) => (style === "case" ? "Case study" : (GALLERY_STYLES.find((option) => option.id === style)?.label ?? style));

// One template in the gallery. With a cover, the cover card below; without
// one, a framed preview that lifts on hover while the page inside slowly
// scrolls, a View bubble following the pointer over it (ViewArea; the
// Preview and Use template buttons were removed at the user's request);
// under it its name, its style, who it suits and, for a template still being
// built, an "In progress" tag. The preview and the name open the template's
// demo in a new tab.
export default function GalleryCard({ template, index }: { template: GalleryTemplate & { href: string }; index: number }) {
  const note = template.inProgress;
  // Keyboard focus on the preview lifts it, as hover does.
  const [focused, setFocused] = useState(false);
  if (template.cover || template.screen) return <CoverCard template={template} index={index} inProgress={Boolean(note)} note={note} />;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease } }}
      transition={{ duration: 0.7, ease, delay: Math.min(index, 8) * 0.06 }}
      className="flex list-none flex-col gap-3"
    >
      {/* The preview: hover (or keyboard focus) lifts it and scrolls the page inside. */}
      <motion.div initial="rest" animate={focused ? "hover" : "rest"} whileHover="hover" onFocus={() => setFocused(true)} onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)} className="group relative">
        <ViewArea>
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
        </ViewArea>
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
        {note ? (
          <span title={note} className="shrink-0 rounded-lg bg-amber-100 px-3 py-1.5 text-[0.8125rem] font-semibold text-amber-800">
            In progress
          </span>
        ) : (
          <span className="shrink-0 rounded-lg bg-foreground/[0.06] px-3 py-1.5 text-[0.8125rem] font-semibold text-foreground/75">{styleName(template.style)}</span>
        )}
      </div>
    </motion.li>
  );
}

// A template with a cover (the landing page's: its picture, or one built from its
// screenshot as the landing does): the cover itself, with the View bubble following
// the pointer over it (ViewArea), and under it the name, its category and who
// it suits. The cover and the name open the demo in a new tab.
function CoverCard({ template, index, inProgress, note }: { template: GalleryTemplate & { href: string }; index: number; inProgress: boolean; note?: string }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease } }}
      transition={{ duration: 0.7, ease, delay: Math.min(index, 8) * 0.06 }}
      className="flex list-none flex-col gap-4"
    >
      <ViewArea>
        <Link href={template.href} target="_blank" rel="noopener" aria-label={`Preview the ${template.name} template (opens in a new tab)`} className={`${focusRing} block rounded-2xl no-underline`}>
          {template.cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local cover image
            <img src={template.cover} alt="" loading={index < 6 ? "eager" : "lazy"} decoding="async" style={template.coverFocus ? { objectPosition: template.coverFocus } : template.coverFrame ? { backgroundColor: template.coverGround } : template.coverGround ? { backgroundColor: template.coverGround, backgroundImage: `url(${template.cover})`, backgroundSize: "6000% 100%", backgroundPosition: "0 0", backgroundRepeat: "no-repeat" } : undefined} className={`block aspect-[16/10] w-full rounded-2xl ring-1 ring-foreground/10 ${template.coverFrame ? "object-contain py-[5%] drop-shadow-[0_10px_18px_rgb(0_0_0/0.16)]" : template.coverGround ? "object-contain" : "bg-foreground/5 object-cover"}`} />
          ) : (
            <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-foreground/5 ring-1 ring-foreground/10">
              <Cover src={template.screen ?? ""} name={template.name} shape="fill" drift />
            </span>
          )}
        </Link>
      </ViewArea>
      <div className="flex flex-col gap-3 px-0.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <Link href={template.href} target="_blank" rel="noopener" tabIndex={-1} className="truncate text-[0.9375rem] font-semibold tracking-[-0.01em] text-foreground no-underline hover:underline hover:underline-offset-4">
              {template.name}
            </Link>
            <p className="m-0 truncate text-[0.8125rem] leading-snug text-foreground/55">{template.bestFor}</p>
          </div>
          {inProgress ? (
            <span title={note} className="shrink-0 rounded-lg bg-amber-100 px-3 py-1.5 text-[0.8125rem] font-semibold text-amber-800">
              In progress
            </span>
          ) : (
            <span className="shrink-0 rounded-lg bg-foreground/[0.06] px-3 py-1.5 text-[0.8125rem] font-semibold text-foreground/75">{categoryLabel(template.category)}</span>
          )}
        </div>
      </div>
    </motion.li>
  );
}
