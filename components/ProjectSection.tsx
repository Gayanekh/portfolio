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
    <div className="flex">
      <div className="relative aspect-[1.92/1.2] w-full overflow-hidden rounded-lg">
        <img
          src={imageSrc}
          alt={project.title}
          className="w-full h-full object-cover absolute"
          style={{ filter: "grayscale(100%)" }}
        />
      </div>
      <span className="text-xs tracking-widest text-foreground/70 ml-3 mt-1">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
};

export default ProjectSection;
