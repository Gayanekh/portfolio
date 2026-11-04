import Closing from "@/components/other-landing/Closing";
import Contact from "@/components/other-landing/Contact";
import Design from "@/components/other-landing/Design";
import Features from "@/components/other-landing/Features";
import Header from "@/components/other-landing/Header";
import Hero from "@/components/other-landing/Hero";
import MadeFor from "@/components/other-landing/MadeFor";
import Numbers from "@/components/other-landing/Numbers";
import Questions from "@/components/other-landing/Questions";
import Steps from "@/components/other-landing/Steps";
import Works from "@/components/other-landing/Works";
import { colors, fonts } from "@/components/other-landing/ui";

// /other-landing: Portory told in the Framewell reference's sections and look.
// Its sections tell one story: show, try, learn, trust, act. In order: Hero,
// Templates (Recent works), Made for (Testimonials), Make it yours (from
// /template-landing), Features, How it works, In numbers (Stats), the
// closing call, FAQ (in Pricing's place) and Get started (footer).
export default function OtherLanding() {
  return (
    <div data-site-scale className={`${fonts} ${colors.page} min-h-screen overflow-x-clip antialiased`}>
      <Header />
      <main>
        <Hero />
        <Works />
        <MadeFor />
        <Design />
        <Features />
        <Steps />
        <Numbers />
        <Closing />
        <Questions />
      </main>
      <Contact />
    </div>
  );
}
