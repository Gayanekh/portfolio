import { defineTemplate } from "../core/types";
import { About, Contact, Development, Graphic, Header, Hero, Photography, Uiux, Work } from "./sections";
import { DETAILS, PHOTOS, STACK, WORKS } from "./shared";

// Nocturne: a dark, editorial portfolio for creative people who work across
// disciplines (UI/UX, development, photography, graphic design). A near-black
// page with film grain, warm off-white text, an ember accent, Fraunces for
// display and DM Mono for small labels, until a palette or font pack is
// picked. Its sample content is Gayane Khachatryan's (after /gayane).

const photo = (id: string, width = 1800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=82&w=${width}`;

// Fields numbered by prefix (`work1Title`...), from a list of samples.
const numbered = <T extends Record<string, string>>(prefix: string, samples: T[]) =>
  Object.fromEntries(
    samples.flatMap((sample, i) => Object.entries(sample).map(([key, value]) => [`${prefix}${i + 1}${key[0].toUpperCase()}${key.slice(1)}`, value])),
  );

const SAMPLE_WORKS = [
  { title: "ZEMA Patients", category: "UI/UX", year: "2024–26", tags: "Web & mobile · Booking · User flows", image: photo("photo-1551650975-87deedd944c3", 1400), url: "https://www.behance.net/" },
  { title: "ZEMA Admin", category: "Product", year: "2024–26", tags: "Dashboards · Provider workflows · Data export", image: photo("photo-1551288049-bebda4e38f71", 1400), url: "https://www.behance.net/" },
  { title: "ZEMA Design System", category: "Development", year: "2025", tags: "Figma · Tailwind · NativeWind · shadcn/ui", image: photo("photo-1542831371-29b0f74f9713", 1400), url: "https://github.com/" },
  { title: "Nightfall", category: "Photography", year: "2025", tags: "Night landscapes · Armenia", image: photo("photo-1531366936337-7c912a4589a7", 1400), url: "https://www.instagram.com/" },
  { title: "Ember Festival", category: "Graphic design", year: "2024", tags: "Identity · Poster series · Motion", image: photo("photo-1541701494587-cb58502866ab", 1400), url: "https://www.behance.net/" },
  { title: "OGMA Business", category: "UI/UX", year: "2015–24", tags: "Data platforms · Dashboards · Forms", image: photo("photo-1531297484001-80022131f5a1", 1400), url: "https://www.behance.net/" },
];

const SAMPLE_CASES = [
  {
    title: "Booking care across *borders*",
    meta: "ZEMA Patients · Senior UI/UX · 2024–26",
    text: "Patient flows for a medical-tourism platform, from search and doctor profiles to pricing, booking and a dashboard, with accessible states for every form.",
    stat1Value: "4",
    stat1Label: "user roles",
    stat2Value: "60+",
    stat2Label: "screens shipped",
    stat3Value: "AA",
    stat3Label: "contrast target",
  },
  {
    title: "Tools for the people *behind* it",
    meta: "ZEMA Admin · Product design · 2024–26",
    text: "Dashboards, submission flows, user management and data export for the doctors, facilities and administrators who run the platform every day.",
    stat1Value: "−18%",
    stat1Label: "approval time",
    stat2Value: "3",
    stat2Label: "provider flows",
    stat3Value: "1",
    stat3Label: "shared system",
  },
  {
    title: "One system, *two* platforms",
    meta: "Design system · Figma & code · 2025",
    text: "Reusable components in Figma and in code (Tailwind CSS, NativeWind, shadcn/ui) that keep web and mobile consistent, with every state designed up front.",
    stat1Value: "80+",
    stat1Label: "components",
    stat2Value: "2",
    stat2Label: "platforms",
    stat3Value: "100%",
    stat3Label: "tokens in code",
  },
];

const SAMPLE_PHOTOS = [
  { image: photo("photo-1534447677768-be436bb09401", 1200), title: "Still water, midnight", exif: "24mm · f/1.4 · 15s · ISO 1600" },
  { image: photo("photo-1501862700950-18382cd41497", 1200), title: "Milky Way over the badlands", exif: "24mm · f/1.8 · 20s · ISO 3200" },
  { image: photo("photo-1525357816819-392d2380d821", 1200), title: "Arman, in the studio", exif: "85mm · f/1.8 · 1/200 · ISO 400" },
  { image: photo("photo-1519608487953-e999c86e7455", 1200), title: "After rain", exif: "35mm · f/2 · 1/60 · ISO 1600" },
  { image: photo("photo-1505765050516-f72dcac9c60e", 1200), title: "Above the cloud line", exif: "70mm · f/8 · 1/500 · ISO 100" },
  { image: photo("photo-1500462918059-b1a0cb512f1d", 1200), title: "Neon corridor", exif: "35mm · f/1.4 · 1/125 · ISO 800" },
  { image: photo("photo-1477346611705-65d1883cee1e", 1200), title: "Ridge at blue hour", exif: "50mm · f/5.6 · 1/30 · ISO 200" },
  { image: photo("photo-1478760329108-5c3ed9d495a0", 1200), title: "Storm over Aragats", exif: "35mm · f/4 · 1/250 · ISO 400" },
  { image: photo("photo-1508739773434-c26b3d09e071", 1200), title: "Last light", exif: "35mm · f/8 · 1/320 · ISO 100" },
];

const SAMPLE_STACK = ["React", "Next.js", "TypeScript", "React Native", "Tailwind CSS", "NativeWind", "shadcn/ui", "Figma", "Ant Design", "Git & GitHub", "Claude Code", "Jira"];

export const nocturneTemplate = defineTemplate({
  id: "nocturne",
  name: "Nocturne",
  description:
    "A dark, editorial portfolio for creative people who design, build, photograph and draw: an immersive hero with a colour lens, a pinned gallery of selected work, interfaces drawn in code, a live code editor, a parallax contact sheet and posters that tilt.",
  siteTitle: { section: "header", field: "siteTitle" },
  theme:
    "[--card:#0b0b0c] [--foreground:#ece7df] [--muted-foreground:#8d877e] [--border:#27262b] [--primary:#ff6a3d] [--font-1:var(--tf-inter-tight)] [--font-display:var(--tf-fraunces)] [&_.font-mono]:font-[family-name:var(--tf-dm-mono)]",
  sections: [
    {
      id: "header",
      label: "Header",
      Component: Header,
      stack: false,
      defaults: { siteTitle: "Gayane Khachatryan", mark: "GK", city: "Fullerton, CA", timeZone: "America/Los_Angeles" },
      fields: [
        { name: "city", label: "City" },
        { name: "timeZone", label: "Time zone (such as America/Los_Angeles)" },
      ],
    },
    {
      id: "hero",
      label: "Hero",
      Component: Hero,
      defaults: {
        eyebrow: "Portfolio — 2026 · Senior Product Designer",
        first: "Gayane",
        last: "Khachatryan",
        lead: "I",
        role1: "design interfaces people trust.",
        role2: "write the code behind them.",
        role3: "photograph the light after dark.",
        role4: "shape identities and type.",
        intro: "Ten years of designing complex web and mobile products, from first flow to production UI, with a camera and a sketchbook never far away.",
        scroll: "Scroll",
        image: photo("photo-1532170579297-281918c8ae72", 2000),
        index1: "UI/UX Design",
        index2: "Development",
        index3: "Photography",
        index4: "Graphic Design",
      },
      fields: [{ name: "image", label: "Portrait address" }],
    },
    {
      id: "work",
      label: "Selected work",
      menu: "Work",
      Component: Work,
      defaults: {
        label: "Selected work",
        title: "Work that *holds* together",
        intro: "Products, systems, photographs and identities. Different media, one way of working: understand the people first, then make it precise.",
        hint: "Keep scrolling",
        viewLabel: "View",
        ...numbered("work", SAMPLE_WORKS),
      },
      fields: WORKS.flatMap((n) => [
        { name: `work${n}Image`, label: `Project ${n} image address` },
        { name: `work${n}Url`, label: `Project ${n} link` },
      ]),
    },
    {
      id: "uiux",
      label: "UI/UX design",
      menu: "UI/UX",
      Component: Uiux,
      defaults: {
        label: "UI/UX design",
        title: "Interfaces people *trust*",
        intro: "Multi-role platforms, dashboards and data-heavy workflows, designed so that complicated things feel calm, with accessibility built in from the first wireframe.",
        step1Title: "Discover",
        step1Text: "Requirements, roles and the real tasks behind them.",
        step2Title: "Define",
        step2Text: "Flows, structure and the edge cases nobody mentions.",
        step3Title: "Design",
        step3Text: "Prototypes and high-fidelity UI, every state included.",
        step4Title: "Deliver",
        step4Text: "Handoff, design QA and the details in code.",
        ...numbered("case", SAMPLE_CASES),
        case1Image: photo("photo-1544005313-94ddf0286df2", 300),
      },
      fields: [{ name: "case1Image", label: "Doctor photo in the phone" }],
    },
    {
      id: "development",
      label: "Development",
      menu: "Code",
      Component: Development,
      defaults: {
        label: "Development",
        title: "Design that *ships*",
        intro: "Hands-on front-end work in React, React Native, Next.js and TypeScript, so what was designed is exactly what gets built.",
        file: "Button.tsx",
        previewLabel: "Live preview",
        principle1Title: "Tokens, not guesses",
        principle1Text: "Colours, type and spacing defined once and shared by Figma and code.",
        principle2Title: "Accessible by default",
        principle2Text: "Labels, focus, errors and contrast designed into every component state.",
        principle3Title: "AI in the workflow",
        principle3Text: "Claude Code and Copilot to explore, draft specs and review components faster.",
        stackLabel: "Stack & tools",
        ...Object.fromEntries(SAMPLE_STACK.map((name, i) => [`stack${i + 1}`, name])),
      },
      fields: STACK.map((n) => ({ name: `stack${n}`, label: `Tool ${n}` })),
    },
    {
      id: "photography",
      label: "Photography",
      menu: "Photography",
      Component: Photography,
      defaults: {
        label: "Photography",
        title: "Light, *kept*",
        intro: "Night landscapes, quiet portraits and cities after rain: photographs made slowly, mostly after the sun has gone.",
        stat1Value: "9",
        stat1Label: "series since 2018",
        stat2Value: "3",
        stat2Label: "exhibitions",
        ...numbered("photo", SAMPLE_PHOTOS),
      },
      fields: PHOTOS.flatMap((n) => [
        { name: `photo${n}Image`, label: `Photograph ${n} address` },
        { name: `photo${n}Exif`, label: `Photograph ${n} settings` },
      ]),
    },
    {
      id: "graphic",
      label: "Graphic design",
      menu: "Graphics",
      Component: Graphic,
      defaults: {
        label: "Graphic design",
        title: "Marks, posters & *type*",
        intro: "Identities, posters and type studies: the same eye for hierarchy and rhythm as in product work, with more room to play.",
        art1Title: "Ember Festival",
        art1Meta: "Poster · 2024",
        art1Word: "Ember",
        art1Detail: "24—26.07",
        art2Title: "Lumen Studio identity",
        art2Meta: "Brand · 2023",
        art2Brand: "Lumen",
        art3Title: "Sound of Colour",
        art3Meta: "Exhibition · 2025",
        art3Image: photo("photo-1614850523459-c2f4c699c52e", 1200),
        art3Words: "Sound of colour",
        art4Title: "Specimen No. 2",
        art4Meta: "Type study · 2025",
        art4Font: "Fraunces",
      },
      fields: [{ name: "art3Image", label: "Poster photo address" }],
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        label: "About",
        image: photo("photo-1499557354967-2b2d8910bcca", 1400),
        caption: "Fullerton, California — authorized to work in the U.S.",
        statement:
          "I'm a senior product designer with *ten years* of work on complex web and mobile products. I build design systems, write *front-end code*, and keep a camera close, because good design is the same thing in every medium: *care for the details.*",
        experienceLabel: "Experience",
        job1Company: "ZEMA",
        job1Role: "Senior UI/UX Designer",
        job1Years: "2024 — 2026",
        job1Text: "End-to-end experiences for a multi-role medical-tourism platform across web and mobile, and its design system in Figma and code.",
        job2Company: "OGMA",
        job2Role: "UI/UX Designer",
        job2Years: "2015 — 2024",
        job2Text: "Nine years growing from UI execution to owning complete flows for business, data and music products.",
        educationLabel: "Education",
        school1Title: "Master of Engineering",
        school1Field: "Engineering Economics & Management",
        school1Place: "State Engineering University of Armenia",
        school2Title: "Bachelor of Engineering",
        school2Field: "Microelectronics & Semiconductor Devices",
        school2Place: "State Engineering University of Armenia",
      },
      fields: [{ name: "image", label: "Portrait address" }],
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        label: "Contact",
        title: "Let's make something *remarkable.*",
        cta: "Write to me",
        email: "gayane.khachatryan@hotmail.com",
        copy: "Copy email",
        copied: "Copied",
        detail1Label: "Phone",
        detail1Value: "(714) 330-6339",
        detail1Url: "tel:+17143306339",
        detail2Label: "LinkedIn",
        detail2Value: "gayane-khachatryan",
        detail2Url: "https://www.linkedin.com/in/gayane-khachatryan-a805383ab",
        detail3Label: "Based in",
        detail3Value: "Fullerton, California",
        detail3Url: "",
        detail4Label: "Open to",
        detail4Value: "Full-time & freelance",
        detail4Url: "",
        copyright: "© 2026 Gayane Khachatryan",
        credit: "Designed and built with care, made in Portory",
        top: "Back to top",
      },
      fields: [
        { name: "email", label: "Email" },
        ...DETAILS.flatMap((n) => [
          { name: `detail${n}Value`, label: `Detail ${n}` },
          { name: `detail${n}Url`, label: `Detail ${n} link` },
        ]),
      ],
    },
  ],
});

