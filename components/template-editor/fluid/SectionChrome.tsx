"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
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
  children: ReactNode;
}

type Open = "before" | "after" | "layouts" | "layers" | "block" | null;
const smooth = [0.22, 1, 0.36, 1] as const;
const card = `rounded-md bg-white ${editorUi} shadow-[0_2px_12px_rgb(0_0_0/0.14)] ring-1 ring-black/5`;
const row = "flex w-full cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-800 transition-colors hover:bg-neutral-100";
const iconCell = "grid size-7 cursor-pointer place-items-center rounded text-neutral-800 transition-colors hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-300 disabled:hover:bg-transparent";

function Menu({ title, items, onPick, className }: { title: string; items: ChoiceItem[]; onPick: (id: string) => void; className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.16, ease: smooth }}
      className={`${card} absolute z-50 w-56 p-1 ${className}`}
    >
      <p className="m-0 px-2.5 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-400">{title}</p>
      {items.length ? (
        items.map((item) => (
          <button key={item.id} type="button" onClick={() => onPick(item.id)} className={`${row} font-medium normal-case tracking-normal`}>
            <span className="truncate text-xs">{item.label}</span>
          </button>
        ))
      ) : (
        <p className="m-0 px-2.5 py-2 text-xs text-neutral-500">Nothing here yet.</p>
      )}
    </motion.div>
  );
}

// A section while editing, after the reference's Fluid Engine: hovering it
// outlines it in blue with "Add section" at its top and bottom edges, Layers
// and Add block at its top left, and on the right its menu (Edit section,
// View layouts, duplicate, move up, move down, Remove) and Edit content. A
// handle at its bottom right drags its height. While a block in it is
// dragged, it shows the grid.
export default function SectionChrome(props: SectionChromeProps) {
  const { instance, first, last, layouts, blocks, extraRows, children } = props;
  const { dragging, setDragging } = useCanvas();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState<Open>(null);
  const resize = useRef<{ y: number; rows: number } | null>(null);
  const [resizing, setResizing] = useState(false);
  // Hidden while a block is dragged (the grid shows instead), but not while
  // its own height handle is.
  const shown = resizing || ((hover || open !== null) && !dragging);
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
            className={`pointer-events-none absolute inset-0 z-[35] ${editorUi} ring-1 ring-inset ring-[#3b82f6]`}
          >
            {/* Add section, at the top and bottom edges */}
            {(["before", "after"] as const).map((where) => (
              <div key={where} className={`pointer-events-auto absolute left-1/2 -translate-x-1/2 ${where === "before" ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2"}`}>
                <button
                  type="button"
                  onClick={() => toggle(where)}
                  className="cursor-pointer rounded bg-[#3b82f6] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition-colors hover:bg-[#2563eb]"
                >
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
            <div className="pointer-events-auto absolute left-3 top-3 flex items-start gap-1.5">
              <div className="relative">
                <button type="button" aria-label="Layers" onClick={() => toggle("layers")} className={`${card} grid size-8 cursor-pointer place-items-center text-neutral-800 hover:bg-neutral-50`}>
                  <Layers className="h-3.5 w-3.5" />
                </button>
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
                </AnimatePresence>
              </div>
              <div className="relative">
                <button type="button" onClick={() => toggle("block")} className={`${card} flex h-8 cursor-pointer items-center gap-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-neutral-800 hover:bg-neutral-50`}>
                  <Plus className="h-3.5 w-3.5" />
                  Add block
                </button>
                <AnimatePresence>
                  {open === "block" && (
                    <motion.div
                      key="block"
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: smooth }}
                      className={`${card} absolute left-0 top-full z-50 mt-2 grid w-44 grid-cols-2 gap-1 p-1`}
                    >
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
                          className="flex cursor-pointer flex-col items-center gap-1.5 rounded px-2 py-3 text-[11px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
                        >
                          <Icon className="h-4 w-4" />
                          {name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* The section's menu */}
            <div className="pointer-events-auto absolute right-3 top-3 flex w-[176px] flex-col gap-2">
              <div className={`${card} flex flex-col p-1`}>
                {props.onEditSection && (
                  <button type="button" onClick={props.onEditSection} className={row}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit section
                  </button>
                )}
                <div className="relative">
                  <button type="button" onClick={() => toggle("layouts")} className={row}>
                    <LayoutTemplate className="h-3.5 w-3.5" />
                    View layouts
                  </button>
                  <AnimatePresence>
                    {open === "layouts" && (
                      <Menu
                        key="layouts"
                        title="Change to"
                        items={layouts}
                        onPick={(base) => {
                          props.onLayout(base);
                          close();
                        }}
                        className="right-full top-0 mr-2"
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-0.5 border-y border-neutral-100 px-1.5 py-1">
                  <button type="button" aria-label="Duplicate section" title="Duplicate section" onClick={props.onDuplicate} className={iconCell}>
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" aria-label="Move section up" title="Move up" disabled={first} onClick={() => props.onMove(-1)} className={iconCell}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" aria-label="Move section down" title="Move down" disabled={last} onClick={() => props.onMove(1)} className={iconCell}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button type="button" onClick={props.onRemove} disabled={!props.onRemove} className={`${row} text-red-600 hover:bg-red-50 disabled:cursor-default disabled:text-neutral-300 disabled:hover:bg-transparent`}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
              {props.onEditContent && (
                <button type="button" onClick={props.onEditContent} className={`${card} ${row} py-2.5`}>
                  <Type className="h-3.5 w-3.5" />
                  Edit content
                </button>
              )}
            </div>

            {/* The height handle */}
            <button
              type="button"
              aria-label="Drag to change the section's height"
              title="Section height"
              onPointerDown={handleDown}
              onPointerMove={handleMove}
              onPointerUp={handleUp}
              onPointerCancel={handleUp}
              className="pointer-events-auto absolute bottom-6 right-28 grid h-5 w-6 cursor-ns-resize touch-none place-items-center rounded bg-[#3b82f6] text-white shadow-sm"
            >
              <MoveVertical className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
