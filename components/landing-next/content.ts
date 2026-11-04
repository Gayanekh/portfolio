import { STACK, TEMPLATES, TEMPLATE_PITCH } from "@/components/new-landing/content";
import { STYLE_LABEL } from "@/components/landing/sample-portfolios";
import { COLOR_PALETTES, FONT_PACKS } from "@/components/template-detail/theme-options";

// Everything the new landing says, in page order; the sections only lay it
// out. Its data is the project's own: the templates from the gallery's
// catalogue (names, styles, who they suit, registry descriptions and both
// screenshots), and the editor's real palettes and font packs. *Marked*
// words are a headline's accent.

// The new world's own pages: the landing, and its templates page (the
// Portory home page keeps /templates).
export const LANDING_PAGE = "/templates/demo/exhibition";
export const TEMPLATES_PAGE = "/templates";

export const NAV = [
  { href: "#templates", label: "Templates" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#playground", label: "Playground" },
  { href: "#features", label: "Features" },
];

// Every template, with its pitch, its style's name and both screenshots.
export const ROOMS = TEMPLATES.map((template, i) => ({
  ...template,
  styleLabel: STYLE_LABEL[template.style],
  headline: TEMPLATE_PITCH[template.id]?.headline ?? template.description,
  needs: TEMPLATE_PITCH[template.id]?.needs ?? [],
  square: STACK[i].image,
}));

export const HERO = {
  label: "Portfolio builder",
  title: "Your work, *exhibited.*",
  text: "Pick a template, add your projects and publish a portfolio that looks designed. Keep editing whenever you like, even after it's live.",
  primary: { href: TEMPLATES_PAGE, label: "Start your portfolio" },
  secondary: { href: "#templates", label: "Walk the gallery" },
  facts: [`${TEMPLATES.length} real templates`, "Edit after publishing", "portory.net/you"],
  scroll: "Scroll to enter",
};

export const AUDIENCE = ["Photographers", "Designers", "Architects", "Illustrators", "Teachers", "Engineers", "Developers", "Students", "Artists"];

export const GALLERY = {
  label: "The templates",
  title: "Each one a *different room* for your work.",
  text: "Real, editable sites with their own sample content. Walk through, open a live demo, and start from the one that fits.",
  view: "View",
  demo: "Live demo",
  end: { title: "Find *yours.*", href: TEMPLATES_PAGE, label: "See every template" },
};

export const PROCESS = {
  label: "How it works",
  title: "Blank page to *published* in an afternoon.",
  steps: [
    { title: "Choose a template", text: "Start from a layout made for your kind of work. Switch any time later; your content stays put.", url: "portory.net/templates" },
    { title: "Make it say what you do", text: "Click any text and type. Add projects, photos and experience, and the live preview follows you.", url: "portory.net/editor" },
    { title: "Publish and share", text: "Choose your portory.net address and go live. Keep editing in a private draft, and publish when it's ready.", url: "portory.net/lena-marlow" },
  ],
  mock: { name: "Lena Marlow", role: "Brand & product designer", slug: "lena-marlow", publish: "Publish", live: "Live", fields: ["Name", "Headline", "Projects"] },
};

export const PLAYGROUND = {
  label: "Playground",
  title: "Change the mood *in a click.*",
  text: "The editor's own palettes and font pairings restyle every page at once. Try them on a live template.",
  template: "gallery",
  palettes: COLOR_PALETTES,
  fonts: FONT_PACKS,
  colours: "Palette",
  type: "Type",
  shuffle: "Shuffle",
  start: { href: TEMPLATES_PAGE, label: "Start with a template" },
};

export const FEATURES = {
  label: "Features",
  title: "Everything a portfolio needs. *Nothing* it doesn't.",
  items: {
    templates: { title: "Designed templates", text: "Layouts made for your kind of work, with sample content that shows the way." },
    edit: { title: "Edit on the page", text: "Click any text in the live preview and type. What you see is what visitors get.", sample: "Amara Okafor" },
    screens: { title: "Right on every screen", text: "Every template adapts to phones. Check it before you publish." },
    switch: { title: "Change template any time", text: "Your content stays; only the design changes." },
    draft: { title: "Drafts stay private", text: "Edits wait in your draft until you publish them.", states: ["Draft · only you", "Published"] },
    address: { title: "Your own address", text: "Publish to portory.net/your-name and share one link everywhere.", names: ["amara-okafor", "lena-marlow", "mara-voss", "your-name"] },
  },
};

// The same answers as the Portory home page's FAQ.
export const FAQ = {
  label: "Questions",
  title: "Good to *know.*",
  items: [
    ["Can I edit my portfolio after publishing?", "Yes, as often as you like. Edits stay in your draft until you choose Publish changes, so visitors never see half-finished work. You can also unpublish at any time and publish again later."],
    ["Who can see my portfolio?", "While it's a draft, only you. Once published, anyone with the link can view it, so don't think of a published page as private. You decide whether your email and phone number are shown."],
    ["Can I change my template later?", "Yes. Switch templates at any time in the editor. Your content stays the same; only the layout changes."],
    ["Do I need to fill in everything before publishing?", "No. Only your name and a headline are required. Add projects, experience and the rest whenever you're ready."],
    ["Who is Portory for?", "Anyone who wants to show their work: teachers, photographers, consultants, nurses, engineers, students, career changers, and people who simply want a good page about what they do."],
  ] as [string, string][],
};

export const CLOSING = {
  label: "Your turn",
  title: "Start your *portfolio.*",
  field: "Choose your address",
  domain: "portory.net/",
  placeholder: "your-name",
  button: "Get started",
  href: TEMPLATES_PAGE,
  note: "You choose it when you publish; nothing is reserved yet.",
};

export const FOOTER = {
  tagline: "A simple way to create and publish a portfolio that feels like you.",
  links: [
    { href: TEMPLATES_PAGE, label: "Templates" },
    { href: "/templates/gallery", label: "Gallery" },
    { href: "/", label: "Portory home" },
  ],
  copyright: "© 2026 Portory",
  top: "Back to top",
};

// The new world's templates page: every template the Portory templates page
// shows (the same catalogue), with the same style filters and actions.
export const CATALOGUE = {
  label: "The templates",
  title: "Pick a *room* for your work.",
  text: "Every Portory template, live. Preview any of them in a new tab, or open the one that fits in the editor and make it yours.",
  back: { href: LANDING_PAGE, label: "Back to Portory" },
  filter: "Filter by style",
  results: ["template", "templates"],
  preview: "Preview",
  use: "Use template",
  progress: "In progress",
};
