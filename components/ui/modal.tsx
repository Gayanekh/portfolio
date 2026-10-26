"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";

const smooth = [0.22, 1, 0.36, 1] as const;

// The app's dialog: a dark, softly blurred layer over the whole screen and,
// centred on it, a white square-cornered card with a soft shadow and an X at
// its top right. A click outside the card, the X or Esc closes it. Drawn on
// the page body, so nothing around its opener clips it; a card taller than
// the screen scrolls inside. Used by the editor's "Exit without saving?" and
// the account's Profile. With `dismissible={false}` it has no X and stays
// open on a click outside or Esc: one of its own buttons must be chosen.
export default function Modal({
  open,
  onClose,
  labelledBy,
  describedBy,
  alert = false,
  dismissible = true,
  className = "max-w-[440px]",
  children,
}: {
  open: boolean;
  onClose: () => void;
  // The ids of the card's title and text, for assistive tech.
  labelledBy: string;
  describedBy?: string;
  // A question that needs an answer ("alertdialog"), not a panel.
  alert?: boolean;
  // false: only the card's own buttons close it (no X, outside click or Esc).
  dismissible?: boolean;
  // The card's width (and anything else it needs).
  className?: string;
  children: ReactNode;
}) {
  // Esc closes it; the page behind does not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => dismissible && event.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, dismissible]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: smooth }}
          onClick={dismissible ? onClose : undefined}
          className="fixed inset-0 z-[1200] grid place-items-center bg-neutral-950/45 p-4 font-[family-name:var(--font-ui),ui-sans-serif,system-ui,sans-serif] backdrop-blur-[3px]"
          data-lenis-prevent
        >
          <motion.div
            role={alert ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: smooth }}
            onClick={(event) => event.stopPropagation()}
            className={`relative flex max-h-[calc(100dvh-2rem)] w-full flex-col bg-white text-neutral-950 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)] ${className}`}
          >
            {dismissible && (
            <Tooltip label="Close" side="left">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 grid size-9 cursor-pointer place-items-center rounded bg-white text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
              >
                <X aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            </Tooltip>
            )}
            {/* The content scrolls inside the card; the X stays in its corner. */}
            <div className="min-h-0 overflow-y-auto overscroll-contain px-8 pb-7 pt-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
