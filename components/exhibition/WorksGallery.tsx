"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { GalleryHorizontal, LayoutGrid } from "lucide-react";
import Brush from "@/components/exhibition/Brush";
import { ARTIST, GALLERY, WORKS } from "@/components/exhibition/content";
import { handFont, handVariable } from "@/components/exhibition/fonts";
import { caps } from "@/components/exhibition/ui";
import { fontVariables } from "@/components/landing-next/fonts";
import { ease, focusRing } from "@/components/landing-next/ui";

const palette = "[--ink:#141414] [--bone:#ffffff]";

// The motion, measured on the Thala reference: one turn of the wheel moves
// each column by about its length, the columns alternating up and down at
// slightly different speeds, and everything glides to a stop in about 0.6s.
const DIRECTION = [1, -1, 1, -1];
const SPEED = [0.62, 0.73, 0.84, 0.69];
// Share of the remaining distance covered per 60fps frame.
const GLIDE = 0.1;
// The outer columns hang a little crooked, the inner ones straight.
const TILT = [-3, 2.5, -1.5, 3, -2, 1.5, -2.5, 2];
const OUTER = [true, false, false, true];
const ASPECT = ["3 / 4", "4 / 5", "1 / 1", "2 / 3", "4 / 3", "3 / 4", "5 / 4", "3 / 5"];

const mod = (n: number, m: number) => ((n % m) + m) % m;

type Glide = { target: number; current: number; dragged: boolean; to: (value: number) => void };

// The page's scroll, taken over: the wheel, a drag (mouse or touch) and the
// arrow keys move a target, and \`apply\` is called every frame with a value
// that eases towards it, so every movement glides and settles. With \`snap\`,
// the target settles on the nearest step once input stops. Reduced motion:
// no easing, it moves at once.
function useGlide(stage: RefObject<HTMLElement | null>, apply: (value: number) => void, { start = 0, snap }: { start?: number; snap?: () => number } = {}) {
  const still = Boolean(useReducedMotion());
  const applyRef = useRef(apply);
  const snapRef = useRef(snap);
  useEffect(() => {
    applyRef.current = apply;
    snapRef.current = snap;
  });
  const glide = useRef<Glide>({ target: start, current: start, dragged: false, to: () => {} });

  useEffect(() => {
    const g = glide.current;
    const el = stage.current;
    let frame = 0;
    let last = 0;
    let idle = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const k = still ? 1 : 1 - Math.pow(1 - GLIDE, dt / 16.7);
      g.current += (g.target - g.current) * k;
      if (Math.abs(g.target - g.current) < 0.05) g.current = g.target;
      applyRef.current(g.current);
      if (g.current === g.target) {
        frame = 0;
        last = 0;
      } else frame = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const settle = () => {
      window.clearTimeout(idle);
      const step = snapRef.current?.();
      if (!step) return;
      idle = window.setTimeout(() => {
        g.target = Math.round(g.target / step) * step;
        kick();
      }, 160);
    };
    const push = (delta: number) => {
      g.target += delta;
      kick();
      settle();
    };
    g.to = (value) => {
      window.clearTimeout(idle);
      g.target = value;
      kick();
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      push((Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * unit);
    };
    let from: { x: number; y: number; moved: number } | null = null;
    const onDown = (event: PointerEvent) => {
      from = { x: event.clientX, y: event.clientY, moved: 0 };
      g.dragged = false;
    };
    const onMove = (event: PointerEvent) => {
      if (!from) return;
      const dx = event.clientX - from.x;
      const dy = event.clientY - from.y;
      from = { x: event.clientX, y: event.clientY, moved: from.moved + Math.abs(dx) + Math.abs(dy) };
      if (from.moved > 6) g.dragged = true;
      push(-(Math.abs(dx) > Math.abs(dy) ? dx : dy) * 1.4);
    };
    const onUp = () => {
      from = null;
    };
    const onKey = (event: KeyboardEvent) => {
      const step = { ArrowDown: 160, ArrowRight: 160, PageDown: 600, " ": 600, ArrowUp: -160, ArrowLeft: -160, PageUp: -600 }[event.key];
      if (step === undefined) return;
      event.preventDefault();
      push(step);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    el?.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    const onResize = () => applyRef.current(g.current);
    window.addEventListener("resize", onResize);
    applyRef.current(g.current);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [stage, still]);

  return glide;
}

// The grid view: four columns of the works with no end, two moving up and
// two down as the page is scrolled. Clicking a work opens it in the slider.
function Grid({ onOpen }: { onOpen: (index: number) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const copies = useRef<(HTMLDivElement | null)[]>([]);

  const glide = useGlide(stage, (value) => {
    tracks.current.forEach((track, c) => {
      const length = copies.current[c]?.offsetHeight;
      if (!track || !length) return;
      // Each column starts at its own point, so the rows never line up.
      const y = -mod(length * (c * 0.29) + DIRECTION[c] * SPEED[c] * value, length);
      track.style.transform = `translate3d(0,${y}px,0)`;
    });
  });

  const open = (index: number) => {
    if (!glide.current.dragged) onOpen(index);
  };

  return (
    <div ref={stage} className="absolute inset-0 grid cursor-grab touch-none select-none grid-cols-2 gap-[5vw] px-[5vw] active:cursor-grabbing lg:grid-cols-4 lg:gap-[3vw]">
      {DIRECTION.map((_, c) => (
        <div key={c} className={`relative h-full overflow-visible ${c > 1 ? "hidden lg:block" : ""}`}>
          <div ref={(el) => void (tracks.current[c] = el)} className="absolute inset-x-0 top-0 will-change-transform">
            <Column column={c} onOpen={open} setRef={(el) => void (copies.current[c] = el)} />
            <Column column={c} onOpen={open} hidden />
          </div>
        </div>
      ))}
    </div>
  );
}

// One run of a column's works; each column holds two, one after the other,
// so it can loop without a seam.
function Column({ column: c, onOpen, hidden = false, setRef }: { column: number; onOpen: (index: number) => void; hidden?: boolean; setRef?: (el: HTMLDivElement | null) => void }) {
  const order = WORKS.map((_, i) => (i + c * 3) % WORKS.length);
  return (
    <div ref={setRef} aria-hidden={hidden || undefined} className="flex flex-col items-center gap-[clamp(4rem,9vw,8rem)] pb-[clamp(4rem,9vw,8rem)]">
      {order.map((index, k) => {
        const work = WORKS[index];
        return (
          <button
            key={`${work.id}-${k}`}
            type="button"
            tabIndex={hidden ? -1 : 0}
            onClick={() => onOpen(index)}
            aria-label={`Open ${work.title}`}
            style={{ aspectRatio: ASPECT[(index + c) % ASPECT.length], rotate: OUTER[c] ? `${TILT[(k + c) % TILT.length]}deg` : undefined }}
            className={`${focusRing} group/card block w-[clamp(10rem,19.5vw,24rem)] max-w-full cursor-pointer overflow-hidden border-0 bg-[#1e1e1e] p-0`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
            <img src={work.image} alt="" draggable={false} className="block h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.05]" />
          </button>
        );
      })}
    </div>
  );
}

// The slider view: the works large in one row with no end, the one in the
// middle straight and the others leaning away from it. It glides and settles
// on a work; clicking one at the side brings it to the middle.
function Slider({ start, onCentre }: { start: number; onCentre: (index: number) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const centre = useRef(-1);
  const slot = () => (typeof window === "undefined" ? 500 : window.innerWidth * (window.innerWidth < 640 ? 0.88 : 0.44));
  const total = () => slot() * WORKS.length;
  // Where each card is, from the middle, for a value.
  const offset = (index: number, value: number) => mod(index * slot() - value + total() / 2, total()) - total() / 2;

  const glide = useGlide(
    stage,
    (value) => {
      const s = slot();
      cards.current.forEach((card, i) => {
        if (!card) return;
        const x = offset(i, value);
        const turn = Math.max(-12, Math.min(12, (x / s) * 7));
        const scale = 1 - Math.min(Math.abs(x) / s, 2) * 0.07;
        card.style.transform = `translate3d(${x}px,0,0) rotate(${turn}deg) scale(${scale})`;
      });
      const index = mod(Math.round(value / s), WORKS.length);
      if (index !== centre.current) {
        centre.current = index;
        onCentre(index);
      }
    },
    { start: start * slot(), snap: slot },
  );

  const bring = (index: number) => {
    const g = glide.current;
    if (!g.dragged) g.to(g.target + offset(index, g.target));
  };

  return (
    <div ref={stage} className="absolute inset-0 grid cursor-grab touch-none select-none place-items-center active:cursor-grabbing">
      {WORKS.map((work, i) => (
        <button
          key={work.id}
          ref={(el) => void (cards.current[i] = el)}
          type="button"
          onClick={() => bring(i)}
          aria-label={`Show ${work.title}`}
          style={{ aspectRatio: ASPECT[i % ASPECT.length] }}
          className={`${focusRing} absolute h-[min(74svh,50rem)] max-w-[84vw] cursor-pointer overflow-hidden border-0 bg-[#1e1e1e] p-0 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] will-change-transform`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
          <img src={work.image} alt="" draggable={false} className="block h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}

// "The works": its own page, after the Thala reference. The works fill the
// screen in one of two views, switched at the bottom: a grid of endless
// columns moving against each other, or a slider of large works. The page
// itself does not scroll; the wheel, a drag or the arrow keys move the works.
export default function WorksGallery() {
  const [view, setView] = useState<"grid" | "slider">("grid");
  const [focus, setFocus] = useState(0);
  const [centre, setCentre] = useState(0);

  // While the works are moving (wheel, drag or keys), the hint steps aside;
  // it comes back once they have been still for a moment.
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    let rest = 0;
    let down = false;
    const stir = () => {
      setMoving(true);
      window.clearTimeout(rest);
      rest = window.setTimeout(() => setMoving(false), 1200);
    };
    const onDown = () => void (down = true);
    const onUp = () => void (down = false);
    const onDrag = () => down && stir();
    const onKey = (event: KeyboardEvent) => ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "PageDown", "PageUp", " "].includes(event.key) && stir();
    window.addEventListener("wheel", stir, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(rest);
      window.removeEventListener("wheel", stir);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onDrag);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const open = (index: number) => {
    setFocus(index);
    setCentre(index);
    setView("slider");
  };

  return (
    <MotionConfig reducedMotion="user">
      <div data-site-scale className={`fixed inset-0 overflow-hidden bg-[var(--ink)] font-sans text-[var(--bone)] antialiased ${palette} ${fontVariables} ${handVariable}`}>
        <Brush />
        <h1 className="sr-only">{GALLERY.title}</h1>

        <main className="absolute inset-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease }}
              className="absolute inset-0"
            >
              {view === "grid" ? <Grid onOpen={open} /> : <Slider start={focus} onCentre={setCentre} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* The left rail, as on the Archivio reference: the signature at the
            top, and at the foot the page's name standing on end over a short
            thin line that runs into the bottom edge. */}
        <aside className="pointer-events-none fixed bottom-0 left-0 top-0 z-50 flex flex-col items-start justify-between px-[clamp(1rem,2vw,1.75rem)] pt-4">
          <Link href="/exhibition" aria-label={`${ARTIST.name}, ${ARTIST.show}`} className={`${focusRing} pointer-events-auto flex flex-col rounded ${handFont} text-[1.9rem] leading-[0.85] text-[var(--bone)] no-underline`}>
            {/* The signature on two lines: first name over surname. */}
            {ARTIST.signature.split(" ").map((word, i) => (
              <span key={word} className={i ? "pl-[0.6em]" : undefined}>
                {word}
              </span>
            ))}
          </Link>
          <div aria-hidden="true" className="hidden flex-col items-center gap-10 pl-[0.55rem] sm:flex">
            <span className={`${caps} rotate-180 [writing-mode:vertical-rl]`}>{GALLERY.title}</span>
            <span className="h-[clamp(8rem,28svh,16rem)] w-px bg-white/40" />
          </div>
        </aside>

        {/* The hint at the top right, standing on end, which steps aside while
            the works move. */}
        <div className="pointer-events-none fixed right-0 top-0 z-50 px-[clamp(1rem,2vw,1.75rem)] pt-[clamp(5rem,12svh,7rem)]">
          <motion.span
            aria-hidden="true"
            animate={{ opacity: moving ? 0 : 1, y: moving ? -12 : 0 }}
            transition={{ duration: 0.5, ease }}
            className={`${caps} hidden [writing-mode:vertical-rl] sm:block`}
          >
            {GALLERY.hint}
          </motion.span>
        </div>

        {/* The foot: the two views in the middle, and in the slider the work in
            the middle on the right. */}
        <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(1rem,2vw,1.75rem)] py-4">
          <span />
          <div role="group" aria-label="View" className="pointer-events-auto flex items-center gap-1">
            {(
              [
                ["grid", GALLERY.grid, LayoutGrid],
                ["slider", GALLERY.slider, GalleryHorizontal],
              ] as const
            ).map(([name, title, Icon]) => (
              <button
                key={name}
                type="button"
                onClick={() => setView(name)}
                aria-pressed={view === name}
                aria-label={title}
                className={`${focusRing} grid size-9 cursor-pointer place-items-center rounded border-0 bg-transparent p-0 text-[var(--bone)] transition-opacity ${view === name ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </button>
            ))}
          </div>
          <span aria-live="polite" className={`${caps} truncate text-right`}>
            {view === "grid" ? "" : `${WORKS[centre].title}, ${WORKS[centre].year}`}
          </span>
        </footer>
      </div>
    </MotionConfig>
  );
}
