import type { PortfolioData } from "@/context/PortfolioContext";
import type { SupabaseClient } from "@supabase/supabase-js";
import { mergeContent, readSiteTitle } from "@/components/site-templates/core/content";
import { getSiteTemplate } from "@/components/site-templates/registry";

export type PortfolioRecord = {
  id: string;
  user_id: string;
  slug: string;
  template_id: string;
  portfolio_data: PortfolioData;
  published_portfolio_data: PortfolioData | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export function createSlug(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "portfolio";
}

export async function getUniqueSlug(supabase: SupabaseClient, baseSlug: string) {
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const { data: available, error } = await supabase.rpc("is_slug_available", {
      p_slug: candidate,
    });
    if (error) throw error;
    if (available) return candidate;

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

// Image fields hold "" or an https:// URL (Supabase Storage). data:image/
// values are legacy Base64 images, still accepted until they are migrated.
// Anything else, such as blob: URLs, is rejected.
function isImageValue(value: unknown) {
  return (
    typeof value === "string" &&
    (value === "" ||
      value.startsWith("https://") ||
      value.startsWith("data:image/"))
  );
}

function hasValidProjectImages(projects: unknown[]) {
  return projects.every((project) => {
    if (!project || typeof project !== "object") return false;
    const image = (project as { image?: unknown }).image;
    return image === undefined || isImageValue(image);
  });
}

// A site template's page as the editor saves it: the text by section and
// field, and the chosen palette and font pack.
export interface SitePortfolioData {
  // The page's name in the editor, apart from its site title.
  name?: string;
  content: Record<string, Record<string, string>>;
  palette: string;
  font: string;
  // The page's arrangement in the editor (see components/site-templates/core/layout).
  layout?: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function isSitePortfolioData(value: unknown): value is SitePortfolioData {
  if (!isRecord(value) || !isRecord(value.content)) return false;
  return (
    (value.name === undefined || typeof value.name === "string") &&
    typeof value.palette === "string" &&
    typeof value.font === "string" &&
    Object.values(value.content).every(
      (section) => isRecord(section) && Object.values(section).every((field) => typeof field === "string"),
    )
  );
}

// The templates the template builder edits (PortfolioData); every other
// template id is a site template (SitePortfolioData).
export const BUILDER_TEMPLATE_IDS = ["minimal", "bold"];

// Checks a save or publish request. Returns the name its address starts
// from (a site template's page name, else its site title), or null when the
// template or the data is not valid.
export function readPortfolioName(templateId: unknown, portfolioData: unknown): string | null {
  if (typeof templateId !== "string") return null;
  if (BUILDER_TEMPLATE_IDS.includes(templateId)) {
    return isPortfolioData(portfolioData) ? portfolioData.name : null;
  }
  const template = getSiteTemplate(templateId);
  if (!template || !isSitePortfolioData(portfolioData)) return null;
  return portfolioData.name?.trim() || readSiteTitle(template,mergeContent(template, portfolioData.content));
}

export function isPortfolioData(value: unknown): value is PortfolioData {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<PortfolioData>;

  return (
    typeof data.name === "string" &&
    typeof data.role === "string" &&
    typeof data.availableYear === "string" &&
    typeof data.email === "string" &&
    isImageValue(data.avatar) &&
    typeof data.aboutHeading === "string" &&
    typeof data.aboutBody === "string" &&
    Array.isArray(data.services) &&
    Array.isArray(data.skills) &&
    Array.isArray(data.projects) &&
    hasValidProjectImages(data.projects) &&
    data.navigation !== undefined &&
    typeof data.showScrollProgress === "boolean"
  );
}
