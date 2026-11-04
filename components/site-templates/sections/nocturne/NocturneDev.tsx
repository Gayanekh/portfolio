"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, LoaderCircle } from "lucide-react";
import { ease, FieldValue, Frame, gutter, In, Label, SplitTitle, type } from "./kit";

// Development: the title, a few words and the principles; beside them a code
// editor that types a component out line by line once in view (its words in
// the theme's colours), and under it the live preview of that component, a
// button going through its states (ready, loading, done) on its own. Then the
// stack as tiles that light up when pointed at.
//
// Its section's fields: `label`, `title`, `intro`, `file`, `previewLabel`,
// `principle1Title`, `principle1Text`..., `stackLabel`, `stack1`...

// The code shown: each line as [kind, text] pieces.
type Kind = "k" | "f" | "s" | "c" | "p" | "t";
const CODE: [Kind, string][][] = [
  [["c", "// One button, every state: designed in Figma, shipped in code."]],
  [["k", "export function "], ["f", "Button"], ["p", "({ state, children }: "], ["t", "Props"], ["p", ") {"]],
  [["k", "  const "], ["p", "busy = state === "], ["s", '"loading"'], ["p", ";"]],
  [["k", "  return "], ["p", "("]],
  [["p", "    <"], ["f", "button"], ["p", " aria-busy={busy} disabled={busy}"]],
  [["p", "      className="], ["s", '"rounded-md bg-primary px-5 py-3"'], ["p", ">"]],
  [["p", "      {busy ? <"], ["f", "Spinner"], ["p", " /> : state === "], ["s", '"done"'], ["p", " ? <"], ["f", "Check"], ["p", " /> : null}"]],
  [["p", "      {children}"]],
  [["p", "    </"], ["f", "button"], ["p", ">"]],
  [["p", "  );"]],
  [["p", "}"]],
];
const COLOR: Record<Kind, string> = {
  k: "text-primary",
  f: "text-foreground",
  s: "text-foreground/60 italic",
  c: "text-muted-foreground italic",
  p: "text-foreground/75",
  t: "text-primary/80",
};

const STATES = ["idle", "loading", "done"] as const;

function Editor() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const still = useReducedMotion();
  const [state, setState] = useState(0);
  useEffect(() => {
    if (still) return;
    const timer = window.setInterval(() => setState((s) => (s + 1) % STATES.length), 1700);
    return () => window.clearInterval(timer);
  }, [still]);
  const now = STATES[state];

  return (
    <div ref={ref} className="overflow-hidden rounded-[6px] border border-solid border-border bg-[color-mix(in_srgb,var(--card),var(--foreground)_4%)] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
      <div className="flex items-center gap-2 border-0 border-b border-solid border-border px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-2.5 rounded-full bg-foreground/15" />
        ))}
        <span className="ml-3 rounded-t-md border-0 border-b-2 border-solid border-primary px-2 font-mono text-[11px] text-foreground">
          <FieldValue field="file" />
        </span>
      </div>
      <pre className="m-0 overflow-x-auto px-0 py-4 font-mono text-[clamp(10.5px,0.95cqw,13px)] leading-[1.75]">
        {CODE.map((line, i) => (
          <motion.div
            key={i}
            initial={still ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: seen || still ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 + i * 0.16 }}
            className="flex"
          >
            <span className="w-10 shrink-0 select-none pr-4 text-right text-foreground/25">{i + 1}</span>
            <code className="whitespace-pre">
              {line.map(([kind, text], j) => (
                <span key={j} className={COLOR[kind]}>
                  {text}
                </span>
              ))}
              {i === CODE.length - 1 && <motion.span animate={still ? undefined : { opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] bg-primary" />}
            </code>
          </motion.div>
        ))}
      </pre>
      {/* The live preview */}
      <div className="flex items-center justify-between gap-6 border-0 border-t border-solid border-border px-5 py-5">
        <span className={type.label}>
          <FieldValue field="previewLabel" /> · <span className="text-foreground">state=&quot;{now}&quot;</span>
        </span>
        <motion.span layout transition={{ duration: 0.4, ease }} className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-[13px] font-semibold ${now === "done" ? "bg-foreground text-card" : "bg-primary text-card"}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {now === "loading" && (
              <motion.span key="spin" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <LoaderCircle className="size-4 animate-spin" />
              </motion.span>
            )}
            {now === "done" && (
              <motion.span key="done" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <Check className="size-4" strokeWidth={2.5} />
              </motion.span>
            )}
          </AnimatePresence>
          {now === "done" ? "Booked" : now === "loading" ? "Booking…" : "Book consultation"}
        </motion.span>
      </div>
    </div>
  );
}

export default function NocturneDev({ principles, stack }: { principles: number[]; stack: number[] }) {
  return (
    <Frame>
      <div className={`flex flex-col gap-20 py-24 @xl:gap-28 @xl:py-36 ${gutter}`}>
        <div className="grid grid-cols-1 gap-14 @xl:grid-cols-[1fr_1.25fr] @xl:gap-[6cqw]">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-8">
              <Label field="label" />
              <SplitTitle field="title" />
              <In>
                <p className={`m-0 max-w-[28rem] ${type.body}`}>
                  <FieldValue field="intro" />
                </p>
              </In>
            </div>
            <ol className="m-0 flex list-none flex-col p-0">
              {principles.map((n, i) => (
                <li key={n} className="border-0 border-t border-solid border-border">
                  <In delay={i * 0.1} y={12} className="group/principle grid grid-cols-[2.5rem_1fr] gap-x-2 gap-y-1 py-5">
                    <span className="font-mono text-[11px] text-primary">0{i + 1}</span>
                    <span className="text-[16px] font-medium transition-transform duration-500 group-hover/principle:translate-x-1">
                      <FieldValue field={`principle${n}Title`} />
                    </span>
                    <span className={`col-start-2 ${type.muted}`}>
                      <FieldValue field={`principle${n}Text`} />
                    </span>
                  </In>
                </li>
              ))}
            </ol>
          </div>
          <In delay={0.1} className="@xl:pt-16">
            <Editor />
          </In>
        </div>

        {/* The stack */}
        <div className="flex flex-col gap-6">
          <In>
            <span className={type.label}>
              <FieldValue field="stackLabel" />
            </span>
          </In>
          <ul className="m-0 grid list-none grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-solid border-border bg-border p-0 @xl:grid-cols-6">
            {stack.map((n, i) => (
              <li key={n} className="bg-card">
                <In delay={(i % 6) * 0.05} y={10} className="group/tech relative flex h-full items-center justify-between gap-3 px-4 py-5 transition-colors duration-500 hover:bg-foreground/[0.04]">
                  <span className="text-[14px] transition-colors duration-300 group-hover/tech:text-primary">
                    <FieldValue field={`stack${n}`} />
                  </span>
                  <span className="font-mono text-[10px] text-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover/tech:scale-x-100" />
                </In>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}
