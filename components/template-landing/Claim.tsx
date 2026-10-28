"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CLAIM } from "@/components/template-landing/content";
import { Rise, Words, useScrollValue } from "@/components/template-landing/scroll-fx";
import { corner, cornerLink, dots, focusRing, frame, grid, type } from "@/components/template-landing/ui";

// Lower case, letters, numbers and single hyphens: how an address reads.
const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+/, "").slice(0, 40);

// Claim your portory.net address, as on the home page: type a name and see
// it as an address, then go to the templates. Nothing is reserved here; the
// address is chosen on publishing. The label and title over the first two
// columns, the field and its note over the last two, on a halftone field.
export default function Claim() {
  const router = useRouter();
  const [name, setName] = useState("");
  const slug = toSlug(name);
  // The halftone field drifts against the scroll.
  const [dotsRef, drift] = useScrollValue<HTMLSpanElement>([-90, 90], undefined, 0);

  return (
    <section id="claim-address" data-caption="claim" aria-labelledby="tl-claim-title" className="relative scroll-mt-20 border-0 border-t border-solid border-[var(--line)] py-[clamp(5rem,12vh,9rem)]">
      <motion.span ref={dotsRef} aria-hidden="true" style={{ y: drift }} className={`absolute inset-0 ${dots} [mask-image:radial-gradient(ellipse_60%_70%_at_75%_50%,#000,transparent_75%)]`} />
      <div className={`relative ${frame} ${grid} gap-y-10`}>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <p className={`m-0 ${type.body}`}>{CLAIM.label}</p>
          <h2 id="tl-claim-title" className={`m-0 max-w-[14ch] ${type.title}`}>
            <Words text={CLAIM.title} />
          </h2>
        </div>
        <Rise delay={0.15} className="flex flex-col justify-end gap-5 lg:col-span-2 lg:pl-[clamp(1rem,1.75vw,2rem)]">
          <p className={`m-0 max-w-[32rem] ${type.body} text-[var(--dim)]`}>{CLAIM.note}</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              router.push(CLAIM.href);
            }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
          >
            <label className="flex h-14 min-w-0 flex-1 items-center border-0 border-b border-solid border-[var(--fg)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] text-[1.125rem]">
              <span className="sr-only">{CLAIM.field}</span>
              <span aria-hidden="true" className="shrink-0 text-[var(--dim)]">{CLAIM.domain}</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={CLAIM.placeholder}
                autoComplete="off"
                spellCheck={false}
                className={`${focusRing} min-w-0 flex-1 rounded-[4px] border-0 bg-transparent font-semibold text-[var(--fg)] placeholder:font-normal placeholder:text-[var(--dim)]`}
              />
            </label>
            <button type="submit" className={`${cornerLink} cursor-pointer border-0 bg-transparent p-0 pr-3 text-[1.25rem]`}>
              {CLAIM.button}
              <span aria-hidden="true" className={corner} />
            </button>
          </form>
          <p aria-live="polite" className={`m-0 min-h-[1.5em] ${type.small} text-[var(--dim)]`}>
            {slug && (
              <>
                Your page would live at <span className="font-semibold text-[var(--fg)]">{CLAIM.domain}{slug}</span>
              </>
            )}
          </p>
        </Rise>
      </div>
    </section>
  );
}
