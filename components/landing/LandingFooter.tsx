"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { useLanding } from "@/components/landing/LandingProvider";
import { Reveal } from "@/components/landing/Reveal";
import { focusRing } from "@/components/landing/landing-ui";

const TAGLINE = "A simple way to create and publish a portfolio that feels like you.";

// Only links with somewhere real to go: the app's pages and this page's sections.
const LINKS: { href: string; label: string }[] = [
  { href: "/templates", label: "Templates" },
  { href: "/templates/gallery", label: "Gallery" },
  { href: "#make-it-yours", label: "Design" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

const label = "m-0 text-[13px] text-white/40";
const footerLink = `${focusRing} rounded text-[0.95rem] text-white/60 no-underline transition-colors hover:text-white`;

// The footer, dark, continuing the closing wall above it (FinalCTA), laid out
// like the How it works grid: columns divided by hairlines and nothing boxed
// in. The brand with its line set large and light, the page's links, and a
// way back to the top; then the copyright.
export default function LandingFooter() {
  const { motionReduced } = useLanding();
  // Extra bottom space below lg keeps the copyright clear of the floating call to action.
  return (
    <footer aria-label="Site footer" className="relative w-full overflow-hidden bg-foreground pb-24 pt-16 text-white md:pt-24 lg:pb-4 [&_:focus-visible]:outline-white">
      <div className="mx-auto flex w-content-width flex-col">
        <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* The brand. */}
          <Reveal className="flex flex-col gap-8 py-10 sm:col-span-2 lg:col-span-1 lg:pr-12">
            <Link href="/" aria-label="Portory home" className={`${focusRing} w-fit rounded`}>
              <Logo className="h-9 w-auto !text-white" />
            </Link>
            <p className="m-0 max-w-[26rem] text-balance text-[length:clamp(1.5rem,2.4vw,2.1rem)] font-light leading-[1.2] tracking-[-0.02em] text-white/85">{TAGLINE}</p>
          </Reveal>

          {/* The page's links. */}
          <Reveal delay={0.06} className="flex flex-col gap-5 border-white/10 py-10 sm:border-r-0 lg:border-l lg:pl-6">
            <p className={label}>Explore</p>
            <nav aria-label="Footer navigation">
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {LINKS.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className={footerLink}>{link.label}</Link>
                    ) : (
                      <a href={link.href} className={footerLink}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Back to the top. */}
          <Reveal delay={0.12} className="flex flex-col justify-between gap-8 border-white/10 py-10 sm:border-l sm:pl-6">
            <div className="flex flex-col gap-5">
              <p className={label}>Start</p>
              <p className="m-0 max-w-[16rem] text-[0.95rem] leading-relaxed text-white/60">Pick a template, make it yours and publish it, all in one place.</p>
            </div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: motionReduced ? "auto" : "smooth" })}
              className={`${focusRing} group inline-flex w-fit cursor-pointer items-center gap-2 rounded border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/40`}
            >
              Back to top
              <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </Reveal>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2026{" "}
            <Link href="/" className={`${focusRing} rounded text-white/70 no-underline hover:text-white`}>
              Portory
            </Link>
            . All rights reserved.
          </span>
          <span>portory.net</span>
        </div>
      </div>
    </footer>
  );
}
