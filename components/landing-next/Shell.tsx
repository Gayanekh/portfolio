"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import Closing from "@/components/landing-next/Closing";
import { fontVariables } from "@/components/landing-next/fonts";
import Nav from "@/components/landing-next/Nav";
import { palette } from "@/components/landing-next/ui";

// Every page of the new "Exhibit" world (/new-landing and its templates
// page): its colours and type, the floating nav, the page's own content and
// the closing call to action with the footer. `home` is set on pages other
// than the landing, so the nav's section links lead back to it.
export default function Shell({ home, children }: { home?: string; children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div data-site-scale className={`min-h-screen overflow-x-clip bg-[var(--bone)] font-sans text-[var(--ink)] antialiased ${palette} ${fontVariables}`}>
        <Nav home={home} />
        <main>{children}</main>
        <Closing />
      </div>
    </MotionConfig>
  );
}
