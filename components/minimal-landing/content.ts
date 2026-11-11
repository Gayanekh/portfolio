import { GALLERY_CATEGORIES, SHOWN_TEMPLATES, categoryLabel } from "@/components/gallery/gallery-templates";
import { TEMPLATES as PORTORY_TEMPLATES } from "@/components/new-landing/content";

// Everything the page says, in page order: Portory's own information. The
// templates are the real ones (names, who they suit, screenshots, demos).

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1400&sat=-100`;

export const BRAND = "portory";

export const NAV = [
  { href: "#templates", label: "Templates" },
  { href: "#features", label: "Features" },
  { href: "#design", label: "Design" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

// The kinds of website Portory makes today (those with a template), for the
// strip under the hero.
export const KINDS = GALLERY_CATEGORIES.filter((category) => SHOWN_TEMPLATES.some((template) => template.category === category.id)).map((category) => category.label);

export const HERO = {
  badge: { caps: "More than portfolios", italic: "a world of websites" },
  title: "Beautiful websites start with the right template",
  text: "Portfolios, photography, events and more. Pick a template, make it yours and publish it at portory.net/you.",
  action: { href: "/templates", label: "get started" },
  image: photo("photo-1531123897727-8f129e1688ce"),
};

const TAGS: Record<string, string[]> = {
  nocturne: ["Case studies", "Photography", "Dark"],
  gallery: ["Photo series", "Services"],
  showcase: ["Visual projects", "Interfaces"],
  persona: ["Portrait", "Services", "Experience"],
  signature: ["Profile", "Projects"],
  exhibition: ["Paintings", "Visit details"],
};

export const TEMPLATES = {
  italic: "our",
  caps: "templates",
  items: PORTORY_TEMPLATES.map((template) => ({ ...template, cover: `/images/covers/${template.id}.jpg`, tags: [categoryLabel(template.category), ...(TAGS[template.id] ?? []).slice(0, 2)] })),
};

export const FEATURES = {
  blocks: [
    {
      title: "Does your idea have a home online?",
      text: "Most good ideas live in folders, chats and old PDFs. Portory turns them into a beautiful website — a portfolio, a photo site, an event — made from a template designed for it.",
      points: ["Start from a template made for your kind of site", "Edit right on the page, as you see it", "Right on every screen, phones included"],
    },
    {
      title: "Can your website keep up with you?",
      text: "Your work changes, and your page should too. Switch templates whenever you like: your content stays, only the design changes.",
      points: ["Change template any time", "Drafts stay private until you publish", "Publish changes when they’re ready"],
    },
    {
      title: "What happens when you share one link?",
      text: "Every published website gets its own address, ready for your CV, your email signature and your social profiles.",
      points: ["Your own portory.net/your-name", "One link for everything you make"],
    },
  ],
  phone: "/images/stack/persona-2026-10.jpg",
};

export const DESIGN = {
  title: "Make it yours in a click",
  text: "Pick a colour palette and a font pairing, and the whole template changes with you. Every choice shows at once in the live preview.",
  stats: [
    { value: "6", label: "Templates designed for real work" },
    { value: "8", label: "Colour palettes to choose from" },
    { value: "6", label: "Font pairings, set and tested" },
    { value: "1", label: "Link to share everywhere" },
    { value: "0", label: "Lines of code to write" },
  ],
  quote: "“Pick a palette, try a font, and watch the whole page follow. Your work stays exactly where you put it.”",
  quoteBy: { name: "portory", role: "The live preview" },
  image: photo("photo-1534528741775-53994a69daeb"),
  listTitle: "What makes it yours",
  list: [
    { italic: "colour", caps: "palettes", text: "Eight palettes, from quiet paper to deep night, applied across every section at once." },
    { italic: "font", caps: "pairings", text: "Six pairings of heading and text faces, chosen to read well on every screen." },
    { italic: "live", caps: "preview", text: "Every change shows instantly, on desktop and on phone, before anyone else sees it." },
  ],
};

export const STEPS = {
  italic: "how it",
  caps: "works",
  items: [
    {
      caps: "Choose",
      italic: "a template",
      text: "Pick a layout that suits how you like to present your work. Switch any time; your content stays put.",
      tags: ["image-led", "text-led", "case studies"],
      tip: "“Not sure? Start with any template. You can change it later without losing a word.”",
      cta: { href: "/templates", label: "See the templates" },
      images: ["/images/stack/nocturne-2026-10.jpg", "/images/stack/gallery-2026-10.jpg", "/images/stack/showcase-2026-10.jpg"],
    },
    {
      caps: "Add",
      italic: "your work",
      text: "Fill in your details and work samples one section at a time. The live preview shows exactly how your page will look.",
      tags: ["projects", "experience", "services", "contact"],
      tip: "“Only your name and a headline are required. Add the rest whenever you’re ready.”",
      cta: { href: "/register", label: "Start your website" },
      images: ["/images/stack/persona-2026-10.jpg", "/images/stack/signature-2026-10.jpg", "/images/stack/exhibition-2026-10.jpg"],
    },
    {
      caps: "Publish",
      italic: "and share",
      text: "Get a portory.net address to send to anyone. Edit any time and publish your changes when they’re ready.",
      tags: ["your own link", "unpublish any time", "private drafts"],
      tip: "“Share one link on your CV, in your email signature and on your profiles.”",
      cta: { href: "/register", label: "Get started" },
      images: ["/images/stack/gallery-2026-10.jpg", "/images/stack/nocturne-2026-10.jpg", "/images/stack/persona-2026-10.jpg"],
    },
  ],
};

export const FAQ = {
  italic: "good to",
  caps: "know",
  text: "The questions people ask most before they start.",
  items: [
    { q: "Can I edit my website after publishing?", a: "Yes, as often as you like. Edits stay in your draft until you choose Publish changes, so visitors never see half-finished work." },
    { q: "Who can see my website?", a: "While it’s a draft, only you. Once published, anyone with the link can view it. You decide whether your email and phone number are shown." },
    { q: "Can I change my template later?", a: "Yes. Switch templates at any time in the editor. Your content stays the same; only the layout changes." },
    { q: "Do I need to fill in everything before publishing?", a: "No. Only your name and a headline are required. Add projects, experience and the rest whenever you’re ready." },
    { q: "What kinds of websites can I make?", a: "Portfolios, photography sites, event pages and more, with business, studio and landing-page templates on the way. Every one is edited the same simple way." },
    { q: "Who is Portory for?", a: "Anyone who wants a beautiful website without code: creatives, photographers, small businesses, event organisers, students and career changers." },
  ],
};

export const FOOTER = {
  route: { from: "from a blank page to", to: "portory.net/you" },
  italic: "let’s",
  caps: "start",
  action: { href: "/templates", label: "Get started" },
  quote: "“Your work deserves a good page. Choose a template, add what you’ve made, and share one link.”",
  tagline: "Beautiful websites, made from the right template",
  contact: { line: "portory.net", note: "Free, no code needed" },
  links: [
    { href: "/templates", label: "Templates" },
    { href: "#how", label: "How it works" },
    { href: "#faq", label: "FAQ" },
    { href: "/login", label: "Log in" },
    { href: "/register", label: "Create an account" },
  ],
  image: "/images/stack/exhibition-2026-10.jpg",
  note: "© 2026 Portory",
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};
