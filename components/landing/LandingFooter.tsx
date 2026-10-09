"use client";

import Link from "next/link";
import { ArrowUp, Pause, Play } from "lucide-react";
import { useLanding } from "@/components/landing/LandingProvider";
import { Reveal } from "@/components/landing/Reveal";
import { SectionDivider, sectionCard } from "@/components/landing/Section";
import { focusRing, primaryButton, text } from "@/components/landing/landing-ui";

const footerLink = `${focusRing} rounded text-foreground/75 no-underline transition-colors hover:text-foreground`;
const roundButton = `${focusRing} ${primaryButton} flex size-10 cursor-pointer items-center justify-center rounded-full`;

// Footer in the shared section card: a full-width wordmark, the divider, then
// a footer row with the copyright, links and round buttons. Keeps every
// previous footer link.
export default function LandingFooter() {
  const { motionReduced, setMotionReduced } = useLanding();
  return (
    <footer aria-label="Site footer" className="relative w-full py-20">
      <div className="w-content-width mx-auto">
        <div className={sectionCard}>
         
          <SectionDivider />
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-col items-center gap-2 md:items-start">
              <span className={`${text.base} opacity-75`}>
                © 2026 <Link href="/" className={footerLink}>Portory</Link>. All rights reserved.
              </span>
              <nav aria-label="Footer navigation" className={`${text.base} flex flex-wrap justify-center gap-x-4 gap-y-1`}>
                <Link href="/templates" className={footerLink}>Templates</Link>
                <a href="#how-it-works" className={footerLink}>How it works</a>
                <a href="#about" className={footerLink}>About</a>
                <a href="#" className={footerLink}>Privacy</a>
                <a href="#" className={footerLink}>Terms</a>
              </nav>
            </div>
            <Reveal className="flex items-center justify-center gap-3">

            
              <button
                type="button"
                aria-label="Back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: motionReduced ? "auto" : "smooth" })}
                className={roundButton}
              >
                <ArrowUp aria-hidden="true" className="size-4" />
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </footer>
  );
}
