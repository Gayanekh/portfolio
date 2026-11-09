"use client";

import { useSyncExternalStore } from "react";

// True from the large-screen layout up (1024px), where some sections change form.
const WIDE = "(min-width: 1024px)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export default function useWide() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(WIDE).matches, () => true);
}
