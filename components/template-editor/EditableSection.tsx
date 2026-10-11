"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface SectionAction {
  label: string;
  Icon: LucideIcon;
  onClick: () => void;
}

// A template section in edit mode, as in the reference: hovering it draws a
// blue outline and shows its actions in a small floating menu on the right.
export default function EditableSection({ children, actions }: { children: ReactNode; actions: SectionAction[] }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-[#3b82f6]"
          >
            {actions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="pointer-events-auto absolute right-3 top-3 flex flex-col gap-1 rounded-md bg-white p-1 font-sans shadow-[0_2px_12px_rgb(0_0_0/0.15)] ring-1 ring-black/5"
              >
                {actions.map(({ label, Icon, onClick }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    className="flex items-center gap-2 rounded px-2.5 py-1.5 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-800 ring-1 ring-black/5 transition-colors hover:bg-neutral-100"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
