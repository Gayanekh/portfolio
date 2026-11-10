import { nocturneTemplate } from "@/components/site-templates/nocturne";
import type { SectionContent, TemplateDefinition } from "@/components/site-templates/core/types";

// Gayane's portfolio: the Nocturne template (its sections, untouched) in her own
// look, the one /gayane-khachatryan had before: the #16171a page, light type, the
// lime accent, Space Grotesk for display and Inter Tight for text (the user asked).
// Only real facts from her CV: Nocturne's photography section,
// its invented figures and its sample contact details are left out.

const EMAIL = "gayane.khachatryan@hotmail.com";
const LINKEDIN = "https://www.linkedin.com/in/gayane-khachatryan-a805383ab";
const AVATAR = "/avatar.png";

const THEME =
  "[--card:#16171a] [--foreground:#efefed] [--muted-foreground:#9a9a96] [--border:rgb(239_239_237/0.14)] [--primary:#c6f36b] [--cover-filter:grayscale(0.5)_brightness(0.8)] [--work-cursor:none] [--font-1:var(--font-ui)] [--font-display:var(--gk-display)] [&_.font-mono]:font-[family-name:var(--font-ui)]";

// Each section's text, on top of Nocturne's.
const TEXT: Record<string, SectionContent> = {
  header: { siteTitle: "Gayane Khachatryan", mark: "GK", city: "Fullerton, CA", timeZone: "America/Los_Angeles" },
  hero: {
    eyebrow: "Portfolio — 2026 · Senior Product Designer",
    first: "Gayane",
    last: "Khachatryan",
    lead: "I",
    role1: "design interfaces people trust.",
    role2: "write the code behind them.",
    role3: "build design systems that last.",
    intro: "10+ years of designing complex web and mobile products, from first flow to production UI.",
    image: AVATAR,
    index1: "UI/UX Design",
    index2: "Development",
  },
  work: {
    // The round View moves as the /templates page's View bubble does, following the pointer and standing in for the cursor, which is hidden over the cards (--work-cursor in the theme).
    viewStyle: "templates",
    // Hers, in her words: what is shown here is her own work, and why her client work is not.
    intro: "These are my own projects. I can't show my client work: I don't have permission to share it, and the websites and apps are still in development.",
    work1Title: "Portory",
    work1Category: "Product",
    work1Year: "2026",
    work1Tags: "Website templates · Design · Code",
    work1Image: "/images/gayane/portory-landing.webp",
    work1Url: "/gayane-khachatryan/work/portory",
    // Portory's templates, designed and built by Gayane (the user asked), with their covers.
    work6Title: "Nocturne",
    work6Category: "Portfolio template",
    work6Year: "2026",
    work6Tags: "Portory · UI/UX, development, photography & graphic design",
    work6Image: "/images/landing-covers/nocturne-cover-b.webp",
    work6Url: "/gayane-khachatryan/work/nocturne",
    work7Title: "Showcase",
    work7Category: "Portfolio template",
    work7Year: "2026",
    work7Tags: "Portory · Photographers, UI/UX & graphic designers",
    work7Image: "/images/landing-covers/showcase-cover-e.webp",
    work7Url: "/gayane-khachatryan/work/showcase",
    work8Title: "Persona",
    work8Category: "Portfolio template",
    work8Year: "2026",
    work8Tags: "Portory · Brand & product designers",
    work8Image: "/images/landing-covers/persona-cover-c.webp",
    work8Url: "/gayane-khachatryan/work/persona",
    work9Title: "Gallery",
    work9Category: "Photography template",
    work9Year: "2026",
    work9Tags: "Portory · Photographers & artists",
    work9Image: "/images/landing-covers/gallery-cover-c.webp",
    work9Url: "/gayane-khachatryan/work/gallery",
    work10Title: "Minimal",
    work10Category: "Portfolio template",
    work10Year: "2026",
    work10Tags: "Portory · Web, brand & graphic designers",
    work10Image: "/images/landing-covers/minimal-cover-c.webp",
    work10Url: "/gayane-khachatryan/work/minimal",
    work11Title: "Exhibition",
    work11Category: "Event template",
    work11Year: "2026",
    work11Tags: "Portory · Painters, artists & galleries",
    work11Image: "/images/landing-covers/exhibition-cover-b.webp",
    work11Url: "/gayane-khachatryan/work/exhibition",
  },
  uiux: {
    // Hers, in her words: what she has designed, and in which fields.
    intro: "I've designed dashboards, admin pages, forms and mobile experiences, on projects in medical tourism, healthcare, business and data management, and music. They include websites for doctors and a music app with user sign‑in.",
    // Her ZEMA figures all carry her CV title, and say what they are: drawn recreations, not client data.
    case2Meta: "ZEMA Admin · Senior UI/UX · 2024–26",
    figNote: "Illustrative recreation — not client data or real metrics.",
    mockDomain: "admin.example.health/overview",
    mockEmail: "name@example.health",
    case1Stat1Value: "4",
    case1Stat1Label: "user roles",
    case1Stat2Value: "2",
    case1Stat2Label: "platforms: web & mobile",
    case2Stat1Value: "3",
    case2Stat1Label: "audiences: doctors, facilities, admins",
    case2Stat2Value: "1",
    case2Stat2Label: "shared design system",
    case3Meta: "Design system · Figma & code · 2024–26",
    case3Stat1Value: "2",
    case3Stat1Label: "platforms",
    case3Stat2Value: "3",
    case3Stat2Label: "code libraries",
  },
  // Development: Nocturne's text with her CV's stack (HTML, CSS, Figma AI and Codex added to it; sixteen tools, see the Dev
  // wrapper in Portfolio.tsx) and the AI tools she names.
  development: {
    principle1Text: "Colors, type and spacing defined once and shared by Figma and code.",
    principle3Text: "Claude, Claude Code, ChatGPT, Codex and Copilot to explore, draft specs and review components faster.",
    ...Object.fromEntries(["HTML", "CSS", "React", "Next.js", "TypeScript", "React Native", "Tailwind CSS", "NativeWind", "shadcn/ui", "Figma", "Figma AI", "Ant Design", "Git & GitHub", "Claude Code", "Codex", "Jira"].map((name, i) => [`stack${i + 1}`, name])),
  },
  // Visual studies (the Graphic design section, now supporting work and out of the hero's list): only what she says of it, that she works with typography and color. The four pieces are studies of both, drawn in code in her own lime, her mark (GK) and the italic face of her portfolio (Instrument Serif); no clients, projects or dates are claimed.
  graphic: {
    label: "Typography & color",
    title: "Visual *studies*",
    intro: "I work with typography and color. These pieces are studies of both: how type sets the hierarchy of a page, and how color sets its mood.",
    art1Title: "Color study",
    art1Meta: "Poster study",
    art1Word: "Color",
    art1Detail: "Lime · C6F36B",
    art2Title: "Color & type pairing",
    art2Meta: "Palette study",
    art2Brand: "GK",
    art3Title: "Type on image",
    art3Meta: "Type study",
    art3Words: "Type & color",
    art4Title: "Type specimen",
    art4Meta: "Instrument Serif",
    art4Font: "Instrument Serif",
  },
  // About carries the contact too (the user merged the two sections).
  about: {
    image: AVATAR,
    contactLabel: "Contact",
    contactTitle: "Let's work *together.*",
    emailLabel: "Email",
    reachLabel: "Reach me",
    email: EMAIL,
    copy: "Copy email",
    copied: "Copied",
    detail1Label: "LinkedIn",
    detail1Value: "gayane-khachatryan",
    detail1Url: LINKEDIN,
    detail2Label: "Based in",
    detail2Value: "Fullerton, California",
    detail2Url: "",
    detail3Label: "Status",
    detail3Value: "Authorized to work in the U.S.",
    detail3Url: "",
    school1Field: "Engineering Economics & Management of Enterprises",
    school1Place: "State Engineering University of Armenia (Polytechnic)",
    school2Place: "State Engineering University of Armenia (Polytechnic)",
    copyright: "© 2026 Gayane Khachatryan",
    credit: "Designed and built by Gayane Khachatryan",
    top: "Back to top",
    statement:
      "I'm a senior product designer with *10+ years* of work on complex web and mobile products. I build design systems, write *front-end code*, and care about the same thing in every product: *the details.*",
  },
};

// Nocturne's sections that hold real content, and how many items of each to show.
const KEEP = ["header", "hero", "work", "uiux", "development", "graphic", "about"];

export function gayaneTemplate(components: Record<string, TemplateDefinition["sections"][number]["Component"]>): TemplateDefinition {
  return {
    ...nocturneTemplate,
    id: "gayane",
    name: "Gayane Khachatryan",
    theme: THEME,
    sections: nocturneTemplate.sections
      .filter((section) => KEEP.includes(section.id))
      .map((section) => ({ ...section, ...(section.id === "about" && { menu: "About & contact" }),
        ...(section.id === "graphic" && { menu: "Visual studies" }), Component: components[section.id] ?? section.Component, defaults: { ...section.defaults, ...TEXT[section.id] } })),
  };
}
