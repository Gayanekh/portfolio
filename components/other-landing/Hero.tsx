import { HERO } from "@/components/other-landing/content";
import Cover from "@/components/other-landing/Cover";
import { Button, Dim, Reveal } from "@/components/other-landing/parts";
import { colors, frame, type } from "@/components/other-landing/ui";

// Two lines, a sentence and the buttons on the left; on the right, the
// template picture of /template-landing's hero (the user asked for it): one
// template's cover, as wide as the right half and as tall as the words beside
// it. On phones it comes under the buttons.
export default function Hero() {
  return (
    <section id="top" className={`${frame} grid min-h-[min(44rem,88svh)] content-center gap-[clamp(2.5rem,4vw,4rem)] pb-[clamp(2rem,5vw,5rem)] pt-[clamp(7rem,14vw,11rem)] lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:items-stretch`}>
      <div className="flex flex-col justify-center">
        <Reveal>
          <h1 className={type.hero}>
            {HERO.lines.map((line) => (
              <span key={line} className="block">
                <Dim text={line} />
              </span>
            ))}
          </h1>
        </Reveal>
        <Reveal order={1}>
          <p className={`mb-0 mt-[clamp(1.25rem,2vw,1.75rem)] max-w-[26rem] ${type.body} ${colors.body}`}>{HERO.text}</p>
        </Reveal>
        <Reveal order={2} className="mt-[clamp(2rem,3vw,2.75rem)] flex flex-wrap gap-3">
          <Button href={HERO.primary.href} label={HERO.primary.label} />
          <Button href={HERO.secondary.href} label={HERO.secondary.label} tone="light" />
        </Reveal>
      </div>
      <Reveal order={1} className="relative min-h-[14rem] overflow-hidden rounded-[10px] [--cover-zoom:1.2] lg:min-h-0">
        <Cover src={HERO.picture.src} name={HERO.picture.name} shape="fill" />
      </Reveal>
    </section>
  );
}
