"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeftRight, LayoutTemplate, Link2, Lock, MousePointerClick, Smartphone } from "lucide-react";
import { FEATURES } from "@/components/template-landing/content";
import { useScrollValue } from "@/components/template-landing/scroll-fx";
import { ease, frame, grid, pad, type } from "@/components/template-landing/ui";

// One icon per feature, in the home page's order.
const ICONS = [LayoutTemplate, MousePointerClick, Smartphone, ArrowLeftRight, Lock, Link2];

// Features, the home page's six: a real template's opening screen down the
// first column (opening from its top once in view); beside it the label and
// the title, its words lighting one after another, and the intro line; then
// the six features in cells divided by hairlines, each with its number,
// icon, title and line.
export default function Features() {
  // The picture zooms out from close up as the section scrolls into view.
  const [pictureRef, zoom] = useScrollValue<HTMLDivElement>([1.35, 1], ["start end", "center center"]);
  const words = FEATURES.title.split(" ");
  return (
    <section id="features" data-caption="features" aria-labelledby="tl-features-title" className="relative scroll-mt-20 py-[clamp(5rem,12vh,9rem)]">
      <div className={`${frame} ${grid} gap-y-12`}>
        <motion.div
          ref={pictureRef}
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.3, ease }}
          className="relative aspect-[3/4] overflow-hidden bg-[var(--card)] lg:row-span-2 lg:aspect-auto lg:min-h-[44rem]"
        >
          <motion.span style={{ scale: zoom }} className="absolute inset-0 block">
            <Image src={FEATURES.image} alt={`The ${FEATURES.imageName} template`} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
          </motion.span>
        </motion.div>

        <div className="flex flex-col gap-8 lg:col-span-2 lg:px-[clamp(1rem,1.75vw,2rem)]">
          <p className={`m-0 ${type.body}`}>{FEATURES.label}</p>
          <motion.h2
            id="tl-features-title"
            initial="dim"
            whileInView="lit"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.06 }}
            aria-label={FEATURES.title}
            className={`m-0 ${type.statement}`}
          >
            {words.map((word, i) => (
              <span key={i} aria-hidden="true">
                {i > 0 && " "}
                <motion.span className="inline-block" variants={{ dim: { opacity: 0.15 }, lit: { opacity: 1, transition: { duration: 0.6, ease } } }}>
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <p className={`m-0 max-w-[30rem] ${type.lead} text-[var(--dim)]`}>{FEATURES.text}</p>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 border-0 border-t border-solid border-[var(--line)] p-0 sm:grid-cols-2 lg:col-span-3 lg:col-start-2 lg:row-start-2 lg:self-end lg:grid-cols-3">
          {FEATURES.items.map((item, i) => {
            const Icon = ICONS[i] ?? LayoutTemplate;
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 1, ease, delay: (i % 3) * 0.1 }}
                className="group/feature flex min-h-[clamp(11rem,15vw,15rem)] flex-col justify-between gap-6 border-0 border-b border-solid border-[var(--line)] p-[clamp(1rem,1.75vw,2rem)] sm:max-lg:[&:nth-child(odd)]:border-r"
              >
                <span className="flex items-center justify-between">
                  <span className={`${type.small} text-[var(--dim)] tabular-nums`}>{pad(i + 1)}</span>
                  <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-[var(--fg)] transition-colors duration-300 group-hover/feature:text-[var(--accent)]" />
                </span>
                <span className="flex flex-col gap-2">
                  <h3 className={`m-0 ${type.name}`}>{item.title}</h3>
                  <p className={`m-0 ${type.body} text-[var(--dim)]`}>{item.text}</p>
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
