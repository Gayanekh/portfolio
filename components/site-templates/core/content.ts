import { plainText } from "./rich-format";
import type { SectionContent, TemplateContent, TemplateDefinition, SectionDefinition } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const strings = (value: unknown): SectionContent =>
  isRecord(value) ? Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string")) : {};

// A section's name in the site menu, kept with its text so it can be renamed
// (it starts as the template's `menu` name).
export const MENU_FIELD = "menu";
// "1" when the section is taken out of the menu (it stays on the page).
export const MENU_HIDDEN_FIELD = "menuHidden";

// A section's starting text, its menu name included.
export const sectionDefaults = (section: Pick<SectionDefinition, "defaults" | "menu">): SectionContent =>
  section.menu ? { ...section.defaults, [MENU_FIELD]: section.menu, [MENU_HIDDEN_FIELD]: "" } : { ...section.defaults };

// The template's starting text.
export const defaultContent = (template: TemplateDefinition): TemplateContent =>
  Object.fromEntries(template.sections.map((section) => [section.id, sectionDefaults(section)]));

// Saved text on top of the defaults: fields added to the template since the
// page was saved start from their default, and unknown ones are dropped.
export const mergeContent = (template: TemplateDefinition, saved: unknown): TemplateContent => {
  const stored = isRecord(saved) ? saved : {};
  return Object.fromEntries(
    template.sections.map((section) => {
      const defaults = sectionDefaults(section);
      const known = Object.entries(strings(stored[section.id])).filter(([field]) => field in defaults);
      return [section.id, { ...defaults, ...Object.fromEntries(known) }];
    }),
  );
};

export const readField = (content: TemplateContent, section: string, field: string) => content[section]?.[field] ?? "";

export const readSiteTitle = (template: TemplateDefinition, content: TemplateContent) =>
  plainText(readField(content, template.siteTitle.section, template.siteTitle.field));

// A section's name in the site menu: as renamed, else the template's.
export const menuName = (content: TemplateContent, section: Pick<SectionDefinition, "id" | "menu">) =>
  plainText(readField(content, section.id, MENU_FIELD)) || section.menu || section.id;

// Whether a section shows in the site menu: it has a menu name and was not
// taken out.
export const inMenu = (content: TemplateContent, section: Pick<SectionDefinition, "id" | "menu">) =>
  Boolean(section.menu) && readField(content, section.id, MENU_HIDDEN_FIELD) !== "1";
