import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import TemplateShowcase from "@/components/landing/TemplateShowcase";
import LiveEditorDemo from "@/components/landing/LiveEditorDemo";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function PortoryLanding() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-foreground">
      <LandingHeader />
      <main>
        <LandingHero />
        <TemplateShowcase />
        <LiveEditorDemo />
        <HowItWorks />
        <Features />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
