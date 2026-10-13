import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateDemo from "@/components/site-templates/TemplateDemo";
import { SITE_TEMPLATES, getSiteTemplate } from "@/components/site-templates/registry";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return SITE_TEMPLATES.map((template) => ({ id: template.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const template = getSiteTemplate((await params).id);
  return { title: template ? `${template.name} demo | Portory` : "Template demo | Portory" };
}

// A site template's demo: the real template with its own content.
export default async function TemplateDemoPage({ params }: { params: Params }) {
  const { id } = await params;
  if (!getSiteTemplate(id)) notFound();
  return <TemplateDemo id={id} />;
}
