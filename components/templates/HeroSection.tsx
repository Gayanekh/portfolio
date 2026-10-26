"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  return (
    <section className="pt-[clamp(8rem,calc(5.214rem_+_11.429vw),12rem)] pb-[clamp(4rem,calc(2.607rem_+_5.714vw),6rem)] px-[clamp(1.5rem,calc(0.804rem_+_2.857vw),2.5rem)]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-[1120px] mx-auto"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease }}
          className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground mb-5"
        >
          Choose a Template
        </motion.p>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
          className="text-[clamp(2rem,5vw,3.75rem)] font-light text-foreground leading-[1.1] tracking-[-0.02em] mb-5"
        >
          Pick your style,
          <br />
          <span className="text-foreground/30">make it yours</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
          className="text-[15px] text-foreground/45 leading-relaxed max-w-[480px]"
        >
          Select a design that fits your personality. Customize every detail
          and preview your portfolio in real time.
        </motion.p>
      </motion.div>
    </section>
  );
}
