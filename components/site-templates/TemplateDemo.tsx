"use client";

import DemoControls from "./DemoControls";
import TemplateRenderer from "./core/TemplateRenderer";
import { getSiteTemplate, siteTemplateEditorHref } from "./registry";

// A template's demo: the real template, full size with its own content and
// responsive layout, and two floating controls (DemoControls): back to the
// gallery, and Use This Template, which opens the same template in the editor.
export default function TemplateDemo({ id }: { id: string }) {
  const template = getSiteTemplate(id);
  if (!template) return null;

  return (
    <div className="min-h-screen">
      <TemplateRenderer template={template} />
      <DemoControls editorHref={siteTemplateEditorHref(template.id)} />
    </div>
  );
}
