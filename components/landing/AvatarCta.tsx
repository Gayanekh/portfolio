import Link from "next/link";
import { Art, type ArtKey } from "@/components/landing/sample-portfolios";
import { focusRing } from "@/components/landing/landing-ui";

// The hero call to action from the approved prototype: a black pill with an
// avatar, and "+ You" sliding out beside it on hover.
export default function AvatarCta({ href, label, art = "chem", id }: { href: string; label: string; art?: ArtKey; id?: string }) {
  return (
    <Link
      id={id}
      href={href}
      className={`${focusRing} group relative inline-flex min-h-10 max-w-full items-center rounded-full bg-foreground px-4  text-white no-underline shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_10px_24px_-10px_rgb(0_0_0/0.55)] transition-transform duration-200 active:scale-[0.97] motion-reduce:transition-none`}
    >
      {label}
    </Link>
  );
}
