import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateBuilderPageEditor from "@/components/template-editor/TemplateBuilderPageEditor";
import { getSiteTemplate } from "@/components/site-templates/registry";
import TemplateBuilderPage from "@/components/templates/TemplateBuilderPage";
import { templates as earlierTemplates } from "@/components/templates/template-data";

// The earlier templates (Minimal, Bold), edited in their own builder.
const earlierTemplate = (id: string) => earlierTemplates.find((template) => template.id === id);

// The editor for a template: the page editor for a site template (see
// components/site-templates), the earlier builder for Minimal and Bold.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const name = getSiteTemplate(id)?.name ?? earlierTemplate(id)?.name;
  return { title: name ? `Editing ${name} | Portory` : "Portory" };
}

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (earlierTemplate(id)) return <TemplateBuilderPage requestedTemplate={id} shouldEdit />;
  if (!getSiteTemplate(id)) notFound();
  return <TemplateBuilderPageEditor backHref="/templates" templateId={id} />;
}
