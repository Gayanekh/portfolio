"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { FieldPicture } from "@/components/site-templates/core/blocks";
import { useField, useTemplate } from "@/components/site-templates/core/context";
import { Sweep } from "@/components/site-templates/sections/panel-kit";
import { FieldValue, Frame, gutter, In, Label, type, useScrollProgress, useStillAfterHydration, useWide } from "@/components/site-templates/sections/nocturne/kit";

const JOBS = [1, 2];
const SCHOOLS = [1, 2];

// Gayane's About: Nocturne's (the portrait sweeping open and drifting slower than the
// page, the statement whose words light up as it is read, the roles and the
// education), with the section's label moved from above the whole section to the top
// of the right-hand column, over the statement (the user asked), and the portrait in
// plain black and white, without Nocturne's accent tint. On wide screens the portrait
// is as tall as the column beside it, so no empty space is left under the text.

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
  const still = useStillAfterHydration();
  const words: { word: string; marked: boolean }[] = [];
  value.split("*").forEach((part, i) => part.split(/\s+/).filter(Boolean).forEach((word) => words.push({ word, marked: i % 2 === 1 })));
  return (
    <p ref={ref} className={`m-0 ${type.statement}`}>
      {editing ? node : still ? value.replace(/\*/g, "") : words.map(({ word, marked }, i) => <Word key={i} word={word} at={i} count={words.length} progress={progress} marked={marked} joined={/^[,.;:!?)]/.test(words[i + 1]?.word ?? "")} />)}
    </p>
  );
}

export default function About() {
  const { edit } = useTemplate();
  const ref = useRef<HTMLDivElement>(null);
  const wide = useWide(ref);
  const still = useStillAfterHydration();
  const progress = useScrollProgress(ref);
  const y = useTransform(progress, [0, 1], wide && !still && !edit ? ["-8%", "8%"] : ["0%", "0%"]);

  return (
    <Frame>
      <div ref={ref} className={`pb-16 pt-24 @xl:pb-20 @xl:pt-36 ${gutter}`}>
        <div className="grid grid-cols-1 gap-12 @xl:grid-cols-[0.8fr_1.2fr] @xl:gap-[7cqw]">
          {/* The photo keeps one rectangle, wide (5:4, as the user wanted), at every width, so its height follows its width smoothly (it used to stretch to the
              height of the text beside it, a thin tall strip at some widths); beside the text it stays in view as the text scrolls. */}
          <div className="flex flex-col gap-4 @xl:sticky @xl:top-28 @xl:self-start">
            <Sweep className="aspect-[5/4] rounded-[3px] bg-foreground/5">
              <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
                <FieldPicture field="image" alt="Portrait of Gayane Khachatryan" className="absolute inset-0 block h-full w-full object-cover grayscale contrast-[1.05] brightness-[0.85]" />
              </motion.div>
            </Sweep>
            <span className={type.label}>
              <FieldValue field="caption" />
            </span>
          </div>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-14 @xl:gap-20">
              <Label field="label" />
              <Statement />
            </div>
            <div className="grid grid-cols-1 gap-12 @xl:grid-cols-2 @xl:gap-[4cqw]">
              <div className="flex flex-col">
                <In>
                  <span className={`mb-4 block ${type.label}`}>
                    <FieldValue field="experienceLabel" />
                  </span>
                </In>
                {JOBS.map((n, i) => (
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
                {SCHOOLS.map((n, i) => (
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
