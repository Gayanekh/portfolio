"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { readField } from "../../core/content";
import { useField, useSectionId, useTemplate } from "../../core/context";
import { plainText } from "../../core/rich-format";
import { pageSections } from "../panel-kit";
import { ease, FieldValue, Frame, gutter, In, Label, Magnetic, SplitTitle, type } from "./kit";

// Contact, the last page: an ember glow following the pointer behind a huge
// line ("Let's make something *remarkable*."), a round accent button pulled
// towards the pointer (it opens an email), the email set large with a copy
// button, the ways to reach the person, and the footer with "Back to top".
//
// Its section's fields: `label`, `title`, `cta`, `email`, `copy`, `copied`,
// `detail1Label`, `detail1Value`, `detail1Url`..., `copyright`, `credit`,
// `top`.

export default function NocturneContact({ details }: { details: number[] }) {
  const { template, layout, content, edit, navigate } = useTemplate();
  const section = useSectionId();
  const still = Boolean(useReducedMotion());
  const email = useField("email").value;
  const glowRef = useRef<HTMLDivElement>(null);
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
    <Frame className="overflow-hidden">
      <div
        onPointerMove={(event) => {
          if (still || !glowRef.current) return;
          const box = event.currentTarget.getBoundingClientRect();
          glowRef.current.style.background = `radial-gradient(600px circle at ${event.clientX - box.left}px ${event.clientY - box.top}px, color-mix(in srgb, var(--primary) 22%, transparent), transparent 60%)`;
        }}
        className="relative"
      >
        <div ref={glowRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_70%_30%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_60%)]" />

        <div className={`relative flex flex-col gap-16 pb-16 pt-24 @xl:gap-20 @xl:pt-36 ${gutter}`}>
          <Label field="label" />
          <div className="flex flex-col gap-12 @xl:flex-row @xl:items-end @xl:justify-between">
            <SplitTitle field="title" className="max-w-[14ch] font-display text-[length:clamp(3.5rem,10.5cqw,11rem)] font-light leading-[0.9] tracking-[-0.045em]" />
            <In delay={0.3} className="shrink-0">
              <Magnetic>
                <a
                  href={edit ? undefined : `mailto:${email}`}
                  className="group/cta grid size-[clamp(8.5rem,13cqw,12rem)] place-items-center rounded-full bg-primary text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-card no-underline transition-transform duration-500 hover:scale-105"
                >
                  <span className="flex flex-col items-center gap-2">
                    <ArrowUpRight className="size-6 transition-transform duration-500 group-hover/cta:rotate-45" strokeWidth={1.5} />
                    <FieldValue field="cta" />
                  </span>
                </a>
              </Magnetic>
            </In>
          </div>

          {/* The email, and the ways to reach */}
          <div className="grid grid-cols-1 gap-12 border-0 border-t border-solid border-border pt-10 @xl:grid-cols-[1.4fr_1fr] @xl:gap-[6cqw]">
            <In className="flex flex-col items-start gap-4">
              <a
                href={edit ? undefined : `mailto:${email}`}
                className="group/mail relative font-display text-[length:clamp(1.3rem,2.5cqw,2.6rem)] font-light italic [overflow-wrap:anywhere] text-foreground no-underline"
              >
                <FieldValue field="email" />
                <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-primary transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/mail:origin-left group-hover/mail:scale-x-100" />
              </a>
              <button
                type="button"
                onClick={copy}
                className="inline-flex cursor-pointer items-center gap-2 rounded border border-solid border-border bg-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={copied ? "y" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease }} className="inline-flex items-center gap-2">
                    {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                    <FieldValue field={copied ? "copied" : "copy"} />
                  </motion.span>
                </AnimatePresence>
              </button>
            </In>
            <ul className="m-0 grid list-none grid-cols-1 gap-0 p-0">
              {details.map((n, i) => {
                const url = read(`detail${n}Url`);
                return (
                  <li key={n} className="border-0 border-b border-solid border-border first:border-t">
                    <In delay={i * 0.08} y={10}>
                      <a
                        href={edit || !url ? undefined : url}
                        target={url.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="group/detail flex items-center justify-between gap-4 py-4 text-foreground no-underline"
                      >
                        <span className={type.label}>
                          <FieldValue field={`detail${n}Label`} />
                        </span>
                        <span className="flex items-center gap-2 text-[15px] transition-colors duration-300 group-hover/detail:text-primary">
                          <FieldValue field={`detail${n}Value`} />
                          {url && <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/detail:-translate-y-0.5 group-hover/detail:translate-x-0.5" strokeWidth={1.5} />}
                        </span>
                      </a>
                    </In>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* The footer */}
        <div className={`relative flex flex-col gap-4 border-0 border-t border-solid border-border py-8 @xl:flex-row @xl:items-center @xl:justify-between ${gutter}`}>
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
      </div>
    </Frame>
  );
}
