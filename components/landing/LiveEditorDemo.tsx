import BoldPreview from "@/components/templates/BoldPreview";
import type { PortfolioData } from "@/context/PortfolioContext";

const demoData: PortfolioData = {
  name: "Gayane Khachatryan",
  role: "Senior UI/UX Designer",
  availableYear: "2026",
  email: "you@email.com",
  avatar: "",
  aboutHeading: "A short introduction",
  aboutBody: "Write a short introduction about yourself and your work.",
  services: ["UX Design", "Product Design"],
  skills: [],
  navigation: {
    enabled: true,
    links: { work: true, about: true, services: false, contact: true },
    showAvailability: true,
  },
  showScrollProgress: true,
  projects: [
    {
      number: "01",
      category: "Work",
      title: "Fintech Onboarding",
      description: "A clearer way to start.",
      focus: ["UX Strategy"],
      year: "2026",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      number: "02",
      category: "Work",
      title: "Design System",
      description: "A flexible product foundation.",
      focus: ["Systems"],
      year: "2025",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

const inputClass =
  "w-full rounded-md border border-border/60 bg-white px-3 py-2 text-[11px] font-light text-foreground/75";
const labelClass =
  "mb-1 block text-[9px] font-mono font-normal tracking-[0.1em] uppercase text-foreground/50";

function DemoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className={inputClass}>{value}</div>
    </div>
  );
}

function DemoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border/50 pt-4 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center gap-2">
        <p className="shrink-0 text-[10px] font-mono font-semibold tracking-[0.12em] uppercase text-foreground/70">
          {title}
        </p>
        <span className="h-px flex-1 bg-border/60" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

export default function LiveEditorDemo() {
  return (
    <section className="border-b border-border/50 bg-[#f5f5f3] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <p className="mb-5 text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/45">
          Live preview
        </p>
        <h2 className="max-w-2xl text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
          Edit your portfolio.
          <br />
          <span className="text-foreground/35">See it come to life.</span>
        </h2>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-foreground/50">
          Update your content on the left and see every change instantly in your
          portfolio preview.
        </p>

        <div className="mt-14 overflow-hidden rounded-xl border border-border/60 bg-white shadow-xl shadow-black/5">
          <div className="flex items-center gap-1.5 border-b border-border/50 bg-[#fafafa] px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-foreground/15" />
            <span className="h-2 w-2 rounded-full bg-foreground/15" />
            <span className="h-2 w-2 rounded-full bg-foreground/15" />
            <span className="ml-5 flex-1 rounded bg-foreground/[0.03] px-3 py-1 text-center text-[9px] font-mono text-foreground/30">
              portory / customize
            </span>
          </div>

          <div className="grid lg:grid-cols-[30%_70%]">
            <div className="bg-[#fafafa] p-5 sm:p-7 lg:p-8">
              <div className="mb-7">
                <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-foreground/65">
                  Editor
                </p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/45">
                  Fill in your details. The preview updates live.
                </p>
              </div>
              <div className="space-y-7">
                <DemoSection title="Identity">
                  <div className="space-y-3">
                    <DemoField label="Avatar" value="Upload profile photo" />
                    <DemoField label="Name" value={demoData.name} />
                    <DemoField label="Role / Tagline" value={demoData.role} />
                    <div className="grid grid-cols-2 gap-2">
                      <DemoField
                        label="Available for work"
                        value={demoData.availableYear}
                      />
                      <DemoField label="Email" value={demoData.email} />
                    </div>
                  </div>
                </DemoSection>
                <DemoSection title="About">
                  <div className="space-y-3">
                    <DemoField label="Heading" value={demoData.aboutHeading} />
                    <DemoField label="Bio" value={demoData.aboutBody} />
                  </div>
                </DemoSection>
                <DemoSection title="Services">
                  <div className="space-y-2">
                    {demoData.services.map((service) => (
                      <div key={service} className={inputClass}>
                        {service}
                      </div>
                    ))}
                  </div>
                </DemoSection>
              </div>
            </div>

            <div className="min-w-0 border-t border-border/50 bg-[#eeeee9] p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
              <p className="mb-3 text-[10px] font-mono tracking-[0.15em] uppercase text-foreground/45">
                Live preview
              </p>
              <div className="overflow-hidden rounded-lg border border-white/10 bg-[#111] shadow-lg shadow-black/10">
                <BoldPreview data={demoData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
