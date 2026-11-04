"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { FieldPicture } from "../core/blocks";
import { readField } from "../core/content";
import { useSectionId, useTemplate } from "../core/context";
import { plainText } from "../core/rich-format";
import { ease, FieldValue, number, PanelFrame, PanelTitle, Rise, soft, type } from "./panel-kit";

// Work, after the poster-like "work" page of the design reference: the grey
// panel, then three equal columns of pictures under thin lines.
//
//   [ eyebrow ][        w o r k        ][        ]
//   [         ][                       ][ All  v ]  <- the filter, in the accent
//   [ intro   ][ picture ][ picture    ][ picture ]
//   [ 01-03   ][         ][            ][         ]
//   [ < ][ >  ][         ][            ][         ]
//
// The filter shows one category at a time (from the works' categories); the
// square arrows turn the page, three works at a time, the new pictures
// sweeping over the old in the direction of travel, one after another.
// Pointing at a picture brings up its name, category and year; following it
// opens the work full screen, where the arrows (and the keyboard) go through
// the rest. On phones: every work of the category, two to a row.
//
// Its section's fields: `eyebrow`, `title`, `intro`, `allLabel`, and for each
// work (`work1`...): Title, Category, Year and Image.

const PAGE = 3;

const place = {
  eyebrow: "px-5 pt-14 @xl:col-start-1 @xl:row-start-1 @xl:px-[3.2cqw] @xl:pt-[2.4cqw]",
  title: "px-5 pt-4 @xl:col-span-2 @xl:col-start-2 @xl:row-start-1 @xl:self-end @xl:justify-self-center @xl:px-0 @xl:pb-[6svh] @xl:pt-[14svh]",
  filter: "relative z-20 mx-5 mt-8 @xl:col-start-4 @xl:row-start-1 @xl:mx-0 @xl:mt-0 @xl:self-end",
  side: "hidden @xl:col-start-1 @xl:row-start-2 @xl:flex @xl:flex-col @xl:justify-between",
  pictures: "hidden @xl:col-span-3 @xl:col-start-2 @xl:row-start-2 @xl:grid @xl:grid-cols-3",
  phone: "grid grid-cols-2 gap-x-3 gap-y-6 px-5 pb-16 pt-8 @xl:hidden",
};

interface Work {
  n: number;
  title: string;
  category: string;
  year: string;
}

const square = "grid h-[clamp(3.5rem,9svh,5.5rem)] flex-1 cursor-pointer place-items-center border-0 transition-colors duration-300";

export default function PanelWork({ works: numbers }: { works: number[] }) {
  const { content, edit } = useTemplate();
  const section = useSectionId();
  const read = (field: string) => plainText(readField(content, section, field));
  const still = Boolean(useReducedMotion());

  const works: Work[] = numbers
    .map((n) => ({ n, title: read(`work${n}Title`), category: read(`work${n}Category`), year: read(`work${n}Year`) }))
    .filter((work) => work.title || read(`work${work.n}Image`));
  const categories = [...new Set(works.map((work) => work.category).filter(Boolean))];
  const allLabel = read("allLabel") || "All";

  const [filter, setFilter] = useState<string | null>(null);
  const [{ page, direction, before }, setPaging] = useState<{ page: number; direction: number; before: Work[] }>({ page: 0, direction: 1, before: [] });
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null);

  const shown = filter ? works.filter((work) => work.category === filter) : works;
  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const current = Math.min(page, pages - 1);
  const onPage = shown.slice(current * PAGE, current * PAGE + PAGE);

  const turn = (by: number) => {
    if (pages < 2) return;
    setPaging({ page: (current + by + pages) % pages, direction: by, before: onPage });
  };
  const pick = (category: string | null) => {
    setOpen(false);
    if (category === filter) return;
    setFilter(category);
    setPaging({ page: 0, direction: 1, before: onPage });
  };

  const first = shown.length ? current * PAGE + 1 : 0;
  const last = current * PAGE + onPage.length;
  // The new picture opens from the edge it travels from.
  const closed = direction > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

  return (
    <PanelFrame kind="even" grid="@xl:grid-rows-[minmax(40svh,auto)_auto]">
      <div className={place.eyebrow}>
        <Rise>
          <div className={type.eyebrow}>
            <FieldValue field="eyebrow" />
          </div>
        </Rise>
      </div>

      <div className={place.title}>
        <PanelTitle field="title" size="hero" />
      </div>

      {/* The filter: the category shown, opening the list of the others */}
      <div className={place.filter}>
        <Rise x={30}>
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((o) => !o)}
            className="flex h-[clamp(3.5rem,11svh,6.5rem)] w-full cursor-pointer items-center justify-between border-0 bg-primary px-[clamp(1.25rem,2.2cqw,2.25rem)] text-[14px] text-card"
          >
            <span>{filter ?? allLabel}</span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease }} className="grid">
              <ChevronDown aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </motion.span>
          </button>
        </Rise>
        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
              transition={{ duration: 0.5, ease: soft }}
              className="absolute inset-x-0 top-full m-0 list-none border-0 border-t border-solid border-card/30 bg-primary p-0 text-card"
            >
              {[null, ...categories].map((category) => {
                const count = category ? works.filter((work) => work.category === category).length : works.length;
                return (
                  <li key={category ?? "all"} role="option" aria-selected={category === filter}>
                    <button
                      type="button"
                      onClick={() => pick(category)}
                      className={`flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-[clamp(1.25rem,2.2cqw,2.25rem)] py-3 text-left text-[14px] text-card transition-opacity duration-300 hover:opacity-100 ${category === filter ? "opacity-100" : "opacity-60"}`}
                    >
                      {category ?? allLabel}
                      <span className="text-[12px] tabular-nums">{String(count).padStart(2, "0")}</span>
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* The intro, where the page is, and the square arrows */}
      <div className={place.side}>
        <Rise className="px-[3.2cqw] pt-[3svh]">
          <p className={`m-0 max-w-[16rem] ${type.muted}`}>
            <FieldValue field="intro" />
          </p>
        </Rise>
        <div>
          <div className="px-[3.2cqw] pb-[3svh] font-display text-sm font-bold" aria-live="polite">
            <span className="text-primary">{String(first).padStart(2, "0")}</span>
            <span className="text-muted-foreground">
              —{String(last).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex">
            <button type="button" aria-label="Previous works" disabled={pages < 2} onClick={() => turn(-1)} className={`${square} bg-primary text-card hover:bg-foreground disabled:cursor-default disabled:opacity-40`}>
              <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Next works" disabled={pages < 2} onClick={() => turn(1)} className={`${square} bg-card text-foreground hover:bg-foreground hover:text-card disabled:cursor-default disabled:opacity-40`}>
              <ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Three pictures: the last page's under the new ones sweeping over */}
      <div className={place.pictures}>
        {Array.from({ length: PAGE }, (_, slot) => {
          const work = onPage[slot];
          const under = before[slot];
          const at = current * PAGE + slot;
          return (
            <Rise key={slot} delay={0.1 + slot * 0.12} className="relative aspect-[3/4] overflow-hidden">
              {under && under.n !== work?.n && <FieldPicture field={`work${under.n}Image`} className="absolute inset-0 block h-full w-full object-cover" />}
              {work && (
                <motion.div
                  key={`${work.n}-${filter}-${current}`}
                  className="absolute inset-0 overflow-hidden"
                  initial={before.length && !still ? { clipPath: closed } : false}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  transition={{ duration: 1.1, ease: soft, delay: (direction > 0 ? slot : PAGE - 1 - slot) * 0.12 }}
                >
                  <Tile work={work} onOpen={edit ? undefined : () => setViewing(at)} />
                </motion.div>
              )}
            </Rise>
          );
        })}
      </div>

      {/* Phones: every work of the category */}
      <div className={place.phone}>
        {shown.map((work, i) => (
          <Rise key={`${filter}-${work.n}`} delay={(i % 2) * 0.08}>
            <button
              type="button"
              onClick={edit ? undefined : () => setViewing(i)}
              className="flex w-full cursor-pointer flex-col gap-2 border-0 bg-transparent p-0 text-left text-foreground"
            >
              <span className="relative block aspect-[3/4] w-full overflow-hidden bg-foreground/[0.07]">
                <FieldPicture field={`work${work.n}Image`} alt={work.title} className="absolute inset-0 block h-full w-full object-cover" />
              </span>
              <span className="text-[14px] font-medium leading-tight">{work.title}</span>
              <span className="text-[12px] text-muted-foreground">{[work.category, work.year].filter(Boolean).join(" · ")}</span>
            </button>
          </Rise>
        ))}
      </div>

      <AnimatePresence>
        {viewing !== null && shown[viewing] && <Lightbox works={shown} index={viewing} onIndex={setViewing} onClose={() => setViewing(null)} />}
      </AnimatePresence>
    </PanelFrame>
  );
}

// One picture: zooming in when pointed at, its name, category and year
// rising over a shade from below.
function Tile({ work, onOpen }: { work: Work; onOpen?: () => void }) {
  return (
    <div
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Open ${work.title}` : undefined}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (onOpen && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpen();
        }
      }}
      className={`group/tile absolute inset-0 bg-foreground/[0.07] ${onOpen ? "cursor-zoom-in" : ""}`}
    >
      <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:scale-[1.06]">
        <FieldPicture field={`work${work.n}Image`} alt={work.title} className="absolute inset-0 block h-full w-full object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/0 to-foreground/0 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100" />
      <span className="pointer-events-none absolute right-[1.6cqw] top-[1.6cqw] grid size-9 scale-75 place-items-center rounded-full bg-card text-foreground opacity-0 transition-all duration-500 group-hover/tile:scale-100 group-hover/tile:opacity-100">
        <Plus aria-hidden="true" className="size-4" strokeWidth={1.5} />
      </span>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-4 flex-col gap-1 p-[1.8cqw] text-card opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
        <span className="text-[11px] uppercase tracking-[0.1em] opacity-75">{[work.category, work.year].filter(Boolean).join(" · ")}</span>
        <span className="font-display text-[length:clamp(1.1rem,1.6cqw,1.6rem)] font-bold leading-tight tracking-[-0.03em]">{work.title}</span>
      </div>
    </div>
  );
}

// A work full screen, on the text colour: the picture whole, its number,
// name, category and year, round arrows and a close button. The arrow keys go
// through the works, Esc closes it.
function Lightbox({ works, index, onIndex, onClose }: { works: Work[]; index: number; onIndex: (index: number) => void; onClose: () => void }) {
  const [direction, setDirection] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const work = works[index];
  const go = (by: number) => {
    setDirection(by);
    onIndex((index + by + works.length) % works.length);
  };

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // The hero's round buttons, light on the dark screen.
  const light =
    "grid size-[clamp(3rem,calc(1.952rem_+_4.301cqw),3.5rem)] cursor-pointer place-items-center rounded-full border border-solid border-card/25 bg-transparent text-card transition-colors duration-300 hover:border-card";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      data-lenis-prevent
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.8, ease: soft }}
      className="fixed inset-0 z-[60] flex flex-col bg-foreground text-card"
    >
      <div className="flex items-center justify-between px-5 py-4 @xl:px-[3.2cqw] @xl:py-[2.4cqw]">
        <span className="font-display text-sm font-bold">
          <span className="text-primary">{number(index)}</span>
          <span className="opacity-50"> / {String(works.length).padStart(2, "0")}</span>
        </span>
        <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className={light}>
          <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-5 @xl:px-[12cqw]">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={work.n}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.7, ease }}
            className="absolute inset-0 px-5 @xl:px-[12cqw]"
          >
            <FieldPicture field={`work${work.n}Image`} alt={work.title} className="block h-full w-full object-contain" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-end justify-between gap-6 px-5 py-5 @xl:px-[3.2cqw] @xl:py-[2.4cqw]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={work.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }} className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] opacity-60">{[work.category, work.year].filter(Boolean).join(" · ")}</span>
            <span className="font-display text-[length:clamp(1.4rem,2.4cqw,2.4rem)] font-bold leading-tight tracking-[-0.04em]">{work.title}</span>
          </motion.div>
        </AnimatePresence>
        <div className="flex shrink-0 gap-3">
          <button type="button" aria-label="Previous work" onClick={() => go(-1)} className={light}>
            <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
          <button type="button" aria-label="Next work" onClick={() => go(1)} className={light}>
            <ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
