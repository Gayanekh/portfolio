"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { displayTitle, ease, focusRing, kicker, section, fit, fluidText } from "@/components/landing/landing-ui";

const FAQ: [string, string][] = [
  ["Can I edit my portfolio after publishing?", "Yes, as often as you like. Edits stay in your draft until you choose Publish changes, so visitors never see half-finished work. You can also unpublish at any time and publish again later."],
  ["Who can see my portfolio?", "While it's a draft, only you. Once published, anyone with the link can view it, so don't think of a published page as private. You decide whether your email and phone number are shown."],
  ["Can I change my template later?", "Yes. Switch templates at any time in the editor. Your content stays the same; only the layout changes."],
  ["Do I need to fill in everything before publishing?", "No. Only your name and a headline are required. Add projects, experience and the rest whenever you're ready."],
  ["Who is Portory for?", "Anyone who wants to show their work: teachers, photographers, consultants, nurses, engineers, students, career changers, and people who simply want a good page about what they do."],
];

// Questions in an accordion, from the landing-redesign branch: the title on
// the left, the questions on the right, one open at a time; "+" swaps to "−"
// while open and the answer rises into place. Stacked below lg.
// `className` sets the band's background (light grey by default).
export default function Questions({ className = "bg-neutral-50" }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" aria-label="Frequently asked questions" className={`${section} ${className} ${fit.sectionY}`}>
      <div className="mx-auto grid w-content-width grid-cols-1 gap-[clamp(3rem,calc(0rem_+_6.25vw),4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Reveal className="@container flex max-w-[52rem] flex-col gap-5 [--fit:12.14cqi]">
          <p className={kicker}>FAQ</p>
          <h2 className={displayTitle}>Questions, answered</h2>
        </Reveal>
        <div>
          {FAQ.map(([question, answer], i) => {
            const isOpen = open === i;
            return (
              <div key={question} className="border-t border-black/10 last:border-b">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`faq-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}-answer`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`${focusRing} flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left`}
                  >
                    <span className={`${fluidText.question} font-medium leading-snug tracking-[-0.02em] text-black`}>{question}</span>
                    <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={isOpen ? "minus" : "plus"}
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2, ease }}
                          className="block"
                        >
                          {isOpen ? <Minus className="size-6" /> : <Plus className="size-6" />}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}-answer`}
                      role="region"
                      aria-labelledby={`faq-${i}`}
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="overflow-hidden"
                    >
                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.45, ease, delay: 0.08 }}
                        className="m-0 max-w-[40rem] select-text pb-7 text-[length:clamp(1rem,calc(0.841rem_+_0.592vw),1.125rem)] leading-relaxed text-neutral-600"
                      >
                        {answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
