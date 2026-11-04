"use client";

import { motion } from "motion/react";
import { HERO, TEMPLATES } from "@/components/new-landing/content";
import Cover from "@/components/other-landing/Cover";
import Button from "@/components/template-landing/Button";
import { ease, frame, serif } from "@/components/template-landing/ui";

// The line the hero says, for screen readers; on screen it is the two big
// words and the sentence under them.
const LINE = "Your website, already designed.";
const WORDS = { lead: "Your website,", top: "already", bottom: "designed." };
const SENTENCE = "Pick a template made for your kind of work, make it yours and publish it at portory.net/you.";
const START_LINK = HERO.primary;
// The picture: the Exhibition template's cover (/other-landing's design).
const PICTURE = TEMPLATES.find((template) => template.id === "exhibition") ?? TEMPLATES[0];
// When the hero's words come in (the loading screen before them was removed).
const START = 0.15;

// The two big words, in the page's own type (the user asked to keep it): the
// sans at its regular weight, "already" in the serif italic. Opus's size,
// sized with the screen so "designed." and the picture always share one row.
const giant = "block text-[clamp(3.5rem,11.5vw,13rem)] font-normal leading-[0.86] tracking-[-0.045em]";

// The reference's word reveal: each word rises a little out of a blur.
function Word({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <motion.span initial={{ opacity: 0, y: "30%", filter: "blur(12px)" }} animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }} transition={{ duration: 1.4, ease, delay }} className={`inline-block ${className}`}>
      {children}
    </motion.span>
  );
}

// The hero, a compact version of the Opus reference (the user chose it) in
// the page's own type: two big words, "already" on the right (serif italic)
// and "designed." on the left with the
// template's wide cover filling the rest of its row; a hairline; then one
// sentence and the Get started button (See the templates was removed at the
// user's request). On phones the words
// stack on the right and the picture runs full width under them. The whole
// hero fills exactly the first screen (the user asked for it): the words and
// picture centred in the space under the header, the line, sentence and
// links at the screen's foot.
export default function Hero() {
  return (
    <section data-caption="top" aria-label="Introduction" className={`${frame} relative z-10 flex min-h-svh flex-col pb-[clamp(1.5rem,4svh,2.5rem)] pt-[clamp(5.5rem,12svh,7rem)]`}>
      <h1 className="m-0 my-auto py-[clamp(1rem,3svh,2rem)] text-[var(--fg)]">
        <span className="sr-only">{LINE}</span>
        {/* On phones the lead sits on its own line above, right-aligned with the words. */}
        <span aria-hidden="true" className="mb-2 block text-right text-[1.75rem] leading-none tracking-[-0.04em] md:hidden">
          <Word delay={START}>{WORDS.lead}</Word>
        </span>
        {/* The top row: "Your website," in the empty space on the left (so the hero reads
            as one sentence, the user asked), "already" large on the right. */}
        <span aria-hidden="true" className="flex items-end justify-between gap-6">
          <Word delay={START} className="mb-[0.35em] text-[clamp(1.75rem,3.6vw,3.75rem)] font-normal leading-none tracking-[-0.04em] max-md:hidden">
            {WORDS.lead}
          </Word>
          <span className={`${giant} ml-auto text-right`}>
            <Word delay={START + 0.05} className={`${serif} tracking-[-0.03em]`}>
              {WORDS.top}
            </Word>
          </span>
        </span>
        <span aria-hidden="true" className="mt-[clamp(0.75rem,1.6vw,1.75rem)] flex flex-col gap-[clamp(0.75rem,1.4vw,1.25rem)] md:flex-row md:items-end">
          <span className={`${giant} max-md:text-right`}>
            <Word delay={START + 0.1}>{WORDS.bottom}</Word>
          </span>
          {/* The picture: the template's cover in the rest of DESIGNED's row, always 12:5
              (the user asked that it never look stretched): it grows with the row's
              width up to 42% of the screen's height, then stays that size at the right. */}
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease, delay: START + 0.5 }} className="relative block aspect-[12/5] w-full overflow-hidden rounded-[10px] [--cover-zoom:1.45] md:ml-auto md:max-h-[42svh] md:w-auto md:max-w-[calc(42svh*2.4)] md:flex-1">
            <Cover src={PICTURE.image} name={PICTURE.name} shape="fill" drift />
          </motion.span>
        </span>
      </h1>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: START + 0.4 }} className="flex flex-col gap-6 border-0 border-t border-solid border-[var(--line)] pt-[clamp(1.25rem,3svh,2rem)] md:flex-row md:items-end md:justify-between">
        <p className="m-0 max-w-[32rem] text-[clamp(1rem,calc(0.9rem_+_0.4vw),1.3125rem)] font-normal leading-[1.4] tracking-[-0.025em] text-[var(--dim)]">{SENTENCE}</p>
        <div className="flex shrink-0">
          <Button href={START_LINK.href} label={START_LINK.label} />
        </div>
      </motion.div>
    </section>
  );
}
