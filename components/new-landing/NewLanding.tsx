import HeroTemplates from "@/components/new-landing/HeroTemplates";
import StartAtTop from "@/components/new-landing/StartAtTop";
import TemplatesSlider from "@/components/new-landing/TemplatesSlider";

// The new landing page, built from scratch. Put each section in its own file
// in this folder and add it to <main> below, in page order. All copy lives
// in content.ts.
export default function NewLanding() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground antialiased">
      <StartAtTop />
      <main>
        <HeroTemplates />
        <TemplatesSlider />
      </main>
    </div>
  );
}
