import ClaimAddress from "@/components/landing/ClaimAddress";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingProvider from "@/components/landing/LandingProvider";
import Questions from "@/components/landing/Questions";
import Steps from "@/components/landing/Steps";
import Styler from "@/components/landing/Styler";
import TemplatesSlider from "@/components/landing/TemplatesSlider";
import HeroTemplates from "@/components/new-landing/HeroTemplates";
import StartAtTop from "@/components/new-landing/StartAtTop";

// Landing page, structured after the Webild "creative portfolio" template:
// floating nav, hero, work, statement, about, services, FAQ, contact
// and footer, with Portory's own content and functionality.
export default function PortoryLanding() {
  return (
    <LandingProvider>
      <div className="relative isolate min-h-screen overflow-x-clip bg-background text-foreground antialiased">
        <StartAtTop />
        <LandingHeader />
        <main>
          <HeroTemplates />
          <TemplatesSlider />
          <Features />
          <Styler />
          <ClaimAddress />
          <Steps />
          <Questions />
          <FinalCTA />
        </main>
        <LandingFooter />
      </div>
    </LandingProvider>
  );
}
