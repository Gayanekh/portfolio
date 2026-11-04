"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "../core/blocks";
import { readSiteTitle } from "../core/content";
import { useSectionId, useTemplate } from "../core/context";
import { scrollParent, viewOf } from "../core/scroll";
import { columns, ease, MenuIcon, MenuPanel, useActiveSection } from "./panel-kit";

// The panel sections' header, pinned at the top of the view: a slim copy of
// the hero's top row (the site's name on the grey panel, the menu, the menu
// button in the accent column) that slides down once the hero's own top row
// has scrolled away, and back up over it. The menu marks the section in view.
// The menu button opens the accent menu over the view. On phones: the name
// and the menu button. It has no fields: the name is the site's title.
// Put it first, with `stack: false`.

export default function PanelHeader() {
  const id = useSectionId();
  const { template, content } = useTemplate();
  const ref = useRef<HTMLElement>(null);
  const active = useActiveSection(ref);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const title = readSiteTitle(template, content);

  // Shown once the section holding the site's title (the hero) has scrolled
  // past its top row (a fifth of the view).
  useEffect(() => {
    const root = ref.current?.closest("[data-site-template]");
    if (!ref.current || !root) return;
    const parent = scrollParent(ref.current);
    const scroller: HTMLElement | Window = parent ?? window;
    const update = () => {
      const hero = root.querySelector(`[data-section="${template.siteTitle.section}"]`);
      const view = viewOf(parent);
      setShown(!hero || hero.getBoundingClientRect().top - view.top < -view.height * 0.2);
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [template]);

  return (
    <header ref={ref} data-section={id} className="sticky top-0 z-40 h-0">
      <motion.div
        initial={false}
        animate={{ y: shown || open ? "0%" : "-101%" }}
        transition={{ duration: 0.6, ease }}
        className={`relative z-40 grid h-14 grid-cols-[1fr_auto] border-0 border-b border-solid border-foreground/15 bg-card @xl:h-16 ${columns.hero}`}
      >
        <div className="flex items-center px-5 @xl:bg-foreground/[0.07] @xl:px-[3.2cqw]">
          <span className="font-display text-[15px] font-bold tracking-[0.01em]">{title}</span>
        </div>
        <div className="hidden items-center @xl:flex @xl:pl-[3.3cqw]">
          <Menu size="small" active={active} />
        </div>
        <div className="hidden border-0 border-l border-solid border-foreground/15 @xl:block" />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          onClick={() => setOpen((o) => !o)}
          className="relative z-40 grid w-14 cursor-pointer place-items-center border-0 bg-primary text-card @xl:w-auto"
        >
          <MenuIcon open={open} />
        </button>
      </motion.div>
      <MenuPanel id={`${id}-menu`} open={open} title={title} active={active} onClose={() => setOpen(false)} className="absolute inset-x-0 top-0 h-[100svh]" />
    </header>
  );
}
