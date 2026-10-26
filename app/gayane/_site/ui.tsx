"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Accessibility, Atom, Bot, Braces, Check, Code2, Component, Copy, Figma, FileCode2, GitBranch, Github, Kanban, Layers, LayoutDashboard,
  LayoutTemplate, Library, ListChecks, Menu, MonitorSmartphone, MousePointer2, MousePointerClick, Network, Paintbrush, Palette, PenTool,
  Shapes, Smartphone, Sparkles, SquareCheck, Ticket, Type, Wind, Workflow, X, type LucideIcon,
} from "lucide-react";
import { NAV, PERSON, BASE } from "./data";

const ease = [0.22, 1, 0.36, 1] as const;
export const focus = "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current";

// Fades and lifts its content in once it scrolls into view.
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// A line of huge type sliding sideways without end (still with reduced motion).
export function Marquee({ text, className = "" }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const run = `${text} · `;
  return (
    <div aria-hidden="true" className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex w-max" animate={reduced ? undefined : { x: ["0%", "-50%"] }} transition={{ duration: 28, ease: "linear", repeat: Infinity }}>
        {[0, 1].map((copy) => (
          <span key={copy} className="pr-[0.25em]">
            {run.repeat(3)}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// The header: name on the left, the pages in the middle, Let's talk on the
// right; it inverts over whatever scrolls under it. Phones get a menu.
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = (href: string) => (href === BASE ? pathname === BASE : pathname.startsWith(href));

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-50 h-0 text-white mix-blend-difference">
        <div className="pointer-events-auto relative flex items-center justify-between px-[clamp(1rem,1.4vw,1.25rem)] py-4">
          <Link href={BASE} className={`${focus} text-[0.875rem] font-semibold uppercase tracking-[-0.01em]`}>
            {PERSON.name}
          </Link>
          <nav aria-label="Pages" className="absolute left-1/2 hidden -translate-x-1/2 gap-3 text-[0.875rem] font-medium md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={current(item.href) ? "page" : undefined} className={`${focus} transition-opacity ${current(item.href) ? "opacity-100" : "opacity-70 hover:opacity-100"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href={`${BASE}/contact`} className={`${focus} hidden text-[0.875rem] font-medium md:block`}>
            Let&apos;s talk
          </Link>
          <button type="button" aria-expanded={open} aria-controls="gk-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)} className={`${focus} grid size-9 place-items-center md:hidden`}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="gk-menu"
            aria-label="Pages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-end gap-1 bg-black px-4 pb-10 pt-24 md:hidden"
          >
            {[...NAV, { href: `${BASE}/contact`, label: "Let's talk" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`${focus} text-[2.75rem] font-light uppercase leading-[1.05] tracking-[-0.04em] text-[#e6e6e6]`}>
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

// Copies the email address, saying so for a moment.
export function CopyEmail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(PERSON.email).catch(() => {});
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
      className={`${focus} inline-flex cursor-pointer items-center gap-2 ${className}`}
    >
      {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy Email"}</span>
    </button>
  );
}

const ICONS: Record<string, LucideIcon> = {
  "Product Design": PenTool,
  "Interaction Design": MousePointerClick,
  "Information Architecture": Network,
  "User Flows": Workflow,
  Wireframing: LayoutTemplate,
  Prototyping: MousePointer2,
  "Complex Workflows": GitBranch,
  "Dashboards & Data-Heavy UI": LayoutDashboard,
  "Responsive & Mobile Design": MonitorSmartphone,
  Figma: Figma,
  "Design Systems": Layers,
  "Component Libraries": Library,
  "Reusable UI Patterns": Shapes,
  "Design QA": ListChecks,
  "WCAG-Oriented Design": Accessibility,
  "Accessible Form & Component States": SquareCheck,
  React: Atom,
  "React Native": Smartphone,
  "Next.js": Braces,
  TypeScript: FileCode2,
  "Tailwind CSS": Wind,
  NativeWind: Wind,
  "shadcn/ui": Component,
  "Ant Design": Paintbrush,
  HTML: Code2,
  CSS: Palette,
  "Git/GitHub": Github,
  Claude: Sparkles,
  "Claude Code": Bot,
  ChatGPT: Sparkles,
  "GitHub Copilot": Github,
  "Figma AI": Figma,
  "Agile/Scrum": Kanban,
  Jira: Ticket,
};

export function SkillIcon({ name }: { name: string }) {
  const Icon = ICONS[name] ?? Type;
  return <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0" />;
}
