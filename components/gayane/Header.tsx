"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "@/components/site-templates/core/blocks";
import { useSectionId } from "@/components/site-templates/core/context";
import { scrollParent } from "@/components/site-templates/core/scroll";
import { useActiveSection } from "@/components/site-templates/sections/panel-kit";
import { ease, soft } from "@/components/site-templates/sections/nocturne/kit";

// Gayane's header, Nocturne's pinned bar as the user sketched it: no mark or name,
// the menu moved to the right (the section in view marked), and, at the far right,
// "Open to work" with a pulsing dot in place of the city and time. Clear over the
// hero; once the page scrolls, a dark, blurred bar that moves away while the page
// scrolls down and slides back, fixed at the top, as soon as it scrolls back up (the
// user asked). On phones: "Open to work" and a Menu button opening the menu over the screen.
function OpenToWork() {
  return (
    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
      <span aria-hidden="true" className="relative grid size-2 place-items-center">
        <motion.span animate={{ scale: [1, 2.4], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-primary" />
        <span className="size-2 rounded-full bg-primary" />
      </span>
      Open to work
    </span>
  );
}

export default function Header() {
  const id = useSectionId();
  const ref = useRef<HTMLElement>(null);
  const active = useActiveSection(ref);
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const parent = scrollParent(ref.current);
    const scroller: HTMLElement | Window = parent ?? window;
    let last = parent ? parent.scrollTop : window.scrollY;
    const update = () => {
      const y = parent ? parent.scrollTop : window.scrollY;
      setScrolled(y > 40);
      // Near the top it always shows; below, a little scrolling either way is ignored, so it does not flicker.
      if (y < 80) setAway(false);
      else if (y - last > 6) setAway(true);
      else if (last - y > 6) setAway(false);
      last = y;
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => scroller.removeEventListener("scroll", update);
  }, []);

  return (
    <header ref={ref} data-section={id} className="sticky top-0 z-40 h-0">
      <div
        className={`relative z-40 flex h-16 items-center justify-between gap-6 px-5 transition-[background-color,border-color,backdrop-filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none @5xl:justify-end @5xl:gap-12 @xl:px-[5cqw] ${away && !open ? "-translate-y-full" : "translate-y-0"} ${
          scrolled || open ? "border-0 border-b border-solid border-border bg-card/75 backdrop-blur-xl" : "border-0 border-b border-solid border-transparent"
        }`}
      >
        <div className="hidden @5xl:block">
          <Menu size="inline" active={active} />
        </div>
        <OpenToWork />
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          onClick={() => setOpen((o) => !o)}
          className="cursor-pointer rounded border border-solid border-foreground/25 bg-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground @5xl:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`${id}-menu`}
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: soft }}
            className="absolute inset-x-0 top-0 z-30 flex h-[100svh] flex-col justify-end gap-10 bg-card px-5 pb-14 [&_a]:font-display [&_a]:italic"
          >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.25 }}>
              <Menu size="large" active={active} onFollow={() => setOpen(false)} />
            </motion.div>
            <OpenToWork />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
