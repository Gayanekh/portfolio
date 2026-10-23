"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Globe, Lock } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";

const smooth = [0.22, 1, 0.36, 1] as const;
// As in the image panel (fluid/ImagePanel).
const label = "text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500";
const outlineButton =
  "flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-neutral-200 bg-white text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-900 no-underline transition-colors hover:bg-neutral-50";

// Page settings, in the window under the page's name (PageNameField):
// Visibility, whose switch puts the page on the web (publishing it) or takes
// it off (back to a draft, its address kept), and, while it is public, its
// link with Copy link and View site.
export default function PageSettings({
  isPublic,
  busy,
  canChange,
  pendingChanges,
  address,
  publicPath,
  copied,
  onPublic,
  onCopy,
}: {
  // On the web now.
  isPublic: boolean;
  // Publishing or unpublishing.
  busy: boolean;
  // Signed in, with the saved page read (otherwise the switch is off limits).
  canChange: boolean;
  // Public, with changes made since it was published.
  pendingChanges: boolean;
  // The page's address without the scheme, and its path for View site.
  address: string;
  publicPath: string | null;
  copied: boolean;
  onPublic: (on: boolean) => void;
  onCopy: () => void;
}) {
  const status = busy ? (isPublic ? "Unpublishing..." : "Publishing...") : isPublic ? "Public" : "Private";
  const hint = !canChange ? "Sign in to publish your page." : isPublic ? "Anyone with the link can see your page." : "Only you can see your page.";

  return (
    <>
      {/* Visibility */}
      <div className="flex flex-col gap-2">
        <span className={label}>Visibility</span>
        <div className="flex flex-col gap-2.5 rounded-lg bg-neutral-100 p-3.5">
          <div className="flex items-center gap-3">
            {isPublic ? <Globe aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-900" /> : <Lock aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-900" />}
            <span className="flex min-w-0 flex-1 items-center gap-2 text-[13px] font-medium text-neutral-900">
              {status}
              {isPublic && !busy && <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              aria-label="Publish to web"
              disabled={!canChange || busy}
              onClick={() => onPublic(!isPublic)}
              className={`relative h-6 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${isPublic ? "bg-neutral-950" : "bg-neutral-300"}`}
            >
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ x: isPublic ? 16 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={`absolute left-0.5 top-0.5 block size-5 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.25)] ${busy ? "animate-pulse" : ""}`}
              />
            </button>
          </div>
          <span className="text-[11px] leading-snug text-neutral-500">{hint}</span>
        </div>
      </div>

      {/* While public: the link, Copy link and View site */}
      <AnimatePresence initial={false}>
        {isPublic && publicPath && (
          <motion.div
            key="share"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: smooth }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <span className={label}>Page link</span>
              <Tooltip label={address} side="top">
                <span className="truncate rounded-md bg-neutral-100 px-2.5 py-2.5 text-[13px] text-neutral-900">
                  {address}
                </span>
              </Tooltip>
              {pendingChanges && <span className="text-[11px] leading-snug text-neutral-500">You have changes that are not live yet. Publish to update your page.</span>}
              <span className="mt-1 flex gap-2">
                <button type="button" onClick={onCopy} className={outlineButton}>
                  {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
                <a href={publicPath} target="_blank" rel="noreferrer" className={outlineButton}>
                  View site
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
