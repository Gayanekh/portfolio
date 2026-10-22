"use client";

import TemplateRenderer from "./core/TemplateRenderer";
import { mergePageContent, readLayout } from "./core/layout";
import { getSiteTemplate } from "./registry";
import type { SitePortfolioData } from "@/lib/portfolios";

// A published site template at /p/<slug>: the page as saved in the editor,
// read-only. The template is looked up here, on the client, because its
// sections are components and cannot be passed down from the server.
export default function SitePortfolio({ templateId, data }: { templateId: string; data: SitePortfolioData }) {
  const template = getSiteTemplate(templateId);
  if (!template) return null;
  const layout = readLayout(data.layout);
  return (
    <div className="min-h-screen">
      <TemplateRenderer template={template} content={mergePageContent(template, data.content, layout)} layout={layout} palette={data.palette} font={data.font} />
    </div>
  );
}
