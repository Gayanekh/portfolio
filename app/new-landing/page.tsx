import type { Metadata } from "next";
import ExhibitLanding from "@/components/landing-next/ExhibitLanding";

export const metadata: Metadata = {
  title: "Portory | Portfolios that are yours",
  description: "Pick a template, add your work and publish a portfolio that looks designed. Edit any time, even after it's live.",
  // A new design in progress, beside the home page: kept out of search for now.
  robots: { index: false, follow: false },
};

export default function NewLandingPage() {
  return <ExhibitLanding />;
}
