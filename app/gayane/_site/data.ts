// Gayane Khachatryan's CV as the data for her portfolio site (/gayane).
// Every page reads from here, so a change to the CV is made once.

const photo = (id: string, w = 1800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

export const BASE = "/gayane";

export const PERSON = {
  name: "Gayane Khachatryan",
  first: "Gayane",
  last: "Khachatryan",
  role: "Senior Product Designer",
  headline: "UI/UX & Design-to-Code",
  location: "Fullerton, CA",
  work: "Authorized to work in the U.S.",
  email: "gayane.khachatryan@hotmail.com",
  phone: "(714) 330-6339",
  phoneHref: "tel:+17143306339",
  linkedin: "https://www.linkedin.com/in/gayane-khachatryan-a805383ab",
  // Replace with a real portrait (any image address).
  portrait: photo("photo-1498050108023-c5249f4df085", 1200),
  intro: "I'm a Senior Product Designer with 10+ years of experience designing complex web and mobile products.",
};

export const SUMMARY = [
  "Senior UI/UX & Product Designer with 10+ years of experience designing complex web and mobile products, including multi-role platforms, dashboards, and data-heavy workflows.",
  "Builds and maintains design systems and brings hands-on front-end skills in React, React Native, Next.js, and TypeScript, working closely with engineers to keep design and implementation consistent.",
  "Designs with accessibility in mind and uses AI-assisted design-to-code workflows.",
];

export const ABOUT_IMAGES = [photo("photo-1522199755839-a2bacb67c546", 1200), photo("photo-1487014679447-9f8336841d58", 1200)];

export type Work = {
  slug: string;
  title: string;
  tags: string;
  image: string;
  company: string;
  years: string;
  industry: string;
  statement: string;
  done: string[];
};

// The work, grouped by what was designed (from the CV's experience).
export const WORKS: Work[] = [
  {
    slug: "zema-patient",
    title: "ZEMA Patients",
    tags: "Web & Mobile, Product Design, User Flows, Booking",
    image: photo("photo-1576091160550-2173dba999ef"),
    company: "ZEMA",
    years: "2024 – 2026",
    industry: "Healthcare, Medical tourism",
    statement: "A multi-role medical-tourism platform, designed end to end for patients across web and mobile, from requirements and user flows to production-ready UI.",
    done: [
      "Designed patient-facing flows: landing and search, doctor and facility profiles, treatments and procedures, pricing, booking, notifications, and the patient dashboard.",
      "Designed accessible form and component states (clear labels, validation, focus, error, disabled, success) with attention to color contrast, hierarchy, and touch-target sizing.",
      "Collaborated with product managers, business analysts, frontend and backend engineers, and QA through requirements, design reviews, and design QA of built features.",
    ],
  },
  {
    slug: "zema-admin",
    title: "ZEMA Admin",
    tags: "Dashboards, Admin Tools, Provider Workflows",
    image: photo("photo-1551288049-bebda4e38f71"),
    company: "ZEMA",
    years: "2024 – 2026",
    industry: "Healthcare, Platform administration",
    statement: "Admin and provider workflows for the same platform: the tools doctors, healthcare facilities and administrators use every day.",
    done: [
      "Designed admin and provider workflows, including admin dashboards, doctor and facility submission flows, user management, and data export.",
      "Contributed to production UI implementation in React, React Native, Next.js, and TypeScript, working closely with engineers to maintain consistency between design and implementation.",
    ],
  },
  {
    slug: "zema-design-system",
    title: "Design System",
    tags: "Figma, Tailwind CSS, NativeWind, shadcn/ui",
    image: photo("photo-1517694712202-14dd9538aa97"),
    company: "ZEMA",
    years: "2024 – 2026",
    industry: "Design systems, Design-to-code",
    statement: "Reusable design-system components in Figma and in code, keeping the UI consistent across web and mobile.",
    done: [
      "Built and maintained reusable design-system components in Figma and code (Tailwind CSS, NativeWind, shadcn/ui) to keep UI consistent across web and mobile.",
      "Used AI-assisted workflows (Claude, Claude Code, ChatGPT, GitHub Copilot) to explore UI alternatives, draft specs and acceptance criteria, and generate, review, and debug React and React Native components.",
    ],
  },
  {
    slug: "ogma-business",
    title: "OGMA Business",
    tags: "Data Platforms, Dashboards, Data Tables, Forms",
    image: photo("photo-1460925895917-afdab827c52f"),
    company: "OGMA",
    years: "2015 – 2024",
    industry: "Business & data management",
    statement: "Dashboards, admin tools and operational workflows for information-dense business and data-management products.",
    done: [
      "Designed dashboards, admin tools, data tables, forms, and operational workflows for information-dense business products.",
      "Translated business and client requirements into user flows, wireframes, interactive prototypes, and high-fidelity UI for desktop, tablet, and mobile.",
      "Created reusable UI patterns and consistent components that supported implementation across multiple products.",
    ],
  },
  {
    slug: "ogma-apps",
    title: "OGMA Apps",
    tags: "Mobile Apps, Music Platforms, Responsive Web",
    image: photo("photo-1499951360447-b19be8fe80f5"),
    company: "OGMA",
    years: "2015 – 2024",
    industry: "Music, Consumer mobile",
    statement: "Responsive web and mobile products across several domains, including music platforms and mobile applications.",
    done: [
      "Designed responsive web and mobile products across multiple domains, including business and data-management platforms, music platforms, and mobile applications.",
      "Grew over nine years from UI execution to owning complete flows, interaction design, prototypes, and final interfaces for web and mobile products.",
      "Worked with clients, stakeholders, and frontend and backend engineers to refine requirements, review designs, and support implementation through handoff.",
    ],
  },
];

export const EXPERIENCE = [
  {
    company: "ZEMA",
    years: "2024 – 2026",
    role: "Senior UI/UX Designer",
    place: "Armenia",
    points: [
      "Designed end-to-end experiences for a multi-role medical-tourism platform serving patients, doctors, healthcare facilities, and administrators across web and mobile, from requirements and user flows to production-ready UI.",
      "Designed patient-facing flows: landing and search, doctor and facility profiles, treatments and procedures, pricing, booking, notifications, and the patient dashboard.",
      "Designed admin and provider workflows, including admin dashboards, doctor and facility submission flows, user management, and data export.",
      "Built and maintained reusable design-system components in Figma and code (Tailwind CSS, NativeWind, shadcn/ui) to keep UI consistent across web and mobile.",
      "Contributed to production UI implementation in React, React Native, Next.js, and TypeScript, working closely with engineers to maintain consistency between design and implementation.",
      "Collaborated with product managers, business analysts, frontend and backend engineers, and QA through requirements, design reviews, and design QA of built features.",
      "Designed accessible form and component states (clear labels, validation, focus, error, disabled, success) with attention to color contrast, hierarchy, and touch-target sizing.",
      "Used AI-assisted workflows (Claude, Claude Code, ChatGPT, GitHub Copilot) to explore UI alternatives, draft specs and acceptance criteria, and generate, review, and debug React and React Native components.",
    ],
  },
  {
    company: "OGMA",
    years: "2015 – 2024",
    role: "UI/UX Designer",
    place: "Armenia",
    points: [
      "Grew over nine years from UI execution to owning complete flows, interaction design, prototypes, and final interfaces for web and mobile products.",
      "Designed responsive web and mobile products across multiple domains, including business and data-management platforms, music platforms, and mobile applications.",
      "Designed dashboards, admin tools, data tables, forms, and operational workflows for information-dense business products.",
      "Translated business and client requirements into user flows, wireframes, interactive prototypes, and high-fidelity UI for desktop, tablet, and mobile.",
      "Created reusable UI patterns and consistent components that supported implementation across multiple products.",
      "Worked with clients, stakeholders, and frontend and backend engineers to refine requirements, review designs, and support implementation through handoff.",
    ],
  },
];

export type SkillGroup = { id: string; title: string; text: string; items: string[] };

export const SKILLS: SkillGroup[] = [
  {
    id: "product",
    title: "Product & UX",
    text: "From requirements to flows, structure and prototypes, for complex workflows and data-heavy screens.",
    items: ["Product Design", "Interaction Design", "Information Architecture", "User Flows", "Wireframing", "Prototyping", "Complex Workflows", "Dashboards & Data-Heavy UI", "Responsive & Mobile Design"],
  },
  {
    id: "systems",
    title: "Design Systems & Accessibility",
    text: "Component libraries and reusable patterns, designed with accessible states from the start.",
    items: ["Figma", "Design Systems", "Component Libraries", "Reusable UI Patterns", "Design QA", "WCAG-Oriented Design", "Accessible Form & Component States"],
  },
  {
    id: "code",
    title: "Design-to-Code",
    text: "Hands-on front-end skills that keep design and implementation the same thing.",
    items: ["React", "React Native", "Next.js", "TypeScript", "Tailwind CSS", "NativeWind", "shadcn/ui", "Ant Design", "HTML", "CSS", "Git/GitHub"],
  },
  {
    id: "ai",
    title: "AI-Assisted Workflow",
    text: "AI tools used to explore alternatives, draft specs, and generate and review components.",
    items: ["Claude", "Claude Code", "ChatGPT", "GitHub Copilot", "Figma AI"],
  },
  {
    id: "process",
    title: "Process",
    text: "Working in product teams with engineers, product managers and QA.",
    items: ["Agile/Scrum", "Jira"],
  },
];

export const EDUCATION = [
  { title: "Master of Engineering", field: "Engineering Economics & Management of Enterprises", school: "State Engineering University of Armenia (Polytechnic)" },
  { title: "Bachelor of Engineering", field: "Microelectronics & Semiconductor Devices", school: "State Engineering University of Armenia (Polytechnic)" },
];

export const NAV = [
  { href: BASE, label: "Home" },
  { href: `${BASE}/works`, label: "Works" },
  { href: `${BASE}/about`, label: "About" },
  { href: `${BASE}/skills`, label: "Skills" },
  { href: `${BASE}/education`, label: "Education" },
];
