"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Link2 } from "lucide-react";
import TextLink from "@/components/template-landing/TextLink";
import { ease, frame, serif } from "@/components/template-landing/ui";

const INVITE = {
  title: [
    { lead: "Ready to make", soft: "" },
    { lead: "something", soft: "yours?" },
  ],
  text: "Pick a template, add your work and publish it at portory.net/you. Free, and no code.",
  link: { href: "/templates", label: "Get started" },
};

// A short call after the templates grid, after the user's reference, as a
// full-width section on a very light grey (the user asked for a
// ground, the width of the page), two groups side by side in its middle (the
// user asked): on the right a large title in two lines rising out of masks
// (its last word in the serif italic), the line in grey under it and an
// underlined link with its arrow in the primary colour (TextLink); on the left
// the address (Address), in a fixed width that holds its longest name so the
// text beside it stays put while it types. On phones they stack.

// The address the site gets, as a browser's address bar: portory.net/ and a
// name typed after it, one after another (the templates' sample people and
// website names: a studio, a photographer, an event), a
// caret blinking at its end. The bar fits the address, widening and narrowing
// smoothly as it is typed; under it a tag says Publishing… while a name is
// typed and pops to Published once it is whole. Decorative; with reduced
// motion it shows portory.net/you, published.
const NAMES = ["you", "mara", "studio-north", "lena", "lumen-photo", "spring-fair", "kima"];

function Address() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { margin: "0px 0px -10% 0px" });
  const still = useReducedMotion();
  const [typed, setTyped] = useState(still ? NAMES[0] : "");
  const [done, setDone] = useState(!!still);
  useEffect(() => {
    if (still || !seen) return;
    let name = 0;
    let n = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = NAMES[name];
      n += deleting ? -1 : 1;
      setTyped(word.slice(0, n));
      setDone(!deleting && n === word.length);
      let wait = deleting ? 60 : 120;
      if (!deleting && n === word.length) {
        deleting = true;
        wait = 1800;
      } else if (deleting && n === 0) {
        deleting = false;
        name = (name + 1) % NAMES.length;
        wait = 400;
      }
      timer = setTimeout(tick, wait);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [seen, still]);
  return (
    <div ref={ref} aria-hidden="true" className="flex flex-col items-start gap-3">
      <motion.span layout={!still} transition={{ layout: { duration: 0.35, ease } }} className="flex items-center gap-2.5 rounded-full border border-solid border-[var(--line)] bg-white px-4 py-3 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.25)]">
        <span className="flex shrink-0 gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block size-1.5 rounded-full bg-[color-mix(in_srgb,var(--fg)_22%,transparent)]" />
          ))}
        </span>
        <Link2 className="ml-1 size-4 shrink-0 text-[var(--dim)]" strokeWidth={1.75} />
        <motion.span layout="position" className="whitespace-nowrap pr-2 font-mono text-[0.875rem] tracking-[-0.01em] text-[var(--fg)]">
          portory.net/<span className="text-[#3d4bf2]">{typed}</span>
          <span className="ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.15em] animate-pulse bg-[var(--fg)] motion-reduce:animate-none" />
        </motion.span>
      </motion.span>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span key="done" initial={{ opacity: 0, scale: 0.85, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ type: "spring", stiffness: 420, damping: 22 }} className="ml-4 flex origin-left items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,#3ccf7e_16%,transparent)] px-2.5 py-1 font-mono text-[0.6875rem] text-[#1f8a4c]">
            <span className="block size-1.5 rounded-full bg-[#3ccf7e]" />
            Published
          </motion.span>
        ) : (
          <motion.span key="busy" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="ml-4 flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--fg)_7%,transparent)] px-2.5 py-1 font-mono text-[0.6875rem] text-[var(--dim)]">
            <span className="block size-1.5 animate-pulse rounded-full bg-[var(--dim)]" />
            Publishing…
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Invite() {
  return (
    <section data-caption="templates" aria-labelledby="tl-invite-title" className="bg-[#f3f3f1] py-[clamp(2.75rem,5vw,4.5rem)]">
      <div className={`${frame} flex flex-col gap-10 lg:flex-row-reverse lg:items-center lg:justify-center lg:gap-[clamp(8rem,18vw,18rem)]`}>
        <div className="flex flex-col items-start">
          {/* Each line has room on the right for the italic question mark, which leans past it. */}
          <motion.h2 id="tl-invite-title" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="m-0 text-[length:clamp(2.25rem,calc(1.6rem_+_2.2vw),3.25rem)] font-normal leading-[1] tracking-[-0.055em]">
            {INVITE.title.map(({ lead, soft }, i) => (
              <span key={lead} className="block overflow-hidden pb-[0.1em] pr-[0.15em] sm:whitespace-nowrap">
                <motion.span variants={{ hidden: { y: "105%" }, shown: { y: "0%", transition: { duration: 1, ease, delay: i * 0.08 } } }} className="block">
                  {lead}
                  {soft && (
                    <>
                      {" "}
                      <span className={`${serif} tracking-[-0.03em]`}>{soft}</span>
                    </>
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease, delay: 0.15 }} className="flex flex-col items-start">
            <p className="m-0 mt-[clamp(0.75rem,1.2vw,1rem)] max-w-[24rem] text-[0.875rem] leading-[1.5] tracking-[-0.015em] text-[var(--dim)]">{INVITE.text}</p>
            <TextLink href={INVITE.link.href} label={INVITE.link.label} className="mt-[clamp(1rem,1.6vw,1.375rem)]" />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, ease, delay: 0.3 }} className="flex lg:w-[21rem] lg:shrink-0">
          <Address />
        </motion.div>
      </div>
    </section>
  );
}
