import PortoryLanding from "@/components/landing/PortoryLanding";

export default function Page() {
  if (process.env.VERCEL_ENV === "production") {
    return (
      <main data-site-scale className="flex min-h-screen items-center bg-background px-[clamp(1.5rem,calc(0.804rem_+_2.857vw),2.5rem)] py-16 text-foreground">
        <div className="mx-auto w-full max-w-[75rem]">
          <p className="mb-12 text-[0.625rem] font-mono uppercase tracking-[0.25em] text-foreground/45">
            Portory
          </p>
          <h1 className="max-w-3xl text-[length:clamp(3rem,calc(1.955rem_+_4.286vw),4.5rem)] font-light leading-[1.05] tracking-tight">
            Build your portfolio.
            <br />
            <span className="text-foreground/35">Your way.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-foreground/55">
            A simple way to create and publish a portfolio that feels like you.
          </p>
          <p className="mt-12 text-[0.625rem] font-mono uppercase tracking-[0.2em] text-foreground/45">
            Coming soon.
          </p>
        </div>
      </main>
    );
  }

  return <PortoryLanding />;
}
