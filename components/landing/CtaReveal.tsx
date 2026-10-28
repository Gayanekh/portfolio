"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import ClaimAddress from "@/components/landing/ClaimAddress";
import FinalCTA from "@/components/landing/FinalCTA";

// The address section scrolls up like a curtain over "Create with
// Portory", which stays fixed in place underneath. The wall is pinned to the
// bottom of the screen (sticky) inside this pair only, so it never shows
// behind the sections above: it travels with the address section until it
// fills the screen, holds still while the address section slides away, then
// scrolls on with the footer. `reveal` runs from 0 (the address section's
// foot at the bottom of the screen) to 1 (its foot at the top), for the
// wall's own settling.
export default function CtaReveal() {
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: reveal } = useScroll({ target: coverRef, offset: ["end end", "end start"] });

  return (
    <div className="relative">
      <div ref={coverRef} className="relative z-10">
        <ClaimAddress />
      </div>
      <div className="sticky bottom-0 z-0">
        <FinalCTA reveal={reveal} />
      </div>
    </div>
  );
}
