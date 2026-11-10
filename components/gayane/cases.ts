import { COLOR_PALETTES, FONT_PACKS } from "@/components/template-detail/theme-options";

// The single page of each project in the Work gallery (/gayane-khachatryan/work/<slug>),
// opened from its card. Only facts that hold: Portory is her own project (idea, design
// and code); each template is one of Portory's, designed and built by her; what a template
// contains is read from the template itself. `n` is the card's number in the Work gallery
// (components/gayane/template.ts). `ratio` is the big picture's shape from 768px up (a Tailwind class; on phones it fills its slide). The covers' template window is in their middle, so a wide 3:2 frame keeps it whole.
//
// To add pictures: put the files in public/images/gayane/<slug>/ and list them in `images` (three to five;
// they show under the sections, one wide and then in pairs). To show a mobile screenshot in place of the live
// phone view, set `mobileImage`.
//
// TODO placeholders: a text that starts with "TODO:" (use `todo()`) is a gap for her to fill. In development it
// shows, outlined, so she can see where it goes (and so do the empty picture slots); in the production build it
// is left out, and a section with nothing but TODOs is left out with it, so an unfinished placeholder never goes
// live. Replace it with her own words and it shows everywhere.

export const todo = (what: string) => `TODO: ${what}`;
export const isTodo = (text: string) => text.startsWith("TODO:");

// A section after the first four: its title, its text and, under it, pictures (`images`) or slots for them.
export interface CaseSection {
  title: string;
  text?: string[];
  // A list: each item has an optional bold lead-in ("The blank page.") and its text.
  items?: { lead?: string; text: string }[];
  images?: string[];
  slots?: number;
}

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
  // Sections that come right after About.
  afterAbout?: CaseSection[];
  // A short silent video, shown under About with its own title (mp4 and webm, a poster, the picture's size).
  video?: { title: string; mp4: string; webm: string; poster: string; width: number; height: number; label: string };
  // More sections, numbered on from the status.
  sections?: CaseSection[];
  facts: { value: string; label: string }[];
  link: { href: string; label: string };
}

const PALETTES = String(COLOR_PALETTES.length);
const FONTS = String(FONT_PACKS.length);
const ROLE = "Design & development";

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
    subtitle: "A website builder made of finished templates: pick one, make it yours, publish it.",
    image: "/images/gayane/portory-landing.webp",
    ratio: "md:aspect-[3/2]",
    phone: "/",
    about: [
      "Most people who need a website don\u2019t need a blank canvas. They need something that already looks good and only has to be made theirs. Website builders give too many choices, and coding one from scratch takes time most people don\u2019t have.",
      "Portory starts from the other end. You begin with a finished website, designed for your kind of work, and change only what makes it yours: your text, your pictures, your colors and your fonts. Then you publish it at your own address.",
    ],
    video: {
      title: "How it works",
      mp4: "/video/portory-how-it-works.mp4",
      webm: "/video/portory-how-it-works.webm",
      poster: "/video/portory-how-it-works-poster.webp",
      width: 1920,
      height: 1080,
      label: "A short video of Portory, from the landing page to publishing: browse the templates, open one, edit its text and image, change the colors and fonts, check Desktop, Tablet and Mobile, rename the page and open the publish settings.",
    },
    afterAbout: [
      {
        title: "What Portory solves",
        items: [
          { lead: "The blank page.", text: "You never start from nothing. Every template is a complete website with real structure and sample content to replace." },
          { lead: "Too many decisions.", text: "Instead of hundreds of settings, you choose a color palette and a font pairing, and the whole site restyles at once." },
          { lead: "Needing a designer or a developer.", text: "No code and no design skills are needed, and the result still looks professionally designed." },
          { lead: "Sites that break on phones.", text: "Every template is built to adapt from desktop to mobile, so you don\u2019t have to fix layouts yourself." },
        ],
      },
      {
        title: "What Portory does",
        items: [
          { text: "Gives you finished website templates, each designed for a different kind of site." },
          { text: "Lets you edit your content section by section, with a live preview." },
          { text: "Restyles the whole site from one choice of color palette and font pairing." },
          { text: "Publishes your site at your own address: portory.net/you." },
        ],
      },
    ],
    origin: [
      "Portory is my own product, created by me from the idea to the design to the code. It is not client work.",
      "This portfolio is built from one of its templates, Nocturne.",
    ],
    inside: [
      "Six templates, each with its own sample content: Nocturne, Showcase, Persona, Gallery, Minimal and Exhibition.",
      "A live preview: pick a color palette and a font pairing and the whole template restyles at once.",
      "Three steps: pick a layout, fill in your details, get your own address at portory.net/you.",
      "Free, and no code needed.",
    ],
    status: ["In active development \u2014 the editor and publishing are next."],
    sections: [
      {
        title: "Key decisions",
        items: [
          { lead: "The editor.", text: "You edit your site section by section: the template’s sections in a list, the page itself next to it, and a switch between desktop, tablet and phone to check every size." },
          { lead: "Live preview.", text: "Colors and fonts are chosen for the whole site, and the change shows on the page straight away, so you see the result before you publish." },
          { lead: "A finished website, not a blank page.", text: "Most people don’t need a blank canvas, they need something that already looks good and only has to be made theirs." },
          { lead: "One choice, not hundreds of settings.", text: "A color palette and a font pairing restyle the whole site at once and keep it consistent." },
          { lead: "Mobile from the start.", text: "Every template is built to adapt from desktop to mobile, so nobody has to fix layouts on a phone by hand." },
        ],
      },
    ],
    facts: [
      { value: "6", label: "templates" },
      { value: PALETTES, label: "color palettes" },
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
    origin: [],
    inside: [
      "Sections for UI/UX case studies, development, graphic design and photography.",
      "A Work gallery that moves sideways, with a View button that follows the cursor.",
      "Case-study sections with their key figures.",
    ],
    facts: [
      { value: "Portfolio", label: "category" },
      { value: "4", label: "disciplines in one page" },
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
    origin: [],
    inside: ["A hero, About, Work and Voices (testimonials) sections.", "Edited section by section, with a live preview."],
    facts: [
      { value: "Portfolio", label: "category" },
      { value: "4", label: "sections" },
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
    origin: [],
    inside: ["A poster hero with a large name and an accent block.", "Projects, services, About and contact sections."],
    facts: [
      { value: "Portfolio", label: "category" },
      { value: "4", label: "sections after the hero" },
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
    origin: [],
    inside: ["A slider of series with large titles and numbered blocks.", "An About peek in the corner of the first screen.", "Services, work and contact sections."],
    facts: [
      { value: "Photography", label: "category" },
      { value: "3", label: "series in the first slider" },
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
    origin: [],
    inside: ["A profile, a main page and a \"more\" section.", "Services and a list of tools."],
    facts: [
      { value: "Portfolio", label: "category" },
      { value: "3", label: "sample services" },
    ],
    link: { href: "/templates/demo/minimal", label: "View the live demo" },
  },
  {
    slug: "exhibition",
    n: 11,
    title: "Exhibition",
    kind: "Portory template",
    category: "Event template",
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
    origin: [],
    inside: ["A hero and the works of a show.", "Demo only: it cannot be edited yet."],
    facts: [
      { value: "Event", label: "category" },
      { value: "Demo", label: "for now" },
      { value: "Painters", label: "artists and galleries" },
    ],
    link: { href: "/templates/demo/exhibition", label: "View the live demo" },
  },
];

export const caseBySlug = (slug: string) => CASES.find((item) => item.slug === slug);
export const caseUrl = (slug: string) => `/gayane-khachatryan/work/${slug}`;
