// Everything /gayane-khachatryan says: Gayane's CV and the real projects from the
// Nocturne template's sample content (ZEMA, OGMA), plus Portory. Only real facts:
// Nocturne's invented work, statistics and contact details are left out (the user
// chose), and the CV's phone number stays off these public pages.

export const BASE = "/gayane-khachatryan";

export const PERSON = {
  first: "Gayane",
  last: "Khachatryan",
  name: "Gayane Khachatryan",
  role: "Senior Product Designer",
  location: "Fullerton, CA",
  status: "Authorized to work in the U.S.",
  email: "gayane.khachatryan@hotmail.com",
  linkedin: "https://www.linkedin.com/in/gayane-khachatryan-a805383ab",
};

export const NAV = [
  { label: "Home", href: BASE },
  { label: "Work", href: `${BASE}/work` },
  { label: "About", href: `${BASE}/about` },
  { label: "Contact", href: `${BASE}/contact` },
];

// The hero's headline, in the reference's three sizes: a huge word, a small line beside it, a large word.
export const HERO = {
  big: "Calm",
  small: "Interfaces . Complex",
  large: "Products",
  intro: "Ten years of designing complex web and mobile products, from first flow to production UI.",
  cta: "See work",
};

export const SERVICES = ["UI/UX Design", "Design Systems", "Design-to-Code"];

// A project shows its `image`, or its name large on a dark panel when it has none yet.
export const WORKS: { name: string; category: string; year: string; tags: string; text: string; image?: string; href?: string }[] = [
  { name: "Portory", category: "Website template platform", year: "2026", tags: "Product · Design · Code", text: "Designed and built: a catalogue of ready-made website templates, with live previews and palettes and fonts that restyle a template in a click.", image: "/images/gayane/portory.webp", href: "/" },
  { name: "ZEMA Patients", category: "UI/UX", year: "2024–26", tags: "Web & mobile · Booking · User flows", text: "Patient flows for a medical-tourism platform, from search and doctor profiles to pricing, booking and a dashboard, with accessible states for every form." },
  { name: "ZEMA Admin", category: "Product", year: "2024–26", tags: "Dashboards · Provider workflows · Data export", text: "Dashboards, submission flows, user management and data export for the doctors, facilities and administrators who run the platform every day." },
  { name: "ZEMA Design System", category: "Design system", year: "2024–26", tags: "Figma · Tailwind · NativeWind · shadcn/ui", text: "Reusable components in Figma and in code that keep web and mobile consistent, with every state designed up front." },
  { name: "OGMA Business", category: "UI/UX", year: "2015–24", tags: "Data platforms · Dashboards · Forms", text: "Business and data-management products: dashboards, admin tools, data tables, forms and operational workflows." },
];

export const EXPERTISE = [
  { name: "UI/UX Design", text: "Multi-role platforms, dashboards and data-heavy workflows, designed so that complicated things feel calm.", tags: ["User flows", "Wireframes", "Prototypes", "High-fidelity UI"] },
  { name: "Design Systems", text: "Reusable components and UI patterns in Figma and code, keeping web and mobile consistent.", tags: ["Figma", "Component libraries", "Design QA", "Tokens"] },
  { name: "Design-to-Code", text: "Hands-on front-end work, so what was designed is exactly what gets built.", tags: ["React", "React Native", "Next.js", "TypeScript"] },
  { name: "Accessibility", text: "Labels, focus, errors and contrast designed into every component state.", tags: ["WCAG-oriented", "Form states", "Contrast", "Touch targets"] },
  { name: "AI-Assisted Workflow", text: "Claude Code and Copilot to explore alternatives, draft specs and review components faster.", tags: ["Claude", "Claude Code", "ChatGPT", "GitHub Copilot"] },
];

export const PROCESS = [
  { title: "Discover", text: "Requirements, roles and the real tasks behind them." },
  { title: "Define", text: "Flows, structure and the edge cases nobody mentions." },
  { title: "Design", text: "Prototypes and high-fidelity UI, every state included." },
  { title: "Deliver", text: "Handoff, design QA and the details in code." },
];

export const ABOUT = {
  lead: "I'm a senior product designer with ten years of work on complex web and mobile products.",
  more: "I build design systems, write front-end code in React, React Native, Next.js and TypeScript, and work closely with engineers to keep design and implementation consistent. I design with accessibility in mind and use AI-assisted design-to-code workflows.",
};

export const STACK = ["React", "Next.js", "TypeScript", "React Native", "Tailwind CSS", "NativeWind", "shadcn/ui", "Figma", "Ant Design", "Git & GitHub", "Claude Code", "Jira"];

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
  lead: "Let's Work",
  soft: "Together.",
  text: "Hiring, a product to talk through, or just hello: write to me.",
};
