"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { editorFont, editorUi, gridCell, useCanvas } from "./canvas";

// Keep receiving the pointer while dragging, even outside the element (a
// pointer the browser no longer tracks is simply not captured).
const capture = (event: { currentTarget: Element; pointerId: number }) => {
  try {
    event.currentTarget.setPointerCapture(event.pointerId);
  } catch {
    // Not an active pointer: dragging still works while it stays over the element.
  }
};

export interface ToolAction {
  label: string;
  Icon: LucideIcon;
  onClick: () => void;
  // Shown in the tooltip, as keys ("Ctrl", "D").
  keys?: string[];
  danger?: boolean;
  // Starts a new group, after a thin divider.
  group?: boolean;
  // Shown as text instead of the icon ("Aa" for text styles).
  text?: string;
}

// A resize, from where it started: its new size in columns and rows, and how
// far its left and top edges moved (dragging those edges).
export interface Resize {
  cols: number;
  rows: number;
  colShift: number;
  rowShift: number;
}

// The gap between a block and its toolbar, in px.
const TOOLBAR_GAP = 12;

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
// The eight square handles: where each sits and its pointer.
const HANDLES: { edge: Edge; place: string }[] = [
  { edge: "nw", place: "left-0 top-0 cursor-nwse-resize" },
  { edge: "n", place: "left-1/2 top-0 cursor-ns-resize" },
  { edge: "ne", place: "left-full top-0 cursor-nesw-resize" },
  { edge: "w", place: "left-0 top-1/2 cursor-ew-resize" },
  { edge: "e", place: "left-full top-1/2 cursor-ew-resize" },
  { edge: "sw", place: "left-0 top-full cursor-nesw-resize" },
  { edge: "s", place: "left-1/2 top-full cursor-ns-resize" },
  { edge: "se", place: "left-full top-full cursor-nwse-resize" },
];

// One block of the page while editing, after the reference's Fluid Engine:
// hover it for its outline and tag ("TEXT", "IMAGE"); click it to select it (a
// blue frame with eight square handles and a toolbar above it); double-click
// it to edit it; drag it to move it; drag a handle to resize it. While it is
// moved or resized it snaps to grid steps and its section shows the grid.
export default function BlockFrame({
  id,
  section,
  tag,
  actions,
  onEdit,
  onMove,
  onResize,
  fill = false,
  movable = true,
  children,
}: {
  id: string;
  section: string;
  tag: string;
  actions: ToolAction[];
  onEdit?: () => void;
  // Moved by this many columns and rows.
  onMove: (cols: number, rows: number) => void;
  // Resized with its handles (while dragging, then once more when let go).
  onResize?: (resize: Resize, done: boolean) => void;
  // Dragged around the grid (off for an image fixed in the template's layout).
  movable?: boolean;
  // Fill the box it is in (an image in its frame).
  fill?: boolean;
  children: ReactNode;
}) {
  const { selected, select, typing, dragging, setDragging, panelFor } = useCanvas();
  const isSelected = selected === id;
  const isTyping = typing === id;
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const start = useRef<{ x: number; y: number; cols: number; rows: number; moving: boolean } | null>(null);
  const [moving, setMoving] = useState(false);
  const sizing = useRef<{ edge: Edge; x: number; y: number; cols: number; rows: number; last: Resize | null } | null>(null);
  const [resizing, setResizing] = useState(false);

  // The toolbar goes where there is room in the canvas: above the block, or
  // below it near the top; from its left edge, or its right edge near the
  // right side. Checked when it opens and while the canvas scrolls or resizes.
  // Hidden while its panel is open, which takes over from it.
  const showToolbar = isSelected && !moving && !resizing && !isTyping && panelFor !== id && actions.length > 0;
  const toolbarRef = useRef<HTMLSpanElement>(null);
  // Screen position (the toolbar is drawn over the page, outside any box that
  // clips its content); null until measured.
  const [place, setPlace] = useState<{ top: number; left: number; below: boolean } | null>(null);
  useEffect(() => {
    if (!showToolbar) return;
    const update = () => {
      const block = ref.current;
      const bar = toolbarRef.current;
      if (!block) return;
      const area = (block.closest("[data-lenis-prevent]") ?? document.documentElement).getBoundingClientRect();
      const box = block.getBoundingClientRect();
      const width = bar?.offsetWidth ?? 320;
      const height = bar?.offsetHeight ?? 48;
      const below = box.top - area.top < height + TOOLBAR_GAP;
      const top = below ? box.bottom + TOOLBAR_GAP : box.top - height - TOOLBAR_GAP;
      const fromRight = box.left + width > area.right - 8 && box.right - width >= area.left;
      const left = Math.max(area.left + 8, Math.min(fromRight ? box.right - width : box.left, area.right - width - 8));
      setPlace((current) => (current && current.top === top && current.left === left && current.below === below ? current : { top, left, below }));
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
      // Measured afresh next time it opens.
      setPlace(null);
    };
  }, [showToolbar]);

  const handleDown = (edge: Edge) => (event: PointerEvent<HTMLSpanElement>) => {
    if (!ref.current || !onResize) return;
    event.stopPropagation();
    const box = ref.current.getBoundingClientRect();
    const cell = gridCell(ref.current);
    sizing.current = { edge, x: event.clientX, y: event.clientY, cols: Math.max(1, Math.round(box.width / cell.col)), rows: Math.max(1, Math.round(box.height / cell.row)), last: null };
    setResizing(true);
    setDragging(section);
    capture(event);
  };
  const handleMove = (event: PointerEvent<HTMLSpanElement>) => {
    const size = sizing.current;
    if (!size || !ref.current || !onResize) return;
    const cell = gridCell(ref.current);
    const dc = Math.round((event.clientX - size.x) / cell.col);
    const dr = Math.round((event.clientY - size.y) / cell.row);
    let cols = size.cols;
    let rows = size.rows;
    if (size.edge.includes("e")) cols = Math.max(2, size.cols + dc);
    if (size.edge.includes("w")) cols = Math.max(2, size.cols - dc);
    if (size.edge.includes("s")) rows = Math.max(1, size.rows + dr);
    if (size.edge.includes("n")) rows = Math.max(1, size.rows - dr);
    const next: Resize = { cols, rows, colShift: size.edge.includes("w") ? size.cols - cols : 0, rowShift: size.edge.includes("n") ? size.rows - rows : 0 };
    if (size.last && JSON.stringify(size.last) === JSON.stringify(next)) return;
    size.last = next;
    onResize(next, false);
  };
  const handleUp = () => {
    const size = sizing.current;
    sizing.current = null;
    setResizing(false);
    setDragging(null);
    if (size?.last && onResize) onResize(size.last, true);
  };

  const down = (event: PointerEvent<HTMLSpanElement>) => {
    // While typing, a press selects text: it stays here (so the canvas does
    // not deselect the block and close the text toolbar) and does not drag.
    if (isTyping) {
      event.stopPropagation();
      return;
    }
    if (event.button !== 0) return;
    event.stopPropagation();
    if (!isSelected) select(id);
    if (!movable) return;
    start.current = { x: event.clientX, y: event.clientY, cols: 0, rows: 0, moving: false };
    capture(event);
  };
  const move = (event: PointerEvent<HTMLSpanElement>) => {
    const drag = start.current;
    if (!drag || !ref.current) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moving && Math.hypot(dx, dy) < 4) return;
    if (!drag.moving) {
      drag.moving = true;
      setMoving(true);
      setDragging(section);
    }
    const cell = gridCell(ref.current);
    drag.cols = Math.round(dx / cell.col);
    drag.rows = Math.round(dy / cell.row);
    x.set(drag.cols * cell.col);
    y.set(drag.rows * cell.row);
  };
  const up = () => {
    const drag = start.current;
    start.current = null;
    if (!drag?.moving) return;
    setMoving(false);
    setDragging(null);
    x.set(0);
    y.set(0);
    if (drag.cols || drag.rows) onMove(drag.cols, drag.rows);
  };

  return (
    <motion.span
      ref={ref}
      data-block={id}
      style={{ x, y }}
      onPointerDown={down}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onEdit?.();
      }}
      className={`relative ${fill ? "block h-full w-full" : "block"} ${isTyping ? "cursor-text" : moving ? "z-40 cursor-grabbing" : "cursor-default"} ${
        isSelected || dragging ? "" : "outline-none hover:outline hover:outline-1 hover:outline-[#3b82f6]"
      }`}
    >
      {children}

      <AnimatePresence>
        {isSelected && (
          <motion.span
            key="frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute inset-0 z-20 block ring-1 ring-[#3b82f6]"
          >
            {!moving &&
              HANDLES.map(({ edge, place }) => (
                <span
                  key={edge}
                  aria-hidden="true"
                  onPointerDown={handleDown(edge)}
                  onPointerMove={handleMove}
                  onPointerUp={handleUp}
                  onPointerCancel={handleUp}
                  className={`absolute size-[7px] -translate-x-1/2 -translate-y-1/2 touch-none border border-[#3b82f6] bg-white ${onResize ? "pointer-events-auto" : ""} ${place}`}
                />
              ))}
            {(moving || resizing) && (
              <span className={`absolute -top-5 left-0 rounded-sm bg-[#3b82f6] px-1.5 py-0.5 ${editorFont} text-[9px] font-semibold uppercase tracking-[0.08em] text-white`}>{tag}</span>
            )}
          </motion.span>
        )}
        {hovered && !isSelected && !dragging && (
          <motion.span
            key="tag"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className={`pointer-events-none absolute -top-5 left-0 z-30 rounded-sm bg-[#3b82f6] px-1.5 py-0.5 ${editorFont} text-[9px] font-semibold uppercase tracking-[0.08em] text-white`}
          >
            {tag}
          </motion.span>
        )}
      </AnimatePresence>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showToolbar && (
              <motion.span
                key="toolbar"
                ref={toolbarRef}
                initial={{ opacity: 0, y: place?.below ? -4 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: place?.below ? -4 : 4 }}
                transition={{ duration: 0.16 }}
                onPointerDown={(event) => event.stopPropagation()}
                style={place ? { top: place.top, left: place.left } : undefined}
                className={`fixed z-[55] flex items-center gap-1 whitespace-nowrap rounded-xl bg-white px-2 py-1.5 ${editorUi} text-neutral-950 shadow-[0_6px_24px_-4px_rgb(0_0_0/0.16),0_1px_3px_rgb(0_0_0/0.06)] ${place ? "" : "invisible left-0 top-0"}`}
              >
                {actions.map(({ label, Icon, onClick, keys, danger, group, text }) => (
                  <span key={label} className="group/tool relative flex items-center">
                    {group && <span aria-hidden="true" className="mx-1.5 h-6 w-px bg-neutral-200" />}
                    <button
                      type="button"
                      aria-label={label}
                      onClick={onClick}
                      className={`grid h-9 min-w-9 cursor-pointer place-items-center rounded px-1.5 transition-colors ${danger ? "text-red-600 hover:bg-red-50" : "text-neutral-950 hover:bg-neutral-100"}`}
                    >
                      {text ? (
                        <span className="text-[15px] font-bold leading-none tracking-[-0.02em]">{text}</span>
                      ) : (
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      )}
                    </button>
                    <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity delay-200 duration-150 group-hover/tool:opacity-100">
                      {label}
                      {keys?.map((key) => (
                        <kbd key={key} className={`rounded bg-white/15 px-1 ${editorFont} text-[9px] font-semibold`}>
                          {key}
                        </kbd>
                      ))}
                    </span>
                  </span>
                ))}
              </motion.span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.span>
  );
}
