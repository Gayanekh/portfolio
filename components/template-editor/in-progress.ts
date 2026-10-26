// What the editor itself can't do yet. Its tools for these show greyed out
// with "Coming soon", and the editor's "In progress" notice lists them, so a
// gap is never mistaken for a bug. Remove an entry when its tool ships.
export const EDITOR_NOT_READY = [
  { tool: "Edit section", text: "Editing a whole section's settings in one panel. For now, edit its text and images on the page." },
  { tool: "Layouts", text: "Switching a section to another layout." },
] as const;

// A coming-soon tool was clicked: the editor shows a short notice (see
// TemplateBuilderPageEditor).
export const COMING_SOON_EVENT = "portory:coming-soon";
export const announceComingSoon = (tool: string) => window.dispatchEvent(new CustomEvent(COMING_SOON_EVENT, { detail: tool }));
