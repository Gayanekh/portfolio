"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Section, type SectionVariants } from "../core/blocks";
import { useField } from "../core/context";

const ease = [0.22, 1, 0.36, 1] as const;

type Gutter = SectionVariants["gutter"];

// A header with only a menu button on the right, pinned to the top while the
// page scrolls. The button's two lines turn into a cross, and a panel drops
// down with the site title and large links to the sections; following one
// closes it. The button sits on a soft chip of the page colour, so it reads
// over photos and disappears into the page at the top.
// Its section's field: `siteTitle`.
export default function MenuHeader({ gutter }: { gutter?: Gutter }) {
  const [open, setOpen] = useState(false);
  const title = useField("siteTitle").node;

  return (
    <Section as="header" spacing="xs" gutter={gutter} pinned>
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease }}
            className="absolute inset-x-0 top-0 bg-card px-5 pb-12 pt-24 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.25)] @xl:px-[9cqw] @xl:pb-16"
          >
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10">
              <div className="text-[13px] tracking-[0.03em] text-muted-foreground">{title}</div>
              <Menu size="large" onFollow={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex justify-end">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
          className="-mr-2.5 flex h-11 cursor-pointer items-center rounded-full border-0 bg-card/70 px-2.5 backdrop-blur-sm"
        >
          <span className="relative block h-2 w-11">
            <motion.span
              animate={open ? { top: 3, rotate: 45 } : { top: 0, rotate: 0 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-x-0 h-[1.5px] bg-foreground"
            />
            <motion.span
              animate={open ? { top: 3, rotate: -45 } : { top: 6.5, rotate: 0 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-x-0 h-[1.5px] bg-foreground"
            />
          </span>
        </button>
      </div>
    </Section>
  );
}
