import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
// (?template=…) it shows the builder; its editor lives at
// /templates/editor/<template>, where ?template=…&edit=1 now leads.
export default async function TemplatesPage({
  searchParams,
}: TemplatesPageProps) {
  const params = await searchParams;
  if (!params.template) return <TemplateGallery />;
  if (params.edit === "1") redirect(`/templates/editor/${encodeURIComponent(params.template)}`);

  return (
    <TemplateBuilderPage
      requestedTemplate={params.template}
      shouldEdit={params.edit === "1"}
    />
  );
}
