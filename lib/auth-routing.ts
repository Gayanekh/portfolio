const allowedTemplates = new Set(["minimal", "bold"]);

export function getSafeNext(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/templates";
  }

  try {
    const url = new URL(value, "http://portory.internal");
    if (url.origin !== "http://portory.internal") return "/templates";
    // Back into the templates and editors, or to the account page.
    if (!url.pathname.startsWith("/templates") && url.pathname !== "/account") return "/templates";
    const template = url.searchParams.get("template");
    if (template && !allowedTemplates.has(template)) return "/templates";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/templates";
  }
}

export function templateEditorNext(templateId: string) {
  const template = allowedTemplates.has(templateId) ? templateId : "minimal";
  return `/templates/editor/${template}`;
}

// The colours of a person's initials disc when they have no photo (a Google sign-in's is blue, below): each
// person gets one of these, picked by their name, so they always have the same one. White initials
// read on all of them. Whole class names, as Tailwind needs them.
const AVATAR_COLORS = ["bg-[#1a73e8]", "bg-[#188038]", "bg-[#8430ce]", "bg-[#d93025]", "bg-[#0b8793]", "bg-[#c25e00]", "bg-[#c2185b]", "bg-[#3949ab]"];
export function avatarColor(seed: string) {
  let hash = 0;
  for (const char of seed.trim().toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// A Google sign-in without a photo of its own keeps Google's blue behind its initials (as many sites do); Google
// hands such an account a stock picture, which is not a photo, so `realAvatar` leaves it out.
export const GOOGLE_BLUE = "bg-[#1a73e8]";
export function realAvatar(url: string | null | undefined) {
  return url && !url.includes("default-user") ? url : null;
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
}
