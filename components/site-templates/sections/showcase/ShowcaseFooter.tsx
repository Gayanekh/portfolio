"use client";

import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { useSectionId } from "../../core/context";
import { glideTo } from "../../core/scroll";
import { FieldValue, gutter, Letters, Roll, type } from "./kit";

// The closing signature: a thin row (the copyright, a credit, back to the
// top), then the name across the whole width, its letters rising one by one
// and cut by the page's bottom edge.
//
// Its section's fields: `text`, `credit`, `top` and `signature`.

export default function ShowcaseFooter() {
  const id = useSectionId();
  const ref = useRef<HTMLElement>(null);
  const toTop = () => {
    const first = ref.current?.closest("[data-site-template]")?.querySelector<HTMLElement>("[data-section]:not(header)");
    if (first) glideTo(first);
  };
  return (
    <footer ref={ref} data-section={id} className="overflow-hidden bg-card text-foreground">
      <div className={`flex flex-wrap items-center justify-between gap-4 border-0 border-t border-solid border-border py-6 text-muted-foreground ${gutter} ${type.label}`}>
        <FieldValue field="text" />
        <span className="hidden @xl:inline">
          <FieldValue field="credit" />
        </span>
        <button type="button" onClick={toTop} className={`group/roll flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-foreground ${type.label}`}>
          <Roll>
            <FieldValue field="top" />
          </Roll>
          <ArrowUp aria-hidden="true" strokeWidth={1.5} className="size-3.5 transition-transform duration-500 group-hover/roll:-translate-y-0.5" />
        </button>
      </div>
      {/* Moved down a little, so the footer's edge cuts the name */}
      <div className={`translate-y-[22%] ${gutter}`}>
        <Letters field="signature" className="block whitespace-nowrap font-display text-[length:23.5cqw] font-semibold leading-[0.9] tracking-[-0.075em]" />
      </div>
    </footer>
  );
}
