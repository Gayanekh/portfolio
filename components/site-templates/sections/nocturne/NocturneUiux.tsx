"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { DashboardMock, PhoneMock, SystemMock } from "./mocks";
import { FieldValue, Frame, gutter, In, Label, soft, SplitTitle, Tilt, type } from "./kit";

// UI/UX design: the title and a few words, the process in four steps (a line
// filling across them once in view), then the case studies, one per row,
// alternating sides: an interface drawn in code (a phone booking flow, a
// dashboard, a design-system sheet) that tilts towards the pointer, and its
// name, role, story and three figures.
//
// Its section's fields: `label`, `title`, `intro`, `step1Title`,
// `step1Text`..., and for each case (`case1`...): Title, Meta, Text,
// Stat1Value, Stat1Label... and, for the phone, `case1Image` (a face).

const MOCKS = [() => <PhoneMock imageField="case1Image" />, DashboardMock, SystemMock];

export default function NocturneUiux({ steps, cases, stats }: { steps: number[]; cases: number[]; stats: number[] }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const seen = useInView(lineRef, { once: true, margin: "0px 0px -15% 0px" });
  const still = useReducedMotion();

  return (
    <Frame>
      <div className={`flex flex-col gap-20 py-24 @xl:gap-32 @xl:py-36 ${gutter}`}>
        {/* The introduction and the process */}
        <div className="grid grid-cols-1 gap-12 @xl:grid-cols-[1.15fr_1fr] @xl:gap-[6cqw]">
          <div className="flex flex-col gap-8">
            <Label field="label" />
            <SplitTitle field="title" />
          </div>
          <div className="flex flex-col justify-end gap-10">
            <In>
              <p className={`m-0 max-w-[30rem] ${type.body}`}>
                <FieldValue field="intro" />
              </p>
            </In>
            <div ref={lineRef} className="relative grid grid-cols-2 gap-6 pt-6 @xl:grid-cols-4">
              <span className="absolute inset-x-0 top-0 h-px bg-border" />
              <motion.span
                initial={still ? false : { scaleX: 0 }}
                animate={{ scaleX: seen || still ? 1 : 0 }}
                transition={{ duration: 1.8, ease: soft }}
                className="absolute inset-x-0 top-0 h-px origin-left bg-primary"
              />
              {steps.map((n, i) => (
                <In key={n} delay={0.2 + i * 0.12} y={12} className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] text-primary">0{i + 1}</span>
                  <span className="text-[14px] font-medium">
                    <FieldValue field={`step${n}Title`} />
                  </span>
                  <span className="text-[12px] leading-snug text-muted-foreground">
                    <FieldValue field={`step${n}Text`} />
                  </span>
                </In>
              ))}
            </div>
          </div>
        </div>

        {/* The case studies */}
        {cases.map((n, i) => {
          const Mock = MOCKS[i % MOCKS.length];
          const flip = i % 2 === 1;
          return (
            <div key={n} className="grid grid-cols-1 items-center gap-10 @xl:grid-cols-[1.35fr_1fr] @xl:gap-[6cqw]">
              <In className={flip ? "@xl:order-2" : undefined}>
                <div className="relative rounded-[4px] border border-solid border-border bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_60%)] p-[clamp(1.25rem,3.5cqw,3.5rem)]">
                  <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Fig. 0{i + 1}
                  </span>
                  <Tilt max={5}>
                    <Mock />
                  </Tilt>
                </div>
              </In>
              <div className="flex flex-col gap-6">
                <In>
                  <span className={type.label}>
                    <FieldValue field={`case${n}Meta`} />
                  </span>
                </In>
                <SplitTitle field={`case${n}Title`} as="h3" className={type.statement} />
                <In delay={0.15}>
                  <p className={`m-0 max-w-[28rem] ${type.body}`}>
                    <FieldValue field={`case${n}Text`} />
                  </p>
                </In>
                <div className="grid grid-cols-3 gap-4 border-0 border-t border-solid border-border pt-6">
                  {stats.map((s, j) => (
                    <In key={s} delay={0.25 + j * 0.08} y={10} className="flex flex-col gap-1">
                      <span className="font-display text-[length:clamp(1.6rem,2.6cqw,2.5rem)] font-light leading-none">
                        <FieldValue field={`case${n}Stat${s}Value`} />
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        <FieldValue field={`case${n}Stat${s}Label`} />
                      </span>
                    </In>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}
