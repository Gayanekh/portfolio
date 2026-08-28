import type { PortfolioData } from "@/context/PortfolioContext";

const projects = [
  { number: "01", category: "Work", title: "Fintech Onboarding Redesign", description: "Redesigned the first-time user onboarding journey for a mobile wallet, reducing drop-off across identity verification and card-linking flows.", focus: ["UX Strategy", "Prototyping", "A/B Testing"], year: "2026", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=2000&q=80" },
  { number: "02", category: "Work", title: "SaaS Design System", description: "Built a scalable React component library and Figma token system used by four product squads to unify enterprise dashboard experiences.", focus: ["Design Systems", "React", "Accessibility"], year: "2025", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80" },
  { number: "03", category: "Work", title: "E-commerce Checkout Optimization", description: "Simplified checkout architecture and interaction states for a high-volume storefront, improving completion and reducing support tickets.", focus: ["Conversion", "UI Architecture", "Research"], year: "2025", image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=2000&q=80" },
  { number: "04", category: "Work", title: "Healthcare Patient Portal", description: "Designed a patient-facing portal with clearer appointment, records, and messaging flows while meeting strict privacy and accessibility requirements.", focus: ["Service Design", "WCAG", "Product Thinking"], year: "2024", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80" },
];

export const demoPortfolioData: PortfolioData = {
  name: "Gayane Khachatryan",
  role: "Product Designer",
  availableYear: "2026",
  email: "hello@gayanekhachatryan.com",
  avatar: "/avatar.png",
  aboutHeading: "About",
  aboutBody: "Design-focused product thinker creating intuitive, research-driven digital experiences across fintech, SaaS, and healthcare.",
  services: ["Product Design", "UX Strategy", "Design Systems", "Prototyping", "Frontend Dev"],
  skills: [],
  navigation: {
    enabled: true,
    links: { work: true, about: true, services: true, contact: true },
    showAvailability: true,
  },
  showScrollProgress: true,
  projects,
};
