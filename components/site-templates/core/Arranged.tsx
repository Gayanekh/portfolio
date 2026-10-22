"use client";

import type { CSSProperties, ReactNode } from "react";
import type { AddedBlock, GridSpot, VerticalAlign } from "./layout";
import { useTemplate } from "./context";
import RichText from "./RichText";
import { safeHref } from "./rich-format";

// How the page layout (./layout) shows: a moved block shifted on the section
// grid, a section's added blocks, and its extra height. The grid offsets are
// data, so they are passed as CSS variables; the geometry stays in classes
// (24 columns over 92% of the page width, rows of 24px: GRID in ./layout).

const spotVars = (spot: GridSpot) => ({ "--grid-col": spot.col, "--grid-row": spot.row, "--grid-cols": spot.cols, "--grid-rows": spot.rows ?? 0 }) as CSSProperties;

const VALIGN: Record<VerticalAlign, string> = {
  top: "flex flex-col justify-start",
  middle: "flex flex-col justify-center",
  bottom: "flex flex-col justify-end",
};
// A block's size and alignment classes, from its spot.
const sized = (spot: GridSpot) =>
  [spot.cols && "w-[calc(var(--grid-cols)*92cqw/24)] max-w-none", spot.rows && "min-h-[calc(var(--grid-rows)*24px)]", spot.valign && VALIGN[spot.valign]].filter(Boolean).join(" ");

// A template block moved on the grid, from where the template puts it.
export function Moved({ spot, children }: { spot?: GridSpot; children?: ReactNode }) {
  if (!spot || (!spot.col && !spot.row && !spot.cols && !spot.rows && !spot.valign)) return <>{children}</>;
  return (
    <span
      data-moved
      style={spotVars(spot)}
      className={`relative block h-full translate-x-[calc(var(--grid-col)*92cqw/24)] translate-y-[calc(var(--grid-row)*24px)] ${sized(spot)}`}
    >
      {children}
    </span>
  );
}

// An added block as visitors see it.
function AddedView({ block }: { block: AddedBlock }) {
  if (block.kind === "image") {
    if (!block.src) return null;
    const image = (
      // eslint-disable-next-line @next/next/no-img-element -- user images from any host
      <img src={block.src} alt={block.alt ?? ""} loading="lazy" decoding="async" className="block h-auto w-full" />
    );
    const href = safeHref(block.href);
    return href ? <a href={href}>{image}</a> : image;
  }
  const text = (
    <div className="whitespace-pre-line text-[length:clamp(1rem,1.4cqw,1.25rem)] leading-relaxed">
      <RichText value={block.text ?? ""} />
    </div>
  );
  const href = safeHref(block.href);
  return href ? (
    <a href={href} className="text-inherit">
      {text}
    </a>
  ) : (
    text
  );
}

// Where an added block sits: from the section's top left, on the grid.
export function AddedSpot({ block, children }: { block: AddedBlock; children: ReactNode }) {
  return (
    <div
      data-added-block={block.id}
      style={spotVars(block)}
      className={`absolute left-[calc(4cqw+var(--grid-col)*92cqw/24)] top-[calc(var(--grid-row)*24px)] z-10 ${sized(block)}`}
    >
      {children}
    </div>
  );
}

// A section with its layout: its extra height and its added blocks (the
// editor's editable ones while editing).
export function SectionFrame({ instance, children }: { instance: string; children: ReactNode }) {
  const { layout, edit } = useTemplate();
  const blocks = layout?.added?.[instance] ?? [];
  const extra = layout?.extra?.[instance] ?? 0;
  // Nothing arranged: the section as designed, with no wrapper (so a sticky
  // header keeps sticking to the whole page).
  if (!blocks.length && !extra) return <>{children}</>;
  // Room for the lowest added block (an estimate: a few rows under its top).
  const lowest = blocks.reduce((rows, block) => Math.max(rows, block.row + (block.kind === "image" ? block.cols * 0.75 : 4)), 0);
  return (
    <div
      data-section-frame={instance}
      style={{ "--extra-rows": extra, "--lowest-rows": lowest } as CSSProperties}
      className="relative min-h-[calc(var(--lowest-rows)*24px)] pb-[calc(var(--extra-rows)*24px)]"
    >
      {children}
      {blocks.map((block) => (
        <AddedSpot key={block.id} block={block}>
          {edit?.renderAdded ? edit.renderAdded(instance, block) : <AddedView block={block} />}
        </AddedSpot>
      ))}
    </div>
  );
}

