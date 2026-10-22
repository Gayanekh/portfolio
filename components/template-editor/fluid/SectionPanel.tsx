"use client";

import { motion } from "framer-motion";
import { Check, RotateCcw, Type, X } from "lucide-react";
import type { ChoiceItem } from "./SectionChrome";

const label = "text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500";
// One grid row of extra height, in px (as SectionChrome's height handle).
const ROW_PX = 24;
const MAX_ROWS = 24;

// "Edit section": a section's own settings, after the reference: its height
// (extra rows on top of its content), its layout, and a way to its text.
// Site Styles, for the whole page, stays on the toolbar's brush button.
export default function SectionPanel({
  title,
  extraRows,
  layouts,
  layout,
  onHeight,
  onLayout,
  onEditContent,
  onClose,
}: {
  title: string;
  extraRows: number;
  layouts: ChoiceItem[];
  // The layout the section uses now.
  layout: string;
  // The extra height while dragging the slider, and once it is let go.
  onHeight: (rows: number, done: boolean) => void;
  onLayout: (base: string) => void;
  onEditContent?: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-label={`Edit section ${title}`}
      initial={{ opacity: 0, x: 8, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={(event) => event.stopPropagation()}
      className="absolute right-4 top-20 z-50 flex max-h-[min(32rem,calc(100%-6rem))] w-[260px] flex-col rounded-lg bg-white font-ui shadow-[0_8px_30px_rgb(0_0_0/0.18)] ring-1 ring-black/5"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 pt-2.5">
        <span className="border-b-2 border-neutral-900 pb-2 text-xs font-semibold text-neutral-900">{title}</span>
        <button type="button" onClick={onClose} aria-label="Close" className="mb-2 grid size-6 cursor-pointer place-items-center rounded text-neutral-600 hover:bg-neutral-100">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-col gap-5 overflow-y-auto p-4" data-lenis-prevent>
        {/* Height */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={label}>Height</span>
            <span className="flex items-center gap-2">
              <span className="text-[11px] tabular-nums text-neutral-600">{extraRows ? `+${extraRows * ROW_PX}px` : "Fit content"}</span>
              <button
                type="button"
                onClick={() => onHeight(0, true)}
                disabled={!extraRows}
                aria-label="Reset height"
                title="Reset height"
                className="grid size-6 cursor-pointer place-items-center rounded text-neutral-600 hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-300 disabled:hover:bg-transparent"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(MAX_ROWS, extraRows)}
            step={1}
            value={extraRows}
            aria-label="Extra height"
            onChange={(event) => onHeight(Number(event.target.value), false)}
            onPointerUp={(event) => onHeight(Number(event.currentTarget.value), true)}
            onKeyUp={(event) => onHeight(Number(event.currentTarget.value), true)}
            className="w-full cursor-pointer accent-neutral-900"
          />
        </div>

        {/* Layout */}
        <div className="flex flex-col gap-2">
          <span className={label}>Layout</span>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {layouts.map(({ id, label: name }) => {
              const current = id === layout;
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={current}
                    onClick={() => !current && onLayout(id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors ${
                      current ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {name}
                    {current && <Check className="h-3.5 w-3.5" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {onEditContent && (
          <button
            type="button"
            onClick={onEditContent}
            className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded border border-neutral-200 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            <Type className="h-3.5 w-3.5" />
            Edit content
          </button>
        )}
      </div>
    </motion.div>
  );
}
