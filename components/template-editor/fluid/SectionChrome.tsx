"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  MoveVertical,
  Pencil,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import GridOverlay from "./GridOverlay";
import { editorUi, useCanvas } from "./canvas";
import { menuCard, menuRow, menuTitle, ToolButton, ToolDivider, toolbarCard } from "./toolbar";
import Tooltip from "@/components/ui/tooltip";

// Keep receiving the pointer while dragging, even outside the element (a
// pointer the browser no longer tracks is simply not captured).
const capture = (event: { currentTarget: Element; pointerId: number }) => {
  try {
    event.currentTarget.setPointerCapture(event.pointerId);
  } catch {
    // Not an active pointer: dragging still works while it stays over the element.
  }
};

export interface ChoiceItem {
  id: string;
  label: string;
}

export interface SectionChromeProps {
  instance: string;
  first: boolean;
  last: boolean;
  // The template's sections, to add one or change this one's layout.
  layouts: ChoiceItem[];
  // The section's blocks, for Layers.
  blocks: ChoiceItem[];
  // Its extra height, in grid rows.
  extraRows: number;
  onAddSection: (where: "before" | "after", base: string) => void;
  onLayout: (base: string) => void;
  onEditSection?: () => void;
  onEditContent?: () => void;
  onDuplicate: () => void;
  onMove: (step: -1 | 1) => void;
  onRemove?: () => void;
  onAddBlock: (kind: "text" | "image") => void;
  onSelectBlock: (id: string) => void;
  // The extra height while dragging the handle, and once it is let go.
  onHeight: (rows: number, done: boolean) => void;
  // The site's header or footer: locked (shown as visitors see it, "Edit
  // header" on hover) until clicked, then open with all its tools and Done.
  global?: { name: string; open: boolean; onOpen: () => void; onDone: () => void };
  // Another section is open (a header or footer): this one dims, and a click
  // on it closes that one.
  dimmed?: boolean;
  onUndim?: () => void;
  children: ReactNode;
}

type Open = "before" | "after" | "layers" | "block" | null;
const smooth = [0.22, 1, 0.36, 1] as const;
// Menus open with a small drop and fade.
const pop = {
  initial: { opacity: 0, y: -4, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.16, ease: smooth },
};

function Menu({ title, items, onPick, className }: { title: string; items: ChoiceItem[]; onPick: (id: string) => void; className: string }) {
  return (
    <motion.div {...pop} className={`${menuCard} absolute z-50 w-56 ${className}`}>
      <p className={menuTitle}>{title}</p>
      {items.length ? (
        items.map((item) => (
          <button key={item.id} type="button" onClick={() => onPick(item.id)} className={menuRow}>
            <span className="truncate">{item.label}</span>
          </button>
        ))
      ) : (
        <p className="m-0 px-2.5 py-2 text-[13px] text-neutral-500">Nothing here yet.</p>
      )}
    </motion.div>
  );
}


// A section while editing, after the reference's Fluid Engine: hovering it
// outlines it in the brand colour with "Add section" at its top and bottom edges, Layers
// and Add block at its top left, and on the right its tools in one row (Edit section,
// Layouts, both coming soon; duplicate and Remove), all in
// the canvas toolbar design (toolbar.tsx). A
// handle at its bottom right drags its height. While a block in it is
// dragged, it shows the grid. The site's header and footer are locked until
// clicked (see `global`), and the rest of the page dims while one is open.
export default function SectionChrome(props: SectionChromeProps) {
  const { instance, layouts, blocks, extraRows, children } = props;
  const { dragging, setDragging } = useCanvas();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState<Open>(null);
  const resize = useRef<{ y: number; rows: number } | null>(null);
  const [resizing, setResizing] = useState(false);
  // Hidden while a block is dragged (the grid shows instead), but not while
  // its own height handle is.
  // An open header or footer keeps its tools showing.
  const shown = resizing || ((hover || open !== null || Boolean(props.global?.open)) && !dragging);
  const toggle = (menu: Open) => setOpen((current) => (current === menu ? null : menu));
  const close = () => setOpen(null);

  const handleDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    resize.current = { y: event.clientY, rows: extraRows };
    setResizing(true);
    setDragging(instance);
    capture(event);
  };
  const handleMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!resize.current) return;
    props.onHeight(Math.max(0, resize.current.rows + Math.round((event.clientY - resize.current.y) / 24)), false);
  };
  const handleUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (!resize.current) return;
    props.onHeight(Math.max(0, resize.current.rows + Math.round((event.clientY - resize.current.y) / 24)), true);
    resize.current = null;
    setResizing(false);
    setDragging(null);
  };

  // Dimmed while a header or footer is open: a click on it closes that one.
  if (props.dimmed) {
    return (
      <div className="relative" data-section-chrome={instance}>
        {children}
        <motion.button
          type="button"
          aria-label="Back to the whole page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={props.onUndim}
          className="absolute inset-0 z-[36] block cursor-pointer bg-white/70"
        />
      </div>
    );
  }

  // A locked header or footer: as visitors see it; hovering outlines it and
  // offers "Edit header", and a click anywhere on it opens it.
  if (props.global && !props.global.open) {
    const { name, onOpen } = props.global;
    return (
      <div className="relative" data-section-chrome={instance} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {children}
        <button
          type="button"
          aria-label={`Edit ${name.toLowerCase()}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onOpen}
          className={`absolute inset-0 z-[35] block cursor-pointer ${editorUi} transition-shadow duration-150 ${hover && !dragging ? "shadow-[inset_0_0_0_2px_#bb4e1c]" : ""}`}
        >
          <AnimatePresence>
            {hover && !dragging && (
              <span key="edit" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <motion.span {...pop} className={`${toolbarCard} h-11 px-3`}>
                  <Pencil aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">Edit {name.toLowerCase()}</span>
                </motion.span>
              </span>
            )}
          </AnimatePresence>
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative"
      data-section-chrome={instance}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setOpen(null);
      }}
    >
      {children}

      <AnimatePresence>{dragging === instance && <GridOverlay key="grid" />}</AnimatePresence>

      <AnimatePresence>
        {shown && (
          <motion.div
            key="chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`pointer-events-none absolute inset-0 z-[35] ${editorUi} ring-1 ring-inset ring-[#bb4e1c]`}
          >
            {/* Add section, at the top and bottom edges (not around an open
                header or footer, which is too short for them) */}
            {(props.global ? [] : (["before", "after"] as const)).map((where) => (
              <div key={where} className={`pointer-events-auto absolute left-1/2 -translate-x-1/2 ${where === "before" ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2"}`}>
                <button
                  type="button"
                  onClick={() => toggle(where)}
                  aria-expanded={open === where}
                  className="flex h-7 cursor-pointer items-center gap-1 rounded-lg bg-[#bb4e1c] pl-2 pr-2.5 text-xs font-medium text-white shadow-[0_4px_12px_-4px_rgb(0_0_0/0.3)] transition-colors hover:bg-[#9c4117]"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                  Add section
                </button>
                <AnimatePresence>
                  {open === where && (
                    <Menu
                      key={where}
                      title={where === "before" ? "Add a section above" : "Add a section below"}
                      items={layouts}
                      onPick={(base) => {
                        props.onAddSection(where, base);
                        close();
                      }}
                      className="left-1/2 top-full mt-2 -translate-x-1/2"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Layers and Add block */}
            <div className="pointer-events-auto absolute left-3 top-3">
              <div className={toolbarCard}>
                <ToolButton label="Layers" Icon={Layers} active={open === "layers"} onClick={() => toggle("layers")} />
                <ToolDivider />
                <ToolButton label="Add block" Icon={Plus} wide active={open === "block"} onClick={() => toggle("block")} />
              </div>
              <AnimatePresence>
                {open === "layers" && (
                  <Menu
                    key="layers"
                    title="Layers"
                    items={blocks}
                    onPick={(id) => {
                      props.onSelectBlock(id);
                      close();
                    }}
                    className="left-0 top-full mt-2"
                  />
                )}
                {open === "block" && (
                  <motion.div key="block" {...pop} className={`${menuCard} absolute left-0 top-full z-50 mt-2 grid w-48 grid-cols-2 gap-1`}>
                    {([
                      ["text", "Text", Type],
                      ["image", "Image", ImageIcon],
                    ] as const).map(([kind, name, Icon]) => (
                      <button
                        key={kind}
                        type="button"
                        onClick={() => {
                          props.onAddBlock(kind);
                          close();
                        }}
                        className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-[13px] font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
                      >
                        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                        {name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* The section's tools, in one row: edit and layouts (coming
                soon), duplicate, and Remove */}
            <div className="pointer-events-auto absolute right-3 top-3">
              <div className={toolbarCard}>
                <ToolButton label="Edit section" Icon={Pencil} soon />
                <ToolButton label="Layouts" Icon={LayoutTemplate} soon />
                <ToolDivider />
                <ToolButton label="Duplicate section" Icon={Copy} onClick={props.onDuplicate} />
                <ToolDivider />
                <ToolButton label="Remove section" Icon={Trash2} danger disabled={!props.onRemove} onClick={props.onRemove} />
                {props.global?.open && (
                  <>
                    <ToolDivider />
                    <ToolButton label="Done" Icon={Check} wide onClick={props.global.onDone} />
                  </>
                )}
              </div>
            </div>

            {/* The height handle (not on an open header or footer) */}
            {!props.global && (
              <Tooltip label="Section height" side="left">
                <button
                  type="button"
                  aria-label="Drag to change the section's height"
                  onPointerDown={handleDown}
                  onPointerMove={handleMove}
                  onPointerUp={handleUp}
                  onPointerCancel={handleUp}
                  className="pointer-events-auto absolute bottom-6 right-28 grid h-7 w-8 cursor-ns-resize touch-none place-items-center rounded-lg bg-[#bb4e1c] text-white shadow-[0_4px_12px_-4px_rgb(0_0_0/0.3)] transition-colors hover:bg-[#9c4117]"
                >
                  <MoveVertical aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </Tooltip>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
