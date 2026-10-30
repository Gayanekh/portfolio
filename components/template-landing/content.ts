import { HERO as HOME_HERO, STACK, TEMPLATES, TEMPLATE_PITCH } from "@/components/new-landing/content";
import { FAQ as HOME_FAQ } from "@/components/landing-next/content";
import { DESIGN as HOME_DESIGN, FEATURES as HOME_FEATURES, STEPS as HOME_STEPS } from "@/components/line-landing/content";
import { STYLE_LABEL } from "@/components/landing/sample-portfolios";
import { siteTemplateEditorHref } from "@/components/site-templates/registry";

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
  { href: "#features", label: "Features" },
  { href: "#make-it-yours", label: "Design" },
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

// What the fixed caption in the bottom right says while each section is in view.
export const CAPTIONS: Record<string, string> = {
  top: "Portfolio builder",
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

export const STEPS = {
  label: HOME_STEPS.label,
  title: plain(HOME_STEPS.title),
  text: "Three steps, and you can change anything later. Portory keeps every one of them simple.",
  items: HOME_STEPS.steps.map((step, i) => ({ ...step, image: STACK[i].image })),
};

export const FAQ = { label: "FAQ", title: "Questions, answered", items: HOME_FAQ.items };


export const THEME = { light: "Light", dark: "Dark" };
