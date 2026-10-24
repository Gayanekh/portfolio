"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// The last page visited outside the sign-in pages, kept for this tab, so the
// sign-in pages' Back button can return to it (wherever the visitor came
// from, and however often they switched between Log in and Register).
const KEY = "portory:last-page";
const AUTH_PAGES = new Set(["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]);
const isAuthPage = (path: string) => AUTH_PAGES.has(path) || path.startsWith("/auth/");

// Remembers each page as it is visited, its query included (the builder is
// /templates?template=…). Rendered once, in the root layout, inside Suspense.
export function LastPageTracker() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  useEffect(() => {
    // Pages shown inside a frame (the gallery's live template previews) are
    // not where the visitor is.
    if (isAuthPage(pathname) || window.self !== window.top) return;
    try {
      sessionStorage.setItem(KEY, query ? `${pathname}?${query}` : pathname);
    } catch {
      // No storage (a private window): Back falls back to the home page.
    }
  }, [pathname, query]);
  return null;
}

// The remembered page, or null when there is none (the visitor opened a
// sign-in page directly). Only a path on this site, never another address.
// Null on the server, so the first render matches it.
const readLastPage = () => {
  try {
    const stored = sessionStorage.getItem(KEY);
    return stored?.startsWith("/") && !stored.startsWith("//") ? stored : null;
  } catch {
    return null;
  }
};
const noSubscription = () => () => {};
export const useLastPage = () => useSyncExternalStore(noSubscription, readLastPage, () => null);
