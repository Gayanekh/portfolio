// Mock template list for the templates gallery. The photos are free Unsplash
// images used as placeholders until the real templates have their own
// screenshots; replace `image` (and the names) when they do.

export type GalleryStyle = "image" | "text" | "case";

// What kind of website a template makes. Portory is a platform for many kinds
// of sites, not only portfolios; a category is only shown once it has a
// template to browse.
export type GalleryCategory = "portfolio" | "business" | "agency" | "photography" | "art" | "personal" | "landing" | "events" | "other";

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "portfolio", label: "Portfolio" },
  { id: "business", label: "Business" },
  { id: "agency", label: "Agency & Studio" },
  { id: "photography", label: "Photography" },
  { id: "art", label: "Art & Creative" },
  { id: "personal", label: "Personal" },
  { id: "landing", label: "Landing pages" },
  { id: "events", label: "Events" },
  { id: "other", label: "Other" },
];

export const categoryLabel = (id: GalleryCategory) => GALLERY_CATEGORIES.find((category) => category.id === id)?.label ?? id;

export interface GalleryTemplate {
  id: string;
  name: string;
  style: GalleryStyle;
  category: GalleryCategory;
  bestFor: string;
  // The landing page's cover picture of the site (public/images/landing-covers),
  // shown in place of a live preview (the user asked for the landing's covers).
  cover?: string;
  // For a template the landing shows without a cover picture: the screenshot
  // its cover is built from (other-landing/Cover), as on the landing.
  screen?: string;
  // For a template still being built: a note, shown as an "In progress" tag.
  // Kept here (not read from the site templates' registry) so the gallery does
  // not load every template's code.
  inProgress?: string;
  // A cover shown whole (not cropped) on this colour, for a tall picture.
  coverGround?: string;
  // With coverGround: set framed on it (plain, with a soft shadow) instead of blended.
  coverFrame?: boolean;
  // Where a cropped cover is held (object-position), for a tall picture.
  coverFocus?: string;
  // Placeholder photo. Not needed for a live template, which shows itself.
  image?: string;
  // A real template from the template registry (components/template-detail).
  live?: boolean;
  // Where the card leads, if not the template's detail page.
  href?: string;
  // False for a template example that has no editor yet (no Use template).
  editable?: boolean;
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
  { id: "nocturne", name: "Nocturne", style: "image", category: "portfolio", cover: "/images/landing-covers/nocturne-cover.webp", bestFor: "UI/UX designers, developers, photographers and graphic designers", live: true, href: "/templates/demo/nocturne" },
  { id: "showcase", name: "Showcase", style: "image", category: "portfolio", cover: "/images/landing-covers/showcase-cover.webp", bestFor: "Photographers, UI/UX and graphic designers", live: true, href: "/templates/demo/showcase" },
  // IN PROGRESS — built step by step from a design reference.
  { id: "persona", name: "Persona", style: "image", category: "portfolio", cover: "/images/landing-covers/persona-2026-11c.webp", bestFor: "Brand and product designers", live: true, href: "/templates/demo/persona" },
  { id: "gallery", name: "Gallery", style: "image", category: "photography", cover: "/images/landing-covers/gallery-cover.webp", bestFor: "Photographers and artists", live: true, href: "/templates/demo/gallery" },
  // Minimal: the Signature site template, its demo still at /templates/demo/minimal.
  // The earlier Minimal (components/templates) only renders pages published with it.
  { id: "signature", name: "Minimal", style: "image", category: "portfolio", cover: "/images/landing-covers/minimal-cover.webp", bestFor: "Web, brand and graphic designers", live: true, href: "/templates/demo/minimal" },
  // Exhibition: a visual template example for an artist's show (no editor
  // yet), shown by its screenshot.
  { id: "exhibition", name: "Exhibition", style: "image", category: "events", bestFor: "Painters, artists and galleries", cover: "/images/landing-covers/exhibition-cover.webp", href: "/templates/demo/exhibition", editable: false },
  { id: "atelier", name: "Atelier", style: "image", category: "agency", bestFor: "Designers and makers", image: photo("photo-1487014679447-9f8336841d58") },
  { id: "ledger", name: "Ledger", style: "text", category: "business", bestFor: "Teachers and consultants", image: photo("photo-1502945015378-0e284ca1a5be") },
  { id: "chapter", name: "Chapter", style: "case", category: "personal", bestFor: "Researchers and writers", image: photo("photo-1522199755839-a2bacb67c546") },
  { id: "studio", name: "Studio", style: "image", category: "agency", bestFor: "Architects and interior designers", image: photo("photo-1467232004584-a241de8bcf5d") },
  { id: "brief", name: "Brief", style: "case", category: "portfolio", bestFor: "Product and UX people", image: photo("photo-1642132652860-471b4228023e") },
  { id: "signal", name: "Signal", style: "case", category: "portfolio", bestFor: "Engineers and developers", image: photo("photo-1634084462412-b54873c0a56d") },
  { id: "frame", name: "Frame", style: "image", category: "photography", bestFor: "Filmmakers and editors", image: photo("photo-1648134859177-66e35b61e106") },
  { id: "mentor", name: "Mentor", style: "text", category: "business", bestFor: "Coaches and trainers", image: photo("photo-1530435460869-d13625c69bbf") },
  { id: "folio", name: "Folio", style: "text", category: "personal", bestFor: "Students and graduates", image: photo("photo-1646193186138-148d07f84b13") },
  { id: "canvas", name: "Canvas", style: "image", category: "art", bestFor: "Illustrators and painters", image: photo("photo-1649442746245-f51f4b76963f") },
  { id: "practice", name: "Practice", style: "text", category: "business", bestFor: "Healthcare and legal professionals", image: photo("photo-1627896181038-a0cf83c86008") },
];

// The templates shown to visitors (the templates page and the landing): those
// with a demo to open. The others (the placeholders) are hidden;
// the old template detail screen they led to is no longer used.
export const SHOWN_TEMPLATES = GALLERY_TEMPLATES.filter((template): template is GalleryTemplate & { href: string } => Boolean(template.href));
