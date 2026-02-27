"use client";

import { StaticImageData } from "next/image";

interface Project {
  number: string;
  category: string;
  title: string;
  description: string;
  focus: string[];
  year: string;
  image: string | StaticImageData;
}

interface ProjectSectionProps {
  project: Project;
  index: number;
  total: number;
}

const ProjectSection = ({ project, index }: ProjectSectionProps) => {
  const imageSrc =
    typeof project.image === "string" ? project.image : project.image.src;

  return (
    <div className="relative flex" style={{ minHeight: "200vh" }}>
      {/* Right image panel - scrolls normally */}
      <div className="flex-1 relative">
        <div className="h-[30vh] bg-[#f8f8f8]" />
        <div className="relative overflow-hidden" style={{ height: "130vh" }}>
          <img
            src={imageSrc}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(100%)" }}
          />
          <span className="absolute bottom-8 right-8 text-xs font-mono text-white/40 tracking-widest">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="h-[40vh] bg-background" />
      </div>
    </div>
  );
};

export default ProjectSection;
