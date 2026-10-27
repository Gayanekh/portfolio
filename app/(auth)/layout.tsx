import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import AuthBack from "@/components/auth/AuthBack";
import Logo from "@/components/brand/Logo";
import LogoMark from "@/components/brand/LogoMark";

// Shared by the sign-in pages so the header stays mounted while only the form
// changes. The header holds the Portory wordmark on the left (a link home, as
// visitors expect of a logo; a small mark on phones) and a quiet Back link (to
// the page the visitor came from, or home) on the right.
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
              {/* The wordmark, as on the rest of the site; on phones a small mark */}
              <Logo className="hidden h-6 w-auto text-foreground/85 sm:block" title={null} />
              <LogoMark className="size-6 text-foreground/85 sm:hidden" title={null} />
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
