"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { X } from "lucide-react";
import { BASE, NAV, PERSON } from "@/components/gayane/content";
import { button, display, frame, gutter, link } from "@/components/gayane/kit";
import { focusRing } from "@/components/template-landing/ui";

// The fixed header, as in the reference: the menu's two lines on the left, the name
// in the serif in the middle and Let's talk on the right, lined up with the content.
// Clear over the hero photo at the top of the page, it blurs what passes under it once
// the page scrolls. The menu fills the screen with the pages; Escape, the cross or a
// page closes it.
export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const path = usePathname();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-0 border-b border-solid border-[var(--line)] transition-[background-color,backdrop-filter] duration-500 ${solid ? "bg-[rgb(22_23_26/0.6)] backdrop-blur-md" : "bg-transparent"}`}>
        <div className={`relative flex h-[4.5rem] items-center justify-between lg:h-24 ${frame}`}>
        <button type="button" aria-label="Open menu" aria-expanded={open} aria-controls="gk-menu" onClick={() => setOpen(true)} className={`${focusRing} flex h-10 w-12 cursor-pointer flex-col justify-center gap-[0.5625rem] rounded-[4px] border-0 bg-transparent p-0`}>
          <span className="block h-[2px] w-full rounded-[1px] bg-[var(--fg)]" />
          <span className="block h-[2px] w-full rounded-[1px] bg-[var(--fg)]" />
          <span className="block h-[2px] w-full rounded-[1px] bg-[var(--fg)]" />
        </button>
        <Link href={BASE} className={`${link} absolute left-1/2 -translate-x-1/2 font-[family-name:var(--el-serif)] text-[length:clamp(1.5rem,2.6vw,2.375rem)] uppercase tracking-[0.02em]`}>
          {PERSON.first}
        </Link>
        <Link href={`${BASE}/contact`} className={`${button} !h-10 !px-4 !text-[1rem] lg:!h-12 lg:!px-5 lg:!text-[1.25rem]`}>
          Let&apos;s talk
        </Link>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="gk-menu" role="dialog" aria-modal="true" aria-label="Menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.35 }} className={`fixed inset-0 z-[60] flex flex-col bg-[var(--bg)] ${gutter}`}>
            <div className="mx-auto flex h-[4.5rem] w-full max-w-[1600px] items-center lg:h-24">
              <button type="button" aria-label="Close menu" autoFocus onClick={() => setOpen(false)} className={`${focusRing} grid size-12 cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent p-0 text-[var(--fg)]`}>
                <X aria-hidden="true" className="size-8" strokeWidth={1.5} />
              </button>
            </div>
            <nav aria-label="Pages" className="flex flex-1 flex-col justify-center gap-2">
              {NAV.map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, transform: "translateY(40px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: reduced ? 0 : 0.6, ease: [0.12, 0.23, 0.5, 1], delay: reduced ? 0 : 0.08 * i }}>
                  <Link href={item.href} onClick={() => setOpen(false)} aria-current={path === item.href ? "page" : undefined} className={`${link} ${display} flex items-baseline gap-4 text-[length:clamp(3rem,8vw,7rem)] font-medium uppercase leading-[1.05] ${path === item.href ? "!text-[var(--accent)]" : ""}`}>
                    <span className="text-[1rem] text-[var(--dim)]">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="m-0 flex flex-wrap justify-between gap-4 border-0 border-t border-solid border-[var(--line)] py-6 text-[var(--dim)]">
              <a href={`mailto:${PERSON.email}`} className={link}>
                {PERSON.email}
              </a>
              <span>{PERSON.location}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
