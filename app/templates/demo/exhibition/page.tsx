import type { Metadata } from "next";
import Exhibition from "@/components/exhibition/Exhibition";

export const metadata: Metadata = {
  title: "Ilse Varga, Afterlight",
  description: "Exhibition: a template example for an artist's show.",
  // A template example: kept out of search.
  robots: { index: false, follow: false },
};

// Exhibition: a visual template example, made from the /new-landing and
// /line-landing designs (see components/exhibition). Its demo lives with the
// other templates' demos (the user asked); /exhibition redirects here.
export default function ExhibitionPage() {
  return <Exhibition />;
}
