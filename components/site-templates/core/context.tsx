"use client";

import { createContext, createElement, useContext, type ReactNode } from "react";
import { Moved } from "./Arranged";
import { readField } from "./content";
import RichText from "./RichText";
import { isRich, plainText } from "./rich-format";
import type { PageLayout } from "./layout";
import type { EditHooks, TemplateContent, TemplateDefinition } from "./types";

interface TemplateState {
  template: TemplateDefinition;
  content: TemplateContent;
  edit?: EditHooks;
  // Sections reordered and copied, blocks moved and added (see ./layout).
  layout?: PageLayout;
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

// Where a block of the current section was moved on the grid, if it was.
export function useMoved(field: string) {
  const { layout } = useTemplate();
  const section = useSectionId();
  return layout?.moved?.[`${section}.${field}`];
}

// An image field's settings from the image panel (focal point, link,
// description, file name), if it has any.
export function useMediaMeta(field: string) {
  const { layout } = useTemplate();
  const section = useSectionId();
  return layout?.media?.[`${section}.${field}`];
}

// A field of the current section: its words (without formatting, for
// labels, links and titles), and what to render for it (an editable box while
// editing, the formatted text otherwise), in its moved place.
export function useField(field: string) {
  const { content, edit } = useTemplate();
  const section = useSectionId();
  const spot = useMoved(field);
  const raw = readField(content, section, field);
  const inner = edit ? edit.renderText(section, field, raw) : isRich(raw) ? createElement(RichText, { value: raw, inline: true }) : raw;
  return { value: plainText(raw), editing: Boolean(edit), node: spot ? createElement(Moved, { spot }, inner) : inner };
}
