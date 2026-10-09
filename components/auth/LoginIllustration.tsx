"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import illustration from "@/public/images/auth/girl.png";

export default function LoginIllustration() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative z-[1] hidden min-h-0 min-w-0 items-center justify-center overflow-hidden p-[clamp(12px,1.2vw,20px)] lg:flex" aria-hidden="true">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, x: -16, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full min-h-0 w-full min-w-0 items-center justify-center"
      >
        <Image src={illustration} alt="" priority sizes="(min-width: 1440px) 770px, (min-width: 1024px) 53vw, 1px" className="h-full w-full object-contain object-center" />
      </motion.div>
    </div>
  );
}
