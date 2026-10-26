"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { setPageScroller } from "@/lib/scroll";

interface LenisProviderProps {
  children: ReactNode;
}

const LenisProvider = ({ children }: LenisProviderProps) => {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const isAuthPage = ["/login", "/register", "/verify-email"].includes(pathname);

  useEffect(() => {
    if (isAuthPage || reducedMotion) return;
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
      anchors: { offset: -96 },
    });

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
      lenis.destroy();
    };
  }, [isAuthPage, reducedMotion]);

  return <>{children}</>;
};

export default LenisProvider;
