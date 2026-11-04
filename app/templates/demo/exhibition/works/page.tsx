import type { Metadata } from "next";
import WorksGallery from "@/components/exhibition/WorksGallery";

export const metadata: Metadata = {
  title: "The works · Ilse Varga, Afterlight",
  description: "Exhibition: every work in the show, as an endless gallery.",
  // A template example: kept out of search.
  robots: { index: false, follow: false },
};

// The works page of the Exhibition template, opened from "Explore the works".
export default function ExhibitionWorksPage() {
  return <WorksGallery />;
}
