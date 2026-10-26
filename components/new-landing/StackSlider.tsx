"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "framer-motion";
import { focusRing } from "@/components/landing/landing-ui";

// The outgoing card shrinks to this, from its top edge, as the next covers it.
const SCALE_DOWN = 0.7;

export interface StackItem {
  id: string;
  name: string;
  image: string;
  // A photo is cropped around its middle; a screenshot from its top left,
  // where the page's name and headline are.
  photo?: boolean;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

// Where card `t` is for a position along the stack (0 … count - 1): `r` is
// the card on screen and `i` the progress of handing over to the next one.
function place(position: number, t: number, count: number) {
  const r = clamp(Math.floor(position), 0, count - 1);
  const i = clamp(position - r);
  const current = t === r;
  const last = t === count - 1;
  // Only the next card moves: it rises from below the stage into place.
  const y = t === r + 1 ? (1 - i) * 100 : t > r + 1 ? 100 : 0;
  // The current card shrinks from its top edge and fades; older ones stay gone.
  const scale = current && last ? 1 : current ? lerp(1, SCALE_DOWN, i) : t < r ? SCALE_DOWN : 1;
  const opacity = current && last ? 1 : current ? 1 - i : t < r ? 0 : 1;
  // The incoming card on top, then the current one, older ones underneath.
  const z = t === r + 1 ? count + 1 : current ? count : t < r ? clamp(count - (r - t), 0, count) : 0;
  return { y, scale, opacity, z };
}

// One card: a full-size layer of the stage, with its name on a pill.
function Card({ item, index, count, position, priority }: { item: StackItem; index: number; count: number; position: MotionValue<number>; priority: boolean }) {
  const y = useTransform(position, (p) => `${place(p, index, count).y}%`);
  const scale = useTransform(position, (p) => place(p, index, count).scale);
  const opacity = useTransform(position, (p) => place(p, index, count).opacity);
  const zIndex = useTransform(position, (p) => place(p, index, count).z);
  return (
    <motion.div style={{ y, scale, opacity, zIndex }} className="absolute inset-0 origin-top will-change-[transform,opacity]">
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-foreground/5">
        <Image src={item.image} alt="" fill quality={90} sizes="(min-width: 768px) 46rem, 90vw" priority={priority} className={`object-cover ${item.photo ? "object-center" : "object-left-top"}`} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-6">
          <span className="whitespace-nowrap rounded-full bg-[rgb(11_5_29/0.3)] px-3 py-2 text-xs font-bold leading-none text-[#f9f8f5] backdrop-blur-md">{item.name}</span>
        </div>
      </div>
    </motion.div>
  );
}

// A 1:1 stage of stacked cards with a vertical dot rail on its right, driven by
// `position` (0 … count - 1, animated by the hero's autoplay). Each step, the
// next card rises from the bottom of the stage and covers the current one,
// which shrinks to 70% from its top edge and fades; going back plays it in
// reverse. Everything stays inside the stage. A dot shows its card.
export default function StackSlider({
  items,
  position,
  active,
  onSelect,
}: {
  items: StackItem[];
  position: MotionValue<number>;
  active: number;
  onSelect: (index: number) => void;
}) {
  const count = items.length;
  return (
    <div aria-roledescription="carousel" aria-label="Templates" className="flex w-full min-w-0 items-center justify-center gap-[clamp(1rem,calc(0.364rem_+_2.367vw),1.5rem)] md:justify-end">
      {/* The stage clips everything: no card ever shows outside it. */}
      <div className="relative isolate aspect-square w-full min-w-0 max-w-[max(14rem,calc(100svh-6rem))] flex-1 md:max-w-[min(max(10rem,calc(100svh-11rem)),56rem)] overflow-hidden rounded-3xl">
        {items.map((item, k) => (
          <Card key={item.id} item={item} index={k} count={count} position={position} priority={k === 0} />
        ))}
      </div>
      <nav aria-label="Choose a template" className="flex flex-none flex-col items-center gap-2">
        {items.map((item, k) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to ${item.name}`}
            aria-current={k === active ? "true" : undefined}
            onClick={() => onSelect(k)}
            className={`${focusRing} w-1.5 cursor-pointer rounded border-0 p-0 transition-[height,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              k === active ? "h-[1.375rem] bg-foreground" : "h-1.5 bg-foreground/35 hover:bg-foreground/60"
            }`}
          />
        ))}
      </nav>
    </div>
  );
}
