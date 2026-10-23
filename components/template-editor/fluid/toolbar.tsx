"use client";

import type { LucideIcon } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";
import { editorUi } from "./canvas";

// The one design for every control drawn on the canvas (a block's toolbar, a
// section's controls and their menus): white rounded cards with a soft
// shadow, icon buttons with a dark tooltip under them, and plain rows in
// menus.

// A toolbar: a row of tool buttons on a white card.
export const toolbarCard = `flex items-center gap-1 whitespace-nowrap rounded-xl bg-white px-1.5 py-1.5 ${editorUi} text-neutral-950 shadow-[0_6px_24px_-4px_rgb(0_0_0/0.16),0_1px_3px_rgb(0_0_0/0.06)]`;
// A menu opening from a toolbar: the same card, holding rows.
export const menuCard = `rounded-xl bg-white p-1.5 ${editorUi} text-neutral-950 shadow-[0_6px_24px_-4px_rgb(0_0_0/0.16),0_1px_3px_rgb(0_0_0/0.06)]`;
export const menuTitle = "m-0 px-2.5 pb-1 pt-1.5 text-[11px] font-medium text-neutral-400";
export const menuRow = "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-neutral-900 transition-colors hover:bg-neutral-100";

// A thin line between groups of tools.
export function ToolDivider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px bg-neutral-200" />;
}

// One tool: an icon (or a short text, or an icon and a word with `wide`),
// named in the app's tooltip (components/ui/tooltip) with its keys.
export function ToolButton({
  label,
  Icon,
  text,
  wide,
  keys,
  danger,
  active,
  disabled,
  soon,
  onClick,
}: {
  label: string;
  Icon?: LucideIcon;
  text?: string;
  wide?: boolean;
  keys?: string[];
  danger?: boolean;
  active?: boolean;
  disabled?: boolean;
  // Not ready yet: shown greyed out, its tooltip saying "Coming soon".
  soon?: boolean;
  onClick?: () => void;
}) {
  const button = (
    <button
      type="button"
      aria-label={soon ? `${label} (coming soon)` : label}
      aria-expanded={active}
      // Coming soon: not disabled (so its tooltip still shows), just inert.
      aria-disabled={soon || undefined}
      disabled={disabled}
      onClick={soon ? undefined : onClick}
      className={`flex h-9 min-w-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1.5 transition-colors disabled:cursor-default disabled:text-neutral-300 disabled:hover:bg-transparent aria-disabled:cursor-default aria-disabled:text-neutral-300 aria-disabled:hover:bg-transparent ${
        danger ? "text-red-600 hover:bg-red-50" : `text-neutral-950 hover:bg-neutral-100 ${active ? "bg-neutral-100" : ""}`
      } ${wide ? "px-2.5" : ""}`}
    >
      {text ? (
        <span className="text-[15px] font-bold leading-none tracking-[-0.02em]">{text}</span>
      ) : (
        Icon && <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
      )}
      {wide && <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">{label}</span>}
    </button>
  );
  // A tool showing its word needs no tooltip.
  if (wide) return button;
  return (
    <Tooltip
      label={
        <>
          {label}
          {soon && <span className="rounded bg-white/15 px-1 text-[9px] font-semibold uppercase tracking-[0.08em]">Coming soon</span>}
        </>
      }
      keys={keys}
    >
      {button}
    </Tooltip>
  );
}
