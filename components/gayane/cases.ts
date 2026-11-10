import { COLOR_PALETTES, FONT_PACKS } from "@/components/template-detail/theme-options";

// The single page of each project in the Work gallery (/gayane-khachatryan/work/<slug>),
// opened from its card. Only facts that hold: Portory is her own project (idea, design
// and code); each template is one of Portory's, designed and built by her; what a template
// contains is read from the template itself. `n` is the card's number in the Work gallery
// (components/gayane/template.ts). `ratio` is the big picture's shape from 768px up (a Tailwind class; on phones it fills its slide). The covers' template window is in their middle, so a wide 3:2 frame keeps it whole.
//
// To add pictures: put the files in public/images/gayane/ and list them in `images`
// (they show under the first two, one wide and then in pairs). To show a mobile
// screenshot in place of the live phone view, set `mobileImage`.

export interface Case {
  slug: string;
  n: number;
  title: string;
  kind: string;
  category: string;
  year: string;
  role: string;
  tags: string;
  subtitle: string;
  image: string;
  ratio: string;
  // The live page shown in the phone beside the big picture (a path on this site): the bare template, without the demo's "Use this template" button.
  phone: string;
  mobileImage?: string;
  images?: string[];
  about: string[];
  origin: string[];
  inside: string[];
  // Where the project stands, when it is not finished: its own short section.
  status?: string[];
  facts: { value: string; label: string }[];
  link: { href: string; label: string };
}

const PALETTES = String(COLOR_PALETTES.length);
const FONTS = String(FONT_PACKS.length);
const ROLE = "Design & development";

// What every template page says about where the template comes from.
const origin = (name: string, extra: string): string[] => [
  `${name} is one of the website templates in Portory, my own project. I designed it and built it in code: its layout, its motion and the way it adapts from desktop to phone.`,
  extra,
];

export const CASES: Case[] = [
  {
    slug: "portory",
    n: 1,
    title: "Portory",
    kind: "My own product",
    category: "Product",
    year: "2026",
    role: ROLE,
    tags: "Website templates · Design · Code",
    subtitle: "A website template platform I came up with, designed and built myself.",
    image: "/images/gayane/portory-landing.webp",
    ratio: "md:aspect-[3/2]",
    phone: "/",
    about: [
      "Portory gives people a finished website instead of a blank page. You pick a template made for your kind of work, make it yours (colours, fonts, text and pictures, with a live preview) and publish it at your own address, portory.net/you. No code needed.",
      "I designed and built every part of it: the landing page you see here, the editor, and the templates people start from.",
    ],
    origin: [
      "Portory is my own page, created by me from the idea to the design to the code. It is not client work.",
      "This portfolio is built from one of its templates, Nocturne.",
    ],
    inside: [
      "Six templates, each with its own sample content: Nocturne, Showcase, Persona, Gallery, Minimal and Exhibition.",
      "A live preview: pick a colour palette and a font pairing and the whole template restyles at once.",
      "Three steps: pick a layout, fill in your details, get your own address at portory.net/you.",
      "Free, and no code needed.",
    ],
    status: ["Portory is a work in progress. Its functionality and database are still being developed."],
    facts: [
      { value: "6", label: "templates" },
      { value: PALETTES, label: "colour palettes" },
      { value: FONTS, label: "font pairings" },
      { value: "1", label: "address for each site: portory.net/you" },
    ],
    link: { href: "/", label: "Visit Portory" },
  },
  {
    slug: "nocturne",
    n: 6,
    title: "Nocturne",
    kind: "Portory template",
    category: "Portfolio template",
    year: "2026",
    role: ROLE,
    tags: "Portory · UI/UX, development, photography & graphic design",
    subtitle: "A dark, cinematic portfolio for people who do more than one thing.",
    image: "/images/landing-covers/nocturne-cover-b.webp",
    ratio: "md:aspect-[3/2]",
    phone: "/templates/preview/nocturne/frame",
    about: [
      "Made for UI/UX designers, developers, photographers and graphic designers: one page with a section for each discipline, so a visitor sees the whole range of someone's work in one scroll.",
      "Its Work gallery moves sideways as you scroll, and a round View button follows the cursor over each project.",
    ],
    origin: origin("Nocturne", "It is also the template this portfolio is made from."),
    inside: [
      "Sections for UI/UX case studies, development, graphic design and photography.",
      "A Work gallery that moves sideways, with a View button that follows the cursor.",
      "Case-study sections with their key figures.",
    ],
    facts: [
      { value: "Portfolio", label: "category" },
      { value: "4", label: "disciplines in one page" },
      { value: PALETTES, label: "colour palettes" },
      { value: FONTS, label: "font pairings" },
    ],
    link: { href: "/templates/demo/nocturne", label: "View the live demo" },
  },
  {
    slug: "showcase",
    n: 7,
    title: "Showcase",
    kind: "Portory template",
    category: "Portfolio template",
    year: "2026",
    role: ROLE,
    tags: "Portory · Photographers, UI/UX & graphic designers",
    subtitle: "A clean portfolio that puts the work first.",
    image: "/images/landing-covers/showcase-cover-e.webp",
    ratio: "md:aspect-[3/2]",
    phone: "/templates/preview/showcase/frame",
    about: [
      "Made for photographers, UI/UX designers and graphic designers who want the work to do the talking.",
      "It opens on a hero, then an About section, the Work, and a Voices section for what clients say.",
    ],
    origin: origin("Showcase", "Its sample content is placeholder text and pictures, there to be replaced by the owner's own."),
    inside: ["A hero, About, Work and Voices (testimonials) sections.", "Edited section by section, with a live preview."],
    facts: [
      { value: "Portfolio", label: "category" },
      { value: "4", label: "sections" },
      { value: PALETTES, label: "colour palettes" },
      { value: FONTS, label: "font pairings" },
    ],
    link: { href: "/templates/demo/showcase", label: "View the live demo" },
  },
  {
    slug: "persona",
    n: 8,
    title: "Persona",
    kind: "Portory template",
    category: "Portfolio template",
    year: "2026",
    role: ROLE,
    tags: "Portory · Brand & product designers",
    subtitle: "A poster-style portfolio for brand and product designers.",
    image: "/images/landing-covers/persona-cover-c.webp",
    ratio: "md:aspect-[3/2]",
    phone: "/templates/preview/persona/frame",
    about: [
      "Made for brand and product designers. Its hero is a poster: the name set huge beside a wide accent block, with a few lines about what you do on the left.",
      "Below it come the projects, the services, an About section and contact.",
    ],
    origin: origin("Persona", "Its accent block takes whichever colour palette the owner picks."),
    inside: ["A poster hero with a large name and an accent block.", "Projects, services, About and contact sections."],
    facts: [
      { value: "Portfolio", label: "category" },
      { value: "4", label: "sections after the hero" },
      { value: PALETTES, label: "colour palettes" },
      { value: FONTS, label: "font pairings" },
    ],
    link: { href: "/templates/demo/persona", label: "View the live demo" },
  },
  {
    slug: "gallery",
    n: 9,
    title: "Gallery",
    kind: "Portory template",
    category: "Photography template",
    year: "2026",
    role: ROLE,
    tags: "Portory · Photographers & artists",
    subtitle: "A photography portfolio built around one picture at a time.",
    image: "/images/landing-covers/gallery-cover-c.webp",
    ratio: "md:aspect-[3/2]",
    phone: "/templates/preview/gallery/frame",
    about: [
      "Made for photographers and artists. The first screen is a slider of series: a huge title over a grey panel, a picture on the right, numbered blocks to move between them, and a short About in the corner.",
      "The rest of the page carries the services, the work and the contact.",
    ],
    origin: origin("Gallery", "Its sample content is a portrait photographer's portfolio, there to be replaced by the owner's own."),
    inside: ["A slider of series with large titles and numbered blocks.", "An About peek in the corner of the first screen.", "Services, work and contact sections."],
    facts: [
      { value: "Photography", label: "category" },
      { value: "3", label: "series in the first slider" },
      { value: PALETTES, label: "colour palettes" },
      { value: FONTS, label: "font pairings" },
    ],
    link: { href: "/templates/demo/gallery", label: "View the live demo" },
  },
  {
    slug: "minimal",
    n: 10,
    title: "Minimal",
    kind: "Portory template",
    category: "Portfolio template",
    year: "2026",
    role: ROLE,
    tags: "Portory · Web, brand & graphic designers",
    subtitle: "A quiet, light portfolio with room to breathe.",
    image: "/images/landing-covers/minimal-cover-c.webp",
    ratio: "md:aspect-[3/2]",
    phone: "/templates/preview/signature/frame",
    about: [
      "Made for web, brand and graphic designers. A light page with a profile, the main work and a section with more, and a list of the tools the designer uses.",
      "The sample content shows three services: web design, branding and graphic design.",
    ],
    origin: origin("Minimal", "Its sample content is a designer's portfolio, there to be replaced by the owner's own."),
    inside: ["A profile, a main page and a \"more\" section.", "Services and a list of tools."],
    facts: [
      { value: "Portfolio", label: "category" },
      { value: "3", label: "sample services" },
      { value: PALETTES, label: "colour palettes" },
      { value: FONTS, label: "font pairings" },
    ],
    link: { href: "/templates/demo/minimal", label: "View the live demo" },
  },
  {
    slug: "exhibition",
    n: 11,
    title: "Exhibition",
    kind: "Portory template",
    category: "Events template",
    year: "2026",
    role: ROLE,
    tags: "Portory · Painters, artists & galleries",
    subtitle: "An artist's show, laid out as a website.",
    image: "/images/landing-covers/exhibition-cover-b.webp",
    ratio: "md:aspect-[3/2]",
    phone: "/templates/demo/exhibition",
    about: [
      "Made for painters, artists and galleries who want to present a show: after the hero, the works settle into their frame.",
      "For now it is a demo only: it has no editor yet.",
    ],
    origin: origin("Exhibition", "Of Portory's templates it is the only one that is a demo for now."),
    inside: ["A hero and the works of a show.", "Demo only: it cannot be edited yet."],
    facts: [
      { value: "Events", label: "category" },
      { value: "Demo", label: "status: no editor yet" },
      { value: "Painters", label: "artists and galleries" },
      { value: "1", label: "of Portory's templates, so far, without an editor" },
    ],
    link: { href: "/templates/demo/exhibition", label: "View the live demo" },
  },
];

export const caseBySlug = (slug: string) => CASES.find((item) => item.slug === slug);
export const caseUrl = (slug: string) => `/gayane-khachatryan/work/${slug}`;
