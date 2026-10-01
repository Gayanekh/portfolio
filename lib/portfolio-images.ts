import { createClient } from "@/lib/supabase/client";

// Must match the portfolio-images bucket (allowed MIME types) and its upload
// policy (path {user id}/{uuid}.{lowercase extension}).
const PORTFOLIO_IMAGES_BUCKET = "portfolio-images";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const ACCEPTED_IMAGE_TYPES = Object.keys(EXTENSIONS).join(",");

export function validatePortfolioImage(file: File): string | null {
  if (!EXTENSIONS[file.type]) {
    return "Use a JPEG, PNG, WebP or GIF image.";
  }
  return null;
}

// Uploads the original file to Storage and returns its public URL.
export async function uploadPortfolioImage(file: File): Promise<string> {
  const extension = EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Use a JPEG, PNG, WebP or GIF image.");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Your session has expired. Sign in again to upload images.");
  }

  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const storage = supabase.storage.from(PORTFOLIO_IMAGES_BUCKET);
  const { error: uploadError } = await storage.upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  return storage.getPublicUrl(path).data.publicUrl;
}
