import type { Metadata } from "next";
import PortoryLanding from "@/components/landing/PortoryLanding";

export const metadata: Metadata = {
  title: "Portory — Classic home",
  // The previous home page, kept (the user asked) now that / shows the new landing; out of search.
  robots: { index: false, follow: false },
};

// The home page as it was before /template-landing became the main landing (components/landing).
export default function ClassicHomePage() {
  return <PortoryLanding />;
}
