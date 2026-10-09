"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

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
      syncTouch: true,
      // Lenis handles in-page #hash links itself, so they scroll smoothly
      // instead of competing with the browser's native anchor jump.
      anchors: true,
    });

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
      lenis.destroy();
    };
  }, [isAuthPage, reducedMotion]);

  return <>{children}</>;
};

export default LenisProvider;
