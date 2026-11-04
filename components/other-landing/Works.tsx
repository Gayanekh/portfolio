import { WORKS } from "@/components/other-landing/content";
import Cover from "@/components/other-landing/Cover";
import { Button, Label, Reveal } from "@/components/other-landing/parts";
import { focusRing, frame, tag } from "@/components/other-landing/ui";

// Where each work sits on desktop, after the reference's works grid: rows of
// a small square and a large wide card with an open column between, their
// feet aligned, the sides swapping every row. /template-landing's grid uses it too.
export const LAYOUT = [
  { shape: "square", place: "md:col-span-5 lg:col-span-4" },
  { shape: "wide", place: "md:col-span-7 lg:col-span-7 lg:col-start-6" },
  { shape: "wide", place: "md:col-span-7 lg:col-span-7" },
  { shape: "square", place: "md:col-span-5 lg:col-span-4 lg:col-start-9" },
] as const;

// The reference's Recent works: every template's cover with its name and its
// tags. Each opens its demo in a new tab.
export default function Works() {
  return (
    <section id="templates" aria-label={WORKS.label} className={`${frame} scroll-mt-20 pb-[clamp(4.5rem,8vw,7.5rem)]`}>
      <Label>{WORKS.label}</Label>
      <ul className="m-0 mt-[clamp(1rem,1.5vw,1.25rem)] grid list-none grid-cols-1 items-end gap-x-[clamp(0.75rem,1.4vw,1.25rem)] gap-y-[clamp(2.5rem,5vw,4.5rem)] p-0 md:grid-cols-12">
        {WORKS.items.map((work, i) => {
          const { shape, place } = LAYOUT[i % LAYOUT.length];
          return (
            <li key={work.id} className={place}>
              <Reveal order={i % 2}>
                <a href={work.href} target="_blank" rel="noopener noreferrer" className={`${focusRing} group block rounded-[10px] no-underline`}>
                  <Cover src={work.screen} name={work.name} shape={shape} />
                  <span className="mt-[clamp(0.75rem,1vw,1rem)] flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <span className="text-[length:clamp(1.375rem,calc(1.2rem_+_0.5vw),1.875rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[#090909]">{work.name}</span>
                    <span className="flex flex-wrap gap-1.5">
                      {work.tags.map((label) => (
                        <span key={label} className={tag}>
                          {label}
                        </span>
                      ))}
                    </span>
                  </span>
                </a>
              </Reveal>
            </li>
          );
        })}
      </ul>
      <div className="mt-[clamp(2.5rem,4vw,3.5rem)] flex justify-center">
        <Button href={WORKS.all.href} label={WORKS.all.label} tone="light" />
      </div>
    </section>
  );
}
