"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { readField } from "@/components/site-templates/core/content";
import { useField, useSectionId, useTemplate } from "@/components/site-templates/core/context";
import { plainText } from "@/components/site-templates/core/rich-format";
import { pageSections } from "@/components/site-templates/sections/panel-kit";
import About from "@/components/gayane/About";
import { ease, FieldValue, Frame, gutter, In, soft, SplitTitle, type, useNumber, useStillAfterHydration } from "@/components/site-templates/sections/nocturne/kit";

const DETAILS = [1, 2, 3];

// About and Contact in one (the user asked): her About (./About), then, in its
// own manner and under its right-hand column, the part's title (a label numbered on
// from About's, and the line), then a row like Experience | Education: Email (write,
// copy, the address) beside Reach me (the ways to find her). Then the footer.

// The label opening the contact part, as Nocturne's section labels: [06] — the words,
// and a hairline drawing itself once in view.
function ContactLabel() {
  const n = String(Number(useNumber()) + 1).padStart(2, "0");
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true });
  const still = useStillAfterHydration();
  return (
    <div ref={ref} className={`flex items-center gap-4 ${type.label}`}>
      <span className="text-primary">[{n}]</span>
      <span className="whitespace-nowrap">
        <FieldValue field="contactLabel" />
      </span>
      <motion.span aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: seen || still ? 1 : 0 }} transition={still ? { duration: 0 } : { duration: 1.4, ease: soft, delay: 0.2 }} className="h-px flex-1 origin-left bg-border" />
    </div>
  );
}

function ContactRow() {
  const { template, layout, content, navigate } = useTemplate();
  const section = useSectionId();
  const email = useField("email").value;
  const [copied, setCopied] = useState(false);
  const read = (field: string) => plainText(readField(content, section, field));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard refused (an old browser or an insecure page): nothing to do.
    }
  };

  return (
    <Frame sectionId="contact">
      <div className={`pb-20 @xl:pb-28 ${gutter}`}>
        <div className="grid grid-cols-1 @xl:grid-cols-[0.8fr_1.2fr] @xl:gap-[7cqw]">
          <span aria-hidden="true" className="hidden @xl:block" />
          <div className="flex flex-col gap-12 @xl:gap-16">
          <div className="flex flex-col gap-8">
            <ContactLabel />
            <SplitTitle field="contactTitle" />
          </div>
          <div className="grid grid-cols-1 gap-12 @xl:grid-cols-2 @xl:gap-[4cqw]">
            <div className="flex flex-col">
              <In>
                <span className={`mb-4 block ${type.label}`}>
                  <FieldValue field="emailLabel" />
                </span>
              </In>
              <In y={12} className="flex flex-col items-start gap-4 border-0 border-t border-solid border-border py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <a href={`mailto:${email}`} className="group/mail inline-flex h-11 items-center gap-2 rounded-[6px] bg-primary px-4 text-[14px] font-medium text-[#16171a] no-underline transition-colors duration-200 hover:bg-[#d8f99a]">
                    <Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    Write to me
                    <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/mail:-translate-y-0.5 group-hover/mail:translate-x-0.5" strokeWidth={1.75} />
                  </a>
                  <button
                    type="button"
                    onClick={copy}
                    aria-label={`Copy ${email}`}
                    className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[6px] border border-solid border-border bg-transparent px-4 text-[13px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={copied ? "y" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease }} className="inline-flex items-center gap-2">
                        {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                        <FieldValue field={copied ? "copied" : "copy"} />
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </div>
                <span className={`${type.muted} [overflow-wrap:anywhere]`}>
                  <FieldValue field="email" />
                </span>
              </In>
            </div>
            <div className="flex flex-col">
              <In>
                <span className={`mb-4 block ${type.label}`}>
                  <FieldValue field="reachLabel" />
                </span>
              </In>
              {DETAILS.map((n, i) => {
                const url = read(`detail${n}Url`);
                return (
                  <In key={n} delay={i * 0.1} y={12} className="border-0 border-t border-solid border-border">
                    <a href={url || undefined} target={url.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group/detail flex flex-col gap-1.5 py-5 text-foreground no-underline">
                      <span className="text-[14px] font-medium">
                        <FieldValue field={`detail${n}Label`} />
                      </span>
                      <span className="flex items-center gap-2 font-display text-[18px] italic leading-snug transition-colors duration-300 group-hover/detail:text-primary">
                        <FieldValue field={`detail${n}Value`} />
                        {url && <ArrowUpRight className="size-4 shrink-0 not-italic transition-transform duration-300 group-hover/detail:-translate-y-0.5 group-hover/detail:translate-x-0.5" strokeWidth={1.5} />}
                      </span>
                    </a>
                  </In>
                );
              })}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* The footer */}
      <div className={`flex flex-col gap-3 border-0 border-t border-solid border-border py-6 @xl:flex-row @xl:items-center @xl:justify-between ${gutter}`}>
        <span className="text-[12px] text-muted-foreground">
          <FieldValue field="copyright" />
        </span>
        <span className="text-[12px] text-muted-foreground">
          <FieldValue field="credit" />
        </span>
        <button
          type="button"
          onClick={() => navigate(pageSections(template, layout)[0])}
          className="group/top inline-flex w-fit cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
        >
          <FieldValue field="top" />
          <span className="grid size-8 place-items-center rounded-full border border-solid border-foreground/30 transition-colors duration-300 group-hover/top:border-primary group-hover/top:text-primary">
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover/top:-translate-y-0.5" strokeWidth={1.5} />
          </span>
        </button>
      </div>
    </Frame>
  );
}

export default function AboutContact() {
  return (
    <>
      <About />
      <ContactRow />
    </>
  );
}
