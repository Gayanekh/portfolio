"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Monitor, Smartphone } from "lucide-react";
import OptionGrid from "@/components/template-detail/OptionGrid";
import PreviewFrame, { type Device } from "@/components/template-detail/PreviewFrame";
import { COLOR_PALETTES, FONT_PACKS, themeFontVariables } from "@/components/template-detail/theme-options";
import { getTemplateDetail } from "@/components/template-detail/template-registry";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";

const DEVICES: { id: Device; label: string; Icon: typeof Monitor }[] = [
  { id: "desktop", label: "Desktop preview", Icon: Monitor },
  { id: "mobile", label: "Mobile preview", Icon: Smartphone },
];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

// A template's own page, after the reference: the template in a browser
// window on the left (desktop or phone), and on the right its name, the
// button to start with it, and colour palettes and font packs that restyle
// the preview as you pick them. Works for any template in the registry.
export default function TemplateDetailPage({ id }: { id: string }) {
  const template = getTemplateDetail(id)!;
  const [device, setDevice] = useState<Device>("desktop");
  const [palette, setPalette] = useState(COLOR_PALETTES[0].id);
  const [font, setFont] = useState(FONT_PACKS[0].id);
  const live = Boolean(template.Preview);

  return (
    <div className={`${themeFontVariables} grid min-h-screen grid-cols-1 bg-background text-foreground lg:h-screen lg:grid-cols-[1fr_22rem] lg:overflow-hidden xl:grid-cols-[1fr_24rem]`}>
      {/* Preview */}
      <section aria-label={`${template.name} preview`} className="flex min-w-0 flex-col">
        <div className="flex items-center gap-4 px-4 py-3 md:px-6">
          <Link href="/templates/gallery" className={`${focusRing} group flex items-center gap-1.5 rounded text-xs font-semibold uppercase tracking-[0.08em] text-foreground no-underline`}>
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Templates
          </Link>
          <div role="group" aria-label="Preview size" className="flex items-center gap-1">
            {DEVICES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-label={label}
                aria-pressed={device === id}
                onClick={() => setDevice(id)}
                className={`${focusRing} grid size-8 cursor-pointer place-items-center rounded-md transition-colors ${device === id ? "text-foreground" : "text-foreground/35 hover:text-foreground/70"}`}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
        <motion.div {...rise(0.1)} className="flex flex-1 items-center justify-center px-4 pb-8 pt-2 md:px-10 lg:pb-10">
          <PreviewFrame template={template} device={device} palette={palette} font={font} />
        </motion.div>
      </section>

      {/* Sidebar */}
      <aside className="border-t border-foreground/5 bg-white px-6 py-8 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-8 lg:py-10" data-lenis-prevent>
        <div className="mx-auto flex max-w-sm flex-col gap-8">
          <motion.div {...rise(0)} className="flex flex-col gap-3">
            <h1 className="m-0 text-[length:clamp(2rem,6vw,2.5rem)] font-medium leading-none tracking-[-0.03em]">{template.name}</h1>
            <p className="m-0 text-sm leading-relaxed text-foreground/60">{template.description}</p>
            <Link
              href={template.useHref}
              className={`${focusRing} ${primaryButton} group mt-2 flex h-12 items-center justify-center gap-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] no-underline`}
            >
              Start with this design
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {live ? (
            <>
              <motion.div {...rise(0.08)}>
                <OptionGrid
                  title="Color palettes"
                  options={COLOR_PALETTES}
                  selected={palette}
                  onSelect={setPalette}
                  renderOption={(option) => (
                    <span className="flex h-7 overflow-hidden rounded-sm ring-1 ring-foreground/10">
                      {option.swatches.map((swatch) => <span key={swatch} className={`flex-1 ${swatch}`} />)}
                    </span>
                  )}
                />
              </motion.div>
              <motion.div {...rise(0.16)}>
                <OptionGrid
                  title="Font packs"
                  options={FONT_PACKS}
                  selected={font}
                  onSelect={setFont}
                  renderOption={(option) => (
                    <span className="flex flex-col gap-0.5 leading-none">
                      <span className={`text-base ${option.heading}`}>Heading</span>
                      <span className={`text-[0.65rem] text-foreground/60 ${option.body}`}>Paragraph text</span>
                    </span>
                  )}
                />
              </motion.div>
            </>
          ) : (
            <motion.p {...rise(0.08)} className="m-0 rounded-lg bg-foreground/[0.04] p-4 text-sm leading-relaxed text-foreground/60">
              Colour palettes and font packs arrive with this template. For now, open the editor to start building.
            </motion.p>
          )}

          {template.demoHref && (
            <motion.div {...rise(0.24)} className="text-center">
              <Link href={template.demoHref} className={`${focusRing} rounded text-xs font-semibold uppercase tracking-[0.08em] text-foreground no-underline underline-offset-4 hover:underline`}>
                View demo site
              </Link>
            </motion.div>
          )}
        </div>
      </aside>
    </div>
  );
}
