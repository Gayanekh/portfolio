import { notFound } from "next/navigation";
import TemplateFrame from "@/components/template-detail/TemplateFrame";
import { isLiveTemplate } from "@/components/template-detail/template-registry";

// The bare template, shown inside the detail page's preview frame.
export const metadata = { robots: { index: false } };

export default async function TemplateFramePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isLiveTemplate(id)) notFound();
  return <TemplateFrame id={id} />;
}
