import FinalCTA from "@/components/landing/FinalCTA";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingProvider from "@/components/landing/LandingProvider";
import Questions from "@/components/landing/Questions";
import TemplatesSlider from "@/components/landing/TemplatesSlider";

// Landing page, structured after the Webild "creative portfolio" template:
// floating nav, hero, work, statement, about, services, FAQ, contact
// and footer, with Portory's own content and functionality.
export default function PortoryLanding() {
  return (
    <LandingProvider>
      <div className="relative isolate min-h-screen overflow-x-clip bg-background text-foreground antialiased">
        <LandingHeader />
        <main>
          <LandingHero />
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
