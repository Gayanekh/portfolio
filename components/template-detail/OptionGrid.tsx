"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ease, focusRing } from "@/components/landing/landing-ui";

// A titled two-column grid of style options. The highlight slides to the
// chosen option. Used for the colour palettes and the font packs.
export default function OptionGrid<T extends { id: string; name: string }>({
  title,
  options,
  selected,
  onSelect,
  renderOption,
}: {
  title: string;
  options: T[];
  selected: string;
  onSelect: (id: string) => void;
  renderOption: (option: T) => ReactNode;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-3 p-0 text-sm font-semibold text-foreground">{title}</legend>
      <div className="grid grid-cols-2 gap-1.5">
        {options.map((option) => {
          const active = option.id === selected;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              aria-label={option.name}
              onClick={() => onSelect(option.id)}
              className={`${focusRing} group relative flex h-14 cursor-pointer items-center rounded-md bg-foreground/[0.04] px-2.5 text-left transition-colors hover:bg-foreground/[0.07]`}
            >
              {active && (
                <motion.span
                  layoutId={`option-${title}`}
                  transition={{ duration: 0.35, ease }}
                  className="absolute inset-0 rounded-md bg-foreground/[0.08] ring-1 ring-foreground/25"
                />
              )}
              <span className="relative w-full">{renderOption(option)}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
