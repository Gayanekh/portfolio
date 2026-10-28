import type { Metadata } from "next";
import LineLanding from "@/components/line-landing/LineLanding";

export const metadata: Metadata = {
  title: "Portory | Your work has a story",
  description: "Choose a template, add your content, and publish your portfolio. Edit anytime, even after publishing.",
  // A design in progress beside the home page: kept out of search for now.
  robots: { index: false, follow: false },
};

// The Portory home page's sections in the Exhibit look, over a mesh of
// connected dots. The home page itself (/) is unchanged.
export default function LineLandingPage() {
  return <LineLanding />;
}
