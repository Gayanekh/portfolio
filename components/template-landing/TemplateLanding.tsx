"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import LogoMark from "@/components/brand/LogoMark";
import Header from "@/components/template-landing/Header";
import Hero from "@/components/template-landing/Hero";
import Street from "@/components/template-landing/Street";
import Templates from "@/components/template-landing/Templates";
import Features from "@/components/template-landing/Features";
import Design from "@/components/template-landing/Design";
import Steps from "@/components/template-landing/Steps";
import Invite from "@/components/template-landing/Invite";
import BackToTop from "@/components/BackToTop";
import Questions from "@/components/template-landing/Questions";
import FinalCTA from "@/components/landing/FinalCTA";
import MinimalFooter from "@/components/minimal-landing/Footer";
import { sans as minimalSans } from "@/components/minimal-landing/ui";
import { fonts, themes } from "@/components/template-landing/ui";

// /template-landing: the Portory home page's content (its hero, templates,
// features, Make it yours, How it works and FAQ) in the
// reference's language, separate from the home page, on a plain ground (no
// grid lines). It closes with /minimal-landing's footer. The page is in its
// light theme.
// The footer's logo, as on the home page's footer: the "P" mark in a small
// white rounded square, leading home.
function FooterMark() {
  return (
    <Link href="/" aria-label="Portory home" className="grid size-10 place-items-center rounded-xl bg-white outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#16171a]">
      <LogoMark className="size-7" title={null} />
    </Link>
  );
}

export default function TemplateLanding() {
  return (
    <MotionConfig reducedMotion="user">
      <div data-site-scale className={`relative min-h-screen overflow-x-clip [--foreground:#16171a] ${fonts} bg-[var(--bg)] text-[var(--fg)] antialiased transition-colors duration-500 ${themes.light}`}>

        <Header />
        <main className="relative z-10">
          {/* In the Opus reference's order (the user asked for it): the hero filling
              the first screen, then work (Templates; an "Our vision" section before it
              was removed at the user's request), Make it yours after it (also asked; a "Made for" section
              between them was removed), services (Features), process (How it works),
              and the questions (the closing call after them was removed at the
              user's request). */}
          <Hero />
          {/* The self-drawing street of website windows, after the Endcap reference. */}
          <Street />
          <div className="relative z-10 bg-[var(--bg)]">
            <Templates />
            {/* A short call to start, after the grid (the user asked for it). */}
            <Invite />
            {/* Make it yours, right after Made for (the user asked for it). */}
            <Design />
            <Features />
            {/* Where the footer's How it works link (#how, from /minimal-landing) lands. */}
            <span id="how" aria-hidden="true" className="block h-0 scroll-mt-20" />
            <Steps />
            <Questions />
          </div>
        </main>

        {/* Back to the top, once the page has scrolled (the user asked). */}
        <BackToTop />

        {/* The close and footer of /minimal-landing, on this page's own ground. */}
        <div data-caption="end" className="relative z-10 text-[#16171a]">
          {/* In this page's type (the user asked for it): its sans and serif are the
              footer's fonts (the footer's own Geist, Playfair and Outfit were removed). */}
          <div className={`${minimalSans} [--ml-sans:var(--el-sans)] [--ml-serif:var(--el-serif)] [--ml-logo:var(--el-sans)]`}>
            {/* In the picture's place: the home page's wall of templates, saying Browse templates. */}
            <MinimalFooter close={false} mark={false} logo={<FooterMark />} aside={<FinalCTA compact lead="Browse" name="templates" leadFont="font-[family-name:var(--el-serif)] italic" />} />
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
