"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link2, Lock, MousePointerClick, Repeat, Smartphone, type LucideIcon } from "lucide-react";
import { FEATURES as CARDS } from "@/components/other-landing/content";
import FeatureArt from "@/components/template-landing/FeatureArt";
import Label from "@/components/template-landing/Label";
import { ease, focusRing, frame, serif, themes } from "@/components/template-landing/ui";
import useWide from "@/components/template-landing/useWide";

const FEATURES = {
  label: "Features",
  // Two lines, as on /landing: the second ends on the one word in the serif italic.
  title: [{ lead: "Everything you need,", soft: "" }, { lead: "nothing in the", soft: "way." }],
};

const ICONS: Record<(typeof CARDS.items)[number]["id"], LucideIcon> = {
  screens: Smartphone,
  switch: Repeat,
  address: Link2,
  edit: MousePointerClick,
  draft: Lock,
};

// The address card in the page's one address form.
const ADDRESS_TEXT = "Publish to portory.net/you and share one link everywhere.";
const cardText = (item: (typeof CARDS.items)[number]) => (item.id === "address" ? ADDRESS_TEXT : item.text);

// The motions, measured frame by frame from the accordion reference (the user asked
// for it 1:1): the width's spring, a quicker one for the panel, the text's fade, and
// a picture's slow growth under the pointer (without the reference's tilt: the user asked).
const widthSpring = { type: "spring", stiffness: 225, damping: 30 } as const;
const panelSpring = { type: "spring", stiffness: 300, damping: 34.6, delay: 0.03 } as const;
const growSpring = { type: "spring", stiffness: 81, damping: 18 } as const;
// A pointer's click just after opening a card by hover is not a click to close it.
const CLOSE_AFTER = 300;

// A row of bars, one open: each bar has its number, a + (a − when open), its title
// running up and its icon at the foot. Pointing at a bar opens it (it stays open when
// the pointer leaves), its dark panel (the user asked) fading in as it widens while
// the drawing slides up to the panel's middle and grows; clicking an open card's bar
// closes it, leaving all five even. Enter or a tap does the same.
function Accordion() {
  const [open, setOpen] = useState<number | null>(2);
  const [pointed, setPointed] = useState<number | null>(null);
  const openedAt = useRef(0);
  const reduced = useReducedMotion();
  const width = reduced ? { duration: 0 } : widthSpring;
  const panel = reduced ? { duration: 0 } : panelSpring;
  return (
    <ul className={`${frame} m-0 mt-14 flex h-[32.5rem] list-none gap-2`} onPointerLeave={() => setPointed(null)}>
      {CARDS.items.map((item, i) => {
        const wide = open === i;
        const even = open === null;
        const Icon = ICONS[item.id];
        return (
          <motion.li
            key={item.id}
            initial={false}
            animate={{ flexGrow: wide || even ? 1 : 0 }}
            transition={width}
            style={{ flexBasis: "7rem" }}
            onPointerEnter={(event) => {
              if (event.pointerType !== "mouse") return;
              setPointed(i);
              if (!wide) {
                openedAt.current = performance.now();
                setOpen(i);
              }
            }}
            className="min-w-0 shrink-0"
          >
            <motion.article
              initial={{ opacity: 0, transform: "translateY(24px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1, ease, delay: i * 0.06, ...(reduced && { transform: { duration: 0 } }) }}
              className="group relative h-full overflow-hidden rounded-[8px] bg-[#1b1d21] text-[#efeee9]"
            >
              <motion.span aria-hidden="true" initial={false} animate={{ opacity: wide ? 1 : 0 }} transition={panel} className="absolute inset-y-0 left-[7rem] right-0 block bg-[#1b1d21]" />

              {/* The drawing, centred on the card and moved from there: from the bar's foot, unseen, to the panel's middle, fading in with the panel. */}
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={wide ? { x: "3.5rem", y: "-0.75rem", scale: 1.45 } : { x: "2.625rem", y: "12.2rem", scale: 0.9 }}
                transition={width}
                className="pointer-events-none absolute left-1/2 top-1/2 z-[1] block size-0"
              >
                <motion.span initial={false} animate={{ scale: wide && pointed === i ? 1.037 : 1 }} transition={growSpring} className="absolute left-0 top-0 block size-0">
                  <motion.span initial={false} animate={{ opacity: wide ? 1 : 0 }} transition={panel} className="absolute left-0 top-0 block">
                    <span className="absolute left-0 top-0 block w-max -translate-x-1/2 -translate-y-1/2">
                      <FeatureArt id={item.id} />
                    </span>
                  </motion.span>
                </motion.span>
              </motion.span>

              <motion.p
                aria-hidden={!wide}
                initial={false}
                animate={{ opacity: wide ? 1 : 0 }}
                transition={wide ? { duration: 0.19, delay: 0.1 } : { duration: 0.14 }}
                className="absolute bottom-6 left-[8.5rem] z-[2] m-0 w-[25rem] max-w-[calc(100%_-_10rem)] text-[1rem] leading-[1.55] tracking-[-0.015em] text-[#b4b4b0]"
              >
                {cardText(item)}
              </motion.p>

              {/* The bar: the card's whole width while closed, its first 7rem while open. */}
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={wide}
                  onClick={() => {
                    if (wide && performance.now() - openedAt.current < CLOSE_AFTER) return;
                    openedAt.current = performance.now();
                    setOpen(wide ? null : i);
                  }}
                  className={`${focusRing} absolute inset-y-0 left-0 z-[3] w-[7rem] cursor-pointer rounded-[8px] border-0 bg-transparent p-0 text-left text-inherit`}
                >
                  <span className="absolute left-[1.3125rem] top-[2.125rem] font-mono text-[0.6875rem] leading-none opacity-70">{String(i + 1).padStart(2, "0")}</span>
                  <svg aria-hidden="true" width="36" height="36" viewBox="0 0 36 36" fill="none" className="absolute left-[3.75rem] top-[1.375rem]">
                    <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="1.5" opacity=".22" />
                    <path d="M11 18h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <motion.path d="M18 11v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" initial={false} animate={{ opacity: wide ? 0 : 1 }} transition={{ duration: 0.2 }} />
                  </svg>
                  <span className="absolute left-[1.75rem] top-[5.875rem] rotate-180 whitespace-nowrap text-[1.5rem] font-medium leading-[1.1] tracking-[-0.03em] [writing-mode:vertical-rl]">{item.title}</span>
                  <Icon aria-hidden="true" strokeWidth={1.75} className={`absolute bottom-7 left-[1.75rem] size-6 transition-opacity duration-500 ${wide ? "opacity-100" : "opacity-60"}`} />
                </button>
              </h3>

              {/* The fine edge, a little brighter under the pointer. */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] rounded-[8px] opacity-[0.08] shadow-[inset_0_0_0_1px_#fff] transition-opacity duration-150 group-hover:opacity-[0.22]" />
            </motion.article>
          </motion.li>
        );
      })}
    </ul>
  );
}

// Below large screens there is no room for a row of bars: the five stack, each open.
function Stack() {
  const reduced = useReducedMotion();
  return (
    <ul className={`${frame} m-0 mt-14 flex list-none flex-col gap-[0.625rem]`}>
      {CARDS.items.map((item, i) => {
        const Icon = ICONS[item.id];
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, transform: "translateY(24px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease, delay: i * 0.06, ...(reduced && { transform: { duration: 0 } }) }}
            className="flex min-w-0 flex-col justify-between gap-4 overflow-hidden rounded-[8px] bg-[#1b1d21] p-[clamp(1.25rem,1.8vw,1.75rem)] text-[#efeee9]"
          >
            <span className="flex items-center justify-between font-mono text-[0.75rem] tracking-[0.04em] opacity-70">
              {String(i + 1).padStart(2, "0")}
              <Icon aria-hidden="true" strokeWidth={2} className="size-5" />
            </span>
            <span className="grid place-items-center py-6">
              <FeatureArt id={item.id} />
            </span>
            <span className="flex flex-col gap-2">
              <h3 className="m-0 text-[length:clamp(1.125rem,calc(0.95rem_+_0.4vw),1.375rem)] font-medium leading-[1.2] tracking-[-0.02em]">{item.title}</h3>
              <p className="m-0 max-w-[24rem] text-[0.9375rem] leading-[1.5] text-[#b4b4b0]">{cardText(item)}</p>
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}

// Features: the label on the left and the title in two lines from the grid's
// second line (its last word in the serif italic). Under it, the five features: the
// accordion on large screens, a stack below. The section is dark (the page's dark
// theme colours, the user asked).
export default function Features() {
  const wide = useWide();
  return (
    <section id="features" data-caption="features" aria-labelledby="tl-features-title" className={`relative scroll-mt-20 bg-[var(--bg)] text-[var(--fg)] py-[clamp(4.5rem,8.2vw,7.5rem)] ${themes.dark}`}>
      <div className={`${frame} grid gap-10 lg:grid-cols-4 lg:gap-0`}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease }} className="flex flex-col gap-1.5">
          <Label>{FEATURES.label}</Label>
        </motion.div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:col-span-3">
          {/* The title's lines rise out of their masks together, set off by the title coming into view. */}
          <motion.h2 id="tl-features-title" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="m-0 text-[length:clamp(2.25rem,calc(1.6rem_+_2.2vw),3.5rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            {FEATURES.title.map(({ lead, soft }, i) => (
              <span key={lead} className="block overflow-hidden pb-[0.08em] sm:whitespace-nowrap">
                <motion.span variants={{ hidden: { y: "105%" }, shown: { y: "0%", transition: { duration: 1, ease, delay: i * 0.08 } } }} className="block">
                  {lead}
                  {soft && (
                    <>
                      {" "}
                      <span className={`${serif} tracking-[-0.03em]`}>{soft}</span>
                    </>
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h2>
        </div>
      </div>

      {wide ? <Accordion /> : <Stack />}
    </section>
  );
}
