import { SHOWN_TEMPLATES } from "@/components/gallery/gallery-templates";
import { getTemplateDetail } from "@/components/template-detail/template-registry";

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
  text: "Choose a template, add your content, and publish your portfolio. Edit anytime, even after publishing.",
  primary: { href: "/templates", label: "Get started" } satisfies LinkItem,};

/* ---------- Templates ---------- */

// When the screenshots were taken. It is part of their file names, so a
// browser never keeps showing an old copy: retake them all, rename them with
// the new date, and change it here.
const SHOTS = "2026-10";

// The real templates, in the gallery's order. (Product is a test template.)
// Each has a 2560×1600 (double resolution) screenshot of its opening screen in
// public/images/templates/<id>-<SHOTS>.jpg; retake it when the template changes.
// Gallery comes second on the landing (after the first template).
const LANDING_ORDER = (() => {
  const shown = SHOWN_TEMPLATES.filter((template) => template.id !== "product");
  const gallery = shown.filter((template) => template.id === "gallery");
  const rest = shown.filter((template) => template.id !== "gallery");
  return [...rest.slice(0, 1), ...gallery, ...rest.slice(1)];
})();

export const TEMPLATES = LANDING_ORDER.map((template) => ({
  id: template.id,
  name: template.name,
  style: template.style,
  bestFor: template.bestFor,
  description: getTemplateDetail(template.id)?.description ?? "",
  href: template.href,
  image: `/images/templates/${template.id}-${SHOTS}.jpg`,
}));

// The templates slider's panel for each template: a headline, and what the
// template works best with.
export const TEMPLATE_PITCH: Record<string, { headline: string; needs: string[] }> = {
  nocturne: { headline: "Design, code, photos and graphics in one dark story", needs: ["Case studies", "Photography", "Graphic work"] },
  showcase: { headline: "Images and interfaces, given room", needs: ["Visual projects", "Short descriptions"] },
  persona: { headline: "A bold poster with your name on it", needs: ["A portrait", "Services", "Experience"] },
  gallery: { headline: "Big images and room to breathe", needs: ["Photo series", "Services", "Testimonials"] },
  deck: { headline: "Projects that stack up as you scroll", needs: ["Project images", "A short intro"] },
  signature: { headline: "A living profile beside your work", needs: ["A portrait", "Projects", "Experience"] },
};

// The hero's card stack shows each template itself: a square 2200×2200
// (double resolution) screenshot of its opening screen at 1100×1100, in
// public/images/stack/<template id>-<SHOTS>.jpg; retake it when the template changes.
// It is centred in its card (`photo`), as the slider's are cropped from the top.
export const STACK = TEMPLATES.map((template) => ({ ...template, image: `/images/stack/${template.id}-${SHOTS}.jpg`, photo: true }));

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
