import { plainText } from "./rich-format";
import type { SectionContent, TemplateContent, TemplateDefinition } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const strings = (value: unknown): SectionContent =>
  isRecord(value) ? Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string")) : {};

// The template's starting text.
export const defaultContent = (template: TemplateDefinition): TemplateContent =>
  Object.fromEntries(template.sections.map((section) => [section.id, { ...section.defaults }]));

// Saved text on top of the defaults: fields added to the template since the
// page was saved start from their default, and unknown ones are dropped.
export const mergeContent = (template: TemplateDefinition, saved: unknown): TemplateContent => {
  const stored = isRecord(saved) ? saved : {};
  return Object.fromEntries(
    template.sections.map((section) => {
      const known = Object.entries(strings(stored[section.id])).filter(([field]) => field in section.defaults);
      return [section.id, { ...section.defaults, ...Object.fromEntries(known) }];
    }),
  );
};

export const readField = (content: TemplateContent, section: string, field: string) => content[section]?.[field] ?? "";

export const readSiteTitle = (template: TemplateDefinition, content: TemplateContent) =>
  plainText(readField(content, template.siteTitle.section, template.siteTitle.field));
