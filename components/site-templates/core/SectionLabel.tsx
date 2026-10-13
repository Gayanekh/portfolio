"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useField } from "./context";
import { scrollParent, viewOf } from "./scroll";

// Where the visitor is in a long section: a slim bar pinned at the top of
// the screen while the section scrolls, on a frosted strip of the page's
// colour (the content passes cleanly under it; over a dark Band it turns
// dark, its text light), with the section's title
// and the part in front, and under them a thin line, as wide as the label,
// filling as they move through it.
//
// The parts are the elements marked `data-label-item` in the section (a
// ProjectSlide, a Chapter). `show`: `count` gives "02 / 04"; `name` gives
// the part's name (its `data-label-name`). The bar takes no room, and
// shows only once the first part has reached it (the section's large title,
// above that part, is then fully gone), until the last has scrolled away. From the desktop layout
// up (on phones the content passes where it would be). Put it near the
// section's start. Its section's field: `title`.

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export default function SectionLabel({ show = "count" }: { show?: "count" | "name" }) {
  const ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const title = useField("title").value;
  const [shown, setShown] = useState(false);
  // Whether a dark band is under the bar, so it turns dark with it.
  const [dark, setDark] = useState(false);
  const [current, setCurrent] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const filled = useMotionValue(0);
  const line = useSpring(filled, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const element = ref.current;
    const section = element?.closest("[data-section]");
    if (!element || !section) return;
    const parent = scrollParent(element);
    const scroller: HTMLElement | Window = parent ?? window;
    const update = () => {
      const view = viewOf(parent);
      const parts = Array.from(section.querySelectorAll<HTMLElement>("[data-label-item]"));
      if (!parts.length) return;
      // Measured at the middle of the view.
      const middle = view.top + view.height / 2;
      const first = parts[0].getBoundingClientRect();
      const last = parts[parts.length - 1].getBoundingClientRect();
      // Once the first part has reached the bar (so the section's title,
      // above it, has passed fully under and out), until the last has gone.
      const edge = view.top + (barRef.current?.offsetHeight ?? 52);
      setShown(first.top <= edge && last.bottom > edge);
      setDark(
        Array.from(section.querySelectorAll<HTMLElement>('[data-band="dark"]')).some((band) => {
          const box = band.getBoundingClientRect();
          return box.top <= edge && box.bottom > view.top;
        }),
      );
      setCurrent(Math.max(0, parts.findLastIndex((part) => part.getBoundingClientRect().top <= middle)));
      setNames((before) => {
        const next = parts.map((part) => part.dataset.labelName ?? "");
        return before.join("|") === next.join("|") ? before : next;
      });
      filled.set(Math.min(1, Math.max(0, (middle - first.top) / (last.bottom - first.top))));
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [filled]);

  return (
    // Pinned, but no height: the content keeps its place.
    <div ref={ref} className="pointer-events-none sticky top-0 z-10 h-0">
      <motion.div
        ref={barRef}
        aria-hidden={!shown}
        initial={false}
        animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : -8 }}
        transition={{ duration: 0.5, ease }}
        className={`hidden py-4 backdrop-blur-md transition-colors duration-500 @xl:block ${dark ? "bg-foreground/85 text-card" : "bg-card/85 text-foreground"}`}
      >
        {/* The label, and under it the line, as wide as the label */}
        <div className="flex w-max min-w-[12rem] flex-col gap-2">
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase leading-none tracking-[0.08em]">
            <span>{title}</span>
            <span aria-hidden="true" className="h-px w-4 bg-current opacity-40" />
            <span className="relative inline-flex overflow-hidden tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={current}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.45, ease }}
                >
                  {show === "name" ? names[current] : pad(current + 1)}
                </motion.span>
              </AnimatePresence>
            </span>
            {show === "count" && <span className="tabular-nums opacity-55">/ {pad(names.length || 1)}</span>}
          </div>
          <div className="relative h-px w-full">
            <div className="absolute inset-0 bg-current opacity-15" />
            <motion.div style={{ scaleX: line }} className="absolute inset-0 origin-left bg-current" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
