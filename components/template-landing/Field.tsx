"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// How many dots per 10,000px² of the field, and how far (px) the nearest
// follow the cursor.
const DENSITY = 0.9;
const REACH = 36;

type Dot = { x: number; y: number; depth: number; phase: number; size: number };

// The background's dots, after the Moire reference: a canvas of small dots
// scattered over the field, sparser over the middle two columns, that drift
// gently and follow the cursor. Each has a depth: the nearer ones move
// further, so the field reads as layered. The colour is the page's --dot,
// so it follows Light/Dark. With reduced motion they hold still.
export default function Field({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let colour = "rgb(0 0 0 / 0.3)";
    // The cursor's pull, -1 to 1 from the field's centre, eased towards its target.
    const pull = { x: 0, y: 0, tx: 0, ty: 0 };
    let frame = 0;
    let tick = 0;

    const seed = () => {
      const ratio = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * ratio;
      canvas.height = h * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(((w * h) / 10000) * DENSITY);
      dots = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        // Fewer over the middle two columns (from 1024px wide), where the content sits.
        const middle = w >= 1024 && x > w * 0.25 && x < w * 0.75;
        if (middle && Math.random() < 0.75) continue;
        dots.push({ x, y: Math.random() * h, depth: 0.25 + Math.random() * 0.75, phase: Math.random() * Math.PI * 2, size: Math.random() < 0.2 ? 2 : 1.5 });
      }
    };
    const readColour = () => {
      colour = getComputedStyle(canvas).getPropertyValue("--dot").trim() || colour;
    };

    const draw = (time: number) => {
      if (tick++ % 30 === 0) readColour();
      pull.x += (pull.tx - pull.x) * 0.06;
      pull.y += (pull.ty - pull.y) * 0.06;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = colour;
      for (const d of dots) {
        const drift = still ? 0 : Math.sin(time / 2400 + d.phase) * 4 * d.depth;
        const x = d.x + (still ? 0 : pull.x * REACH * d.depth) + drift;
        const y = d.y + (still ? 0 : pull.y * REACH * d.depth) + (still ? 0 : Math.cos(time / 2800 + d.phase) * 3 * d.depth);
        ctx.fillRect(x, y, d.size, d.size);
      }
      if (!still) frame = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pull.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pull.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    seed();
    readColour();
    frame = requestAnimationFrame(draw);
    const observer = new ResizeObserver(() => {
      seed();
      if (still) frame = requestAnimationFrame(draw);
    });
    observer.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [still]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
