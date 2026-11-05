import { HERO as HOME_HERO, STACK, TEMPLATES, TEMPLATE_PITCH } from "@/components/new-landing/content";
import { FAQ as HOME_FAQ } from "@/components/landing-next/content";
import { DESIGN as HOME_DESIGN, FEATURES as HOME_FEATURES, STEPS as HOME_STEPS } from "@/components/line-landing/content";
import { STYLE_LABEL } from "@/components/landing/sample-portfolios";
import { siteTemplateEditorHref } from "@/components/site-templates/registry";
import { GALLERY_TEMPLATES, categoryLabel } from "@/components/gallery/gallery-templates";

// Everything /template-landing says, in page order; the sections only lay it
// out. It is the Portory home page's own content, read from the modules that
// already hold it (nothing is copied here): the hero and the real templates
// (new-landing), the home sections' copy (line-landing, which gathered it from
// the home page), and the FAQ (landing-next, the home page's answers).

// Those modules mark a headline's accent words with *stars*; this page sets
// them plainly.
const plain = (text: string) => text.replace(/\*/g, "");

export const START = HOME_HERO.primary;
export const LOGIN = { href: "/login", label: "Log in" };
export const REGISTER = { href: "/register", label: "Create an account" };

// The home page's sections, by their anchors.
export const NAV = [
  { href: "#templates", label: "Templates" },
  { href: "#make-it-yours", label: "Design" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

// Every template, with its style's name, its pitch, what it suits, its
// screenshots, live demo and editor link.
export const TEMPLATES_ALL = TEMPLATES.map((template, i) => ({
  ...template,
  styleLabel: STYLE_LABEL[template.style],
  headline: TEMPLATE_PITCH[template.id]?.headline ?? template.description,
  needs: TEMPLATE_PITCH[template.id]?.needs ?? [],
  square: STACK[i].image,
  editor: siteTemplateEditorHref(template.id),
}));

// The templates grid (/other-landing's, in place of the old slider): each template's cover, name, pitch and tags (its category, then
// what it works best with). Demos open in a new tab.
// The templates that can be opened in the editor (Exhibition has no editor yet).
export const EDITABLE_IDS = TEMPLATES.filter((template) => GALLERY_TEMPLATES.find((item) => item.id === template.id)?.editable !== false).map((template) => template.id);

// The cover pictures the user supplied (public/images/landing-covers), by template.
const COVER_PHOTOS: Record<string, { src: string; ground: string; focus: string; fill?: boolean; contain?: boolean; corner?: boolean; extra?: number } | undefined> = {
  // `ground`: the picture's own side-edge colour (shown while it loads). The user's covers are
  // all made at 2000 × 1870, the cards' own shape, so each fills its card edge to
  // edge (`fill`), uncropped where the card is that shape.
  gallery: { src: "/images/landing-covers/gallery-cover.webp", ground: "#e3e5e6", focus: "50% 50%", fill: true },
  signature: { src: "/images/landing-covers/minimal-cover.webp", ground: "#f3f3f3", focus: "50% 50%", fill: true },
  nocturne: { src: "/images/landing-covers/nocturne-cover.webp", ground: "#a0a0a0", focus: "50% 50%", fill: true },
  showcase: { src: "/images/landing-covers/showcase-cover-d.webp", ground: "#eeeeec", focus: "50% 50%", fill: true },
  exhibition: { src: "/images/landing-covers/exhibition-cover.webp", ground: "#ecedea", focus: "50% 50%", fill: true },
  // Persona's cover is the user's earlier one, near square like the cards (filled too).
  persona: { src: "/images/landing-covers/persona-2026-11c.webp", ground: "#d6d2cf", focus: "50% 50%", fill: true },
};

export const GRID = {
  label: "Templates",
  // The header, after the Opus reference's "Our recent projects": a title
  // (its last word soft), a line and a link to every template.
  title: [{ lead: "Templates for every", soft: "" }, { lead: "kind of", soft: "work." }],
  text: "Real websites, each with its own sample content. Open any demo in a new tab, or pick one and make it yours.",
  link: { href: "/templates", label: "All templates" },
  items: TEMPLATES_ALL.map((template) => ({
    id: template.id,
    name: template.name,
    // Its kind, and whether it can be edited yet (Exhibition is a demo only).
    tags: EDITABLE_IDS.includes(template.id) ? [categoryLabel(template.category)] : [categoryLabel(template.category), "Demo only"],
    screen: template.image,
    // A finished cover picture, where the user gave one (the others build theirs from the screenshot).
    photo: COVER_PHOTOS[template.id],
    href: template.href,
  })),
};

// What the fixed caption in the bottom right says while each section is in view.
export const CAPTIONS: Record<string, string> = {
  top: "More than portfolios",
  templates: "Templates for every kind of work",
  features: "Everything you need",
  design: "Make it yours",
  steps: "How it works",
  questions: "Questions, answered",
  create: "Create with Portory",
  end: "Portory",
};


export const FEATURES = {
  label: HOME_FEATURES.label,
  title: plain(HOME_FEATURES.title),
  text: "No code, no fiddling with layouts. Just your work, shown well.",
  items: Object.values(HOME_FEATURES.items).map(({ title, text }) => ({ title, text })),
};

export const DESIGN = {
  label: HOME_DESIGN.label,
  title: plain(HOME_DESIGN.title),
  text: HOME_DESIGN.text,
  // The template the home page's styler restyles.
  template: "gallery",
  start: HOME_DESIGN.start,
};

const STEP_TEXT = [
  "Pick a layout that suits how you like to present your work. Switch any time; your content stays put.",
  "Fill in your details and work samples one section at a time. The live preview shows exactly how your website will look.",
  "Get your own address at portory.net/you to send to anyone. Edit any time and publish your changes when they’re ready.",
];

export const STEPS = {
  label: HOME_STEPS.label,
  title: plain(HOME_STEPS.title),
  text: "Three steps, and you can change anything later. Portory keeps every one of them simple.",
  // The home page's steps, worded for this page: "website", one address form
  // (portory.net/you) and curly apostrophes.
  items: HOME_STEPS.steps.map((step, i) => ({ ...step, text: STEP_TEXT[i] ?? step.text, image: STACK[i].image })),
};

export const FAQ = { label: "FAQ", title: "Questions, answered", items: HOME_FAQ.items };


export const THEME = { light: "Light", dark: "Dark" };
