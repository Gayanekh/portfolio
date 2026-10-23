"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Side = "top" | "bottom" | "left" | "right";

// Where the tooltip sits against its control, and how it is shifted from
// that point.
const GAP = 6;
const place: Record<Side, (box: DOMRect) => { left: number; top: number }> = {
  top: (box) => ({ left: box.left + box.width / 2, top: box.top - GAP }),
  bottom: (box) => ({ left: box.left + box.width / 2, top: box.bottom + GAP }),
  left: (box) => ({ left: box.left - GAP - 2, top: box.top + box.height / 2 }),
  right: (box) => ({ left: box.right + GAP + 2, top: box.top + box.height / 2 }),
};
const shift: Record<Side, string> = {
  top: "-translate-x-1/2 -translate-y-full",
  bottom: "-translate-x-1/2",
  left: "-translate-x-full -translate-y-1/2",
  right: "-translate-y-1/2",
};

// The app's one tooltip: a small dark label beside a control, after a short
// pause on hover or when the control gets keyboard focus, gone on leaving it
// or pressing it. Drawn on the page body, so no sidebar, rail or toolbar
// clips it. `keys` shows a shortcut ("Ctrl", "D"). It wraps one control
// without changing its layout (the wrapper is display: contents).
export default function Tooltip({
  label,
  keys,
  side = "bottom",
  delay = 300,
  disabled = false,
  children,
}: {
  label: ReactNode;
  keys?: string[];
  side?: Side;
  delay?: number;
  disabled?: boolean;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [spot, setSpot] = useState<{ left: number; top: number } | null>(null);

  const show = () => {
    if (disabled) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const control = wrapRef.current?.firstElementChild;
      if (control) setSpot(place[side](control.getBoundingClientRect()));
    }, delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setSpot(null);
  };

  // Scrolling moves the control away from it: hide it then.
  useEffect(() => {
    if (!spot) return;
    window.addEventListener("scroll", hide, true);
    return () => window.removeEventListener("scroll", hide, true);
  }, [spot]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      ref={wrapRef}
      className="contents"
      onPointerEnter={show}
      onPointerLeave={hide}
      onPointerDown={hide}
      onFocus={(event) => event.target.matches(":focus-visible") && show()}
      onBlur={hide}
      onKeyDown={(event) => event.key === "Escape" && hide()}
    >
      {children}
      {spot &&
        createPortal(
          <span role="tooltip" style={{ left: spot.left, top: spot.top }} className={`pointer-events-none fixed z-[200] ${shift[side]}`}>
            <span className="flex items-center gap-1.5 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 font-[family-name:var(--font-ui),ui-sans-serif,system-ui,sans-serif] text-[11px] font-medium normal-case leading-normal tracking-normal text-white shadow-[0_4px_12px_-4px_rgb(0_0_0/0.3)] animate-in fade-in duration-150">
              {label}
              {keys?.map((key) => (
                <kbd key={key} className="rounded bg-white/15 px-1 font-[inherit] text-[9px] font-semibold">
                  {key}
                </kbd>
              ))}
            </span>
          </span>,
          document.body,
        )}
    </span>
  );
}
