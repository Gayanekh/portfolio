"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FieldPicture } from "../core/blocks";
import { useTemplate } from "../core/context";
import { AccentNumber, arrowIcon, arrowLink, ease, FieldValue, number, PanelFrame, PanelTitle, Rise, soft, type } from "./panel-kit";

// Services, in the hero's panels:
//
//   [ eyebrow ][                     ][                  ][ 02 ]
//   [ services (huge)                ][ intro, Book →         ]
//   [ 01      ][ Name      price     ][ the service's picture ]
//   [ 02      ][ Name      price     ][ (to the edge)         ]
//   [ ...     ][ ...                 ][ price, text           ]
//
// Pointing at a service (or focusing it) makes it the one shown: its number
// turns to the accent, the others fade back, the accent block's number rolls
// to it, and its picture sweeps over the last in the direction of travel,
// its text following. On phones every service shows its picture and text.
//
// Its section's fields: `eyebrow`, `title`, `intro`, `cta` (glides to
// `ctaTarget`), and for each service (`service1`...): Name, Price, Details,
// Text and Image.

const place = {
  eyebrow: "px-5 pt-14 @xl:col-start-1 @xl:row-start-1 @xl:px-[3.2cqw] @xl:pt-[2.4cqw]",
  accent: "@xl:col-start-4 @xl:row-start-1",
  title: "px-5 pt-4 @xl:col-span-2 @xl:col-start-1 @xl:row-start-2 @xl:px-[3.2cqw]",
  intro: "px-5 pt-8 @xl:col-span-2 @xl:col-start-3 @xl:row-start-2 @xl:self-end @xl:px-[2.6cqw] @xl:pb-[1svh] @xl:pt-0",
  list: "m-0 list-none p-0 pb-16 pt-10 @xl:col-span-2 @xl:col-start-1 @xl:row-start-3 @xl:pb-[10svh] @xl:pt-[8svh]",
  preview: "hidden @xl:col-span-2 @xl:col-start-3 @xl:row-start-3 @xl:flex @xl:flex-col @xl:pb-[10svh] @xl:pt-[8svh]",
};

export default function PanelServices({ services, ctaTarget }: { services: number[]; ctaTarget: string }) {
  const { navigate } = useTemplate();
  const still = Boolean(useReducedMotion());
  const [{ active, previous, direction }, setState] = useState({ active: 0, previous: null as number | null, direction: 1 });
  const pick = (to: number) => {
    if (to === active) return;
    setState({ active: to, previous: active, direction: to > active ? 1 : -1 });
  };
  const n = services[active];
  // Going down the list, the picture opens from below; going up, from above.
  const closed = direction > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";

  return (
    <PanelFrame grid="@xl:grid-rows-[20svh_auto_auto]">
      <div className={place.eyebrow}>
        <Rise>
          <div className={type.eyebrow}>
            <FieldValue field="eyebrow" />
          </div>
        </Rise>
      </div>

      <div className={place.accent}>
        <AccentNumber value={number(active)} direction={direction} />
      </div>

      <div className={place.title}>
        <PanelTitle field="title" />
      </div>

      <div className={place.intro}>
        <Rise delay={0.15} className="flex flex-col items-start gap-6 @xl:flex-row @xl:items-end @xl:justify-between">
          <p className={`m-0 max-w-[24rem] ${type.body}`}>
            <FieldValue field="intro" />
          </p>
          <button type="button" onClick={() => navigate(ctaTarget)} className={`${arrowLink} shrink-0`}>
            <FieldValue field="cta" />
            <ArrowRight aria-hidden="true" className={arrowIcon} strokeWidth={1.5} />
          </button>
        </Rise>
      </div>

      <ul className={place.list}>
        {services.map((s, i) => (
          <li key={s} onMouseEnter={() => pick(i)} onFocus={() => pick(i)} className="group/row relative border-0 border-b border-solid border-foreground/15 first:border-t">
            <Rise delay={i * 0.07} className="grid grid-cols-[3.25rem_1fr] items-baseline gap-y-3 px-5 py-6 @xl:grid-cols-[33.66%_66.34%] @xl:px-0 @xl:py-[3.2svh]">
              <span className={`font-display text-sm font-bold transition-colors duration-300 @xl:pl-[3.2cqw] ${i === active ? "text-primary" : "text-muted-foreground"}`}>{number(i)}</span>
              <div tabIndex={0} className="flex flex-col gap-2 outline-none @xl:pl-[3.3cqw] @xl:pr-[3cqw]">
                {/* The one shown steps in a little (from the desktop layout up) */}
                <span
                  className={`${type.big} transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none @xl:text-foreground/30 ${i === active ? "@xl:translate-x-[14px] @xl:!text-foreground" : ""}`}
                >
                  <FieldValue field={`service${s}Name`} />
                </span>
                <span className="flex flex-wrap gap-x-4 text-[13px] text-muted-foreground">
                  <span className="font-medium text-primary">
                    <FieldValue field={`service${s}Price`} />
                  </span>
                  <FieldValue field={`service${s}Details`} />
                </span>
              </div>
              {/* Phones: the picture and text under each */}
              <div className="col-span-2 flex flex-col gap-4 @xl:hidden">
                <p className={`m-0 ${type.muted}`}>
                  <FieldValue field={`service${s}Text`} />
                </p>
                <div className="relative aspect-[4/3] overflow-hidden bg-foreground/[0.07]">
                  <FieldPicture field={`service${s}Image`} className="absolute inset-0 block h-full w-full object-cover" />
                </div>
              </div>
            </Rise>
            {/* A thin accent line drawing across the row while it is shown */}
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ scaleX: i === active ? 1 : 0 }}
              transition={{ duration: 0.7, ease: soft }}
              className="absolute inset-x-0 -bottom-px hidden h-px origin-left bg-primary @xl:block"
            />
          </li>
        ))}
      </ul>

      {/* The service shown: its picture over the last, then its text */}
      <div className={place.preview}>
        <Rise className="relative min-h-[48svh] flex-1 overflow-hidden bg-foreground/[0.07]">
          {previous !== null && <FieldPicture field={`service${services[previous]}Image`} className="absolute inset-0 block h-full w-full object-cover" />}
          <motion.div
            key={active}
            className="absolute inset-0 overflow-hidden"
            initial={previous !== null && !still ? { clipPath: closed } : false}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1, ease: soft }}
          >
            <motion.div className="absolute inset-0" initial={previous !== null && !still ? { scale: 1.12 } : false} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }}>
              <FieldPicture field={`service${n}Image`} className="absolute inset-0 block h-full w-full object-cover" />
            </motion.div>
          </motion.div>
        </Rise>
        <div className="min-h-[9rem] px-[2.6cqw] pt-[4svh]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: direction * 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -direction * 10 }}
              transition={{ duration: 0.45, ease }}
              className="grid grid-cols-[1fr_1.4fr] gap-[2.6cqw]"
            >
              <span className={type.lead}>
                <FieldValue field={`service${n}Price`} />
              </span>
              <p className={`m-0 ${type.muted}`}>
                <FieldValue field={`service${n}Text`} />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PanelFrame>
  );
}
