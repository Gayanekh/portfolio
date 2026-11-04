"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { NUMBERS } from "@/components/other-landing/content";
import { Heading, Reveal } from "@/components/other-landing/parts";
import { colors, ease, frame, gap, section, type } from "@/components/other-landing/ui";

// A figure that counts up from 0 the first time it comes into view. The
// server and anyone preferring less motion see the real number at once.
function Count({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const still = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node || !seen || still) return;
    const run = animate(0, value, { duration: 1.4, ease, onUpdate: (n) => (node.textContent = `${Math.round(n)}${suffix}`) });
    return () => run.stop();
  }, [seen, still, value, suffix]);
  return (
    <span ref={ref} className={type.number}>
      {value}
      {suffix}
    </span>
  );
}

// The reference's stats: the heading on the left half, four grey cells on the right.
export default function Numbers() {
  return (
    <section aria-labelledby="numbers-title" className={`${frame} ${section} grid grid-cols-1 md:grid-cols-2 ${gap} gap-y-8`}>
      <div className="self-start">
        <Heading id="numbers-title" label={NUMBERS.label} lines={NUMBERS.title} />
      </div>
      <ul className={`m-0 grid list-none grid-cols-2 p-0 md:mt-[2.15rem] ${gap}`}>
        {NUMBERS.items.map((item, i) => (
          <li key={item.label}>
            <Reveal order={i} className={`flex aspect-[320/220] flex-col items-center justify-center gap-3 px-3 text-center ${colors.card}`}>
              <Count value={item.value} suffix={item.suffix} />
              <span className={`${type.body} ${colors.body}`}>{item.label}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
