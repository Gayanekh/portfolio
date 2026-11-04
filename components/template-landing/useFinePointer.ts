"use client";

import { useSyncExternalStore } from "react";

// True on a device with a mouse or trackpad (it can hover, and points finely);
// false on touch screens. The landing's continuous motion (the covers'
// parallax, the street's floating shapes) runs only with it: on phones it made
// scrolling stutter (the user asked for smooth mobile scrolling).
const QUERY = "(hover: hover) and (pointer: fine)";
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

export default function useFinePointer() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => true);
}
