import type { Metadata } from "next";
import Catalogue from "@/components/landing-next/Catalogue";
import { LANDING_PAGE } from "@/components/landing-next/content";
import Shell from "@/components/landing-next/Shell";

export const metadata: Metadata = {
  title: "Portfolio templates | Portory",
  description: "Every Portory template, live. Preview any of them, or open the one that fits in the editor.",
  // Part of the new design in progress, beside /templates: kept out of search for now.
  robots: { index: false, follow: false },
};

// The new world's templates page, in the "Exhibit" look of /new-landing.
// The Portory home page keeps its own /templates.
export default function NewLandingTemplatesPage() {
  return (
    <Shell home={LANDING_PAGE}>
      <Catalogue />
    </Shell>
  );
}
