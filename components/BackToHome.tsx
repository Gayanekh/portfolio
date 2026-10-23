import Link from "next/link";
import { MoveLeft } from "lucide-react";

// A back button: small and outlined in spaced capitals, filling dark on
// hover, its long arrow nudging left. "Back to home" by default; the
// templates page uses it as is, the editor's sidebar as "All templates" and
// the sign-in pages as "Back".
export default function BackToHome({ href = "/", label = "Back to home", className = "" }: { href?: string; label?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex h-10 w-fit items-center gap-2 rounded border border-foreground/15 px-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground no-underline transition-colors hover:bg-foreground hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${className}`}
    >
      <MoveLeft aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:-translate-x-1" /> {label}
    </Link>
  );
}
