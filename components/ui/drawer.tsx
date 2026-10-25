"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const smooth = [0.22, 1, 0.36, 1] as const;

// The app's side drawer: it slides in from the right over a dark, softly
// blurred layer, as a white rounded panel floating inside the screen's edges.
// Its title and line sit at the top; then the content, which scrolls; then
// the content's own footer (drawerFooter). A click outside or Esc closes it.
// Drawn on the page body, so nothing around its opener clips it.
export default function Drawer({
  open,
  onClose,
  title,
  description,
  titleId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  titleId: string;
  // The scrolling content (wrapped in drawerBody) and its footer (drawerFooter).
  children: ReactNode;
}) {
  // Esc closes it; the page behind does not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: smooth }}
          onClick={onClose}
          className="fixed inset-0 z-[1200] bg-neutral-950/35 font-[family-name:var(--font-ui),ui-sans-serif,system-ui,sans-serif] backdrop-blur-[3px]"
          data-lenis-prevent
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: "calc(100% + 1rem)" }}
            animate={{ x: 0 }}
            exit={{ x: "calc(100% + 1rem)" }}
            transition={{ duration: 0.45, ease: smooth }}
            onClick={(event) => event.stopPropagation()}
            className="absolute bottom-2 right-2 top-2 flex w-[min(28rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl bg-white text-neutral-950 shadow-[0_24px_70px_-20px_rgb(0_0_0/0.45)]"
          >
            <header className="shrink-0 px-6 pb-4 pt-6">
              <h2 id={titleId} className="m-0 text-lg font-semibold tracking-[-0.01em]">
                {title}
              </h2>
              {description && <p className="m-0 mt-1.5 text-sm leading-relaxed text-neutral-500">{description}</p>}
            </header>
            {children}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// The drawer's scrolling middle, and its footer kept at the bottom.
export const drawerBody = "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6";
export const drawerFooter = "grid shrink-0 gap-2 border-t border-neutral-100 bg-white px-6 py-4";
