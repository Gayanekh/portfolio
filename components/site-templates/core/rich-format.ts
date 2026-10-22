// Formatted text for a field or a text block, after the reference's text
// editor: paragraph styles, bold, italic, strikethrough, a colour and a
// highlight from the theme, links, alignment, quotes, lists and indents.
//
// It is stored inside the field's text as JSON with a marker, so content stays
// a map of strings (and saves, merges and publishes as before); plain text is
// still plain text. It is never HTML: it is drawn as React elements (see
// RichText.tsx), so nothing a visitor sees can run as markup.

export type BlockStyle = "h1" | "h2" | "h3" | "h4" | "p1" | "p2" | "p3" | "mono" | "quote" | "ul" | "ol";
export type TextAlign = "left" | "center" | "right" | "justify";
// Theme colours, so palettes restyle formatted text too, or a colour of the
// author's own (Custom, as a hex value).
export type ThemeColor = "foreground" | "muted" | "primary" | "card";
export type TextColor = ThemeColor | `#${string}`;
export const isHexColor = (value: unknown): value is `#${string}` => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);

export interface RichSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  color?: TextColor;
  highlight?: boolean;
  href?: string;
}

export interface RichBlock {
  style: BlockStyle;
  align?: TextAlign;
  // List and quote nesting, 0 to 4.
  indent?: number;
  spans: RichSpan[];
}

export interface RichDoc {
  blocks: RichBlock[];
}

const MARK = '{"$rich":1,';
// The paragraph styles, with the key that picks each one together with
// Ctrl/Cmd + Alt (as in the reference).
export const BLOCK_STYLES: { id: BlockStyle; label: string; key: string }[] = [
  { id: "h1", label: "Heading 1", key: "6" },
  { id: "h2", label: "Heading 2", key: "5" },
  { id: "h3", label: "Heading 3", key: "4" },
  { id: "h4", label: "Heading 4", key: "3" },
  { id: "p1", label: "Paragraph 1", key: "2" },
  { id: "p2", label: "Paragraph 2", key: "1" },
  { id: "p3", label: "Paragraph 3", key: "0" },
  { id: "mono", label: "Monospace", key: "M" },
];
// The styles a template's own field can take (no quotes or lists there).
export const INLINE_STYLES = new Set<BlockStyle>(["h1", "h2", "h3", "h4", "p1", "p2", "p3", "mono"]);
export const TEXT_COLORS: { id: ThemeColor; label: string }[] = [
  { id: "foreground", label: "Text" },
  { id: "muted", label: "Muted" },
  { id: "primary", label: "Accent" },
  { id: "card", label: "Background" },
];

const STYLES = new Set<BlockStyle>(["h1", "h2", "h3", "h4", "p1", "p2", "p3", "mono", "quote", "ul", "ol"]);
const ALIGNS = new Set<TextAlign>(["left", "center", "right", "justify"]);
const COLORS = new Set<string>(["foreground", "muted", "primary", "card"]);

// Links may only go to web pages, email, phone numbers or parts of the page.
export const safeHref = (href: unknown) => {
  if (typeof href !== "string") return undefined;
  const value = href.trim();
  return /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(value) ? value : undefined;
};

const cleanSpan = (value: unknown): RichSpan | null => {
  if (!value || typeof value !== "object") return null;
  const span = value as Record<string, unknown>;
  if (typeof span.text !== "string") return null;
  const clean: RichSpan = { text: span.text };
  if (span.bold === true) clean.bold = true;
  if (span.italic === true) clean.italic = true;
  if (span.strike === true) clean.strike = true;
  if (span.highlight === true) clean.highlight = true;
  if (COLORS.has(span.color as string) || isHexColor(span.color)) clean.color = (isHexColor(span.color) ? span.color.toLowerCase() : span.color) as TextColor;
  const href = safeHref(span.href);
  if (href) clean.href = href;
  return clean;
};

const cleanBlock = (value: unknown): RichBlock | null => {
  if (!value || typeof value !== "object") return null;
  const block = value as Record<string, unknown>;
  const spans = Array.isArray(block.spans) ? block.spans.map(cleanSpan).filter((span): span is RichSpan => span !== null) : [];
  return {
    style: STYLES.has(block.style as BlockStyle) ? (block.style as BlockStyle) : "p1",
    ...(ALIGNS.has(block.align as TextAlign) && block.align !== "left" ? { align: block.align as TextAlign } : {}),
    ...(Number.isInteger(block.indent) && (block.indent as number) > 0 ? { indent: Math.min(4, block.indent as number) } : {}),
    spans,
  };
};

export const isRich = (value: string) => value.startsWith(MARK);

// The formatted text in a field, or null for plain text (or anything broken).
export function parseRich(value: string): RichDoc | null {
  if (!isRich(value)) return null;
  try {
    const parsed = JSON.parse(value) as { blocks?: unknown };
    const blocks = Array.isArray(parsed.blocks) ? parsed.blocks.map(cleanBlock).filter((block): block is RichBlock => block !== null) : [];
    return { blocks };
  } catch {
    return null;
  }
}

const isPlain = (doc: RichDoc) =>
  doc.blocks.length <= 1 &&
  doc.blocks.every((block) => block.style === "p1" && !block.align && !block.indent && block.spans.every((span) => Object.keys(span).length === 1));

// A document as a field's text: plain text when it has no formatting.
export function writeRich(doc: RichDoc): string {
  if (isPlain(doc)) return plainOf(doc);
  return `${MARK}"blocks":${JSON.stringify(doc.blocks)}}`;
}

const plainOf = (doc: RichDoc) => doc.blocks.map((block) => block.spans.map((span) => span.text).join("")).join("\n");

// A field's words without formatting (for titles, labels and the content panel).
export const plainText = (value: string) => {
  const doc = parseRich(value);
  return doc ? plainOf(doc) : value;
};

// Plain text as a document (one paragraph per line), to start formatting it.
export const toRich = (value: string): RichDoc =>
  parseRich(value) ?? { blocks: value.split("\n").map((line) => ({ style: "p1" as BlockStyle, spans: line ? [{ text: line }] : [] })) };
