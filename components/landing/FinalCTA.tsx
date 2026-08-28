import Link from "next/link";

const images = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80",
];

function LightPreview({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div className="bg-white px-3 py-3 text-foreground">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-[8px] font-medium">
            {side === "left" ? "Hi, I'm" : "Olivia Carter"}
          </p>
          <p className="text-[8px] font-medium">
            {side === "left" ? "Sarah Lee" : "Photographer"}
          </p>
          <p className="mt-1 text-[5px] text-foreground/45">
            Selected work and ideas
          </p>
        </div>
        <span className="h-7 w-7 rounded-full bg-foreground/10" />
      </div>
      <p className="mb-1 text-[5px] font-mono uppercase tracking-wider text-foreground/45">
        Selected work
      </p>
      <div className="grid grid-cols-3 gap-1">
        {images.map((image) => (
          <img
            key={image}
            src={image}
            alt="Portfolio project preview"
            className="aspect-[4/3] w-full object-cover grayscale-[20%]"
          />
        ))}
      </div>
    </div>
  );
}

function DarkPreview() {
  return (
    <div className="bg-[#111] px-4 py-4 text-white">
      <p className="text-[5px] font-mono uppercase tracking-[0.2em] text-white/40">
        Portfolio
      </p>
      <p className="mt-5 text-[15px] font-light leading-none">Danilo Silva</p>
      <p className="mt-1 text-[7px] text-white/45">Developer</p>
      <div className="mt-5 grid grid-cols-2 gap-1.5">
        {images.slice(0, 2).map((image) => (
          <img
            key={image}
            src={image}
            alt="Portfolio project preview"
            className="aspect-[4/3] w-full object-cover opacity-80"
          />
        ))}
      </div>
      <p className="mt-3 text-[5px] text-white/35">Selected projects</p>
    </div>
  );
}

export default function FinalCTA() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-[1200px] overflow-hidden rounded-xl border border-border/60 bg-[#f1f1ee] lg:min-h-[330px] lg:grid-cols-[0.55fr_1fr]">
        <div className="relative z-20 flex flex-col justify-center px-7 py-10 sm:px-10 lg:px-12 lg:py-11">
          <h2 className="text-3xl font-normal leading-[1.08] tracking-tight text-foreground sm:text-4xl">
            Your work deserves
            <br />a place of its own.
          </h2>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-foreground/50 sm:text-sm">
            Join Portory and create a portfolio you&apos;ll be proud to share.
          </p>
          <Link
            href="/templates"
            className="mt-6 inline-flex w-fit items-center gap-3 rounded-md bg-foreground px-4 py-2.5 text-[11px] text-primary-foreground transition-opacity hover:opacity-80"
          >
            Build Your Portfolio <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>

        <div className="relative flex min-h-[310px] flex-col items-center justify-center gap-3 overflow-hidden px-4 py-8 sm:min-h-[350px] sm:px-8 lg:block lg:min-h-[330px] lg:overflow-visible lg:px-2">
          <div className="relative aspect-[16/10] w-full max-w-[340px] overflow-hidden rounded-lg border border-border/70 bg-white shadow-lg shadow-black/5 lg:absolute lg:left-0 lg:top-[30px] lg:w-[250px] lg:max-w-none xl:w-[300px]">
            <div className="h-5 border-b border-border/50 bg-[#fafafa] px-2.5 py-1.5">
              <span className="block h-1.5 w-1.5 rounded-full bg-foreground/15" />
            </div>
            <LightPreview />
          </div>

          <div className="relative z-10 aspect-[16/10] w-full max-w-[370px] overflow-hidden rounded-lg border border-white/10 bg-[#111] shadow-xl shadow-black/15 lg:absolute lg:left-[180px] lg:top-[10px] lg:w-[280px] lg:max-w-none xl:left-[220px] xl:w-[330px]">
            <div className="h-5 border-b border-white/10 bg-[#0a0a0a] px-2.5 py-1.5">
              <span className="block h-1.5 w-1.5 rounded-full bg-white/20" />
            </div>
            <DarkPreview />
          </div>

          <div className="relative aspect-[16/10] w-full max-w-[340px] overflow-hidden rounded-lg border border-border/70 bg-white shadow-lg shadow-black/5 lg:absolute lg:left-[400px] lg:top-[30px] lg:w-[250px] lg:max-w-none xl:left-[470px] xl:w-[300px]">
            <div className="h-5 border-b border-border/50 bg-[#fafafa] px-2.5 py-1.5">
              <span className="block h-1.5 w-1.5 rounded-full bg-foreground/15" />
            </div>
            <LightPreview side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
