"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FAQ } from "@/components/template-landing/content";
import { Words, riseItem, stagger } from "@/components/template-landing/scroll-fx";
import { ease, focusRing, frame, grid, type } from "@/components/template-landing/ui";

// Questions, answered (the home page's FAQ): the label and title over the first two columns, and the questions
// over the last two as rows (rising in one after another) (Q1., Q2. ...) with a small square that fills
// while open; one opens at a time, the answer rising into place.
export default function Questions() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" data-caption="questions" aria-labelledby="tl-faq-title" className="relative scroll-mt-20 py-[clamp(5rem,12vh,9rem)]">
      <div className={`${frame} ${grid} gap-y-10`}>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <p className={`m-0 ${type.kicker}`}>{FAQ.label}</p>
          <h2 id="tl-faq-title" className={`m-0 ${type.heading}`}>
            <Words text={FAQ.title} />
          </h2>
        </div>
        <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} variants={stagger} className="border-0 border-t border-solid border-[var(--line)] lg:col-span-2 lg:mt-[clamp(4rem,10vw,9rem)]">
          {FAQ.items.map(([question, answer], i) => {
            const on = open === i;
            return (
              <motion.div key={question} variants={riseItem} className="border-0 border-b border-solid border-[var(--line)]">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`tl-faq-${i}`}
                    aria-expanded={on}
                    aria-controls={`tl-faq-${i}-answer`}
                    onClick={() => setOpen(on ? null : i)}
                    className={`${focusRing} group/q grid w-full cursor-pointer grid-cols-[3.5rem_1fr_auto] items-center gap-2 border-0 bg-transparent px-0 py-4 text-left text-[var(--fg)]`}
                  >
                    <span className={`${type.lead} ${on ? "text-[var(--accent)]" : "text-[var(--dim)]"} transition-colors duration-300`}>Q{i + 1}.</span>
                    <span className={`${type.lead} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/q:translate-x-1`}>{question}</span>
                    <span aria-hidden="true" className={`size-2.5 border border-solid border-current transition-[background-color,transform] duration-300 ${on ? "rotate-45 bg-current" : "bg-transparent"}`} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`tl-faq-${i}-answer`}
                      role="region"
                      aria-labelledby={`tl-faq-${i}`}
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="overflow-hidden"
                    >
                      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease, delay: 0.08 }} className={`m-0 max-w-[36rem] pb-6 pl-[3.5rem] ${type.body} text-[var(--dim)]`}>
                        {answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
