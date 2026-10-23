import type { Metadata } from "next";
import TemplateGallery from "@/components/gallery/TemplateGallery";
import TemplateBuilderPage from "@/components/templates/TemplateBuilderPage";

export const metadata: Metadata = {
  title: "Portfolio templates | Portory",
  description: "Browse every Portory template and pick the one that fits your work.",
};

interface TemplatesPageProps {
  searchParams: Promise<{ template?: string; edit?: string }>;
}

// /templates shows the template gallery; with a template chosen
// (?template=…, and &edit=1 to open the editor) it shows the builder.
export default async function TemplatesPage({
  searchParams,
}: TemplatesPageProps) {
  const params = await searchParams;
  if (!params.template) return <TemplateGallery />;

  return (
    <TemplateBuilderPage
      requestedTemplate={params.template}
      shouldEdit={params.edit === "1"}
    />
  );
}
