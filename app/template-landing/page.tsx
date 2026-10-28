import type { Metadata } from "next";
import TemplateLanding from "@/components/template-landing/TemplateLanding";

export const metadata: Metadata = {
  title: "Portory | Your work, seen the way it deserves",
  description: "Real, editable portfolio templates, live editing and your own address, in one place.",
  // A design study beside the home page: kept out of search for now.
  robots: { index: false, follow: false },
};

// A landing for Portory in the language of a given reference (a four-column
// hairline grid, giant words, light and dark), separate from the home page.
export default function TemplateLandingPage() {
  return <TemplateLanding />;
}
