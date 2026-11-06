"use client";

import Link from "next/link";
import { NAV, PERSON } from "@/components/gayane/content";
import { display, frame, link, type } from "@/components/gayane/kit";

// The foot of every page: the pages and the ways to reach Gayane, then her name
// huge and faint across the bottom, as the reference closes on its own.
export default function Footer() {
  return (
    <footer className={`relative z-10 overflow-hidden border-0 border-t border-solid border-[var(--line)] bg-[var(--bg)] pt-[clamp(3rem,6vw,5rem)] ${frame}`}>
      <div className="grid gap-10 sm:grid-cols-3">
        <div>
          <p className="m-0 font-[family-name:var(--el-serif)] text-[2rem] uppercase leading-none">{PERSON.first}</p>
          <p className={`m-0 mt-3 text-[var(--dim)] ${type.small}`}>
            {PERSON.role}
            <br />
            {PERSON.location}
          </p>
        </div>
        <nav aria-label="Pages" className="flex flex-col gap-2 text-[1.125rem]">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={`${link} w-fit !text-[var(--dim)] hover:!text-[var(--fg)]`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-[1.125rem]">
          <a href={`mailto:${PERSON.email}`} className={`${link} w-fit break-all`}>
            {PERSON.email}
          </a>
          <a href={PERSON.linkedin} target="_blank" rel="noopener noreferrer" className={`${link} w-fit`}>
            LinkedIn
          </a>
        </div>
      </div>
      <p aria-hidden="true" className={`${display} m-0 mt-[clamp(3rem,6vw,5rem)] select-none whitespace-nowrap text-[length:clamp(5rem,22vw,20rem)] font-medium uppercase leading-[0.8] tracking-[-0.04em] text-[rgb(239_239_237/0.05)]`}>
        {PERSON.first}
      </p>
      <p className={`m-0 flex flex-wrap justify-between gap-4 border-0 border-t border-solid border-[var(--line)] py-6 text-[rgb(239_239_237/0.5)] ${type.small}`}>
        <span>© 2026 {PERSON.name}. All rights reserved.</span>
        <span>{PERSON.status}</span>
      </p>
    </footer>
  );
}
