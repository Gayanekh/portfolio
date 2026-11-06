"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Plus } from "lucide-react";
import { BASE, NAV, PERSON } from "@/components/gayane/content";
import { Dot, Fade, halves, link } from "@/components/gayane/ui";
import { focusRing } from "@/components/template-landing/ui";

const subscribeTime = (onChange: () => void) => {
  const timer = setInterval(onChange, 15000);
  return () => clearInterval(timer);
};
const localTime = () => new Date().toLocaleTimeString("en-US", { timeZone: PERSON.timeZone, hour: "numeric", minute: "2-digit" });

// The header of every page, split at the line: the name on one side; on the other the
// pages (this one in the ink, the others quiet) and the time where Gayane is, in
// the accent colour. On phones the pages sit behind a +.
export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const time = useSyncExternalStore(subscribeTime, localTime, () => "");
  return (
    <header className="sticky top-0 z-40 border-0 border-b border-solid border-[var(--line)] bg-[var(--bg)] text-[0.875rem] tracking-[-0.01em]">
      <Fade>
        <div className={`flex h-11 items-center justify-between pl-3.5 pr-4 lg:pl-[clamp(1.5rem,4.2vw,3.75rem)] lg:pr-[clamp(1.5rem,4.2vw,3.75rem)] ${halves}`}>
          <Link href={BASE} className={`${link} flex w-fit items-center gap-2 text-[1rem] font-medium`}>
            <Dot className="size-2" />
            {PERSON.name}
          </Link>
          <div className="hidden items-center justify-between lg:flex lg:pl-[clamp(1.5rem,4.2vw,3.75rem)]">
            <nav aria-label="Pages" className="flex items-center">
              {NAV.map((item, i) => (
                <span key={item.href} className="flex">
                  <Link href={item.href} aria-current={path === item.href ? "page" : undefined} className={`${focusRing} rounded-[2px] no-underline transition-colors duration-200 hover:text-[var(--fg)] ${path === item.href ? "text-[var(--fg)]" : "text-[var(--dim)]"}`}>
                    {item.label}
                  </Link>
                  {i < NAV.length - 1 && <span className="mr-1 text-[var(--dim)]">,</span>}
                </span>
              ))}
            </nav>
            <span className="text-[var(--dim)]">
              {time && (
                <>
                  Now <span className="text-[var(--accent)]">{time}</span> in {PERSON.location}
                </>
              )}
            </span>
          </div>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="gk-menu" onClick={() => setOpen(!open)} className={`${focusRing} -mr-2 grid size-10 cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent p-0 text-[var(--dim)] lg:hidden`}>
            <Plus aria-hidden="true" strokeWidth={1.25} className={`size-6 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
          </button>
        </div>
      </Fade>
      {open && (
        <nav id="gk-menu" aria-label="Pages" className="border-0 border-t border-solid border-[var(--line)] py-2 pl-8 pr-4 lg:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined} onClick={() => setOpen(false)} className={`${link} block py-2.5 text-[1.125rem]`}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
