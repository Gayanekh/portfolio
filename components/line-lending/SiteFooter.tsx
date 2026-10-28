"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import LogoMark from "@/components/brand/LogoMark";
import { Reveal } from "@/components/landing-next/kit";
import { focusRing, font, shell, type } from "@/components/landing-next/ui";
import { SITE_FOOTER } from "@/components/line-lending/content";
import { scrollPageTo } from "@/lib/scroll";

const label = `m-0 ${font.mono} text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--mist)]`;
const footerLink = `${focusRing} rounded-[4px] text-[0.9375rem] text-[var(--bone)]/65 no-underline transition-colors hover:text-[var(--bone)]`;

// The home page's footer, in the night: three columns divided by hairlines
// (the mark with the tagline set large and light, the page's links, and the
// start line with back to the top), then the copyright and the address.
export default function SiteFooter() {
  return (
    <footer aria-label="Site footer" className="relative z-10 bg-[var(--ink)] pb-24 pt-[clamp(3rem,6vw,5rem)] text-[var(--bone)] lg:pb-4">
      <div className={`${shell} flex flex-col`}>
        <div className="grid grid-cols-1 border-0 border-t border-solid border-white/10 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal className="flex flex-col gap-8 py-10 sm:col-span-2 lg:col-span-1 lg:pr-12">
            <Link href="/" aria-label="Portory home" className={`${focusRing} grid size-11 place-items-center rounded-xl bg-[var(--bone)] transition-transform duration-300 hover:-translate-y-0.5`}>
              <LogoMark className="size-7" title={null} />
            </Link>
            <p className={`m-0 max-w-[26rem] text-balance ${type.lead} font-light text-[var(--bone)]/85`}>{SITE_FOOTER.tagline}</p>
          </Reveal>

          <Reveal delay={0.06} className="flex flex-col gap-5 border-0 border-solid border-white/10 py-10 lg:border-l lg:pl-6">
            <p className={label}>{SITE_FOOTER.explore}</p>
            <nav aria-label="Footer navigation">
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {SITE_FOOTER.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal delay={0.12} className="flex flex-col justify-between gap-8 border-0 border-solid border-white/10 py-10 sm:border-l sm:pl-6">
            <div className="flex flex-col gap-5">
              <p className={label}>{SITE_FOOTER.start}</p>
              <p className={`m-0 max-w-[16rem] ${type.body} text-[var(--bone)]/65`}>{SITE_FOOTER.startText}</p>
            </div>
            <button
              type="button"
              onClick={() => scrollPageTo(0)}
              className={`${focusRing} group/top inline-flex w-fit cursor-pointer items-center gap-2 rounded-[4px] border border-solid border-white/15 bg-transparent px-4 py-2.5 text-[0.875rem] font-medium text-[var(--bone)] transition-colors hover:border-white/40`}
            >
              {SITE_FOOTER.top}
              <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/top:-translate-y-0.5" />
            </button>
          </Reveal>
        </div>

        <div className="flex flex-col gap-2 border-0 border-t border-solid border-white/10 py-6 text-[0.8125rem] text-[var(--bone)]/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {SITE_FOOTER.copyright}{" "}
            <Link href="/" className={`${focusRing} rounded-[4px] text-[var(--bone)]/75 no-underline hover:text-[var(--bone)]`}>
              {SITE_FOOTER.brand}
            </Link>
            {SITE_FOOTER.rights}
          </span>
          <span>{SITE_FOOTER.site}</span>
        </div>
      </div>
    </footer>
  );
}
