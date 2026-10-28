"use client";

import Bento from "@/components/landing-next/Bento";
import Faq from "@/components/landing-next/Faq";
import Gallery from "@/components/landing-next/Gallery";
import Hero from "@/components/landing-next/Hero";
import Playground from "@/components/landing-next/Playground";
import Process from "@/components/landing-next/Process";
import Shell from "@/components/landing-next/Shell";

// The new landing (/new-landing), a world of its own beside the Portory home
// page: "Exhibit", a night gallery opening into a daylight studio (see
// ui.ts), built from the sections here and the project's own data (see
// content.ts). Below lg every section stacks for phones and tablets.
export default function ExhibitLanding() {
  return (
    <Shell>
      <Hero />
      <Gallery />
      <Process />
      <div className="bg-[var(--bone)] px-[clamp(0.5rem,1.2vw,1.25rem)]">
        <Playground />
      </div>
      <Bento />
      <Faq />
    </Shell>
  );
}
