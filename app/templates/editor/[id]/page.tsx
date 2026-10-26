import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhoneEditorGate from "@/components/template-editor/PhoneEditorGate";
import TemplateBuilderPageEditor from "@/components/template-editor/TemplateBuilderPageEditor";
import { getSiteTemplate, siteTemplateDemoHref } from "@/components/site-templates/registry";
import TemplateBuilderPage from "@/components/templates/TemplateBuilderPage";
import { templates as earlierTemplates } from "@/components/templates/template-data";

// The earlier templates (Minimal, Bold), edited in their own builder.
const earlierTemplate = (id: string) => earlierTemplates.find((template) => template.id === id);

// The editor for a template: the page editor for a site template (see
// components/site-templates), the earlier builder for Minimal and Bold. On a
// phone a short page comes first (PhoneEditorGate).
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const name = getSiteTemplate(id)?.name ?? earlierTemplate(id)?.name;
  return { title: name ? `Editing ${name} | Portory` : "Portory" };
}

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const earlier = earlierTemplate(id);
  if (earlier) {
    return (
      <PhoneEditorGate id={id} name={earlier.name} demoHref={id === "bold" ? "/demo/bold" : siteTemplateDemoHref(id)}>
        <TemplateBuilderPage requestedTemplate={id} shouldEdit />
      </PhoneEditorGate>
    );
  }
  const template = getSiteTemplate(id);
  if (!template) notFound();
  return (
    <PhoneEditorGate id={id} name={template.name} demoHref={siteTemplateDemoHref(id)}>
      <TemplateBuilderPageEditor backHref="/templates" templateId={id} />
    </PhoneEditorGate>
  );
}
