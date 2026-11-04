"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { FieldPicture } from "../../core/blocks";
import { readField } from "../../core/content";
import { useSectionId, useTemplate } from "../../core/context";
import { plainText } from "../../core/rich-format";
import { ease, FieldValue, Frame, gutter, In, Label, soft, SplitTitle, type, useScrollProgress, useWide } from "./kit";

// Photography, as a contact sheet: the title and a few words beside two
// figures, then the photographs in three columns that drift at different
// speeds as the page scrolls (parallax). Each frame is numbered like film;
// pointing at one brings it from muted into full colour and slides up its
// name and the camera's settings; following it opens the photographs full
// screen (arrows, the keyboard and Esc). On phones two columns, still.
//
// Its section's fields: `label`, `title`, `intro`, `stat1Value`,
// `stat1Label`, `stat2Value`, `stat2Label`, and for each photograph
// (`photo1`...): Image, Title and Exif.

// Each photograph's shape, in turn, so the columns break unevenly.
const SHAPES = ["aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-[4/5]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"];

export default function NocturnePhoto({ photos }: { photos: number[] }) {
  const { content, edit } = useTemplate();
  const section = useSectionId();
  const still = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const wide = useWide(ref);
  const moving = wide && !still && !edit;
  const progress = useScrollProgress(ref);
  const y1 = useTransform(progress, [0, 1], [moving ? 60 : 0, moving ? -60 : 0]);
  const y2 = useTransform(progress, [0, 1], [moving ? 160 : 0, moving ? -160 : 0]);
  const y3 = useTransform(progress, [0, 1], [moving ? 20 : 0, moving ? -20 : 0]);
  const [viewing, setViewing] = useState<number | null>(null);
  const read = (field: string) => plainText(readField(content, section, field));

  const columns = wide ? [0, 1, 2] : [0, 1];
  const offsets = [y1, y2, y3];

  return (
    <Frame className="overflow-hidden">
      <div ref={ref} className={`flex flex-col gap-16 py-24 @xl:gap-24 @xl:py-36 ${gutter}`}>
        <div className="grid grid-cols-1 gap-10 @xl:grid-cols-[1.3fr_1fr] @xl:items-end @xl:gap-[6cqw]">
          <div className="flex flex-col gap-8">
            <Label field="label" />
            <SplitTitle field="title" />
          </div>
          <div className="flex flex-col gap-8">
            <In>
              <p className={`m-0 max-w-[26rem] ${type.body}`}>
                <FieldValue field="intro" />
              </p>
            </In>
            <div className="flex gap-12">
              {[1, 2].map((n, i) => (
                <In key={n} delay={0.1 + i * 0.1} className="flex flex-col gap-1">
                  <span className="font-display text-[length:clamp(2rem,3.4cqw,3.25rem)] font-light italic leading-none text-primary">
                    <FieldValue field={`stat${n}Value`} />
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    <FieldValue field={`stat${n}Label`} />
                  </span>
                </In>
              ))}
            </div>
          </div>
        </div>

        <div className={`grid gap-3 @xl:gap-[2cqw] ${wide ? "grid-cols-3" : "grid-cols-2"}`}>
          {columns.map((c) => (
            <motion.div key={c} style={{ y: offsets[c] }} className="flex flex-col gap-3 @xl:gap-[2cqw]">
              {photos
                .map((n, i) => ({ n, i }))
                .filter(({ i }) => i % columns.length === c)
                .map(({ n, i }) => (
                  <In key={n} delay={(i % 3) * 0.1}>
                    <button
                      type="button"
                      onClick={edit ? undefined : () => setViewing(i)}
                      className={`group/photo relative block w-full cursor-zoom-in overflow-hidden rounded-[2px] border-0 bg-foreground/5 p-0 text-left ${SHAPES[i % SHAPES.length]}`}
                    >
                      <span className="absolute inset-0 transition-[transform,filter] duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] [filter:saturate(0.35)_brightness(0.8)] group-hover/photo:scale-[1.04] group-hover/photo:[filter:saturate(1)_brightness(1)]">
                        <FieldPicture field={`photo${n}Image`} alt={read(`photo${n}Title`)} className="absolute inset-0 block h-full w-full object-cover" />
                      </span>
                      <span className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] tracking-[0.14em] text-foreground/70">FR {String(i + 1).padStart(2, "0")}</span>
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 flex-col gap-1 bg-gradient-to-t from-card/90 to-transparent p-4 pt-12 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/photo:translate-y-0 group-hover/photo:opacity-100">
                        <span className="font-display text-[18px] italic text-foreground">
                          <FieldValue field={`photo${n}Title`} />
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          <FieldValue field={`photo${n}Exif`} />
                        </span>
                      </span>
                    </button>
                  </In>
                ))}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {viewing !== null && (
          <Viewer
            photos={photos}
            index={viewing}
            onIndex={setViewing}
            onClose={() => setViewing(null)}
            read={read}
          />
        )}
      </AnimatePresence>
    </Frame>
  );
}

// The photographs full screen: one at a time, whole, with its name and
// settings; arrows and the keyboard go through them, Esc closes.
function Viewer({ photos, index, onIndex, onClose, read }: { photos: number[]; index: number; onIndex: (i: number) => void; onClose: () => void; read: (field: string) => string }) {
  const [direction, setDirection] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const n = photos[index];
  const go = (by: number) => {
    setDirection(by);
    onIndex((index + by + photos.length) % photos.length);
  };
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const round = "grid size-12 cursor-pointer place-items-center rounded-full border border-solid border-foreground/25 bg-transparent text-foreground transition-colors duration-300 hover:border-primary hover:text-primary";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={read(`photo${n}Title`)}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: soft }}
      className="fixed inset-0 z-[60] flex flex-col bg-card/95 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-5 py-4 @xl:px-[5cqw]">
        <span className={type.label}>
          <span className="text-primary">FR {String(index + 1).padStart(2, "0")}</span> / {String(photos.length).padStart(2, "0")}
        </span>
        <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className={round}>
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={n}
            src={read(`photo${n}Image`)}
            alt={read(`photo${n}Title`)}
            initial={{ opacity: 0, x: direction * 50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.7, ease }}
            className="absolute inset-0 m-auto block h-full w-full object-contain px-5 @xl:px-[10cqw]"
          />
        </AnimatePresence>
      </div>
      <div className="flex items-end justify-between gap-6 px-5 py-5 @xl:px-[5cqw]">
        <div className="flex flex-col gap-1">
          <span className="font-display text-[length:clamp(1.4rem,2.4cqw,2.2rem)] italic">{read(`photo${n}Title`)}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{read(`photo${n}Exif`)}</span>
        </div>
        <div className="flex gap-3">
          <button type="button" aria-label="Previous photograph" onClick={() => go(-1)} className={round}>
            <ArrowLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button type="button" aria-label="Next photograph" onClick={() => go(1)} className={round}>
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
