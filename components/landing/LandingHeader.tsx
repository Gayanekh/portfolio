import Link from "next/link";
import AuthControls from "@/components/auth/AuthControls";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-[#fafafa]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-foreground"
        >
          Portory
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          <a
            href="#templates"
            className="text-xs text-foreground/55 transition-colors hover:text-foreground"
          >
            Templates
          </a>
          <a
            href="#how-it-works"
            className="text-xs text-foreground/55 transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#about"
            className="text-xs text-foreground/55 transition-colors hover:text-foreground"
          >
            About
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
