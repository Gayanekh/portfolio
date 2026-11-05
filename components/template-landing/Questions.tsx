"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FAQ } from "@/components/template-landing/content";
import Label from "@/components/template-landing/Label";
import { ease, focusRing, frame, serif } from "@/components/template-landing/ui";

// The questions, worded for websites (from /minimal-landing), merged into
// four (the user asked for fewer): the price, who it is for and what you can
// make, changing things after publishing, and who sees it.
const ITEMS = [
  {
    q: "Is Portory free?",
    a: "Yes. Choose a template, make it yours and publish it at portory.net/you, all for free.",
  },
  {
    q: "Who is it for, and what can I make?",
    a: "Anyone who wants a beautiful website without code: creatives, photographers, small businesses, event organisers and students. Make a portfolio, a photography site or an event page, with more templates on the way.",
  },
  {
    q: "Can I change things after publishing?",
    a: "Yes. You only need your name and a headline to publish; add the rest whenever you’re ready. Edit or switch templates any time, your content stays put, and changes stay in your draft until you publish them.",
  },
  {
    q: "Who can see my website?",
    a: "While it’s a draft, only you. Once published, anyone with the link can view it. You decide whether your email and phone number are shown.",
  },
];
// The heading's words.
const INTRO = {
  title: [
    { lead: "Good to", soft: "" },
    { lead: "", soft: "know." },
  ],
  text: "Quick answers to what people ask most.",
};

// The FAQ: on the left the label, the title in two lines rising out of masks
// (its last word in the serif italic) and a line under it; on the right the
// questions, after the user's Q1/Q2 reference: compact rows between
// hairlines, "Q1." then the question, a small square at the end that fills
// when the row is open, and the answer as a quiet line under the question.
// The closed questions are a little greyer than the open one. One
// opens at a time (all closed to start, the user asked); the whole row is the button.
export default function Questions() {
  const [open, setOpen] = useState(-1);
  return (
    <section id="faq" data-caption="questions" aria-labelledby="tl-faq-title" className="relative scroll-mt-20 py-[clamp(4.5rem,8.2vw,7.5rem)]">
      <div className={`${frame} grid gap-12 lg:grid-cols-4 lg:gap-0`}>
        <div className="flex flex-col gap-10 lg:col-span-2 lg:pr-[clamp(1rem,3vw,3rem)]">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease }} className="flex flex-col gap-1.5">
            <Label>{FAQ.label}</Label>
          </motion.div>
          {/* The title's lines rise out of their masks together, set off by the title coming into view. */}
          <motion.h2 id="tl-faq-title" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="m-0 text-[length:clamp(2.25rem,calc(1.6rem_+_2.2vw),3.5rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            {INTRO.title.map(({ lead, soft }, i) => (
              <span key={lead + soft} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  variants={{
                    hidden: { y: "105%" },
                    shown: {
                      y: "0%",
                      transition: { duration: 1, ease, delay: i * 0.08 },
                    },
                  }}
                  className="block"
                >
                  {lead}
                  {soft && <span className={`${serif} tracking-[-0.03em]`}>{soft}</span>}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="m-0 max-w-[24rem] text-[1rem] leading-[1.5] tracking-[-0.01em] text-[var(--dim)]"
          >
            {INTRO.text}
          </motion.p>
        </div>

        {/* The rows, rising into place together. */}
        <motion.ul initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease }} className="m-0 list-none p-0 lg:col-span-2">
          {ITEMS.map((item, i) => {
            const shown = open === i;
            return (
              <li key={item.q} className="group relative border-0 border-b border-solid border-[var(--line)] first:border-t">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`tl-faq-${i}`}
                    onClick={() => setOpen(shown ? -1 : i)}
                    aria-expanded={shown}
                    aria-controls={`tl-faq-${i}-answer`}
                    className={`${focusRing} grid w-full cursor-pointer grid-cols-[clamp(3rem,4.6vw,4.25rem)_minmax(0,1fr)_auto] items-start gap-x-4 rounded-[4px] border-0 bg-transparent py-[clamp(0.625rem,0.9vw,0.875rem)] pl-0 pr-[clamp(0.5rem,1.6vw,1.5rem)] text-left text-[clamp(1.0625rem,1.45vw,1.375rem)] font-medium leading-[1.3] tracking-[-0.02em] transition-colors duration-300 ${shown ? "text-[var(--fg)]" : "text-[color-mix(in_srgb,var(--fg)_72%,transparent)] hover:text-[var(--fg)]"}`}
                  >
                    <span>Q{i + 1}.</span>
                    <span>{item.q}</span>
                    {/* The small square: outlined, filled when the row is open. */}
                    <span aria-hidden="true" className={`mt-[0.45em] block size-[0.6875rem] border-[1.5px] border-solid border-[var(--fg)] transition-colors duration-300 ${shown ? "bg-[var(--fg)]" : "bg-transparent"}`} />
                  </button>
                </h3>
                {/* The answer, a quiet line under the question, sliding open. */}
                <div
                  id={`tl-faq-${i}-answer`}
                  role="region"
                  aria-labelledby={`tl-faq-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="m-0 pb-[clamp(0.875rem,1.2vw,1.125rem)] pl-[calc(clamp(3rem,4.6vw,4.25rem)_+_1rem)] pr-8 text-[clamp(0.9375rem,1.1vw,1.0625rem)] leading-[1.55] tracking-[-0.005em] text-[var(--dim)]">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
