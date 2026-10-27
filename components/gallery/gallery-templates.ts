// Mock template list for the templates gallery. The photos are free Unsplash
// images used as placeholders until the real templates have their own
// screenshots; replace `image` (and the names) when they do.

export type GalleryStyle = "image" | "text" | "case";

export interface GalleryTemplate {
  id: string;
  name: string;
  style: GalleryStyle;
  bestFor: string;
  // Placeholder photo. Not needed for a live template, which shows itself.
  image?: string;
  // A real template from the template registry (components/template-detail).
  live?: boolean;
  // Where the card leads, if not the template's detail page.
  href?: string;
}

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1100`;

export const GALLERY_STYLES: { id: GalleryStyle | "all"; label: string }[] = [
  { id: "all", label: "All templates" },
  { id: "image", label: "Image-led" },
  { id: "text", label: "Text-led" },
  { id: "case", label: "Case studies" },
];

export const GALLERY_TEMPLATES: GalleryTemplate[] = [
  // Site templates (components/site-templates) open their demo: the real
  // template, with Use This Template to open it in the editor.
  { id: "nocturne", name: "Nocturne", style: "image", bestFor: "UI/UX designers, developers, photographers and graphic designers", live: true, href: "/templates/demo/nocturne" },
  { id: "showcase", name: "Showcase", style: "image", bestFor: "Photographers, UI/UX and graphic designers", live: true, href: "/templates/demo/showcase" },
  // IN PROGRESS — built step by step from a design reference.
  { id: "persona", name: "Persona", style: "image", bestFor: "Brand and product designers", live: true, href: "/templates/demo/persona" },
  { id: "gallery", name: "Gallery", style: "image", bestFor: "Photographers and artists", live: true, href: "/templates/demo/gallery" },
  { id: "deck", name: "Deck", style: "image", bestFor: "Product and brand designers, studios", live: true, href: "/templates/demo/deck" },
  // Minimal: the Signature site template, its demo still at /templates/demo/minimal.
  // The earlier Minimal (components/templates) only renders pages published with it.
  { id: "signature", name: "Minimal", style: "image", bestFor: "Web, brand and graphic designers", live: true, href: "/templates/demo/minimal" },
  // TEST TEMPLATE — delete after testing (see components/site-templates/product).
  { id: "product", name: "Product", style: "image", bestFor: "Makers and small shops", live: true, href: "/templates/demo/product" },
  { id: "atelier", name: "Atelier", style: "image", bestFor: "Designers and makers", image: photo("photo-1487014679447-9f8336841d58") },
  { id: "ledger", name: "Ledger", style: "text", bestFor: "Teachers and consultants", image: photo("photo-1502945015378-0e284ca1a5be") },
  { id: "chapter", name: "Chapter", style: "case", bestFor: "Researchers and writers", image: photo("photo-1522199755839-a2bacb67c546") },
  { id: "studio", name: "Studio", style: "image", bestFor: "Architects and interior designers", image: photo("photo-1467232004584-a241de8bcf5d") },
  { id: "brief", name: "Brief", style: "case", bestFor: "Product and UX people", image: photo("photo-1642132652860-471b4228023e") },
  { id: "signal", name: "Signal", style: "case", bestFor: "Engineers and developers", image: photo("photo-1634084462412-b54873c0a56d") },
  { id: "frame", name: "Frame", style: "image", bestFor: "Filmmakers and editors", image: photo("photo-1648134859177-66e35b61e106") },
  { id: "mentor", name: "Mentor", style: "text", bestFor: "Coaches and trainers", image: photo("photo-1530435460869-d13625c69bbf") },
  { id: "folio", name: "Folio", style: "text", bestFor: "Students and graduates", image: photo("photo-1646193186138-148d07f84b13") },
  { id: "canvas", name: "Canvas", style: "image", bestFor: "Illustrators and painters", image: photo("photo-1649442746245-f51f4b76963f") },
  { id: "practice", name: "Practice", style: "text", bestFor: "Healthcare and legal professionals", image: photo("photo-1627896181038-a0cf83c86008") },
];

// The templates shown to visitors (the templates page and the landing): those
// with a demo to open. The others (the placeholders) are hidden;
// the old template detail screen they led to is no longer used.
export const SHOWN_TEMPLATES = GALLERY_TEMPLATES.filter((template): template is GalleryTemplate & { href: string } => Boolean(template.href));
