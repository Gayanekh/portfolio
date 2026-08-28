const steps = [
  ["01", "Choose", "Pick a template that fits your style and goals."],
  ["02", "Customize", "Add your content, projects, and skills."],
  ["03", "Publish", "Preview and publish your portfolio."],
  ["04", "Share", "Get your unique portfolio link and share it anywhere."],
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      <p className="mb-5 text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/45">
        How it works
      </p>
      <h2 className="max-w-lg text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
        Your portfolio in
        <br />4 simple steps.
      </h2>
      <div className="mt-14 grid border-y border-border/50 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([number, title, text]) => (
          <div
            key={number}
            className="border-b border-border/50 py-7 sm:border-r sm:px-6 lg:border-b-0 first:sm:pl-0 last:border-r-0"
          >
            <p className="text-[10px] font-mono text-foreground/40">{number}</p>
            <h3 className="mt-8 text-lg font-normal text-foreground">
              {title}
            </h3>
            <p className="mt-2 max-w-[190px] text-sm leading-relaxed text-foreground/50">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
