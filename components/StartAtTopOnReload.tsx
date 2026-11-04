"use client";

import { useLayoutEffect } from "react";

// After a refresh every page opens at the top (the user asked), instead of
// where the browser remembers it was. Only a reload is affected: as the page
// unloads the browser is told not to restore its position, and a reloaded page
// is moved to the top before it paints. Links and Back keep their usual
// scrolling (Next's, and the browser's own restoring).
export default function StartAtTopOnReload() {
  useLayoutEffect(() => {
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (entry?.type === "reload") window.scrollTo(0, 0);
    window.history.scrollRestoration = "auto";

    const forget = () => {
      window.history.scrollRestoration = "manual";
    };
    window.addEventListener("beforeunload", forget);
    return () => window.removeEventListener("beforeunload", forget);
  }, []);
  return null;
}
