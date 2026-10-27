"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { FieldPicture } from "../../core/blocks";
import { useField, useTemplate } from "../../core/context";
import { Sweep } from "../panel-kit";
import { FieldValue, Frame, gutter, In, Label, type, useScrollProgress, useWide } from "./kit";

// About: a portrait in duotone (grey, warmed by the accent) sweeping open
// and drifting slower than the page, beside a statement in the serif whose
// words light up one after another as it is read (scrolling); *words* in
// italics, in the accent. Then the path: the roles, and the education.
//
// Its section's fields: `label`, `image`, `caption`, `statement`,
// `experienceLabel`, `job1Company`, `job1Role`, `job1Years`, `job1Text`...,
// `educationLabel`, `school1Title`, `school1Field`, `school1Place`...

// `joined`: no space after it (punctuation follows, as after *code*,).
function Word({ word, at, count, progress, marked, joined }: { word: string; at: number; count: number; progress: MotionValue<number>; marked: boolean; joined: boolean }) {
  const start = 0.18 + (at / count) * 0.42;
  const opacity = useTransform(progress, [start, start + 0.06], [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={marked ? "italic text-primary" : undefined}>
        {word}
      </motion.span>
      {!joined && " "}
    </>
  );
}

function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { value, editing, node } = useField("statement");
  const progress = useScrollProgress(ref);
  const still = useReducedMotion();
  const words: { word: string; marked: boolean }[] = [];
  value.split("*").forEach((part, i) => part.split(/\s+/).filter(Boolean).forEach((word) => words.push({ word, marked: i % 2 === 1 })));
  return (
    <p ref={ref} className={`m-0 ${type.statement}`}>
      {editing ? node : still ? value.replace(/\*/g, "") : words.map(({ word, marked }, i) => <Word key={i} word={word} at={i} count={words.length} progress={progress} marked={marked} joined={/^[,.;:!?)]/.test(words[i + 1]?.word ?? "")} />)}
    </p>
  );
}

export default function NocturnePath({ jobs, schools }: { jobs: number[]; schools: number[] }) {
  const { edit } = useTemplate();
  const ref = useRef<HTMLDivElement>(null);
  const wide = useWide(ref);
  const still = useReducedMotion();
  const progress = useScrollProgress(ref);
  const y = useTransform(progress, [0, 1], wide && !still && !edit ? ["-8%", "8%"] : ["0%", "0%"]);

  return (
    <Frame>
      <div ref={ref} className={`flex flex-col gap-20 py-24 @xl:gap-28 @xl:py-36 ${gutter}`}>
        <Label field="label" />
        <div className="grid grid-cols-1 gap-12 @xl:grid-cols-[0.8fr_1.2fr] @xl:gap-[7cqw]">
          <div className="flex flex-col gap-4">
            <Sweep className="aspect-[4/5] rounded-[3px] bg-foreground/5">
              <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
                <FieldPicture field="image" className="absolute inset-0 block h-full w-full object-cover grayscale contrast-[1.05] brightness-[0.85]" />
                <div aria-hidden="true" className="absolute inset-0 bg-primary/25 mix-blend-color" />
              </motion.div>
            </Sweep>
            <span className={type.label}>
              <FieldValue field="caption" />
            </span>
          </div>
          <div className="flex flex-col justify-center gap-16">
            <Statement />
            <div className="grid grid-cols-1 gap-12 @xl:grid-cols-2 @xl:gap-[4cqw]">
              <div className="flex flex-col">
                <In>
                  <span className={`mb-4 block ${type.label}`}>
                    <FieldValue field="experienceLabel" />
                  </span>
                </In>
                {jobs.map((n, i) => (
                  <In key={n} delay={i * 0.1} y={12} className="group/job flex flex-col gap-2 border-0 border-t border-solid border-border py-5">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-[22px] transition-colors duration-300 group-hover/job:text-primary">
                        <FieldValue field={`job${n}Company`} />
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        <FieldValue field={`job${n}Years`} />
                      </span>
                    </span>
                    <span className="text-[14px] font-medium">
                      <FieldValue field={`job${n}Role`} />
                    </span>
                    <span className={type.muted}>
                      <FieldValue field={`job${n}Text`} />
                    </span>
                  </In>
                ))}
              </div>
              <div className="flex flex-col">
                <In>
                  <span className={`mb-4 block ${type.label}`}>
                    <FieldValue field="educationLabel" />
                  </span>
                </In>
                {schools.map((n, i) => (
                  <In key={n} delay={i * 0.1} y={12} className="flex flex-col gap-1.5 border-0 border-t border-solid border-border py-5">
                    <span className="text-[14px] font-medium">
                      <FieldValue field={`school${n}Title`} />
                    </span>
                    <span className="font-display text-[18px] italic leading-snug">
                      <FieldValue field={`school${n}Field`} />
                    </span>
                    <span className={type.muted}>
                      <FieldValue field={`school${n}Place`} />
                    </span>
                  </In>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
