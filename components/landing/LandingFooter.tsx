"use client";

import Link from "next/link";
import LogoMark from "@/components/brand/LogoMark";
import { Reveal } from "@/components/landing/Reveal";
import { MaskWords } from "@/components/landing/scroll-fx";
import { focusRing, fluidText } from "@/components/landing/landing-ui";

const TAGLINE = "A simple way to create and publish a portfolio that feels like you.";

// Only links with somewhere real to go: the app's pages and this page's sections.
const LINKS: { href: string; label: string }[] = [
  { href: "/templates", label: "Templates" },
  { href: "/templates/gallery", label: "Gallery" },
  { href: "#make-it-yours", label: "Design" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

const label = "m-0 text-[0.8125rem] text-white/40";
const footerLink = `${focusRing} rounded text-[0.95rem] text-white/60 no-underline transition-colors hover:text-white`;

// The footer, dark, continuing the closing wall above it (FinalCTA), laid out
// like the How it works grid: columns divided by hairlines and nothing boxed
// in. The brand with its line set large and light, the page's links, and a
// short line on starting; then the copyright.
export default function LandingFooter() {
  // Extra bottom space below lg keeps the copyright clear of the floating call to action.
  return (
    <footer aria-label="Site footer" className="relative w-full overflow-hidden bg-foreground pb-24 pt-[clamp(4rem,calc(1.456rem_+_9.467vw),6rem)] text-white lg:pb-4 [&_:focus-visible]:outline-white">
      <div className="mx-auto flex w-content-width flex-col">
        <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* The brand. */}
          <Reveal className="flex flex-col gap-8 py-10 sm:col-span-2 lg:col-span-1 lg:pr-12">
            <Link href="/" aria-label="Portory home" className={`${focusRing} grid size-10 place-items-center rounded-xl bg-white transition-transform duration-300 hover:-translate-y-0.5`}>
              <LogoMark className="size-7" />
            </Link>
            <p className={`m-0 max-w-[26rem] text-balance ${fluidText.footerLead} font-light leading-[1.3] tracking-[-0.02em] text-white/85`}>
              <MaskWords text={TAGLINE} delay={0.1} />
            </p>
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

          {/* Start. */}
          <Reveal delay={0.12} className="flex flex-col gap-8 border-white/10 py-10 sm:border-l sm:pl-6">
            <div className="flex flex-col gap-5">
              <p className={label}>Start</p>
              <p className="m-0 max-w-[16rem] text-[0.95rem] leading-relaxed text-white/60">Pick a template, make it yours and publish it, all in one place.</p>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-[0.8125rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
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
