"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useField, useTemplate } from "../../core/context";
import { ease, FieldValue, Frame, gutter, Label, space, Title, type } from "./kit";

// Kind words from clients. On the left the people as tabs, each with a
// square monogram of their initials; on the right the chosen quote, very
// large, changing on its own every few seconds (a line under the tab fills
// meanwhile) and holding still while pointed at. While editing every quote
// is shown, one under another.
//
// Its section's fields: `label`, `title`, and for each voice (`voice1`...):
// Quote, Name and Role.

const HOLD = 7000;

export default function ShowcaseVoices({ voices }: { voices: number[] }) {
  const { edit } = useTemplate();
  const still = useReducedMotion();
  const [at, setAt] = useState(0);
  const paused = useRef(false);
  const elapsed = useMotionValue(0);
  const filled = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (edit || still || paused.current) return;
    const next = elapsed.get() + delta;
    if (next >= HOLD) {
      elapsed.set(0);
      setAt((current) => (current + 1) % voices.length);
    } else elapsed.set(next);
    filled.set(elapsed.get() / HOLD);
  });

  const choose = (i: number) => {
    elapsed.set(0);
    filled.set(0);
    setAt(i);
  };

  return (
    <Frame>
      <div className={`grid gap-14 @3xl:grid-cols-[0.75fr_1.25fr] @3xl:gap-[6cqw] ${space} ${gutter}`}>
        <div className="flex flex-col justify-between gap-12">
          <div className="flex flex-col gap-6">
            <Label field="label" />
            <Title field="title" className={type.statement} />
          </div>
          {!edit && (
            <ul role="tablist" className="m-0 flex list-none flex-col p-0">
              {voices.map((n, i) => (
                <li key={n}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={at === i}
                    onClick={() => choose(i)}
                    className={`relative flex w-full cursor-pointer items-center gap-4 border-0 border-b border-solid border-border bg-transparent py-4 text-left text-foreground transition-opacity duration-500 ${at === i ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
                  >
                    <Monogram n={n} />
                    <span className="flex flex-col">
                      <span className="text-[15px] font-medium">
                        <FieldValue field={`voice${n}Name`} />
                      </span>
                      <span className={type.aside}>
                        <FieldValue field={`voice${n}Role`} />
                      </span>
                    </span>
                    {/* Driven by the clock: it changes on every frame. */}
                    {at === i && <motion.span aria-hidden="true" style={{ scaleX: filled }} className="absolute -bottom-px left-0 h-px w-full origin-left bg-primary" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {edit ? (
          <div className="flex flex-col gap-14">
            {voices.map((n) => (
              <Voice key={n} n={n} />
            ))}
          </div>
        ) : (
          <div onPointerEnter={() => (paused.current = true)} onPointerLeave={() => (paused.current = false)} className="grid min-h-[22rem] items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={at}
                initial={still ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={still ? undefined : { opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease }}
              >
                <Voice n={voices[at]} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </Frame>
  );
}

function Voice({ n }: { n: number }) {
  return (
    <figure className="m-0 flex flex-col gap-8">
      <span aria-hidden="true" className="font-display text-[5rem] font-semibold leading-[0.5] text-primary">
        “
      </span>
      <blockquote className="m-0 font-display text-[length:clamp(1.6rem,3.4cqw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em]">
        <FieldValue field={`voice${n}Quote`} />
      </blockquote>
      <figcaption className={type.aside}>
        (<FieldValue field={`voice${n}Name`} />, <FieldValue field={`voice${n}Role`} />)
      </figcaption>
    </figure>
  );
}

// A person's initials on a sun-yellow square.
function Monogram({ n }: { n: number }) {
  const name = useField(`voice${n}Name`).value;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-[4px] bg-[var(--sun)] font-mono text-[13px] font-medium text-[color:var(--ink)]">
      {initials}
    </span>
  );
}
