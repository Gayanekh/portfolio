import Link from "next/link";
import type { ReactNode } from "react";
import { MoveRight } from "lucide-react";
import { focusRing } from "@/components/template-landing/ui";

// Every button on /template-landing (the user chose /other-landing's): 4px
// corners, the label and an arrow that slides on hover; dark (the page's ink)
// or light (its card grey). On hover they turn dark, never orange (the user asked):
// the dark one a shade lighter ink, the light one the page's ink with light text. A link with `href`, or a plain button with
// `onClick`; `icon` replaces the arrow.
const base = `${focusRing} group/button inline-flex h-11 w-fit shrink-0 cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-[4px] border-0 px-5 text-[0.9375rem] font-medium tracking-[-0.01em] no-underline transition-colors duration-300`;
const tones = {
  dark: "bg-[var(--fg)] text-[var(--bg)] hover:bg-[color-mix(in_srgb,var(--fg)_82%,var(--bg))] focus-visible:bg-[color-mix(in_srgb,var(--fg)_82%,var(--bg))]",
  light: "bg-[var(--card)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] focus-visible:bg-[var(--fg)] focus-visible:text-[var(--bg)]",
  // Outlined (the hero's, the user asked): like the header's menu buttons, a fine
  // line in the ink and 10px corners; on hover it stays as it is (no fill) and only the arrow slides.
  outline: "!rounded-[10px] !border border-solid border-[var(--fg)] bg-transparent text-[var(--fg)]",
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
