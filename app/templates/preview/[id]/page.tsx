import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateDetailPage from "@/components/template-detail/TemplateDetailPage";
import { TEMPLATE_DETAILS, getTemplateDetail } from "@/components/template-detail/template-registry";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return TEMPLATE_DETAILS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const template = getTemplateDetail((await params).id);
  return { title: template ? `${template.name} template | Portory` : "Template | Portory" };
}

export default async function TemplatePreviewPage({ params }: { params: Params }) {
  const template = getTemplateDetail((await params).id);
  if (!template) notFound();
  return <TemplateDetailPage id={template.id} />;
}
