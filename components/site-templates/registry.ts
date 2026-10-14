import type { TemplateDefinition } from "./core/types";
import { deckTemplate } from "./deck";
import { galleryTemplate } from "./gallery";
import { personaTemplate } from "./persona";
import { productTemplate } from "./product";
import { showcaseTemplate } from "./showcase";
import { starterTemplate } from "./starter";

// Every site template. Each has a demo at /templates/demo/<id> and opens in
// the editor at /templates/editor/<id>.
export const SITE_TEMPLATES: TemplateDefinition[] = [showcaseTemplate, personaTemplate, galleryTemplate, deckTemplate, productTemplate, starterTemplate];

export const getSiteTemplate = (id: string) => SITE_TEMPLATES.find((template) => template.id === id);

export const siteTemplateDemoHref = (id: string) => `/templates/demo/${id}`;
export const siteTemplateEditorHref = (id: string) => `/templates/editor/${id}`;
