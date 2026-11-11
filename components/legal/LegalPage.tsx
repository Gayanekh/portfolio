import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { CONTACT_EMAIL, UPDATED, type Block, type Doc } from "@/components/legal/content";
import { fonts, serif } from "@/components/template-landing/ui";

// One layout for the Privacy and Terms pages: the Portory wordmark (home), the title with its last word in the serif
// italic, then the sections, each with a small mono number and name on the left and its text on the right.
const label = "font-mono text-[0.75rem] uppercase tracking-[0.04em] text-foreground/55";
const body = "m-0 max-w-[40rem] text-[1.0625rem] leading-[1.65] text-foreground/75";
const link = "rounded text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
const row = "grid gap-4 border-0 border-t border-solid border-foreground/15 pt-8 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-12";

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) =>
        "p" in block ? (
          <p key={i} className={body}>
            {block.p}
          </p>
        ) : (
          <ul key={i} className="m-0 flex list-none flex-col gap-3 p-0">
            {block.ul.map((item) => (
              <li key={item} className={`${body} flex gap-3`}>
                <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 bg-foreground/40" />
                {item}
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

export default function LegalPage({ doc }: { doc: Doc }) {
  return (
    <main className={`${fonts} min-h-screen bg-background text-foreground`}>
      <div className="mx-auto flex w-full max-w-[90rem] flex-col px-[clamp(1.5rem,3vw,3rem)]">
        <header className="flex h-20 items-center justify-between">
          <Link href="/" aria-label="Portory home" className="rounded transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
            <Logo className="h-6 w-auto text-foreground/85" title={null} />
          </Link>
          <Link href="/" className={`${label} ${link} no-underline`}>
            Back to Portory
          </Link>
        </header>

        <div className="grid gap-12 pb-[clamp(4rem,8vw,7rem)] pt-[clamp(3rem,7vw,6rem)] lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-20">
          <p className={`${label} m-0`}>Updated {UPDATED}</p>
          <div className="flex flex-col gap-[clamp(3rem,5vw,4.5rem)]">
            <div className="flex flex-col gap-7">
              <h1 className="m-0 text-[length:clamp(3rem,calc(1.6rem_+_5vw),6rem)] font-medium leading-[0.95] tracking-[-0.055em]">
                {doc.title} <span className={serif}>{doc.italic}</span>
              </h1>
              <p className={`${body} text-[1.1875rem]`}>{doc.intro}</p>
            </div>

            {doc.sections.map((section, i) => (
              <section key={section.title} aria-labelledby={`legal-${i}`} className={row}>
                <h2 id={`legal-${i}`} className={`${label} m-0 font-normal`}>
                  {String(i + 1).padStart(2, "0")} — {section.title}
                </h2>
                <Blocks blocks={section.blocks} />
              </section>
            ))}

            <section aria-labelledby="legal-contact" className={row}>
              <h2 id="legal-contact" className={`${label} m-0 font-normal`}>
                {String(doc.sections.length + 1).padStart(2, "0")} — Contact
              </h2>
              <p className={body}>
                Questions about this page? Write to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className={link}>
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-0 border-t border-solid border-foreground/15 py-8">
          <p className={`${label} m-0`}>© 2026 Portory</p>
          <Link href={doc.other.href} className={`${label} ${link} no-underline`}>
            {doc.other.label}
          </Link>
        </footer>
      </div>
    </main>
  );
}
