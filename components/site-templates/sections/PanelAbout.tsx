"use client";

import { ArrowRight } from "lucide-react";
import { FieldPicture } from "../core/blocks";
import { useField, useTemplate } from "../core/context";
import { AccentNumber, arrowIcon, arrowLink, CountUp, FieldValue, PanelFrame, PanelTitle, Rise, Sweep, type } from "./panel-kit";

// About, in the hero's panels:
//
//   [ eyebrow ][                    ][                ][ 02 ]
//   [ about (huge), across          ][ portrait, to the edge  ]
//   [ figures ][ lead, bio, name, → ][                        ]
//   [         ][                    ][ facts          ][ since]
//
// The title rises from behind an edge, the portrait sweeps open from below,
// the figures count up and the rest drifts in. On phones: the eyebrow, the
// title, the portrait, the text, the figures, then the facts.
//
// Its section's fields: `eyebrow`, `title`, `image`, `lead`, `bio1`, `bio2`,
// `signature`, `cta` (glides to `ctaTarget`), `since`, `stat1Value` and
// `stat1Label`... and `fact1Label` and `fact1Value`...

const place = {
  eyebrow: "px-5 pt-14 @xl:col-start-1 @xl:row-start-1 @xl:px-[3.2cqw] @xl:pt-[2.4cqw]",
  accent: "@xl:col-start-4 @xl:row-start-1",
  title: "px-5 pt-4 @xl:col-span-2 @xl:col-start-1 @xl:row-start-2 @xl:px-[3.2cqw] @xl:pt-[4svh]",
  image: "mt-8 aspect-[4/5] @xl:col-span-2 @xl:col-start-3 @xl:row-span-2 @xl:row-start-2 @xl:mt-0 @xl:aspect-auto @xl:min-h-[68svh]",
  text: "px-5 pt-10 @xl:col-start-2 @xl:row-start-3 @xl:pb-[8svh] @xl:pl-[3.3cqw] @xl:pr-[3cqw] @xl:pt-[10svh]",
  stats: "grid grid-cols-3 gap-4 px-5 pt-12 @xl:col-start-1 @xl:row-start-3 @xl:flex @xl:flex-col @xl:gap-[5svh] @xl:px-[3.2cqw] @xl:pt-[10svh]",
  facts: "grid grid-cols-2 gap-x-6 gap-y-6 px-5 py-12 @xl:col-start-3 @xl:row-start-4 @xl:content-center @xl:px-[2.6cqw] @xl:py-[5svh]",
  since: "hidden bg-primary text-card @xl:col-start-4 @xl:row-start-4 @xl:grid @xl:place-items-center",
};

export default function PanelAbout({ stats, facts, ctaTarget }: { stats: number[]; facts: number[]; ctaTarget: string }) {
  const { navigate } = useTemplate();
  const name = useField("signature").value;

  return (
    <PanelFrame grid="@xl:grid-rows-[20svh_auto_auto_auto]">
      <div className={place.eyebrow}>
        <Rise>
          <div className={type.eyebrow}>
            <FieldValue field="eyebrow" />
          </div>
        </Rise>
      </div>

      <div className={place.accent}>
        <AccentNumber />
      </div>

      <div className={place.title}>
        <PanelTitle field="title" size="hero" />
      </div>

      <Sweep className={place.image}>
        <FieldPicture field="image" alt={name} className="absolute inset-0 block h-full w-full object-cover" />
      </Sweep>

      <div className={place.text}>
        <Rise>
          <p className={`m-0 ${type.lead}`}>
            <FieldValue field="lead" />
          </p>
        </Rise>
        <Rise delay={0.1} className="mt-[4svh] flex max-w-[26rem] flex-col gap-4">
          <p className={`m-0 ${type.body}`}>
            <FieldValue field="bio1" />
          </p>
          <p className={`m-0 ${type.muted}`}>
            <FieldValue field="bio2" />
          </p>
        </Rise>
        <Rise delay={0.2} className="mt-[5svh] flex flex-wrap items-center gap-x-8 gap-y-4">
          <span className="font-display text-[length:clamp(1.4rem,2cqw,2rem)] font-bold italic tracking-[-0.04em]">
            <FieldValue field="signature" />
          </span>
          <button type="button" onClick={() => navigate(ctaTarget)} className={arrowLink}>
            <FieldValue field="cta" />
            <ArrowRight aria-hidden="true" className={arrowIcon} strokeWidth={1.5} />
          </button>
        </Rise>
      </div>

      <div className={place.stats}>
        {stats.map((n, i) => (
          <Rise key={n} delay={i * 0.1} className="flex flex-col gap-1">
            <CountUp field={`stat${n}Value`} className="font-display text-[length:clamp(2.25rem,4cqw,4rem)] font-bold leading-none tracking-[-0.05em]" />
            <span className="text-[12px] leading-snug text-muted-foreground @xl:text-[13px]">
              <FieldValue field={`stat${n}Label`} />
            </span>
          </Rise>
        ))}
      </div>

      <dl className={`m-0 ${place.facts}`}>
        {facts.map((n, i) => (
          <Rise key={n} delay={i * 0.08} className="flex flex-col gap-1 border-0 border-t border-solid border-foreground/15 pt-3">
            <dt className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              <FieldValue field={`fact${n}Label`} />
            </dt>
            <dd className="m-0 text-[14px] font-medium leading-snug">
              <FieldValue field={`fact${n}Value`} />
            </dd>
          </Rise>
        ))}
      </dl>

      <div className={place.since}>
        <span className="text-center font-display text-[length:clamp(0.85rem,1.1cqw,1.05rem)] font-bold uppercase leading-tight tracking-[0.04em]">
          <FieldValue field="since" />
        </span>
      </div>
    </PanelFrame>
  );
}
