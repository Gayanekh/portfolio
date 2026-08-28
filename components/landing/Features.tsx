const features = [
  [
    "01",
    "Professional templates",
    "A considered starting point for your work.",
  ],
  ["02", "Live preview", "See every change as you make it."],
  ["03", "Easy customization", "Your content, your voice, your details."],
  ["04", "Responsive by default", "A portfolio that works on every screen."],
  ["05", "Fast publishing", "Move from draft to shareable site quickly."],
  ["06", "Shareable link", "One simple URL for your next opportunity."],
];

export default function Features() {
  return (
    <section
      id="about"
      className="border-y border-border/50 bg-[#f5f5f3] px-6 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <p className="mb-5 text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/45">
          Why Portory
        </p>
        <h2 className="max-w-xl text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
          Everything you need
          <br />
          to present your work.
        </h2>
        <div className="mt-14 grid border-t border-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([number, title, text]) => (
            <div
              key={number}
              className="border-b border-border/60 py-7 sm:px-6 sm:first:pl-0 lg:nth-[3n+1]:pl-0"
            >
              <p className="text-[10px] font-mono text-foreground/40">
                {number}
              </p>
              <h3 className="mt-5 text-base font-normal text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm text-foreground/50">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
