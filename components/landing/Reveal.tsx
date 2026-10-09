"use client";

import { motion } from "framer-motion";
import { ease } from "@/components/landing/landing-ui";

const VIEWPORT = { once: true, amount: 0.15 } as const;
type RevealTag = "div" | "p" | "span" | "li" | "h1" | "h2" | "h3";

// Fades up 20px the first time it scrolls into view (the reference's reveal).
// Same markup on server and client; under reduced motion MotionConfig drops
// the movement and only the fade remains, so nothing is left hidden.
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: RevealTag;
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </Tag>
  );
}

// Words fade in one after another as the line scrolls into view.
export function SplitWords({ text, as = "span", className }: { text: string; as?: RevealTag; className?: string }) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag className={className} initial="hidden" whileInView="shown" viewport={VIEWPORT} transition={{ staggerChildren: 0.04 }} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          {i > 0 && " "}
          <motion.span
            className="inline-block"
            variants={{ hidden: { opacity: 0, y: "0.15em" }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// Button label whose letters roll up on hover, revealing a copy beneath
// (the reference's text-shadow roll). The roll is a transform, so it is skipped under reduced motion.
export function RollText({ text }: { text: string }) {
  return (
    <motion.span className="block overflow-hidden" initial="rest" whileHover="hover" aria-label={text}>
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block whitespace-pre [text-shadow:currentColor_0_1.25em]"
          variants={{ rest: { y: 0 }, hover: { y: "-1.25em" } }}
          transition={{ duration: 0.4, delay: i * 0.01, ease }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
