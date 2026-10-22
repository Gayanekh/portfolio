import { notFound } from "next/navigation";
import PortfolioTemplate from "@/components/templates/PortfolioTemplate";
import SitePortfolio from "@/components/site-templates/SitePortfolio";
import { BUILDER_TEMPLATE_IDS, isSitePortfolioData } from "@/lib/portfolios";
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
      published_portfolio_data: unknown;
    }>();

  if (error || !portfolio?.published_portfolio_data) notFound();

  const { template_id: templateId, published_portfolio_data: data } = portfolio;

  // Minimal and Bold, from the template builder.
  if (BUILDER_TEMPLATE_IDS.includes(templateId)) {
    return <PortfolioTemplate templateId={templateId} data={data as PortfolioData} />;
  }

  // A site template, from the site template editor.
  if (!isSitePortfolioData(data)) notFound();
  return <SitePortfolio templateId={templateId} data={data} />;
}
