import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { focusRing } from "@/components/template-landing/ui";

// The page's text link (the Invite section's Get started): at rest the words
// and an up-right arrow in the primary colour over one black underline (its
// first design); on hover, after the user's reference, the underline draws back
// under the words while the arrow turns, in place, to point right (as on Opus).
export default function TextLink({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <Link href={href} className={`${focusRing} group inline-flex items-center gap-3 text-[1rem] font-normal tracking-[-0.025em] text-[var(--fg)] no-underline ${className}`}>
      <span className="relative pb-1 after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-[calc(100%_+_0.75rem_+_1.15em)] after:bg-[var(--fg)] after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] after:content-[''] group-hover:after:w-full group-focus-visible:after:w-full motion-reduce:after:transition-none">{label}</span>
      <ArrowUpRight
        aria-hidden="true"
        strokeWidth={1.75}
        className="size-[1.15em] text-[var(--accent)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-focus-visible:rotate-45 motion-reduce:transition-none"
      />
    </Link>
  );
}
