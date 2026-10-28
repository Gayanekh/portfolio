"use client";

import { Fragment, useRef, useState } from "react";
import { FieldPicture } from "../../core/blocks";
import { useField, useTemplate } from "../../core/context";
import { useWide } from "../../core/viewport";
import { Marquee } from "../panel-kit";
import { Aside, FieldValue, Frame, gutter, Label, Rise, space, Title, type, Window } from "./kit";

// What the person does. First a band of the disciplines in huge type running
// sideways, small pictures between the words, fading out at both edges. Then
// the services as tall picture panels side by side: the one pointed at (the
// first, until then) opens wide and shows its description and what it
// includes; the others stay narrow, dimmed, with only their names. While
// editing, on phones and narrow windows, the panels are cards one under
// another (three across while editing on a wide screen).
//
// Its section's fields: `band1`..., `label`, `title`, `text`, and for each
// service (`service1`...): Title, Text, Tags and Image.

export default function ShowcaseServices({ services, band }: { services: number[]; band: number[] }) {
  const { edit } = useTemplate();
  const ref = useRef<HTMLDivElement>(null);
  const panels = useWide(ref, 900) && !edit;
  const [open, setOpen] = useState(0);

  return (
    <Frame>
      <div ref={ref} className="border-0 border-y border-solid border-border py-[3cqw] [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <Marquee speed={60} className="items-center gap-[3cqw] pr-[3cqw]">
          {band.map((n, i) => (
            <Fragment key={n}>
              <span className="whitespace-nowrap font-display text-[length:clamp(3rem,9cqw,9.5rem)] font-semibold leading-none tracking-[-0.055em]">
                <FieldValue field={`band${n}`} />
              </span>
              <Chip n={services[i % services.length]} />
            </Fragment>
          ))}
        </Marquee>
      </div>

      <div className={`flex flex-col gap-12 @xl:gap-[4cqw] ${space} ${gutter}`}>
        <div className="grid gap-8 @3xl:grid-cols-[1.4fr_1fr] @3xl:items-end">
          <div className="flex flex-col gap-6">
            <Label field="label" />
            <Title field="title" />
          </div>
          <p className={`m-0 max-w-[24rem] @3xl:justify-self-end ${type.body}`}>
            <FieldValue field="text" />
          </p>
        </div>

        {panels ? (
          <div className="flex h-[min(80svh,46rem)] gap-3">
            {services.map((n, i) => (
              <Panel key={n} n={n} index={i} open={open === i} onOpen={() => setOpen(i)} />
            ))}
          </div>
        ) : (
          <div className="grid gap-14 @3xl:grid-cols-3 @3xl:gap-[3cqw]">
            {services.map((n, i) => (
              <Rise key={n} delay={i * 0.1} className="flex flex-col gap-5">
                <Window field={`service${n}Image`} className="aspect-[4/5]" />
                <Aside field={`service${n}Tags`} />
                <h3 className={`m-0 ${type.name}`}>
                  <FieldValue field={`service${n}Title`} />
                </h3>
                <p className={`m-0 ${type.body}`}>
                  <FieldValue field={`service${n}Text`} />
                </p>
              </Rise>
            ))}
          </div>
        )}
      </div>
    </Frame>
  );
}

// A small picture between the band's words (a star while editing, so each
// picture is replaced in one place: its service).
function Chip({ n }: { n: number }) {
  const { edit } = useTemplate();
  if (edit) return <span className="font-display text-[length:clamp(2rem,5cqw,5rem)] text-primary">✦</span>;
  return (
    <span className="relative block h-[clamp(2.5rem,7cqw,7.5rem)] w-[clamp(3.5rem,10cqw,10.5rem)] shrink-0 overflow-hidden rounded-[4px]">
      <FieldPicture field={`service${n}Image`} className="absolute inset-0 block h-full w-full object-cover" />
    </span>
  );
}

// A service as a picture panel, opening wide while pointed at or focused.
function Panel({ n, index, open, onOpen }: { n: number; index: number; open: boolean; onOpen: () => void }) {
  const title = useField(`service${n}Title`).value;
  const reveal = `transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-y-0 opacity-100 delay-200" : "translate-y-4 opacity-0"}`;
  return (
    <article
      tabIndex={0}
      onPointerEnter={onOpen}
      onFocus={onOpen}
      className={`relative min-w-0 basis-0 overflow-hidden rounded-[4px] bg-foreground/10 text-white outline-offset-4 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "grow-[2.6]" : "grow"}`}
    >
      <div className={`absolute inset-0 transition-[transform,filter] duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "scale-100 brightness-100" : "scale-110 brightness-[0.62] saturate-[0.7]"}`}>
        <FieldPicture field={`service${n}Image`} alt={title} className="absolute inset-0 block h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex justify-between p-[2cqw] font-mono text-[12px]">
        <span>({String(index + 1).padStart(2, "0")})</span>
        <span className={reveal}>
          (<FieldValue field={`service${n}Tags`} />)
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-[2cqw]">
        <h3 className="m-0 font-display text-[length:clamp(1.4rem,2.6cqw,2.8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
          <FieldValue field={`service${n}Title`} />
        </h3>
        <p className={`m-0 max-w-[28rem] text-[15px] leading-[1.6] text-white/85 ${reveal}`}>
          <FieldValue field={`service${n}Text`} />
        </p>
      </div>
    </article>
  );
}
