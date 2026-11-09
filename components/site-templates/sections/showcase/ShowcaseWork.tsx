"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStillAfterHydration } from "../../core/motion";
import { ArrowUpRight } from "lucide-react";
import { FieldPicture } from "../../core/blocks";
import { useField, useTemplate } from "../../core/context";
import { scrollParent, viewOf } from "../../core/scroll";
import { useWide } from "../../core/viewport";
import { RollingNumber } from "../panel-kit";
import { Aside, CropMarks, ease, FieldValue, Frame, gutter, Label, Roll, space, Title, type, Window } from "./kit";

// Selected work as a viewfinder and an index. On wide screens the projects
// are a list of large names on the right, and on the left a sticky
// viewfinder (crop marks in its corners) shows the project in focus: the one
// pointed at, or while scrolling the one nearest the middle of the view.
// Changing project is a shutter: the new picture rises from below as the old
// one closes over the top, along the same line. A counter rolls under it.
// While editing, on phones and narrow windows, each project is a card with
// its own picture.
//
// Its section's fields: `label`, `title`, `text`, `count`, and for each
// project (`project1`...): Title, Meta, Image and Url.

const pad = (n: number) => String(n).padStart(2, "0");

// The shutter: shown, closed over the top, closed under the bottom.
const SHOWN = "inset(0% 0% 0% 0%)";
const ABOVE = "inset(0% 0% 100% 0%)";
const BELOW = "inset(100% 0% 0% 0%)";

export default function ShowcaseWork({ projects }: { projects: number[] }) {
  const { edit } = useTemplate();
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const viewfinder = useWide(ref, 900) && !edit;
  const [active, setActive] = useState(0);
  const pointing = useRef(false);

  // While scrolling (and not pointing at a row), the row nearest the middle.
  useEffect(() => {
    const list = listRef.current;
    if (!viewfinder || !list) return;
    const parent = scrollParent(list);
    const scroller: HTMLElement | Window = parent ?? window;
    const update = () => {
      if (pointing.current) return;
      const view = viewOf(parent);
      const middle = view.top + view.height / 2;
      let nearest = 0;
      let distance = Infinity;
      Array.from(list.children).forEach((row, i) => {
        const box = row.getBoundingClientRect();
        const away = Math.abs(box.top + box.height / 2 - middle);
        if (away < distance) [nearest, distance] = [i, away];
      });
      setActive(nearest);
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => scroller.removeEventListener("scroll", update);
  }, [viewfinder]);

  return (
    <Frame>
      <div ref={ref} className={`${space} ${gutter}`}>
        <div className="grid gap-8 border-0 border-b border-solid border-border pb-10 @3xl:grid-cols-[1.4fr_1fr] @3xl:items-end">
          <div className="flex flex-col gap-6">
            <Label field="label" />
            <Title field="title" />
          </div>
          <div className="flex flex-col gap-4 @3xl:items-end @3xl:text-right">
            <p className={`m-0 max-w-[24rem] ${type.body}`}>
              <FieldValue field="text" />
            </p>
            <Aside field="count" />
          </div>
        </div>

        {viewfinder ? (
          <div className="grid grid-cols-[0.85fr_1.15fr] gap-[5cqw] pt-[4cqw]">
            <div>
              <div className="sticky top-[14svh] flex flex-col gap-4">
                <Viewfinder projects={projects} active={active} />
                <div className={`flex items-center justify-between ${type.label}`}>
                  <span className="flex items-center gap-1 tabular-nums">
                    <RollingNumber value={pad(active + 1)} className="inline-block" />
                    <span className="text-muted-foreground">/ {pad(projects.length)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    <FieldValue field={`project${projects[active]}Meta`} />
                  </span>
                </div>
              </div>
            </div>
            <ol
              ref={listRef}
              onPointerLeave={() => (pointing.current = false)}
              className="m-0 flex list-none flex-col p-0 py-[16svh]"
            >
              {projects.map((n, i) => (
                <Row
                  key={n}
                  n={n}
                  index={i}
                  active={active === i}
                  onPoint={() => {
                    pointing.current = true;
                    setActive(i);
                  }}
                />
              ))}
            </ol>
          </div>
        ) : (
          <ol className="m-0 grid list-none gap-x-[3cqw] gap-y-14 p-0 pt-12 @3xl:grid-cols-2">
            {projects.map((n, i) => (
              <Card key={n} n={n} index={i} />
            ))}
          </ol>
        )}
      </div>
    </Frame>
  );
}

// The pictures of every project stacked, the one in focus shown.
function Viewfinder({ projects, active }: { projects: number[]; active: number }) {
  const still = useStillAfterHydration();
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-foreground/10">
      {projects.map((n, i) => (
        <Shot key={n} n={n} shown={i === active} still={Boolean(still)} />
      ))}
      <CropMarks />
    </div>
  );
}

function Shot({ n, shown, still }: { n: number; shown: boolean; still: boolean }) {
  const title = useField(`project${n}Title`).value;
  const duration = still ? 0 : 0.9;
  return (
    <motion.div
      initial={false}
      animate={{ clipPath: shown ? [BELOW, SHOWN] : ABOVE }}
      transition={{ duration, ease }}
      className="absolute inset-0"
    >
      <motion.div initial={false} animate={{ scale: shown ? 1 : 1.12 }} transition={{ duration: still ? 0 : 1.4, ease }} className="absolute inset-0">
        <FieldPicture field={`project${n}Image`} alt={title} className="absolute inset-0 block h-full w-full object-cover" />
      </motion.div>
    </motion.div>
  );
}

// A project in the index: its number, its name rolling while pointed at, and
// what it is; faint until in focus.
function Row({ n, index, active, onPoint }: { n: number; index: number; active: boolean; onPoint: () => void }) {
  const url = useField(`project${n}Url`).value;
  return (
    <li onPointerEnter={onPoint} className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-30"}`}>
      <a
        href={url || undefined}
        target="_blank"
        rel="noreferrer"
        onFocus={onPoint}
        className="group/roll grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-0 border-b border-solid border-border py-[2.2cqw] text-foreground no-underline"
      >
        <span className={type.aside}>({pad(index + 1)})</span>
        <h3 className={`m-0 ${type.name}`}>
          <Roll>
            <FieldValue field={`project${n}Title`} />
          </Roll>
        </h3>
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className={`size-7 transition-[transform,color] duration-500 ${active ? "translate-x-0 text-primary" : "-translate-x-2 text-foreground"} group-hover/roll:-translate-y-1 group-hover/roll:translate-x-1`}
        />
      </a>
    </li>
  );
}

// A project as a card: its picture in a window, its number, name and what it is.
function Card({ n, index }: { n: number; index: number }) {
  const { edit } = useTemplate();
  const url = useField(`project${n}Url`).value;
  const title = useField(`project${n}Title`).value;
  return (
    <li>
      <article className="group/roll relative flex flex-col gap-5">
        <Window field={`project${n}Image`} alt={title} className="aspect-[4/5] @3xl:aspect-[5/6]">
          <CropMarks />
        </Window>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className={type.aside}>
              ({pad(index + 1)}) <FieldValue field={`project${n}Meta`} />
            </span>
            <h3 className={`m-0 ${type.name}`}>
              <a href={edit ? undefined : url || undefined} target="_blank" rel="noreferrer" className={`text-foreground no-underline ${edit ? "" : "after:absolute after:inset-0"}`}>
                <Roll>
                  <FieldValue field={`project${n}Title`} />
                </Roll>
              </a>
            </h3>
          </div>
          <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="mt-6 size-6 shrink-0 transition-transform duration-500 group-hover/roll:-translate-y-1 group-hover/roll:translate-x-1" />
        </div>
      </article>
    </li>
  );
}
