import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateDemo from "@/components/site-templates/TemplateDemo";
import { SITE_TEMPLATES, getSiteTemplate } from "@/components/site-templates/registry";

type Params = Promise<{ id: string }>;

// Minimal's demo keeps its address: it shows the Signature site template,
// which replaced the earlier Minimal for new pages.
const ALIASES: Record<string, string> = { minimal: "signature" };
const resolve = (id: string) => ALIASES[id] ?? id;

export function generateStaticParams() {
  return [...SITE_TEMPLATES.map((template) => ({ id: template.id })), ...Object.keys(ALIASES).map((id) => ({ id }))];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const name = getSiteTemplate(resolve(id))?.name;
  return { title: name ? `${name} demo | Portory` : "Template demo | Portory" };
}

// A template's demo: the real template with its own content.
export default async function TemplateDemoPage({ params }: { params: Params }) {
  const { id } = await params;
  if (!getSiteTemplate(resolve(id))) notFound();
  return <TemplateDemo id={resolve(id)} />;
}
