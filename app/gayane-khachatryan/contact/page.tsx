import type { Metadata } from "next";
import { ContactSection, Faq } from "@/components/gayane/sections";

export const metadata: Metadata = { title: "Contact" };

export default function GayaneContactPage() {
  return (
    <div className="pt-[clamp(4.5rem,7vw,6rem)]">
      <ContactSection />
      <Faq />
    </div>
  );
}
