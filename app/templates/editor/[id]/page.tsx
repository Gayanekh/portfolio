import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateBuilderPageEditor from "@/components/template-editor/TemplateBuilderPageEditor";

// TEST — the page editor for the Product example template. Delete this route
// together with the Product template when testing is done.
export const metadata: Metadata = { title: "Editing Cypress and Tea Tree | Portory" };

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "product") notFound();
  return <TemplateBuilderPageEditor backHref="/templates/gallery" />;
}
