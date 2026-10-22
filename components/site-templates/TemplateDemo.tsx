"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";
import TemplateRenderer from "./core/TemplateRenderer";
import { getSiteTemplate, siteTemplateEditorHref } from "./registry";

// A template's demo: the real template, full size with its own content and
// responsive layout, and two floating controls: back to the gallery, and
// Use This Template, which opens the same template in the editor.
export default function TemplateDemo({ id }: { id: string }) {
  const template = getSiteTemplate(id);
  if (!template) return null;

  return (
    <div className="min-h-screen">
      <TemplateRenderer template={template} />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.3 }}
        className="fixed left-4 top-4 z-50"
      >
        <Link
          href="/templates/gallery"
          className={`${focusRing} group flex h-10 items-center gap-1.5 rounded bg-white/85 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-900 no-underline shadow-[0_2px_12px_rgb(0_0_0/0.12)] ring-1 ring-black/5 backdrop-blur-md`}
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Templates
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.45 }}
        className="fixed bottom-5 right-5 z-50"
      >
        <Link
          href={siteTemplateEditorHref(template.id)}
          className={`${focusRing} ${primaryButton} group flex h-12 items-center gap-2 rounded px-6 text-xs font-semibold uppercase tracking-[0.08em] no-underline`}
        >
          Use This Template
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </div>
  );
}
