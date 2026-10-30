"use client";

import { useEffect, useRef } from "react";

// How long a stroke lasts (ms) and how wide it gets when the pointer moves slowly (px).
const LIFE = 1100;
const WIDTH = 22;
// Bristles across the brush: offsets from the stroke's middle (as a share of its
// width) and how much paint each carries.
const BRISTLES = [
  { at: -0.42, paint: 0.35 },
  { at: -0.2, paint: 0.8 },
  { at: 0, paint: 1 },
  { at: 0.18, paint: 0.7 },
  { at: 0.4, paint: 0.3 },
];

type Point = { x: number; y: number; t: number; w: number };

// A brush following the pointer: a soft, slightly tapered stroke with broken,
// bristly edges that fades away within about a second, so only a short trail
// ever shows. Faster movement draws it thinner, slower fuller. It is drawn in
// a warm off-white with a "difference" blend at low strength, so it reads on
// the dark wall and the light sheet alike without hiding what is under it.
// Off for touch screens and reduced motion; it stops drawing once the trail
// has faded and while the tab is hidden.
export default function Brush() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let points: Point[] = [];
    let frame = 0;
    let running = false;
    const size = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    size();

    const draw = (now: number) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      points = points.filter((p) => now - p.t < LIFE);
      // Flat ends: the segments meet at shared midpoints along one tangent, so
      // round ends would overlap there and show as beads.
      context.lineCap = "butt";
      // Each bristle is one smooth curve through the trail's midpoints, its
      // segments fading towards the tail.
      for (const bristle of BRISTLES) {
        for (let i = 1; i < points.length - 1; i++) {
          const a = points[i - 1];
          const b = points[i];
          const c = points[i + 1];
          const life = 1 - (now - b.t) / LIFE;
          const taper = Math.min(1, i / 8);
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const length = Math.hypot(dx, dy) || 1;
          const offset = bristle.at * b.w;
          const ox = (-dy / length) * offset;
          const oy = (dx / length) * offset;
          context.strokeStyle = `rgba(255, 238, 214, ${0.34 * life * life * bristle.paint})`;
          context.lineWidth = Math.max(0.8, b.w * 0.3 * taper);
          context.beginPath();
          context.moveTo((a.x + b.x) / 2 + ox, (a.y + b.y) / 2 + oy);
          context.quadraticCurveTo(b.x + ox, b.y + oy, (b.x + c.x) / 2 + ox, (b.y + c.y) / 2 + oy);
          context.stroke();
        }
      }
      if (points.length > 1 && !document.hidden) {
        frame = requestAnimationFrame(draw);
      } else {
        running = false;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const now = performance.now();
      const last = points[points.length - 1];
      const speed = last ? Math.hypot(event.clientX - last.x, event.clientY - last.y) / Math.max(1, now - last.t) : 0;
      // Slow strokes are full, fast ones thin out.
      const w = WIDTH * Math.max(0.35, Math.min(1, 1.2 - speed * 0.35));
      points.push({ x: event.clientX, y: event.clientY, t: now, w: last ? last.w + (w - last.w) * 0.35 : w });
      if (points.length > 80) points.shift();
      if (!running) {
        running = true;
        frame = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", size);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 h-full w-full mix-blend-difference" />;
}
