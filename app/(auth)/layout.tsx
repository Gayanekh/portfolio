import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import AuthBack from "@/components/auth/AuthBack";
import LogoMark from "@/components/brand/LogoMark";

// Shared by /login and /register so the header stays mounted while only the
// form changes between the two routes. The header holds the Portory mark on
// the left (a link home, as visitors expect of a logo) and Back (to the page
// the visitor came from, or home) on the right, on every screen size.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AuthShell
        header={
          <>
            <Link
              href="/"
              aria-label="Portory home"
              className="rounded transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <LogoMark className="size-10" title={null} />
            </Link>
            <AuthBack />
          </>
        }
      >
        {children}
      </AuthShell>
    </main>
  );
}
