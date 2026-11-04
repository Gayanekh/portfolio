"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ } from "@/components/other-landing/content";
import { Heading } from "@/components/other-landing/parts";
import { colors, ease, focusRing, frame, section, type } from "@/components/other-landing/ui";

// In the reference's pricing place, centred like it: the home page's answers,
// each a grey card that opens. The first starts open.
export default function Questions() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className={`${frame} ${section}`}>
      <Heading id="faq-title" label={FAQ.label} lines={FAQ.title} center />
      <ul className="m-0 mx-auto mt-[clamp(2rem,3.5vw,3.25rem)] flex max-w-[56rem] list-none flex-col gap-[0.625rem] p-0">
        {FAQ.items.map(([question, answer], i) => {
          const isOpen = open === i;
          return (
            <li key={question} className={colors.card}>
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`${focusRing} flex w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent px-[clamp(1.25rem,2vw,1.875rem)] py-[clamp(1.1rem,1.6vw,1.5rem)] text-left ${type.title} text-[#090909]`}
                >
                  {question}
                  <Plus aria-hidden="true" className={`size-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                    <p className={`m-0 max-w-[40rem] px-[clamp(1.25rem,2vw,1.875rem)] pb-[clamp(1.25rem,1.8vw,1.75rem)] ${type.body} ${colors.body}`}>{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
