"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronUp, FileText, Home, Info, NotebookPen, Search, ShoppingCart, X } from "lucide-react";

const ICONS: Record<string, ReactNode> = {
  Shop: <ShoppingCart className="h-3.5 w-3.5" />,
  Journal: <NotebookPen className="h-3.5 w-3.5" />,
};
const smooth = [0.22, 1, 0.36, 1] as const;

function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: smooth }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// The "Pages" panel from the reference: a back link, a searchable list of
// the site's pages in collapsible groups, and collapsible tool groups at the
// bottom. Only the current page exists in this example; the others say so.
export default function PagesPanel({
  backHref,
  current,
  navigation,
  notLinked,
}: {
  backHref: string;
  current: string;
  navigation: string[];
  notLinked: string[];
}) {
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState({ navigation: true, notLinked: true });
  const [tools, setTools] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const match = (page: string) => !query || page.toLowerCase().includes(query.toLowerCase());

  const pageRow = (page: string, home = false) => (
    <li key={page} className="relative">
      {home && <Home aria-label="Homepage" className="absolute -left-3.5 top-1/2 h-3 w-3 -translate-y-1/2 text-neutral-700" />}
      <button
        type="button"
        aria-current={page === current ? "page" : undefined}
        onClick={() => setNotice(page === current ? null : page)}
        className={`flex w-full items-center gap-2.5 rounded px-1.5 py-1.5 text-left text-[13px] transition-colors ${
          page === current ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        <span className="text-neutral-700">{ICONS[page] ?? <FileText className="h-3.5 w-3.5" />}</span>
        {page}
      </button>
    </li>
  );

  const group = (key: "navigation" | "notLinked", title: string, pages: string[], info?: string) => {
    const shown = pages.filter(match);
    if (query && !shown.length) return null;
    return (
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-neutral-900">
            {title}
            {info && (
              <span title={info} className="text-neutral-500">
                <Info className="h-3.5 w-3.5" />
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
            title={`${open[key] ? "Collapse" : "Expand"} the "${title}" group`}
            aria-expanded={open[key]}
            className="grid size-6 place-items-center rounded text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <motion.span animate={{ rotate: open[key] ? 0 : 180 }} transition={{ duration: 0.25 }}>
              <ChevronUp className="h-3.5 w-3.5" />
            </motion.span>
          </button>
        </div>
        <Collapse open={open[key] || Boolean(query)}>
          <ul className="m-0 mt-1.5 list-none p-0 pl-1">
            {shown.map((page) => pageRow(page, key === "notLinked" && page === "Home"))}
          </ul>
        </Collapse>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-white px-4 pb-4 pt-4 text-neutral-900">
      <Link href={backHref} className="group flex items-center gap-1 self-start text-xs font-medium text-neutral-800 no-underline">
        <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Templates
      </Link>

      <div className="mt-5 flex h-9 items-center justify-between gap-2">
        <AnimatePresence mode="wait" initial={false}>
          {query === null ? (
            <motion.h1 key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="m-0 text-2xl font-semibold tracking-[-0.02em]">
              Pages
            </motion.h1>
          ) : (
            <motion.input
              key="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery(null)}
              placeholder="Search pages"
              aria-label="Search pages"
              initial={{ opacity: 0, width: "40%" }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: smooth }}
              className="h-8 rounded-md border border-neutral-200 px-2.5 text-sm outline-none focus:border-neutral-400"
            />
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setQuery(query === null ? "" : null)}
          aria-label={query === null ? "Search pages" : "Close search"}
          className="grid size-7 shrink-0 place-items-center rounded text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          {query === null ? <Search className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pl-3" data-lenis-prevent>
        {group("navigation", "Main Navigation", navigation)}
        {group("notLinked", "Not Linked", notLinked, "Pages that aren't in your site's navigation")}
        {query && !navigation.concat(notLinked).some(match) && <p className="mt-6 text-xs text-neutral-500">No pages match.</p>}
        <AnimatePresence>
          {notice && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-md bg-neutral-100 px-3 py-2 text-xs leading-relaxed text-neutral-600"
            >
              {notice} isn&apos;t part of this example yet. Only the {current} page can be edited.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-neutral-100 pt-3">
        {["Marketing Tools", "Custom Code", "System Pages"].map((name) => (
          <div key={name}>
            <button
              type="button"
              onClick={() => setTools(tools === name ? null : name)}
              aria-expanded={tools === name}
              className="flex w-full items-center justify-between py-1.5 text-[13px] font-semibold text-neutral-900"
            >
              {name}
              <motion.span animate={{ rotate: tools === name ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>
            <Collapse open={tools === name}>
              <p className="m-0 pb-2 text-xs text-neutral-500">Not available in this example.</p>
            </Collapse>
          </div>
        ))}
        <p className="m-0 mt-3 text-[10px] text-neutral-500">Portory editor · example</p>
      </div>
    </div>
  );
}
