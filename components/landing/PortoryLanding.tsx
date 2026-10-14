import FinalCTA from "@/components/landing/FinalCTA";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingProvider from "@/components/landing/LandingProvider";
import Questions from "@/components/landing/Questions";
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
          <HowItWorks />
          <Questions />
          <FinalCTA />
        </main>
        <LandingFooter />
      </div>
    </LandingProvider>
  );
}
