"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: ReactNode;
}

const LenisProvider = ({ children }: LenisProviderProps) => {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
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
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
