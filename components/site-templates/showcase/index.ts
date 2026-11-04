import { defineTemplate } from "../core/types";
import { About, Contact, Footer, Header, Intro, Services, Voices, Work } from "./sections";
import { PROJECTS, SERVICES, SOCIALS } from "./shared";

// Showcase: an image-led portfolio for photographers, UI/UX designers and
// graphic designers, in hard daylight colour. A chalk-white page, ink type,
// a cobalt accent and a sun-yellow highlighter; DM Sans for headlines and
// IBM Plex Mono for the notes in brackets, until a palette or font pack is
// picked. The sample photographs share one palette (sky blue, red, pink and
// sun-yellow under hard light), so the page reads as one body of work.

// An Unsplash photograph; `crop` keeps a part of it in a portrait frame
// (its focal point across, 0 to 1).
const photo = (id: string, width = 1600, crop?: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${width}${crop === undefined ? "" : `&h=${Math.round(width * 1.25)}&crop=focalpoint&fp-y=0.5&fp-x=${crop}`}`;

// Fields numbered by prefix (`project1Title`...), from a list of samples.
const numbered = <T extends Record<string, string>>(prefix: string, samples: T[]) =>
  Object.fromEntries(
    samples.flatMap((sample, i) => Object.entries(sample).map(([key, value]) => [`${prefix}${i + 1}${key[0].toUpperCase()}${key.slice(1)}`, value])),
  );

const SAMPLE_PROJECTS = [
  { title: "Quiet Light", meta: "Photography — 2026", image: photo("photo-1764731667840-65bcf7314075", 1400), url: "https://www.behance.net/" },
  { title: "Pulse Analytics", meta: "UI/UX design — 2026", image: photo("photo-1639682500094-09197bc6580a", 1400), url: "https://www.behance.net/" },
  { title: "Tessera Identity", meta: "Graphic design — 2025", image: photo("photo-1583324746266-6ad2266a2d89", 1400), url: "https://www.behance.net/" },
  { title: "After Hours", meta: "Photography — 2025", image: photo("photo-1653344012856-7829d501528e", 1400, 0.74), url: "https://www.behance.net/" },
  { title: "Lumen Mobile App", meta: "UI/UX design — 2024", image: photo("photo-1758758044965-1035b57a6878", 1400), url: "https://www.behance.net/" },
  { title: "Season Campaign", meta: "Art direction — 2024", image: photo("photo-1590343104492-972a3169bc98", 1400), url: "https://www.behance.net/" },
];

const SAMPLE_SERVICES = [
  {
    title: "Photography",
    text: "Portraits, editorial and campaign photography, on location or in the studio, with colour grading and retouching included.",
    tags: "Portrait · Editorial · Campaign",
    image: photo("photo-1657721526765-3605eeca5b41", 1400, 0.42),
  },
  {
    title: "UI/UX design",
    text: "Research, flows and polished interfaces for apps and websites, prototyped, tested and ready for your developers.",
    tags: "Research · Product · Prototyping",
    image: photo("photo-1568394696869-8f44d26d11bc", 1400, 0.55),
  },
  {
    title: "Graphic design",
    text: "Logos, identities, posters and print, built as systems that keep their character as your brand grows.",
    tags: "Identity · Print · Type",
    image: photo("photo-1604021633886-3172adc67ae2", 1400),
  },
];

const SAMPLE_JOBS = [
  { role: "Photographer & designer", company: "Independent", years: "2022 — Now" },
  { role: "Senior product designer", company: "Fieldnotes Studio", years: "2019 — 2022" },
  { role: "UI designer", company: "Harbour Bank", years: "2017 — 2019" },
  { role: "Photo assistant", company: "Oak & Ash", years: "2016 — 2017" },
];

const SAMPLE_VOICES = [
  {
    quote: "Mara sees the whole picture, literally. The campaign and the app finally looked like they came from the same brand.",
    name: "Inês Duarte",
    role: "Brand director, Northwind",
  },
  {
    quote: "Calm on set, precise in Figma, and always one idea ahead of the brief. We have booked her for every launch since.",
    name: "Tom Ashby",
    role: "Founder, Oak & Ash",
  },
  {
    quote: "Her identity system survived three product pivots without a single redesign. That is the best compliment I can give.",
    name: "Priya Nair",
    role: "Head of product, Fieldnotes",
  },
];

const SAMPLE_SOCIALS = [
  { label: "Instagram", url: "https://www.instagram.com/" },
  { label: "Behance", url: "https://www.behance.net/" },
  { label: "LinkedIn", url: "https://www.linkedin.com/" },
];

export const showcaseTemplate = defineTemplate({
  id: "showcase",
  name: "Showcase",
  description:
    "An image-led portfolio for photographers, UI/UX and graphic designers in hard daylight colour: a name rising letter by letter over a picture that opens to the full width, a viewfinder index of work, opening service panels, a dark About with a timeline, client voices and a signature footer.",
  siteTitle: { section: "header", field: "siteTitle" },
  theme:
    "[--card:#f1f0eb] [--foreground:#121317] [--muted-foreground:#6b6c70] [--border:#d9d8d1] [--primary:#2141d0] [--sun:#ffd43b] [--font-1:var(--tf-dm-sans)] [--font-display:var(--tf-dm-sans)] [&_.font-mono]:font-[family-name:var(--tf-plex-mono)]",
  sections: [
    {
      id: "header",
      label: "Header",
      Component: Header,
      stack: false,
      defaults: { siteTitle: "Mara Ellis", status: "Available from June" },
      fields: [{ name: "status", label: "Availability" }],
    },
    {
      id: "intro",
      label: "Introduction",
      Component: Intro,
      defaults: {
        eyebrow: "Photographer & designer — Lisbon",
        status: "Available from June",
        first: "Mara",
        last: "Ellis",
        role1: "Photography",
        role2: "UI/UX design",
        role3: "Graphic design",
        title: "I make pictures and interfaces that feel *considered*, down to the last pixel.",
        text: "Portraits, campaigns and digital products for brands that care about the details. Ten years behind the camera, six in product teams.",
        scroll: "Scroll to explore",
        image: photo("photo-1662532577856-e8ee8b138a8b", 2400),
        caption: "Red, against the sky — Comporta, 2026",
      },
      fields: [
        { name: "image", label: "Image address" },
        { name: "caption", label: "Image caption" },
      ],
    },
    {
      id: "work",
      label: "Work",
      menu: "Work",
      Component: Work,
      defaults: {
        label: "Selected work",
        title: "Recent *frames*",
        text: "Photography, product design and visual identity from the last three years: each one a collaboration, each one a little obsessive.",
        count: "Six projects, 2024 — 2026",
        ...numbered("project", SAMPLE_PROJECTS),
      },
      fields: PROJECTS.flatMap((n) => [
        { name: `project${n}Image`, label: `Project ${n} image address` },
        { name: `project${n}Url`, label: `Project ${n} link` },
      ]),
    },
    {
      id: "services",
      label: "Services",
      menu: "Services",
      Component: Services,
      defaults: {
        band1: "Photography",
        band2: "Interfaces",
        band3: "Identity",
        band4: "Art direction",
        label: "Services",
        title: "What I *do*",
        text: "Three disciplines, one way of seeing: light, structure and the details people feel before they notice them.",
        ...numbered("service", SAMPLE_SERVICES),
      },
      fields: SERVICES.map((n) => ({ name: `service${n}Image`, label: `Service ${n} image address` })),
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        label: "About",
        name: "Mara Ellis",
        portrait: photo("photo-1782786978975-f080cd7f075a", 1400),
        caption: "Mara in Alfama, Lisbon — 2026",
        title: "Ten years behind the camera taught me that *light is a material*, and interfaces are made of it too.",
        text: "I grew up between my father's darkroom and my mother's print studio. Today I split my week between shoots and product teams, and I like work where the image and the interface tell the same story.",
        fact1: "10 years of photography",
        fact2: "6 years in product teams",
        fact3: "A Leica M6, always loaded",
        fact4: "Speaks four languages",
        experienceLabel: "Experience",
        experienceSpan: "2016 — Now",
        ...numbered("job", SAMPLE_JOBS),
        clientsLabel: "Selected clients",
        clients: "Northwind · Oak & Ash · Fieldnotes Studio · Harbour Bank · Kinfolk Café · Atlas Hotels",
      },
      fields: [
        { name: "name", label: "Your name" },
        { name: "portrait", label: "Portrait address" },
      ],
    },
    {
      id: "voices",
      label: "Testimonials",
      Component: Voices,
      defaults: {
        label: "Kind words",
        title: "What it is like to *work together*",
        ...numbered("voice", SAMPLE_VOICES),
      },
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        label: "Contact",
        title: "Let's make something *together.*",
        text: "Tell me about the project, the timeline and the budget. I reply within two working days, usually with a few questions and a first idea.",
        email: "hello@maraellis.com",
        cta: "Start a project",
        copy: "Copy email",
        copied: "Copied",
        image: photo("photo-1644173391046-8cd6e6fee493", 1400),
        note: "Booking summer 2026",
        ...numbered("social", SAMPLE_SOCIALS),
      },
      fields: [
        { name: "email", label: "Email" },
        { name: "image", label: "Image address" },
        ...SOCIALS.map((n) => ({ name: `social${n}Url`, label: `Link ${n}` })),
      ],
    },
    {
      id: "footer",
      label: "Footer",
      Component: Footer,
      defaults: { text: "© 2026 Mara Ellis", credit: "Made in Portory", top: "Back to top", signature: "Mara Ellis" },
    },
  ],
});
