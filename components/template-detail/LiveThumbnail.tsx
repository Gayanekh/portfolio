"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { templateFrameHref } from "@/components/template-detail/template-registry";

// A real template as a card thumbnail: its preview page laid out at desktop
// width and scaled down to the card. Decorative and not interactive.
export default function LiveThumbnail({ id }: { id: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(() => scale.set(box.clientWidth / 1280));
    observer.observe(box);
    return () => observer.disconnect();
  }, [scale]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      <motion.iframe
        src={templateFrameHref(id)}
        title=""
        aria-hidden="true"
        tabIndex={-1}
        loading="lazy"
        style={{ scale }}
        className="pointer-events-none absolute left-0 top-0 h-[1024px] w-[1280px] origin-top-left border-0 bg-white"
      />
    </div>
  );
}
