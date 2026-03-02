"use client";

import { useEffect, useState } from "react";
import PortfolioNav from "@/components/PortfolioNav";
import PortfolioAside from "@/components/PortfolioAside";
import ProjectSection from "@/components/ProjectSection";

const projects = [
  {
    number: "01",
    category: "Work",
    title: "Fintech Onboarding Redesign",
    description:
      "Redesigned the first-time user onboarding journey for a mobile wallet, reducing drop-off across identity verification and card-linking flows.",
    focus: ["UX Strategy", "Prototyping", "A/B Testing"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "02",
    category: "Work",
    title: "SaaS Design System",
    description:
      "Built a scalable React component library and Figma token system used by four product squads to unify enterprise dashboard experiences.",
    focus: ["Design Systems", "React", "Accessibility"],
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "03",
    category: "Work",
    title: "E-commerce Checkout Optimization",
    description:
      "Simplified checkout architecture and interaction states for a high-volume storefront, improving completion and reducing support tickets.",
    focus: ["Conversion", "UI Architecture", "Research"],
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "04",
    category: "Work",
    title: "Healthcare Patient Portal",
    description:
      "Designed a patient-facing portal with clearer appointment, records, and messaging flows while meeting strict privacy and accessibility requirements.",
    focus: ["Service Design", "WCAG", "Product Thinking"],
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80",
  },
];

const Index = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, nextProgress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#f8f8f8] min-h-screen px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-40">
      <PortfolioNav />
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-20 pt-16 lg:pt-0">
        <PortfolioAside progress={progress} />
        <div
          id="works"
          className="grid gap-10 lg:gap-20 w-full pt-4 lg:pt-[350px] pb-10 lg:pb-20"
        >
          {projects.map((project, i) => (
            <ProjectSection
              key={project.number}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}

          <section
            id="archive"
            className="pt-8 lg:pt-12 border-t border-border"
          >
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Archive
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed max-w-2xl">
              Additional work includes product audits, dashboard redesigns,
              design system migrations, and mobile feature launches across
              fintech, commerce, and healthcare products.
            </p>
          </section>

          <section
            id="contact"
            className="pt-8 lg:pt-12 border-t border-border"
          >
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Contact
            </p>
            <a
              href="mailto:hello@gayanekhachatryan.com"
              className="text-lg sm:text-xl font-light text-foreground hover:text-primary transition-colors"
            >
              hello@gayanekhachatryan.com
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
