import type { RefObject } from "react";
import { PortfolioData } from "@/context/PortfolioContext";
import ScrollIndicator from "@/components/ScrollIndicator";

interface MinimalPreviewProps {
  data: PortfolioData;
  scrollContainerRef?: RefObject<HTMLElement | null>;
}

export default function MinimalPreview({
  data,
  scrollContainerRef,
}: MinimalPreviewProps) {
  const hasAbout = Boolean(data.aboutHeading.trim() || data.aboutBody.trim());
  const hasServices = data.services.some((service) => service.trim());
  const hasWork = data.projects.length > 0;

  return (
    <div className="min-h-full bg-[#f8f8f8] px-6 sm:px-10 lg:px-14 py-10">
      {data.navigation.enabled && (
        <nav
          className="sticky top-0 z-20 mb-10 grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border/40 bg-[#f8f8f8]/95 px-2 text-[9px] font-sans font-medium uppercase tracking-[0.1em] text-foreground/70 backdrop-blur-sm"
          aria-label="Portfolio navigation"
        >
          <span className="truncate">{data.name || "Your Name"}</span>
          <div className="hidden items-center gap-8 md:flex">
            {data.navigation.links.work && hasWork && (
              <a href="#work" className="hover:opacity-60">
                Work
              </a>
            )}
            {data.navigation.links.about && hasAbout && (
              <a href="#about" className="hover:opacity-60">
                About
              </a>
            )}
            {data.navigation.links.services && hasServices && (
              <a href="#services" className="hover:opacity-60">
                Services
              </a>
            )}
            {data.navigation.links.contact && (
              <a href="#contact" className="hover:opacity-60">
                Contact
              </a>
            )}
          </div>
          <div className="flex justify-end">
            {data.navigation.showAvailability && (
              <span className="hidden items-center gap-1.5 whitespace-nowrap md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Available for work
              </span>
            )}
            <details className="relative md:hidden">
              <summary className="cursor-pointer list-none rounded px-2 py-1 text-[9px] tracking-[0.1em] hover:bg-foreground/5">
                Menu
              </summary>
              <div className="absolute right-0 top-9 z-30 min-w-32 space-y-2 rounded-md border border-border/50 bg-[#f8f8f8] p-3 shadow-lg shadow-black/5">
                {data.navigation.links.work && hasWork && (
                  <a href="#work" className="block hover:opacity-60">
                    Work
                  </a>
                )}
                {data.navigation.links.about && hasAbout && (
                  <a href="#about" className="block hover:opacity-60">
                    About
                  </a>
                )}
                {data.navigation.links.services && hasServices && (
                  <a href="#services" className="block hover:opacity-60">
                    Services
                  </a>
                )}
                {data.navigation.links.contact && (
                  <a href="#contact" className="block hover:opacity-60">
                    Contact
                  </a>
                )}
                {data.navigation.showAvailability && (
                  <span className="flex items-center gap-1.5 border-t border-border/40 pt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Available for work
                  </span>
                )}
              </div>
            </details>
          </div>
        </nav>
      )}
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        {/* Sidebar */}
        <aside
          id="about"
          className="lg:w-48 xl:w-56 shrink-0 lg:sticky lg:top-20 lg:self-start space-y-4"
        >
          <div className="w-14 h-14 rounded-full bg-black/5 border border-border/60 flex items-center justify-center text-xs font-mono text-muted-foreground uppercase overflow-hidden">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : data.name ? (
              data.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
            ) : (
              "YN"
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {data.name || "Your Name"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.role || "Your Role"}
            </p>
          </div>
          {data.aboutHeading && (
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
              {data.aboutHeading}
            </p>
          )}
          <p className="text-xs text-foreground/50 leading-relaxed">
            {data.aboutBody ||
              "Write a short bio about yourself and your work."}
          </p>
          {hasServices && (
            <div id="services" className="pt-2 space-y-1">
              <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                Services
              </p>
              {data.services.filter(Boolean).map((s, i) => (
                <p key={i} className="text-[11px] text-foreground/60">
                  {s}
                </p>
              ))}
            </div>
          )}
          {data.skills.filter(Boolean).length > 0 && (
            <div className="pt-2 space-y-1">
              <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                Skills
              </p>
              {data.skills.filter(Boolean).map((skill, i) => (
                <p key={i} className="text-[11px] text-foreground/60">
                  {skill}
                </p>
              ))}
            </div>
          )}
          {data.showScrollProgress && (
            <ScrollIndicator scrollContainerRef={scrollContainerRef} />
          )}
        </aside>

        {/* Projects */}
        <main id="work" className="flex-1 space-y-10">
          {data.projects.map((project, i) => (
            <article key={i} className="group">
              <div className="relative aspect-[16/10] bg-black/5 border border-border/40 overflow-hidden mb-4">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-xs font-mono text-muted-foreground/50">
                      Project Image {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-base font-light text-foreground mb-1">
                    {project.title || "Project Title"}
                  </h3>
                  <p className="text-xs text-foreground/45 leading-relaxed max-w-md">
                    {project.description || "Project description goes here."}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] font-mono text-muted-foreground">
                    {project.year || "Year"}
                  </p>
                  {project.focus.filter(Boolean).length > 0 && (
                    <div className="flex flex-wrap justify-end gap-1 mt-1">
                      {project.focus.filter(Boolean).map((f, fi) => (
                        <span
                          key={fi}
                          className="text-[8px] font-mono tracking-wider uppercase text-foreground/30 border border-border/40 px-1.5 py-0.5"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}

          {/* Contact */}
          <div id="contact" className="pt-6 border-t border-border/40">
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Contact
            </p>
            <p className="text-sm text-foreground">
              {data.email || "you@example.com"}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
