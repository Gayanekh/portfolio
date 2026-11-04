import { FAQ as EXHIBIT_FAQ, FEATURES as EXHIBIT_FEATURES, PLAYGROUND, ROOMS } from "@/components/landing-next/content";
import { HERO as HOME_HERO, TEMPLATES_INTRO } from "@/components/new-landing/content";

// Everything /line-landing says: the Portory home page's own sections and
// copy (its hero, templates, features, design, how it works, FAQ, address
// and footer), in the Exhibit look. Only the *accent* marks are added: the
// words a headline sets in the glowing serif. The templates, palettes and
// fonts are the project's real data.

export { ROOMS };

export const NAV = [
  { href: "#templates", label: "Templates" },
  { href: "#features", label: "Features" },
  { href: "#make-it-yours", label: "Design" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export const HERO = {
  label: "Portfolio builder",
  title: `${HOME_HERO.title} *${HOME_HERO.accent}*`,
  text: HOME_HERO.text,
  primary: HOME_HERO.primary,
  secondary: { href: "#templates", label: "See the templates" },
  account: { lead: "Already have an account?", href: "/login", label: "Log in" },
  facts: ["Templates for every kind of work", "Edit anytime, even after publishing", "Your own portory.net address"],
  showing: "Now showing",
  palette: "Palette",
  published: "Published",
  address: "portory.net/lena-marlow",
  autoplayMs: 3800,
};

export const TEMPLATES = {
  label: "Templates",
  title: "Templates for *every kind* of work",
  text: "Real, editable templates, each with its own sample content. Select a card to open its demo.",
  made: "Made for",
  needs: "Works best with",
  preview: "Preview",
  use: "Use template",
  all: { href: "/templates", label: "See all templates" },
  autoplayMs: TEMPLATES_INTRO.autoplayMs,
};

// The home page's six features, in the Exhibit bento.
export const FEATURES = {
  ...EXHIBIT_FEATURES,
  label: "Features",
  title: "Everything you need to *present your work*",
  items: {
    templates: { ...EXHIBIT_FEATURES.items.templates, title: "Designed templates", text: "Start from a layout made for your kind of work, with sample content to show the way." },
    edit: { ...EXHIBIT_FEATURES.items.edit, title: "Edit on the page", text: "Click any text in the live preview and type. What you see is what visitors get." },
    screens: { ...EXHIBIT_FEATURES.items.screens, title: "Right on every screen", text: "Every template adapts to phones. Check it in the phone preview before you publish." },
    switch: { ...EXHIBIT_FEATURES.items.switch, title: "Change template any time", text: "Switch layouts whenever you like. Your content stays the same; only the design changes." },
    draft: { ...EXHIBIT_FEATURES.items.draft, title: "Drafts stay private", text: "Edits stay in your draft until you publish them, so visitors never see half-finished work." },
    address: { ...EXHIBIT_FEATURES.items.address, title: "Your own address", text: "Publish to portory.net/your-name and share one link everywhere." },
  },
};

// The home page's "Make it yours" (its Design section).
export const DESIGN = {
  ...PLAYGROUND,
  label: "Design",
  title: "Make it yours *in a click*",
  text: "Pick a colour palette and a font pairing, and the whole template changes with you. Try it on a real template.",
  start: { href: "/templates", label: "Get started" },
};

// The home page's How it works, each step with its link.
export const STEPS = {
  label: "How it works",
  title: "From blank page to *published link*",
  steps: [
    { title: "Choose a template", text: "Pick a layout that suits how you like to present your work. Switch any time; your content stays put.", url: "portory.net/templates", cta: { href: "/templates", label: "See the templates" } },
    { title: "Add your information and work", text: "Fill in your details and work samples one section at a time. The live preview shows exactly how your page will look.", url: "portory.net/editor", cta: { href: "/register", label: "Start your portfolio" } },
    { title: "Publish and share", text: "Get a portory.net address to send to anyone. Edit any time and publish your changes when they're ready.", url: "portory.net/lena-fischer", cta: { href: "/register", label: "Get started" } },
  ],
};

export const FAQ = { ...EXHIBIT_FAQ, label: "FAQ", title: "Questions, *answered*" };

// The home page's "Claim your portory.net address".
export const CLAIM = {
  label: "Your address",
  title: "Claim your *portory.net* address",
  field: "Type the name you want",
  domain: "portory.net/",
  placeholder: "your-name",
  button: "Get started",
  href: "/templates",
  note: "Every published portfolio gets its own link, ready for your CV, your email signature or your social profiles. You choose it when you publish.",
};

export const FOOTER = {
  tagline: "A simple way to create and publish a portfolio that feels like you.",
  links: [
    { href: "/templates", label: "Templates" },
    { href: "/templates/gallery", label: "Gallery" },
    { href: "#make-it-yours", label: "Design" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#faq", label: "FAQ" },
  ],
  copyright: "© 2026 Portory. All rights reserved.",
  top: "Back to top",
};
