import { ContactSection, Expertise, Faq, Hero, Process, Works } from "@/components/gayane/sections";

// The home page: the hero held still while everything else slides up over it.
export default function GayaneHomePage() {
  return (
    <>
      <Hero />
      <div className="relative z-10 bg-[var(--bg)]">
        <Works limit={4} />
        <Expertise />
        <Process />
        <ContactSection />
        <Faq />
      </div>
    </>
  );
}
