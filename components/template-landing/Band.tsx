"use client";

import { Fragment, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { AUDIENCE } from "@/components/template-landing/content";
import { useStill } from "@/components/template-landing/scroll-fx";
import { frame } from "@/components/template-landing/ui";

const SPEED = 55;

// Who Portory is for, as a band running without end in a raised strip
// between hairlines, blurred out at both ends; it slows under the pointer.
// Like a Framer ticker it answers the scroll: scrolling speeds it up,
// scrolling back reverses it, and the words lean with the scroll's speed.
// For reduced motion the words simply wrap.
export default function Band() {
  const still = useStill();
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rate = useRef(1);
  const [slow, setSlow] = useState(false);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const lean = useTransform(velocity, [-2500, 0, 2500], [9, 0, -9]);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (still || !track) return;
    rate.current += ((slow ? 0.15 : 1) - rate.current) * Math.min(1, delta / 300);
    const half = track.scrollWidth / 2;
    const push = boost.get();
    if (push < 0) direction.current = -1;
    else if (push > 0) direction.current = 1;
    let next = x.get() - (direction.current * SPEED * rate.current * (1 + Math.abs(push)) * delta) / 1000;
    if (half > 0 && -next >= half) next += half;
    if (half > 0 && next > 0) next -= half;
    x.set(next);
  });

  const words = (
    <div className="flex shrink-0 items-center gap-[clamp(2rem,4vw,4.5rem)] pr-[clamp(2rem,4vw,4.5rem)]">
      {AUDIENCE.map((word, i) => (
        <Fragment key={word}>
          <span className={`whitespace-nowrap font-[family-name:var(--font-1)] text-[length:clamp(1.5rem,2.6vw,2.75rem)] tracking-[-0.04em] ${i % 2 ? "font-medium italic" : "font-extrabold uppercase"}`}>{word}</span>
          <span aria-hidden="true" className="size-1.5 shrink-0 bg-[var(--accent)]" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <section aria-label="Made for" className={frame}>
      <p className="sr-only">Made for {AUDIENCE.join(", ")}.</p>
      <div
        aria-hidden="true"
        onPointerEnter={() => setSlow(true)}
        onPointerLeave={() => setSlow(false)}
        className="overflow-hidden border-0 border-b border-solid border-[var(--line)] bg-[var(--card)] py-[clamp(1.75rem,3.5vw,3rem)] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]"
      >
        {still ? (
          <div className="flex flex-wrap justify-center">{words}</div>
        ) : (
          <motion.div ref={trackRef} style={{ x, skewX: lean }} className="flex w-max">
            {words}
            {words}
          </motion.div>
        )}
      </div>
    </section>
  );
}
