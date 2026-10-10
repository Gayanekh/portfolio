import type { Metadata } from "next";
import TemplateGallery from "@/components/gallery/TemplateGallery";

export const metadata: Metadata = {
  title: "Portfolio templates | Portory",
  description: "Browse every Portory template and pick the one that fits your work.",
};

export default function TemplateGalleryPage() {
  return <TemplateGallery />;
}
