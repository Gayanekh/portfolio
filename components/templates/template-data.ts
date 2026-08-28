export interface TemplateData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  theme: "light" | "dark";
  previewImages: string[];
  demoHref: string;
}

export const templates: TemplateData[] = [
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Clean & Refined",
    description:
      "A light, editorial layout with a sticky sidebar and stacked project cards. Perfect for designers and creatives who want their work to speak for itself.",
    badge: "Light",
    theme: "light",
    demoHref: "/demo/minimal",
    previewImages: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "bold",
    name: "Bold",
    tagline: "Dark & Striking",
    description:
      "A dark, immersive layout with a cinematic hero and grid-based project showcase. Ideal for developers, photographers, and anyone who wants to stand out.",
    badge: "Dark",
    theme: "dark",
    demoHref: "/demo/bold",
    previewImages: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    ],
  },
];
