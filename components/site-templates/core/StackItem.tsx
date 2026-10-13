"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { scrollParent, viewOf } from "./scroll";

// How far a covered section sinks, as a share of the screen's height.
const SINK = 0.14;

// One section of a stacking page: it stays in place once it reaches the top
// (a section taller than the screen first scrolls to its end), and the next
// section rises over it. While it is being covered it sinks a little and
// fades back slightly, so it feels as if it slides down under the next one.
// (No scaling: shrinking a section moves its image edges by fractions of a
// pixel and shows seams. No clipping either, so a pinned story inside a
// section keeps working; the next section covers whatever sinks.)
export default function StackItem({ id, last, children }: { id: string; last: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const covered = useMotionValue(0);
  const sink = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const opacity = useTransform(covered, [0, 1], [1, 0.6]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const parent = scrollParent(element);
    const scroller: HTMLElement | Window = parent ?? window;

    const update = () => {
      const view = viewOf(parent);
      // Stick at the top, or for a tall section once its end is in view.
      element.style.top = `${Math.min(0, view.height - element.offsetHeight)}px`;
      // The next section's marker: where that section sits before it sticks.
      const next = element.nextElementSibling;
      if (!next || last) return;
      // 0 while the next section is below the screen, 1 once it covers this one.
      const nextTop = next.getBoundingClientRect().top - view.top;
      const progress = Math.min(1, Math.max(0, 1 - nextTop / view.height));
      covered.set(progress);
      sink.set(Math.round(progress * view.height * SINK));
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [covered, sink, last]);

  return (
    <>
      {/* Where this section sits in the page, even while it is stuck: menu links glide here */}
      <div data-stack-anchor={id} aria-hidden="true" className="h-0" />
      <div ref={ref} className="sticky top-0 bg-card">
        <motion.div style={reduceMotion || last ? undefined : { y: sink, opacity }}>{children}</motion.div>
      </div>
    </>
  );
}
