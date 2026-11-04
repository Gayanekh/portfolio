"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { readField } from "../core/content";
import { useSectionId, useTemplate } from "../core/context";
import { AccentNumber, ease, FieldValue, Marquee, number, PanelFrame, PanelTitle, Rise, type } from "./panel-kit";

// Recognition (exhibitions, awards, press), in the hero's panels:
//
//   [ eyebrow  ][                          ][         ][ 01 ]
//   [ title (huge)                         ][ intro          ]
//   [ ■ Tab 1  ][ 2025  Title of the entry      Where        ]
//   [   Tab 2  ][ 2024  ...                                  ]
//   [ featured ][ NAME ■ NAME ■ NAME ■ ... (running)         ]
//
// Following a tab swaps the list: the rows leave, the new ones slide in from
// the right one after another, and the accent block's number rolls to the
// tab's. The names under it run right to left without end.
//
// Its section's fields: `eyebrow`, `title`, `intro`, `featuredLabel`,
// `press1`... and for each tab (`tab1`...): Label, and for each of its rows
// (`tab1Item1`...): Year, Title and Place. Rows without a title are left out.

const place = {
  eyebrow: "px-5 pt-14 @xl:col-start-1 @xl:row-start-1 @xl:px-[3.2cqw] @xl:pt-[2.4cqw]",
  accent: "@xl:col-start-4 @xl:row-start-1",
  title: "px-5 pt-4 @xl:col-span-2 @xl:col-start-1 @xl:row-start-2 @xl:px-[3.2cqw]",
  intro: "px-5 pt-6 @xl:col-span-2 @xl:col-start-3 @xl:row-start-2 @xl:self-end @xl:px-[2.6cqw] @xl:pt-0",
  tabs: "flex gap-2 overflow-x-auto px-5 pt-10 @xl:col-start-1 @xl:row-start-3 @xl:flex-col @xl:gap-1 @xl:overflow-visible @xl:px-[3.2cqw] @xl:pt-[8svh]",
  // The rows line up with the columns: the year and title in the first, where in the next.
  list: "min-h-[22rem] px-5 pb-14 pt-6 @xl:col-span-3 @xl:col-start-2 @xl:row-start-3 @xl:pb-[10svh] @xl:pl-[3.3cqw] @xl:pr-[3.2cqw] @xl:pt-[8svh]",
  featuredLabel: "px-5 pt-8 @xl:col-start-1 @xl:row-start-4 @xl:self-center @xl:px-[3.2cqw] @xl:pt-0",
  featured: "border-0 border-y border-solid border-foreground/15 py-[clamp(1.25rem,4svh,2.5rem)] @xl:col-span-3 @xl:col-start-2 @xl:row-start-4 @xl:border-b-0 mt-4 @xl:mt-0",
};

export default function PanelHonours({ tabs, items, press }: { tabs: number[]; items: number[]; press: number[] }) {
  const { content } = useTemplate();
  const section = useSectionId();
  const [{ tab, direction }, setState] = useState({ tab: 0, direction: 1 });
  const rows = (t: number) => items.filter((i) => readField(content, section, `tab${t}Item${i}Title`));
  const t = tabs[tab];

  return (
    <PanelFrame grid="@xl:grid-rows-[20svh_auto_auto_auto]">
      <div className={place.eyebrow}>
        <Rise>
          <div className={type.eyebrow}>
            <FieldValue field="eyebrow" />
          </div>
        </Rise>
      </div>

      <div className={place.accent}>
        <AccentNumber value={number(tab)} direction={direction} />
      </div>

      <div className={place.title}>
        <PanelTitle field="title" />
      </div>

      <div className={place.intro}>
        <Rise delay={0.15}>
          <p className={`m-0 max-w-[26rem] ${type.body}`}>
            <FieldValue field="intro" />
          </p>
        </Rise>
      </div>

      <div role="tablist" aria-orientation="vertical" className={place.tabs}>
        {tabs.map((n, i) => (
          <Rise key={n} delay={i * 0.08}>
            <button
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => i !== tab && setState({ tab: i, direction: i > tab ? 1 : -1 })}
              className={`flex cursor-pointer items-center gap-3 whitespace-nowrap border-0 bg-transparent px-0 py-2 font-display text-[length:clamp(1rem,1.3cqw,1.3rem)] font-bold tracking-[-0.02em] transition-colors duration-300 hover:text-foreground ${i === tab ? "text-foreground" : "text-foreground/35"}`}
            >
              <motion.span initial={false} animate={{ scale: i === tab ? 1 : 0 }} transition={{ duration: 0.4, ease }} className="block size-2.5 bg-primary" />
              <FieldValue field={`tab${n}Label`} />
              <sup className="text-[11px] font-medium tabular-nums text-muted-foreground">{String(rows(n).length).padStart(2, "0")}</sup>
            </button>
          </Rise>
        ))}
      </div>

      <div role="tabpanel" className={place.list}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={t}
            className="m-0 list-none p-0"
            initial="out"
            animate="in"
            exit="gone"
            variants={{ in: { transition: { staggerChildren: 0.07 } }, gone: { opacity: 0, x: -direction * 20, transition: { duration: 0.25 } } }}
          >
            {rows(t).map((i) => (
              <motion.li
                key={i}
                variants={{ out: { opacity: 0, x: direction * 40 }, in: { opacity: 1, x: 0, transition: { duration: 0.7, ease } } }}
                className="group/item grid grid-cols-[4rem_1fr] gap-x-4 gap-y-1 border-0 border-b border-solid border-foreground/15 py-[clamp(1rem,2.6svh,1.6rem)] @xl:grid-cols-[6rem_calc(30.2cqw-8rem)_1fr] @xl:items-baseline"
              >
                <span className="font-display text-sm font-bold text-primary">
                  <FieldValue field={`tab${t}Item${i}Year`} />
                </span>
                <span className="text-[length:clamp(1rem,1.35cqw,1.35rem)] font-medium leading-snug tracking-[-0.01em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/item:translate-x-2">
                  <FieldValue field={`tab${t}Item${i}Title`} />
                </span>
                <span className="col-start-2 text-[13px] text-muted-foreground @xl:col-start-3 @xl:pl-[2.6cqw]">
                  <FieldValue field={`tab${t}Item${i}Place`} />
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className={place.featuredLabel}>
        <div className={type.eyebrow}>
          <FieldValue field="featuredLabel" />
        </div>
      </div>

      <div className={place.featured}>
        <Marquee className="items-center">
          {press.map((n) => (
            <span key={n} className="flex shrink-0 items-center gap-[3cqw] pr-[3cqw] font-display text-[length:clamp(1.5rem,2.6cqw,2.6rem)] font-bold tracking-[-0.04em]">
              <FieldValue field={`press${n}`} />
              <span aria-hidden="true" className="size-2.5 bg-primary" />
            </span>
          ))}
        </Marquee>
      </div>
    </PanelFrame>
  );
}
