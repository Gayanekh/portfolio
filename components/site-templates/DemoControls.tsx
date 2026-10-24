"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";

// The two floating controls over every template demo: back to the templates
// (top left) and Use This Template (bottom right), which opens the template
// in its editor (`editorHref`).
export default function DemoControls({ editorHref }: { editorHref: string }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.3 }}
        className="fixed left-4 top-4 z-50"
      >
        <Link
          href="/templates"
          className={`${focusRing} group flex h-10 items-center gap-1.5 rounded bg-white/85 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-900 no-underline shadow-[0_2px_12px_rgb(0_0_0/0.12)] ring-1 ring-black/5 backdrop-blur-md`}
        >
          <MoveLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
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
          href={editorHref}
          className={`${focusRing} ${primaryButton} group flex h-12 items-center gap-2 rounded px-6 text-xs font-semibold uppercase tracking-[0.08em] no-underline`}
        >
          Use This Template
          <MoveRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </>
  );
}
