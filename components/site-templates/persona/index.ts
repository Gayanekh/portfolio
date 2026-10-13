import { defineTemplate } from "../core/types";
import { About, Contact, Header, Hero, Projects, Services } from "./sections";
import { PROJECTS, SERVICES, SKILLS, TAGS } from "./shared";

// Persona: a calm, editorial personal portfolio for designers. A cool,
// light grey page, near-black text and Inter Tight, until a palette or font
// pack is picked. Built step by step from the design reference.

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1600`;

const SAMPLE_TAGS = ["Brand Design", "Product Design", "UX | UI", "Art Direction", "Motion & 3D", ""];
const SAMPLE_SERVICES = [
  {
    name: "Brand identity",
    text: "Names, logos, type and colour that give a business one clear voice, with guidelines that keep it consistent as it grows.",
    image: photo("photo-1530435460869-d13625c69bbf"),
    skills: ["Brand strategy", "Visual identity", "Logo design", "Typography", "Art direction", "Packaging"],
  },
  {
    name: "Product design",
    text: "Apps and platforms shaped around the people who use them, from the first flow sketch to polished, ready-to-build screens.",
    image: photo("photo-1627896181038-a0cf83c86008"),
    skills: ["UX research", "Information architecture", "Wireframing", "UI design", "Prototyping", "Usability testing"],
  },
  {
    name: "Websites",
    text: "Fast, responsive sites with a clear story and a clear next step, designed to turn a first visit into a first conversation.",
    image: photo("photo-1551288049-bebda4e38f71"),
    skills: ["Webflow", "Responsive design", "Landing pages", "Interaction design", "Content structure", "SEO basics"],
  },
  {
    name: "Design systems",
    text: "Shared components, tokens and documentation that let your team design and ship faster, without losing consistency.",
    image: photo("photo-1642132652860-471b4228023e"),
    skills: ["Design tokens", "Component libraries", "Documentation", "Accessibility", "Figma", "Design ops"],
  },
];
const SAMPLE_PROJECTS = [
  {
    title: "Northwind Private Banking",
    text: "A calmer banking app for Northwind: a new identity, a design system and the mobile experience, from the first sketch to launch.",
    image: photo("photo-1487014679447-9f8336841d58"),
  },
  {
    title: "Oak & Ash",
    text: "Identity and packaging for a family furniture workshop, built around the grain of the wood and the marks of the hand.",
    image: photo("photo-1530435460869-d13625c69bbf"),
  },
  {
    title: "Harbour Travel Guides",
    text: "A quiet, editorial travel app: city guides that read like a magazine and work offline, wherever the trip goes.",
    image: photo("photo-1467232004584-a241de8bcf5d"),
  },
  {
    title: "Lumen Design System",
    text: "One system for four product teams: tokens, components and guidelines that made Lumen's products feel like one.",
    image: photo("photo-1627896181038-a0cf83c86008"),
  },
];

export const personaTemplate = defineTemplate({
  id: "persona",
  name: "Persona",
  description: "A bold, editorial portfolio for designers: a huge name beside a black-and-white portrait crossed by a red band, with the disciplines you work in.",
  siteTitle: { section: "header", field: "siteTitle" },
  // Each section stays in place while the next one slides over it: the hero,
  // then Projects, Services, About, then Contact (the last page).
  scroll: "stack",
  theme:
    "[--card:#f8f8f8] [--foreground:#111111] [--primary:#f23a1d] [--muted-foreground:#5c5b57] [--border:#d9d7d1] [--font-1:var(--tf-inter-tight)] [--font-display:var(--tf-inter-tight)] [&_.font-mono]:font-[family-name:var(--tf-dm-mono)]",
  sections: [
    { id: "header", label: "Header", Component: Header, defaults: { siteTitle: "Lena Marlow" }, stack: false },
    {
      id: "hero",
      label: "Hero",
      menu: "Home",
      Component: Hero,
      defaults: {
        // Introduction
        name: "Lena Marlow",
        tagline: "Brands, products and everything in between. Thoughtful design, made with a little joy.",
        portrait: photo("photo-1699899657675-1003c7d28f2d"),
        ...Object.fromEntries(TAGS.map((n, i) => [`tag${n}`, SAMPLE_TAGS[i] ?? ""])),
        more: "Discover more",
        // A figure beside the tags, and a note set vertically by the portrait
        statValue: "10+",
        statLabel: "Years of experience",
        sideNote: "Independent designer, Lisbon",
      },
      fields: [
        { name: "portrait", label: "Portrait address" },
        { name: "statValue", label: "Figure" },
        { name: "statLabel", label: "Figure label" },
        { name: "sideNote", label: "Side note" },
        ...TAGS.map((n) => ({ name: `tag${n}`, label: `Tag ${n}` })),
      ],
    },
    {
      id: "projects",
      label: "Projects",
      menu: "Projects",
      Component: Projects,
      defaults: {
        title: "Projects",
        // The introduction
        subtitle: "Work that does the talking",
        intro: "A hand-picked set of brands and products I've shaped, each one built around a real problem and measured by what it changed.",
        allProjects: "View all projects",
        // A placeholder link; replace with your full portfolio.
        allProjectsUrl: "https://www.behance.net/",
        ...Object.fromEntries(
          SAMPLE_PROJECTS.flatMap((project, i) => [
            [`project${i + 1}Title`, project.title],
            [`project${i + 1}Label`, `P${i + 1}`],
            [`project${i + 1}Text`, project.text],
            [`project${i + 1}Image`, project.image],
            [`project${i + 1}Cta`, "View project"],
            // A placeholder link, so the button shows; replace with the project's page.
            [`project${i + 1}Url`, "https://www.behance.net/"],
          ]),
        ),
      },
      fields: [
        { name: "allProjectsUrl", label: "View all projects link" },
        ...PROJECTS.flatMap((n) => [
          { name: `project${n}Image`, label: `Project ${n} image address` },
          { name: `project${n}Url`, label: `Project ${n} link` },
        ]),
      ],
    },
    {
      id: "services",
      label: "Services",
      menu: "Services",
      Component: Services,
      defaults: {
        title: "Services",
        subtitle: "What I can do for you",
        intro: "From a first idea to a finished product: design that makes your brand easy to recognise and your product easy to love.",
        cta: "Book a call",
        ctaUrl: "mailto:hello@lenamarlow.com",
        ...Object.fromEntries(
          SERVICES.flatMap((n, i) => [
            [`service${n}Name`, SAMPLE_SERVICES[i]?.name ?? ""],
            [`service${n}Text`, SAMPLE_SERVICES[i]?.text ?? ""],
            [`service${n}Image`, SAMPLE_SERVICES[i]?.image ?? ""],
            ...SKILLS.map((s, j) => [`service${n}Skill${s}`, SAMPLE_SERVICES[i]?.skills[j] ?? ""]),
          ]),
        ),
      },
      fields: [
        { name: "ctaUrl", label: "Book a call link" },
        ...SERVICES.map((n) => ({ name: `service${n}Image`, label: `Service ${n} image address` })),
      ],
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        title: "About",
        // Info
        // Profile
        infoLabel: "Profile",
        photo: photo("photo-1699899657675-1003c7d28f2d"),
        // Phrases between ** and ** are marked in the accent as they are read.
        info1: "I'm Lena Marlow, a **brand and product designer** based in Lisbon, with more than **ten years** of experience across studios, startups and in-house teams.",
        info2: "I work across identity, UX, UI and design systems, helping teams make products that are clearer, more consistent and easier to use.",
        info3: "Over time my work grew from hands-on design to leading small teams, shaping how they work and mentoring designers along the way.",
        info4: "Today I work independently, partnering with companies on brands and products that balance people's needs, business goals and systems that scale.",
        // Experience
        experienceLabel: "Work Experience",
        exp1Logo: "LM.",
        exp1Company: "Independent",
        exp1Role: "Freelance and partnerships",
        exp1Dates: "2023 — Today",
        exp1Text: "Working with product teams and founders on brands and digital products that are clearer, calmer and easier to use.",
        exp2Logo: "N",
        exp2Company: "Northlight Studio",
        exp2Role: "Design Lead",
        exp2Dates: "2018 — 2023",
        exp2Text: "Led brand and product design for clients in finance, travel and culture, and set up the studio's design system practice.",
        exp3Company: "Harbour Bank",
        exp3Role: "Senior Product Designer",
        exp3Dates: "2016 — 2018",
        exp3Text: "Redesigned the mobile banking app end to end, from onboarding to payments, and built the bank's first shared component library.",
        exp4Company: "Fieldnotes",
        exp4Role: "Product Designer",
        exp4Dates: "2014 — 2016",
        exp4Text: "Designed the web and iOS apps of a note-taking startup from its first release, working closely with engineers and early users.",
        exp5Company: "Oak & Ash Studio",
        exp5Role: "Junior Brand Designer",
        exp5Dates: "2012 — 2014",
        exp5Text: "Identities, packaging and print for small businesses and cultural clients, learning the craft of type, layout and production.",
      },
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        title: "Contact",
        intro: "Have a project in mind? Write to me, and let's start with a conversation.",
        // Get in touch
        touchTitle: "Get in touch",
        touchText: "A question, an idea or a project that needs a designer? Write to me and I'll answer within two working days.",
        email: "hello@lenamarlow.com",
        // Two ways to start
        startTitle: "Start a project",
        startText: "Tell me about your brand or product, your timeline and what you'd like to change, and I'll come back with first thoughts.",
        startCta: "Send a brief",
        startUrl: "mailto:hello@lenamarlow.com?subject=New%20project",
        callTitle: "Book a call",
        callText: "Prefer to talk it through? Pick a time for a short, free call to see whether we're a good fit.",
        callCta: "Pick a time",
        callUrl: "https://calendly.com/",
        // Where to follow, with a short mark for each round link
        linkedinLabel: "LinkedIn",
        linkedinMark: "in",
        linkedinUrl: "https://www.linkedin.com/",
        instagramLabel: "Instagram",
        instagramMark: "ig",
        instagramUrl: "https://www.instagram.com/",
        behanceLabel: "Behance",
        behanceMark: "Bē",
        behanceUrl: "https://www.behance.net/",
        dribbbleLabel: "Dribbble",
        dribbbleMark: "dr",
        dribbbleUrl: "https://dribbble.com/",
        // The closing band
        closing: "Let's work together",
        closingLead: "Have a project in mind?",
        closingCta: "Say hello",
        emailLink: "E-mail",
        emailHref: "mailto:hello@lenamarlow.com",
      },
      fields: [
        { name: "email", label: "Email" },
        { name: "startUrl", label: "Send a brief link" },
        { name: "callUrl", label: "Pick a time link" },
        { name: "linkedinUrl", label: "LinkedIn address" },
        { name: "instagramUrl", label: "Instagram address" },
        { name: "behanceUrl", label: "Behance address" },
        { name: "dribbbleUrl", label: "Dribbble address" },
      ],
    },
  ],
});
