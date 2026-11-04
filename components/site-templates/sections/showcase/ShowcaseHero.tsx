"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { FieldPicture } from "../../core/blocks";
import { useField, useTemplate } from "../../core/context";
import { useScrollProgress } from "../../core/viewport";
import { Aside, Dot, FieldValue, Frame, gutter, Letters, Rise, Title, type } from "./kit";

// The Showcase hero: the name very large, its letters rising one by one, in
// two interlocking lines; the statement with its highlighted phrase sits
// beside the first name, the numbered disciplines and a short introduction
// beside the last (one under another on narrow pages). Under it the featured
// picture sits framed in a window that opens to the full width as the page
// scrolls, the picture settling as it does, a caption in its corner.
//
// Its section's fields: `eyebrow`, `status`, `first`, `last`, `role1`...,
// `title`, `text`, `scroll`, `image` and `caption`.

export default function ShowcaseHero({ roles }: { roles: number[] }) {
  const { edit } = useTemplate();
  const still = useReducedMotion();
  const first = useField("first").value;
  const last = useField("last").value;
  const windowRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(windowRef);
  const live = !edit && !still;
  const clipPath = useTransform(progress, [0.12, 0.5], ["inset(0% 7% 0% 7% round 4px)", "inset(0% 0% 0% 0% round 0px)"]);
  const scale = useTransform(progress, [0.12, 0.9], [1.16, 1]);

  return (
    <Frame>
      <div className={`flex flex-col gap-10 pt-28 @xl:gap-[3.5cqw] @xl:pt-[9cqw] ${gutter}`}>
        <Rise className="flex flex-wrap items-center justify-between gap-3 border-0 border-b border-solid border-border pb-4">
          <Aside field="eyebrow" />
          <span className={`flex items-center gap-2 text-muted-foreground @xl:hidden ${type.label}`}>
            <Dot />
            <FieldValue field="status" />
          </span>
        </Rise>

        {/* The name as two interlocking lines: the first name left with the
            statement in the space beside it, the last name right with the
            disciplines and the introduction in the space it leaves. */}
        <div className="relative flex flex-col gap-10">
          <h1
            aria-label={`${first} ${last}`}
            className="m-0 flex flex-col font-display text-[length:25cqw] font-semibold leading-[0.8] tracking-[-0.07em] @4xl:text-[length:19cqw]"
          >
            <Letters field="first" className="block" />
            <Letters field="last" delay={0.25} className="block @4xl:self-end" />
          </h1>

          <div className="@4xl:absolute @4xl:right-0 @4xl:top-0 @4xl:flex @4xl:h-1/2 @4xl:w-[44%] @4xl:items-end @4xl:pb-[1.2cqw]">
            <Title field="title" as="p" delay={0.5} className={type.lead} />
          </div>

          <div className="grid gap-8 @xl:grid-cols-[auto_1fr] @xl:gap-[3cqw] @4xl:absolute @4xl:bottom-0 @4xl:left-0 @4xl:h-1/2 @4xl:w-[54%] @4xl:items-end @4xl:pb-[1.2cqw]">
            <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
              {roles.map((n, i) => (
                <li key={n}>
                  <Rise delay={0.6 + i * 0.1} className={`flex gap-3 ${type.aside}`}>
                    <span className="text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-foreground">
                      <FieldValue field={`role${n}`} />
                    </span>
                  </Rise>
                </li>
              ))}
            </ol>
            <Rise delay={0.8} className="flex flex-col gap-6">
              <p className={`m-0 max-w-[26rem] ${type.body}`}>
                <FieldValue field="text" />
              </p>
              <span className={`flex items-center gap-3 text-muted-foreground ${type.label}`}>
                <motion.span
                  aria-hidden="true"
                  animate={live ? { scaleY: [0, 1, 0], originY: [0, 0, 1] } : undefined}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="block h-6 w-px bg-foreground"
                />
                <FieldValue field="scroll" />
              </span>
            </Rise>
          </div>
        </div>
      </div>

      <div ref={windowRef} className="pt-[6cqw]">
        {/* Driven by the scroll: these change on every frame. */}
        <motion.div style={live ? { clipPath } : undefined} className="relative h-[68svh] overflow-hidden @xl:h-[94svh]">
          <motion.div style={live ? { scale } : undefined} className="absolute inset-0">
            <FieldPicture field="image" alt={`${first} ${last}`} priority className="absolute inset-0 block h-full w-full object-cover" />
          </motion.div>
          <div className={`absolute bottom-0 left-0 py-6 font-mono text-[12px] text-white ${edit ? "" : "pointer-events-none"} ${gutter}`}>
            (<FieldValue field="caption" />)
          </div>
        </motion.div>
      </div>
    </Frame>
  );
}
