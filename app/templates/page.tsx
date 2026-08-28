import TemplateBuilderPage from "@/components/templates/TemplateBuilderPage";

interface TemplatesPageProps {
  searchParams: Promise<{ template?: string; edit?: string }>;
}

export default async function TemplatesPage({
  searchParams,
}: TemplatesPageProps) {
  const params = await searchParams;
  return (
    <TemplateBuilderPage
      requestedTemplate={params.template}
      shouldEdit={params.edit === "1"}
    />
  );
}
