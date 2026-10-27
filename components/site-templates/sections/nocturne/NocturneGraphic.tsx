"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FieldPicture } from "../../core/blocks";
import { FieldValue, Frame, gutter, In, Label, SplitTitle, Tilt, type } from "./kit";

// Graphic design: the title and a few words, then four pieces made in code,
// in a staggered grid, each tilting towards the pointer with a sheen: a
// festival poster in the accent, a brand identity board, a typographic
// poster over a photograph, and a type specimen. Under each, its name and
// client.
//
// Its section's fields: `label`, `title`, `intro`; for each piece
// (`art1`...): Title and Meta; and the words inside them: `art1Word`,
// `art1Detail`, `art2Brand`, `art3Image`, `art3Words`, `art4Font`.

const art = "relative h-full w-full overflow-hidden rounded-[3px]";

// A festival poster: the accent, rings, a huge italic word and print details.
function Poster() {
  const still = useReducedMotion();
  return (
    <div className={`${art} bg-primary text-card`}>
      {[78, 58, 38].map((size, i) => (
        <motion.span
          key={size}
          animate={still ? undefined : { rotate: i % 2 ? -360 : 360 }}
          transition={{ duration: 40 + i * 12, repeat: Infinity, ease: "linear" }}
          style={{ width: `${size}%` }}
          className="absolute left-1/2 top-[38%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-card/40"
        />
      ))}
      <div className="absolute inset-x-[7%] top-[6%] flex justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
        <span>Vol. 04</span>
        <span>
          <FieldValue field="art1Detail" />
        </span>
      </div>
      <span className="absolute bottom-[12%] left-[6%] font-display text-[length:clamp(3.5rem,8cqw,8rem)] font-light italic leading-[0.8] tracking-[-0.05em]">
        <FieldValue field="art1Word" />
      </span>
      <div className="absolute inset-x-[7%] bottom-[5%] flex justify-between border-0 border-t border-solid border-card/40 pt-2 font-mono text-[9px] uppercase tracking-[0.16em]">
        <span>Light · Sound · Night</span>
        <span>№ 0427</span>
      </div>
    </div>
  );
}

// A brand identity board: the mark, the wordmark, the colours and the type.
function Identity() {
  return (
    <div className={`${art} grid grid-cols-[1.2fr_1fr] border border-solid border-border bg-[color-mix(in_srgb,var(--card),var(--foreground)_5%)]`}>
      <div className="flex flex-col justify-between border-0 border-r border-solid border-border p-[6%]">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Primary mark</span>
        <div className="relative mx-auto aspect-square w-[62%]">
          <span className="absolute left-0 top-1/2 aspect-square w-[64%] -translate-y-1/2 rounded-full border-[3px] border-solid border-foreground" />
          <span className="absolute right-0 top-1/2 aspect-square w-[64%] -translate-y-1/2 rounded-full bg-primary mix-blend-screen" />
        </div>
        <span className="text-[length:clamp(1.25rem,2.2cqw,2rem)] font-semibold uppercase tracking-[0.2em]">
          <FieldValue field="art2Brand" />
        </span>
      </div>
      <div className="flex flex-col">
        {["bg-primary", "bg-foreground", "bg-muted-foreground", "bg-card"].map((swatch, i) => (
          <span key={swatch} className={`flex flex-1 items-end justify-between p-3 font-mono text-[9px] uppercase tracking-[0.12em] ${swatch} ${i < 2 ? "text-card" : "text-foreground"}`}>
            <span>{["Ember", "Bone", "Ash", "Night"][i]}</span>
            <span>0{i + 1}</span>
          </span>
        ))}
        <span className="flex items-baseline gap-3 border-0 border-t border-solid border-border p-3">
          <span className="font-display text-[28px] italic leading-none">Aa</span>
          <span className="text-[22px] font-semibold leading-none">Aa</span>
        </span>
      </div>
    </div>
  );
}

// A typographic poster over a photograph.
function TypePoster() {
  return (
    <div className={`${art} bg-foreground/10`}>
      <FieldPicture field="art3Image" className="absolute inset-0 block h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-card/10 via-transparent to-card/70" />
      <span className="absolute inset-x-[6%] top-[5%] text-[length:clamp(2.5rem,6cqw,6rem)] font-semibold uppercase leading-[0.82] tracking-[-0.05em] text-foreground mix-blend-difference">
        <FieldValue field="art3Words" />
      </span>
      <span className="absolute bottom-[5%] left-[6%] font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/80">Exhibition poster · 70 × 100</span>
    </div>
  );
}

// A type specimen: the face's name, a huge glyph on baseline lines and its
// characters.
function Specimen() {
  return (
    <div className={`${art} flex border border-solid border-border bg-card`}>
      <div className="relative flex-1 border-0 border-r border-solid border-border">
        {[22, 50, 72].map((top) => (
          <span key={top} style={{ top: `${top}%` }} className="absolute inset-x-0 h-px bg-primary/40" />
        ))}
        <span className="absolute inset-0 grid place-items-center font-display text-[length:clamp(7rem,17cqw,16rem)] font-light italic leading-none tracking-[-0.06em]">Ag</span>
        <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Cap · x-height · baseline</span>
      </div>
      <div className="flex w-[42%] flex-col justify-between p-[4%]">
        <span className="font-display text-[length:clamp(1.5rem,2.8cqw,2.6rem)] italic leading-none">
          <FieldValue field="art4Font" />
        </span>
        <span className="break-all font-display text-[length:clamp(0.9rem,1.4cqw,1.3rem)] font-light leading-[1.5] text-foreground/70">ABCDEFGHIJKLM nopqrstuvwxyz 0123456789 &amp;?!@€</span>
        <span className="flex gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Light</span>
          <span className="italic">Italic</span>
          <span className="text-foreground">Regular</span>
        </span>
      </div>
    </div>
  );
}

const PIECES = [
  { Art: Poster, box: "aspect-[4/5] @xl:col-span-5" },
  { Art: Identity, box: "aspect-[7/5] @xl:col-span-7 @xl:mt-[14cqw]" },
  { Art: TypePoster, box: "aspect-[4/5] @xl:col-span-5" },
  { Art: Specimen, box: "aspect-[7/5] @xl:col-span-7 @xl:mt-[6cqw]" },
];

export default function NocturneGraphic({ pieces }: { pieces: number[] }) {
  return (
    <Frame>
      <div className={`flex flex-col gap-16 py-24 @xl:gap-20 @xl:py-36 ${gutter}`}>
        <div className="grid grid-cols-1 gap-10 @xl:grid-cols-[1.3fr_1fr] @xl:items-end @xl:gap-[6cqw]">
          <div className="flex flex-col gap-8">
            <Label field="label" />
            <SplitTitle field="title" />
          </div>
          <In>
            <p className={`m-0 max-w-[26rem] ${type.body}`}>
              <FieldValue field="intro" />
            </p>
          </In>
        </div>
        <div className="grid grid-cols-1 gap-x-[4cqw] gap-y-14 @xl:grid-cols-12">
          {pieces.map((n, i) => {
            const { Art, box } = PIECES[i % PIECES.length];
            const [shape, ...place] = box.split(" ");
            return (
              <In key={n} delay={(i % 2) * 0.12} className={`flex flex-col gap-4 ${place.join(" ")}`}>
                <Tilt className={shape}>
                  <Art />
                </Tilt>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-[length:clamp(1.15rem,1.6cqw,1.5rem)]">
                    <FieldValue field={`art${n}Title`} />
                  </span>
                  <span className={type.label}>
                    <FieldValue field={`art${n}Meta`} />
                  </span>
                </div>
              </In>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}
