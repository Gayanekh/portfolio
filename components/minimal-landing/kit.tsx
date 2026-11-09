"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { caps, ease, serif } from "@/components/minimal-landing/ui";

// The reference's reveal: each word starts invisible, 40px low and blurred
// 7px, and sharpens into place one after another. `now` plays it on load,
// otherwise when it comes into view.
const word = {
  hidden: { opacity: 0, y: 40, filter: "blur(7px)" },
  shown: (i: number) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease, delay: i * 0.07 } }),
};

export function Words({ text, as: Tag = "p", className, now = false, delay = 0 }: { text: string; as?: "h1" | "h2" | "h3" | "p"; className: string; now?: boolean; delay?: number }) {
  const play = now ? { initial: "hidden", animate: "shown" } : { initial: "hidden", whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  const words = text.split(" ");
  return (
    <Tag className={`m-0 ${className}`}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" {...play} className="block">
        {words.map((w, i) => (
          <motion.span key={i} custom={i + delay / 0.07} variants={word} className="inline-block whitespace-pre">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

// A block that sharpens into place the same way.
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(7px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// A section title: the serif italic word over the heavy capital word
// ("recent / PROJECTS"), centred.
export function Title({ italic, word: big, id, tone = "ink" }: { italic: string; word: string; id?: string; tone?: "ink" | "paper" }) {
  return (
    <Reveal className="text-center">
      <h2 id={id} className={`m-0 flex flex-col items-center ${tone === "ink" ? "text-[#16171a]" : "text-[#f8f7f6]"}`}>
        <span className={`${serif} text-[clamp(3rem,6vw,4.25rem)] leading-[0.9] tracking-[-0.04em]`}>{italic}</span>
        <span className={`${caps} text-[clamp(3rem,6vw,4rem)] leading-[1.1]`}>{big}</span>
      </h2>
    </Reveal>
  );
}
