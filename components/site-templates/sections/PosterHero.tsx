"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowButton, Reveal } from "../core/blocks";
import { useField, useSectionId, useTemplate } from "../core/context";

// A fashion-poster opening screen:
//
//   [ LABEL ]                                       ≡
//   tag                    ┌──────────┐   V
//   tag                    │  photo   │   E
//   10+  years             │  (b/w)   │   R
//                        ┌─┼──────────┼──────────────── (accent band,
//   LENA                 │ │  tinted  │                  to the screen
//   MARLOW.              ■─┼──────────┼────────────────  edge)
//   tagline              └──────────┘
//   [ Discover more ]
//
// On the left, a small accent label (the first tag) over the other tags
// and a figure (such as years of experience), then the name, huge, a word
// to a line, the tagline and a button. On the right a black-and-white
// portrait standing on the bottom edge, crossed by a wide accent band that
// tints it where they meet (multiply) and runs out to the screen's edge,
// with a small black square at its corner, and a note set vertically.
// On phones it all follows one another, the portrait after the name.
//
// It comes in once: the portrait rises into its frame, the band sweeps in
// from the edge, then the square, while the text rises on the left.
// Reduced motion shows it all at once.
//
// Its section's fields: name, tagline, portrait, tag1..., statValue,
// statLabel, sideNote and more (the button).

const ease = [0.22, 1, 0.36, 1] as const;
const soft = [0.65, 0, 0.35, 1] as const;

// The screen, with the margins of a `rail` Section (room on the right for a
// SideRail); its content in two columns from the desktop layout up, never
// wider than 1600px, so it lines up with the sections below it. The band
// runs on past both, under the rail, to the screen's edge.
const screen =
  "relative overflow-hidden px-5 pb-16 pt-20 @xl:h-[100svh] @xl:min-h-[38rem] @xl:pb-0 @xl:pl-[9cqw] @xl:pr-[max(9cqw,7.5rem)] @xl:pt-0";
const content = "mx-auto w-full max-w-[1600px] @xl:grid @xl:h-full @xl:grid-cols-[36fr_46fr]";

function FieldValue({ field }: { field: string }) {
  return <>{useField(field).node}</>;
}

// Comes in once it is in view, after `delay` seconds.
function Enter({ delay, from, className, children }: { delay: number; from: Record<string, number | string>; className?: string; children?: ReactNode }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? false : from}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: soft, delay }}
    >
      {children}
    </motion.div>
  );
}

// The name, a word to a line, ending in a full stop. While editing it is one
// editable line.
function Name() {
  const { value, editing, node } = useField("name");
  const words = value.trim().split(/\s+/).filter(Boolean);
  const heading = "m-0 font-display text-[length:clamp(3.25rem,7.4cqw,8.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em]";
  if (editing) return <h1 className={heading}>{node}</h1>;
  return (
    <h1 className={heading} aria-label={value}>
      {words.map((word, i) => (
        <Reveal key={i} effect="mask" delay={0.3 + i * 0.12}>
          <span aria-hidden="true" className="block">
            {word}
            {i === words.length - 1 && "."}
          </span>
        </Reveal>
      ))}
    </h1>
  );
}

// A tag in small capitals; an empty one is left out (but stays while editing).
function SmallTag({ field }: { field: string }) {
  const { value, editing, node } = useField(field);
  if (!value && !editing) return null;
  return <li>{node}</li>;
}

export default function PosterHero({ tags, moreTarget }: { tags: number[]; moreTarget: string }) {
  const id = useSectionId();
  const { navigate } = useTemplate();
  const name = useField("name").value;
  const portrait = useField("portrait").value;
  const still = useReducedMotion();
  const [first, ...rest] = tags;

  return (
    <section data-section={id} className={screen}>
      <div className={content}>
        {/* Left: the label, the tags and the figure; then the name, the tagline and the button */}
        <div className="relative z-10 flex flex-col gap-10 @xl:justify-between @xl:py-[7svh]">
          <div className="flex flex-col gap-7">
            <Enter delay={0.1} from={{ clipPath: "inset(0% 100% 0% 0%)" }}>
              <div className="w-[clamp(7rem,9cqw,9.5rem)] bg-primary px-2 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-card">
                <FieldValue field={`tag${first}`} />
              </div>
            </Enter>
            <Reveal delay={0.25}>
              <ul className="m-0 list-none p-0 text-[11px] font-medium uppercase leading-[1.5] tracking-[0.06em]">
                {rest.map((n) => (
                  <SmallTag key={n} field={`tag${n}`} />
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col gap-2">
                <span className="font-display text-[length:clamp(2rem,2.8cqw,2.75rem)] font-medium leading-none tracking-[-0.03em]">
                  <FieldValue field="statValue" />
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.08em]">
                  <FieldValue field="statLabel" />
                </span>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            <Name />
            <Reveal delay={0.6}>
              <div className="max-w-[24rem] text-[length:clamp(1.05rem,1.35cqw,1.35rem)] font-medium leading-snug tracking-[-0.01em]">
                <FieldValue field="tagline" />
              </div>
            </Reveal>
            <Reveal delay={0.8}>
              <ArrowButton field="more" onClick={() => navigate(moreTarget)} />
            </Reveal>
          </div>
        </div>

        {/* Right: the portrait on the bottom edge, the band across it, the note */}
        <div className="relative mt-12 aspect-[4/5] @xl:mt-0 @xl:aspect-auto">
          <Enter
            delay={0}
            from={{ clipPath: "inset(100% 0% 0% 0%)" }}
            className="absolute inset-y-0 left-[6%] right-[6%] overflow-hidden bg-foreground/[0.06] @xl:inset-y-auto @xl:bottom-0 @xl:left-[10%] @xl:right-auto @xl:h-[82svh] @xl:max-h-[calc(100%-2rem)] @xl:aspect-[4/5]"
          >
            {portrait && (
              <motion.img
                src={portrait}
                alt={`Portrait of ${name}`}
                decoding="async"
                initial={still ? false : { scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease }}
                className="block h-full w-full object-cover object-[50%_12%] contrast-[1.05] grayscale"
              />
            )}
          </Enter>

          {/* The band: over the portrait it tints it, past it a solid stripe */}
          <Enter
            delay={0.6}
            from={{ scaleX: 0 }}
            className="absolute -right-5 left-0 top-[52%] h-[30%] origin-right bg-primary mix-blend-multiply @xl:-right-[calc(max(9cqw,7.5rem)+max(0px,(100cqw-9cqw-max(9cqw,7.5rem)-1600px)/2))] @xl:top-[46%] @xl:h-[34%]"
          >
            <Enter delay={1.5} from={{ scale: 0 }} className="absolute bottom-0 left-0 size-[clamp(1.5rem,2.4cqw,2.5rem)] bg-foreground" />
          </Enter>

          <Enter
            delay={1.2}
            from={{ opacity: 0, y: -16 }}
            className="absolute right-0 top-[4%] hidden [writing-mode:vertical-rl] @xl:block @xl:top-[13svh]"
          >
            <div className="max-h-[40svh] text-[length:clamp(1rem,1.5cqw,1.5rem)] uppercase leading-[1.05] tracking-[0.02em] text-muted-foreground">
              <FieldValue field="sideNote" />
            </div>
          </Enter>
        </div>
      </div>
    </section>
  );
}
