"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import { SectionFrame } from "./Arranged";
import { defaultContent } from "./content";
import { definitionOf, sectionOrder, type PageLayout } from "./layout";
import { SectionScope, TemplateProvider } from "./context";
import StackItem from "./StackItem";
import { glideTo } from "./scroll";
import type { EditHooks, TemplateContent, TemplateDefinition } from "./types";

export interface TemplateRendererProps {
  template: TemplateDefinition;
  // Without it, the template's starting text.
  content?: TemplateContent;
  palette?: string;
  font?: string;
  // The editor's hooks; without them the page is read-only.
  edit?: EditHooks;
  // Sections reordered and copied, blocks moved and added (see ./layout).
  layout?: PageLayout;
  // Show only this section (working section by section).
  only?: string;
  // A menu link was followed. Without it the page scrolls to the section.
  onNavigate?: (section: string) => void;
  // The menu item to underline. Without it, the last one followed.
  activeSection?: string;
}

const Passthrough = ({ children }: { children: ReactNode }) => <>{children}</>;

// Any site template as a page. The template's own look sits on the outer
// layer and the chosen palette and font pack on the inner one, so the choice
// wins and "Original" falls back to the template's. Layouts respond to the
// page's own width (container queries), so the editor's phone view is real.
export default function TemplateRenderer({ template, content, palette, font, edit, layout, only, onNavigate, activeSection }: TemplateRendererProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [followed, setFollowed] = useState(() => template.sections.find((section) => section.menu)?.id);
  const text = useMemo(() => content ?? defaultContent(template), [content, template]);
  const Provider = template.Provider ?? Passthrough;

  const navigate = (section: string) => {
    setFollowed(section);
    if (onNavigate) return onNavigate(section);
    const target = rootRef.current?.querySelector<HTMLElement>(`[data-stack-anchor="${section}"], [data-section="${section}"]`);
    if (target) glideTo(target);
  };
  // What every block reads (a locked section gets it without the editor's hooks).
  const state = { template, content: text, edit, layout, current: activeSection ?? followed, navigate };

  // The sections in the page's order, copies included, each with its instance id.
  const sections = sectionOrder(template, layout)
    .filter((instance) => !only || instance === only)
    .flatMap((instance) => {
      const definition = definitionOf(template, instance);
      return definition ? [{ ...definition, id: instance }] : [];
    });

  return (
    <div data-template-font className={cn(themeFontVariables, template.theme, "min-h-full")}>
      <div ref={rootRef} data-site-template className={cn(findPalette(palette).className, findFontPack(font).className, "@container relative min-h-full bg-card font-sans text-foreground")}>
        <TemplateProvider value={state}>
          <Provider>
            {sections.map(({ id, Component, stack }, index) => {
              const frame = (
                <SectionFrame instance={id}>
                  <Component />
                </SectionFrame>
              );
              const section = (
                <SectionScope key={id} id={id}>
                  {edit
                    ? edit.renderSection(
                        id,
                        // A locked section (header, footer) shows as visitors see it.
                        edit.locked?.(id) ? <TemplateProvider value={{ ...state, edit: undefined }}>{frame}</TemplateProvider> : frame,
                      )
                    : frame}
                </SectionScope>
              );
              if (template.scroll !== "stack" || stack === false || sections.length === 1) return section;
              return (
                <StackItem key={id} id={id} last={index === sections.length - 1}>
                  {section}
                </StackItem>
              );
            })}
          </Provider>
        </TemplateProvider>
      </div>
    </div>
  );
}
