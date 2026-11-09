"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

// Reduced motion, for choosing what to render: false on the server and the first
// render in the browser (so the page hydrates as it was sent), the visitor's setting
// from then on. Plain useReducedMotion knows the setting at once in the browser, so
// anything rendered differently for it would not match the server's.
const subscribeNever = () => () => {};
export function useStillAfterHydration(): boolean {
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  return hydrated && Boolean(reduced);
}
