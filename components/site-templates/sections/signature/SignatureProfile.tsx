"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { FieldPicture, Menu } from "../../core/blocks";
import { inMenu, menuName } from "../../core/content";
import { useField, useSectionId, useTemplate } from "../../core/context";
import { useActiveSection } from "../panel-kit";
import { ease, FieldValue, panelWidth, soft, useSplit } from "./kit";

// The Signature (Minimal) template's left side: an ink panel, pinned on the
// left from the split layout up (at the top of the page on phones), built as
// a living poster in layers that shift with the pointer at different depths:
//
//   [ monogram · time           status ]
//   [   glow                            ]
//   [   OUTLINED FIRST NAME, huge       ]
//   [     portrait in a shape that      ]
//   [     slowly breathes   ( ring ↘ )  ]
//   [   stickers to drag and fling      ]
//   [ First Last  (a swash drawing)     ]
//   [ role · place   coordinates        ]
//   [ menu                              ]
//   [ now: 03 / 06 Section    [ CTA → ] ]
//
// The portrait comes into colour when pointed at; the ring of words turns,
// faster while pointed at, and glides to Contact; the stickers float and can
// be dragged and thrown (they spring back); the "now" readout follows the
// section in view on the right. For reduced motion everything stands still.
//
// Its section's fields: `first`, `last`, `mark`, `role`, `location`,
// `coords`, `timeZone`, `status`, `photo`, `ring`, `cta`, `sticker1`...

// A layer moving with the pointer by `depth` pixels.
function Layer({ x, y, depth, className, children }: { x: MotionValue<number>; y: MotionValue<number>; depth: number; className?: string; children: ReactNode }) {
  const lx = useTransform(x, (v) => v * depth);
  const ly = useTransform(y, (v) => v * depth);
  return (
    <motion.div style={{ x: lx, y: ly }} className={className}>
      {children}
    </motion.div>
  );
}

// The portrait's outline, breathing between these shapes.
const SHAPES = [
  "42% 58% 63% 37% / 41% 44% 56% 59%",
  "58% 42% 38% 62% / 55% 38% 62% 45%",
  "38% 62% 52% 48% / 62% 55% 45% 38%",
  "42% 58% 63% 37% / 41% 44% 56% 59%",
];

// The stickers' places and looks.
const STICKERS = [
  { spot: "left-[4%] top-[18%]", tilt: -9, look: "bg-primary text-card" },
  { spot: "right-[6%] top-[8%]", tilt: 7, look: "bg-card text-[color:var(--ink)]" },
  { spot: "bottom-[16%] left-[10%]", tilt: 5, look: "border border-solid border-card/40 bg-transparent text-card" },
];

function Ring({ onFollow, still }: { onFollow: () => void; still: boolean }) {
  const text = useField("ring").value;
  const [fast, setFast] = useState(false);
  const turn = useMotionValue(0);
  useEffect(() => {
    if (still) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      turn.set((turn.get() + ((now - last) / 1000) * (fast ? 90 : 18)) % 360);
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [fast, still, turn]);
  const words = `${text} · ${text} · `;
  return (
    <button
      type="button"
      onClick={onFollow}
      onPointerEnter={() => setFast(true)}
      onPointerLeave={() => setFast(false)}
      aria-label={text}
      className="group/ring relative grid size-[clamp(6.5rem,9cqw,8.5rem)] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-card"
    >
      <motion.svg viewBox="0 0 100 100" style={{ rotate: turn }} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <path id="signature-ring" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <text className="fill-current font-mono text-[8.6px] uppercase tracking-[0.18em]">
          <textPath href="#signature-ring">{words}</textPath>
        </text>
      </motion.svg>
      <span className="grid size-[44%] place-items-center rounded-full bg-primary text-card transition-transform duration-500 group-hover/ring:scale-110">
        <ArrowDownRight className="size-5 transition-transform duration-500 group-hover/ring:-rotate-45" strokeWidth={1.75} />
      </span>
    </button>
  );
}

export default function SignatureProfile({ stickers }: { stickers: number[] }) {
  const id = useSectionId();
  const { template, content, navigate } = useTemplate();
  const still = Boolean(useReducedMotion());
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const split = useSplit(ref);
  const active = useActiveSection(ref);
  const name = `${useField("first").value} ${useField("last").value}`;
  const zone = useField("timeZone").value;

  // The pointer, from -0.5 to 0.5 across the panel, springing.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 60, damping: 18 });
  const y = useSpring(py, { stiffness: 60, damping: 18 });

  // The menu's sections, for the "now" readout.
  const items = template.sections.filter((section) => inMenu(content, section));
  const at = Math.max(0, items.findIndex((section) => section.id === active));
  const current = items[at] ? menuName(content, items[at]) : "";

  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      try {
        setTime(new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: zone || undefined }).format(new Date()));
      } catch {
        setTime(new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
      }
    };
    tick();
    const timer = window.setInterval(tick, 20_000);
    return () => window.clearInterval(timer);
  }, [zone]);

  return (
    <header ref={ref} data-section={id} className="relative z-30 @4xl:sticky @4xl:top-0 @4xl:h-0">
      <div className={`p-2.5 [--ink:var(--foreground)] @4xl:absolute @4xl:left-0 @4xl:top-0 @4xl:h-[100svh] @4xl:p-3 ${panelWidth}`}>
        <div
          onPointerMove={(event) => {
            if (still) return;
            const box = event.currentTarget.getBoundingClientRect();
            px.set((event.clientX - box.left) / box.width - 0.5);
            py.set((event.clientY - box.top) / box.height - 0.5);
          }}
          onPointerLeave={() => {
            px.set(0);
            py.set(0);
          }}
          className="relative flex h-[min(100svh,56rem)] min-h-[40rem] flex-col overflow-hidden rounded-[26px] bg-[color:var(--ink)] p-5 text-card [--foreground:var(--card)] @4xl:h-full @4xl:min-h-0 @4xl:p-[clamp(1.25rem,2.2cqw,2rem)]"
        >
          {/* The glow, drifting */}
          <Layer x={x} y={y} depth={-30} className="pointer-events-none absolute inset-0">
            <motion.div
              aria-hidden="true"
              animate={still ? undefined : { x: ["-10%", "15%", "-5%", "-10%"], y: ["0%", "20%", "35%", "0%"], scale: [1, 1.15, 0.95, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[10%] top-[12%] size-[70%] rounded-full bg-primary opacity-50 blur-[80px]"
            />
          </Layer>
          {/* A fine dot grid */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:18px_18px]" />

          {/* The top row */}
          <motion.div initial={still ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.2 }} className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative grid size-10 place-items-center">
                <motion.span
                  aria-hidden="true"
                  animate={still ? undefined : { rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-card/40"
                />
                <span className="font-display text-[13px] font-bold">
                  <FieldValue field="mark" />
                </span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-card/60">
                <FieldValue field="location" /> <span className="tabular-nums text-card">{time}</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/10 px-3 py-1.5 text-[12px] backdrop-blur-md">
              <span className="relative grid size-2 place-items-center">
                <motion.span animate={still ? undefined : { scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute inset-0 rounded-full bg-[#3ddc84]" />
                <span className="size-2 rounded-full bg-[#3ddc84]" />
              </span>
              <FieldValue field="status" />
            </span>
          </motion.div>

          {/* The stage: the layered composition */}
          <div ref={stageRef} className="relative my-3 min-h-[20rem] flex-1">
            <Layer x={x} y={y} depth={-14} className="pointer-events-none absolute inset-x-0 top-[4%] flex justify-center">
              <motion.span
                aria-hidden="true"
                initial={still ? false : { opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, letterSpacing: "-0.05em" }}
                transition={{ duration: 1.6, ease, delay: 0.3 }}
                className="select-none font-display text-[length:30cqw] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.22)] @4xl:text-[length:12.5cqw]"
              >
                <FieldValue field="first" />
              </motion.span>
            </Layer>

            <Layer x={x} y={y} depth={22} className="absolute inset-0 grid place-items-center">
              <motion.div
                initial={still ? false : { opacity: 0, scale: 0.8, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.4, ease, delay: 0.45 }}
                className="relative aspect-[4/5] h-[86%] max-h-[30rem]"
              >
                <motion.div
                  animate={still ? undefined : { borderRadius: SHAPES }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                  style={{ borderRadius: SHAPES[0] }}
                  className="group/photo absolute inset-0 overflow-hidden bg-card/10"
                >
                  <FieldPicture
                    field="photo"
                    alt={name}
                    priority
                    className="absolute inset-0 block h-full w-full scale-105 object-cover grayscale transition-[filter,transform] duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/photo:scale-100 group-hover/photo:grayscale-0"
                  />
                </motion.div>
              </motion.div>
            </Layer>

            <Layer x={x} y={y} depth={36} className="absolute bottom-[2%] right-[2%]">
              <motion.div initial={still ? false : { opacity: 0, scale: 0.4, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease, delay: 0.9 }}>
                <Ring onFollow={() => navigate("contact")} still={still} />
              </motion.div>
            </Layer>

            {stickers.map((n, i) => {
              const sticker = STICKERS[i % STICKERS.length];
              return (
                <Layer key={n} x={x} y={y} depth={48 + i * 8} className={`absolute z-10 ${sticker.spot}`}>
                  <motion.div
                    drag={!still}
                    dragConstraints={stageRef}
                    dragElastic={0.35}
                    dragSnapToOrigin
                    whileDrag={{ scale: 1.12, rotate: 0, cursor: "grabbing" }}
                    whileHover={{ scale: 1.06 }}
                    initial={still ? false : { opacity: 0, y: 20, rotate: 0 }}
                    animate={still ? { rotate: sticker.tilt } : { opacity: 1, y: [0, -8, 0], rotate: sticker.tilt }}
                    transition={{ opacity: { duration: 0.6, delay: 1.1 + i * 0.15 }, rotate: { duration: 0.8, delay: 1.1 + i * 0.15 }, y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: 1.4 + i * 0.3 } }}
                    className={`cursor-grab touch-none select-none rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-[0.1em] shadow-[0_12px_30px_-10px_rgb(0_0_0/0.5)] ${sticker.look}`}
                  >
                    <FieldValue field={`sticker${n}`} />
                  </motion.div>
                </Layer>
              );
            })}

            <span aria-hidden="true" className="absolute bottom-[2%] left-0 font-mono text-[10px] uppercase tracking-[0.14em] text-card/45">
              <FieldValue field="coords" />
            </span>
          </div>

          {/* The name, the role and the menu */}
          <div className="relative z-10 flex flex-col gap-4">
            <div>
              <h1 className="m-0 font-display text-[length:clamp(2.2rem,4.2cqw,3.8rem)] font-bold leading-[0.92] tracking-[-0.05em]">
                <motion.span className="block" initial={still ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.5 }}>
                  <FieldValue field="first" />{" "}
                  <span className="relative inline-block">
                    <FieldValue field="last" />
                    <svg aria-hidden="true" viewBox="0 0 220 24" preserveAspectRatio="none" className="absolute -bottom-[0.2em] left-[-4%] h-[0.32em] w-[108%] overflow-visible text-primary">
                      <motion.path
                        d="M3 14 C 30 4, 60 22, 92 12 S 150 2, 178 12 S 210 18, 217 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={still ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.4, ease: soft, delay: 1.2 }}
                      />
                    </svg>
                  </span>
                </motion.span>
              </h1>
              <motion.p initial={still ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="m-0 mt-3 text-[15px] text-card/70">
                <FieldValue field="role" />
              </motion.p>
            </div>

            <div className="[&_a]:text-card/70 [&_a:hover]:text-card [&_ul]:flex-wrap [&_ul]:justify-start [&_ul]:gap-x-6 [&_ul]:gap-y-2">
              <Menu size="inline" active={active} />
            </div>

            <div className="flex items-center justify-between gap-4 border-0 border-t border-solid border-card/15 pt-4">
              {/* Where the visitor is, on the right */}
              <div className="flex min-w-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="text-card/50">{split ? "Now" : "Index"}</span>
                <span className="relative inline-grid h-4 overflow-hidden tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={at} initial={{ y: 16 }} animate={{ y: 0 }} exit={{ y: -16 }} transition={{ duration: 0.45, ease }}>
                      {String(at + 1).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-card/40">/ {String(items.length).padStart(2, "0")}</span>
                <span className="relative hidden h-4 min-w-0 overflow-hidden @4xl:inline-grid">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={current} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.45, ease }} className="truncate text-card">
                      {current}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("contact")}
                className="group/cta inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-0 bg-card py-2.5 pl-5 pr-2.5 text-[14px] font-medium text-[color:var(--ink)]"
              >
                <FieldValue field="cta" />
                <span className="grid size-7 place-items-center rounded-full bg-primary text-card transition-transform duration-500 group-hover/cta:rotate-45">
                  <ArrowUpRight className="size-4" strokeWidth={2} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
