import type { Metadata } from "next";
import OtherLanding from "@/components/other-landing/OtherLanding";

const TITLE = "Portory — Your work has a story";
const DESCRIPTION = "Pick a designed template, make it yours and publish it at portory.net/you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", siteName: "Portory", images: [{ url: "/images/covers/persona.jpg", width: 2400, height: 1500, alt: "The Persona template on a screen" }] },
  // A design study beside the home page: kept out of search for now.
  robots: { index: false, follow: false },
};

// A landing for Portory after the Framewell reference, separate from the home
// page (components/other-landing).
export default function OtherLandingPage() {
  return <OtherLanding />;
}
