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
}

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1100`;

export const GALLERY_STYLES: { id: GalleryStyle | "all"; label: string }[] = [
  { id: "all", label: "All templates" },
  { id: "image", label: "Image-led" },
  { id: "text", label: "Text-led" },
  { id: "case", label: "Case studies" },
];

export const GALLERY_TEMPLATES: GalleryTemplate[] = [
  { id: "minimal", name: "Minimal", style: "case", bestFor: "Designers and creatives", live: true },
  { id: "atelier", name: "Atelier", style: "image", bestFor: "Designers and makers", image: photo("photo-1487014679447-9f8336841d58") },
  { id: "ledger", name: "Ledger", style: "text", bestFor: "Teachers and consultants", image: photo("photo-1502945015378-0e284ca1a5be") },
  { id: "gallery", name: "Gallery", style: "image", bestFor: "Photographers and artists", image: photo("photo-1592839961515-64c68091f712") },
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
