import type { ComponentType } from "react";
import MinimalPreview from "@/components/templates/MinimalPreview";
import { demoPortfolioData } from "@/components/templates/demo-data";
import { GALLERY_TEMPLATES } from "@/components/gallery/gallery-templates";

// Every template that has a detail page. To add a real template, add one entry
// to LIVE_TEMPLATES: its preview component (rendered with sample content) and
// where its buttons lead. The detail page, the colour palettes, the font packs
// and the gallery card's live thumbnail all work from this entry.

export interface TemplateDetail {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  // "Start with this design" and "View demo site".
  useHref: string;
  demoHref?: string;
  // A real template, rendered live with sample content...
  Preview?: ComponentType;
  // ...or, until it exists, a placeholder image of it.
  image?: string;
}

function MinimalSample() {
  return <MinimalPreview data={demoPortfolioData} />;
}

const LIVE_TEMPLATES: TemplateDetail[] = [
  {
    id: "minimal",
    name: "Minimal",
    description:
      "A light, editorial layout with a sticky profile column and stacked project cards. Pick a palette and a font pack below, then make it yours in the editor.",
    bestFor: "Designers and creatives",
    useHref: "/templates?template=minimal&edit=1",
    demoHref: "/demo/minimal",
    Preview: MinimalSample,
  },
];

// Gallery entries without a real template yet open the same page with their
// placeholder image, so every card leads somewhere.
const PLACEHOLDERS: TemplateDetail[] = GALLERY_TEMPLATES.filter((t) => !LIVE_TEMPLATES.some((live) => live.id === t.id)).map((t) => ({
  id: t.id,
  name: t.name,
  description: `Made for ${t.bestFor.toLowerCase()}. Every Portory template is responsive, easy to edit with a live preview, and ready to publish on your own portory.net link.`,
  bestFor: t.bestFor,
  useHref: "/templates",
  image: t.image,
}));

export const TEMPLATE_DETAILS: TemplateDetail[] = [...LIVE_TEMPLATES, ...PLACEHOLDERS];

export const getTemplateDetail = (id: string) => TEMPLATE_DETAILS.find((t) => t.id === id);
export const isLiveTemplate = (id: string) => LIVE_TEMPLATES.some((t) => t.id === id);
export const templateFrameHref = (id: string) => `/templates/preview/${id}/frame`;
export const templateDetailHref = (id: string) => `/templates/preview/${id}`;
