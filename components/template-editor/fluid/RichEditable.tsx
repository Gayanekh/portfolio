"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  RemoveFormatting,
  Strikethrough,
  type LucideIcon,
} from "lucide-react";
import {
  BLOCK_STYLES,
  TEXT_COLORS,
  isHexColor,
  toRich,
  writeRich,
  type BlockStyle,
  type RichDoc,
  type TextAlign,
  type ThemeColor,
} from "@/components/site-templates/core/rich-format";
import Tooltip from "@/components/ui/tooltip";
import { COLOR_CLASS } from "@/components/site-templates/core/RichText";
import { COLOR_MARK, HIGHLIGHT_MARK, adoptMarks, currentBlock, drawRich, readRich } from "./rich-dom";
import { editorFont, editorUi } from "./canvas";
import { LinkCard, LinkForm, type LinkPage } from "./LinkEditor";

const smooth = [0.22, 1, 0.36, 1] as const;
const ALIGNS: TextAlign[] = ["left", "center", "right", "justify"];
const ALIGN_ICON: Record<TextAlign, LucideIcon> = { left: AlignLeft, center: AlignCenter, right: AlignRight, justify: AlignJustify };
const ALIGN_LABEL: Record<TextAlign, string> = { left: "Align left", center: "Align centre", right: "Align right", justify: "Justify" };
const SWATCH: Record<ThemeColor, string> = {
  foreground: "bg-foreground",
  muted: "bg-muted-foreground",
  primary: "bg-primary",
  card: "bg-card ring-1 ring-black/15",
};

export type { LinkPage } from "./LinkEditor";

const popover = "absolute top-full z-50 mt-2 rounded-lg bg-white shadow-[0_8px_30px_-4px_rgb(0_0_0/0.2),0_1px_3px_rgb(0_0_0/0.06)]";

// The element of each block, in document order (list items one by one).
const blockElements = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(":scope > :not(ul):not(ol), :scope > ul > li, :scope > ol > li"));

function placeCaretAtEnd(element: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function Tool({
  label,
  Icon,
  onPress,
  active = false,
  disabled = false,
  filled = false,
  children,
}: {
  label: string;
  Icon?: LucideIcon;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  // A solid icon (the quote marks), as in the reference.
  filled?: boolean;
  children?: ReactNode;
}) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onMouseDown={(event) => {
          event.preventDefault();
          if (!disabled) onPress();
        }}
        className={`grid h-9 min-w-9 cursor-pointer place-items-center rounded px-1 transition-colors disabled:cursor-default disabled:text-neutral-300 ${
          active ? "bg-neutral-100 text-neutral-950" : "text-neutral-950 hover:bg-neutral-100 disabled:hover:bg-transparent"
        }`}
      >
        {Icon ? <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.75 : 2.25} fill={filled ? "currentColor" : "none"} /> : children}
      </button>
    </Tooltip>
  );
}


// Text you can type into and format, after the reference's text editor. While
// `typing`, it is editable and its toolbar sits above it (no dividers, as in
// the reference): the paragraph style,
// bold, italic, colour, highlight, link, alignment, quote, lists,
// strikethrough, indents and clear formatting. `inline` (a template's own
// field) starts in the template's own type ("Template style") and can take
// any paragraph style, the inline formatting and alignment, but no quotes,
// lists or indents. Ctrl/Cmd + Alt + 6…0 or M picks a paragraph style.
export default function RichEditable({
  value,
  inline,
  typing,
  onChange,
  onCommit,
  onStop,
  pages = [],
}: {
  value: string;
  inline: boolean;
  typing: boolean;
  onChange: (value: string) => void;
  onCommit: () => void;
  onStop: () => void;
  // The site's pages, offered when linking.
  pages?: LinkPage[];
}) {
  const ref = useRef<HTMLElement>(null);
  // The toolbar sits above the text, or below it when the text is near the
  // top of the canvas (checked while typing, as the canvas scrolls).
  const [below, setBelow] = useState(false);
  useEffect(() => {
    if (!typing) return;
    const update = () => {
      const root = ref.current;
      if (!root) return;
      const area = (root.closest("[data-canvas-area]") ?? document.documentElement).getBoundingClientRect();
      setBelow(root.getBoundingClientRect().top - area.top < 64);
    };
    let frame = requestAnimationFrame(update);
    const later = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", later, true);
    window.addEventListener("resize", later);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", later, true);
      window.removeEventListener("resize", later);
    };
  }, [typing]);
  // The last text sent up: anything else arriving is an outside change (undo,
  // redo, the content panel) and is drawn again.
  const sent = useRef<string | null>(null);
  const savedRange = useRef<Range | null>(null);
  // `linkable`: words are selected, or the caret is in a link (to change it).
  // `href`: the link the caret is in, if any (its card shows under the text).
  const [state, setState] = useState({
    bold: false,
    italic: false,
    strike: false,
    linkable: false,
    href: null as string | null,
    style: "p1" as BlockStyle,
    align: "left" as TextAlign,
  });
  const [menu, setMenu] = useState<"style" | "color" | "link" | "align" | null>(null);
  // The link under the selection when the link editor opened.
  const [linkFrom, setLinkFrom] = useState("");
  const [colorTab, setColorTab] = useState<"palette" | "custom">("palette");
  const [custom, setCustom] = useState("#d13b2a");

  useEffect(() => {
    const root = ref.current;
    if (!root || value === sent.current) return;
    drawRich(root, toRich(value), inline);
    sent.current = value;
  }, [value, inline]);

  // Starting to type: focus it, caret at the end.
  useEffect(() => {
    const root = ref.current;
    if (!typing || !root) return;
    root.focus();
    placeCaretAtEnd(root);
  }, [typing]);

  // Keep the toolbar's buttons in step with the text under the caret.
  useEffect(() => {
    if (!typing) return;
    const read = () => {
      const root = ref.current;
      const selection = window.getSelection();
      if (!root || !selection?.anchorNode || !root.contains(selection.anchorNode)) return;
      const block = currentBlock(root);
      const tag = block?.tagName.toLowerCase();
      const list = block?.parentElement?.tagName.toLowerCase();
      setState({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        strike: document.queryCommandState("strikeThrough"),
        linkable: !selection.isCollapsed || Boolean(selection.anchorNode.parentElement?.closest("a")),
        href: selection.anchorNode.parentElement?.closest("a")?.getAttribute("href") ?? null,
        style: (tag === "li" ? (list as BlockStyle) : tag === "blockquote" ? "quote" : (block?.dataset.style as BlockStyle)) || "p1",
        align: (block?.dataset.align as TextAlign) || "left",
      });
    };
    document.addEventListener("selectionchange", read);
    return () => document.removeEventListener("selectionchange", read);
  }, [typing]);

  const emit = () => {
    const root = ref.current;
    if (!root) return;
    adoptMarks(root);
    const next = writeRich(readRich(root, inline));
    sent.current = next;
    onChange(next);
  };

  const exec = (command: string, argument?: string, css = false) => {
    document.execCommand("styleWithCSS", false, String(css));
    document.execCommand(command, false, argument);
    emit();
  };

  // Change the block under the caret (style, alignment, indent), then draw
  // the text again with the caret at the end of that block.
  const changeBlock = (change: (doc: RichDoc, index: number) => void) => {
    const root = ref.current;
    if (!root) return;
    const block = currentBlock(root);
    const index = Math.max(0, block ? blockElements(root).indexOf(block) : 0);
    adoptMarks(root);
    const doc = readRich(root, inline);
    if (!doc.blocks[index]) return;
    change(doc, index);
    drawRich(root, doc, inline);
    const target = blockElements(root)[index];
    if (target) placeCaretAtEnd(target);
    const next = writeRich(doc);
    sent.current = next;
    onChange(next);
  };

  const setStyle = (style: BlockStyle) =>
    changeBlock((doc, i) => {
      doc.blocks[i].style = doc.blocks[i].style === style && (style === "quote" || style === "ul" || style === "ol") ? "p1" : style;
    });
  const setAlign = (align: TextAlign) => {
    changeBlock((doc, i) => {
      doc.blocks[i].align = align === "left" ? undefined : align;
    });
    setState((s) => ({ ...s, align }));
    setMenu(null);
  };

  // The selection when a popover opened, to put back before applying it (its
  // own inputs take the focus away from the text).
  const keepSelection = () => {
    const selection = window.getSelection();
    savedRange.current = selection && selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
  };
  const restoreSelection = () => {
    const root = ref.current;
    const range = savedRange.current;
    if (!root || !range) return false;
    root.focus();
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    return true;
  };
  const applyColor = (color: string) => {
    if (!restoreSelection()) return;
    exec("foreColor", color);
    setMenu(null);
  };
  const indent = (step: 1 | -1) =>
    changeBlock((doc, i) => {
      const next = Math.min(4, Math.max(0, (doc.blocks[i].indent ?? 0) + step));
      doc.blocks[i].indent = next || undefined;
    });

  // Clear formatting: the selected words as plain text.
  const clear = () => {
    const selection = window.getSelection();
    const text = selection?.toString() ?? "";
    if (text) document.execCommand("insertText", false, text);
    emit();
  };

  // The link the caret is in, selected whole (to change or remove it).
  const selectLink = () => {
    const anchor = window.getSelection()?.anchorNode?.parentElement?.closest("a");
    if (!anchor || !ref.current?.contains(anchor)) return false;
    const range = document.createRange();
    range.selectNodeContents(anchor);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    return true;
  };
  const openLink = () => {
    if (window.getSelection()?.isCollapsed) selectLink();
    keepSelection();
    const href = window.getSelection()?.anchorNode?.parentElement?.closest("a")?.getAttribute("href") ?? "";
    setLinkFrom(href);
    setMenu(menu === "link" ? null : "link");
  };
  const applyLink = (href: string | undefined) => {
    if (!restoreSelection()) return;
    exec(href ? "createLink" : "unlink", href);
    setMenu(null);
  };
  const removeLink = () => {
    if (!selectLink()) return;
    exec("unlink");
  };
  const ToolAlign = ALIGN_ICON[state.align];
  // In a template's own field, Paragraph 1 is the template's own type.
  const styles = BLOCK_STYLES.map((style) => (inline && style.id === "p1" ? { ...style, label: "Template style" } : style));
  const styleLabel = styles.find((style) => style.id === state.style)?.label ?? (state.style === "quote" ? "Quote" : "List");
  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  // A template's own field may sit in a heading or a link: a block-level span.
  const Box = inline ? "span" : "div";
  return (
    <>
      <Box
        ref={ref as never}
        role="textbox"
        aria-multiline="true"
        aria-readonly={!typing}
        contentEditable={typing}
        suppressContentEditableWarning
        spellCheck={typing}
        data-placeholder="Write here..."
        onInput={emit}
        onKeyDown={(event) => {
          // Ctrl/Cmd + Alt + a style's key picks it (by key position, as Alt
          // changes the character on some keyboards).
          if ((event.ctrlKey || event.metaKey) && event.altKey) {
            const key = event.code.startsWith("Digit") ? event.code.slice(5) : event.code === "KeyM" ? "M" : null;
            const style = BLOCK_STYLES.find((item) => item.key === key);
            if (style) {
              event.preventDefault();
              setStyle(style.id);
              return;
            }
          }
          if (event.key === "Escape") {
            event.preventDefault();
            event.currentTarget.blur();
          }
          // In a template's field Enter breaks the line, inside the same block.
          if (inline && event.key === "Enter") {
            event.preventDefault();
            document.execCommand("insertText", false, "\n");
          }
        }}
        onBlur={(event) => {
          // Clicking the toolbar keeps typing.
          if (event.relatedTarget && (event.relatedTarget as HTMLElement).closest("[data-rich-toolbar]")) return;
          setMenu(null);
          onCommit();
          onStop();
        }}
        className={`block outline-none ${typing ? "cursor-text" : ""} [&:empty]:before:opacity-40 [&:empty]:before:content-[attr(data-placeholder)]`}
      />

      <AnimatePresence>
        {typing && (
          <motion.div
            key="rich-toolbar"
            data-rich-toolbar
            initial={{ opacity: 0, y: below ? -4 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: below ? -4 : 4 }}
            transition={{ duration: 0.16, ease: smooth }}
            onPointerDown={(event) => event.stopPropagation()}
            className={`absolute left-0 z-50 flex items-center gap-1 whitespace-nowrap rounded-md bg-white px-1.5 py-1 ${editorUi} text-sm text-neutral-950 shadow-[0_4px_18px_-2px_rgb(0_0_0/0.16),0_1px_3px_rgb(0_0_0/0.06)] ${
              below ? "top-[calc(100%+0.75rem)]" : "-top-14"
            }`}
          >
            {/* Paragraph style: a list with a tick on the current one and its keys */}
            <span className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menu === "style"}
                onMouseDown={(event) => {
                  event.preventDefault();
                  setMenu(menu === "style" ? null : "style");
                }}
                className={`flex h-9 cursor-pointer items-center gap-2 rounded px-2.5 font-medium transition-colors hover:bg-neutral-100 ${menu === "style" ? "bg-neutral-100" : ""}`}
              >
                {styleLabel}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${menu === "style" ? "rotate-180" : ""}`} strokeWidth={2.25} />
              </button>
              <AnimatePresence>
                {menu === "style" && (
                  <motion.span
                    role="menu"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14 }}
                    className="absolute -left-1.5 top-full z-50 mt-2 flex w-56 flex-col rounded-lg bg-white py-1.5 shadow-[0_8px_30px_-4px_rgb(0_0_0/0.2),0_1px_3px_rgb(0_0_0/0.06)]"
                  >
                    {styles.map((style) => {
                      const current = state.style === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          role="menuitemradio"
                          aria-checked={current}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setStyle(style.id);
                            setMenu(null);
                          }}
                          className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-[15px] text-neutral-950 transition-colors hover:bg-neutral-100"
                        >
                          <span className="grid w-5 shrink-0 place-items-center">{current && <Check className="h-4 w-4" strokeWidth={2.5} />}</span>
                          <span className="flex-1">{style.label}</span>
                          <span aria-hidden="true" className="flex gap-1">
                            {[mac ? "⌘" : "Ctrl", mac ? "⌥" : "Alt", style.key].map((key) => (
                              <kbd key={key} className={`grid h-5 min-w-5 place-items-center rounded bg-neutral-100 px-1 ${editorFont} text-[10px] font-semibold text-neutral-500`}>
                                {key}
                              </kbd>
                            ))}
                          </span>
                        </button>
                      );
                    })}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <Tool label="Bold" Icon={Bold} active={state.bold} onPress={() => exec("bold")} />
            <Tool label="Italic" Icon={Italic} active={state.italic} onPress={() => exec("italic")} />
            {/* Colour */}
            <span className="relative">
              <Tool
                label="Text colour"
                active={menu === "color"}
                onPress={() => {
                  keepSelection();
                  setMenu(menu === "color" ? null : "color");
                }}
              >
                <span className="size-[18px] rounded-full bg-neutral-950" />
              </Tool>
              <AnimatePresence>
                {menu === "color" && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14 }}
                    className={`${popover} -left-24 flex w-56 flex-col px-3 pb-3`}
                  >
                    <span className="flex border-b border-neutral-100">
                      {(["palette", "custom"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setColorTab(tab);
                          }}
                          className={`relative flex-1 cursor-pointer py-3 text-[13px] font-medium capitalize transition-colors ${colorTab === tab ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-800"}`}
                        >
                          {tab}
                          {colorTab === tab && <motion.span layoutId="color-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-neutral-950" />}
                        </button>
                      ))}
                    </span>
                    {colorTab === "palette" ? (
                      <span className="flex justify-between gap-2 pt-3">
                        {TEXT_COLORS.map((color) => (
                          <Tooltip key={color.id} label={color.label} side="top">
                            <button
                              type="button"
                              aria-label={color.label}
                              onMouseDown={(event) => {
                                event.preventDefault();
                                applyColor(COLOR_MARK[color.id]);
                              }}
                              className={`size-8 cursor-pointer rounded ring-1 ring-black/10 transition-transform hover:scale-110 ${SWATCH[color.id]} ${COLOR_CLASS[color.id]}`}
                            />
                          </Tooltip>
                        ))}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 pt-3">
                        <input
                          type="color"
                          aria-label="Pick a colour"
                          value={isHexColor(custom) ? custom : "#000000"}
                          onChange={(event) => setCustom(event.target.value)}
                          className="size-9 shrink-0 cursor-pointer rounded-md border border-neutral-200 bg-white p-0.5"
                        />
                        <input
                          aria-label="Colour as hex"
                          value={custom}
                          onChange={(event) => setCustom(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && isHexColor(custom)) applyColor(custom.toLowerCase());
                          }}
                          className="h-9 min-w-0 flex-1 rounded-md border border-neutral-200 px-2 font-mono text-xs uppercase outline-none focus:border-neutral-400"
                        />
                        <button
                          type="button"
                          disabled={!isHexColor(custom)}
                          onClick={() => applyColor(custom.toLowerCase())}
                          className="h-9 cursor-pointer rounded bg-neutral-900 px-2.5 text-xs font-semibold text-white disabled:cursor-default disabled:opacity-40"
                        >
                          Apply
                        </button>
                      </span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <Tool label="Highlight" Icon={Highlighter} onPress={() => exec("hiliteColor", HIGHLIGHT_MARK, true)} />
            {/* Link */}
            <span className="relative">
              <Tool label="Link" Icon={Link2} active={Boolean(state.href) || menu === "link"} disabled={!state.linkable && menu !== "link"} onPress={openLink} />
              <AnimatePresence>
                {menu === "link" && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14 }}
                    className={`${popover} -left-28 flex w-64 flex-col gap-3 p-4`}
                  >
                    <LinkForm value={linkFrom} pages={pages} onApply={applyLink} onCancel={() => setMenu(null)} />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className="relative">
              <Tool label="Alignment" Icon={ToolAlign} active={menu === "align"} onPress={() => setMenu(menu === "align" ? null : "align")} />
              <AnimatePresence>
                {menu === "align" && (
                  <motion.span
                    role="menu"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14 }}
                    className={`${popover} -left-12 flex gap-0.5 p-1`}
                  >
                    {ALIGNS.map((align) => {
                      const Icon = ALIGN_ICON[align];
                      return (
                        <Tool key={align} label={ALIGN_LABEL[align]} Icon={Icon} active={state.align === align} onPress={() => setAlign(align)} />
                      );
                    })}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <Tool label="Quote" Icon={Quote} filled disabled={inline} active={state.style === "quote"} onPress={() => setStyle("quote")} />
            <Tool label="Bulleted list" Icon={List} disabled={inline} active={state.style === "ul"} onPress={() => setStyle("ul")} />
            <Tool label="Numbered list" Icon={ListOrdered} disabled={inline} active={state.style === "ol"} onPress={() => setStyle("ol")} />
            <Tool label="Strikethrough" Icon={Strikethrough} active={state.strike} onPress={() => exec("strikeThrough")} />
            <Tool label="Decrease indent" Icon={IndentDecrease} disabled={inline} onPress={() => indent(-1)} />
            <Tool label="Increase indent" Icon={IndentIncrease} disabled={inline} onPress={() => indent(1)} />
            <Tool label="Clear formatting" Icon={RemoveFormatting} onPress={clear} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The caret is in a link: where it goes, with Edit, Copy and Remove link */}
      <AnimatePresence>
        {typing && state.href && menu !== "link" && (
          <motion.div
            key="link-card"
            data-rich-toolbar
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: smooth }}
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.preventDefault()}
            className={`absolute left-0 top-full z-50 mt-2 flex w-72 flex-col gap-4 rounded-lg bg-white p-4 ${editorUi} shadow-[0_8px_30px_-4px_rgb(0_0_0/0.2),0_1px_3px_rgb(0_0_0/0.06)]`}
          >
            <LinkCard href={state.href} pages={pages} onEdit={openLink} onRemove={removeLink} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
