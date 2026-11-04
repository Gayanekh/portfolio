import { MADE_FOR } from "@/components/other-landing/content";
import Marquee from "@/components/other-landing/Marquee";
import Picture from "@/components/other-landing/Picture";
import { Heading } from "@/components/other-landing/parts";
import { colors, frame, section, type } from "@/components/other-landing/ui";

// The cards on their own, sliding past: what each template says, and who it
// is made for. /template-landing shows them under its own heading.
export function MadeForCards() {
  return (
    <Marquee className="[--marquee-time:60s]">
      {MADE_FOR.items.map((item) => (
        <figure key={item.id} className={`m-0 mr-[0.9rem] flex w-[clamp(16rem,21vw,19.5rem)] shrink-0 flex-col justify-between gap-10 p-[0.6rem] pb-[1.2rem] ${colors.card} min-h-[clamp(15rem,21vw,19.5rem)]`}>
          <blockquote className={`m-0 ${type.body} text-[#090909]`}>{item.quote}</blockquote>
          <figcaption className="flex items-center gap-3.5">
            <span className="relative size-[2.8rem] shrink-0 overflow-hidden">
              <Picture src={item.image} alt="" sizes="3rem" className="object-cover" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className={`${type.body} text-[#090909]`}>{item.name}</span>
              <span className={`${type.small} ${colors.quiet} line-clamp-2`}>{item.role}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </Marquee>
  );
}

// The reference's client quotes, told by the templates themselves, under a
// centred heading.
export default function MadeFor() {
  return (
    <section aria-labelledby="made-for-title" className={section}>
      <div className={frame}>
        <Heading id="made-for-title" label={MADE_FOR.label} lines={MADE_FOR.title} center />
      </div>
      <div className={`${frame} mt-[clamp(2rem,2.5vw,2.25rem)]`}>
        <MadeForCards />
      </div>
    </section>
  );
}
