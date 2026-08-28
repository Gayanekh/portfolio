import type { PortfolioData } from "@/context/PortfolioContext";
import type { SupabaseClient } from "@supabase/supabase-js";

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

export async function getUniqueSlug(
  supabase: SupabaseClient,
  baseSlug: string,
  currentId?: string,
) {
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    let query = supabase
      .from("portfolios")
      .select("id")
      .eq("slug", candidate)
      .limit(1);

    if (currentId) query = query.neq("id", currentId);

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return candidate;

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export function isPortfolioData(value: unknown): value is PortfolioData {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<PortfolioData>;

  return (
    typeof data.name === "string" &&
    typeof data.role === "string" &&
    typeof data.availableYear === "string" &&
    typeof data.email === "string" &&
    typeof data.avatar === "string" &&
    typeof data.aboutHeading === "string" &&
    typeof data.aboutBody === "string" &&
    Array.isArray(data.services) &&
    Array.isArray(data.skills) &&
    Array.isArray(data.projects) &&
    data.navigation !== undefined &&
    typeof data.showScrollProgress === "boolean"
  );
}
