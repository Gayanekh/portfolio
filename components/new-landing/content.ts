import { GALLERY_TEMPLATES } from "@/components/gallery/gallery-templates";
import { getTemplateDetail, templateDetailHref } from "@/components/template-detail/template-registry";

// Everything the new landing page says, in page order. The sections only lay
// it out, so copy changes happen here.

export interface LinkItem {
  href: string;
  label: string;
}

/* ---------- Hero ---------- */

export const HERO = {
  title: "Your work has a story.",
  accent: "Show it with Portory.",
  text: "Choose a template, add your details and work samples, and publish your portfolio at your own portory.net address. Keep editing whenever you like, even after it's live.",
  primary: { href: "/templates", label: "Get started" } satisfies LinkItem,};

/* ---------- Templates ---------- */

// The real templates, in the gallery's order. (Product is a test template.)
// Each has a 2560×1600 (double resolution) screenshot of its opening screen in
// public/images/templates/<id>.jpg; retake it when the template changes.
export const TEMPLATES = GALLERY_TEMPLATES.filter((template) => template.live && template.id !== "product").map((template) => ({
  id: template.id,
  name: template.name,
  style: template.style,
  bestFor: template.bestFor,
  description: getTemplateDetail(template.id)?.description ?? "",
  href: template.href ?? templateDetailHref(template.id),
  image: `/images/templates/${template.id}.jpg`,
}));

// The hero's card stack shows a photo per template, in
// public/images/stack/<template id>.jpg (1600×1600). A template not listed
// here shows its screenshot instead. To use another photo (such as one from
// Freepik), replace the file; free Freepik photos need a credit on the page
// ("Designed by Freepik").
// The current photos are from Unsplash (free to use, no credit needed):
// showcase photo-1452587925148-ce544e77e70d, persona photo-1499951360447-b19be8fe80f5,
// gallery photo-1516035069371-29a1b244cc32, deck photo-1522202176988-66273c2fd55f,
// minimal photo-1498050108023-c5249f4df085 (unsplash.com/photos/<id>).
const STACK_PHOTOS: Partial<Record<string, string>> = {
  showcase: "/images/stack/showcase.jpg",
  persona: "/images/stack/persona.jpg",
  gallery: "/images/stack/gallery.jpg",
  deck: "/images/stack/deck.jpg",
  minimal: "/images/stack/minimal.jpg",
};

export const STACK = TEMPLATES.map((template) => {
  const photo = STACK_PHOTOS[template.id];
  return { ...template, image: photo ?? template.image, photo: Boolean(photo) };
});

export const TEMPLATES_INTRO = {
  tag: "Templates",
  title: "Templates for every kind of work",
  text: "Each one is a real, editable site. Pick one, make it yours and publish.",
  link: "View template",
  // Autoplay: how long each template stays before the next.
  autoplayMs: 4500,
};
