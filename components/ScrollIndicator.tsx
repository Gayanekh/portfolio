"use client";

import { useEffect, useState, type RefObject } from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  progress?: number;
  scrollContainerRef?: RefObject<HTMLElement | null>;
}

const ScrollIndicator = ({
  progress: controlledProgress,
  scrollContainerRef,
}: ScrollIndicatorProps) => {
  const [containerProgress, setContainerProgress] = useState(0);
  const progress = controlledProgress ?? containerProgress;

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (scrollContainerRef && !container) return;
    if (controlledProgress !== undefined) return;

    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      const scrollableHeight = container
        ? container.scrollHeight - container.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        scrollableHeight > 0
          ? (scrollTop / scrollableHeight) * 100
          : 0;
      setContainerProgress(Math.max(0, Math.min(100, nextProgress)));
    };

    const scrollSource: HTMLElement | Window = container || window;
    scrollSource.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scrollSource.removeEventListener("scroll", handleScroll);
  }, [controlledProgress, scrollContainerRef]);

  return (
    <div className="mt-12 transition-opacity duration-500">
      <div className="flex items-center justify-between mb-2">
        <motion.p
          key={Math.round(progress)}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-xs font-mono text-primary"
        >
          {Math.round(progress)}%
        </motion.p>
      </div>
      <Progress value={progress} className="h-[2px] bg-muted" />
    </div>
  );
};

export default ScrollIndicator;
