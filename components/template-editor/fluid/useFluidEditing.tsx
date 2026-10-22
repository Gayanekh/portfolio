"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignVerticalJustifyCenter,
  ArrowDownToLine,
  ArrowUpToLine,
  CaseSensitive,
  Copy,
  ImagePlus,
  Link2,
  Plus,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { baseOf, definitionOf, newInstance, sectionOrder, type AddedBlock, type GridSpot, type MediaMeta, type PageLayout, type VerticalAlign } from "@/components/site-templates/core/layout";
import { plainText } from "@/components/site-templates/core/rich-format";
import type { EditHooks, TemplateContent, TemplateDefinition } from "@/components/site-templates/core/types";
import BlockFrame, { type Resize, type ToolAction } from "./BlockFrame";
import RichEditable from "./RichEditable";
import ImagePanel from "./ImagePanel";
import SectionChrome from "./SectionChrome";
import SectionPanel from "./SectionPanel";
import { editorFont, type CanvasState } from "./canvas";

// The Fluid Engine editing of a site template page (see the reference): its
// sections' chrome, its blocks selected, moved on the grid, duplicated and
// deleted, blocks added, and the image panel. Everything it changes is the
// page's content and layout, through the editor's undo history.

export interface FluidDoc {
  content: TemplateContent;
  layout?: PageLayout;
}

interface History<T> {
  value: T;
  update: (next: T | ((value: T) => T)) => void;
  commit: () => void;
}

// The image whose panel is open; `pick` opens the file picker straight away
// (the empty box's "+"), `link` starts on its link (the toolbar's "Edit link").
type ImageTarget = ({ section: string; field: string } | { section: string; added: string }) & { pick?: boolean; link?: boolean };

const uid = () => Math.random().toString(36).slice(2, 9);
const isImageValue = (value: string) => /^(https?:)?\/\/|^\/|^data:image\//.test(value);
const fileName = (src: string) => decodeURIComponent(src.split("?")[0].split("/").pop() || "Image");

export function useFluidEditing<T extends FluidDoc>({
  template,
  history,
  setContent,
  onEditContent,
}: {
  template: TemplateDefinition;
  history: History<T>;
  setContent: (section: string, field: string, value: string) => void;
  onEditContent: (section: string) => void;
}) {
  const doc = history.value;
  const [selected, setSelected] = useState<string | null>(null);
  const [typing, setTyping] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [imageTarget, setImageTarget] = useState<ImageTarget | null>(null);
  // The section whose "Edit section" panel is open. One panel at a time:
  // opening the image panel closes it, and the other way round.
  const [sectionTarget, setSectionTarget] = useState<string | null>(null);
  const openImage = (target: ImageTarget) => {
    setSectionTarget(null);
    setImageTarget(target);
  };
  const openSection = (section: string) => {
    setImageTarget(null);
    setSectionTarget(section);
  };
  const order = sectionOrder(template, doc.layout);
  // The site’s pages for links: its sections in the menu, by anchor.
  const pages = order.flatMap((instance) => {
    const menu = definitionOf(template, instance)?.menu;
    return menu ? [{ label: menu, href: `#${instance}` }] : [];
  });

  const change = (next: (d: T) => T) => {
    history.update(next);
    history.commit();
  };
  const changeLayout = (next: (layout: PageLayout) => PageLayout, commit = true) => {
    history.update((d) => ({ ...d, layout: next(d.layout ?? {}) }));
    if (commit) history.commit();
  };
  const select = (id: string | null) => {
    setSelected(id);
    if (typing && typing !== id) setTyping(null);
  };

  /* ---------- Sections ---------- */

  const placeSection = (index: number, base: string) =>
    change((d) => {
      const current = sectionOrder(template, d.layout);
      const id = newInstance(base, current);
      const next = [...current];
      next.splice(index, 0, id);
      return { ...d, content: { ...d.content, [id]: { ...definitionOf(template, base)!.defaults } }, layout: { ...d.layout, order: next } };
    });

  const replaceSection = (instance: string, base: string) =>
    change((d) => {
      const current = sectionOrder(template, d.layout);
      const id = newInstance(base, current.filter((item) => item !== instance));
      return {
        ...d,
        content: { ...d.content, [id]: { ...definitionOf(template, base)!.defaults } },
        layout: { ...d.layout, order: current.map((item) => (item === instance ? id : item)) },
      };
    });

  const duplicateSection = (instance: string) =>
    change((d) => {
      const current = sectionOrder(template, d.layout);
      const id = newInstance(baseOf(instance), current);
      const next = [...current];
      next.splice(current.indexOf(instance) + 1, 0, id);
      const layout = d.layout ?? {};
      const moved = Object.fromEntries(
        Object.entries(layout.moved ?? {}).flatMap(([key, spot]) => (key.startsWith(`${instance}.`) ? [[`${id}.${key.slice(instance.length + 1)}`, spot]] : [])),
      );
      return {
        ...d,
        content: { ...d.content, [id]: { ...d.content[instance] } },
        layout: {
          ...layout,
          order: next,
          moved: { ...layout.moved, ...moved },
          added: { ...layout.added, [id]: (layout.added?.[instance] ?? []).map((block) => ({ ...block, id: uid() })) },
          extra: { ...layout.extra, [id]: layout.extra?.[instance] ?? 0 },
        },
      };
    });

  const moveSection = (instance: string, step: -1 | 1) =>
    changeLayout((layout) => {
      const current = sectionOrder(template, layout);
      const from = current.indexOf(instance);
      const to = from + step;
      if (to < 0 || to >= current.length) return layout;
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return { ...layout, order: next };
    });

  const removeSection = (instance: string) => changeLayout((layout) => ({ ...layout, order: sectionOrder(template, layout).filter((item) => item !== instance) }));

  const setExtra = (instance: string, rows: number, done: boolean) => changeLayout((layout) => ({ ...layout, extra: { ...layout.extra, [instance]: rows } }), done);

  /* ---------- Template blocks (its text and images) ---------- */

  const moveBlock = (key: string, cols: number, rows: number) =>
    changeLayout((layout) => {
      const spot = layout.moved?.[key] ?? { col: 0, row: 0 };
      return { ...layout, moved: { ...layout.moved, [key]: { col: spot.col + cols, row: spot.row + rows } } };
    });
  const resetBlock = (key: string) =>
    changeLayout((layout) => {
      const moved = { ...layout.moved };
      delete moved[key];
      return { ...layout, moved };
    });
  const isMoved = (key: string) => Boolean(doc.layout?.moved?.[key]);

  // Template images' settings (focal point, link, alt text, file name).
  const setMedia = (key: string, patch: Partial<MediaMeta>, commit = true) =>
    changeLayout((layout) => ({ ...layout, media: { ...layout.media, [key]: { ...layout.media?.[key], ...patch } } }), commit);
  // Images inside a card or a slide (the card is a link itself): no link of their own.
  const fixedImages = useRef(new Set<string>());

  // Resizing: a block's spot when its handle was picked up, so each step of
  // the drag is measured from there.
  const resizeFrom = useRef<Record<string, GridSpot>>({});
  const resizeBlock = (key: string, size: Resize, done: boolean) => {
    const from = (resizeFrom.current[key] ??= doc.layout?.moved?.[key] ?? { col: 0, row: 0 });
    changeLayout(
      (layout) => ({
        ...layout,
        moved: { ...layout.moved, [key]: { ...from, col: from.col + size.colShift, row: from.row + size.rowShift, cols: size.cols, rows: size.rows } },
      }),
      done,
    );
    if (done) delete resizeFrom.current[key];
  };

  // Where content sits in a block taller than it: top, middle, bottom, in turn.
  const VALIGNS: VerticalAlign[] = ["top", "middle", "bottom"];
  const VALIGN_ICON = { top: ArrowUpToLine, middle: AlignVerticalJustifyCenter, bottom: ArrowDownToLine };
  const nextValign = (current?: VerticalAlign) => VALIGNS[(VALIGNS.indexOf(current ?? "top") + 1) % VALIGNS.length];
  const valignAction = (current: VerticalAlign | undefined, apply: (valign: VerticalAlign) => void): ToolAction => ({
    label: `Align ${nextValign(current)}`,
    Icon: VALIGN_ICON[current ?? "top"],
    onClick: () => apply(nextValign(current)),
    group: true,
  });
  const setMovedValign = (key: string, valign: VerticalAlign) =>
    changeLayout((layout) => ({ ...layout, moved: { ...layout.moved, [key]: { ...(layout.moved?.[key] ?? { col: 0, row: 0 }), valign } } }));

  /* ---------- Added blocks ---------- */

  const addedOf = (section: string) => doc.layout?.added?.[section] ?? [];
  const setAdded = (section: string, next: (blocks: AddedBlock[]) => AddedBlock[], commit = true) =>
    changeLayout((layout) => ({ ...layout, added: { ...layout.added, [section]: next(layout.added?.[section] ?? []) } }), commit);
  const updateAdded = (section: string, id: string, patch: Partial<AddedBlock>, commit = true) =>
    setAdded(section, (blocks) => blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)), commit);

  const addBlock = (section: string, kind: "text" | "image", from?: Partial<AddedBlock>) => {
    const block: AddedBlock = { col: kind === "text" ? 7 : 8, row: 2, cols: kind === "text" ? 10 : 8, text: "", ...from, kind, id: uid() };
    setAdded(section, (blocks) => [...blocks, block]);
    const id = `add:${section}:${block.id}`;
    setSelected(id);
    if (kind === "text" && !from) setTyping(id);
    if (kind === "image" && !from) openImage({ section, added: block.id });
    return id;
  };

  // Centre an added block across the section, or down it (measured on the page).
  const centre = (section: string, block: AddedBlock, axis: "x" | "y") => {
    if (axis === "x") return updateAdded(section, block.id, { col: Math.round((24 - block.cols) / 2) });
    const frame = document.querySelector(`[data-section-frame="${section}"]`);
    const element = document.querySelector(`[data-added-block="${block.id}"]`);
    if (!frame || !element) return;
    const rows = Math.round((frame.getBoundingClientRect().height - element.getBoundingClientRect().height) / 2 / 24);
    updateAdded(section, block.id, { row: Math.max(0, rows) });
  };

  /* ---------- The selected block's actions (toolbar and keys) ---------- */

  const blockActions = (id: string): { actions: ToolAction[]; remove?: () => void; duplicate?: () => void } => {
    const [kind, rest] = id.startsWith("img:") ? ["image", id.slice(4)] : id.startsWith("add:") ? ["added", id.slice(4)] : ["text", id];
    if (kind === "added") {
      const [section, blockId] = rest.split(":");
      const block = addedOf(section).find((item) => item.id === blockId);
      if (!block) return { actions: [] };
      const remove = () => {
        setAdded(section, (blocks) => blocks.filter((item) => item.id !== blockId));
        setSelected(null);
      };
      const duplicate = () => addBlock(section, block.kind, { ...block, row: block.row + 2 });
      const edit = block.kind === "text" ? () => setTyping(id) : () => openImage({ section, added: blockId });
      return {
        remove,
        duplicate,
        actions: [
          ...(block.kind === "text" ? [{ label: "Text styles", Icon: CaseSensitive, text: "Aa", onClick: edit }] : []),
          { label: block.kind === "text" ? "Edit text" : "Edit image", Icon: Pencil, onClick: edit },
          ...(block.kind === "image" ? [{ label: "Edit link", Icon: Link2, onClick: () => openImage({ section, added: blockId, link: true }) }] : []),
          // An image's toolbar is Edit, Link, Duplicate and Delete (as in the reference).
          ...(block.kind === "text"
            ? [
                valignAction(block.valign, (valign) => updateAdded(section, block.id, { valign })),
                { label: "Centre horizontally", Icon: AlignCenterHorizontal, onClick: () => centre(section, block, "x") },
                { label: "Centre vertically", Icon: AlignCenterVertical, onClick: () => centre(section, block, "y") },
              ]
            : []),
          { label: "Duplicate", Icon: Copy, onClick: duplicate, keys: ["Ctrl", "D"], group: true },
          { label: "Delete", Icon: Trash2, onClick: remove, keys: ["Del"], danger: true },
        ],
      };
    }
    const [section, field] = [rest.slice(0, rest.indexOf(".")), rest.slice(rest.indexOf(".") + 1)];
    const value = doc.content[section]?.[field] ?? "";
    // The toolbar's Delete: an image goes from the page altogether (the image
    // panel's bin only removes its picture); text is cleared.
    const remove = () => {
      if (kind === "image") {
        setMedia(rest, { hidden: true });
        setImageTarget(null);
        setSelected(null);
        return;
      }
      setContent(section, field, "");
      history.commit();
    };
    // A copy of template text or an image is an added block of the section.
    const duplicate = () => addBlock(section, kind === "image" ? "image" : "text", kind === "image" ? { src: value, col: 2, row: 2 } : { text: value, col: 2, row: 2 });
    return {
      remove,
      duplicate,
      actions: [
        ...(kind === "image" ? [] : [{ label: "Text styles", Icon: CaseSensitive, text: "Aa", onClick: () => setTyping(id) }]),
        kind === "image"
          ? { label: "Edit image", Icon: value ? Pencil : ImagePlus, onClick: () => openImage({ section, field }) }
          : { label: "Edit text", Icon: Pencil, onClick: () => setTyping(id) },
        ...(kind === "image" && !fixedImages.current.has(rest) ? [{ label: "Edit link", Icon: Link2, onClick: () => openImage({ section, field, link: true }) }] : []),
        // An image's toolbar is Edit, Link, Duplicate and Delete (as in the reference).
        ...(kind === "image" ? [] : [valignAction(doc.layout?.moved?.[rest]?.valign, (valign) => setMovedValign(rest, valign))]),
        ...(isMoved(rest) ? [{ label: "Back to its place", Icon: RotateCcw, onClick: () => resetBlock(rest) }] : []),
        { label: "Duplicate", Icon: Copy, onClick: duplicate, keys: ["Ctrl", "D"], group: true },
        { label: kind === "image" ? "Delete" : "Clear text", Icon: Trash2, onClick: remove, keys: ["Del"], danger: true },
      ],
    };
  };

  // Delete and Ctrl/Cmd + D act on the selected block, unless typing. (Set
  // up again on every render, so it always sees the current selection.)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const current = selected;
      if (!current || typing) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      const { remove, duplicate } = blockActions(current);
      if ((event.key === "Delete" || event.key === "Backspace") && remove) {
        event.preventDefault();
        remove();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d" && duplicate) {
        event.preventDefault();
        duplicate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---------- The page's edit hooks ---------- */

  const layersOf = (section: string) => {
    const definition = definitionOf(template, section);
    const names = definition?.fields?.map((field) => [field.name, field.label] as const) ?? Object.keys(definition?.defaults ?? {}).map((name) => [name, name] as const);
    return [
      ...names.map(([name, label]) => ({ id: isImageValue(doc.content[section]?.[name] ?? "") ? `img:${section}.${name}` : `${section}.${name}`, label })),
      ...addedOf(section).map((block) => ({ id: `add:${section}:${block.id}`, label: block.kind === "text" ? `Text: ${plainText(block.text ?? "").slice(0, 24) || "empty"}` : "Image" })),
    ];
  };

  const edit: EditHooks = {
    renderText: (section, field, value) => {
      const id = `${section}.${field}`;
      return (
        <BlockFrame
          id={id}
          section={section}
          tag="Text"
          actions={blockActions(id).actions}
          onEdit={() => setTyping(id)}
          onMove={(cols, rows) => moveBlock(id, cols, rows)}
          onResize={(size, done) => resizeBlock(id, size, done)}
        >
          <RichEditable inline pages={pages} value={value} typing={typing === id} onChange={(next) => setContent(section, field, next)} onCommit={history.commit} onStop={() => setTyping(null)} />
        </BlockFrame>
      );
    },
    renderMedia: (section, field, image, options) => {
      const id = `img:${section}.${field}`;
      const fixed = options?.fixed ?? false;
      if (fixed) fixedImages.current.add(`${section}.${field}`);
      else fixedImages.current.delete(`${section}.${field}`);
      return (
        <BlockFrame
          fill
          id={id}
          section={section}
          tag="Image"
          actions={blockActions(id).actions}
          onEdit={() => openImage({ section, field })}
          movable={!fixed}
          onMove={(cols, rows) => moveBlock(`${section}.${field}`, cols, rows)}
          onResize={fixed ? undefined : (size, done) => resizeBlock(`${section}.${field}`, size, done)}
        >
          {image ?? <EmptyImage onAdd={() => openImage({ section, field, pick: true })} />}
        </BlockFrame>
      );
    },
    renderAdded: (section, block) => {
      const id = `add:${section}:${block.id}`;
      const onMove = (cols: number, rows: number) =>
        updateAdded(section, block.id, { col: Math.min(24 - block.cols, Math.max(0, block.col + cols)), row: Math.max(0, block.row + rows) });
      // Resized with its handles: measured from where the handle was picked up.
      const onResize = (size: Resize, done: boolean) => {
        const from = (resizeFrom.current[id] ??= { col: block.col, row: block.row, cols: block.cols, rows: block.rows });
        const cols = Math.min(24, size.cols);
        updateAdded(section, block.id, { col: Math.min(24 - cols, Math.max(0, from.col + size.colShift)), row: Math.max(0, from.row + size.rowShift), cols, rows: size.rows }, done);
        if (done) delete resizeFrom.current[id];
      };
      if (block.kind === "image") {
        return (
          <BlockFrame id={id} section={section} tag="Image" actions={blockActions(id).actions} onEdit={() => openImage({ section, added: block.id })} onMove={onMove} onResize={onResize}>
            {block.src ? (
              // eslint-disable-next-line @next/next/no-img-element -- user images from any host
              <img src={block.src} alt={block.alt ?? ""} draggable={false} className="block h-auto w-full" />
            ) : (
              <EmptyImage tall onAdd={() => openImage({ section, added: block.id, pick: true })} />
            )}
          </BlockFrame>
        );
      }
      return (
        <BlockFrame id={id} section={section} tag="Text" actions={blockActions(id).actions} onEdit={() => setTyping(id)} onMove={onMove} onResize={onResize}>
          <span className="block whitespace-pre-line text-[length:clamp(1rem,1.4cqw,1.25rem)] leading-relaxed">
            <RichEditable
              pages={pages}
              inline={false}
              value={block.text ?? ""}
              typing={typing === id}
              onChange={(text) => updateAdded(section, block.id, { text }, false)}
              onCommit={history.commit}
              onStop={() => setTyping(null)}
            />
          </span>
        </BlockFrame>
      );
    },
    renderSection: (section, children) => {
      const index = order.indexOf(section);
      const definition = definitionOf(template, section);
      return (
        <SectionChrome
          instance={section}
          first={index <= 0}
          last={index === order.length - 1}
          layouts={template.sections.map(({ id, label }) => ({ id, label }))}
          blocks={layersOf(section)}
          extraRows={doc.layout?.extra?.[section] ?? 0}
          onAddSection={(where, base) => placeSection(Math.max(0, index) + (where === "after" ? 1 : 0), base)}
          onLayout={(base) => replaceSection(section, base)}
          onEditSection={() => openSection(section)}
          onEditContent={definition?.fields?.length ? () => onEditContent(section) : undefined}
          onDuplicate={() => duplicateSection(section)}
          onMove={(step) => moveSection(section, step)}
          onRemove={order.length > 1 ? () => removeSection(section) : undefined}
          onAddBlock={(kind) => addBlock(section, kind)}
          onSelectBlock={(id) => {
            setSelected(id);
            document.querySelector(`[data-block="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          onHeight={(rows, done) => setExtra(section, rows, done)}
        >
          {children}
        </SectionChrome>
      );
    },
  };

  // The block of the open image panel (the same ids as the blocks on the page).
  const panelFor = imageTarget ? ("added" in imageTarget ? `add:${imageTarget.section}:${imageTarget.added}` : `img:${imageTarget.section}.${imageTarget.field}`) : null;
  const canvas: CanvasState = { selected, select, typing, setTyping, dragging, setDragging, panelFor };

  /* ---------- The image panel ---------- */

  const imageBlock = imageTarget && "added" in imageTarget ? addedOf(imageTarget.section).find((block) => block.id === imageTarget.added) : undefined;
  const imageSrc = imageTarget ? ("added" in imageTarget ? (imageBlock?.src ?? "") : (doc.content[imageTarget.section]?.[imageTarget.field] ?? "")) : "";
  // A template image's key and settings.
  const imageKey = imageTarget && "field" in imageTarget ? `${imageTarget.section}.${imageTarget.field}` : null;
  const imageMeta = imageKey ? doc.layout?.media?.[imageKey] : undefined;
  const imageName = (imageBlock ? imageBlock.name : imageMeta?.name) || (imageSrc ? fileName(imageSrc) : "");
  // A setting of the open image: the added image's own, or the template image's.
  const imageSetting = (key: "href" | "alt" | "name") =>
    imageBlock && imageTarget
      ? { value: imageBlock[key] ?? "", onChange: (value: string) => updateAdded(imageTarget.section, imageBlock.id, { [key]: value }, false), onCommit: history.commit }
      : imageKey
        ? { value: imageMeta?.[key] ?? "", onChange: (value: string) => setMedia(imageKey, { [key]: value }, false), onCommit: history.commit }
        : undefined;
  const imagePanel: ReactNode = (
    <AnimatePresence>
      {imageTarget && (
        <ImagePanel
          key={"added" in imageTarget ? imageTarget.added : `${imageTarget.section}.${imageTarget.field}`}
          anchor={panelFor ?? undefined}
          src={imageSrc}
          name={imageName}
          onImage={(src, file) => {
            // A new picture takes its file's name; removing it clears the name.
            if ("added" in imageTarget) updateAdded(imageTarget.section, imageTarget.added, { src, name: src ? (file ?? "") : "" });
            else {
              setContent(imageTarget.section, imageTarget.field, src);
              setMedia(`${imageTarget.section}.${imageTarget.field}`, { name: src ? (file ?? "") : "" });
            }
          }}
          focal={
            imageKey
              ? { value: imageMeta?.focal, onChange: (focal, done) => setMedia(imageKey, { focal }, done) }
              : undefined
          }
          link={imageKey && fixedImages.current.has(imageKey) ? undefined : imageSetting("href")}
          filename={imageSetting("name")}
          alt={imageSetting("alt")}
          pickNow={imageTarget.pick}
          pages={pages}
          linkNow={imageTarget.link}
          onClose={() => setImageTarget(null)}
        />
      )}
    </AnimatePresence>
  );

  /* ---------- The section panel ---------- */

  // Gone with its section (removed, or replaced by another layout).
  const panelSection = sectionTarget && order.includes(sectionTarget) ? sectionTarget : null;
  const sectionPanel: ReactNode = (
    <AnimatePresence>
      {panelSection && (
        <SectionPanel
          key={panelSection}
          title={definitionOf(template, panelSection)?.label ?? "Section"}
          extraRows={doc.layout?.extra?.[panelSection] ?? 0}
          layouts={template.sections.map(({ id, label }) => ({ id, label }))}
          layout={baseOf(panelSection)}
          onHeight={(rows, done) => setExtra(panelSection, rows, done)}
          onLayout={(base) => {
            setSectionTarget(null);
            replaceSection(panelSection, base);
          }}
          onEditContent={
            definitionOf(template, panelSection)?.fields?.length
              ? () => {
                  setSectionTarget(null);
                  onEditContent(panelSection);
                }
              : undefined
          }
          onClose={() => setSectionTarget(null)}
        />
      )}
    </AnimatePresence>
  );

  // Leaving edit mode: nothing selected, typed into or open.
  const reset = () => {
    setSelected(null);
    setTyping(null);
    setImageTarget(null);
    setSectionTarget(null);
  };

  return { edit, canvas, imagePanel, sectionPanel, reset, deselect: () => select(null) };
}

// Where an image goes before one is added, as in the reference: a white box
// with a round "+" in the middle, which opens the file picker.
function EmptyImage({ tall = false, onAdd }: { tall?: boolean; onAdd: () => void }) {
  return (
    <span className={`grid w-full place-items-center bg-white ${editorFont} ${tall ? "aspect-[4/3]" : "h-full min-h-32"}`}>
      <button
        type="button"
        aria-label="Add an image"
        title="Add an image"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={onAdd}
        className="grid size-9 cursor-pointer place-items-center rounded bg-neutral-100 text-neutral-900 transition-colors hover:bg-neutral-200"
      >
        <Plus className="h-4 w-4" />
      </button>
    </span>
  );
}
