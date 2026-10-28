"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ } from "@/components/landing-next/content";
import { Headline, Label, Reveal } from "@/components/landing-next/kit";
import { ease, focusRing, font, pad, shell, type } from "@/components/landing-next/ui";

// Questions on bone: the heading held on the left while the questions run
// on the right, one open at a time; its "+" turns into an "×" and the
// answer rises into place.
export default function Faq({ copy = FAQ, index = "05" }: { copy?: typeof FAQ; index?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-label={copy.label} className="bg-[var(--bone)] pb-[clamp(5.5rem,calc(3.5rem_+_7vw),12rem)] text-[var(--ink)]">
      <div className={`${shell} grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-[6vw]`}>
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Label index={index}>{copy.label}</Label>
          </Reveal>
          <Headline text={copy.title} className={type.title} />
        </div>
        <Reveal className="border-0 border-t border-solid border-[var(--ink)]/10">
          {copy.items.map(([question, answer], i) => {
            const on = open === i;
            return (
              <div key={question} className="border-0 border-b border-solid border-[var(--ink)]/10">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`next-faq-${i}`}
                    aria-expanded={on}
                    aria-controls={`next-faq-${i}-answer`}
                    onClick={() => setOpen(on ? null : i)}
                    className={`${focusRing} group/q flex w-full cursor-pointer items-center gap-5 border-0 bg-transparent px-0 py-6 text-left text-[var(--ink)]`}
                  >
                    <span className={`${font.mono} w-6 shrink-0 text-[0.75rem] transition-colors duration-500 ${on ? "text-[var(--iris-deep)]" : "text-[var(--ink)]/35"}`}>{pad(i + 1)}</span>
                    <span className={`flex-1 ${type.small} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/q:translate-x-1.5`}>{question}</span>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-500 ${on ? "rotate-45 bg-[var(--ink)] text-[var(--bone)]" : "bg-[var(--ink)]/[0.06]"}`}>
                      <Plus aria-hidden="true" className="size-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`next-faq-${i}-answer`}
                      role="region"
                      aria-labelledby={`next-faq-${i}`}
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="overflow-hidden"
                    >
                      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease, delay: 0.08 }} className={`m-0 max-w-[40rem] pb-7 pl-11 ${type.body} text-[var(--ink)]/65`}>
                        {answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
