"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { ease, focusRing } from "@/components/landing/landing-ui";

// How long after the last scroll the button comes back.
const IDLE_MS = 250;

// The floating control over every template demo: Use This Template (bottom
// right), which opens the template in its editor (`editorHref`). White, so it
// sits quietly over any template. It moves out of the way while the page is
// scrolling (the user asked) and comes back once the scrolling stops. Demos open in their own tab from the
// templates page, so there is no way back here: closing the tab returns to
// the templates.
export default function DemoControls({ editorHref }: { editorHref: string }) {
  const [scrolling, setScrolling] = useState(false);
  // Its first coming in is a little late, after the template; later ones are not.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setScrolling(false), IDLE_MS);
    };
    // Scroll events do not bubble, so they are caught on the way down: this also covers a template that scrolls inside itself.
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: scrolling ? 0 : 1, y: scrolling ? 12 : 0 }}
      transition={{ duration: scrolling ? 0.25 : 0.5, ease, delay: shown ? 0 : 0.45 }}
      onAnimationComplete={() => setShown(true)}
      className={`fixed bottom-5 right-5 z-50 ${scrolling ? "pointer-events-none" : ""}`}
    >
      <Link
        href={editorHref}
        tabIndex={scrolling ? -1 : undefined}
        className={`${focusRing} group flex h-12 items-center gap-2 rounded bg-white px-6 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-900 no-underline shadow-[0_2px_12px_rgb(0_0_0/0.12)] ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_6px_20px_rgb(0_0_0/0.18)]`}
      >
        Use This Template
        <MoveRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
