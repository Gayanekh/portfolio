"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion } from "framer-motion";
import Bento from "@/components/landing-next/Bento";
import Closing from "@/components/landing-next/Closing";
import Faq from "@/components/landing-next/Faq";
import { fontVariables } from "@/components/landing-next/fonts";
import Nav from "@/components/landing-next/Nav";
import Playground from "@/components/landing-next/Playground";
import Process from "@/components/landing-next/Process";
import { ease, palette } from "@/components/landing-next/ui";
import { CLAIM, DESIGN, FAQ, FEATURES, FOOTER, NAV, STEPS, TEMPLATES } from "@/components/line-landing/content";
import Hero from "@/components/line-landing/Hero";
import Mesh from "@/components/line-landing/Mesh";
import Templates from "@/components/line-landing/Templates";

// A day section: a bone sheet with rounded corners, growing into place as it
// scrolls into view, over the night and its mesh.
function Sheet({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0.6, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.1, ease }}
      className="relative z-10 mx-[clamp(0.5rem,1.2vw,1.25rem)] overflow-hidden rounded-[clamp(2rem,4vw,4.5rem)] bg-[var(--bone)] shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)]"
    >
      {children}
    </motion.div>
  );
}

// /line-landing: the Portory home page's sections and content in the
// Exhibit look, over a living mesh of connected dots. The night sections
// (hero, templates, design, the address) let the mesh show through; the day
// sections (features, then how it works with the FAQ) are bone sheets rising
// over it. The header keeps signing in and signing up; every link leads to
// the real templates, demos, editor and account pages.
export default function LineLanding() {
  return (
    <MotionConfig reducedMotion="user">
      <div data-site-scale className={`relative min-h-screen overflow-x-clip bg-[var(--ink)] font-sans text-[var(--bone)] antialiased ${palette} ${fontVariables}`}>
        <Mesh />
        <Nav links={NAV} start={TEMPLATES.all.href} />
        <main className="relative z-10">
          <Hero />
          <Templates />
          <Sheet>
            <Bento copy={FEATURES} index="02" />
          </Sheet>
          <div id="make-it-yours" className="relative z-10 scroll-mt-20 px-[clamp(0.5rem,1.2vw,1.25rem)] py-[clamp(1rem,2vw,2rem)]">
            <Playground copy={DESIGN} index="03" />
          </div>
          <Sheet>
            <Process copy={STEPS} index="04" />
            <div id="faq" className="scroll-mt-20">
              <Faq copy={FAQ} index="05" />
            </div>
          </Sheet>
        </main>
        <div className="relative z-10">
          <Closing copy={CLAIM} footer={FOOTER} />
        </div>
      </div>
    </MotionConfig>
  );
}
