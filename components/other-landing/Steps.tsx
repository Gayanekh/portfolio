import Link from "next/link";
import { MoveRight } from "lucide-react";
import { STEPS } from "@/components/other-landing/content";
import { Dim, Heading, Reveal } from "@/components/other-landing/parts";
import { colors, focusRing, frame, gap, pad, section, type } from "@/components/other-landing/ui";

// The reference's process: the heading on the left half, numbered steps on
// the right, each closed by a hairline.
export default function Steps() {
  return (
    <section id="how-it-works" aria-labelledby="steps-title" className={`${frame} ${section} grid grid-cols-1 md:grid-cols-2 ${gap} gap-y-10`}>
      <div className="self-start md:sticky md:top-24">
        <Heading id="steps-title" label={STEPS.label} lines={STEPS.title} />
      </div>
      <ol className="m-0 list-none p-0 md:mt-[2.15rem]">
        {STEPS.items.map((step, i) => (
          <li key={step.title} className={`border-0 border-b border-solid ${colors.line} py-[clamp(1.75rem,2.6vw,2.4rem)] first:pt-0`}>
            <Reveal className="grid grid-cols-[clamp(4rem,9vw,8.4rem)_1fr]">
              <span className={type.heading}>{pad(i + 1)}.</span>
              <div>
                <h3 className={type.title}>
                  <Dim text={step.title} />
                </h3>
                <p className={`mb-0 mt-[clamp(0.75rem,1.4vw,1.25rem)] max-w-[21rem] ${type.body} ${colors.body}`}>{step.text}</p>
                <Link href={step.cta.href} className={`${focusRing} group mt-4 inline-flex items-center gap-2 rounded-[4px] ${type.small} font-medium text-[#090909] no-underline`}>
                  {step.cta.label}
                  <MoveRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
