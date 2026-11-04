"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { ease, focusRing } from "@/components/landing/landing-ui";

// The floating control over every template demo: Use This Template (bottom
// right), which opens the template in its editor (`editorHref`). White, so it
// sits quietly over any template. Demos open in their own tab from the
// templates page, so there is no way back here: closing the tab returns to
// the templates.
export default function DemoControls({ editorHref }: { editorHref: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay: 0.45 }}
      className="fixed bottom-5 right-5 z-50"
    >
      <Link
        href={editorHref}
        className={`${focusRing} group flex h-12 items-center gap-2 rounded bg-white px-6 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-900 no-underline shadow-[0_2px_12px_rgb(0_0_0/0.12)] ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_6px_20px_rgb(0_0_0/0.18)]`}
      >
        Use This Template
        <MoveRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
