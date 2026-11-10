import Link from "next/link";
import type { ReactNode } from "react";
import { MoveRight } from "lucide-react";
import { BRAND, FOOTER } from "@/components/minimal-landing/content";
import { Reveal, Words } from "@/components/minimal-landing/kit";
import { button, caps, focusRing, logoFont, serif } from "@/components/minimal-landing/ui";

// The close, after the reference: a ruled grid with "let's START" and the
// button in one cell and a serif line in the next; then the dark footer with
// the logo and tagline, the links in labelled columns, your address, and a picture on the right
// (or, where another page gives one, its own `aside` in the picture's place).
// A page with its own closing call can leave the close out (`close`), and
// the ™ (`mark`), or show its own `logo` in place of the wordmark.
// The footer's link column: the site's pages (the account's log in and sign up
// were left out at the user's request).
const ACCOUNT = new RegExp("^/(login|register)");
const GROUPS = [{ label: "Explore", match: (item: { href: string }) => !ACCOUNT.test(item.href) }];

// A column's label: a small square and the word in small mono capitals.
function FooterLabel({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[#f8f7f6]/45">
      <span aria-hidden="true" className="block size-1.5 bg-current" />
      {children}
    </p>
  );
}

export default function Footer({ aside, close = true, mark = true, logo }: { aside?: ReactNode; close?: boolean; mark?: boolean; logo?: ReactNode } = {}) {
  return (
    <footer>
      {close && (
      <div className="border-0 border-y border-solid border-[#16171a]/15">
        <div className="mx-auto grid max-w-[90rem] md:grid-cols-[1fr_minmax(0,25.5rem)_minmax(0,25.5rem)_1fr]">
          <span className="hidden md:block" />
          <div className="flex flex-col items-center gap-12 border-0 border-solid border-[#16171a]/15 px-6 py-12 text-center md:border-x">
            <p className="m-0 flex items-center gap-2 text-[1.125rem]">
              {FOOTER.route.from}
              <MoveRight aria-hidden="true" strokeWidth={1.25} className="size-10" />
              {FOOTER.route.to}
            </p>
            <Reveal>
              <h2 className="m-0 flex flex-col items-center">
                <span className={`${serif} text-[clamp(4rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.04em]`}>{FOOTER.italic}</span>
                <span className={`${caps} text-[clamp(3.5rem,6vw,4.75rem)] leading-[1]`}>{FOOTER.caps}</span>
              </h2>
            </Reveal>
            <Link href={FOOTER.action.href} className={button}>
              {FOOTER.action.label}
            </Link>
          </div>
          <div className="flex items-center border-0 border-t border-solid border-[#16171a]/15 px-10 py-12 md:border-r md:border-t-0">
            <Words text={FOOTER.quote} className="text-center font-[family-name:var(--ml-serif)] text-[2.1rem] leading-[1.3] tracking-[-0.01em]" />
          </div>
          <span className="hidden md:block" />
        </div>
      </div>
      )}

      {/* A size container, so the left column can start where the page's other sections start (their 90rem frame). */}
      <div className="grid bg-[#16171a] text-[#f8f7f6] [container-type:inline-size] lg:grid-cols-[1fr_minmax(0,34rem)]">
        {/* The footer's own part (redesigned at the user's request): the logo and
            tagline, then the site's links in a labelled column and where your
            site lives; under a hairline the year. The
            column labels are small mono capitals after a square, like the page's
            section labels; the text is small and soft white, brightening on hover. */}
        <div className="flex flex-col justify-between gap-14 py-14 pl-[max(clamp(1.5rem,3vw,3rem),calc((100cqw_-_90rem)/2_+_clamp(1.5rem,3vw,3rem)))] pr-5 sm:pr-10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
            <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
              {logo ?? (
                <span className={`${logoFont} text-[2.25rem] leading-none tracking-[-0.04em]`}>
                  {BRAND}
                  {mark && <sup className="ml-0.5 text-[0.75rem] font-medium">™</sup>}
                </span>
              )}
              <p className="m-0 max-w-[14rem] text-[0.9375rem] leading-[1.5] text-[#f8f7f6]/60">{FOOTER.tagline}</p>
            </div>
            {GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-4">
                <FooterLabel>{group.label}</FooterLabel>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                  {FOOTER.links.filter(group.match).map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className={`${focusRing} rounded whitespace-nowrap text-[0.9375rem] text-[#f8f7f6]/70 no-underline transition-colors hover:text-[#f8f7f6]`}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-col gap-4">
              <FooterLabel>Your site</FooterLabel>
              <div className="flex flex-col gap-1">
                <span className="text-[1.125rem] leading-[1.3] tracking-[-0.02em] text-[#f8f7f6]">{FOOTER.contact.line}/you</span>
                <span className="text-[0.875rem] text-[#f8f7f6]/45">{FOOTER.contact.note}</span>
              </div>
            </div>
          </div>
          <p className="m-0 border-0 border-t border-solid border-[#f8f7f6]/10 pt-6 text-[0.8125rem] text-[#f8f7f6]/40">{FOOTER.note}</p>
        </div>
        {/* The picture (or the page's own aside): first when the footer stacks on
            narrower screens (Browse templates, then the rest; the user asked). */}
        <div className="max-lg:order-first">
          {aside ?? (
            // eslint-disable-next-line @next/next/no-img-element -- a local screenshot
            <img src={FOOTER.image} alt="" loading="lazy" className="block h-72 w-full object-cover lg:h-full lg:min-h-[32rem]" />
          )}
        </div>
      </div>
    </footer>
  );
}
