import type { ComponentType, ReactNode } from "react";

// A site template is a list of sections. Each section is a component built
// from the blocks in ./blocks, plus the starting text for its editable fields.
// The editor, the palettes, the font packs and the menu all work from this.

// A section's text, by field name ("title", "text", ...).
export type SectionContent = Record<string, string>;
// A whole page's text, by section id. This is what gets saved.
export type TemplateContent = Record<string, SectionContent>;

// A field shown in the editor's content panel for its section.
export interface FieldDefinition {
  name: string;
  label: string;
  multiline?: boolean;
}

export interface SectionDefinition {
  // Unique within the template; also the link target of its menu item.
  id: string;
  // Its name in the editor.
  label: string;
  // Its name in the site menu. Without it the section is not in the menu.
  menu?: string;
  // Its markup. It reads its own text with the blocks' `field` props.
  Component: ComponentType;
  // The starting text of its fields.
  defaults: SectionContent;
  // The fields the editor's content panel offers (all text stays editable
  // in place either way).
  fields?: FieldDefinition[];
  // On a stacking page, false keeps this section out of the stack (a header).
  stack?: boolean;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  sections: SectionDefinition[];
  // The field holding the site's name (the editor's title, the page's link).
  siteTitle: { section: string; field: string };
  // The template's own look before a palette or font pack is picked, as CSS
  // variables: --font-display, and any colour token such as --card.
  theme?: string;
  // How the page scrolls: "stack" keeps each section in place while the next
  // one slides over it.
  scroll?: "normal" | "stack";
  // State shared by several sections, such as a cart.
  Provider?: ComponentType<{ children: ReactNode }>;
}

// How the editor makes a page editable. Without them the page is read-only.
export interface EditHooks {
  renderText: (section: string, field: string, value: string) => ReactNode;
  renderSection: (section: string, children: ReactNode) => ReactNode;
}

// Typing helper for template files.
export const defineTemplate = (template: TemplateDefinition) => template;
