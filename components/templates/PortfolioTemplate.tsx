import MinimalPreview from "@/components/templates/MinimalPreview";
import BoldPreview from "@/components/templates/BoldPreview";
import type { PortfolioData } from "@/context/PortfolioContext";

interface PortfolioTemplateProps {
  templateId: string;
  data: PortfolioData;
}

export default function PortfolioTemplate({
  templateId,
  data,
}: PortfolioTemplateProps) {
  if (templateId === "bold") return <BoldPreview data={data} />;
  return <MinimalPreview data={data} />;
}
