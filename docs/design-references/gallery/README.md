# Gallery template: design reference

`work-page.png` is the reference ("CUBE / work") behind the Gallery template's
Work section, and the source of the panel style every Gallery page follows.
Use it when adding new pages to Gallery, or building another template in the
same family.

## The panel style

- **Columns.** A soft grey panel down the left (17% of the width), then either
  the hero's columns (33.5 / 37.5 / 12) or three equal ones (Work, Journal).
  Thin lines run the full height between columns.
- **Accent column.** A block in the accent colour at the top right with the
  section's number under a thin line. The number rolls when it changes.
  Work puts its category filter in the accent instead, as the reference does.
- **Titles.** Huge, lowercase, heavy grotesk with tight tracking, running
  across the panel and the next column. They rise from behind an edge as
  they come into view.
- **Small type.** Grey capitals for eyebrows. The accent colour for a lead
  line or price.
- **Controls.** Round outline arrows (hero, quotes, lightbox), or square
  arrows at the bottom left, one accent and one white (Work, as in the
  reference). Two-digit numbers (`01 / 03`) show the position.
- **Motion.** Pictures sweep open from an edge and settle from a slight zoom.
  Text drifts in the direction of travel. Figures count up, and name bands
  run without end. Everything shows still for reduced motion and while
  editing.

## Where it lives

- `components/site-templates/sections/panel-kit.tsx`: the shared frame, type,
  motion and controls. Build new Panel sections from it.
- `components/site-templates/sections/Panel*.tsx` and `AboutPeek.tsx`: the
  sections.
- `components/site-templates/gallery/`: the template, its content and the
  sample photos (Unsplash).
