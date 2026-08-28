import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-white px-6 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 text-xs text-foreground/45 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="font-medium text-foreground">
            Portory
          </Link>
          <span className="mx-3 text-border">/</span>
          <span>© 2026 Portory</span>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2"
          aria-label="Footer navigation"
        >
          <Link href="/templates" className="hover:text-foreground">
            Templates
          </Link>
          <a href="#how-it-works" className="hover:text-foreground">
            How it works
          </a>
          <a href="#about" className="hover:text-foreground">
            About
          </a>
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
