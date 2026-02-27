"use client";

import { useEffect, useState } from "react";
import PortfolioNav from "@/components/PortfolioNav";
import PortfolioAside from "@/components/PortfolioAside";
import ProjectSection from "@/components/ProjectSection";

const projects = [
  {
    number: "01",
    category: "Work",
    title: "Portraits in Light",
    description:
      "A minimalist editorial series exploring the human face through dramatic contrast and shadow. Black and white photography with scroll-driven reveal.",
    focus: ["Photography", "Motion", "Interaction"],
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "02",
    category: "Work",
    title: "Concrete Silence",
    description:
      "An architectural exploration of brutalist spaces, capturing the tension between emptiness and form in built environments.",
    focus: ["Architecture", "WebGL", "Spatial"],
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "03",
    category: "Work",
    title: "Motion Study",
    description:
      "A series capturing the kinetics of the human body in motion — where blur becomes a language of expression and time.",
    focus: ["Motion", "Dance", "Long Exposure"],
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=2000&q=80",
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
    <div className="bg-[#f8f8f8] min-h-screen">
      <PortfolioNav />
      <div className="flex">
        <PortfolioAside progress={progress} />
        <div id="works" className="flex-1">
          {projects.map((project, i) => (
            <ProjectSection
              key={project.number}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
