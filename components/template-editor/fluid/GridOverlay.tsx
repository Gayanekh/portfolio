"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// The section grid from the reference, shown while a block is dragged: 24
// columns of soft rounded cells over 92% of the page's width, rows of 24px
// down the whole section, and a dashed line down the middle.
export default function GridOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setRows(Math.ceil(element.clientHeight / 24)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      <div className="absolute inset-y-0 left-[4%] right-[4%] grid auto-rows-[24px] grid-cols-[repeat(24,minmax(0,1fr))]">
        {Array.from({ length: rows * 24 }, (_, i) => (
          <span key={i} className="m-[2px] rounded-[3px] border border-[#bb4e1c]/15 bg-white/25" />
        ))}
      </div>
      <span className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#bb4e1c]/70" />
    </motion.div>
  );
}
