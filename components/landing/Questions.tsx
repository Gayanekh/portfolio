"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { CtaLink, LandingSection, SectionDivider, SectionFooter, SectionHeader } from "@/components/landing/Section";
import { ease, focusRing } from "@/components/landing/landing-ui";

const FAQ: [string, string][] = [
  ["Can I edit my portfolio after publishing?", "Yes, as often as you like. Edits stay in your draft until you choose Publish changes, so visitors never see half-finished work. You can also unpublish at any time and publish again later."],
  ["Who can see my portfolio?", "While it's a draft, only you. Once published, anyone with the link can view it, so don't think of a published page as private. You decide whether your email and phone number are shown."],
  ["Can I change my template later?", "Yes. Switch templates at any time in the editor. Your content stays the same; only the layout changes."],
  ["Do I need to fill in everything before publishing?", "No. Only your name and a headline are required. Add projects, experience and the rest whenever you're ready."],
  ["Who is Portory for?", "Anyone who wants to show their work: teachers, photographers, consultants, nurses, engineers, students, career changers, and people who simply want a good page about what they do."],
];

// One row in the style of the reference: hairline dividers, the question on
// the left, "+" on the right ("−" while open). Opening it expands the row and
// brings the answer up into the right half.
function Item({ id, question, answer, open, onToggle }: { id: string; question: string; answer: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-t border-foreground/10 last:border-b">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          onClick={onToggle}
          className={`${focusRing} flex w-full cursor-pointer items-center justify-between gap-6 py-4 text-left md:py-5`}
        >
          <span className="text-[length:clamp(1.25rem,2.1vw,1.75rem)] font-normal leading-tight tracking-[-0.03em]">{question}</span>
          <span aria-hidden="true" className="grid size-3 shrink-0 place-items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "minus" : "plus"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2, ease }}
                className="block"
              >
                {open ? <Minus strokeWidth={1.5} className="size-3" /> : <Plus strokeWidth={1.5} className="size-3" />}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-answer`}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 pb-6 md:grid-cols-2 md:gap-10 md:pb-7">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.45, ease, delay: 0.08 }}
                className="m-0 select-text border-t border-foreground/10 pt-3 text-[0.8125rem] font-medium leading-relaxed text-foreground/70 md:col-start-2"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// The FAQ: every question in one list of accordion rows in the style of the
// reference, and a "more questions" footer row with a call to action.
export default function Questions() {
  // One question open at a time.
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <LandingSection sectionId="faq" label="FAQ section">
      <Reveal>
        <div className="flex flex-col">
          {FAQ.map(([question, answer], i) => {
            const id = `faq-${i + 1}`;
            return <Item key={question} id={id} question={question} answer={answer} open={openId === id} onToggle={() => setOpenId(openId === id ? null : id)} />;
          })}
        </div>
      </Reveal>    
    </LandingSection>
  );
}
