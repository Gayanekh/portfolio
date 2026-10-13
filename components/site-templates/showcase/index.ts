import { defineTemplate, type FieldDefinition } from "../core/types";
import SiteFooter from "../sections/SiteFooter";
import { About, Contact, Header, Intro, Services, Work } from "./sections";
import { PROJECTS } from "./shared";

// Showcase: an image-led portfolio for photographers, UI/UX designers and
// graphic designers. Space Grotesk for headings until a font pack is picked.

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1600`;

// The sample projects: two of each discipline.
const SAMPLE_PROJECTS = [
  { title: "Quiet Light", meta: "Photography — 2026", image: photo("photo-1615751596346-9df8006e5381") },
  { title: "Pulse Analytics", meta: "UI/UX design — 2026", image: photo("photo-1551288049-bebda4e38f71") },
  { title: "Tessera Identity", meta: "Graphic design — 2025", image: photo("photo-1530435460869-d13625c69bbf") },
  { title: "After Hours", meta: "Photography — 2025", image: photo("photo-1595152772835-219674b2a8a6") },
  { title: "Lumen Mobile App", meta: "UI/UX design — 2024", image: photo("photo-1627896181038-a0cf83c86008") },
  { title: "Season Campaign", meta: "Art direction — 2024", image: photo("photo-1522199755839-a2bacb67c546") },
];

const projectDefaults = Object.fromEntries(
  SAMPLE_PROJECTS.flatMap(({ title, meta, image }, i) => [
    [`project${i + 1}Title`, title],
    [`project${i + 1}Meta`, meta],
    [`project${i + 1}Image`, image],
  ]),
);

// Images are changed in the content panel until upload arrives.
const projectImageFields: FieldDefinition[] = PROJECTS.map((n) => ({ name: `project${n}Image`, label: `Project ${n} image address` }));

export const showcaseTemplate = defineTemplate({
  id: "showcase",
  name: "Showcase",
  description:
    "An image-led portfolio for photographers, UI/UX and graphic designers: a bold introduction, a grid of projects, services, about and contact.",
  siteTitle: { section: "header", field: "siteTitle" },
  theme: "[--font-display:var(--tf-space-grotesk)]",
  sections: [
    { id: "header", label: "Header", Component: Header, defaults: { siteTitle: "Mara Ellis" } },
    {
      id: "intro",
      label: "Introduction",
      Component: Intro,
      defaults: {
        eyebrow: "Photographer & designer — Lisbon",
        title: "I make images and interfaces that feel considered.",
        text: "Portraits, products and digital work for brands that care about the details. Available for commissions and collaborations from June.",
        image: photo("photo-1609016683866-029bca027853"),
      },
      fields: [{ name: "image", label: "Image address" }],
    },
    {
      id: "work",
      label: "Work",
      menu: "Work",
      Component: Work,
      defaults: {
        title: "Selected work",
        text: "A mix of photography, product design and visual identity from the last three years.",
        ...projectDefaults,
      },
      fields: projectImageFields,
    },
    {
      id: "services",
      label: "Services",
      menu: "Services",
      Component: Services,
      defaults: {
        title: "What I do",
        service1Title: "Photography",
        service1Text: "Portraits, editorial and product photography, on location or in the studio, with retouching included.",
        service2Title: "UI/UX design",
        service2Text: "Research, wireframes and polished interfaces for apps and websites, ready for your developers.",
        service3Title: "Graphic design",
        service3Text: "Logos, visual identities, campaigns and print, built as systems that grow with your brand.",
      },
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        name: "Mara Ellis",
        title: "About me",
        text: "I'm a photographer and designer with ten years behind the camera and six in product teams. I like work where the image and the interface tell the same story.",
        clients: "Selected clients: Northwind, Oak & Ash, Fieldnotes Studio, Harbour Bank, Kinfolk Café.",
        portrait: photo("photo-1699899657675-1003c7d28f2d"),
      },
      fields: [
        { name: "name", label: "Your name" },
        { name: "portrait", label: "Portrait address" },
      ],
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        eyebrow: "Contact",
        title: "Let's make something together.",
        text: "Tell me about your project, your timeline and your budget. I reply within two working days.",
        email: "hello@maraellis.com",
      },
      fields: [{ name: "email", label: "Email" }],
    },
    { id: "footer", label: "Footer", Component: SiteFooter, defaults: { text: "© 2026 Mara Ellis" } },
  ],
});
