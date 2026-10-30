"use client";

import { motion } from "framer-motion";
import { ABOUT } from "@/components/exhibition/content";
import { prose, underline } from "@/components/exhibition/ui";
import { ease } from "@/components/landing-next/ui";

// "*bold*" marks in a paragraph become <strong>.
const bold = (text: string) => text.split("*").map((part, i) => (i % 2 ? <strong key={i} className="font-semibold">{part}</strong> : part));

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 1.1, ease, delay },
});

// About the show, as on the Archivio reference: two black-and-white studio
// photographs at the sides and a short, narrow text between them, set lower
// than the pictures, with one underlined link.
export default function About() {
  const [left, right] = ABOUT.photos;
  return (
    <section id="about" aria-label="About the show" className="relative scroll-mt-20 py-[clamp(4rem,10vh,8rem)]">
      <div className="mx-auto grid w-[min(90vw,92rem)] grid-cols-2 gap-x-[clamp(1rem,3vw,3rem)] gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
        <motion.div {...rise(0)} className="order-2 lg:order-none">
          {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
          <img src={left.image} alt={left.alt} loading="lazy" className="block aspect-square w-full object-cover grayscale lg:w-[85%]" />
        </motion.div>

        <motion.div {...rise(0.15)} className="col-span-2 flex flex-col gap-6 lg:col-span-1 lg:pt-[clamp(6rem,12vw,12rem)]">
          {ABOUT.paragraphs.map((paragraph) => (
            <p key={paragraph} className={prose}>
              {bold(paragraph)}
            </p>
          ))}
          <a href={ABOUT.link.href} className={`mt-4 self-start ${underline}`}>
            {ABOUT.link.label}
          </a>
        </motion.div>

        <motion.div {...rise(0.3)} className="order-3 lg:order-none lg:flex lg:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
          <img src={right.image} alt={right.alt} loading="lazy" className="block aspect-square w-full object-cover grayscale lg:mt-[clamp(1rem,2vw,2rem)] lg:w-[85%]" />
        </motion.div>
      </div>
    </section>
  );
}
