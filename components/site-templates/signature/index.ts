import { defineTemplate } from "../core/types";
import { About, Awards, Contact, Experience, Intro, Profile, Projects, Services, Stack, Voices } from "./sections";
import { AWARDS, FAN, PROJECTS, QUOTES, SERVICE_ITEMS, SERVICES, SOCIALS, TOOLS } from "./shared";

// Signature, shown as "Minimal": a one-page portfolio with a living profile
// panel pinned on the left (a breathing portrait, layers that follow the
// pointer, a turning ring of words, stickers to drag) and the work scrolling
// beside it. A warm paper page, ink text, a cobalt accent and Space Grotesk,
// until a palette or font pack is picked. Its sample content follows the
// kima.framer.media reference (a digital designer's portfolio); the photos
// are from Unsplash.
//
// It replaces the earlier Minimal template for new pages; that one stays in
// components/templates only so pages already published with it still work.

const photo = (id: string, width = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=82&w=${width}`;

// Fields numbered by prefix (`project1Title`...), from a list of samples.
const numbered = <T extends Record<string, string>>(prefix: string, samples: T[]) =>
  Object.fromEntries(
    samples.flatMap((sample, i) => Object.entries(sample).map(([key, value]) => [`${prefix}${i + 1}${key[0].toUpperCase()}${key.slice(1)}`, value])),
  );

const SAMPLE_PROJECTS = [
  { title: "Pulse", category: "Graphic Design", year: "2025", image: photo("photo-1533158326339-7f3cf2404354"), url: "https://www.behance.net/" },
  { title: "Nova", category: "Branding", year: "2025", image: photo("photo-1561070791-2526d30994b5"), url: "https://www.behance.net/" },
  { title: "Ember", category: "Branding", year: "2024", image: photo("photo-1541701494587-cb58502866ab"), url: "https://www.behance.net/" },
  { title: "Eclipse", category: "Visual Identity", year: "2024", image: photo("photo-1618005182384-a83a8bd57fbe"), url: "https://www.behance.net/" },
  { title: "Zenith", category: "Graphic Design", year: "2023", image: photo("photo-1550859492-d5da9d8e45f3"), url: "https://www.behance.net/" },
  { title: "Scarlet", category: "Web Design", year: "2023", image: photo("photo-1559028012-481c04fa702d"), url: "https://www.behance.net/" },
];

const SAMPLE_SERVICES = [
  {
    name: "Web Design",
    text: "Websites that look sharp and work hard: clear structure, considered interaction and a build-ready handoff.",
    items: ["Custom websites", "Landing pages", "UI/UX design", "Website redesigns"],
  },
  {
    name: "Branding",
    text: "Identities with a point of view, from the first mark to the guidelines that keep a brand consistent as it grows.",
    items: ["Logo design", "Visual identity systems", "Brand guidelines", "Typography & colour", "Brand assets"],
  },
  {
    name: "Graphic Design",
    text: "Everything a brand puts into the world, designed with the same care as the identity behind it.",
    items: ["Marketing materials", "Social media graphics", "Presentation design", "Print design", "Digital assets"],
  },
];

const SAMPLE_TOOLS = [
  { name: "Framer", use: "Web design" },
  { name: "Figma", use: "General design tool" },
  { name: "Photoshop", use: "Image editing" },
  { name: "Illustrator", use: "Graphic design" },
  { name: "Midjourney", use: "Asset generation" },
  { name: "Spline", use: "3D design" },
];

const SAMPLE_JOBS = [
  { role: "Senior Digital Designer", company: "Freelance", years: "2019 — Now", text: "Websites, identities and campaigns for startups and studios worldwide, from strategy to final files." },
  { role: "Digital Designer", company: "Creative Studio", years: "2015 — 2019", text: "Led web and brand projects for lifestyle and tech clients, and mentored the studio's junior designers." },
  { role: "Graphic Designer", company: "Media Agency", years: "2012 — 2015", text: "Campaign visuals, social content and print for national brands, on tight deadlines and high volume." },
  { role: "Junior Web Designer", company: "Design Agency", years: "2010 — 2012", text: "Page layouts, banners and the first full websites, learning the craft of grids, type and handoff." },
];

const SAMPLE_AWARDS = [
  { title: "Site of the Day", org: "Awwwards", year: "2025", url: "https://www.awwwards.com/" },
  { title: "Site of the Month", org: "CSS Design Awards", year: "2025", url: "https://www.cssdesignawards.com/" },
  { title: "Honorable Mention", org: "Awwwards", year: "2023", url: "https://www.awwwards.com/" },
  { title: "Design Excellence", org: "Dribbble", year: "2022", url: "https://dribbble.com/" },
  { title: "Featured Designer", org: "Behance", year: "2021", url: "https://www.behance.net/" },
];

const SAMPLE_QUOTES = [
  { text: "Kima turned a vague idea into a brand we're genuinely proud of. Creative, fast and a pleasure to work with.", name: "Emily T.", role: "Product Manager", image: photo("photo-1438761681033-6461ffad8d80", 200) },
  { text: "Clear thinking, beautiful work and no surprises. Our new site doubled sign-ups in the first month.", name: "Daniel R.", role: "Founder", image: photo("photo-1500648767791-00dcc994a43e", 200) },
  { text: "Reliable, thoughtful and full of ideas. Every detail was considered, down to the last pixel.", name: "Michael K.", role: "Creative Lead", image: photo("photo-1507003211169-0a1dd7228f2d", 200) },
  { text: "The campaign visuals were spot on. Kima understood our audience better than we did.", name: "Sarah M.", role: "Marketing Director", image: photo("photo-1494790108377-be9c29b29330", 200) },
];

export const signatureTemplate = defineTemplate({
  id: "signature",
  name: "Minimal",
  description:
    "A one-page portfolio with a living profile panel pinned on the left: a breathing portrait, layers that follow the pointer, a turning ring of words and stickers to drag, beside your projects, services, experience and contact.",
  siteTitle: { section: "profile", field: "first" },
  theme:
    "[--card:#f3efe8] [--foreground:#141414] [--muted-foreground:#6d6960] [--border:#ddd6ca] [--primary:#3a3aff] [--font-1:var(--tf-inter-tight)] [--font-display:var(--tf-space-grotesk)] [&_.font-mono]:font-[family-name:var(--tf-dm-mono)]",
  sections: [
    {
      id: "profile",
      label: "Profile panel",
      Component: Profile,
      stack: false,
      defaults: {
        first: "Kima",
        last: "Davidson",
        mark: "KD",
        role: "Digital Designer · Web, Brand & Graphic",
        location: "New York",
        coords: "40.7128° N — 74.0060° W",
        timeZone: "America/New_York",
        status: "Available for work",
        photo: photo("photo-1534528741775-53994a69daeb", 1200),
        ring: "Let's work together",
        cta: "Get in touch",
        sticker1: "Web",
        sticker2: "Brand",
        sticker3: "Graphic",
      },
      fields: [
        { name: "photo", label: "Portrait address" },
        { name: "timeZone", label: "Time zone (such as America/New_York)" },
      ],
    },
    {
      id: "intro",
      label: "Introduction",
      Component: Intro,
      defaults: {
        hello: "Hi, I'm Kima",
        statement: "I design *websites*, visual identities and *graphics* that make brands impossible to ignore.",
        text: "A New York based digital designer with 11+ years of shaping how brands look, feel and work online.",
        primary: "See my work",
        secondary: "Get in touch",
        fan1Image: photo("photo-1557672172-298e090bd0f1", 600),
        fan2Image: photo("photo-1626785774573-4b799315345d", 600),
        fan3Image: photo("photo-1572044162444-ad60f128bdea", 600),
      },
      fields: FAN.map((n) => ({ name: `fan${n}Image`, label: `Recent piece ${n} address` })),
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        label: "About me",
        title: "Design with *intent*",
        body: "I'm a digital designer based in New York with over 11 years of experience in web design, branding and graphic design.",
        body2: "I partner with founders, studios and marketing teams to build brands that are clear, consistent and memorable, and websites that turn visitors into customers.",
        image: photo("photo-1586717799252-bd134ad00e26", 1400),
        stat1Value: "11+",
        stat1Label: "Years of experience",
        stat2Value: "60+",
        stat2Label: "Clients worldwide",
        stat3Value: "100+",
        stat3Label: "Projects delivered",
        stat4Value: "97%",
        stat4Label: "Client satisfaction",
      },
      fields: [{ name: "image", label: "Studio photo address" }],
    },
    {
      id: "projects",
      label: "Projects",
      menu: "Projects",
      Component: Projects,
      defaults: {
        label: "Selected projects",
        title: "Recent *work*",
        intro: "A few favourite projects across branding, graphic and web design.",
        viewLabel: "View project",
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
        label: "Services",
        title: "What I *do*",
        intro: "Three disciplines, one consistent standard of craft.",
        ...Object.fromEntries(
          SERVICES.flatMap((n, i) => [
            [`service${n}Name`, SAMPLE_SERVICES[i].name],
            [`service${n}Text`, SAMPLE_SERVICES[i].text],
            ...SERVICE_ITEMS.map((m, j) => [`service${n}Item${m}`, SAMPLE_SERVICES[i].items[j] ?? ""]),
          ]),
        ),
      },
    },
    {
      id: "stack",
      label: "Stack",
      Component: Stack,
      defaults: { label: "Stack", title: "Tools I *trust*", ...numbered("tool", SAMPLE_TOOLS) },
      fields: TOOLS.map((n) => ({ name: `tool${n}Name`, label: `Tool ${n}` })),
    },
    {
      id: "experience",
      label: "Experience",
      menu: "Experience",
      Component: Experience,
      defaults: { label: "Experience", title: "Where I've *been*", ...numbered("job", SAMPLE_JOBS) },
    },
    {
      id: "awards",
      label: "Awards",
      Component: Awards,
      defaults: { label: "Awards", title: "Recognition", ...numbered("award", SAMPLE_AWARDS) },
      fields: AWARDS.map((n) => ({ name: `award${n}Url`, label: `Award ${n} link` })),
    },
    {
      id: "voices",
      label: "Testimonials",
      Component: Voices,
      defaults: { label: "Testimonials", title: "Kind *words*", hint: "Drag to read more →", ...numbered("quote", SAMPLE_QUOTES) },
      fields: QUOTES.map((n) => ({ name: `quote${n}Image`, label: `Quote ${n} photo address` })),
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        label: "Contact",
        title: "Let's build something *bold*",
        text: "Have a project in mind, or just want to say hello? I usually reply within a day.",
        email: "hello@kimadavidson.com",
        phone: "(123) 456 7890",
        primary: "Start a project",
        copy: "Copy email",
        copied: "Copied",
        social1Label: "Twitter / X",
        social1Url: "https://x.com/",
        social2Label: "LinkedIn",
        social2Url: "https://www.linkedin.com/",
        social3Label: "Instagram",
        social3Url: "https://www.instagram.com/",
        copyright: "© 2026 Kima Davidson. Made in Portory.",
        top: "Back to top",
      },
      fields: [
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
        ...SOCIALS.map((n) => ({ name: `social${n}Url`, label: `Link ${n} address` })),
      ],
    },
  ],
});
