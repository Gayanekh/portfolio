"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2, Plus, Trash2 } from "lucide-react";
import type { FocalPoint } from "@/components/site-templates/core/layout";
import { uploadPortfolioImage, validatePortfolioImage } from "@/lib/portfolio-images";
import { LinkCard, LinkForm, type LinkPage } from "./LinkEditor";

const label = "text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500";
const input = "w-full rounded-md border border-transparent bg-neutral-100 px-2.5 py-2.5 text-[13px] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white";

interface TextSetting {
  value: string;
  onChange: (value: string) => void;
  onCommit: () => void;
}

// An image's panel, after the reference: the picture with its focal point
// (drag the circle to choose the part kept in view when the box crops it),
// its name, Replace and a delete button (or "Add an image" when there is
// none), then its link (the same link editor and card as the text editor's,
// see LinkEditor), its alternate filename and its alt text. Images
// upload to the account's image storage, like the template builder's; while
// one uploads, a bar runs under the picture.
export default function ImagePanel({
  src,
  name,
  onImage,
  focal,
  link,
  filename,
  alt,
  pages = [],
  anchor,
  pickNow = false,
  linkNow = false,
  onClose,
}: {
  src: string;
  name: string;
  // A new picture (and the name of its file), or "" to remove it.
  onImage: (src: string, fileName?: string) => void;
  // Images the template crops have a focal point.
  focal?: { value?: FocalPoint; onChange: (focal: FocalPoint, done: boolean) => void };
  // Images that can link somewhere (not those inside a card, which is a link itself).
  link?: TextSetting;
  filename?: TextSetting;
  alt?: TextSetting;
  // The site's pages, offered when linking (as in the text editor).
  pages?: LinkPage[];
  // The image's block on the page (its data-block id): the panel opens beside it.
  anchor?: string;
  // Open the file picker straight away (the empty box's "+").
  pickNow?: boolean;
  // Start on the link (the toolbar's "Edit link").
  linkNow?: boolean;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ uploading: boolean; error: string }>({ uploading: false, error: "" });
  // Typing a link: straight away from the toolbar's "Edit link" when there is
  // none yet; a link already set shows as its card.
  const [linking, setLinking] = useState(linkNow && !link?.value);
  // A new link (or none), kept as one step.
  const setLink = (href: string | undefined) => {
    link?.onChange(href ?? "");
    link?.onCommit();
    setLinking(false);
  };
  const dragging = useRef(false);

  // Where the panel sits: beside its image (to the right when there is room,
  // else to the left, else over the canvas's right edge), its top level with
  // the image's but kept inside the canvas. Measured against the panel's own
  // offset parent, and again while the page scrolls or the window resizes.
  const panelRef = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ left: number; top: number; side: "left" | "right" } | null>(null);
  useEffect(() => {
    if (!anchor) return;
    const update = () => {
      const panel = panelRef.current;
      const parent = panel?.offsetParent as HTMLElement | null;
      const target = document.querySelector<HTMLElement>(`[data-block="${CSS.escape(anchor)}"]`);
      if (!panel || !parent || !target) return;
      const box = parent.getBoundingClientRect();
      const image = target.getBoundingClientRect();
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      const gap = 16;
      const right = image.right - box.left + gap;
      const left = image.left - box.left - gap - width;
      const side = right + width <= box.width - 8 ? "right" : left >= 8 ? "left" : "right";
      const x = side === "right" ? Math.min(right, box.width - width - 16) : left;
      const y = Math.min(Math.max(image.top - box.top, 16), Math.max(16, box.height - height - 16));
      setPlace((current) => (current && current.left === x && current.top === y && current.side === side ? current : { left: x, top: y, side }));
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
  }, [anchor]);

  // No close button: a press anywhere outside the panel (another block, a
  // section, the canvas, the sidebar) closes it, except on its own image.
  // Listened for on the way down, so nothing on the page can swallow it.
  useEffect(() => {
    const away = (event: globalThis.PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || panelRef.current?.contains(target)) return;
      if (anchor && document.querySelector(`[data-block="${CSS.escape(anchor)}"]`)?.contains(target)) return;
      onClose();
    };
    document.addEventListener("pointerdown", away, true);
    return () => document.removeEventListener("pointerdown", away, true);
  }, [anchor, onClose]);
  const point = focal?.value ?? { x: 50, y: 50 };

  // The empty box's "+": choosing a file right away.
  useEffect(() => {
    if (pickNow) fileRef.current?.click();
  }, [pickNow]);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    const invalid = validatePortfolioImage(file);
    if (invalid) return setState({ uploading: false, error: invalid });
    setState({ uploading: true, error: "" });
    try {
      onImage(await uploadPortfolioImage(file), file.name);
      setState({ uploading: false, error: "" });
    } catch (error) {
      setState({ uploading: false, error: error instanceof Error ? error.message : "Unable to upload the image." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // The focal point follows the pointer over the picture.
  const focalAt = (event: PointerEvent<HTMLSpanElement>, done: boolean) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((event.clientX - box.left) / box.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((event.clientY - box.top) / box.height) * 100)));
    focal?.onChange({ x, y }, done);
  };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-label="Edit image"
      initial={{ opacity: 0, x: place?.side === "left" ? -8 : 8, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: place?.side === "left" ? -8 : 8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={(event) => event.stopPropagation()}
      // Beside its image once measured (left/top change as the canvas scrolls).
      style={place ? { left: place.left, top: place.top } : undefined}
      className={`absolute z-50 flex max-h-[min(34rem,calc(100%-2rem))] w-[280px] flex-col rounded-xl bg-white font-ui shadow-[0_10px_34px_-6px_rgb(0_0_0/0.22),0_1px_3px_rgb(0_0_0/0.06)] ${
        place ? "" : anchor ? "invisible right-4 top-20" : "right-4 top-20"
      }`}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 pt-3">
        <span className="border-b-2 border-neutral-900 pb-2.5 text-[13px] font-semibold text-neutral-900">Content</span>
      </div>

      {/* Its parts keep their full height (none is squeezed, which would clip the
          image card's Replace and bin): the panel scrolls instead. */}
      <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-5 py-4 [&>*]:shrink-0" data-lenis-prevent>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => pick(event.target.files?.[0])} />
        {src ? (
          <div className="overflow-hidden rounded-lg bg-neutral-100">
            <div className="relative flex h-32 items-center justify-center bg-neutral-100">
              {/* The picture, and over it the focal point to drag */}
              <span
                className={`relative inline-block h-full touch-none ${focal ? "cursor-crosshair" : ""}`}
                onPointerDown={(event) => {
                  if (!focal) return;
                  dragging.current = true;
                  try {
                    event.currentTarget.setPointerCapture(event.pointerId);
                  } catch {
                    // Not an active pointer: dragging still works over the picture.
                  }
                  focalAt(event, false);
                }}
                onPointerMove={(event) => dragging.current && focalAt(event, false)}
                onPointerUp={(event) => {
                  if (!dragging.current) return;
                  dragging.current = false;
                  focalAt(event, true);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- user images from any host */}
                <img src={src} alt="" draggable={false} className={`block h-full w-auto max-w-[240px] select-none object-contain transition-opacity ${state.uploading ? "opacity-40" : ""}`} />
                {focal && !state.uploading && (
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ left: `${point.x}%`, top: `${point.y}%` }}
                    transition={{ duration: dragging.current ? 0 : 0.2 }}
                    className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.25),0_2px_6px_rgb(0_0_0/0.3)]"
                  />
                )}
              </span>
              <AnimatePresence>
                {state.uploading && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-8 bottom-4 h-1 overflow-hidden rounded-full bg-white/70"
                  >
                    <motion.span
                      className="block h-full w-1/3 rounded-full bg-neutral-800"
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-0.5 px-3 pt-2.5">
              <span className="truncate text-[13px] font-medium text-neutral-900">{state.uploading ? "Uploading..." : name}</span>
              <span className="text-[11px] text-neutral-500">Image</span>
            </div>
            {/* The picture's actions, as in the reference: Replace (another file) and
                the bin, which removes the picture and keeps its place: an empty box
                with a "+" on the page and "Add an Image" here. (The toolbar's Delete
                removes the whole image.) */}
            <div className="flex items-center justify-between px-3 pb-3 pt-3.5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={state.uploading}
                className="cursor-pointer text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-950 hover:underline disabled:cursor-default disabled:opacity-40"
              >
                {state.uploading ? "Uploading..." : "Replace"}
              </button>
              <button
                type="button"
                onClick={() => onImage("")}
                disabled={state.uploading}
                aria-label="Remove image"
                title="Remove image"
                className="grid size-8 cursor-pointer place-items-center rounded text-neutral-950 transition-colors hover:bg-neutral-200 disabled:cursor-default disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={state.uploading}
            className="flex h-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded border border-dashed border-neutral-300 text-[13px] text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            <span className="grid size-8 place-items-center rounded-full bg-neutral-100">
              <Plus className="h-4 w-4" />
            </span>
            {state.uploading ? "Uploading..." : "Add an Image"}
            <span className="text-[11px] text-neutral-400">20 MB max</span>
          </button>
        )}
        {state.error && <p className="m-0 text-xs text-red-600">{state.error}</p>}

        {link && (
          <div className="flex flex-col gap-2">
            <span className={label}>Link</span>
            {linking ? (
              <div className="rounded-lg bg-white p-3 ring-1 ring-neutral-200">
                <LinkForm value={link.value} pages={pages} onApply={setLink} onCancel={() => setLinking(false)} />
              </div>
            ) : link.value ? (
              <div className="rounded-lg bg-neutral-100 p-3.5">
                <LinkCard href={link.value} pages={pages} onEdit={() => setLinking(true)} onRemove={() => setLink(undefined)} />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLinking(true)}
                className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded border border-neutral-200 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-900 hover:bg-neutral-50"
              >
                <Link2 className="h-3.5 w-3.5" />
                Attach link
              </button>
            )}
          </div>
        )}
        {filename && (
          <label className="flex flex-col gap-2">
            <span className={label}>Alternate filename</span>
            <input value={filename.value} placeholder={name || "Image"} onChange={(event) => filename.onChange(event.target.value)} onBlur={filename.onCommit} className={input} />
          </label>
        )}
        {alt && (
          <label className="flex flex-col gap-2">
            <span className={label}>Image alt text</span>
            <input value={alt.value} onChange={(event) => alt.onChange(event.target.value)} onBlur={alt.onCommit} className={input} />
            <span className="text-[11px] leading-snug text-neutral-500">Describe your image to improve accessibility and SEO.</span>
          </label>
        )}
      </div>
    </motion.div>
  );
}
