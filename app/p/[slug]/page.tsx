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
    .from("portfolios")
    .select("template_id, published_portfolio_data")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !portfolio?.published_portfolio_data) notFound();

  return (
    <PortfolioTemplate
      templateId={portfolio.template_id}
      data={portfolio.published_portfolio_data as PortfolioData}
    />
  );
}
