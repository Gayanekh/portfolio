"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

const smooth = [0.22, 1, 0.36, 1] as const;

export interface SectionNavItem {
  id: string;
  label: string;
  // A short line about the section, shown under it when it is chosen.
  detail?: string;
}

// The page's sections as a numbered outline in the editor's sidebar: the
// whole page first (00), then each section in page order. A bar marks the
// chosen one (it slides between rows), and its line about it opens under
// it. Arrow keys, Home and End move through the rows.
export default function SectionNavigator({
  value,
  home,
  sections,
  onChange,
  labelledBy,
}: {
  value: string;
  home: SectionNavItem;
  sections: SectionNavItem[];
  onChange: (id: string) => void;
  labelledBy?: string;
}) {
  const bar = useId();
  const items = [home, ...sections];
  const rows = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (event: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const target = forward ? Math.min(last, index + 1) : back ? Math.max(0, index - 1) : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (target === null) return;
    event.preventDefault();
    rows.current[target]?.focus();
    onChange(items[target].id);
  };

  return (
    <nav aria-labelledby={labelledBy}>
      <ol className="m-0 flex list-none flex-col p-0">
        {items.map((entry, index) => {
          const active = entry.id === value;
          return (
            <li key={entry.id} className={index === 1 ? "mt-2 border-t border-foreground/[0.07] pt-2" : undefined}>
              <button
                ref={(element) => {
                  rows.current[index] = element;
                }}
                type="button"
                aria-current={active ? "true" : undefined}
                tabIndex={active ? 0 : -1}
                onClick={() => onChange(entry.id)}
                onKeyDown={(event) => onKey(event, index)}
                className={`group relative grid w-full cursor-pointer grid-cols-[2.25rem_1fr] items-baseline rounded py-2.5 pl-4 pr-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-foreground/30 ${
                  active ? "bg-foreground/[0.04]" : "hover:bg-foreground/[0.03]"
                }`}
              >
                {active && <motion.span layoutId={bar} transition={{ type: "spring", stiffness: 420, damping: 36 }} className="absolute inset-y-1.5 left-0 w-[3px] rounded-sm bg-foreground" />}
                <span className={`font-mono text-[11px] tabular-nums transition-colors ${active ? "text-foreground" : "text-foreground/35 group-hover:text-foreground/60"}`}>
                  {String(index).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className={`truncate text-[15px] tracking-[-0.01em] transition-colors ${active ? "font-semibold text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}>
                    {entry.label}
                  </span>
                  <AnimatePresence initial={false}>
                    {active && entry.detail && (
                      <motion.span
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: smooth }}
                        className="block overflow-hidden"
                      >
                        <span className="block pt-0.5 text-xs leading-snug text-foreground/55">{entry.detail}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
