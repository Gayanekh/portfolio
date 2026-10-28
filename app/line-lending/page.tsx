import type { Metadata } from "next";
import LineLending from "@/components/line-lending/LineLending";

export const metadata: Metadata = {
  title: "Portory | Your work has a story",
  description: "Choose a template, add your content, and publish your portfolio. Edit anytime, even after publishing.",
  // A design in progress beside the home page: kept out of search for now.
  robots: { index: false, follow: false },
};

// /line-landing with the rest of the Portory home page: every section, in its
// order and words, in the Exhibit look over the mesh of connected dots.
export default function LineLendingPage() {
  return <LineLending />;
}
