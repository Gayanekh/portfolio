import { ALIGN_CLASS, BLOCK_CLASS, COLOR_CLASS, HIGHLIGHT_CLASS, INDENT_CLASS, inlineStyleClass, spanClass } from "@/components/site-templates/core/RichText";
import {
  INLINE_STYLES,
  isHexColor,
  safeHref,
  type BlockStyle,
  type RichBlock,
  type RichDoc,
  type RichSpan,
  type TextAlign,
  type TextColor,
  type ThemeColor,
} from "@/components/site-templates/core/rich-format";

// The text editor's page side: formatted text drawn into an editable element
// and read back out of it after typing or a toolbar command. Only DOM nodes
// with textContent are created (never HTML strings), and reading keeps only
// the formatting the model knows, so pasted or odd markup is dropped.

// While a colour or a highlight is being applied, the browser marks the text
// with one of these, which are then turned into the theme colour.
export const COLOR_MARK: Record<ThemeColor, string> = { foreground: "#010203", muted: "#020304", primary: "#030405", card: "#040506" };
export const HIGHLIGHT_MARK = "#050607";
const rgb = (hex: string) => `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;
// "rgb(1, 2, 3)" or "#010203" as "#010203"; anything else as null.
const toHex = (value: string | null | undefined) => {
  if (!value) return null;
  if (isHexColor(value)) return value.toLowerCase() as `#${string}`;
  const parts = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return parts ? (`#${parts.slice(1).map((n) => Number(n).toString(16).padStart(2, "0")).join("")}` as `#${string}`) : null;
};

const TAG: Record<BlockStyle, string> = { h1: "h1", h2: "h2", h3: "h3", h4: "h4", p1: "p", p2: "p", p3: "p", mono: "p", quote: "blockquote", ul: "li", ol: "li" };

const blockElement = (block: RichBlock, inline: boolean) => {
  // A template's own field may sit in a heading or a link, so its lines are spans.
  const element = document.createElement(inline ? "span" : TAG[block.style]);
  element.dataset.block = "1";
  element.dataset.style = block.style;
  if (block.align) element.dataset.align = block.align;
  if (block.indent) element.dataset.indent = String(block.indent);
  element.className = [inline ? `block whitespace-pre-line ${inlineStyleClass(block.style)}` : BLOCK_CLASS[block.style], block.align && ALIGN_CLASS[block.align], block.indent && INDENT_CLASS[block.indent]].filter(Boolean).join(" ") || "";
  return element;
};

const spanNode = (span: RichSpan) => {
  let node: Node = document.createTextNode(span.text);
  const className = spanClass({ ...span, href: undefined });
  if (className || isHexColor(span.color)) {
    const element = document.createElement("span");
    element.className = className;
    if (isHexColor(span.color)) element.style.color = span.color;
    if (span.bold) element.dataset.bold = "1";
    if (span.italic) element.dataset.italic = "1";
    if (span.strike) element.dataset.strike = "1";
    if (span.color) element.dataset.color = span.color;
    if (span.highlight) element.dataset.highlight = "1";
    element.append(node);
    node = element;
  }
  if (span.href) {
    const link = document.createElement("a");
    link.href = span.href;
    link.className = "underline underline-offset-4";
    link.append(node);
    node = link;
  }
  return node;
};

// Draw a document into the editable element.
export function drawRich(root: HTMLElement, doc: RichDoc, inline: boolean) {
  root.replaceChildren();
  let list: HTMLElement | null = null;
  for (const block of doc.blocks) {
    const element = blockElement(block, inline);
    if (block.spans.some((span) => span.text)) block.spans.forEach((span) => element.append(spanNode(span)));
    else element.append(document.createElement("br"));
    if (!inline && (block.style === "ul" || block.style === "ol")) {
      if (!list || list.tagName.toLowerCase() !== block.style) {
        list = document.createElement(block.style);
        list.className = `m-0 ${block.style === "ul" ? "list-disc" : "list-decimal"} pl-6`;
        root.append(list);
      }
      list.append(element);
    } else {
      list = null;
      root.append(element);
    }
  }
}

/* ---------- Reading it back ---------- */

const BLOCK_TAGS = new Set(["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "li", "ul", "ol"]);
const COLOR_BY_MARK = new Map<string, ThemeColor>(
  Object.entries(COLOR_MARK).flatMap(([color, hex]) => [
    [hex, color as ThemeColor],
    [rgb(hex), color as ThemeColor],
  ]),
);

type Format = Omit<RichSpan, "text">;

// The formatting an inline element adds.
function formatOf(element: HTMLElement, format: Format): Format {
  const next = { ...format };
  const tag = element.tagName.toLowerCase();
  if (tag === "b" || tag === "strong" || element.dataset.bold) next.bold = true;
  if (tag === "i" || tag === "em" || element.dataset.italic) next.italic = true;
  if (tag === "s" || tag === "strike" || tag === "del" || element.dataset.strike) next.strike = true;
  if (tag === "a") next.href = safeHref(element.getAttribute("href"));
  const weight = element.style.fontWeight;
  if (weight === "bold" || Number(weight) >= 600) next.bold = true;
  if (element.style.fontStyle === "italic") next.italic = true;
  if (element.style.textDecorationLine.includes("line-through") || element.style.textDecoration.includes("line-through")) next.strike = true;
  const themed = (element.dataset.color as TextColor | undefined) ?? COLOR_BY_MARK.get(element.getAttribute("color") ?? "") ?? COLOR_BY_MARK.get(element.style.color);
  // A custom colour: set by the browser while applying it, or drawn from the model.
  const custom = toHex(element.getAttribute("color")) ?? toHex(element.style.color);
  const color = themed ?? (custom && !COLOR_BY_MARK.has(custom) && custom !== HIGHLIGHT_MARK ? custom : undefined);
  if (color) next.color = color;
  if (element.dataset.highlight || element.style.backgroundColor === rgb(HIGHLIGHT_MARK) || element.getAttribute("data-mark")) next.highlight = true;
  return next;
}

const sameFormat = (a: Format, b: Format) =>
  Boolean(a.bold) === Boolean(b.bold) &&
  Boolean(a.italic) === Boolean(b.italic) &&
  Boolean(a.strike) === Boolean(b.strike) &&
  Boolean(a.highlight) === Boolean(b.highlight) &&
  a.color === b.color &&
  a.href === b.href;

function collectSpans(node: Node, format: Format, spans: RichSpan[]) {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      if (!text) return;
      const last = spans[spans.length - 1];
      if (last && sameFormat(last, format)) last.text += text;
      else spans.push({ text, ...Object.fromEntries(Object.entries(format).filter(([, value]) => value !== undefined && value !== false)) });
    } else if (child instanceof HTMLElement) {
      if (child.tagName === "BR") return;
      collectSpans(child, formatOf(child, format), spans);
    }
  });
}

const styleOf = (element: HTMLElement, list: string | null): BlockStyle => {
  const tag = element.tagName.toLowerCase();
  if (list === "ul" || list === "ol") return list;
  if (/^h[1-4]$/.test(tag)) return tag as BlockStyle;
  if (tag === "h5" || tag === "h6") return "h4";
  if (tag === "blockquote") return "quote";
  const style = element.dataset.style as BlockStyle | undefined;
  return style && INLINE_STYLES.has(style) ? style : "p1";
};

const alignOf = (element: HTMLElement): TextAlign | undefined => {
  const align = (element.dataset.align || element.style.textAlign || element.getAttribute("align") || "") as TextAlign;
  return align === "center" || align === "right" || align === "justify" ? align : undefined;
};

// Read the editable element back as a document. `inline` (a template's own
// field) keeps paragraph styles but no quotes, lists or indents.
export function readRich(root: HTMLElement, inline: boolean): RichDoc {
  const blocks: RichBlock[] = [];
  let loose: RichSpan[] = [];
  const flush = () => {
    if (loose.length) blocks.push({ style: "p1", spans: loose });
    loose = [];
  };
  const visit = (element: HTMLElement, list: string | null) => {
    const tag = element.tagName.toLowerCase();
    if (tag === "ul" || tag === "ol") {
      element.childNodes.forEach((child) => child instanceof HTMLElement && visit(child, tag));
      return;
    }
    const spans: RichSpan[] = [];
    collectSpans(element, {}, spans);
    const indent = Number(element.dataset.indent) || 0;
    const style = styleOf(element, tag === "li" ? list : null);
    blocks.push({
      style: inline ? (INLINE_STYLES.has(style) ? style : "p1") : style,
      ...(alignOf(element) ? { align: alignOf(element) } : {}),
      ...(!inline && indent ? { indent: Math.min(4, indent) } : {}),
      spans,
    });
  };
  root.childNodes.forEach((child) => {
    if (child instanceof HTMLElement && (BLOCK_TAGS.has(child.tagName.toLowerCase()) || child.dataset.block)) {
      flush();
      visit(child, null);
    } else if (child instanceof HTMLElement && child.tagName === "BR") {
      flush();
    } else {
      collectSpans({ childNodes: [child] } as unknown as Node, {}, loose);
    }
  });
  flush();
  return { blocks: blocks.length ? blocks : [{ style: "p1", spans: [] }] };
}

// The block element the caret is in, inside the editable element.
export function currentBlock(root: HTMLElement): HTMLElement | null {
  const selection = window.getSelection();
  let node: Node | null = selection?.anchorNode ?? null;
  while (node && node !== root) {
    if (node instanceof HTMLElement && node.parentElement && (node.parentElement === root || ["UL", "OL"].includes(node.parentElement.tagName))) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

// Mark the browser's colour and highlight marks as theme colours, so what is
// on screen while typing matches what gets saved.
export function adoptMarks(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("font[color], span[style]").forEach((element) => {
    const color = COLOR_BY_MARK.get(element.getAttribute("color") ?? "") ?? COLOR_BY_MARK.get(element.style.color);
    if (color) {
      element.removeAttribute("color");
      element.style.color = "";
      element.dataset.color = color;
      element.classList.add(...COLOR_CLASS[color].split(" "));
    }
    if (element.style.backgroundColor === rgb(HIGHLIGHT_MARK)) {
      element.style.backgroundColor = "";
      element.dataset.highlight = "1";
      element.classList.add(...HIGHLIGHT_CLASS.split(" "));
    }
    if (!element.getAttribute("style")) element.removeAttribute("style");
  });
}
