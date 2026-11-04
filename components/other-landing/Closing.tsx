import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { CLOSING } from "@/components/other-landing/content";
import { MaskLines, Reveal } from "@/components/other-landing/parts";
import { colors, focusRing, frame, section, type } from "@/components/other-landing/ui";

// The closing call: the question, a line and Start now on the right half,
// then one large centred line that leads to the templates. A page borrowing
// it can give it its own frame and spacing (`shell`), raise the question's
// lines out of masks as its own titles do (`mask`), and name the link in its
// own words (`start`, `text`, `more`), or put its own button in the link's
// place (`action`).
export default function Closing({ shell = `${frame} ${section}`, mask = false, start = CLOSING.start.label, text = CLOSING.text, more = CLOSING.more.label, action }: { shell?: string; mask?: boolean; start?: string; text?: string; more?: string; action?: ReactNode }) {
  return (
    <section aria-labelledby="closing-title" className={shell}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="md:col-start-2">
          {mask ? (
            <h2 id="closing-title" className={type.closing}>
              <MaskLines lines={CLOSING.title} />
            </h2>
          ) : (
            <Reveal>
              <h2 id="closing-title" className={type.closing}>
                {CLOSING.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </Reveal>
          )}
          <Reveal order={1}>
            <p className={`mb-0 mt-[clamp(1.25rem,2.2vw,2.25rem)] max-w-[32rem] ${type.lead} ${colors.quiet}`}>{text}</p>
          </Reveal>
          <Reveal order={2} className="mt-[clamp(1.5rem,2.2vw,2rem)]">
            {action ?? (
              <Link href={CLOSING.start.href} className={`${focusRing} group inline-flex items-center gap-2 rounded-[4px] border-0 border-b-2 border-solid border-[#090909] pb-1 ${type.lead} text-[#090909] no-underline`}>
                {start}
                <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className="size-[1.2em] text-[#4b4fe0] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </Reveal>
        </div>
      </div>
      <Reveal className="mt-[clamp(6rem,14vw,14rem)] text-center">
        <Link href={CLOSING.more.href} className={`${focusRing} rounded-[4px] ${type.closingLine} text-[#090909] no-underline transition-colors duration-300 hover:text-[#777]`}>
          {more}
        </Link>
      </Reveal>
    </section>
  );
}
