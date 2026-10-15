"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUp } from "lucide-react";
import BrandMark from "@/components/auth/BrandMark";
import { useLanding } from "@/components/landing/LandingProvider";
import { Reveal } from "@/components/landing/Reveal";
import { focusRing, primaryButton } from "@/components/landing/landing-ui";

const TAGLINE = "A simple way to create and publish a portfolio that feels like you.";

// Every previous footer link is kept (Templates, How it works, About,
// Privacy, Terms), alongside the real pages and the page's sections.
const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/templates", label: "Templates" },
      { href: "/templates/gallery", label: "Gallery" },
      { href: "#make-it-yours", label: "Design" },
      { href: "#how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Get started",
    links: [
      { href: "/register", label: "Create an account" },
      { href: "/login", label: "Log in" },
      { href: "/templates", label: "Start building" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "#faq", label: "FAQ" },
      { href: "#about", label: "About" },
      { href: "#contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
    ],
  },
];

const footerLink = `${focusRing} rounded text-[0.95rem] text-foreground/60 no-underline transition-colors hover:text-foreground`;
const roundButton = `${focusRing} ${primaryButton} flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full`;

// The footer: the brand and a short line with a link to claim an address,
// four link columns, the Portory wordmark across the full width (fading out
// at the bottom), then the copyright and the back-to-top button.
export default function LandingFooter() {
  const { motionReduced } = useLanding();
  // Extra bottom space below lg keeps the copyright clear of the floating call to action.
  return (
    <footer aria-label="Site footer" className="relative w-full overflow-hidden pb-28 pt-20 md:pt-28 lg:pb-8">
      <div className="mx-auto flex w-content-width flex-col">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <Reveal className="flex max-w-[24rem] flex-col items-start gap-5">
            <Link href="/" aria-label="Portory home" className={`${focusRing} rounded-lg`}>
              <BrandMark />
            </Link>
            <p className="m-0 text-pretty text-base leading-relaxed text-foreground/60">{TAGLINE}</p>
            <Link
              href="/register"
              className={`${focusRing} group inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-foreground no-underline shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors hover:border-foreground/25`}
            >
              <span className="rounded-full bg-foreground px-2.5 py-1 text-xs text-white">portory.net/you</span>
              Claim your address
              <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((column, i) => (
              <Reveal key={column.title} delay={i * 0.06} className="flex flex-col gap-4">
                <p className="m-0 text-xs font-medium uppercase tracking-[0.08em] text-foreground">{column.title}</p>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link href={link.href} className={footerLink}>{link.label}</Link>
                      ) : (
                        <a href={link.href} className={footerLink}>{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </nav>
        </div>

        {/* The wordmark across the full width, fading out towards the bottom. */}
        <Reveal className="mt-16 md:mt-24">
          <Image
            src="/images/brand/portory-wordmark.png"
            alt=""
            aria-hidden="true"
            width={1064}
            height={276}
            sizes="(min-width: 1024px) 72vw, 85vw"
            className="h-auto w-full select-none opacity-[0.9] [mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)]"
          />
        </Reveal>

        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-5 border-t border-foreground/10 pt-6 sm:flex-row">
          <span className="text-sm text-foreground/50">
            © 2026{" "}
            <Link href="/" className={`${focusRing} rounded text-foreground/70 no-underline hover:text-foreground`}>
              Portory
            </Link>
            . All rights reserved.
          </span>
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: motionReduced ? "auto" : "smooth" })}
            className={roundButton}
          >
            <ArrowUp aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
