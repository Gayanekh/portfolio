"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "../../core/blocks";
import { readSiteTitle } from "../../core/content";
import { useSectionId, useTemplate } from "../../core/context";
import { glideTo, scrollParent } from "../../core/scroll";
import { MenuPanel, useActiveSection } from "../panel-kit";
import { Dot, FieldValue, gutter, Roll, type } from "./kit";

// The Showcase header, pinned at the top: the name (back to the top), the
// menu with the section in view marked, and whether the person is open for
// work, by a glowing light. Clear at first; once the page scrolls, a frosted
// bar. On phones: the name and a Menu button opening the cobalt menu over
// the screen.
//
// Its section's fields: `siteTitle` and `status`.

export default function ShowcaseHeader() {
  const id = useSectionId();
  const { template, content } = useTemplate();
  const ref = useRef<HTMLElement>(null);
  const active = useActiveSection(ref);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const parent = scrollParent(ref.current);
    const scroller: HTMLElement | Window = parent ?? window;
    const update = () => setScrolled((parent ? parent.scrollTop : window.scrollY) > 40);
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => scroller.removeEventListener("scroll", update);
  }, []);

  const toTop = () => {
    const first = ref.current?.closest("[data-site-template]")?.querySelector<HTMLElement>("[data-section]:not(header)");
    if (first) glideTo(first);
  };

  return (
    <header ref={ref} data-section={id} className="sticky top-0 z-40 h-0">
      <div
        className={`relative z-40 flex h-16 items-center justify-between gap-6 border-0 border-b border-solid transition-[background-color,border-color,backdrop-filter] duration-500 ${gutter} ${
          scrolled || open ? "border-border bg-card/80 backdrop-blur-xl" : "border-transparent"
        }`}
      >
        <button type="button" onClick={toTop} className="group/roll cursor-pointer border-0 bg-transparent p-0 font-display text-[16px] font-semibold tracking-[-0.03em] text-foreground">
          <Roll>
            <FieldValue field="siteTitle" />
          </Roll>
        </button>

        <div className="hidden @4xl:block">
          <Menu size="inline" active={active} />
        </div>

        <div className="flex items-center gap-4">
          <span className={`hidden items-center gap-2 text-muted-foreground @xl:flex ${type.label}`}>
            <Dot />
            <FieldValue field="status" />
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${id}-menu`}
            onClick={() => setOpen((o) => !o)}
            className={`h-9 cursor-pointer rounded-[4px] border-0 bg-foreground px-3 text-card @4xl:hidden ${type.label}`}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <MenuPanel id={`${id}-menu`} open={open} title={readSiteTitle(template, content)} active={active} onClose={() => setOpen(false)} className="absolute inset-x-0 top-0 h-[100svh]" />
    </header>
  );
}
