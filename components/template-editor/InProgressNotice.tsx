"use client";

import { Construction, Info } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";
import type { TemplateDefinition } from "@/components/site-templates/core/types";
import { EDITOR_NOT_READY } from "@/components/template-editor/in-progress";

// The editor sidebar's "In progress" notice: what is not finished, so a gap
// is never mistaken for a bug. A template still being built shows its note
// and what does not work yet (amber, open); every template lists the editor
// tools still to come, behind an info icon by "Coming soon to the editor".
export default function InProgressNotice({ template }: { template: TemplateDefinition }) {
  const work = template.inProgress;
  const sections = template.sections.filter((section) => section.inProgress);

  return (
    <div className="mt-2 flex flex-col gap-2">
      {work && (
        <div role="note" aria-label={`${template.name} is in progress`} className="flex flex-col gap-2 border-l-2 border-amber-500 bg-amber-50 py-3 pl-3.5 pr-3 text-[13px] leading-snug text-amber-900">
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em]">
            <Construction aria-hidden="true" className="size-3.5" />
            Work in progress
          </span>
          <span>{work.note}</span>
          {(work.notWorking?.length || sections.length > 0) && (
            <>
              <span className="font-semibold">Not working yet:</span>
              <ul className="m-0 flex list-disc flex-col gap-1 pl-4">
                {work.notWorking?.map((item) => <li key={item}>{item}</li>)}
                {sections.length > 0 && !work.notWorking?.length && <li>{sections.map((section) => section.label).join(", ")} (not designed yet)</li>}
              </ul>
            </>
          )}
        </div>
      )}

      {/* The editor tools still to come: a line with an info icon, the list on
          hover or keyboard focus. */}
      <div className="flex items-center gap-1.5 text-[13px] leading-snug text-foreground/60">
        Coming soon to the editor ({EDITOR_NOT_READY.length})
        <Tooltip
          wide
          label={
            <span className="flex flex-col gap-1.5 text-xs leading-snug">
              {EDITOR_NOT_READY.map((item) => (
                <span key={item.tool}>
                  <span className="font-semibold">{item.tool}:</span> <span className="text-white/80">{item.text}</span>
                </span>
              ))}
            </span>
          }
        >
          <button type="button" aria-label={`Coming soon: ${EDITOR_NOT_READY.map((item) => `${item.tool}. ${item.text}`).join(" ")}`} className="grid size-6 cursor-help place-items-center rounded text-foreground/50 transition-colors hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground">
            <Info aria-hidden="true" className="size-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
