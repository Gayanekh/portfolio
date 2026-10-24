import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateDemo from "@/components/site-templates/TemplateDemo";
import { SITE_TEMPLATES, getSiteTemplate } from "@/components/site-templates/registry";
import MinimalDemo from "@/components/templates/MinimalDemo";

type Params = Promise<{ id: string }>;

// Minimal, an earlier template, has its demo here too.
const MINIMAL = "minimal";

export function generateStaticParams() {
  return [...SITE_TEMPLATES.map((template) => ({ id: template.id })), { id: MINIMAL }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const name = id === MINIMAL ? "Minimal" : getSiteTemplate(id)?.name;
  return { title: name ? `${name} demo | Portory` : "Template demo | Portory" };
}

// A template's demo: the real template with its own content.
export default async function TemplateDemoPage({ params }: { params: Params }) {
  const { id } = await params;
  if (id === MINIMAL) return <MinimalDemo />;
  if (!getSiteTemplate(id)) notFound();
  return <TemplateDemo id={id} />;
}
