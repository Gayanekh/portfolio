import { DM_Mono, DM_Sans, Fraunces, IBM_Plex_Mono, IBM_Plex_Sans, Inter_Tight, Playfair_Display, Space_Grotesk, Space_Mono } from "next/font/google";

// Style options shared by every template on its detail page. A template reads
// the theme tokens from globals.css (bg-card, text-foreground, border-border,
// bg-primary, font-sans, ...), so an option only has to redefine those tokens
// on the element that wraps it. Options are plain class strings, so they work
// in the sidebar, in the live preview and in any future template unchanged.

/* ---------- Fonts ---------- */

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--tf-inter-tight" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--tf-dm-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--tf-dm-mono" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--tf-fraunces" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--tf-playfair" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--tf-space-grotesk" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--tf-space-mono" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--tf-plex-sans" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--tf-plex-mono" });

// Put this on any element that shows the options, so the fonts are loaded there.
export const themeFontVariables = [interTight, dmSans, dmMono, fraunces, playfair, spaceGrotesk, spaceMono, plexSans, plexMono]
  .map((font) => font.variable)
  .join(" ");

/* ---------- Colour palettes ---------- */

export interface ColorPalette {
  id: string;
  name: string;
  // Four swatches shown on the option button, light to dark.
  swatches: [string, string, string, string];
  // Redefines the template's colour tokens. Empty keeps the template's own.
  className: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  { id: "original", name: "Original", swatches: ["bg-[#fafafa]", "bg-[#e5e5e5]", "bg-[#ff4500]", "bg-[#1a1a1a]"], className: "" },
  { id: "linen", name: "Linen", swatches: ["bg-[#f3efe7]", "bg-[#2f3b2a]", "bg-[#a4532c]", "bg-[#1e2a1f]"], className: "[--card:#f3efe7] [--foreground:#1e2a1f] [--border:#dcd5c8] [--muted-foreground:#6f6a5e] [--primary:#a4532c]" },
  { id: "sun", name: "Sun", swatches: ["bg-[#ffffff]", "bg-[#f5b800]", "bg-[#3a3a3a]", "bg-[#111111]"], className: "[--card:#ffffff] [--foreground:#111111] [--border:#e6e6e6] [--muted-foreground:#6b6b6b] [--primary:#f5b800]" },
  { id: "rose", name: "Rose", swatches: ["bg-[#f6f1f0]", "bg-[#a8484b]", "bg-[#7d8a77]", "bg-[#2b2b2b]"], className: "[--card:#f6f1f0] [--foreground:#2b2b2b] [--border:#e6dcda] [--muted-foreground:#7a6f6d] [--primary:#a8484b]" },
  { id: "sand", name: "Sand", swatches: ["bg-[#f4eee8]", "bg-[#d9c8b8]", "bg-[#8c7b67]", "bg-[#1c1c1c]"], className: "[--card:#f4eee8] [--foreground:#1c1c1c] [--border:#e2d8cd] [--muted-foreground:#7b7266] [--primary:#8c7b67]" },
  { id: "ink", name: "Ink", swatches: ["bg-[#f2f2f2]", "bg-[#2b2b2b]", "bg-[#ff5a1f]", "bg-[#141414]"], className: "[--card:#141414] [--foreground:#f2f2f2] [--border:#2b2b2b] [--muted-foreground:#a3a3a3] [--primary:#ff5a1f]" },
  { id: "ocean", name: "Ocean", swatches: ["bg-[#f5f7fb]", "bg-[#9db8e8]", "bg-[#2f6fdb]", "bg-[#0f172a]"], className: "[--card:#f5f7fb] [--foreground:#0f172a] [--border:#dfe5ef] [--muted-foreground:#64748b] [--primary:#2f6fdb]" },
  { id: "lime", name: "Lime", swatches: ["bg-[#fbfbe9]", "bg-[#dfe48a]", "bg-[#9aa52e]", "bg-[#2a3311]"], className: "[--card:#fbfbe9] [--foreground:#2a3311] [--border:#e7e8c4] [--muted-foreground:#6b7046] [--primary:#9aa52e]" },
];

/* ---------- Font packs ---------- */

export interface FontPack {
  id: string;
  name: string;
  // Fonts for the "Heading / Paragraph text" sample on the option button.
  heading: string;
  body: string;
  // Sets the template's main font (--font-1) and its small mono labels.
  className: string;
}

export const FONT_PACKS: FontPack[] = [
  { id: "original", name: "Original", heading: "font-[family-name:var(--tf-inter-tight)] font-semibold", body: "font-[family-name:var(--tf-dm-mono)]", className: "" },
  { id: "editorial", name: "Editorial", heading: "font-[family-name:var(--tf-fraunces)] font-medium", body: "font-[family-name:var(--tf-inter-tight)]", className: "[--font-1:var(--tf-fraunces)] [&_.font-mono]:font-[family-name:var(--tf-inter-tight)]" },
  { id: "grotesk", name: "Grotesk", heading: "font-[family-name:var(--tf-space-grotesk)] font-semibold", body: "font-[family-name:var(--tf-space-mono)]", className: "[--font-1:var(--tf-space-grotesk)] [&_.font-mono]:font-[family-name:var(--tf-space-mono)]" },
  { id: "classic", name: "Classic", heading: "font-[family-name:var(--tf-playfair)] font-semibold", body: "font-[family-name:var(--tf-dm-sans)]", className: "[--font-1:var(--tf-playfair)] [&_.font-mono]:font-[family-name:var(--tf-dm-sans)]" },
  { id: "humanist", name: "Humanist", heading: "font-[family-name:var(--tf-dm-sans)] font-semibold", body: "font-[family-name:var(--tf-dm-mono)]", className: "[--font-1:var(--tf-dm-sans)]" },
  { id: "technical", name: "Technical", heading: "font-[family-name:var(--tf-plex-sans)] font-semibold", body: "font-[family-name:var(--tf-plex-mono)]", className: "[--font-1:var(--tf-plex-sans)] [&_.font-mono]:font-[family-name:var(--tf-plex-mono)]" },
];

export const findPalette = (id: string | null | undefined) => COLOR_PALETTES.find((p) => p.id === id) ?? COLOR_PALETTES[0];
export const findFontPack = (id: string | null | undefined) => FONT_PACKS.find((f) => f.id === id) ?? FONT_PACKS[0];
