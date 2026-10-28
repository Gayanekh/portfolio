"use client";

import { useEffect, useRef } from "react";

// The space between dots (CSS px), how far the pointer reaches, and how much
// the dots drift and lean towards it.
const SPACING = 56;
const REACH = 190;
const DRIFT = 3;
const LEAN = 16;
// The colours: bone for the resting mesh, iris and peach near the pointer.
const BONE = "244 241 234";
const IRIS = "157 140 255";
const PEACH = "255 179 138";

type Dot = { x: number; y: number; phase: number };

// The page's living background: a lattice of dots, each joined to its
// neighbours by a fine line, drifting gently. Near the pointer the dots lean
// in and brighten, the lines warm to iris, and threads reach from the nearest
// dots to the pointer itself. Fixed behind the page; it pauses while the tab
// is hidden, and for reduced motion it is drawn once, still.
export default function Mesh() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let columns = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999, on: 0, target: 0 };
    let frame = 0;

    const build = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      columns = Math.ceil(width / SPACING) + 2;
      rows = Math.ceil(height / SPACING) + 2;
      const offsetX = (width - (columns - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          dots.push({ x: offsetX + c * SPACING, y: offsetY + r * SPACING, phase: Math.random() * Math.PI * 2 });
        }
      }
    };

    // Where each dot is now, and how near the pointer it is (0 to 1).
    const place = (dot: Dot, time: number) => {
      let x = dot.x + Math.sin(time * 0.0007 + dot.phase) * DRIFT;
      let y = dot.y + Math.cos(time * 0.0006 + dot.phase) * DRIFT;
      const dx = pointer.x - x;
      const dy = pointer.y - y;
      const distance = Math.hypot(dx, dy);
      const near = pointer.on * Math.max(0, 1 - distance / REACH);
      if (near > 0) {
        x += (dx / (distance || 1)) * LEAN * near;
        y += (dy / (distance || 1)) * LEAN * near;
      }
      return { x, y, near };
    };

    const draw = (time: number) => {
      pointer.on += (pointer.target - pointer.on) * 0.08;
      context.clearRect(0, 0, width, height);
      const placed = dots.map((dot) => place(dot, time));

      // The lines: right and down to each neighbour.
      context.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const a = placed[r * columns + c];
          const neighbours = [c + 1 < columns ? placed[r * columns + c + 1] : null, r + 1 < rows ? placed[(r + 1) * columns + c] : null];
          for (const b of neighbours) {
            if (!b) continue;
            const near = (a.near + b.near) / 2;
            context.strokeStyle = near > 0.02 ? `rgb(${IRIS} / ${0.08 + near * 0.45})` : `rgb(${BONE} / 0.08)`;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      // Threads from the nearest dots to the pointer.
      if (pointer.on > 0.02) {
        for (const p of placed) {
          if (p.near < 0.35) continue;
          context.strokeStyle = `rgb(${PEACH} / ${(p.near - 0.35) * 0.6})`;
          context.beginPath();
          context.moveTo(p.x, p.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      }

      // The dots.
      for (const p of placed) {
        context.fillStyle = p.near > 0.02 ? `rgb(${IRIS} / ${0.35 + p.near * 0.65})` : `rgb(${BONE} / 0.32)`;
        context.beginPath();
        context.arc(p.x, p.y, 1.1 + p.near * 1.6, 0, Math.PI * 2);
        context.fill();
      }
    };

    const loop = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (still) draw(0);
      else frame = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.target = 1;
    };
    const onLeave = () => {
      pointer.target = 0;
    };
    const onResize = () => {
      build();
      if (still) draw(0);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(frame) : start());

    build();
    start();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
