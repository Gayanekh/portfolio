import { PortfolioData } from "@/context/PortfolioContext";

interface MinimalPreviewProps {
  data: PortfolioData;
}

export default function MinimalPreview({ data }: MinimalPreviewProps) {
  return (
    <div className="min-h-full bg-[#f8f8f8] px-6 sm:px-10 lg:px-14 py-10">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Sidebar */}
        <aside className="lg:w-48 xl:w-56 shrink-0 lg:sticky lg:top-10 lg:self-start space-y-4">
          <div className="w-14 h-14 rounded-full bg-black/5 border border-border/60 flex items-center justify-center text-xs font-mono text-muted-foreground uppercase overflow-hidden">
            {data.avatar ? (
              <img src={data.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              data.name
                ? data.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                : "YN"
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
          <p className="text-xs text-foreground/50 leading-relaxed">
            {data.aboutBody || "Write a short bio about yourself and your work."}
          </p>
          {data.services.filter(Boolean).length > 0 && (
            <div className="pt-2 space-y-1">
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
        </aside>

        {/* Projects */}
        <main className="flex-1 space-y-10">
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
          <div className="pt-6 border-t border-border/40">
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
