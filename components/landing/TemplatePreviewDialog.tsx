"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import ScaledPreview from "@/components/landing/ScaledPreview";
import { PEOPLE, TEMPLATES, templateName, type PersonKey, type TemplateId } from "@/components/landing/sample-portfolios";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";

const primaryLink = `${focusRing} ${primaryButton} inline-flex h-10 items-center rounded-2xl px-[18px] text-sm font-semibold no-underline`;

const chip = `${focusRing} min-h-9 rounded-full border px-3.5 text-[13.5px] font-medium transition-[background-color,color,border-color] duration-200`;
const chipOn = "border-foreground bg-foreground text-white";
const chipOff = "border-border bg-white text-foreground hover:border-foreground/15";

// Preview any sample template with any example person, as in the prototype.
export default function TemplatePreviewDialog({
  open,
  template,
  person,
  onChange,
  onClose,
}: {
  open: boolean;
  template: TemplateId;
  person: PersonKey;
  onChange: (next: { template: TemplateId; person: PersonKey }) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="preview-title"
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="m-auto max-h-[calc(100dvh-24px)] w-full max-w-[min(1240px,calc(100vw-24px))] overflow-hidden rounded-[22px] bg-white p-0 text-foreground shadow-[0_40px_100px_-30px_rgb(0_0_0/0.45)] backdrop:bg-[rgb(20_20_20/0.28)] backdrop:backdrop-blur-[3px]"
    >
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="grid max-h-[calc(100dvh-24px)] grid-rows-[auto_1fr_auto]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-[18px]">
            <h2 id="preview-title" className="m-0 text-2xl font-[650] tracking-[-0.04em]">{templateName(template)} template</h2>
            <button type="button" onClick={onClose} aria-label="Close preview" className={`${focusRing} grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground`}>
              <X aria-hidden="true" className="h-[18px] w-[18px]" />
            </button>
          </div>
          <div className="grid content-start gap-5 overflow-y-auto bg-card p-5">
            <div className="grid gap-3.5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                <span className="min-w-[7.5em] text-[13.5px] font-medium text-muted-foreground">Template</span>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((t) => (
                    <button key={t.id} type="button" aria-pressed={t.id === template} onClick={() => onChange({ template: t.id, person })} className={`${chip} ${t.id === template ? chipOn : chipOff}`}>{t.name}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                <span className="min-w-[7.5em] text-[13.5px] font-medium text-muted-foreground">Example person</span>
                <div className="flex flex-wrap gap-2">
                  {Object.values(PEOPLE).map((p) => (
                    <button key={p.key} type="button" aria-pressed={p.key === person} onClick={() => onChange({ template, person: p.key })} className={`${chip} ${p.key === person ? chipOn : chipOff}`}>{p.role}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                <span className="min-w-[7.5em] text-[13.5px] font-medium text-muted-foreground">Device</span>
                <div className="inline-flex gap-0.5 rounded-full bg-muted p-1">
                  {(["desktop", "mobile"] as const).map((d) => (
                    <button key={d} type="button" aria-pressed={d === device} onClick={() => setDevice(d)} className={`${focusRing} min-h-9 rounded-full px-4 text-sm font-medium capitalize transition-colors ${d === device ? "bg-foreground text-white" : "text-muted-foreground hover:text-foreground"}`}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className={`mx-auto w-full overflow-hidden bg-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.3)] ${device === "mobile" ? "max-w-[390px] rounded-[34px] border-8 border-foreground" : "max-w-[1100px] rounded-[15px] border border-black/5"}`}>
              <ScaledPreview key={`${template}-${person}-${device}`} template={template} person={person} base={device === "mobile" ? 390 : 1100} className="relative h-[min(62vh,640px)] overflow-y-auto" />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2.5 border-t border-border px-5 py-3.5">
            <button type="button" onClick={onClose} className={`${focusRing} inline-flex h-10 items-center rounded-full border border-border bg-white px-[18px] text-sm font-semibold transition-colors hover:border-foreground/15`}>Close</button>
            <Link href="/templates" className={primaryLink}>Use {templateName(template)}</Link>
          </div>
        </motion.div>
      )}
    </dialog>
  );
}
