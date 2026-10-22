"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  LayoutGrid,
  Monitor,
  Paintbrush,
  Play,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
  X,
} from "lucide-react";
import { ease, focusRing } from "@/components/landing/landing-ui";
import { loadPortfolio, RequestError, sendPortfolio, unpublishPortfolio } from "@/lib/portfolio-client";
import EditorAccount from "@/components/template-editor/EditorAccount";
import PageNameField from "@/components/template-editor/PageNameField";
import PageSettings from "@/components/template-editor/PageSettings";
import SectionNavigator from "@/components/template-editor/SectionNavigator";
import TemplateRenderer from "@/components/site-templates/core/TemplateRenderer";
import { baseOf, mergePageContent, readLayout, type PageLayout } from "@/components/site-templates/core/layout";
import { plainText } from "@/components/site-templates/core/rich-format";
import type { TemplateContent, TemplateDefinition } from "@/components/site-templates/core/types";
import { getSiteTemplate, siteTemplateEditorHref } from "@/components/site-templates/registry";
import { findFontPack, findPalette, themeFontVariables } from "@/components/template-detail/theme-options";
import ContentPanel from "@/components/template-editor/ContentPanel";
import { CanvasProvider } from "@/components/template-editor/fluid/canvas";
import { useFluidEditing } from "@/components/template-editor/fluid/useFluidEditing";
import { ColorChoices, FontChoices } from "@/components/template-editor/StylesPanel";
import { useEditHistory } from "@/components/template-editor/useEditHistory";

type Mode = "view" | "edit" | "preview";
type Device = "desktop" | "tablet" | "mobile";
// The page's frame on the canvas for each device, centred: the full width for
// desktop, a tablet's and a phone's width (narrower when the canvas is) as a
// rounded, raised sheet. Switching animates the width and the frame.
const DEVICE_FRAME: Record<Device, string> = {
  desktop: "w-full my-0 rounded-none shadow-none ring-0",
  tablet: "w-[820px] max-w-[calc(100%-3rem)] my-6 rounded-2xl shadow-[0_14px_44px_-14px_rgb(0_0_0/0.3)] ring-1 ring-black/5",
  mobile: "w-[390px] max-w-[calc(100%-3rem)] my-6 rounded-[1.75rem] shadow-[0_14px_44px_-14px_rgb(0_0_0/0.35)] ring-1 ring-black/5",
};
const frameMotion = "transition-[width,max-width,margin,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
// What the canvas shows: the home page ("all"), or one of its sections.
type Focus = string;
interface EditorDoc {
  // The page's own name, shown in the toolbar; apart from its site title.
  name?: string;
  content: TemplateContent;
  palette: string;
  font: string;
  // Sections reordered and copied, blocks moved and added (Fluid Engine).
  layout: PageLayout;
}

const defaultDoc = (template: TemplateDefinition): EditorDoc => ({ content: mergePageContent(template, null), palette: "original", font: "original", layout: {} });
const smooth = [0.22, 1, 0.36, 1] as const;
const slide = "transition-[width,padding,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
// Scrolling the canvas this far (px) closes its toolbars and panels; a pause
// this long (ms) starts the count again.
const CLOSE_AFTER_PX = 150;
const SCROLL_PAUSE_MS = 400;

// The sidebar from the template's detail page, with its entrance animation.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

// The whole page, first in the sidebar's sections, before the template's own.
const HOME_PAGE = { id: "all", label: "Home page" };

// A saved page (from the account, or from this browser before pages were
// stored with the account) on top of the template's defaults.
const toDoc = (template: TemplateDefinition, saved: unknown): EditorDoc => {
  const value = saved && typeof saved === "object" ? (saved as Partial<Record<keyof EditorDoc, unknown>>) : {};
  const layout = readLayout(value.layout);
  return {
    ...(typeof value.name === "string" && value.name ? { name: value.name } : {}),
    palette: typeof value.palette === "string" ? value.palette : "original",
    font: typeof value.font === "string" ? value.font : "original",
    content: mergePageContent(template, value.content, layout),
    layout,
  };
};

// Before Save went to the account, the editor kept the page in this browser;
// that copy is the starting point while the account has no page for this
// template.
const readLocalCopy = (template: TemplateDefinition): EditorDoc => {
  try {
    const raw = localStorage.getItem(`portory-site-${template.id}`);
    return raw ? toDoc(template, JSON.parse(raw)) : defaultDoc(template);
  } catch {
    return defaultDoc(template);
  }
};

// The account's saved portfolio, as the editor needs it. "failed" means it
// could not be read, so saving would overwrite it with what the editor
// shows; "signed-out" means there is no account to save to.
type LoadState = "loaded" | "failed" | "signed-out";
interface Stored {
  state: LoadState;
  // The page as last saved, when the account's portfolio is this template.
  doc: EditorDoc | null;
  slug: string | null;
  published: boolean;
}

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

// The top bar is a strip of square cells, edge to edge, split by hairlines:
// each control fills its cell's full height. Edit (left) and Publish (right)
// are solid blocks at the two ends.
// Every cell: its shape. Light cells add their colours (dark on white);
// solid ones (Edit, Publish) keep white text, hovered or not.
const cellBase = "relative flex h-full shrink-0 cursor-pointer items-center justify-center gap-2 px-5 text-sm font-semibold transition-colors";
const cell = `${cellBase} text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 disabled:cursor-default disabled:text-neutral-300 disabled:hover:bg-transparent`;
const solidCell = `${cellBase} px-7 text-white hover:text-white`;
const iconCell = `${cell} w-14 px-0`;
const hairline = "border-neutral-200/80";
// Every heading in the sidebar (Sections, Site styles, Fonts, Colors).
const asideTitle = "m-0 text-base font-semibold tracking-[-0.01em] text-foreground";
const iconButton = "grid size-8 place-items-center rounded text-neutral-800 transition-colors hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-300 disabled:hover:bg-transparent";

// The page editor from the reference, for any site template (see
// components/site-templates):
// - View: the template's sidebar on the left and the page in a canvas card, with
//   Edit, the page title, desktop/mobile view, Site Styles and Preview.
// - Edit: the sidebar collapses to its rail and the canvas widens. Hover a
//   section to outline it and open its menu, click any text to type into it.
//   Save, Exit (asks before discarding changes), Undo and Redo.
// - Preview: the page alone, full screen, with a close button.
export default function TemplateBuilderPageEditor({ backHref, templateId }: { backHref: string; templateId: string }) {
  const template = getSiteTemplate(templateId);
  const [stored, setStored] = useState<Stored | null>(null);

  // The editor opens once the account's portfolio has been read, so it
  // starts from the saved page.
  useEffect(() => {
    if (!template) return;
    let live = true;
    loadPortfolio()
      .then((portfolio) => {
        if (!live) return;
        const here = portfolio?.template_id === template.id;
        setStored({
          state: "loaded",
          doc: here ? toDoc(template, portfolio.portfolio_data) : null,
          slug: portfolio?.slug ?? null,
          published: here && portfolio.status === "published",
        });
      })
      .catch((error: unknown) => {
        if (!live) return;
        const signedOut = error instanceof Error && error.message === "HTTP 401";
        setStored({ state: signedOut ? "signed-out" : "failed", doc: null, slug: null, published: false });
      });
    return () => {
      live = false;
    };
  }, [template]);

  if (!template || !stored) return <div data-full-screen className="h-screen bg-white" />;
  return <Editor key={template.id} backHref={backHref} template={template} stored={stored} />;
}

function Editor({ backHref, template, stored }: { backHref: string; template: TemplateDefinition; stored: Stored }) {
  const [initial] = useState(() => stored.doc ?? readLocalCopy(template));
  const history = useEditHistory<EditorDoc>(initial);
  const doc = history.value;
  // The page as last saved to the account; null while the account has no
  // page for this template, so everything shown is unsaved.
  const [saved, setSaved] = useState<EditorDoc | null>(stored.doc);
  const [slug, setSlug] = useState(stored.slug);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "published" | "error">(stored.published ? "published" : "idle");
  const canPersist = stored.state === "loaded";
  const [mode, setMode] = useState<Mode>("view");
  // The sidebar, open or collapsed to a rail of icons (its bottom button). It
  // starts open in view mode and as the rail in edit mode, where the canvas
  // needs the room; each mode remembers its own choice.
  const [viewAsideOpen, setViewAsideOpen] = useState(true);
  const [editAsideOpen, setEditAsideOpen] = useState(false);
  const asideOpen = mode === "edit" ? editAsideOpen : viewAsideOpen;
  const setAsideOpen = (open: boolean) => (mode === "edit" ? setEditAsideOpen(open) : setViewAsideOpen(open));
  // Site Styles in the sidebar, open or closed; the rail's brush opens the
  // sidebar with them open.
  // Site Styles: the overview (null), or Fonts or Colors open to their choices.
  const [stylesView, setStylesView] = useState<"fonts" | "colors" | null>(null);
  // Signing in comes back to this editor.
  const signInHref = `/login?next=${encodeURIComponent(siteTemplateEditorHref(template.id))}`;
  const openStyles = () => {
    setAsideOpen(true);
    window.setTimeout(() => document.getElementById("site-styles")?.scrollIntoView({ behavior: "smooth", block: "start" }), 320);
  };
  const [device, setDevice] = useState<Device>("desktop");
  // The section whose content panel is open.
  const [contentSection, setContentSection] = useState<string | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [focus, setFocus] = useState<Focus>("all");
  const pageRef = useRef<HTMLDivElement>(null);
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);  const dirty = !saved || JSON.stringify(doc) !== JSON.stringify(saved);
  // Published, and nothing has changed since.
  const published = publishState === "published" && !dirty;
  const canSave = dirty && saveState !== "saving" && canPersist;
  const canPublish = publishState !== "publishing" && canPersist;
  const editing = mode === "edit";
  // The page's palette and font pack, as Site Styles shows them.
  const palette = findPalette(doc.palette);
  const fontPack = findFontPack(doc.font);
  // Its five colours, light to dark.
  const colors = [...palette.swatches.slice(0, 3), palette.muted, palette.swatches[3]];
  const publicPath = slug ? `/p/${slug}` : null;
  const contentDefinition = contentSection ? template.sections.find((section) => section.id === baseOf(contentSection)) : undefined;
  // The same statuses as TemplateBuilderPage.
  const statusText =
    stored.state === "failed"
      ? "Not loaded"
      : stored.state === "signed-out"
        ? "Sign in to save and publish"
        : feedback ||
          (saveState === "saving"
            ? "Saving..."
            : publishState === "publishing"
              ? "Publishing..."
              : dirty
                ? "Unsaved changes"
                : published
                  ? "Published"
                  : "Saved");
  // The status as a colour (the rail's dot): red for a problem, amber for
  // unsaved changes, green for published, grey otherwise.
  const statusDot =
    feedback || stored.state === "failed"
      ? "bg-red-500"
      : saveState === "saving" || publishState === "publishing"
        ? "animate-pulse bg-neutral-400"
        : stored.state === "loaded" && dirty
          ? "bg-amber-500"
          : published
            ? "bg-emerald-500"
            : "bg-neutral-300";

  // A newly chosen section starts at its top.
  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 });
  }, [focus]);

  const chooseSection = (id: Focus) => {
    setFocus(id);
    fluid.deselect();
    // Site Styles belong to the whole page.
  };

  // Esc closes the preview, the exit question or the open panel.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mode === "preview") setMode("view");
      else if (confirmExit) setConfirmExit(false);
      else if (contentSection) setContentSection(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, confirmExit, contentSection]);

  const setContent = (section: string, field: string, value: string) =>
    history.update((d) => ({ ...d, content: { ...d.content, [section]: { ...d.content[section], [field]: value } } }));

  // How the page is edited: Fluid Engine sections and blocks (see fluid/).
  const fluid = useFluidEditing({
    template,
    history,
    setContent,
    // "Edit section" opens the section's own panel (fluid/SectionPanel);
    // Site Styles opens from the toolbar's brush button only.
    onEditContent: (section) => setContentSection(section),
  });

  // Scrolling the canvas closes everything open on it: toolbars (the block's
  // and the text's, which keeps what was typed), the image, section and
  // content panels. Only the visitor's own scrolling counts (wheel, touch,
  // scrolling keys), not the editor's (picking a layer scrolls to it).
  const closeAll = useRef(() => {});
  useEffect(() => {
    closeAll.current = () => {
      history.commit();
      fluid.reset();
      setContentSection(null);
    };
  });
  useEffect(() => {
    const page = pageRef.current;
    if (!page || !editing) return;
    // A small scroll leaves things open: they close once the page has moved
    // CLOSE_AFTER_PX from where the visitor started scrolling. A pause of
    // SCROLL_PAUSE_MS starts the count again.
    let start: number | null = null;
    let pause = 0;
    const began = () => {
      if (start === null) start = page.scrollTop;
      window.clearTimeout(pause);
      pause = window.setTimeout(() => (start = null), SCROLL_PAUSE_MS);
    };
    const scrolled = () => {
      if (start === null || Math.abs(page.scrollTop - start) < CLOSE_AFTER_PX) return;
      start = null;
      closeAll.current();
    };
    const keys = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      if (["PageUp", "PageDown", "Home", "End", " ", "ArrowUp", "ArrowDown"].includes(event.key)) began();
    };
    page.addEventListener("wheel", began, { passive: true });
    page.addEventListener("touchmove", began, { passive: true });
    page.addEventListener("scroll", scrolled, { passive: true });
    window.addEventListener("keydown", keys);
    return () => {
      window.clearTimeout(pause);
      page.removeEventListener("wheel", began);
      page.removeEventListener("touchmove", began);
      page.removeEventListener("scroll", scrolled);
      window.removeEventListener("keydown", keys);
    };
  }, [editing]);

  // Renaming the page is an edit like any other: it can be undone and needs
  // a save. The site title on the page stays as it is.
  const renamePage = (name: string) => {
    history.update((d) => ({ ...d, name }));
    history.commit();
  };

  // Save and Publish, as in TemplateBuilderPage: both store the page with the
  // account (lib/portfolio-client); Publish also makes it the live page.
  const save = async (page: EditorDoc = doc) => {
    history.commit();
    const unchanged = saved && JSON.stringify(page) === JSON.stringify(saved);
    if (unchanged || saveState === "saving" || !canPersist) return;
    setSaveState("saving");
    setFeedback("");
    try {
      const result = await sendPortfolio("save", template.id, page);
      setSaved(page);
      setSlug(result.slug);
      setSaveState("saved");
      // The saved draft now differs from the live page.
      setPublishState("idle");
    } catch (error) {
      setSaveState("error");
      setFeedback(error instanceof RequestError ? error.message : "Unable to save. Check your connection and try again.");
    }
  };

  const publish = async () => {
    history.commit();
    if (publishState === "publishing" || !canPersist) return;
    setPublishState("publishing");
    setFeedback("");
    try {
      const result = await sendPortfolio("publish", template.id, doc);
      setSaved(doc);
      setSlug(result.slug);
      setPublishState("published");
      setSaveState("saved");
    } catch (error) {
      setPublishState("error");
      setFeedback(error instanceof RequestError ? error.message : "Unable to publish. Check your connection and try again.");
    }
  };

  // Page settings' Public page switch: on publishes the page (as Publish), off
  // takes it off the web (a draft again; its address is kept).
  const [unpublishing, setUnpublishing] = useState(false);
  const setPublic = async (on: boolean) => {
    if (on) return publish();
    if (unpublishing || !canPersist) return;
    setUnpublishing(true);
    setFeedback("");
    try {
      await unpublishPortfolio();
      setPublishState("idle");
    } catch (error) {
      setFeedback(error instanceof RequestError ? error.message : "Unable to unpublish. Check your connection and try again.");
    } finally {
      setUnpublishing(false);
    }
  };

  // A colour palette or font pack from Site Styles (in the sidebar): an
  // unsaved change like any other, kept with Save (or Publish), undone with Undo.
  const setStyle = (style: "palette" | "font", id: string) => {
    history.update({ ...doc, [style]: id });
    history.commit();
  };

  const copyPublicLink = async () => {
    if (!publicPath) return;
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
    fluid.reset();
    setContentSection(null);
    setConfirmExit(false);
  };
  const exit = () => (dirty ? setConfirmExit(true) : leaveEdit());

  const discard = () => {
    history.reset(saved ?? initial);
    leaveEdit();
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
        layout={doc.layout}
        edit={editable ? fluid.edit : undefined}
        only={single}
        onNavigate={single ? chooseSection : undefined}
        activeSection={single}
      />
    );
  };

  return (
    <div data-full-screen className={`${themeFontVariables} relative flex h-screen overflow-hidden bg-white text-neutral-900`}>
      {/* Sidebar: open, or collapsed to a rail of icons */}
      <div className={`relative hidden shrink-0 overflow-hidden md:block ${slide} ${asideOpen ? "w-[22rem] xl:w-[24rem]" : "w-14"}`}>
        <aside
          inert={!asideOpen}
          className={`absolute inset-y-0 left-0 flex w-[22rem] flex-col bg-white transition-opacity duration-300 xl:w-[24rem] ${asideOpen ? "opacity-100 delay-150" : "pointer-events-none opacity-0"}`}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 lg:px-8 lg:py-10" data-lenis-prevent>
            <div className="mx-auto flex max-w-sm flex-col gap-10">
              <Link href={backHref} className={`${focusRing} group flex w-fit items-center gap-1.5 rounded text-base font-semibold tracking-[-0.01em] text-foreground no-underline`}>
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                All templates
              </Link>

              <motion.div {...rise(0)} className="flex flex-col gap-2.5">
                <h1 className="m-0 text-[length:clamp(1.9rem,5vw,2.25rem)] font-medium leading-none tracking-[-0.035em]">{template.name}</h1>
                <p className="m-0 text-sm leading-relaxed text-foreground/55">{template.description}</p>

                {/* Saving is off: the saved page could not be read, or no one is signed in */}
                {stored.state === "failed" && (
                  <div role="alert" className="mt-2 flex flex-col items-start gap-2 border-l-2 border-red-500 bg-red-50 py-3 pl-3.5 pr-3 text-[13px] leading-relaxed text-red-800">
                    Your saved portfolio could not be loaded. Saving and publishing are turned off so your saved work is not overwritten.
                    <button type="button" onClick={() => window.location.reload()} className="cursor-pointer font-semibold underline underline-offset-2">
                      Reload
                    </button>
                  </div>
                )}
                {stored.state === "signed-out" && (
                  <div className="mt-2 flex items-center justify-between gap-3 border-l-2 border-foreground bg-foreground/[0.03] py-3 pl-3.5 pr-3 text-[13px] leading-snug text-foreground/70">
                    Sign in to save and publish your page.
                    <Link href={signInHref} className="shrink-0 font-semibold text-foreground underline underline-offset-2">
                      Sign in
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* The section to work on (the home page to start), as the page's outline */}
              <motion.div {...rise(0.08)} className="flex flex-col gap-3">
                <h2 id="section-label" className={`${asideTitle} flex items-baseline gap-2`}>
                  Sections
                  <span className="text-[13px] font-normal tabular-nums text-foreground/40">{template.sections.length}</span>
                </h2>
                <div className="-mx-4">
                  <SectionNavigator
                    value={focus}
                    home={{ ...HOME_PAGE, detail: "All sections together" }}
                    sections={template.sections.map(({ id, label, menu, fields }) => ({
                      id,
                      label,
                      detail: menu ? `In the menu as “${menu}”` : fields?.length ? `${fields.length} ${fields.length === 1 ? "field" : "fields"} to edit` : undefined,
                    }))}
                    onChange={chooseSection}
                    labelledBy="section-label"
                  />
                </div>
              </motion.div>

              {/* Site Styles: the page's colours and fonts (unsaved until Save). An
                  overview (the theme as a preview, then Fonts and Colors as rows)
                  that opens one of them to its choices, with a way back. */}
              <motion.div {...rise(0.12)} id="site-styles" className="flex scroll-mt-6 flex-col gap-3">
                <AnimatePresence mode="wait" initial={false}>
                  {stylesView === null ? (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: smooth }}
                      className="flex flex-col gap-3"
                    >
                      <h2 className={asideTitle}>Site styles</h2>

                      {/* The theme: the page's colours and fonts together */}
                      <button
                        type="button"
                        onClick={() => setStylesView("colors")}
                        aria-label={`Theme: ${palette.name} colors, ${fontPack.name} fonts`}
                        className={`${focusRing} group flex cursor-pointer flex-col gap-2.5 rounded bg-neutral-100 p-3 text-left transition-colors hover:bg-neutral-200/70`}
                      >
                        <span className="text-[13px] text-neutral-500">Theme</span>
                        <span aria-hidden="true" className={`flex h-[5.5rem] items-center gap-4 rounded px-4 ring-1 ring-black/[0.06] transition-colors duration-500 ${palette.swatches[0]}`}>
                          <span className={`bg-clip-text text-[44px] leading-none text-transparent transition-colors duration-500 ${palette.swatches[3]} ${fontPack.heading}`}>Aa</span>
                          {/* The five colours as overlapping chips: they deal in one by one
                              when the palette changes, and fan out on hover */}
                          <motion.span key={palette.id} initial="hidden" animate="shown" variants={{ shown: { transition: { staggerChildren: 0.06 } } }} className="flex h-12 items-stretch">
                            {colors.map((swatch, index) => (
                              <motion.span
                                key={index}
                                variants={{
                                  hidden: { opacity: 0, y: 10, rotate: -8 },
                                  shown: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 24 } },
                                }}
                                className={`w-6 rounded-sm shadow-[-2px_0_6px_rgb(0_0_0/0.18)] ring-1 ring-black/[0.06] transition-[margin] duration-300 ${index ? "-ml-2.5 group-hover:-ml-1" : ""} ${swatch}`}
                              />
                            ))}
                          </motion.span>
                        </span>
                      </button>

                      <hr className="my-2 border-0 border-t border-foreground/[0.08]" />

                      {/* Fonts and Colors: each opens to its choices */}
                      {(
                        [
                          ["fonts", "Fonts"],
                          ["colors", "Colors"],
                        ] as const
                      ).map(([view, label]) => (
                        <button
                          key={view}
                          type="button"
                          onClick={() => setStylesView(view)}
                          aria-label={`${label}: ${view === "fonts" ? fontPack.name : palette.name}`}
                          className={`${focusRing} group grid cursor-pointer grid-cols-[1fr_2.75rem] gap-1.5 rounded text-left`}
                        >
                          <span className="flex min-w-0 flex-col gap-2.5 rounded bg-neutral-100 p-3.5 transition-colors group-hover:bg-neutral-200/70">
                            <span className="text-[13px] text-neutral-500">{label}</span>
                            {view === "fonts" ? (
                              <span aria-hidden="true" className="flex flex-col gap-1">
                                <span className={`text-[28px] leading-none text-neutral-950 ${fontPack.heading}`}>Heading</span>
                                <span className={`truncate text-[13px] text-neutral-700 ${fontPack.body}`}>This is your paragraph.</span>
                              </span>
                            ) : (
                              <span aria-hidden="true" className="flex h-10 overflow-hidden rounded-sm ring-1 ring-black/[0.06]">
                                {colors.map((swatch, index) => (
                                  <span key={index} className={`flex-1 transition-colors duration-500 ${swatch}`} />
                                ))}
                              </span>
                            )}
                          </span>
                          <span className="grid place-items-center rounded bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-neutral-200/70 group-hover:text-neutral-950">
                            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={stylesView}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.25, ease: smooth }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStylesView(null)}
                          aria-label="Back to site styles"
                          className={`${focusRing} grid size-8 cursor-pointer place-items-center rounded bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200/70 hover:text-neutral-950`}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <h2 className={asideTitle}>{stylesView === "fonts" ? "Fonts" : "Colors"}</h2>
                      </div>
                      {stylesView === "fonts" ? (
                        <FontChoices value={doc.font} onChange={(id) => setStyle("font", id)} />
                      ) : (
                        <ColorChoices value={doc.palette} onChange={(id) => setStyle("palette", id)} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* The account (Log out) */}
          <div className="flex shrink-0 items-center border-t border-foreground/[0.07] px-4 py-3 lg:px-6">
            <div className="min-w-0 flex-1">
              <EditorAccount unsaved={dirty && stored.state === "loaded"} signInHref={signInHref} />
            </div>
          </div>
        </aside>

        {/* The rail, in view and edit mode: back, Sections and Site (both open
            the sidebar too), Site styles, and the account at the bottom */}
        <nav
          aria-label="Sidebar"
          inert={asideOpen}
          className={`absolute inset-y-0 left-0 flex w-14 flex-col items-center gap-2 bg-white py-5 transition-opacity duration-300 ${asideOpen ? "pointer-events-none opacity-0" : "opacity-100 delay-150"}`}
        >
          <Link href={backHref} aria-label="Back to templates" title="Back to templates" className={`${focusRing} ${iconButton} mb-2 no-underline`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setAsideOpen(true)}
            aria-label="Sections"
            title="Sections"
            className="grid size-10 cursor-pointer place-items-center rounded bg-primary text-white shadow-[0_6px_14px_-6px_color-mix(in_srgb,var(--primary),transparent_20%)] transition-transform hover:scale-105"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setAsideOpen(true)} aria-label={`Your site: ${statusText}`} title={statusText} className={`${iconButton} relative size-10`}>
            <Globe className="h-4 w-4" />
            <span aria-hidden="true" className={`absolute right-2 top-2 size-2 rounded-full ring-2 ring-white ${statusDot}`} />
          </button>
          <button type="button" onClick={openStyles} aria-label="Site styles" title="Site styles" className={`${iconButton} size-10`}>
            <Paintbrush className="h-4 w-4" />
          </button>
          {/* At the bottom: the account (opens the sidebar, where Log out is) */}
          <div className="mt-auto">
            <EditorAccount compact unsaved={dirty && stored.state === "loaded"} signInHref={signInHref} onExpand={() => setAsideOpen(true)} />
          </div>
        </nav>
      </div>

      {/* Canvas */}
      <div className={`relative flex min-w-0 flex-1 flex-col ${slide} p-5 ${mode === "view" ? "" : ""}`}>
        {/* In the gutter beside the sidebar, opening and closing it: a short bar
            that bends, on hover, into an arrow the way the sidebar will go */}
        <button
          type="button"
          onClick={() => setAsideOpen(!asideOpen)}
          aria-label={asideOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={asideOpen}
          title={asideOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="group/edge absolute inset-y-0 left-0 z-20 hidden w-5 cursor-pointer place-items-center outline-none md:grid"
        >
          <span aria-hidden="true" className="flex flex-col items-center">
            <span
              className={`block h-3 w-1 translate-y-[1px] origin-bottom rounded-full bg-neutral-300 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/edge:bg-neutral-600 group-focus-visible/edge:bg-primary ${
                asideOpen ? "group-hover/edge:rotate-[18deg] group-focus-visible/edge:rotate-[18deg]" : "group-hover/edge:-rotate-[18deg] group-focus-visible/edge:-rotate-[18deg]"
              }`}
            />
            <span
              className={`block h-3 w-1 -translate-y-[1px] origin-top rounded-full bg-neutral-300 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/edge:bg-neutral-600 group-focus-visible/edge:bg-primary ${
                asideOpen ? "group-hover/edge:-rotate-[18deg] group-focus-visible/edge:-rotate-[18deg]" : "group-hover/edge:rotate-[18deg] group-focus-visible/edge:rotate-[18deg]"
              }`}
            />
          </span>
        </button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: smooth }}
          className={`flex min-h-0 flex-1 flex-col overflow-hidden bg-white shadow-[0_0_25px_rgba(0,0,0,0.11)] duration-500 ${
            mode === "view" ? "" : ""
          }`}
        >
          {/* Top bar, a strip of cells: editing at the left end (Edit, or Exit,
              Undo and Redo), the page's name and status in the middle, then
              viewing (the device, its cell underlined, and Preview) and the
              actions (Save while editing or when something is unsaved, then
              Publish, a solid block at the right end). Site Styles are in the
              sidebar. */}
          <div className={`grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] border-b ${hairline} bg-white`}>
            <div className="flex items-stretch">
              <AnimatePresence mode="wait" initial={false}>
                {editing ? (
                  <motion.div
                    key="edit-tools"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-stretch border-r ${hairline}`}
                  >
                    <button type="button" onClick={exit} className={`${cell} border-r ${hairline}`}>
                      Exit
                    </button>
                    <Tip label="Undo">
                      <button type="button" onClick={history.undo} disabled={!history.canUndo} aria-label="Undo" className={iconCell}>
                        <Undo2 className="h-[18px] w-[18px]" />
                      </button>
                    </Tip>
                    <Tip label="Redo">
                      <button type="button" onClick={history.redo} disabled={!history.canRedo} aria-label="Redo" className={`${iconCell} border-l ${hairline}`}>
                        <Redo2 className="h-[18px] w-[18px]" />
                      </button>
                    </Tip>
                  </motion.div>
                ) : (
                  <motion.button
                    key="edit"
                    type="button"
                    onClick={() => setMode("edit")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`${solidCell} bg-neutral-950 hover:bg-neutral-800`}
                  >
                    Edit
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* The page's name and where it stands */}
            <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-4">
              <PageNameField value={doc.name ?? ""} fallback={template.name} onRename={renamePage}>
                {/* Public or private, and the page's address while public */}
                <PageSettings
                  isPublic={publishState === "published"}
                  busy={publishState === "publishing" || unpublishing}
                  canChange={canPersist}
                  pendingChanges={publishState === "published" && dirty}
                  address={`${window.location.host}${publicPath ?? ""}`}
                  publicPath={publicPath}
                  copied={copied}
                  onPublic={setPublic}
                  onCopy={copyPublicLink}
                />
              </PageNameField>
              <span className="relative flex max-w-[40vw] overflow-hidden" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={statusText}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -6, opacity: 0 }}
                    transition={{ duration: 0.2, ease: smooth }}
                    className={`block truncate text-[13px] leading-tight ${feedback || stored.state === "failed" ? "text-red-600" : "text-neutral-500"}`}
                  >
                    Page · {statusText}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <div className="flex items-stretch justify-end">
              <div className={`hidden items-stretch border-l ${hairline} md:flex`}>
                {([
                  ["desktop", "Desktop view", Monitor],
                  ["tablet", "Tablet view", Tablet],
                  ["mobile", "Mobile view", Smartphone],
                ] as const).map(([id, label, Icon]) => (
                  <Tip key={id} label={label}>
                    <button
                      type="button"
                      aria-label={label}
                      aria-pressed={device === id}
                      onClick={() => setDevice(id)}
                      className={`${iconCell} ${device === id ? "text-neutral-950" : "text-neutral-400"}`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {device === id && <motion.span layoutId="device-line" transition={{ duration: 0.3, ease: smooth }} className="absolute inset-x-3 bottom-0 h-0.5 bg-neutral-950" />}
                    </button>
                  </Tip>
                ))}
              </div>
              <Tip label="Preview">
                <button type="button" aria-label="Preview" onClick={() => setMode("preview")} className={`${iconCell} border-l ${hairline}`}>
                  <Play className="h-[18px] w-[18px]" />
                </button>
              </Tip>

              {/* Save (while editing, or whenever something is unsaved) and Publish */}
              {(editing || (dirty && canPersist)) && (
                <button type="button" onClick={() => save()} disabled={!canSave} className={`${cell} border-l ${hairline}`}>
                  {canSave && <span aria-hidden="true" className="size-1.5 bg-amber-500" />}
                  {saveState === "saving" ? "Saving..." : "Save"}
                </button>
              )}
              <button
                type="button"
                onClick={publish}
                disabled={!canPublish}
                className={`${solidCell} min-w-36 bg-primary hover:bg-[color:color-mix(in_srgb,var(--primary),black_14%)] disabled:cursor-not-allowed disabled:text-white/60 disabled:hover:bg-primary`}
              >
                {publishState === "publishing" ? (
                  "Publishing..."
                ) : published ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Published
                  </>
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </div>

          {/* Page: double-click it to start editing, like the Edit button */}
          <div
            ref={pageRef}
            className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-neutral-100"
            data-lenis-prevent
            onPointerDown={() => fluid.deselect()}
            onDoubleClick={() => {
              if (mode !== "view") return;
              window.getSelection()?.removeAllRanges();
              setMode("edit");
            }}
          >
            <motion.div
              key={focus}
              initial={{ opacity: 0.35, y: focus === "all" ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: smooth }}
              className={`mx-auto min-h-full overflow-hidden bg-white ${frameMotion} ${DEVICE_FRAME[device]}`}
            >
              <CanvasProvider value={fluid.canvas}>{page(editing, true)}</CanvasProvider>
            </motion.div>
          </div>
        </motion.div>

        {editing && fluid.imagePanel}
        {editing && fluid.sectionPanel}

        <AnimatePresence>
          {contentDefinition?.fields && editing && (
            <ContentPanel
              key={contentDefinition.id}
              title={contentDefinition.label}
              fields={contentDefinition.fields}
              // The words only: editing a field here replaces its formatting.
              content={Object.fromEntries(Object.entries(doc.content[contentSection!] ?? {}).map(([field, value]) => [field, plainText(value)]))}
              onChange={(field, value) => setContent(contentSection!, field, value)}
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
              className="fixed right-3 top-3 z-[70] grid size-8 place-items-center rounded bg-white/80 text-neutral-900 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
