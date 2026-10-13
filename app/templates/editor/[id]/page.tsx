import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateBuilderPageEditor from "@/components/template-editor/TemplateBuilderPageEditor";
import { getSiteTemplate } from "@/components/site-templates/registry";

// The page editor for a site template (see components/site-templates).
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const template = getSiteTemplate(id);
  return { title: template ? `Editing ${template.name} | Portory` : "Portory" };
}

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getSiteTemplate(id)) notFound();
  return <TemplateBuilderPageEditor backHref="/templates/gallery" templateId={id} />;
}
