"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotionConfig, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, Eye } from "lucide-react";
import { HERO, STACK, TEMPLATES } from "@/components/new-landing/content";
import Field from "@/components/template-landing/Field";
import { ease, focusRing, frame, grid } from "@/components/template-landing/ui";

// The picture is the first template; the coverflow holds all six, the
// picture third, so two templates sit on its left and three on its right.
const PICTURE = TEMPLATES[0];
const ITEMS = [STACK[1], STACK[2], { ...STACK[0], image: PICTURE.image }, STACK[3], STACK[4], STACK[5]];
const PIC = 2;
// The centre card: nearly square, its glass frame a little taller than the band (it reaches into the space above and below, clear of the words).
const CARD_RATIO = 0.94;
const CARD_SHARE = 1.12;
const FRAME_PAD = 18;
const CAPTION = 26;
// The line under the title (this page only; the home page keeps its own).
const LINE = "One place to bring your work to life.";
// Its accent, set in the quiet colour.
const LINE_LEAD = "One place to bring your";
const LINE_ACCENT = "work to life.";
// The line under the picture, where "WORK" stood.
const SECOND = "Build your portfolio, connect your domain, and share your work with the world.";

// Where a card sits in the coverflow, `k` places from the centre (k may be
// fractional while it moves): the first neighbours tuck just behind the
// centre card, the rest overlap more tightly; each turns away from the
// middle (up to 42deg), shrinks and darkens the further out it is.
function place(k: number, cw: number) {
  const a = Math.abs(k);
  const s = Math.sign(k);
  return {
    x: s * (a <= 1 ? a * cw * 0.82 : cw * 0.82 + (a - 1) * cw * 0.38),
    rotateY: s * Math.min(a, 1) * 42,
    scale: 1 - Math.min(a, 3) * 0.1,
    dim: Math.min(a, 3) * 0.22,
    z: 50 - Math.round(a * 10),
  };
}

// One side card, placed from the coverflow's position and faded in with `open`.
function FlowCard({ index, pos, cw, open, children }: { index: number; pos: MotionValue<number>; cw: number; open: MotionValue<number>; children: (dim: MotionValue<number>) => React.ReactNode }) {
  const x = useTransform(pos, (p) => place(index - p, cw).x);
  const rotateY = useTransform(pos, (p) => place(index - p, cw).rotateY);
  const scale = useTransform(pos, (p) => place(index - p, cw).scale);
  const zIndex = useTransform(pos, (p) => place(index - p, cw).z);
  const dim = useTransform(pos, (p) => place(index - p, cw).dim);
  return (
    <motion.span style={{ x, rotateY, scale, zIndex, opacity: open }} className="absolute inset-0 block">
      {children(dim)}
    </motion.span>
  );
}

// The hero, after the Moire reference: in the grid's two middle columns,
// the line "One place to bring your work to life."
// with a small note at the far right of its foot, a wide picture of a
// template across both columns (a vertical "hover" hint at its lower left),
// the line "Build your portfolio, …" (where "WORK" stood), then Get started. Behind it, as on the rest of the
// page, the four columns' hairlines and a field of dots following the cursor.
// The picture opens into a coverflow, after the reference the user sent:
// pointed at (tapped on touch screens, focused from the keyboard) it shrinks
// into a portrait card in the middle of its band, in a glass frame with the
// template's name, while the other templates fan out on both sides,
// overlapping, turned away in 3D, smaller and darker further out. Moving the
// pointer across the band brings the templates through the centre one by
// one. Leaving, the cards fold away and the picture grows back to exactly
// its size and place. It all stays in the picture's band (the side cards may
// run out past the columns), so the words above and below are never covered.
// With reduced motion the changes are instant.
export default function Hero() {
  const reduced = useReducedMotionConfig();
  const boxRef = useRef<HTMLSpanElement>(null);
  // The picture's box and where it sits on the screen; the row is laid out from it.
  const [box, setBox] = useState({ w: 0, h: 0, left: 0, vw: 0 });
  const [open, setOpen] = useState(false);
  // How the picture was last pressed: a touch also focuses it, and that focus must not open it (the tap does).
  const pressedBy = useRef("");
  // The coverflow's position (which template is in the centre), eased.
  const posTarget = useMotionValue(PIC);
  const pos = useSpring(posTarget, { stiffness: 160, damping: 26 });
  const [shown, setShown] = useState(PIC);
  useMotionValueEvent(pos, "change", (p) => setShown(Math.max(0, Math.min(ITEMS.length - 1, Math.round(p)))));
  // How open it is, 0 to 1.
  const openness = useMotionValue(0);

  useEffect(() => {
    const element = boxRef.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      setBox({ w: element.offsetWidth, h: element.offsetHeight, left: rect.left, vw: document.documentElement.clientWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!open) posTarget.set(PIC);
    const controls = animate(openness, open ? 1 : 0, { duration: reduced ? 0 : open ? 0.7 : 0.5, ease });
    return () => controls.stop();
  }, [open, posTarget, openness, reduced]);

  const ch = Math.max(0, box.h * CARD_SHARE - FRAME_PAD * 2 - CAPTION);
  const cw = ch * CARD_RATIO;
  // The centre slot, in the band's coordinates (the band spans the screen).
  const slotLeft = box.left + box.w / 2 - cw / 2;
  const frameTop = (box.h - (ch + FRAME_PAD * 2 + CAPTION)) / 2;
  const slotTop = frameTop + FRAME_PAD;
  const timing = (duration: number, delay = 0) => ({ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease });
  // The picture follows the centre slot's coverflow place while open.
  const picX = useTransform([pos, openness] as const, ([p, o]: number[]) => place(PIC - p, cw).x * o);
  const picRotate = useTransform([pos, openness] as const, ([p, o]: number[]) => place(PIC - p, cw).rotateY * o);
  const picScale = useTransform([pos, openness] as const, ([p, o]: number[]) => 1 - (1 - place(PIC - p, cw).scale) * o);
  const picZ = useTransform(pos, (p) => place(PIC - p, cw).z);
  const picDim = useTransform([pos, openness] as const, ([p, o]: number[]) => place(PIC - p, cw).dim * o);

  return (
    <section data-caption="top" aria-label="Introduction" className="relative z-10 flex min-h-svh flex-col justify-center bg-[var(--bg)] pb-[clamp(3rem,8vh,5rem)] pt-[6.5rem]">
      {/* The background, as on the rest of the page: the four columns' hairlines, and the dots following the cursor. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Field className="absolute inset-0" />
        <div className={`relative h-full ${frame}`}>
          <div className="relative h-full border-0 border-x border-solid border-[var(--line)]">
            <span className="absolute inset-y-0 left-1/4 hidden w-px bg-[var(--line)] lg:block" />
            <span className="absolute inset-y-0 left-1/2 hidden w-px bg-[var(--line)] lg:block" />
            <span className="absolute inset-y-0 left-3/4 hidden w-px bg-[var(--line)] lg:block" />
          </div>
        </div>
      </div>

      <div className={`relative ${frame} ${grid}`}>
        <div className="@container relative lg:col-span-2 lg:col-start-2">
          <h1 aria-label={`${LINE} ${SECOND}`} className="m-0 text-[length:27cqi] font-bold uppercase leading-[0.8] tracking-[-0.045em]">
            {/* The line, smaller than "WORK", and the note at the far right of its foot. */}
            <span className="flex items-end justify-between gap-[clamp(1.5rem,4cqi,3rem)] border-0 border-b border-solid border-[var(--line)] pb-[clamp(1.25rem,3.2cqi,2.25rem)]">
              <span className="-mb-[0.1em] block max-w-[11em] overflow-hidden pb-[0.1em] text-[length:9cqi] font-medium normal-case leading-[0.98] tracking-[-0.04em]">
                <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: 0.1 }}>
                  {LINE_LEAD} <span className="text-[var(--dim)]">{LINE_ACCENT}</span>
                </motion.span>
              </span>
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.7 }}
                className="mb-[0.4cqi] hidden items-center gap-3 whitespace-nowrap font-mono text-[length:clamp(0.6875rem,1.3cqi,0.8125rem)] font-normal uppercase tracking-[0.2em] text-[var(--dim)] sm:flex"
              >
                <span aria-hidden="true" className="block h-px w-[clamp(1.5rem,3.5cqi,2.25rem)] bg-current" />
                Portfolio builder
              </motion.span>
            </span>

            {/* The picture's band, across both columns; the row runs out of it. */}
            <span ref={boxRef} className="relative mb-[2.2cqi] mt-[clamp(1.5rem,3.6cqi,2.5rem)] block aspect-[16/10] text-[1rem] font-normal normal-case tracking-normal sm:aspect-[1000/345]">
              <span aria-hidden="true" className={`absolute bottom-0 right-full hidden -translate-x-[0.9rem] items-center gap-1.5 whitespace-nowrap text-[0.75rem] font-semibold tracking-[0.04em] transition-opacity duration-300 [writing-mode:vertical-rl] rotate-180 lg:flex ${open ? "opacity-0" : "opacity-100"}`}>
                <Eye className="size-3.5 rotate-90" />
                HOVER
              </span>
              {/* The coverflow, across the screen in this band, outside the hero's
                  content; the band only takes the pointer while open. */}
              <span
                role="group"
                aria-roledescription="carousel"
                aria-label="Templates"
                onPointerLeave={(event) => event.pointerType !== "touch" && setOpen(false)}
                onPointerMove={(event) => {
                  if (!open || !cw) return;
                  const next = Math.round(PIC + (event.clientX - (box.left + box.w / 2)) / (cw * 0.55));
                  posTarget.set(Math.max(0, Math.min(ITEMS.length - 1, next)));
                }}
                onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setOpen(false)}
                style={box.vw ? { left: -box.left, width: box.vw } : undefined}
                className={`absolute inset-y-0 left-0 block w-full [perspective:1400px] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                {/* The glass frame round the centre card, with the name of the template there. */}
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.94 }}
                  transition={open ? timing(0.5, 0.2) : timing(0.2)}
                  style={{ left: slotLeft - FRAME_PAD, top: frameTop, width: cw + FRAME_PAD * 2, height: ch + FRAME_PAD * 2 + CAPTION, zIndex: 48 }}
                  className="pointer-events-none absolute block rounded-[32px] border border-solid border-[color-mix(in_srgb,var(--fg)_14%,transparent)] bg-[color-mix(in_srgb,var(--bg)_22%,transparent)] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_30px_70px_-28px_rgb(0_0_0/0.5)] backdrop-blur-2xl backdrop-saturate-150"
                >
                  <span className="absolute inset-x-0 bottom-0 flex h-[44px] items-center justify-center truncate px-3 text-[0.75rem] uppercase tracking-[0.08em] text-[var(--dim)]">{ITEMS[shown].name}</span>
                </motion.span>

                {/* The other templates, fanned out on both sides of the centre slot. */}
                {cw > 0 &&
                  ITEMS.map((template, i) =>
                    i === PIC ? null : (
                      <span key={template.id} style={{ left: slotLeft, top: slotTop, width: cw, height: ch }} className="absolute block">
                        <FlowCard index={i} pos={pos} cw={cw} open={openness}>
                          {(dim) => (
                            <Link
                              href={template.href}
                              target="_blank"
                              rel="noopener"
                              tabIndex={open ? 0 : -1}
                              aria-hidden={open ? undefined : true}
                              aria-label={`${template.name}: open the live demo (new tab)`}
                              className={`${focusRing} relative block h-full overflow-hidden rounded-[22px] bg-[var(--card)] shadow-[0_18px_40px_-18px_rgb(0_0_0/0.5)]`}
                            >
                              <Image src={template.image} alt="" fill sizes="20vw" className="object-cover" />
                              <motion.span aria-hidden="true" style={{ opacity: dim }} className="absolute inset-0 block bg-black" />
                            </Link>
                          )}
                        </FlowCard>
                      </span>
                    ),
                  )}

                {/* The picture: the whole box, or the coverflow's centre card. */}
                <motion.span
                  tabIndex={0}
                  aria-label={`${PICTURE.name}. Show the templates`}
                  onPointerDown={(event) => {
                    pressedBy.current = event.pointerType;
                  }}
                  onPointerEnter={(event) => event.pointerType !== "touch" && setOpen(true)}
                  onClick={(event) => (event.nativeEvent as PointerEvent).pointerType === "touch" && setOpen((value) => !value)}
                  onFocus={() => pressedBy.current !== "touch" && setOpen(true)}
                  initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
                  animate={{
                    clipPath: "inset(0% 0% 0% 0%)",
                    left: open && cw ? slotLeft : box.vw ? box.left : 0,
                    top: open && cw ? slotTop : 0,
                    width: open && cw ? cw : box.w || "100%",
                    height: open && cw ? ch : box.h || "100%",
                    borderRadius: open ? 22 : 0,
                  }}
                  transition={{ clipPath: { duration: 1.2, ease, delay: 0.35 }, default: open ? timing(0.7) : timing(0.6, 0.05) }}
                  style={{ x: picX, rotateY: picRotate, scale: picScale, zIndex: picZ }}
                  className={`${focusRing} pointer-events-auto absolute block cursor-pointer overflow-hidden bg-[var(--card)]`}
                >
                  <Image src={PICTURE.image} alt="" fill priority quality={90} sizes="(min-width: 640px) 50vw, 100vw" className="object-cover object-[center_30%]" />
                  <motion.span aria-hidden="true" style={{ opacity: picDim }} className="absolute inset-0 block bg-black" />
                </motion.span>
              </span>
            </span>

            {/* The subtitle: small, medium weight, in the quiet colour, under the picture. */}
            <span className="-mb-[0.1em] block max-w-[36em] overflow-hidden pb-[0.1em] text-[length:clamp(0.9375rem,2cqi,1.125rem)] font-medium normal-case leading-[1.45] tracking-[-0.01em] text-[var(--dim)]">
              <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: 0.45 }}>
                {SECOND}
              </motion.span>
            </span>
          </h1>

          {/* The headline and the way in. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.9 }}
            className="mt-[clamp(2rem,6cqi,4rem)] flex justify-start"
          >
            {/* As in the Orchid reference: the label and a bold arrow, and under them a dot and a short bar that stretches on hover. */}
            <Link href={HERO.primary.href} className={`${focusRing} group flex w-fit flex-col gap-2 rounded-[2px] text-[length:clamp(1.0625rem,calc(0.95rem_+_0.3vw),1.25rem)] tracking-[-0.02em] text-[var(--fg)] no-underline`}>
              <span className="flex items-center gap-[clamp(1.5rem,2.4cqi,2.5rem)]">
                {HERO.primary.label}
                <ArrowUpRight aria-hidden="true" strokeWidth={2.25} className="size-[1.15em] text-[var(--accent)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span aria-hidden="true" className="flex items-center gap-[3px]">
                <span className="block size-[3px] rounded-full bg-current" />
                <span className="block h-[2px] w-6 bg-current transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-[calc(100%-6px)] group-focus-visible:w-[calc(100%-6px)]" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
