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

// The page reads as one sentence after the hero: each step's title is the
// next one ("Pick a layout. Make it say what you do. ..."), and its tag says
// where in the story it is. Step 01 is the templates slider; 02 to 04 are
// the story (Story.tsx), told on one template that stays on screen.
export const TEMPLATES_INTRO = {
  tag: "01 · Choose",
  title: "Pick a layout.",
  text: "Templates for every kind of work. Each one is a real, editable site: pick one, make it yours and publish.",
  link: "View template",
  // Autoplay: how long each template stays before the next.
  autoplayMs: 4500,
};

/* ---------- Story: How it works and Design (chapters 02 to 04) ---------- */

// How it works (Choose, add your work, publish) with Design (make it yours)
// placed between its last two steps, told on one real template that stays on
// screen. Choosing is chapter 01, the templates slider. The ids keep the
// header's "How it works" anchor working.
export const STORY = {
  label: "How it works",
  template: "persona",
  // The progress row over the preview.
  progress: [
    { href: "#templates", short: "Choose" },
    { href: "#how-it-works", short: "Add your work" },
    { href: "#make-it-yours", short: "Style" },
    { href: "#publish", short: "Publish" },
  ] satisfies { href: string; short: string }[],
  write: {
    id: "how-it-works",
    tag: "02 · Add your work",
    title: "Make it say what you do.",
    text: "Fill in your details and work samples one section at a time. The live preview shows exactly how your page will look.",
    // The editor's sections, as they look partway through.
    fields: [
      { label: "Name and headline", value: "Done" },
      { label: "About you", value: "Done" },
      { label: "Projects", value: "2 added" },
    ],
    status: "Editing your draft · only you can see it",
  },
  style: {
    id: "make-it-yours",
    tag: "03 · Style",
    title: "Make it look like you.",
    text: "Pick a colour palette and a font pairing, and the whole template changes with you. Try it on a real template.",
    shuffle: "Shuffle",
  },
  publish: {
    id: "publish",
    tag: "04 · Publish",
    title: "Put it online.",
    text: "Get a portory.net address to send to anyone. Edit any time and publish your changes when they're ready.",
    address: "portory.net/lena-marlow",
    live: "Published",
    start: { href: "/templates", label: "Get started" } satisfies LinkItem,
  },
};
