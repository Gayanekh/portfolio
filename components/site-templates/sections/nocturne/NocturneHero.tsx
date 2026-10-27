"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { FieldPicture } from "../../core/blocks";
import { useField, useTemplate } from "../../core/context";
import { ease, FieldValue, Frame, type, useScrollProgress, useWide } from "./kit";

// The Nocturne opening, a full screen:
//
//   [ label                         ][ +                       + ]
//   [                               ][   portrait, dim and grey; ]
//   [ First   (serif italic, huge)  ][   a lens following the    ]
//   [ LAST    (sans capitals)       ][   pointer shows it in     ]
//   [ — rolling role                ][   colour                  ]
//   [ intro             ↓ scroll    ][ 01 UI/UX  02 Dev ...      ]
//
// The name rises letter by letter, the roles take turns, and scrolling
// away the portrait sinks and the name lifts (parallax). Corner marks frame
// the portrait like a print proof. On phones: the portrait, then the rest;
// without the lens. Each discipline in the index glides to its section.
//
// Its section's fields: `eyebrow`, `first`, `last`, `lead`, `role1`...,
// `intro`, `scroll`, `image`, and `index1`... (one per `targets`).

const ROLE_HOLD = 2.6;

// A word rising letter by letter.
function Letters({ field, className, delay }: { field: string; className: string; delay: number }) {
  const { value, editing, node } = useField(field);
  const still = useReducedMotion();
  if (editing || still) return <span className={className}>{node}</span>;
  return (
    <span aria-label={value} className={className}>
      {[...value].map((char, i) => (
        <span key={i} aria-hidden="true" className="-mb-[0.3em] inline-block overflow-hidden pb-[0.3em] align-bottom">
          <motion.span className="inline-block" initial={{ y: "115%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease, delay: delay + i * 0.045 }}>
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function NocturneHero({ roles, targets }: { roles: number[]; targets: string[] }) {
  const { edit, navigate } = useTemplate();
  const still = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const wide = useWide(ref);
  const src = useField("image").value;
  const name = `${useField("first").value} ${useField("last").value}`;

  // Parallax: from the hero's start (0.5) to its end (1), on the desktop
  // layout only. The transforms are always on the elements, at rest until it
  // runs, so nothing jumps when the layout is known after the first paint.
  const progress = useScrollProgress(ref);
  const moving = useMotionValue(0);
  useEffect(() => moving.set(wide && !still ? 1 : 0), [moving, wide, still]);
  const travel = useTransform([progress, moving], ([p, m]: number[]) => m * Math.min(1, Math.max(0, (p - 0.5) / 0.5)));
  const imageY = useTransform(travel, (t) => `${t * 8}%`);
  const imageScale = useTransform(travel, (t) => 1.1 + t * 0.08);
  const nameY = useTransform(travel, (t) => `${t * -40}%`);
  const fade = useTransform(travel, (t) => 1 - Math.min(1, t / 0.8));

  // The lens: where the colour shows, springing after the pointer; resting
  // on the face when the pointer is away.
  const lx = useSpring(58, { stiffness: 90, damping: 20 });
  const ly = useSpring(38, { stiffness: 90, damping: 20 });
  const lr = useSpring(still ? 0 : 22, { stiffness: 80, damping: 18 });
  useEffect(() => {
    const paint = () => {
      const mask = `radial-gradient(circle at ${lx.get()}% ${ly.get()}%, #000 0%, #000 ${lr.get() * 0.45}%, transparent ${lr.get()}%)`;
      if (lensRef.current) {
        lensRef.current.style.maskImage = mask;
        lensRef.current.style.webkitMaskImage = mask;
        // Hidden until masked, so the colour picture never flashes whole.
        lensRef.current.style.opacity = "1";
      }
    };
    paint();
    const offs = [lx.on("change", paint), ly.on("change", paint), lr.on("change", paint)];
    return () => offs.forEach((off) => off());
  }, [lx, ly, lr]);

  const [role, setRole] = useState(0);
  useEffect(() => {
    if (edit || still) return;
    const timer = window.setInterval(() => setRole((r) => (r + 1) % roles.length), ROLE_HOLD * 1000);
    return () => window.clearInterval(timer);
  }, [edit, still, roles.length]);

  return (
    <Frame className="overflow-hidden">
      <div ref={ref} className="relative flex flex-col @xl:block @xl:h-[100svh] @xl:min-h-[44rem]">
        {/* The portrait */}
        <div
          onPointerMove={(event) => {
            if (still || !wide) return;
            const box = event.currentTarget.getBoundingClientRect();
            lx.set(((event.clientX - box.left) / box.width) * 100);
            ly.set(((event.clientY - box.top) / box.height) * 100);
            lr.set(26);
          }}
          onPointerLeave={() => {
            lx.set(58);
            ly.set(38);
            lr.set(still ? 0 : 22);
          }}
          className="relative order-first aspect-[4/5] overflow-hidden @xl:absolute @xl:inset-y-0 @xl:right-0 @xl:aspect-auto @xl:w-[54%]"
        >
          <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
            <FieldPicture field="image" alt={name} priority className="absolute inset-0 block h-full w-full object-cover grayscale-[0.85] brightness-[0.55] @xl:object-[60%_30%]" />
            {src && !edit && (
              <div ref={lensRef} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden opacity-0 @xl:block">
                {/* eslint-disable-next-line @next/next/no-img-element -- the same picture, in colour, under the lens */}
                <img src={src} alt="" className="absolute inset-0 block h-full w-full object-cover object-[60%_30%] brightness-110 saturate-[1.15]" />
              </div>
            )}
          </motion.div>
          {/* Into the page on the left, and at the foot */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent @xl:bg-gradient-to-r @xl:from-card @xl:via-card/20" />
          {/* Corner marks, as on a print proof */}
          {["left-[8%] top-[14%]", "right-[6%] top-[14%]", "bottom-[22%] left-[8%]", "bottom-[22%] right-[6%]"].map((spot) => (
            <span key={spot} aria-hidden="true" className={`absolute hidden font-mono text-[14px] font-light text-foreground/50 @xl:block ${spot}`}>
              +
            </span>
          ))}
        </div>

        {/* The name and the roles */}
        <motion.div style={{ y: nameY, opacity: fade }} className="relative z-10 -mt-24 px-5 @xl:absolute @xl:inset-x-0 @xl:bottom-[24%] @xl:mt-0 @xl:px-[5cqw]">
          <motion.div initial={still ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className={`mb-6 ${type.label}`}>
            <FieldValue field="eyebrow" />
          </motion.div>
          <h1 className="m-0 flex flex-col">
            <Letters field="first" delay={0.25} className="block font-display text-[length:clamp(4.5rem,15.5cqw,15rem)] font-light italic leading-[0.85] tracking-[-0.045em]" />
            <Letters
              field="last"
              delay={0.55}
              className="mt-[0.34em] block whitespace-nowrap pl-[0.06em] text-[length:clamp(2.1rem,7.6cqw,7.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em] @xl:pl-[9cqw]"
            />
          </h1>
          <div className="mt-6 flex items-baseline gap-3 whitespace-nowrap font-display text-[length:clamp(1.05rem,2cqw,1.9rem)] font-light @xl:pl-[9cqw]">
            <span className="text-muted-foreground">
              <FieldValue field="lead" />
            </span>
            <span className="relative inline-grid overflow-x-visible overflow-y-clip italic text-primary">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={role} initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.7, ease }}>
                  <FieldValue field={`role${roles[role]}`} />
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </motion.div>

        {/* The intro and the scroll cue; the index of disciplines */}
        <div className="relative z-10 flex flex-col gap-10 px-5 pb-14 pt-10 @xl:absolute @xl:inset-x-0 @xl:bottom-0 @xl:flex-row @xl:items-end @xl:justify-between @xl:px-[5cqw] @xl:pb-[5svh] @xl:pt-0">
          <motion.div initial={still ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 1.1 }} className="flex items-end gap-8">
            <div className="hidden flex-col items-center gap-3 @xl:flex">
              <span className={`${type.label} [writing-mode:vertical-rl]`}>
                <FieldValue field="scroll" />
              </span>
              <span className="relative block h-14 w-px overflow-hidden bg-foreground/15">
                <motion.span animate={still ? undefined : { y: ["-100%", "100%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-primary" />
              </span>
            </div>
            <p className={`m-0 max-w-[24rem] ${type.body}`}>
              <FieldValue field="intro" />
            </p>
          </motion.div>

          <nav aria-label="Disciplines">
            <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0 @xl:flex @xl:gap-8">
              {targets.map((target, i) => (
                <motion.li key={target} initial={still ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 1.25 + i * 0.08 }}>
                  <button
                    type="button"
                    onClick={() => navigate(target)}
                    className="group/index flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left text-foreground"
                  >
                    <span className="font-mono text-[11px] text-primary">0{i + 1}</span>
                    <span className="relative text-[14px]">
                      <FieldValue field={`index${i + 1}`} />
                      <span aria-hidden="true" className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/index:origin-left group-hover/index:scale-x-100" />
                    </span>
                    <ArrowDownRight aria-hidden="true" className="size-3.5 text-muted-foreground transition-transform duration-300 group-hover/index:translate-x-0.5 group-hover/index:translate-y-0.5" strokeWidth={1.5} />
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </Frame>
  );
}
