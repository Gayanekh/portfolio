import { mergeContent, sectionDefaults } from "./content";
import type { SectionDefinition, TemplateContent, TemplateDefinition } from "./types";

// A page's layout on top of its template, as arranged in the editor (after
// Squarespace's Fluid Engine): the order of its sections (with copies of
// them), blocks moved on the section grid, blocks added to a section, and
// extra height under a section. Saved with the page, so the published page
// looks the same. A page without one is the template as designed.

// Where a block sits, in grid cells from where the template puts it (moved
// template text and images) or from the section's top left (added blocks).
export interface GridSpot {
  col: number;
  row: number;
  // Its size, once resized with its handles: columns wide, rows tall (at least).
  cols?: number;
  rows?: number;
  // Where its content sits when the block is taller than it.
  valign?: VerticalAlign;
}

export type VerticalAlign = "top" | "middle" | "bottom";

// A block added with "Add block": a text or an image placed on the grid.
export interface AddedBlock extends GridSpot {
  id: string;
  kind: "text" | "image";
  // Its width in columns.
  cols: number;
  text?: string;
  src?: string;
  alt?: string;
  href?: string;
  // An added image's file name (its alternate filename).
  name?: string;
}

// An image's settings from the image panel: the part kept in view when its
// box crops it (percent across and down), its link, its description and the
// file name it is known by.
export interface FocalPoint {
  x: number;
  y: number;
}
export interface MediaMeta {
  focal?: FocalPoint;
  href?: string;
  alt?: string;
  name?: string;
  // Deleted with the toolbar: the whole image is gone from the page (undo brings it back).
  hidden?: boolean;
}

export interface PageLayout {
  // Section instances in page order: a template section's id, or a copy of
  // one ("about~2"). Without it, the template's own order.
  order?: string[];
  // Moved template blocks, by "instance.field".
  moved?: Record<string, GridSpot>;
  // Added blocks, by section instance.
  added?: Record<string, AddedBlock[]>;
  // Extra room under a section, in grid rows.
  extra?: Record<string, number>;
  // Template images' settings, by "instance.field".
  media?: Record<string, MediaMeta>;
}

/* ---------- The grid ---------- */

// Columns across a section, the margin each side (as a share of the page's
// width) and a row's height. The editor shows this grid while something is
// dragged; blocks snap to it.
export const GRID = { cols: 24, inset: 0.04, row: 24 };
// One column's width as CSS, in the page's own width (the renderer is a
// size container).
export const GRID_COL = `(${(1 - GRID.inset * 2) * 100}cqw / ${GRID.cols})`;

/* ---------- Sections in order ---------- */

// The template section an instance shows: "about~2" is a copy of "about".
export const baseOf = (instance: string) => instance.split("~")[0];

export const sectionOrder = (template: TemplateDefinition, layout?: PageLayout) => {
  const known = (id: string) => template.sections.some((section) => section.id === baseOf(id));
  const order = layout?.order?.filter(known);
  return order?.length ? order : template.sections.map((section) => section.id);
};

export const definitionOf = (template: TemplateDefinition, instance: string): SectionDefinition | undefined =>
  template.sections.find((section) => section.id === baseOf(instance));

// A new instance id for a copy of `base`, unique on the page.
export const newInstance = (base: string, taken: string[]) => {
  if (!taken.includes(base)) return base;
  let n = 2;
  while (taken.includes(`${base}~${n}`)) n += 1;
  return `${base}~${n}`;
};

// The page's text: the template sections' saved text (see mergeContent), and
// each copy's own text, on top of its section's defaults.
export const mergePageContent = (template: TemplateDefinition, saved: unknown, layout?: PageLayout): TemplateContent => {
  const content = mergeContent(template, saved);
  const stored = saved && typeof saved === "object" ? (saved as Record<string, unknown>) : {};
  for (const instance of sectionOrder(template, layout)) {
    if (instance in content) continue;
    const definition = definitionOf(template, instance);
    if (!definition) continue;
    const own = stored[instance] && typeof stored[instance] === "object" ? (stored[instance] as Record<string, unknown>) : {};
    const text = sectionDefaults(definition);
    for (const [field, value] of Object.entries(own)) if (field in text && typeof value === "string") text[field] = value;
    content[instance] = text;
  }
  return content;
};

/* ---------- Reading a saved layout ---------- */

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isSpot = (value: unknown): value is GridSpot => isRecord(value) && Number.isFinite(value.col) && Number.isFinite(value.row);

// A saved layout, keeping only what is well formed.
export const readLayout = (value: unknown): PageLayout => {
  if (!isRecord(value)) return {};
  const layout: PageLayout = {};
  if (Array.isArray(value.order)) layout.order = value.order.filter((id): id is string => typeof id === "string");
  if (isRecord(value.moved)) layout.moved = Object.fromEntries(Object.entries(value.moved).filter((entry): entry is [string, GridSpot] => isSpot(entry[1])));
  if (isRecord(value.media)) {
    layout.media = Object.fromEntries(
      Object.entries(value.media).flatMap(([key, meta]) => {
        if (!isRecord(meta)) return [];
        const clean: MediaMeta = {};
        if (isRecord(meta.focal) && Number.isFinite(meta.focal.x) && Number.isFinite(meta.focal.y)) {
          clean.focal = { x: Math.min(100, Math.max(0, Number(meta.focal.x))), y: Math.min(100, Math.max(0, Number(meta.focal.y))) };
        }
        if (typeof meta.href === "string") clean.href = meta.href;
        if (typeof meta.alt === "string") clean.alt = meta.alt;
        if (typeof meta.name === "string") clean.name = meta.name;
        if (meta.hidden === true) clean.hidden = true;
        return [[key, clean]];
      }),
    );
  }
  if (isRecord(value.extra)) layout.extra = Object.fromEntries(Object.entries(value.extra).filter((entry): entry is [string, number] => Number.isFinite(entry[1])));
  if (isRecord(value.added)) {
    layout.added = Object.fromEntries(
      Object.entries(value.added).map(([section, blocks]) => [
        section,
        (Array.isArray(blocks) ? blocks : []).filter(
          (block): block is AddedBlock =>
            isSpot(block) &&
            isRecord(block) &&
            typeof block.id === "string" &&
            (block.kind === "text" || block.kind === "image") &&
            Number.isFinite(block.cols),
        ),
      ]),
    );
  }
  return layout;
};
