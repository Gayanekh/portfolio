"use client";

import { createContext, useContext, type ReactNode } from "react";
import { readField } from "./content";
import type { EditHooks, TemplateContent, TemplateDefinition } from "./types";

interface TemplateState {
  template: TemplateDefinition;
  content: TemplateContent;
  edit?: EditHooks;
  // The menu item to underline.
  current?: string;
  // Follow a menu link to a section.
  navigate: (section: string) => void;
}

const TemplateContext = createContext<TemplateState | null>(null);
const SectionContext = createContext<string | null>(null);

export const TemplateProvider = TemplateContext.Provider;

export function useTemplate() {
  const state = useContext(TemplateContext);
  if (!state) throw new Error("Site template blocks must be rendered inside TemplateRenderer.");
  return state;
}

// Gives the blocks inside a section its id, so `field` props find its text.
export function SectionScope({ id, children }: { id: string; children: ReactNode }) {
  return <SectionContext.Provider value={id}>{children}</SectionContext.Provider>;
}

export function useSectionId() {
  const id = useContext(SectionContext);
  if (!id) throw new Error("Site template blocks must be rendered inside a section.");
  return id;
}

// A field of the current section: its text, and what to render for it (an
// editable box while editing, the text otherwise).
export function useField(field: string) {
  const { content, edit } = useTemplate();
  const section = useSectionId();
  const value = readField(content, section, field);
  return { value, editing: Boolean(edit), node: edit ? edit.renderText(section, field, value) : value };
}
