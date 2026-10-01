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
