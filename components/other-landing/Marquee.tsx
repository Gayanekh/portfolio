import type { ReactNode } from "react";

// A row that slides left for ever: its items drawn twice, side by side. It
// pauses under the pointer and stands still for anyone who prefers less
// motion. A lap takes --marquee-time (set it in `className`).
export default function Marquee({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`group/marquee overflow-hidden ${className}`}>
      <div className="flex h-full w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
        <div className="flex h-full shrink-0">{children}</div>
        <div aria-hidden="true" className="flex h-full shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}
