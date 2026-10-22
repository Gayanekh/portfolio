"use client";

import { useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { focusRing } from "@/components/landing/landing-ui";
import { COLOR_PALETTES, FONT_PACKS } from "@/components/template-detail/theme-options";

const smooth = [0.22, 1, 0.36, 1] as const;
// The outline (and its check) gliding from one choice to the next.
const glide = { type: "spring", stiffness: 300, damping: 34, mass: 0.9 } as const;

// The cards fade in one after another when a list opens.
const list = { hidden: {}, shown: { transition: { staggerChildren: 0.04 } } };
const item = {
  hidden: { opacity: 0, y: 4 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smooth } },
};

// One choice: a light card whose edge darkens on hover. The chosen one wears
// the group's outline, which glides between choices with its check.
function Choice({ active, label, group, onSelect, compact = false, children }: { active: boolean; label: string; group: string; onSelect: () => void; compact?: boolean; children: ReactNode }) {
  return (
    <motion.button
      variants={item}
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={`${focusRing} group relative flex cursor-pointer flex-col rounded bg-white text-left shadow-[0_0_0_1px_rgb(0_0_0/0.07)] transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgb(0_0_0/0.16)]`}
    >
      <span className="flex flex-col overflow-hidden rounded">{children}</span>
      {active && (
        <motion.span layoutId={group} transition={glide} aria-hidden="true" className="pointer-events-none absolute -inset-px rounded ring-[1.5px] ring-neutral-950">
          <span className={`absolute grid place-items-center rounded-full bg-neutral-950 text-white ${compact ? "-right-1.5 -top-1.5 size-4" : "-right-2 -top-2 size-5"}`}>
            <Check className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={3} />
          </span>
        </motion.span>
      )}
    </motion.button>
  );
}

function Grid({ label, columns, children }: { label: string; columns: string; children: ReactNode }) {
  return (
    <motion.div role="group" aria-label={label} variants={list} initial="hidden" animate="shown" className={`grid ${columns}`}>
      {children}
    </motion.div>
  );
}

const name = (compact: boolean) =>
  `truncate font-medium text-foreground/75 transition-colors duration-300 group-hover:text-foreground ${compact ? "px-1.5 py-1.5 text-[11px]" : "px-2.5 py-2 text-xs"}`;

// The colour palettes, each as a strip of its five colours (light to dark:
// the page, an image, the accent, muted text, the text). A pick restyles the
// page straight away and is an unsaved change like any other edit. `compact`
// shows four to a row, smaller (where the space is narrow).
export function ColorChoices({ value, onChange, compact = false }: { value: string; onChange: (id: string) => void; compact?: boolean }) {
  const group = useId();
  return (
    <Grid label="Colors" columns={compact ? "grid-cols-4 gap-1.5" : "grid-cols-2 gap-2.5"}>
      {COLOR_PALETTES.map((option) => {
        const colors = [...option.swatches.slice(0, 3), option.muted, option.swatches[3]];
        return (
          <Choice key={option.id} active={option.id === value} label={option.name} group={group} onSelect={() => onChange(option.id)} compact={compact}>
            <span aria-hidden="true" className={`flex ${compact ? "h-9" : "h-12"}`}>
              {colors.map((color, index) => (
                <span key={index} className={`flex-1 ${color}`} />
              ))}
            </span>
            <span className={name(compact)}>{option.name}</span>
          </Choice>
        );
      })}
    </Grid>
  );
}

// The font packs, each as "Aa" in its heading font (over a line in its body
// font). `compact` shows three to a row, as "Aa" alone.
export function FontChoices({ value, onChange, compact = false }: { value: string; onChange: (id: string) => void; compact?: boolean }) {
  const group = useId();
  return (
    <Grid label="Fonts" columns={compact ? "grid-cols-3 gap-1.5" : "grid-cols-2 gap-2.5"}>
      {FONT_PACKS.map((option) => (
        <Choice key={option.id} active={option.id === value} label={option.name} group={group} onSelect={() => onChange(option.id)} compact={compact}>
          <span aria-hidden="true" className={`flex flex-col justify-center bg-neutral-50 ${compact ? "h-12 px-2.5" : "h-[4.5rem] gap-1.5 px-3"}`}>
            <span className={`leading-none text-neutral-950 ${compact ? "text-[22px]" : "text-[26px]"} ${option.heading}`}>Aa</span>
            {!compact && <span className={`truncate text-[11px] leading-none text-neutral-500 ${option.body}`}>This is your paragraph.</span>}
          </span>
          <span className={name(compact)}>{option.name}</span>
        </Choice>
      ))}
    </Grid>
  );
}
