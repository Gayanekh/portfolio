"use client";

import { X } from "lucide-react";
import OptionGrid from "@/components/template-detail/OptionGrid";
import { COLOR_PALETTES, FONT_PACKS } from "@/components/template-detail/theme-options";

// "Site Styles", opened from the brush button: the shared colour palettes and
// font packs, applied to the page as you pick them.
export default function StylesPanel({
  palette,
  font,
  onPalette,
  onFont,
  onClose,
}: {
  palette: string;
  font: string;
  onPalette: (id: string) => void;
  onFont: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full w-[300px] flex-col bg-white">
      <div className="flex h-12 shrink-0 items-center justify-between px-5">
        <h2 className="m-0 text-[15px] font-semibold text-neutral-900">Site Styles</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close site styles"
          className="grid size-7 place-items-center rounded text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pb-6" data-lenis-prevent>
        <OptionGrid
          title="Colors"
          options={COLOR_PALETTES}
          selected={palette}
          onSelect={onPalette}
          renderOption={(option) => (
            <span className="flex h-7 overflow-hidden rounded-sm ring-1 ring-foreground/10">
              {option.swatches.map((swatch) => <span key={swatch} className={`flex-1 ${swatch}`} />)}
            </span>
          )}
        />
        <OptionGrid
          title="Fonts"
          options={FONT_PACKS}
          selected={font}
          onSelect={onFont}
          renderOption={(option) => (
            <span className="flex flex-col gap-0.5 leading-none">
              <span className={`text-base ${option.heading}`}>Heading</span>
              <span className={`text-[0.65rem] text-foreground/60 ${option.body}`}>Paragraph text</span>
            </span>
          )}
        />
      </div>
    </div>
  );
}
