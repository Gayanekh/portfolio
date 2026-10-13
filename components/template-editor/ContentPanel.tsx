"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { FieldDefinition, SectionContent } from "@/components/site-templates/core/types";

const input = "w-full rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-[13px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:bg-white";

// "Edit content": a floating card with a section's fields, like the content
// panel in the reference. Changes show on the page as you type.
export default function ContentPanel({
  title,
  fields,
  content,
  onChange,
  onCommit,
  onClose,
}: {
  title: string;
  fields: FieldDefinition[];
  content: SectionContent;
  onChange: (field: string, value: string) => void;
  onCommit: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-label={`Edit ${title}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-4 top-16 z-40 w-[300px] rounded-lg bg-white font-sans shadow-[0_8px_30px_rgb(0_0_0/0.18)] ring-1 ring-black/5"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
        <span className="border-b-2 border-neutral-900 pb-1 text-xs font-semibold text-neutral-900">{title}</span>
        <button type="button" onClick={onClose} aria-label="Close" className="grid size-6 place-items-center rounded text-neutral-600 hover:bg-neutral-100">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {fields.map(({ name, label, multiline }) => (
          <label key={name} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">{label}</span>
            {multiline ? (
              <textarea rows={4} value={content[name] ?? ""} onChange={(e) => onChange(name, e.target.value)} onBlur={onCommit} className={`${input} resize-none`} />
            ) : (
              <input value={content[name] ?? ""} onChange={(e) => onChange(name, e.target.value)} onBlur={onCommit} className={input} />
            )}
          </label>
        ))}
      </div>
    </motion.div>
  );
}
