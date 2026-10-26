import BackToTop from "@/components/BackToTop";
import ClaimAddress from "@/components/landing/ClaimAddress";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingProvider from "@/components/landing/LandingProvider";
import Questions from "@/components/landing/Questions";
import Dusk from "@/components/new-landing/Dusk";
import HeroTemplates from "@/components/new-landing/HeroTemplates";
import StartAtTop from "@/components/new-landing/StartAtTop";
import Story from "@/components/new-landing/Story";
import TemplatesSlider from "@/components/new-landing/TemplatesSlider";

// The new landing page, built from scratch. Put each section in its own file
// in this folder and add it to <main> below, in page order. All copy lives
// in content.ts.
//
// Templates (step 01) and Story (How it works and Design, steps 02 to 04)
// read as one sequence, with Features between them. Everything up to the FAQ
// is on the page's own background; the page then fades (Dusk) into the dark
// address section, template wall and footer instead of meeting them at an
// edge.
export default function NewLanding() {
  return (
    <LandingProvider>
      <div className="relative isolate min-h-screen overflow-x-clip bg-background text-foreground antialiased">
        <StartAtTop />
        <LandingHeader />
        <main>
          <HeroTemplates />
          <TemplatesSlider />
          <Features />
          <Story />
          <Questions className="bg-transparent" />
          <Dusk />
          <ClaimAddress />
          <FinalCTA />
        </main>
        <LandingFooter />
        <BackToTop phone={false} />
      </div>
    </LandingProvider>
  );
}
