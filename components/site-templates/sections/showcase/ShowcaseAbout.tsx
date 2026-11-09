"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { useStillAfterHydration } from "../../core/motion";
import { useField, useTemplate } from "../../core/context";
import { useScrollProgress } from "../../core/viewport";
import { Aside, FieldValue, Frame, gutter, Label, Rise, space, Title, type, Window } from "./kit";

// About, the page's one dark section: the portrait in a window on the left
// (staying in view on wide screens) and on the right a statement with a
// highlighted phrase, a short story, a few facts in brackets, the experience
// as a timeline whose line draws itself down in sun-yellow as the page
// scrolls, and the clients.
//
// Its section's fields: `label`, `name`, `portrait`, `caption`, `title`,
// `text`, `fact1`..., `experienceLabel`, `experienceSpan`, for each job
// (`job1`...): Role, Company and Years; `clientsLabel` and `clients`.

export default function ShowcaseAbout({ facts, jobs }: { facts: number[]; jobs: number[] }) {
  const name = useField("name").value;
  return (
    <Frame tone="ink">
      <div className={`grid gap-14 @3xl:grid-cols-[0.8fr_1.2fr] @3xl:gap-[6cqw] ${space} ${gutter}`}>
        <div>
          <div className="flex flex-col gap-4 @3xl:sticky @3xl:top-[14svh]">
            <Window field="portrait" alt={`Portrait of ${name}`} className="aspect-[4/5]" />
            <Aside field="caption" />
          </div>
        </div>

        <div className="flex flex-col gap-12 @xl:gap-[4cqw]">
          <Label field="label" />
          <Title field="title" className={type.statement} />
          <Rise className="flex flex-col gap-8">
            <p className={`m-0 max-w-[36rem] ${type.body}`}>
              <FieldValue field="text" />
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
              {facts.map((n) => (
                <li key={n}>
                  <Aside field={`fact${n}`} className="text-foreground" />
                </li>
              ))}
            </ul>
          </Rise>
          <Timeline jobs={jobs} />
          <Rise className="flex flex-col gap-3 border-0 border-t border-solid border-border pt-6">
            <span className={`text-muted-foreground ${type.label}`}>
              <FieldValue field="clientsLabel" />
            </span>
            <p className="m-0 font-display text-[length:clamp(1.15rem,1.7cqw,1.6rem)] font-medium leading-snug tracking-[-0.02em]">
              <FieldValue field="clients" />
            </p>
          </Rise>
        </div>
      </div>
    </Frame>
  );
}

// The jobs, newest first, along a line drawing itself down with the scroll.
function Timeline({ jobs }: { jobs: number[] }) {
  const { edit } = useTemplate();
  const still = useStillAfterHydration();
  const ref = useRef<HTMLOListElement>(null);
  const progress = useScrollProgress(ref);
  const drawn = useTransform(progress, [0.2, 0.65], [0, 1]);
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex items-center justify-between gap-4 border-0 border-b border-solid border-border pb-4 ${type.label}`}>
        <h3 className="m-0 font-normal">
          <FieldValue field="experienceLabel" />
        </h3>
        <Aside field="experienceSpan" />
      </div>
      <ol ref={ref} className="relative m-0 list-none p-0 pl-6">
        <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-border" />
        {/* Driven by the scroll: it changes on every frame. */}
        <motion.span aria-hidden="true" style={edit || still ? undefined : { scaleY: drawn }} className="absolute bottom-0 left-0 top-0 w-px origin-top bg-[var(--sun)]" />
        {jobs.map((n, i) => (
          <li key={n}>
            <Rise
              delay={i * 0.08}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-0 border-b border-solid border-border py-5 transition-transform duration-500 hover:translate-x-2 @xl:grid-cols-[8rem_1fr_auto]"
            >
              <span className={`${type.aside} col-span-2 @xl:col-span-1`}>
                <FieldValue field={`job${n}Years`} />
              </span>
              <span className="font-display text-[length:clamp(1.2rem,1.8cqw,1.75rem)] font-semibold tracking-[-0.03em]">
                <FieldValue field={`job${n}Role`} />
              </span>
              <span className="text-[14px] text-muted-foreground">
                <FieldValue field={`job${n}Company`} />
              </span>
            </Rise>
          </li>
        ))}
      </ol>
    </div>
  );
}
