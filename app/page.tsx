import PortoryLanding from "@/components/landing/PortoryLanding";

export default function Page() {
  if (process.env.VERCEL_ENV === "production") {
    return (
      <main className="flex min-h-screen items-center bg-[#fafafa] px-6 py-16 text-foreground sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="mb-12 text-[10px] font-mono uppercase tracking-[0.25em] text-foreground/45">
            Portory
          </p>
          <h1 className="max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Build your portfolio.
            <br />
            <span className="text-foreground/35">Your way.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-foreground/55">
            A simple way to create and publish a portfolio that feels like you.
          </p>
          <p className="mt-12 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/45">
            Coming soon.
          </p>
        </div>
      </main>
    );
  }

  return <PortoryLanding />;
}
