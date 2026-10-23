"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";

const smooth = [0.22, 1, 0.36, 1] as const;
// As in the image panel (fluid/ImagePanel).
const label = "text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500";
const input =
  "w-full rounded-md border border-transparent bg-neutral-100 px-2.5 py-2.5 text-[13px] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white";

// The page's name in the editor's toolbar. Until it is named, the template's
// name stands in (faded, with its pencil showing). Clicking it opens a window
// below, styled like the image panel: the page's name (kept on Enter, on
// leaving the field or on closing; an empty name is not kept), then
// `children` (the page's settings). Esc or a press elsewhere closes it.
export default function PageNameField({
  value,
  fallback,
  onRename,
  children,
}: {
  value: string;
  fallback: string;
  onRename: (name: string) => void;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const named = Boolean(value);

  // Keeps the name typed, if it is new.
  const keep = () => {
    const name = draft.trim();
    if (name && name !== value) onRename(name);
    setDraft(name || value);
  };
  // The latest keep, for closing from outside.
  const keepRef = useRef(keep);
  useEffect(() => {
    keepRef.current = keep;
  });

  const show = () => {
    setDraft(value);
    setOpen(true);
  };
  const close = () => {
    keepRef.current();
    setOpen(false);
  };

  // A press anywhere else, or Esc, closes the window.
  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      keepRef.current();
      setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Keep Esc from also closing panels in the editor.
      event.stopPropagation();
      keepRef.current();
      setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex justify-center">
      <Tooltip label="Page name and settings">
        <button
          type="button"
          onClick={() => (open ? close() : show())}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`group relative flex h-6 max-w-[36vw] cursor-pointer items-center rounded px-1.5 text-sm font-semibold leading-none tracking-[-0.01em] transition-colors ${
            open ? "bg-neutral-100" : "hover:bg-neutral-100"
          }`}
        >
          <span className={`truncate ${named ? "text-neutral-950" : "text-neutral-500"}`}>{value || fallback}</span>
          {/* Outside the name, so the name stays centred over the status */}
          <Pencil
            aria-hidden="true"
            className={`absolute left-full top-1/2 ml-1 h-3.5 w-3.5 -translate-y-1/2 transition-[color,opacity] ${
              open
                ? "text-neutral-900 opacity-100"
                : named
                  ? "text-neutral-400 opacity-0 group-hover:text-neutral-900 group-hover:opacity-100 group-focus-visible:opacity-100"
                  : "text-neutral-400 opacity-100 group-hover:text-neutral-900"
            }`}
          />
          <span className="sr-only">Page name and settings</span>
        </button>
      </Tooltip>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Page settings"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: smooth }}
            className="absolute top-full z-50 mt-2 flex w-[300px] flex-col rounded-xl bg-white text-left font-ui shadow-[0_10px_34px_-6px_rgb(0_0_0/0.22),0_1px_3px_rgb(0_0_0/0.06)]"
          >
            <div className="flex items-center border-b border-neutral-100 px-5 pt-3">
              <span className="border-b-2 border-neutral-900 pb-2.5 text-[13px] font-semibold text-neutral-900">Page settings</span>
            </div>

            <div className="flex flex-col gap-5 px-5 py-4">
              {/* The page's name */}
              <label className="flex flex-col gap-2">
                <span className={label}>Page name</span>
                <input
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onBlur={keep}
                  onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
                  onFocus={(event) => event.currentTarget.select()}
                  placeholder={fallback}
                  maxLength={80}
                  className={input}
                />
                <span className="text-[11px] leading-snug text-neutral-500">Only you see this name. Visitors see your site title.</span>
              </label>

              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
