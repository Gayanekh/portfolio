"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotionConfig, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { ease, focusRing } from "@/components/landing/landing-ui";

// A dark square button in the bottom-right corner that appears once the page
// has scrolled past `after` pixels and takes it back to the top (smoothly,
// unless motion is reduced). Used on the gallery and the landing pages.
export default function BackToTop({ after = 600 }: { after?: number }) {
  const reduced = useReducedMotionConfig();
  const [shown, setShown] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShown(y > after));

  return (
    <AnimatePresence>
      {shown && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease }}
          className={`${focusRing} fixed bottom-6 right-6 z-50 grid size-11 cursor-pointer place-items-center rounded bg-foreground text-background shadow-[0_8px_24px_-8px_rgb(0_0_0/0.4)]`}
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
