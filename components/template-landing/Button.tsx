import Link from "next/link";
import type { ReactNode } from "react";
import { MoveRight } from "lucide-react";
import { focusRing } from "@/components/template-landing/ui";

// Every button on /template-landing (the user chose /other-landing's): 4px
// corners, the label and an arrow that slides on hover; dark (the page's ink)
// or light (its card grey). On hover, after the Opus reference, either fades to
// the primary colour with white text. A link with `href`, or a plain button with
// `onClick`; `icon` replaces the arrow.
const base = `${focusRing} group/button inline-flex h-11 w-fit shrink-0 cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-[4px] border-0 px-5 text-[0.9375rem] font-medium tracking-[-0.01em] no-underline transition-colors duration-300`;
const tones = {
  dark: "bg-[var(--fg)] text-[var(--bg)] hover:bg-[var(--accent)] hover:text-white focus-visible:bg-[var(--accent)] focus-visible:text-white",
  light: "bg-[var(--card)] text-[var(--fg)] hover:bg-[var(--accent)] hover:text-white focus-visible:bg-[var(--accent)] focus-visible:text-white",
};
const arrow = <MoveRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />;

type Props = { label: string; tone?: keyof typeof tones; icon?: ReactNode; className?: string } & ({ href: string; onClick?: never } | { href?: never; onClick: () => void });

export default function Button({ label, tone = "dark", icon = arrow, className = "", href, onClick }: Props) {
  const classes = `${base} ${tones[tone]} ${className}`;
  const inside = (
    <>
      {label}
      {icon}
    </>
  );
  if (href === undefined)
    return (
      <button type="button" onClick={onClick} className={classes}>
        {inside}
      </button>
    );
  // In-page anchors stay plain links, so the smooth scroll takes them.
  return href.startsWith("#") ? (
    <a href={href} className={classes}>
      {inside}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {inside}
    </Link>
  );
}
