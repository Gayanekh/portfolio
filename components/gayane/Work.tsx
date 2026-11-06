"use client";

import { useState } from "react";
import { PROJECTS, WORK_FILTERS } from "@/components/gayane/content";
import { Fade, margins, ProjectRow, type, Words } from "@/components/gayane/ui";
import { focusRing } from "@/components/template-landing/ui";

// Work: the title with its filters, then the project rows.
export default function Work() {
  const [filter, setFilter] = useState(WORK_FILTERS[0]);
  const shown = PROJECTS.filter((project) => filter === WORK_FILTERS[0] || project.tags.includes(filter));
  return (
    <div className={`pt-[clamp(2.5rem,6vw,5.5rem)] ${margins}`}>
      <div className="mb-[clamp(2.5rem,5vw,4.5rem)] flex flex-wrap items-end justify-between gap-6">
        <h1 className={type.title}>
          <Words text="My Work." step={0.04} />
        </h1>
        <Fade delay={0.3}>
          <div role="group" aria-label="Filter projects" className="flex gap-2">
            {WORK_FILTERS.map((name) => (
              <button key={name} type="button" aria-pressed={filter === name} onClick={() => setFilter(name)} className={`${focusRing} cursor-pointer rounded-[4px] border border-solid px-3 py-1.5 transition-colors duration-200 hover:text-[var(--fg)] ${type.small} ${filter === name ? "border-[var(--fg)] bg-transparent text-[var(--fg)]" : "border-[var(--line)] bg-transparent text-[var(--dim)]"}`}>
                {name}
              </button>
            ))}
          </div>
        </Fade>
      </div>
      <Fade key={filter} delay={0.1} duration={0.5} className="flex flex-col gap-[clamp(2.5rem,5vw,4.5rem)]">
        {shown.map((project) => (
          <ProjectRow key={project.name} project={project} />
        ))}
      </Fade>
    </div>
  );
}
