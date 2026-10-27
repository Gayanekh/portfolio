"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "../../core/blocks";
import { useField, useSectionId } from "../../core/context";
import { scrollParent } from "../../core/scroll";
import { useActiveSection } from "../panel-kit";
import { ease, FieldValue, soft } from "./kit";

// The Nocturne header, pinned at the top: a round monogram and the name, the
// menu (the section in view marked), and the time where the person lives,
// ticking. Clear over the hero; once the page scrolls, a dark, blurred bar.
// On phones: the name and a Menu button opening the menu over the screen.
//
// Its section's fields: `siteTitle`, `mark`, `city`, and `timeZone` (an IANA
// zone such as America/Los_Angeles).

export default function NocturneHeader() {
  const id = useSectionId();
  const ref = useRef<HTMLElement>(null);
  const active = useActiveSection(ref);
  const zone = useField("timeZone").value;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!ref.current) return;
    const parent = scrollParent(ref.current);
    const scroller: HTMLElement | Window = parent ?? window;
    const update = () => setScrolled((parent ? parent.scrollTop : window.scrollY) > 40);
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => scroller.removeEventListener("scroll", update);
  }, []);

  // The local time, once a minute (only in the browser, so the server and the
  // first paint agree).
  useEffect(() => {
    const tick = () => {
      try {
        setTime(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: zone || undefined }).format(new Date()));
      } catch {
        setTime(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()));
      }
    };
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [zone]);

  return (
    <header ref={ref} data-section={id} className="sticky top-0 z-40 h-0">
      <div
        className={`relative z-40 flex h-16 items-center justify-between gap-6 px-5 transition-[background-color,border-color,backdrop-filter] duration-500 @xl:px-[5cqw] ${
          scrolled || open ? "border-0 border-b border-solid border-border bg-card/75 backdrop-blur-xl" : "border-0 border-b border-solid border-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-solid border-foreground/30 font-display text-[13px] italic">
            <FieldValue field="mark" />
          </span>
          <span className="text-[14px] font-medium tracking-[-0.01em]">
            <FieldValue field="siteTitle" />
          </span>
        </div>

        <div className="hidden @5xl:block">
          <Menu size="inline" active={active} />
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground @5xl:flex">
            <span className="relative grid size-2 place-items-center">
              <motion.span animate={{ scale: [1, 2.4], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-primary" />
              <span className="size-2 rounded-full bg-primary" />
            </span>
            <FieldValue field="city" />
            <span className="tabular-nums text-foreground">{time}</span>
          </span>
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
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <FieldValue field="city" /> · {time}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
