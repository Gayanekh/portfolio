"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { setPageScroller } from "@/lib/scroll";

interface LenisProviderProps {
  children: ReactNode;
}

const LenisProvider = ({ children }: LenisProviderProps) => {
  const pathname = usePathname();
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);
  const reducedMotion = useReducedMotion();
  const isAuthPage = ["/login", "/register", "/verify-email"].includes(pathname);
  const native = isAuthPage;
  // The portfolio and its project pages take their own menu and hash links (the portfolio's menu goes through the
  // page's scroller, landing each section under its header); Lenis's own link handling would move the page too and the
  // two would fight.
  const ownLinks = pathname.startsWith("/gayane-khachatryan");

  useEffect(() => {
    if (native || reducedMotion) return;
    const lenis = new Lenis({
      smoothWheel: true,
      // Touch screens keep the phone's own scrolling: Lenis driving touch
      // (syncTouch) moves the page by script, which on iPhones makes the page
      // and the fixed header drift and shake together while scrolling.
      syncTouch: false,
      // Lenis handles in-page #hash links itself, so they scroll smoothly
      // instead of competing with the browser's native anchor jump. It stops
      // 6rem short of the target (the sections' scroll-mt-24), so a section
      // lands below the floating header rather than under it.
      anchors: ownLinks ? false : { offset: -96 },
    });

    lenisRef.current = lenis;
    setPageScroller(lenis);

    let animationFrameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    const updateLenisState = () => {
      const isLocked = document.documentElement.dataset.scrollLocked === "true";

      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const observer = new MutationObserver(updateLenisState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });

    updateLenisState();

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      setPageScroller(null);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, [native, ownLinks, reducedMotion]);

  // A new page opens at its top: Lenis keeps its own idea of where the page was, so it is told (an address with a
  // section in it, #work, is left to that page to go to).
  useEffect(() => {
    if (!window.location.hash) lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return <>{children}</>;
};

export default LenisProvider;
