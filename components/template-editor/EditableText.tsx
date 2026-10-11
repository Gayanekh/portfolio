"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eraser, Pencil } from "lucide-react";

const HANDLES = [
  "left-0 top-0", "left-1/2 top-0", "right-0 top-0",
  "left-0 top-1/2", "right-0 top-1/2",
  "left-0 bottom-0", "left-1/2 bottom-0", "right-0 bottom-0",
];

// A piece of template text you can click and type into, as in the
// reference: once selected it gets a blue frame with handles and a small
// toolbar above it. Empty text shows "Write here...".
export default function EditableText({
  value,
  selected,
  onSelect,
  onChange,
  onCommit,
}: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  onChange: (value: string) => void;
  onCommit: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  // Typing changes the text in place; only outside changes (undo, redo,
  // the product panel) are written back, so the caret never jumps.
  useEffect(() => {
    const element = ref.current;
    if (element && element.textContent !== value) element.textContent = value;
  }, [value]);

  const focusEnd = () => {
    const element = ref.current;
    if (!element) return;
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  return (
    <span className="relative block">
      <span
        ref={ref}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        spellCheck
        data-placeholder="Write here..."
        onFocus={onSelect}
        onMouseDown={(event) => event.stopPropagation()}
        onInput={(event) => onChange(event.currentTarget.textContent ?? "")}
        onBlur={onCommit}
        className={`block cursor-text outline-none empty:before:text-foreground/30 empty:before:content-[attr(data-placeholder)] ${
          selected ? "" : "rounded-sm hover:ring-1 hover:ring-[#3b82f6]/60"
        }`}
      />
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -inset-1 z-10 block ring-1 ring-[#3b82f6]"
          >
            {HANDLES.map((position) => (
              <span key={position} className={`absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border border-[#3b82f6] bg-white ${position.includes("right-0") ? "translate-x-1/2" : ""} ${position.includes("bottom-0") ? "translate-y-1/2" : ""} ${position}`} />
            ))}
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto absolute -top-11 left-0 flex items-center gap-0.5 rounded-md bg-white p-1 font-sans text-foreground shadow-[0_2px_10px_rgb(0_0_0/0.15)] ring-1 ring-black/5"
            >
              <button
                type="button"
                title="Edit text"
                aria-label="Edit text"
                onMouseDown={(event) => event.preventDefault()}
                onClick={focusEnd}
                className="grid size-7 place-items-center rounded text-foreground/70 hover:bg-black/5 hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Clear text"
                aria-label="Clear text"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange("");
                  onCommit();
                }}
                className="grid size-7 place-items-center rounded text-red-600/80 hover:bg-red-50 hover:text-red-600"
              >
                <Eraser className="h-3.5 w-3.5" />
              </button>
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
