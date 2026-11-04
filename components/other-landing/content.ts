import { HERO as HOME_HERO, TEMPLATES as HOME_TEMPLATES, TEMPLATE_PITCH } from "@/components/new-landing/content";
import { FAQ as SITE_FAQ } from "@/components/minimal-landing/content";
import { FEATURES as HOME_FEATURES, STEPS as HOME_STEPS } from "@/components/line-landing/content";
import { categoryLabel } from "@/components/gallery/gallery-templates";
import { COLOR_PALETTES, FONT_PACKS } from "@/components/template-detail/theme-options";

// Everything /other-landing says, in page order; the sections only lay it
// out. The page follows the Framewell reference's sections (works, about,
// services, testimonials, stats, features, process, pricing, contact) and
// fills each with Portory's own content: the real templates, palettes, fonts,
// features, steps and FAQ. Where the reference has something Portory doesn't
// (client quotes, a blog, prices), the section tells a true Portory thing
// instead. Its words follow /template-landing's where the two pages share a
// section (the user asked for it). Words between *stars* are set in the
// serif italic.

export const START = HOME_HERO.primary;

export const NAV = [
  { href: "#templates", label: "Templates" },
  { href: "#make-it-yours", label: "Design" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export const HERO = {
  lines: ["Your website,", "*already* designed."],
  text: "Pick a template made for your kind of work, make it yours and publish it at portory.net/you.",
  primary: START,
  secondary: { href: "#templates", label: "See the templates" },
  // /template-landing's hero picture: the Exhibition template's cover.
  picture: { src: "/images/templates/exhibition-2026-10.jpg", name: "Exhibition" },
};

// The real templates, each with its opening-screen screenshot (the page
// builds the cover from it) and its tags: its category, then what it works
// best with. Demos open in a new tab.
export const WORKS = {
  label: "Templates",
  items: HOME_TEMPLATES.map((template) => ({
    id: template.id,
    name: template.name,
    tags: [categoryLabel(template.category), ...(TEMPLATE_PITCH[template.id]?.needs ?? []).slice(0, 2)],
    screen: template.image,
    href: template.href,
  })),
  all: { href: "/templates", label: "See all templates" },
};

// /template-landing's Make it yours: the home page's copy, on the template
// the home page's styler restyles.
export const DESIGN = {
  label: "Design",
  title: ["Make it yours", "in a *click.*"],
  text: "Pick a colour palette and a font pairing, and the whole template changes with you. Try it on a real template.",
  template: "gallery",
  start: START,
  shuffle: "Shuffle",
};

// The reference's client quotes, as each template's own pitch: what it says,
// and who it is made for.
export const MADE_FOR = {
  label: "Made for",
  title: "Made for every kind of *work*",
  items: HOME_TEMPLATES.map((template) => ({
    id: template.id,
    quote: (TEMPLATE_PITCH[template.id]?.headline ?? template.description).replace(/'/g, "’"),
    name: template.name,
    role: template.bestFor,
    image: `/images/stack/${template.id}-2026-10.jpg`,
  })),
};

export const NUMBERS = {
  label: "In numbers",
  title: ["Ready-made,", "made *yours*"],
  items: [
    { value: HOME_TEMPLATES.length, suffix: "", label: "Templates to start from" },
    { value: COLOR_PALETTES.length, suffix: "", label: "Colour palettes" },
    { value: FONT_PACKS.length, suffix: "", label: "Font pairings" },
    { value: 1, suffix: "", label: "Link to share everywhere" },
  ],
};

const feature = <Id extends keyof typeof HOME_FEATURES.items>(id: Id) => ({ id, title: HOME_FEATURES.items[id].title, text: HOME_FEATURES.items[id].text });

// Five cards, as in the reference; the tall one in the middle is the address.
export const FEATURES = {
  label: "Features",
  title: ["Five ways your", "website looks *designed.*"],
  items: [feature("screens"), feature("switch"), feature("address"), feature("edit"), feature("draft")],
};

// /template-landing's How it works: its titles (the last word soft) and its
// second link.
const STEP_TITLES = ["Choose a *template.*", "Add your *work.*", "Publish and *share.*"];
export const STEPS = {
  label: "How it works",
  title: ["From blank page", "to *published link.*"],
  items: HOME_STEPS.steps.map((step, i) => ({ ...step, title: STEP_TITLES[i], cta: i === 1 ? { href: "/register", label: "Start your website" } : step.cta })),
};

// /template-landing's questions: worded for websites, led by the price.
export const FAQ = {
  label: "FAQ",
  title: "Good to *know.*",
  items: [
    ["Is Portory free?", "Yes, it’s free to start: choose a template, make it yours and publish it at portory.net/you without paying anything."],
    ...SITE_FAQ.items.map(({ q, a }) => [q, a]),
  ] as [string, string][],
};

// The closing call, after the reference the user gave: a large question on
// the right half, a line, an underlined link, then one centred line inviting
// a look at the templates first.
export const CLOSING = {
  title: ["Want a website", "that feels", "like you?"],
  text: "Pick a designed template, add your work and publish it at your own portory.net address.",
  start: { href: START.href, label: "Start now" },
  more: { href: "/templates", label: "or see the templates first!" },
};

export const CONTACT = {
  title: "Get started",
  href: START.href,
  text: ["Beautiful websites, made from the right template.", "Free to start, no code needed."],
  copyright: "© 2026 Portory. All rights reserved.",
  links: [
    { href: "/templates", label: "Templates" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#faq", label: "FAQ" },
    { href: "/login", label: "Log in" },
  ],
};
