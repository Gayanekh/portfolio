import type { ComponentType } from "react";
import MinimalPreview from "@/components/templates/MinimalPreview";
import TemplateRenderer from "@/components/site-templates/core/TemplateRenderer";
import { productTemplate } from "@/components/site-templates/product";
import { showcaseTemplate } from "@/components/site-templates/showcase";
import { personaTemplate } from "@/components/site-templates/persona";
import { deckTemplate } from "@/components/site-templates/deck";
import { galleryTemplate } from "@/components/site-templates/gallery";
import { siteTemplateDemoHref, siteTemplateEditorHref } from "@/components/site-templates/registry";
import { demoPortfolioData } from "@/components/templates/demo-data";
import { GALLERY_TEMPLATES } from "@/components/gallery/gallery-templates";

// Every template that has a detail page. To add a real template, add one entry
// to LIVE_TEMPLATES: its preview component (rendered with sample content) and
// where its buttons lead. The detail page, the colour palettes, the font packs
// and the gallery card's live thumbnail all work from this entry.

export interface PreviewProps {
  palette?: string;
  font?: string;
}

export interface TemplateDetail {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  // "Start with this design" and "View demo site".
  useHref: string;
  demoHref?: string;
  // A real template, rendered live with sample content in the chosen palette
  // and font pack...
  Preview?: ComponentType<PreviewProps>;
  // ...or, until it exists, a placeholder image of it.
  image?: string;
}

function MinimalSample() {
  return <MinimalPreview data={demoPortfolioData} />;
}

// Site templates apply the palette and font pack themselves, over their own look.
function ProductSample({ palette, font }: PreviewProps) {
  return <TemplateRenderer template={productTemplate} palette={palette} font={font} />;
}

function ShowcaseSample({ palette, font }: PreviewProps) {
  return <TemplateRenderer template={showcaseTemplate} palette={palette} font={font} />;
}

function PersonaSample({ palette, font }: PreviewProps) {
  return <TemplateRenderer template={personaTemplate} palette={palette} font={font} />;
}

function GallerySample({ palette, font }: PreviewProps) {
  return <TemplateRenderer template={galleryTemplate} palette={palette} font={font} />;
}

function DeckSample({ palette, font }: PreviewProps) {
  return <TemplateRenderer template={deckTemplate} palette={palette} font={font} />;
}

const LIVE_TEMPLATES: TemplateDetail[] = [
  {
    id: showcaseTemplate.id,
    name: showcaseTemplate.name,
    description: showcaseTemplate.description,
    bestFor: "Photographers, UI/UX and graphic designers",
    useHref: siteTemplateEditorHref(showcaseTemplate.id),
    demoHref: siteTemplateDemoHref(showcaseTemplate.id),
    Preview: ShowcaseSample,
  },
  {
    id: personaTemplate.id,
    name: personaTemplate.name,
    description: personaTemplate.description,
    bestFor: "Brand and product designers",
    useHref: siteTemplateEditorHref(personaTemplate.id),
    demoHref: siteTemplateDemoHref(personaTemplate.id),
    Preview: PersonaSample,
  },
  {
    id: galleryTemplate.id,
    name: galleryTemplate.name,
    description: galleryTemplate.description,
    bestFor: "Photographers and artists",
    useHref: siteTemplateEditorHref(galleryTemplate.id),
    demoHref: siteTemplateDemoHref(galleryTemplate.id),
    Preview: GallerySample,
  },
  {
    id: deckTemplate.id,
    name: deckTemplate.name,
    description: deckTemplate.description,
    bestFor: "Product and brand designers, studios",
    useHref: siteTemplateEditorHref(deckTemplate.id),
    demoHref: siteTemplateDemoHref(deckTemplate.id),
    Preview: DeckSample,
  },
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
  // TEST TEMPLATE — delete with components/site-templates/product after testing.
  {
    id: productTemplate.id,
    name: productTemplate.name,
    description: productTemplate.description,
    bestFor: "Makers and small shops",
    useHref: siteTemplateEditorHref(productTemplate.id),
    demoHref: siteTemplateDemoHref(productTemplate.id),
    Preview: ProductSample,
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
