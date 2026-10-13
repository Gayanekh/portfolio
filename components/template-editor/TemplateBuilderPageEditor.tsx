"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Monitor,
  Paintbrush,
  Pencil,
  Play,
  Redo2,
  Smartphone,
  Type,
  Undo2,
  X,
} from "lucide-react";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";
import { createSlug } from "@/lib/portfolios";
import SelectCard from "@/components/template-editor/SelectCard";
import TemplateRenderer from "@/components/site-templates/core/TemplateRenderer";
import { mergeContent, readSiteTitle } from "@/components/site-templates/core/content";
import type { EditHooks, TemplateContent, TemplateDefinition } from "@/components/site-templates/core/types";
import { getSiteTemplate } from "@/components/site-templates/registry";
import { themeFontVariables } from "@/components/template-detail/theme-options";
import ContentPanel from "@/components/template-editor/ContentPanel";
import EditableSection, { type SectionAction } from "@/components/template-editor/EditableSection";
import EditableText from "@/components/template-editor/EditableText";
import StylesPanel from "@/components/template-editor/StylesPanel";
import { useEditHistory } from "@/components/template-editor/useEditHistory";

type Mode = "view" | "edit" | "preview";
type Device = "desktop" | "mobile";
// What the canvas shows: the home page ("all"), or one of its sections.
type Focus = string;
interface EditorDoc {
  content: TemplateContent;
  palette: string;
  font: string;
}

const defaultDoc = (template: TemplateDefinition): EditorDoc => ({ content: mergeContent(template, null), palette: "original", font: "original" });
const smooth = [0.22, 1, 0.36, 1] as const;
const slide = "transition-[width,padding,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

// The sidebar from the template's detail page, with its entrance animation.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

// The sections list in the sidebar and the top bar: the home page first,
// then the template's sections.
type SectionOption = { id: Focus; label: string; menu?: string };
const HOME_PAGE: SectionOption = { id: "all", label: "Home page" };

// Site templates have no account storage yet, so Save keeps the page in this
// browser, one entry per template.
const storageKey = (template: TemplateDefinition) => `portory-site-${template.id}`;
const readSaved = (template: TemplateDefinition): EditorDoc => {
  try {
    const raw = localStorage.getItem(storageKey(template));
    if (!raw) return defaultDoc(template);
    const saved = JSON.parse(raw);
    return {
      palette: typeof saved?.palette === "string" ? saved.palette : "original",
      font: typeof saved?.font === "string" ? saved.font : "original",
      content: mergeContent(template, saved?.content),
    };
  } catch {
    return defaultDoc(template);
  }
};
const writeSaved = (key: string, doc: EditorDoc) => {
  try {
    localStorage.setItem(key, JSON.stringify(doc));
    return true;
  } catch {
    // Storage unavailable (private mode): the page still works for this visit.
    return false;
  }
};

// Publish, like Save, stays in this browser until site templates are stored
// with the account (the portfolios API takes Minimal and Bold only). It keeps
// a copy of the page as published, to tell whether it has changed since.
const publishedKey = (key: string) => `${key}-published`;
const readPublished = (key: string): string | null => {
  try {
    return localStorage.getItem(publishedKey(key));
  } catch {
    return null;
  }
};
const writePublished = (key: string, doc: EditorDoc) => {
  try {
    localStorage.setItem(publishedKey(key), JSON.stringify(doc));
    return true;
  } catch {
    return false;
  }
};

// A small dark label under an icon button, as in the reference.
function Tip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group/tip relative flex">
      {children}
      <span className="pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity delay-300 duration-150 group-hover/tip:opacity-100">
        {label}
      </span>
    </span>
  );
}

const iconButton = "grid size-8 place-items-center rounded-md text-neutral-800 transition-colors hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-300 disabled:hover:bg-transparent";

// The page editor from the reference, for any site template (see
// components/site-templates):
// - View: the template's sidebar on the left and the page in a canvas card, with
//   Edit, the page title, desktop/mobile view, Site Styles and Preview.
// - Edit: the sidebar slides away and the canvas fills the screen. Hover a
//   section to outline it and open its menu, click any text to type into it.
//   Save, Exit (asks before discarding changes), Undo and Redo.
// - Preview: the page alone, full screen, with a close button.
export default function TemplateBuilderPageEditor({ backHref, templateId }: { backHref: string; templateId: string }) {
  // The saved page lives in this browser, so the editor starts on the client.
  const onClient = useSyncExternalStore(noSubscribe, () => true, () => false);
  const template = getSiteTemplate(templateId);
  if (!onClient || !template) return <div data-full-screen className="h-screen bg-white" />;
  return <Editor key={template.id} backHref={backHref} template={template} initial={readSaved(template)} />;
}

const noSubscribe = () => () => {};

function Editor({ backHref, template, initial }: { backHref: string; template: TemplateDefinition; initial: EditorDoc }) {
  const key = storageKey(template);
  const history = useEditHistory<EditorDoc>(initial);
  const doc = history.value;
  const [saved, setSaved] = useState<EditorDoc>(initial);
  const [mode, setMode] = useState<Mode>("view");
  const [device, setDevice] = useState<Device>("desktop");
  const [stylesOpen, setStylesOpen] = useState(false);
  // The section whose content panel is open.
  const [contentSection, setContentSection] = useState<string | null>(null);
  // The text being edited, as "section.field".
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [focus, setFocus] = useState<Focus>("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const [publishedDoc, setPublishedDoc] = useState<string | null>(() => readPublished(key));
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);
  const dirty = JSON.stringify(doc) !== JSON.stringify(saved);
  // Published, and nothing has changed since.
  const published = !dirty && publishedDoc === JSON.stringify(doc);
  const editing = mode === "edit";
  const siteTitle = readSiteTitle(template, doc.content);
  const publicPath = `/p/${createSlug(siteTitle)}`;
  const sectionOptions: SectionOption[] = [HOME_PAGE, ...template.sections.map(({ id, label, menu }) => ({ id, label, menu }))];
  const sectionLabel = (id: Focus) => sectionOptions.find((option) => option.id === id)?.label ?? HOME_PAGE.label;
  const contentDefinition = template.sections.find((section) => section.id === contentSection);
  const statusText = feedback || (dirty ? "Unsaved changes" : published ? "Published" : publishedDoc ? "Saved, not published" : "Saved");

  // A newly chosen section starts at its top.
  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 });
  }, [focus]);

  const chooseSection = (id: Focus) => {
    setFocus(id);
    setSelected(null);
    setPickerOpen(false);
    // Site Styles belong to the whole page.
    if (id !== "all") setStylesOpen(false);
  };

  // Esc closes the preview, the sections list, the open panel or the exit question.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mode === "preview") setMode("view");
      else if (pickerOpen) setPickerOpen(false);
      else if (confirmExit) setConfirmExit(false);
      else if (contentSection) setContentSection(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, pickerOpen, confirmExit, contentSection]);

  const setContent = (section: string, field: string, value: string) =>
    history.update((d) => ({ ...d, content: { ...d.content, [section]: { ...d.content[section], [field]: value } } }));

  // Outside edit mode a style change is kept straight away.
  const setStyle = (style: "palette" | "font", id: string) => {
    const next = { ...doc, [style]: id };
    history.update(next);
    history.commit();
    if (!editing) {
      writeSaved(key, next);
      setSaved(next);
    }
  };

  const save = () => {
    history.commit();
    setFeedback(writeSaved(key, doc) ? "" : "Unable to save in this browser.");
    setSaved(doc);
  };

  // Publishing saves the page too, as in TemplateBuilderPage.
  const publish = () => {
    history.commit();
    if (!writeSaved(key, doc) || !writePublished(key, doc)) {
      setFeedback("Unable to publish in this browser.");
      return;
    }
    setFeedback("");
    setSaved(doc);
    setPublishedDoc(JSON.stringify(doc));
  };

  const copyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setFeedback("Unable to copy the link.");
    }
  };
  const leaveEdit = () => {
    setMode("view");
    setSelected(null);
    setContentSection(null);
    setStylesOpen(false);
    setConfirmExit(false);
  };
  const exit = () => (dirty ? setConfirmExit(true) : leaveEdit());

  // Site Styles is part of editing: from view mode it opens edit mode with the
  // panel open; while editing it opens and closes the panel.
  const openSiteStyles = () => {
    if (!editing) {
      setMode("edit");
      setStylesOpen(true);
    } else {
      setStylesOpen((open) => !open);
    }
  };
  const discard = () => {
    history.reset(saved);
    leaveEdit();
  };

  // How the template's text and sections become editable.
  const edit: EditHooks = {
    renderText: (section, field, value) => {
      const id = `${section}.${field}`;
      return (
        <EditableText
          value={value}
          selected={selected === id}
          onSelect={() => setSelected(id)}
          onChange={(next) => setContent(section, field, next)}
          onCommit={history.commit}
        />
      );
    },
    renderSection: (section, children) => {
      const definition = template.sections.find((item) => item.id === section);
      // "Edit section" opens Site Styles, so it is there only on the whole page.
      const actions: SectionAction[] = [
        ...(definition?.fields?.length ? [{ label: "Edit content", Icon: Type, onClick: () => setContentSection(section) }] : []),
        ...(focus === "all" ? [{ label: "Edit section", Icon: Pencil, onClick: () => setStylesOpen(true) }] : []),
      ];
      return <EditableSection actions={actions}>{children}</EditableSection>;
    },
  };

  // On the canvas the page shows the chosen section, and a menu link there
  // switches to its section; on the whole page it scrolls to it. The
  // preview always shows the whole page, as visitors see it.
  const page = (editable: boolean, onCanvas: boolean) => {
    const single = onCanvas && focus !== "all" ? focus : undefined;
    return (
      <TemplateRenderer
        template={template}
        content={doc.content}
        palette={doc.palette}
        font={doc.font}
        edit={editable ? edit : undefined}
        only={single}
        onNavigate={single ? chooseSection : undefined}
        activeSection={single}
      />
    );
  };

  return (
    <div data-full-screen className={`${themeFontVariables} relative flex h-screen overflow-hidden bg-white text-neutral-900`}>
      {/* Sidebar: slides away in edit mode */}
      <div
        inert={mode !== "view"}
        className={`hidden shrink-0 overflow-hidden md:block ${slide} ${mode === "view" ? "w-[22rem] opacity-100 xl:w-[24rem]" : "w-0 opacity-0"}`}
      >
        <aside className="h-full w-[22rem] overflow-y-auto bg-white px-6 py-8 lg:px-8 lg:py-10 xl:w-[24rem]" data-lenis-prevent>
          <div className="mx-auto flex max-w-sm flex-col gap-8">
            <Link href={backHref} className={`${focusRing} group flex items-center gap-1.5 rounded text-xs font-semibold uppercase tracking-[0.08em] text-foreground no-underline`}>
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Templates
            </Link>
            <motion.div {...rise(0)} className="flex flex-col gap-3">
              <h1 className="m-0 text-[length:clamp(2rem,6vw,2.5rem)] font-medium leading-none tracking-[-0.03em]">{template.name}</h1>
              <p className="m-0 text-sm leading-relaxed text-foreground/60">{template.description}</p>

              {/* Save and Publish, from TemplateBuilderPage */}
              <div className="mt-2 flex gap-2">
                <motion.button
                  type="button"
                  onClick={save}
                  disabled={!dirty}
                  whileTap={dirty ? { scale: 0.97 } : undefined}
                  className={`${focusRing} h-12 flex-1 cursor-pointer rounded-lg border border-foreground/15 text-xs font-semibold uppercase tracking-[0.08em] text-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-35`}
                >
                  Save
                </motion.button>
                <motion.button
                  type="button"
                  onClick={publish}
                  whileTap={{ scale: 0.97 }}
                  className={`${focusRing} ${primaryButton} group flex h-12 flex-[2] cursor-pointer items-center justify-center gap-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em]`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={published ? "published" : "publish"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease }}
                      className="flex items-center gap-2"
                    >
                      {published ? (
                        <>
                          Published
                          <Check className="size-4" />
                        </>
                      ) : (
                        <>
                          Publish
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Status */}
              <span className="relative overflow-hidden text-xs text-foreground/50" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={statusText}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.22, ease }}
                    className={`block ${feedback ? "text-red-600" : ""}`}
                  >
                    {statusText}
                  </motion.span>
                </AnimatePresence>
              </span>

              {/* Published: the link, Copy link and View site */}
              <AnimatePresence initial={false}>
                {published && (
                  <motion.div
                    key="published"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 rounded-lg bg-foreground/[0.04] p-4 text-[10px] font-mono uppercase tracking-[0.1em] text-foreground/50">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-primary" /> Published successfully
                      </span>
                      <span className="truncate normal-case tracking-normal text-foreground/40">
                        {window.location.origin}
                        {publicPath}
                      </span>
                      <span className="flex items-center gap-4">
                        <button type="button" onClick={copyPublicLink} className="flex cursor-pointer items-center gap-1.5 uppercase text-foreground hover:text-primary">
                          <Copy className="h-3 w-3" /> {copied ? "Copied" : "Copy link"}
                        </button>
                        <button type="button" onClick={() => setMode("preview")} className="cursor-pointer uppercase text-foreground hover:text-primary">
                          View site
                        </button>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* The section to work on (the home page to start). Colours and fonts
                are in Site Styles, on the right of the canvas top bar. */}
            <motion.div {...rise(0.08)} className="flex flex-col gap-3">
              <span id="section-label" className="text-sm font-semibold text-foreground">Section</span>
              <SelectCard value={focus} options={sectionOptions} onChange={chooseSection} labelledBy="section-label" />
            </motion.div>
          </div>
        </aside>
      </div>

      {/* Canvas */}
      <div className={`relative flex min-w-0 flex-1 flex-col ${slide} p-5 ${mode === "view" ? "" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: smooth }}
          className={`flex min-h-0 flex-1 flex-col overflow-hidden bg-white shadow-[0_0_25px_rgba(0,0,0,0.11)] duration-500 ${
            mode === "view" ? "" : ""
          }`}
        >
          {/* Top bar */}
          <div className="grid  shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 p-4  bg-white ">
            <div className="flex items-center gap-1.5">
              <AnimatePresence mode="wait" initial={false}>
                {editing ? (
                  <motion.div
                    key="edit-tools"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={save}
                      disabled={!dirty}
                      className="h-7 rounded px-2.5 text-xs font-semibold text-white transition-colors enabled:bg-neutral-900 enabled:hover:bg-neutral-700 disabled:bg-neutral-300"
                    >
                      Save
                    </button>
                    <button type="button" onClick={exit} className="h-7 rounded px-2 text-xs font-medium text-neutral-900 transition-colors hover:bg-neutral-100">
                      Exit
                    </button>
                    <span className="ml-2 flex items-center">
                      <button type="button" onClick={history.undo} disabled={!history.canUndo} aria-label="Undo" title="Undo" className={iconButton}>
                        <Undo2 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={history.redo} disabled={!history.canRedo} aria-label="Redo" title="Redo" className={iconButton}>
                        <Redo2 className="h-4 w-4" />
                      </button>
                    </span>
                  </motion.div>
                ) : (
                  <motion.button
                    key="edit"
                    type="button"
                    onClick={() => setMode("edit")}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.2 }}
                    whileTap={{ scale: 0.96 }}
                    className="h-7 rounded bg-neutral-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-neutral-700"
                  >
                    Edit
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Section picker: the same list as the sidebar, for edit mode and small screens */}
            <div className="relative flex min-w-0 justify-center">
              <button
                type="button"
                onClick={() => setPickerOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={pickerOpen}
                className="flex min-w-0 flex-col items-center rounded px-2 py-0.5 leading-tight transition-colors hover:bg-neutral-100"
              >
                <span className="flex max-w-[40vw] items-center gap-1 text-[11px] font-medium text-neutral-900">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={focus}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="truncate"
                    >
                      {sectionLabel(focus)}
                    </motion.span>
                  </AnimatePresence>
                  <motion.span animate={{ rotate: pickerOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: smooth }} className="flex">
                    <ChevronDown className="h-3 w-3 text-neutral-500" />
                  </motion.span>
                </span>
                <span className="max-w-[40vw] truncate text-[10px] text-neutral-500">{siteTitle || "Untitled"}</span>
              </button>

              <AnimatePresence>
                {pickerOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
                    <motion.ul
                      role="menu"
                      initial={{ opacity: 0, x: "-50%", y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: "-50%", y: -6, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: smooth }}
                      className="absolute left-1/2 top-full z-50 m-0 mt-2 w-52 list-none rounded-md bg-white p-1 shadow-[0_8px_30px_rgb(0_0_0/0.18)] ring-1 ring-black/5"
                    >
                      {sectionOptions.map(({ id, label, menu }) => (
                        <li key={id} role="none">
                          <button
                            type="button"
                            role="menuitemradio"
                            aria-checked={focus === id}
                            onClick={() => chooseSection(id)}
                            className={`flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs transition-colors ${
                              focus === id ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            <span className="flex-1">{label}</span>
                            {menu && <span className="text-[9px] uppercase tracking-[0.08em] text-neutral-400">Menu</span>}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-end gap-1">
              <div className="flex rounded-md bg-neutral-100 p-0.5">
                {([
                  ["desktop", "Desktop View", Monitor],
                  ["mobile", "Mobile View", Smartphone],
                ] as const).map(([id, label, Icon]) => (
                  <Tip key={id} label={label}>
                    <button
                      type="button"
                      aria-label={label}
                      aria-pressed={device === id}
                      onClick={() => setDevice(id)}
                      className={`relative grid size-7 place-items-center rounded transition-colors ${device === id ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"}`}
                    >
                      {device === id && <motion.span layoutId="device-pill" transition={{ duration: 0.3, ease: smooth }} className="absolute inset-0 rounded bg-white shadow-sm" />}
                      <Icon className="relative h-3.5 w-3.5" />
                    </button>
                  </Tip>
                ))}
              </div>
              {/* Site Styles (colour palettes and font packs): on the whole page only */}
              <AnimatePresence initial={false}>
                {focus === "all" && (
                  <motion.div
                    key="site-styles"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Tip label="Site Styles">
                      <button type="button" aria-label="Site Styles" aria-pressed={stylesOpen} onClick={openSiteStyles} className={`${iconButton} ${stylesOpen ? "bg-neutral-100" : ""}`}>
                        <Paintbrush className="h-4 w-4" />
                      </button>
                    </Tip>
                  </motion.div>
                )}
              </AnimatePresence>
              <Tip label="Preview">
                <button type="button" aria-label="Preview" onClick={() => setMode("preview")} className={iconButton}>
                  <Play className="h-4 w-4" />
                </button>
              </Tip>
            </div>
          </div>

          {/* Page: double-click it to start editing, like the Edit button */}
          <div
            ref={pageRef}
            className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-neutral-100"
            data-lenis-prevent
            onMouseDown={() => setSelected(null)}
            onDoubleClick={() => {
              if (mode !== "view") return;
              window.getSelection()?.removeAllRanges();
              setMode("edit");
            }}
          >
            <motion.div
              key={`${device}-${focus}`}
              initial={{ opacity: 0.35, y: focus === "all" ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: smooth }}
              className={`mx-auto min-h-full bg-white ${slide} ${device === "mobile" ? "my-6 w-[390px] max-w-full overflow-hidden rounded-2xl shadow-[0_10px_40px_-12px_rgb(0_0_0/0.3)] ring-1 ring-black/5" : "w-full"}`}
            >
              {page(editing, true)}
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {contentDefinition?.fields && editing && (
            <ContentPanel
              key={contentDefinition.id}
              title={contentDefinition.label}
              fields={contentDefinition.fields}
              content={doc.content[contentDefinition.id] ?? {}}
              onChange={(field, value) => setContent(contentDefinition.id, field, value)}
              onCommit={history.commit}
              onClose={() => setContentSection(null)}
            />
          )}
        </AnimatePresence>

        {/* Exit without saving? */}
        <AnimatePresence>
          {confirmExit && (
            <>
              <motion.div
                key="dim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setConfirmExit(false)}
                className="absolute inset-0 top-11 z-40 bg-white/60"
              />
              <motion.div
                key="ask"
                role="alertdialog"
                aria-labelledby="exit-title"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: smooth }}
                className="absolute left-8 top-12 z-50 w-[220px] rounded-md bg-white p-4 shadow-[0_8px_30px_rgb(0_0_0/0.18)] ring-1 ring-black/5"
              >
                <p id="exit-title" className="m-0 text-xs font-semibold text-neutral-900">Exit Without Saving?</p>
                <p className="m-0 mt-1 text-xs leading-relaxed text-neutral-700">Any unsaved changes will be discarded when you exit.</p>
                <div className="mt-4 flex justify-end gap-4 text-xs font-medium">
                  <button type="button" onClick={() => { save(); leaveEdit(); }} className="text-neutral-900 hover:underline">Save</button>
                  <button type="button" onClick={discard} className="text-red-600 hover:underline">Exit</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Site Styles: slides in from the right */}
      <div inert={!stylesOpen} className={`shrink-0 overflow-hidden border-l border-neutral-200/70 ${slide} ${stylesOpen ? "w-[300px] opacity-100" : "w-0 border-l-0 opacity-0"}`}>
        <StylesPanel
          palette={doc.palette}
          font={doc.font}
          onPalette={(id) => setStyle("palette", id)}
          onFont={(id) => setStyle("font", id)}
          onClose={() => setStylesOpen(false)}
        />
      </div>

      {/* Preview: the page alone, full screen */}
      <AnimatePresence>
        {mode === "preview" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease: smooth }}
            className="fixed inset-0 z-[60] overflow-y-auto bg-white"
            data-lenis-prevent
          >
            {page(false, false)}
            <button
              type="button"
              onClick={() => setMode("view")}
              aria-label="Close preview"
              className="fixed right-3 top-3 z-[70] grid size-8 place-items-center rounded-full bg-white/80 text-neutral-900 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
