// Everything /gayane-khachatryan says, from Gayane's CV, plus Portory as a project.
// The phone number on the CV is left out on purpose: these pages are public.

export const BASE = "/gayane-khachatryan";

export const PERSON = {
  first: "Gayane",
  last: "Khachatryan",
  name: "Gayane Khachatryan",
  role: "Senior Product Designer",
  location: "Fullerton, CA",
  since: "Since 2015",
  status: "Authorized to work in the U.S.",
  email: "gayane.khachatryan@hotmail.com",
  linkedin: "https://www.linkedin.com/in/gayane-khachatryan-a805383ab",
  timeZone: "America/Los_Angeles",
  // Set this to a PDF in public/ and About shows Download CV.
  cv: undefined as string | undefined,
};

export const NAV = [
  { label: "Home", href: BASE },
  { label: "Info", href: `${BASE}/about` },
  { label: "Work", href: `${BASE}/work` },
  { label: "Contact", href: `${BASE}/contact` },
];

export const STATEMENT = {
  lead: "A senior product designer with 10+ years of experience —",
  soft: "designing complex web and mobile products, from multi-role platforms to dashboards and data-heavy workflows.",
};

export const SERVICES = [
  { name: "Product & UX Design", text: "End-to-end experiences for complex products, from requirements and user flows to wireframes, prototypes and production-ready UI." },
  { name: "Dashboards & Data-Heavy UI", text: "Dashboards, admin tools, data tables, forms and operational workflows for information-dense products." },
  { name: "Design Systems", text: "Reusable components and UI patterns in Figma and code, keeping interfaces consistent across web and mobile." },
  { name: "Design-to-Code", text: "Hands-on production UI in React, React Native, Next.js and TypeScript, working closely with engineers." },
];

// A project shows its `image`, or its name and line on a plain panel when it has none yet.
export const PROJECTS: { name: string; kind: string; year: string; line: string; tags: string[]; image?: string; href?: string }[] = [
  {
    name: "Portory",
    kind: "Website template platform",
    year: "'26",
    line: "Designed and built: a catalogue of ready-made website templates, with live previews and palettes and fonts that restyle a template in a click.",
    tags: ["Web"],
    image: "/images/gayane/portory.webp",
    href: "/",
  },
  {
    name: "ZEMA",
    kind: "Medical-tourism platform",
    year: "'24–'26",
    line: "One platform for patients, doctors, healthcare facilities and administrators, across web and mobile.",
    tags: ["Web", "Mobile"],
  },
  {
    name: "OGMA",
    kind: "Web and mobile products",
    year: "'15–'24",
    line: "Business and data-management platforms, music platforms and mobile applications.",
    tags: ["Web", "Mobile"],
  },
];

export const WORK_FILTERS = ["All", "Web", "Mobile"];

export const ABOUT = {
  lead: "I'm Gayane — a senior UI/UX and product designer based in Fullerton, California, with 10+ years of experience designing complex web and mobile products.",
  more: "I build and maintain design systems, bring hands-on front-end skills in React, React Native, Next.js and TypeScript, and work closely with engineers to keep design and implementation consistent. I design with accessibility in mind and use AI-assisted design-to-code workflows.",
  years: "© 2015–26",
};

export const STATS = [
  { value: "10+", label: "Years of experience" },
  { value: "9", label: "Years at OGMA" },
  { value: "4", label: "User roles on ZEMA" },
  { value: "2", label: "Platforms: web & mobile" },
];

export const STACK = [
  { name: "Figma", use: "Design systems and prototypes" },
  { name: "React", use: "Web interfaces" },
  { name: "React Native", use: "Mobile interfaces" },
  { name: "Next.js", use: "Production web apps" },
  { name: "TypeScript", use: "Typed front-end code" },
  { name: "Tailwind CSS", use: "Design-system styling" },
];

export const EXPERIENCE = [
  {
    company: "ZEMA",
    role: "Senior UI/UX Designer",
    place: "Armenia",
    years: "2024 – 2026",
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
    role: "UI/UX Designer",
    place: "Armenia",
    years: "2015 – 2024",
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

export const SKILLS = [
  { group: "Product & UX", items: "Product Design, Interaction Design, Information Architecture, User Flows, Wireframing, Prototyping, Complex Workflows, Dashboards & Data-Heavy UI, Responsive & Mobile Design" },
  { group: "Design Systems & Accessibility", items: "Figma, Design Systems, Component Libraries, Reusable UI Patterns, Design QA, WCAG-Oriented Design, Accessible Form & Component States" },
  { group: "Design-to-Code", items: "React, React Native, Next.js, TypeScript, Tailwind CSS, NativeWind, shadcn/ui, Ant Design, HTML, CSS, Git/GitHub" },
  { group: "AI-Assisted Workflow", items: "Claude, Claude Code, ChatGPT, GitHub Copilot, Figma AI" },
  { group: "Process", items: "Agile/Scrum, Jira" },
];

export const EDUCATION = {
  school: "State Engineering University of Armenia (Polytechnic)",
  degrees: [
    { title: "Master of Engineering", field: "Engineering Economics & Management of Enterprises" },
    { title: "Bachelor of Engineering", field: "Microelectronics & Semiconductor Devices" },
  ],
};

// Every answer comes from the CV.
export const FAQS = [
  { question: "What do you design?", answer: "Complex web and mobile products: multi-role platforms, dashboards, admin tools and data-heavy workflows, from requirements and user flows to production-ready UI." },
  { question: "Do you also write code?", answer: "Yes. I contribute to production UI in React, React Native, Next.js and TypeScript, and build design-system components in Figma and code with Tailwind CSS, NativeWind and shadcn/ui." },
  { question: "How do you work with product and engineering teams?", answer: "Closely, with product managers, business analysts, engineers and QA, through requirements, design reviews and design QA of built features." },
  { question: "How do you approach accessibility?", answer: "I design accessible form and component states, with clear labels, validation, focus, error, disabled and success states, and attention to color contrast, hierarchy and touch-target sizing." },
  { question: "How do you use AI in your work?", answer: "I use Claude, Claude Code, ChatGPT and GitHub Copilot to explore UI alternatives, draft specs and acceptance criteria, and generate, review and debug React and React Native components." },
  { question: "Can you work in the U.S.?", answer: "Yes. I'm based in Fullerton, California, and authorized to work in the U.S." },
];

export const CONTACT = {
  title: "Reach out.",
  text: "I'd love to hear from you, whether you're hiring, looking to collaborate on a product, or simply want to say hello.",
};
