"use client";

import { createContext, useContext, type ReactNode } from "react";

// What the editor's canvas shares with its blocks and sections while editing:
// which block is selected, which text is being typed into, and which section
// a block is being dragged in (that section shows the grid).

export interface CanvasState {
  selected: string | null;
  select: (id: string | null) => void;
  typing: string | null;
  setTyping: (id: string | null) => void;
  dragging: string | null;
  setDragging: (section: string | null) => void;
  // The block whose panel (the image panel) is open: its toolbar hides meanwhile.
  panelFor: string | null;
}

// The editor's own type for controls drawn inside the page (toolbars, menus,
// tags, section controls). They sit inside the template's text, so without
// this they would take its font, letter spacing, weight and case. Inter Tight
// is loaded with the theme fonts (themeFontVariables), so it is always there.
// `editorFont` is the font alone, for small labels that set their own case
// and spacing; `editorUi` also resets the rest, for toolbars, menus and panels.
export const editorFont = "[font-family:var(--tf-inter-tight),ui-sans-serif,system-ui,sans-serif]";
export const editorUi = `${editorFont} text-left normal-case not-italic font-normal leading-normal tracking-normal [word-spacing:normal] [text-shadow:none]`;

const CanvasContext = createContext<CanvasState | null>(null);

export function CanvasProvider({ value, children }: { value: CanvasState; children: ReactNode }) {
  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export function useCanvas() {
  const state = useContext(CanvasContext);
  if (!state) throw new Error("Fluid editor parts must be rendered inside CanvasProvider.");
  return state;
}

// The grid's cell size on the page an element is in: 24 columns over 92% of
// the page's width, rows of 24px (see GRID in site-templates/core/layout).
export function gridCell(element: Element) {
  const page = element.closest("[data-site-template]");
  const width = page?.getBoundingClientRect().width ?? window.innerWidth;
  return { col: (width * 0.92) / 24, row: 24 };
}
