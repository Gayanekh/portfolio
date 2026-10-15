import { defineTemplate } from "../core/types";
import SiteFooter from "../sections/SiteFooter";
import SiteHeader from "../sections/SiteHeader";
import { About, Contact, Work } from "./sections";
import { PROJECTS } from "./shared";

// Deck: a confident portfolio for designers and studios, after the Portory
// landing page. The name beside a deck of project images that stacks as the
// page scrolls, then glides into a slider of project cards. A warm white
// page, near-black text and Inter Tight, until a palette or font pack is
// picked.

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1800`;

const SAMPLE_PROJECTS = [
  {
    title: "Fieldnotes",
    category: "Product design",
    text: "A calm note-taking app for researchers: offline first, built around quick capture and finding things again weeks later.",
    image: photo("photo-1551288049-bebda4e38f71"),
  },
  {
    title: "Oak & Ash",
    category: "Brand identity",
    text: "Identity and packaging for a family furniture workshop, built around the grain of the wood and the marks of the hand.",
    image: photo("photo-1530435460869-d13625c69bbf"),
  },
  {
    title: "Harbour Guides",
    category: "Editorial",
    text: "A quiet, editorial travel app: city guides that read like a magazine and work offline, wherever the trip goes.",
    image: photo("photo-1467232004584-a241de8bcf5d"),
  },
  {
    title: "Northwind",
    category: "Design system",
    text: "One system for four product teams: tokens, components and guidelines that made a banking app feel like one product.",
    image: photo("photo-1487014679447-9f8336841d58"),
  },
];

export const deckTemplate = defineTemplate({
  id: "deck",
  name: "Deck",
  description: "A confident portfolio for designers and studios: your name beside a deck of project images that stacks as visitors scroll, then glides into a slider of project cards.",
  siteTitle: { section: "header", field: "siteTitle" },
  theme:
    "[--card:#f6f5f2] [--foreground:#141414] [--muted-foreground:#6b6a66] [--border:#e3e1dc] [--primary:#141414] [--font-1:var(--tf-inter-tight)] [--font-display:var(--tf-inter-tight)]",
  sections: [
    { id: "header", label: "Header", Component: SiteHeader, defaults: { siteTitle: "Noa Berg" } },
    {
      id: "work",
      label: "Intro & projects",
      menu: "Work",
      Component: Work,
      defaults: {
        // The intro
        name: "Design that tells your story.",
        accent: "Noa Berg, product and brand designer.",
        text: "I help teams turn complicated ideas into clear, friendly products and brands people remember. Based in Rotterdam, working everywhere.",
        primaryLabel: "Start a project",
        primaryUrl: "mailto:hello@noaberg.com",
        secondaryLabel: "See the work",
        // The projects slider
        workTag: "Projects",
        workTitle: "Selected work",
        workIntro: "A few recent projects, each one shaped around a real problem.",
        viewLabel: "View project",
        ...Object.fromEntries(
          SAMPLE_PROJECTS.flatMap((project, i) => [
            [`project${i + 1}Title`, project.title],
            [`project${i + 1}Category`, project.category],
            [`project${i + 1}Text`, project.text],
            [`project${i + 1}Image`, project.image],
            // A placeholder link, so the card opens something; replace with the project's page.
            [`project${i + 1}Url`, "https://www.behance.net/"],
          ]),
        ),
      },
      fields: [
        { name: "primaryUrl", label: "Main button link" },
        ...PROJECTS.flatMap((n) => [
          { name: `project${n}Image`, label: `Project ${n} image address` },
          { name: `project${n}Url`, label: `Project ${n} link` },
        ]),
      ],
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        title: "About",
        text: "I'm Noa, an independent designer with ten years in studios and product teams. I work closely with founders and small teams, from the first sketch to the shipped product, and I care most about work that is clear, kind and built to last.",
      },
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        title: "Let's work together",
        text: "Have a project in mind? Write to me and I'll reply within two working days.",
        email: "hello@noaberg.com",
      },
      fields: [{ name: "email", label: "Email" }],
    },
    { id: "footer", label: "Footer", Component: SiteFooter, defaults: { text: "© Noa Berg" } },
  ],
});
