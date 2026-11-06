"use client";

import Link from "next/link";
import Marquee from "@/components/other-landing/Marquee";
import { BASE, PERSON } from "@/components/gayane/content";
import { Dot, margins, type } from "@/components/gayane/ui";
import { focusRing } from "@/components/template-landing/ui";

const onDark = `${focusRing} rounded-[2px] text-[var(--fg)] no-underline transition-colors duration-200 hover:text-[var(--accent)]`;

// The dark close of every page: "Let's Talk" running across it, then the name
// staggered over two lines beside the ways to reach Gayane.
export default function Closing() {
  return (
    <footer className="relative z-20 mt-[clamp(5rem,10vw,9rem)] bg-[#141414] text-[var(--fg)] [--accent:#d96a3a] [--bg:#141414] [--dim:#9a9a9a] [--fg:#efefed] [--line:rgb(239_239_237/0.16)]">
      <Link href={`${BASE}/contact`} aria-label="Let's talk: go to the contact page" className={`${focusRing} block border-0 border-b border-solid border-[var(--line)] py-[clamp(1.25rem,2.4vw,2.25rem)] text-[var(--fg)] no-underline`}>
        <Marquee className="[--marquee-time:40s]">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="flex items-center text-[length:clamp(3.75rem,8vw,7.5rem)] font-light leading-none tracking-[-0.04em]">
              <span className="px-[0.3em]">Let&apos;s Talk</span>
              <Dot className="size-[0.16em]" />
            </span>
          ))}
        </Marquee>
      </Link>
      <div className={`lg:grid lg:grid-cols-2 ${margins} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <div className="[container-type:inline-size]">
          <p aria-hidden="true" className="m-0 text-[min(13cqw,5.5rem)] font-light leading-[1.08] tracking-[-0.035em]">
            <span className="block pl-[14cqw]">{PERSON.first}</span>
            <span className="block">{PERSON.last}</span>
          </p>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-10 lg:mt-0 lg:pl-[clamp(1.5rem,4.2vw,3.75rem)]">
          <div className={`flex flex-col items-start gap-1.5 ${type.label}`}>
            <a href={`mailto:${PERSON.email}`} className={`${onDark} break-all text-[1rem]`}>
              {PERSON.email}
            </a>
            <a href={PERSON.linkedin} target="_blank" rel="noopener noreferrer" className={onDark}>
              LinkedIn
            </a>
          </div>
          <div className={`flex flex-wrap justify-between gap-x-6 gap-y-1 text-[var(--dim)] ${type.small}`}>
            <span>{PERSON.role}, {PERSON.location}</span>
            <span>© 2026 All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
