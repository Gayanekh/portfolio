"use client";

import Link from "next/link";
import { Reveal, RollText, SplitWords } from "@/components/landing/Reveal";
import { Art, type ArtKey } from "@/components/landing/sample-portfolios";
import { card, focusRing, primaryButton, section, sectionIntro, sectionTitle, tag, text } from "@/components/landing/landing-ui";

// The reference FAQ section's skeleton, shared by every landing section:
// section > content width > card, holding a centred header, the body, a
// hairline divider and a footer row with a call to action.
export const sectionCard = `${card} flex flex-col gap-6 rounded-2xl p-6 md:gap-10 md:p-10`;

export function LandingSection({
  id,
  sectionId,
  label,
  className = "",
  cardClassName = "",
  children,
}: {
  id?: string;
  sectionId?: string;
  label: string;
  className?: string;
  cardClassName?: string;
  children: React.ReactNode;
}) {
  const body = (
    <section id={sectionId} aria-label={label} className={`${section} ${className}`}>
      <div className="w-content-width mx-auto">
        <div className={`${sectionCard} ${cardClassName}`}>{children}</div>
      </div>
    </section>
  );
  // Anchor ids sit on a wrapper div around the section, as before.
  return id ? <div id={id}>{body}</div> : body;
}

export function SectionHeader({
  label,
  title,
  intro,
  children,
}: {
  label?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <div className={tag}><p className="m-0">{label}</p></div>}
      <SplitWords as="h2" text={title} className={sectionTitle} />
      {intro && <SplitWords as="p" text={intro} className={sectionIntro} />}
      {children}
    </div>
  );
}

export function SectionDivider() {
  return <div className="h-px w-full bg-foreground/5" />;
}

export function SectionFooter({
  art = "chem",
  title,
  detail,
  children,
}: {
  art?: ArtKey;
  title: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className="block size-10 shrink-0 overflow-hidden rounded-full md:size-11 2xl:size-12"><Art name={art} /></span>
        <div className="flex min-w-0 flex-col">
          <span className={`${text.base} font-semibold leading-snug text-foreground`}>{title}</span>
          <span className={`${text.base} leading-snug text-foreground/75`}>{detail}</span>
        </div>
      </div>
      <Reveal className="flex flex-wrap gap-3">{children}</Reveal>
    </div>
  );
}

export const ctaClass = `${focusRing} ${primaryButton} group flex h-10 items-center justify-center rounded-2xl px-6 text-sm no-underline`;

export function CtaLink({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <Link href={href} className={`${ctaClass} ${className}`}>
      <RollText text={label} />
    </Link>
  );
}
