import { Fragment, type ReactNode } from "react";
import { INLINE_STYLES, isHexColor, parseRich, type BlockStyle, type RichBlock, type RichSpan, type TextAlign, type ThemeColor } from "./rich-format";

// Formatted text (see ./rich-format) as React elements. In a template's own
// field (`inline`) it keeps the template's type unless a line is given a
// paragraph style, and adds the inline formatting, alignment and line breaks;
// in an added text block it also has quotes and lists. Classes use theme tokens and the
// display font, so palettes and font packs restyle it.

export const BLOCK_CLASS: Record<BlockStyle, string> = {
  h1: "font-display text-[length:clamp(2rem,5cqw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]",
  h2: "font-display text-[length:clamp(1.6rem,3.6cqw,3rem)] font-semibold leading-[1.08] tracking-[-0.025em]",
  h3: "font-display text-[length:clamp(1.3rem,2.4cqw,2rem)] font-semibold leading-tight tracking-[-0.02em]",
  h4: "font-display text-[length:clamp(1.1rem,1.8cqw,1.5rem)] font-medium leading-snug",
  p1: "text-[length:clamp(1rem,1.4cqw,1.25rem)] leading-relaxed",
  p2: "text-[length:clamp(0.95rem,1.15cqw,1.1rem)] leading-relaxed",
  p3: "text-sm leading-relaxed",
  mono: "font-mono text-[length:clamp(0.9rem,1.2cqw,1.05rem)] leading-relaxed tracking-normal",
  quote: "border-l-2 border-foreground/30 pl-4 text-[length:clamp(1.05rem,1.6cqw,1.35rem)] italic leading-relaxed",
  ul: "",
  ol: "",
};
export const ALIGN_CLASS: Record<TextAlign, string> = { left: "text-left", center: "text-center", right: "text-right", justify: "text-justify" };
export const INDENT_CLASS = ["", "ml-6", "ml-12", "ml-[4.5rem]", "ml-24"];
export const COLOR_CLASS: Record<ThemeColor, string> = {
  foreground: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  card: "text-card",
};
export const HIGHLIGHT_CLASS = "rounded-[0.15em] bg-primary/20 box-decoration-clone px-[0.1em]";

export const spanClass = (span: RichSpan) =>
  [span.bold && "font-bold", span.italic && "italic", span.strike && "line-through", span.color && !isHexColor(span.color) && COLOR_CLASS[span.color as ThemeColor], span.highlight && HIGHLIGHT_CLASS, span.href && "underline underline-offset-4"]
    .filter(Boolean)
    .join(" ");

function Spans({ spans }: { spans: RichSpan[] }) {
  return (
    <>
      {spans.map((span, i) => {
        const className = spanClass(span);
        // A custom colour is the author's data, so it is set on the element.
        const custom = isHexColor(span.color) ? { color: span.color } : undefined;
        const text = className || custom ? (
          <span className={className || undefined} style={custom}>
            {span.text}
          </span>
        ) : (
          span.text
        );
        return span.href ? (
          <a key={i} href={span.href} className="text-inherit">
            {text}
          </a>
        ) : (
          <Fragment key={i}>{text}</Fragment>
        );
      })}
    </>
  );
}

// In a template's own field, Paragraph 1 is the template's own type (the
// "Template style" in the editor); any other paragraph style restyles the line.
export const inlineStyleClass = (style: BlockStyle) => (style !== "p1" && INLINE_STYLES.has(style) ? BLOCK_CLASS[style] : "");

const blockClass = (block: RichBlock, inline: boolean) =>
  [inline ? `block whitespace-pre-line ${inlineStyleClass(block.style)}` : BLOCK_CLASS[block.style], block.align && ALIGN_CLASS[block.align], block.indent && INDENT_CLASS[block.indent]]
    .filter(Boolean)
    .join(" ");

// One paragraph, heading or quote; an empty one keeps its line.
function Block({ block, inline }: { block: RichBlock; inline: boolean }) {
  const content = block.spans.some((span) => span.text) ? <Spans spans={block.spans} /> : <br />;
  if (inline) return <span className={blockClass(block, true)}>{content}</span>;
  const Tag = block.style === "quote" ? "blockquote" : block.style.startsWith("h") ? (block.style as "h1") : "p";
  return <Tag className={`m-0 ${blockClass(block, false)}`}>{content}</Tag>;
}

// Formatted text, or the plain text as it is.
export default function RichText({ value, inline = false }: { value: string; inline?: boolean }) {
  const doc = parseRich(value);
  if (!doc) return <>{value}</>;
  const out: ReactNode[] = [];
  for (let i = 0; i < doc.blocks.length; i++) {
    const block = doc.blocks[i];
    if (!inline && (block.style === "ul" || block.style === "ol")) {
      // Consecutive list items of one kind make one list.
      const items: RichBlock[] = [];
      while (i < doc.blocks.length && doc.blocks[i].style === block.style) items.push(doc.blocks[i++]);
      i--;
      const List = block.style;
      out.push(
        <List key={i} className={`m-0 ${block.style === "ul" ? "list-disc" : "list-decimal"} pl-6 text-[length:clamp(1rem,1.4cqw,1.25rem)] leading-relaxed`}>
          {items.map((item, j) => (
            <li key={j} className={[item.align && ALIGN_CLASS[item.align], item.indent && INDENT_CLASS[item.indent]].filter(Boolean).join(" ")}>
              <Spans spans={item.spans} />
            </li>
          ))}
        </List>,
      );
      continue;
    }
    out.push(<Block key={i} block={block} inline={inline} />);
  }
  return inline ? <>{out}</> : <div className="flex flex-col gap-[0.4em]">{out}</div>;
}
