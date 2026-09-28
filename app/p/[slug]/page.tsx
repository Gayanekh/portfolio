import { notFound } from "next/navigation";
import PortfolioTemplate from "@/components/templates/PortfolioTemplate";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioData } from "@/context/PortfolioContext";

interface PublicPortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicPortfolioPage({
  params,
}: PublicPortfolioPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: portfolio, error } = await supabase
    .rpc("get_published_portfolio", { p_slug: slug })
    .maybeSingle<{
      template_id: string;
      published_portfolio_data: PortfolioData | null;
    }>();

  if (error || !portfolio?.published_portfolio_data) notFound();

  return (
    <PortfolioTemplate
      templateId={portfolio.template_id}
      data={portfolio.published_portfolio_data as PortfolioData}
    />
  );
}
