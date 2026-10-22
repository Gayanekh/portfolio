"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileText, Globe, Mail, Phone, X, type LucideIcon } from "lucide-react";
import { safeHref } from "@/components/site-templates/core/rich-format";

// The link editor, after the reference, shared by the text editor's link
// button and the image panel's link: what it links to (URL, Page, Email,
// Phone), the address, the site's pages under "Main navigation", then
// Remove link and Apply. A link already set shows as a card with Edit, Copy
// and Remove link.

// A page of the site a link can go to (a section in its menu).
export interface LinkPage {
  label: string;
  href: string;
}

// What a link points at, as the type menu offers it.
type LinkKind = "url" | "page" | "email" | "phone";
const LINK_KINDS: { id: LinkKind; label: string; Icon: LucideIcon }[] = [
  { id: "url", label: "URL", Icon: Globe },
  { id: "page", label: "Page", Icon: FileText },
  { id: "email", label: "Email", Icon: Mail },
  { id: "phone", label: "Phone", Icon: Phone },
];
const kindOf = (href: string, pages: LinkPage[]): LinkKind =>
  href.startsWith("mailto:") ? "email" : href.startsWith("tel:") ? "phone" : pages.some((page) => page.href === href) || href.startsWith("#") ? "page" : "url";
// What the input shows for a link: the address without its scheme for email and phone.
const inputOf = (href: string) => href.replace(/^(mailto|tel):/, "");
// The link an input makes, for its kind (web addresses get https:// when they have no scheme).
const hrefOf = (kind: LinkKind, value: string) => {
  const text = value.trim();
  if (!text) return undefined;
  if (kind === "email") return safeHref(`mailto:${text.replace(/^mailto:/, "")}`);
  if (kind === "phone") return safeHref(`tel:${text.replace(/^tel:/, "").replace(/\s+/g, "")}`);
  if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(text)) return safeHref(text);
  return safeHref(`https://${text}`);
};

const popover = "absolute top-full z-50 mt-1 rounded-lg bg-white shadow-[0_8px_30px_-4px_rgb(0_0_0/0.2),0_1px_3px_rgb(0_0_0/0.06)]";
const cardAction = "cursor-pointer hover:underline";

// Choosing a link: `value` is the link it starts from ("" for none).
// `onApply` gets the new link, or undefined to remove it.
export function LinkForm({
  value,
  pages,
  onApply,
  onCancel,
}: {
  value: string;
  pages: LinkPage[];
  onApply: (href: string | undefined) => void;
  onCancel?: () => void;
}) {
  const [kind, setKind] = useState<LinkKind>(() => kindOf(value, pages));
  const [text, setText] = useState(() => inputOf(value));
  const [kindMenu, setKindMenu] = useState(false);
  const KindIcon = LINK_KINDS.find((item) => item.id === kind)!.Icon;
  const suggestions = kind === "page" || kind === "url" ? pages.filter((page) => !text || page.label.toLowerCase().includes(text.toLowerCase()) || page.href.includes(text)) : [];

  return (
    <div className="flex flex-col gap-3">
      {/* What it links to */}
      <span className="relative self-start">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={kindMenu}
          onClick={() => setKindMenu((open) => !open)}
          className="flex h-7 cursor-pointer items-center gap-1.5 rounded bg-neutral-100 px-2.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-200"
        >
          <KindIcon className="h-3.5 w-3.5" />
          {LINK_KINDS.find((item) => item.id === kind)!.label}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${kindMenu ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {kindMenu && (
            <motion.span
              role="menu"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className={`${popover} left-0 flex w-36 flex-col py-1`}
            >
              {LINK_KINDS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={kind === id}
                  onClick={() => {
                    setKind(id);
                    setKindMenu(false);
                  }}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-neutral-100 ${kind === id ? "font-semibold" : ""}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* The address, with a clear button */}
      <span className="flex items-center gap-1 border-b-2 border-neutral-900 bg-neutral-100 px-2">
        <input
          autoFocus
          value={text}
          placeholder={kind === "email" ? "name@example.com" : kind === "phone" ? "+1 555 0100" : kind === "page" ? "Search pages" : "https://"}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (hrefOf(kind, text)) onApply(hrefOf(kind, text));
            }
            if (event.key === "Escape") {
              event.stopPropagation();
              onCancel?.();
            }
          }}
          className="h-9 min-w-0 flex-1 bg-transparent text-[13px] text-neutral-900 outline-none"
        />
        {text && (
          <button type="button" aria-label="Clear" onClick={() => setText("")} className="grid size-6 cursor-pointer place-items-center rounded text-neutral-700 hover:bg-neutral-200">
            <X className="h-4 w-4" />
          </button>
        )}
      </span>

      {/* The site's pages */}
      {suggestions.length > 0 && (
        <span className="-mx-1 flex flex-col">
          <span className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-500">Main navigation</span>
          {suggestions.map((page) => (
            <button
              key={page.href}
              type="button"
              onClick={() => onApply(safeHref(page.href))}
              className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-2 text-left transition-colors hover:bg-neutral-100"
            >
              <FileText className="h-4 w-4 shrink-0 text-neutral-700" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[13px] text-neutral-900">{page.label}</span>
                <span className="truncate text-[11px] text-neutral-500">{page.href}</span>
              </span>
            </button>
          ))}
        </span>
      )}

      <span className="flex justify-end gap-2">
        {value && (
          <button type="button" onClick={() => onApply(undefined)} className="h-8 cursor-pointer rounded px-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-700 hover:bg-neutral-100">
            Remove link
          </button>
        )}
        <button
          type="button"
          disabled={!hrefOf(kind, text)}
          onClick={() => onApply(hrefOf(kind, text))}
          className="h-8 cursor-pointer rounded bg-neutral-900 px-3 text-xs font-semibold text-white disabled:cursor-default disabled:opacity-40"
        >
          Apply
        </button>
      </span>
    </div>
  );
}

// A link that is set: where it goes (a page by its name), with Edit, Copy
// (a part of the page as a full address) and Remove link.
export function LinkCard({ href, pages, onEdit, onRemove }: { href: string; pages: LinkPage[]; onEdit: () => void; onRemove: () => void }) {
  const [copied, setCopied] = useState(false);
  const Icon = LINK_KINDS.find((kind) => kind.id === kindOf(href, pages))!.Icon;
  const page = pages.find((item) => item.href === href);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href.startsWith("#") || href.startsWith("/") ? `${window.location.origin}${window.location.pathname}${href.startsWith("#") ? href : ""}` : href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Copying is not allowed here: nothing to do.
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-neutral-100 text-neutral-800">
          <Icon className="h-4 w-4" />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[13px] font-semibold text-neutral-950">{page?.label ?? inputOf(href)}</span>
          <span className="truncate text-[11px] text-neutral-500">{href}</span>
        </span>
      </span>
      <span className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-900">
        <button type="button" onClick={onEdit} className={cardAction}>
          Edit
        </button>
        <button type="button" onClick={copy} className={cardAction}>
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" onClick={onRemove} className={`${cardAction} ml-auto`}>
          Remove link
        </button>
      </span>
    </div>
  );
}
