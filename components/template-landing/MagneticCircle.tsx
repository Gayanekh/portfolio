"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// The hover button of the igoro.framer.media works cards, ported 1:1 from its
// source: a light circle with a dark arrow that fades in over the card's centre
// and follows the cursor magnetically (pull radius 320px, strength 0.24, at most
// 24px, eased with a smoothstep, on a spring of 150/24/0.7) and, when the
// pointer is on it, the arrow slides 5px up and right. Fine pointers only.
const RADIUS = 320;
const STRENGTH = 0.24;
const MAX = 24;
const REACH = 220;
const SPRING = { stiffness: 150, damping: 24, mass: 0.7 };
const ease = [0.22, 1, 0.36, 1] as const;

export default function MagneticCircle() {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const rest = () => {
      pointer = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      x.set(0);
      y.set(0);
    };
    const apply = () => {
      frame = 0;
      if (!pointer || !visible || document.hidden || !fine.matches || calm.matches) return rest();
      const box = el.getBoundingClientRect();
      const scale = box.width / (el.offsetWidth || box.width || 1);
      if (scale <= 0 || box.width <= 0 || box.height <= 0) return rest();
      // The distance is taken from the circle's own centre (without the pull it already has).
      const dx = (pointer.x - (box.left + box.width / 2)) / scale + x.get();
      const dy = (pointer.y - (box.top + box.height / 2)) / scale + y.get();
      const d = Math.hypot(dx, dy);
      if (d >= RADIUS) {
        x.set(0);
        y.set(0);
        return;
      }
      const t = 1 - d / RADIUS;
      const smooth = t * t * (3 - 2 * t);
      const pull = Math.min(MAX, d * STRENGTH * smooth * (REACH / RADIUS));
      const k = d > 0 ? pull / d : 0;
      x.set(dx * k);
      y.set(dy * k);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !visible || !fine.matches || calm.matches) return;
      pointer = { x: e.clientX, y: e.clientY };
      frame ||= requestAnimationFrame(apply);
    };
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) rest();
    };

    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) rest();
    });
    watcher.observe(el);
    const unsubscribe = [x.on("change", (v) => (el.style.translate = `${v}px ${y.get()}px`)), y.on("change", (v) => (el.style.translate = `${x.get()}px ${v}px`))];
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", out);
    window.addEventListener("scroll", rest, { capture: true, passive: true });
    window.addEventListener("resize", rest, { passive: true });
    window.addEventListener("blur", rest);
    document.addEventListener("visibilitychange", rest);
    return () => {
      watcher.disconnect();
      unsubscribe.forEach((off) => off());
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("scroll", rest, true);
      window.removeEventListener("resize", rest);
      window.removeEventListener("blur", rest);
      document.removeEventListener("visibilitychange", rest);
      if (frame) cancelAnimationFrame(frame);
      el.style.translate = "";
    };
  }, [x, y]);

  return (
    <span ref={ref} aria-hidden="true" className="pointer-events-auto grid size-[clamp(5.5rem,6.5vw,8.5rem)] place-items-center rounded-full bg-[#f7f7f7] text-[#111]">
      <motion.span whileHover={{ x: 5, y: -5, transition: { duration: 0.55, ease } }} className="grid size-full place-items-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none block" style={{ width: "30%" }}>
          <g transform="translate(7 7)">
            <path d="M 0 10 L 10 0" />
            <path d="M 0 0 L 10 0 L 10 10" />
          </g>
        </svg>
      </motion.span>
    </span>
  );
}
