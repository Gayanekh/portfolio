export * from "@/components/line-landing/content";

// What /line-lending adds to /line-landing: the rest of the Portory home
// page's sections and lines, in its own words (the intro lines under
// Features and How it works, the "Create with Portory" wall, the full footer
// and the phone bar).

export const FEATURES_LEAD = "No code, no fiddling with layouts. Just your work, shown well.";
export const STEPS_LEAD = "Three steps, and you can change anything later. Portory keeps every one of them simple.";

export const WALL = {
  lead: "Create with",
  name: "Portory",
  href: "/templates",
  label: "Browse templates",
};

export const SITE_FOOTER = {
  tagline: "A simple way to create and publish a portfolio that feels like you.",
  explore: "Explore",
  links: [
    { href: "/templates", label: "Templates" },
    { href: "/templates/gallery", label: "Gallery" },
    { href: "#make-it-yours", label: "Design" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#faq", label: "FAQ" },
  ],
  start: "Start",
  startText: "Pick a template, make it yours and publish it, all in one place.",
  top: "Back to top",
  copyright: "© 2026",
  brand: "Portory",
  rights: ". All rights reserved.",
  site: "portory.net",
};

export const PHONE_BAR = { start: { href: "/templates", label: "Get started" }, top: "Back to top" };
