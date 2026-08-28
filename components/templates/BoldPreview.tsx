import { PortfolioData } from "@/context/PortfolioContext";

interface BoldPreviewProps {
  data: PortfolioData;
}

export default function BoldPreview({ data }: BoldPreviewProps) {
  const hasAbout = Boolean(data.aboutHeading.trim() || data.aboutBody.trim());
  const hasServices = data.services.some((service) => service.trim());
  const hasWork = data.projects.length > 0;

  return (
    <div className="min-h-full bg-[#111] text-white">
      {data.navigation.enabled && (
        <nav
          className="sticky top-0 z-20 grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-white/10 bg-[#111]/95 px-6 text-[9px] font-sans font-medium uppercase tracking-[0.1em] text-white/60 backdrop-blur-sm sm:px-10 lg:px-14"
          aria-label="Portfolio navigation"
        >
          <span className="truncate text-white/80">
            {data.name || "Your Name"}
          </span>
          <div className="hidden items-center gap-8 md:flex">
            {data.navigation.links.work && hasWork && (
              <a href="#work" className="hover:text-white">
                Work
              </a>
            )}
            {data.navigation.links.about && hasAbout && (
              <a href="#about" className="hover:text-white">
                About
              </a>
            )}
            {data.navigation.links.services && hasServices && (
              <a href="#services" className="hover:text-white">
                Services
              </a>
            )}
            {data.navigation.links.contact && (
              <a href="#contact" className="hover:text-white">
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
              <summary className="cursor-pointer list-none rounded px-2 py-1 text-[9px] tracking-[0.1em] hover:bg-white/5">
                Menu
              </summary>
              <div className="absolute right-0 top-9 z-30 min-w-32 space-y-2 rounded-md border border-white/10 bg-[#111] p-3 shadow-lg shadow-black/20">
                {data.navigation.links.work && hasWork && (
                  <a href="#work" className="block hover:text-white">
                    Work
                  </a>
                )}
                {data.navigation.links.about && hasAbout && (
                  <a href="#about" className="block hover:text-white">
                    About
                  </a>
                )}
                {data.navigation.links.services && hasServices && (
                  <a href="#services" className="block hover:text-white">
                    Services
                  </a>
                )}
                {data.navigation.links.contact && (
                  <a href="#contact" className="block hover:text-white">
                    Contact
                  </a>
                )}
                {data.navigation.showAvailability && (
                  <span className="flex items-center gap-1.5 border-t border-white/10 pt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Available for work
                  </span>
                )}
              </div>
            </details>
          </div>
        </nav>
      )}
      {/* Hero */}
      <section
        id="about"
        className="px-6 sm:px-10 lg:px-14 pt-14 pb-16 border-b border-white/10"
      >
        <div className="flex items-start gap-5 mb-5">
          <div className="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xs font-mono text-white/25 uppercase overflow-hidden shrink-0">
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
            <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/30 mb-2">
              Portfolio
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white leading-[1.1] tracking-tight">
              {data.name || "Your Name"}
            </h1>
          </div>
        </div>
        {data.aboutHeading && (
          <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/30 mb-2">
            {data.aboutHeading}
          </p>
        )}
        <p className="text-sm text-white/40 mb-6 max-w-lg leading-relaxed">
          {data.aboutBody ||
            "Write a short bio about yourself, your expertise, and what drives your creative work."}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono tracking-widest uppercase text-white/30">
          <span>{data.role || "Your Role"}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{data.email || "you@example.com"}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Available {data.availableYear || "2026"}</span>
        </div>
      </section>

      {/* Services */}
      {hasServices && (
        <section
          id="services"
          className="px-6 sm:px-10 lg:px-14 py-10 border-b border-white/10"
        >
          <div className="flex flex-wrap gap-3">
            {data.services.filter(Boolean).map((service, i) => (
              <span
                key={i}
                className="text-[10px] font-mono tracking-widest uppercase border border-white/15 text-white/50 px-4 py-2 hover:border-white/30 hover:text-white/70 transition-colors"
              >
                {service}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.filter(Boolean).length > 0 && (
        <section className="px-6 sm:px-10 lg:px-14 py-8 border-b border-white/10">
          <div className="flex flex-wrap gap-3">
            {data.skills.filter(Boolean).map((skill, i) => (
              <span
                key={i}
                className="text-[10px] font-mono tracking-widest uppercase text-white/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section id="work" className="px-6 sm:px-10 lg:px-14 py-10">
        <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/25 mb-8">
          Selected Work
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {data.projects.map((project, i) => (
            <article key={i} className="group">
              <div className="relative aspect-[4/3] bg-white/5 overflow-hidden mb-3">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-extralight text-white/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-[9px] font-mono text-white/60">
                    {project.year || "Year"}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-3 h-px bg-white/15" />
                  <h3 className="text-sm font-light text-white/80">
                    {project.title || "Project Title"}
                  </h3>
                </div>
                <p className="text-[11px] text-white/30 leading-relaxed pl-7">
                  {project.description || "Project description goes here."}
                </p>
                {project.focus.filter(Boolean).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-7">
                    {project.focus.filter(Boolean).map((f, fi) => (
                      <span
                        key={fi}
                        className="text-[8px] font-mono tracking-wider uppercase text-white/20"
                      >
                        {f}
                        {fi < project.focus.filter(Boolean).length - 1 && " /"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="px-6 sm:px-10 lg:px-14 py-10 border-t border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/20 mb-2">
              Get in Touch
            </p>
            <p className="text-lg font-extralight text-white/70">
              {data.email || "you@example.com"}
            </p>
          </div>
          <span className="text-[9px] font-mono tracking-widest uppercase text-white/15">
            {data.name || "YN"}
          </span>
        </div>
      </section>
    </div>
  );
}
