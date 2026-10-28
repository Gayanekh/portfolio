"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUp, MoveRight } from "lucide-react";
import { CLOSING, FOOTER } from "@/components/landing-next/content";
import {
  Headline,
  Label,
  Reveal,
  trackPointer,
} from "@/components/landing-next/kit";
import {
  button,
  buttonArrow,
  focusRing,
  font,
  grain,
  shell,
  type,
} from "@/components/landing-next/ui";
import { scrollPageTo } from "@/lib/scroll";

// Lower case, letters, numbers and single hyphens: how an address reads.
const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 40);

// The close, back in the night: "Start your portfolio." large, an address
// field whose name is drawn huge across the page as it is typed
// (portory.net/your-name), and Get started; a glow follows the pointer
// across it. Then the footer: the tagline and copyright, the links,
// and back to the top.
// `footer={null}` leaves the footer row out (a page with its own footer).
export default function Closing({
  copy = CLOSING,
  footer = FOOTER,
}: {
  copy?: typeof CLOSING;
  footer?: typeof FOOTER | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState("");
  const slug = toSlug(name);

  return (
    <footer
      onPointerMove={trackPointer}
      className="relative isolate mt-[clamp(1rem,2vw,2rem)] overflow-hidden rounded-t-[clamp(2rem,4vw,4.5rem)] bg-[var(--ink)] text-[var(--bone)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <span className="absolute inset-0 [background:radial-gradient(40rem_circle_at_var(--x,50%)_var(--y,30%),rgb(157_140_255/0.22),transparent_60%)]" />
        <span className="absolute bottom-[-40%] left-1/2 size-[min(70rem,130vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_179_138/0.16),transparent_60%)]" />
        <span className={`absolute inset-0 mix-blend-overlay ${grain}`} />
      </div>

      <section
        aria-label={copy.label}
        className={`${shell} flex flex-col gap-8 pb-[clamp(4rem,8vw,8rem)] pt-[clamp(6rem,11vw,11rem)]`}
      >
        <Reveal>
          <Label tone="dark">{copy.label}</Label>
        </Reveal>
        <Headline tone="dark" text={copy.title} className={type.mega} />
        <form
          className="mt-4 flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            // Already on the templates page: back up to them.
            if (pathname === copy.href) scrollPageTo(0);
            else router.push(copy.href);
          }}
        >
          <Reveal>
            <label className="flex flex-col gap-3">
              <span
                className={`${font.mono} text-[0.75rem] uppercase tracking-[0.18em] text-[var(--mist)]`}
              >
                {copy.field}
              </span>
              <span className="flex min-w-0 items-baseline border-0 border-b border-solid border-white/20 pb-3 transition-colors duration-300 focus-within:border-[var(--iris)]">
                <span
                  className={`shrink-0 ${font.display} text-[length:clamp(1.6rem,4.6vw,5rem)] font-semibold tracking-[-0.045em] text-white/30`}
                >
                  {copy.domain}
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={copy.placeholder}
                  autoComplete="off"
                  spellCheck={false}
                  className={`min-w-0 flex-1 border-0 bg-transparent p-0 ${font.display} text-[length:clamp(1.6rem,4.6vw,5rem)] font-semibold tracking-[-0.045em] text-[var(--bone)] caret-[var(--iris)] outline-none placeholder:text-white/15`}
                />
              </span>
            </label>
          </Reveal>
          <Reveal
            delay={0.1}
            className="flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <button type="submit" className={button.light}>
              {copy.button}
              <MoveRight aria-hidden="true" className={buttonArrow} />
            </button>
            <p
              aria-live="polite"
              className={`m-0 ${type.body} text-[var(--bone)]/55`}
            >
              {slug ? (
                <>
                  Your page would live at{" "}
                  <span className="text-[var(--bone)]">
                    {copy.domain}
                    {slug}
                  </span>
                </>
              ) : (
                copy.note
              )}
            </p>
          </Reveal>
        </form>
      </section>

      {footer && (
        <div
          className={`${shell} flex flex-col gap-8 border-0 border-t border-solid border-white/10 py-10 md:flex-row md:items-center md:justify-between`}
        >
          <div className="flex flex-col gap-2">
            <p
              className={`m-0 max-w-[24rem] ${type.body} text-[var(--bone)]/55`}
            >
              {footer.tagline}
            </p>
            <p
              className={`m-0 ${font.mono} text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--mist)]`}
            >
              {footer.copyright}
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
              {footer.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`${focusRing} rounded-[4px] text-[0.9375rem] text-[var(--bone)]/75 no-underline transition-colors hover:text-[var(--bone)]`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => scrollPageTo(0)}
            className={`${focusRing} group/top inline-flex w-fit cursor-pointer items-center gap-2 rounded-[4px] border-0 bg-transparent p-0 text-[0.9375rem] text-[var(--bone)]`}
          >
            {footer.top}
            <ArrowUp
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover/top:-translate-y-1"
            />
          </button>
        </div>
      )}
    </footer>
  );
}
