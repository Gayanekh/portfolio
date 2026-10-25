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

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
}
