"use client";

import { useLayoutEffect } from "react";

// Opens the page at the top, also on a refresh, instead of where the browser
// remembers it was: the hero's template steps only make sense from the start.
// The browser's own restoring is turned back on when leaving the page.
export default function StartAtTop() {
  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);
  return null;
}
