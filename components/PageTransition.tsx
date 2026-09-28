"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const direction = pathname === "/login" ? 1 : -1;

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        initial="enter"
        animate="visible"
        exit="exit"
        variants={{
          enter: (travel: number) => ({ opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 0.985, y: reducedMotion ? 0 : travel * 8, filter: reducedMotion ? "none" : "blur(1.5px)" }),
          visible: { opacity: 1, scale: 1, y: 0, filter: "none" },
          exit: (travel: number) => ({ opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 0.985, y: reducedMotion ? 0 : -travel * 6, filter: reducedMotion ? "none" : "blur(1.5px)" }),
        }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
