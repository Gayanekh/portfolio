"use client";

import { useEffect, useState, type RefObject } from "react";
import { useMotionValue } from "framer-motion";
import { scrollParent, viewOf } from "./scroll";

// Scroll and width hooks shared by the templates' scroll-led sections. They
// follow the page's scroll, or the editor canvas's.

// How far `ref` has travelled through the view: 0 as its top meets the
// view's bottom, 1 as its bottom leaves the top (or, with `pinned`, 0 as its
// top reaches the view's top and 1 as its bottom reaches the view's bottom).
export function useScrollProgress(ref: RefObject<HTMLElement | null>, pinned = false) {
  const progress = useMotionValue(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const parent = scrollParent(element);
    const scroller: HTMLElement | Window = parent ?? window;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const view = viewOf(parent);
        const box = element.getBoundingClientRect();
        const top = box.top - view.top;
        const value = pinned ? -top / Math.max(1, box.height - view.height) : (view.height - top) / (view.height + box.height);
        progress.set(Math.min(1, Math.max(0, value)));
      });
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, pinned, progress]);
  return progress;
}

// Whether the page is at least `min` pixels wide (its own width, so the
// editor's phone view counts), so pinned and parallax effects only run there.
export function useWide(ref: RefObject<HTMLElement | null>, min = 768) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const root = ref.current?.closest("[data-site-template]");
    if (!root) return;
    const observer = new ResizeObserver(() => setWide(root.clientWidth >= min));
    observer.observe(root);
    return () => observer.disconnect();
  }, [ref, min]);
  return wide;
}
