"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Copy, Eye, PanelLeftClose, Pen } from "lucide-react";
import { PortfolioData, ProjectData } from "@/context/PortfolioContext";
import HeroSection from "@/components/templates/HeroSection";
import TemplateCard from "@/components/templates/TemplateCard";
import InlineEditor from "@/components/templates/InlineEditor";
import MinimalPreview from "@/components/templates/MinimalPreview";
import BoldPreview from "@/components/templates/BoldPreview";
import { templates } from "@/components/templates/template-data";
import { createClient } from "@/lib/supabase/client";
import { templateEditorNext } from "@/lib/auth-routing";
import { loadPortfolio, RequestError, sendPortfolio } from "@/lib/portfolio-client";
import Tooltip from "@/components/ui/tooltip";

/* ─── initial portfolio data ─── */

const makeProject = (index: number): ProjectData => ({
  number: String(index + 1).padStart(2, "0"),
  category: "Work",
  title: "",
  description: "",
  focus: [],
  year: "",
  image: "",
});

const initialData: PortfolioData = {
  name: "",
  role: "",
  availableYear: "2026",
  email: "",
  avatar: "",
  aboutHeading: "",
  aboutBody: "",
  services: [""],
  skills: [],
  navigation: {
    enabled: true,
    links: {
      work: true,
      about: true,
      services: false,
      contact: true,
    },
    showAvailability: true,
  },
  showScrollProgress: true,
  projects: [makeProject(0), makeProject(1), makeProject(2), makeProject(3)],
};

/* ─── page state type ─── */

type PageState =
  | { step: "select"; selected: string | null }
  | { step: "customize"; templateId: string };

/* ═══════════════════════════════════════════════
   TEMPLATE PAGE
   ═══════════════════════════════════════════════ */

interface TemplateBuilderPageProps {
  requestedTemplate?: string;
  shouldEdit?: boolean;
}

export default function TemplateBuilderPage({
  requestedTemplate,
  shouldEdit = false,
}: TemplateBuilderPageProps) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [pageState, setPageState] = useState<PageState>({
    step: "select",
    selected: null,
  });
  const [data, setData] = useState<PortfolioData>(
    JSON.parse(JSON.stringify(initialData)),
  );
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  // Desktop only: hide the editor panel to see the preview full width.
  const [editorOpen, setEditorOpen] = useState(true);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const [savedData, setSavedData] = useState(() => JSON.stringify(initialData));
  const [savedTemplateId, setSavedTemplateId] = useState<string | null>(null);
  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">(
    "saved",
  );
  const [publishState, setPublishState] = useState<
    "idle" | "publishing" | "published" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);
  // "failed" means the saved portfolio could not be read; saving then would
  // overwrite it with whatever the editor shows.
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "failed">(
    "loading",
  );
  const [activeUploads, setActiveUploads] = useState(0);
  const canPersist = loadState === "loaded" && activeUploads === 0;
  const isDirty =
    pageState.step === "customize" &&
    (JSON.stringify(data) !== savedData ||
      savedTemplateId !== pageState.templateId);

  useEffect(() => {
    const template = templates.some((item) => item.id === requestedTemplate)
      ? requestedTemplate
      : null;

    if (shouldEdit && template) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          router.replace(
            `/register?next=${encodeURIComponent(templateEditorNext(template))}`,
          );
          return;
        }
        setPageState({ step: "customize", templateId: template });
      });
    }

    loadPortfolio()
      .then((portfolio) => {
        setLoadState("loaded");
        // No row yet: a new user starts from the default data.
        if (!portfolio) return;
        // A portfolio made in the site template editor has a different shape:
        // start from the default data here, keeping its address. Saving here
        // replaces it, as switching template does.
        if (!templates.some((item) => item.id === portfolio.template_id)) {
          setPortfolioSlug(portfolio.slug);
          return;
        }
        setData(portfolio.portfolio_data as PortfolioData);
        setSavedData(JSON.stringify(portfolio.portfolio_data));
        setSavedTemplateId(portfolio.template_id);
        setPortfolioSlug(portfolio.slug);
        if (!shouldEdit || !requestedTemplate) {
          setPageState({
            step: "customize",
            templateId: portfolio.template_id,
          });
        }
        setPublishState(
          portfolio.status === "published" ? "published" : "idle",
        );
      })
      .catch(() => setLoadState("failed"));
  }, [requestedTemplate, router, shouldEdit, supabase.auth]);

  const continueToEditor = async (templateId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const next = templateEditorNext(templateId);
    router.replace(user ? next : `/register?next=${encodeURIComponent(next)}`);
  };

  const savePortfolio = async () => {
    if (!isDirty || saveState === "saving") return;
    if (pageState.step !== "customize") return;
    if (!canPersist) return;
    setSaveState("saving");
    setFeedback("");
    try {
      const result = await sendPortfolio("save", pageState.templateId, data);
      setSavedData(JSON.stringify(data));
      setSavedTemplateId(pageState.templateId);
      setPortfolioSlug(result.slug);
      setSaveState("saved");
      setPublishState("idle");
    } catch (error) {
      setSaveState("error");
      setFeedback(
        error instanceof RequestError
          ? error.message
          : "Unable to save. Check your connection and try again.",
      );
    }
  };

  const publishPortfolio = async () => {
    if (publishState === "publishing") return;
    if (pageState.step !== "customize") return;
    if (!canPersist) return;
    setPublishState("publishing");
    setFeedback("");
    try {
      const result = await sendPortfolio("publish", pageState.templateId, data);
      setSavedData(JSON.stringify(data));
      setSavedTemplateId(pageState.templateId);
      setPortfolioSlug(result.slug);
      setPublishState("published");
      setSaveState("saved");
    } catch (error) {
      setPublishState("error");
      setFeedback(
        error instanceof RequestError
          ? error.message
          : "Unable to publish. Check your connection and try again.",
      );
    }
  };

  const copyPublicLink = async () => {
    if (!portfolioSlug) return;
    await navigator.clipboard.writeText(
      `${window.location.origin}/p/${portfolioSlug}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  /* ── Selection view ── */
  if (pageState.step === "select") {
    const selectedId = pageState.selected;

    return (
      <div className="min-h-screen bg-background">
        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 lg:px-10 py-5 bg-background/80 backdrop-blur-xl"
        >
          <Link
            href="/templates/demo/minimal"
            className="text-[10px] sm:text-[11px] font-mono text-foreground/40 tracking-[0.15em] uppercase hover:text-foreground/70 transition-colors duration-300"
          >
            Gayane Khachatryan
          </Link>
          <Link
            href="/templates/demo/minimal"
            className="text-[10px] sm:text-[11px] font-mono tracking-[0.15em] uppercase text-foreground/30 hover:text-foreground/60 transition-colors duration-300"
          >
            View Demo
          </Link>
        </motion.nav>

        {/* Hero */}
        <HeroSection />

        {/* Template Grid */}
        <section className="px-6 sm:px-8 lg:px-10 pb-12">
          <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {templates.map((template, i) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedId === template.id}
                onSelect={() =>
                  setPageState({
                    step: "select",
                    selected: selectedId === template.id ? null : template.id,
                  })
                }
                delay={0.25 + i * 0.1}
              />
            ))}
          </div>
        </section>

        {/* Continue bar */}
        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5"
            >
              <div className="max-w-[1120px] mx-auto">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-border/40 shadow-xl shadow-black/5 px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        selectedId === "bold" ? "bg-foreground" : "bg-muted"
                      }`}
                    />
                    <p className="text-[11px] font-mono tracking-[0.1em] uppercase text-foreground/40 truncate">
                      {templates.find((t) => t.id === selectedId)?.name}{" "}
                      template selected
                    </p>
                  </div>
                  <button
                    onClick={() => continueToEditor(selectedId)}
                    className="group shrink-0 inline-flex items-center gap-2.5 bg-foreground text-primary-foreground text-[11px] font-mono tracking-[0.1em] uppercase px-6 py-3 rounded hover:bg-foreground/90 transition-all duration-300"
                  >
                    Continue
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer
          className={`py-8 px-6 sm:px-8 lg:px-10 border-t border-border/40 ${
            selectedId ? "pb-28" : ""
          }`}
        >
          <div className="max-w-[1120px] mx-auto flex items-center justify-between">
            <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-foreground/20">
              Portfolio Template
            </p>
            <Link
              href="/"
              className="text-[10px] font-mono tracking-[0.15em] uppercase text-foreground/20 hover:text-foreground/50 transition-colors duration-300"
            >
              View Demo
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  /* ── Customize view (editor + preview) ── */
  const activeTemplate = templates.find((t) => t.id === pageState.templateId)!;
  const isDark = activeTemplate.theme === "dark";
  const smooth = [0.22, 1, 0.36, 1] as const;
  const statusText =
    loadState === "loading"
      ? "Loading..."
      : loadState === "failed"
        ? "Not loaded"
        : activeUploads > 0
          ? "Uploading image..."
          : feedback ||
            (isDirty
              ? "Unsaved changes"
              : saveState === "saving"
                ? "Saving..."
                : "Saved");
  const backToTemplates = () =>
    setPageState({ step: "select", selected: pageState.templateId });

  // Layout after the reference editor: a white panel on the left with the
  // inputs, and the portfolio in a canvas card beside it, whose slim top bar
  // holds the title, the status and Save and Publish. On large screens the
  // panel can slide away so the canvas widens to the full screen, and "Edit"
  // slides it back.
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="editor"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="h-screen bg-white flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Editor panel */}
        <div
          className={`min-h-0 shrink-0 overflow-hidden bg-white lg:h-full lg:transition-[width,opacity] lg:duration-500 lg:ease-[cubic-bezier(0.22,1,0.36,1)] ${
            editorOpen
              ? "lg:w-[420px] lg:opacity-100 xl:w-[460px]"
              : "lg:w-0 lg:opacity-0"
          } ${mobileView === "editor" ? "flex flex-1 lg:flex-none" : "hidden lg:flex"}`}
          inert={!editorOpen ? true : undefined}
        >
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: smooth }}
            className="flex h-full min-h-0 w-full flex-col lg:w-[420px] xl:w-[460px]"
          >
            <div className="hidden shrink-0 px-6 pt-5 sm:px-7 lg:block">
              <Link href="/templates" className={` group flex items-center gap-1.5 rounded text-xs font-semibold uppercase tracking-[0.08em] text-foreground no-underline`}>
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Templates
            </Link>
              <div className="mt-5 flex items-center justify-between">
                <h1 className="m-0 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                  Editor
                </h1>
                <Tooltip label="Hide editor" side="left">
                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    aria-label="Hide editor"
                    className="grid size-8 place-items-center rounded text-foreground/45 transition-colors duration-200 hover:bg-foreground/[0.05] hover:text-foreground"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              data-lenis-prevent
            >
              <div className="p-6 pt-4 sm:p-7 sm:pt-4">
                <p className="mb-8 text-[13px] text-foreground/40 leading-relaxed">
                  Fill in your details. The preview updates live.
                </p>
                <InlineEditor
                  data={data}
                  onChange={setData}
                  onUploadStart={() => setActiveUploads((count) => count + 1)}
                  onUploadEnd={() =>
                    setActiveUploads((count) => Math.max(0, count - 1))
                  }
                />
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Canvas */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: smooth }}
          className={`order-first flex min-w-0 flex-col lg:order-none lg:h-full lg:flex-1 p-4 md:p-6 lg:transition-[padding] lg:duration-500 ${
            editorOpen ? "lg:pl-0" : "lg:pl-2"
          } ${mobileView === "preview" ? "min-h-0 flex-1" : "shrink-0"}`}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white shadow-[0_0_25px_rgba(0,0,0,0.11)]">
            {/* Top bar */}
            <div className="grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border/40 px-3 sm:px-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={backToTemplates}
                  aria-label="Back to templates"
                  className="grid size-8 place-items-center rounded text-foreground/50 transition-colors hover:text-foreground lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                {/* Mobile toggle */}
                <div className="flex lg:hidden rounded-lg overflow-hidden border border-border/40">
                  <button
                    onClick={() => setMobileView("editor")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-[0.1em] uppercase transition-all duration-200 ${
                      mobileView === "editor"
                        ? "bg-foreground text-primary-foreground"
                        : "text-foreground/35 hover:text-foreground/60"
                    }`}
                  >
                    <Pen className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setMobileView("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-[0.1em] uppercase transition-all duration-200 ${
                      mobileView === "preview"
                        ? "bg-foreground text-primary-foreground"
                        : "text-foreground/35 hover:text-foreground/60"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
                {/* Large screens: bring the editor panel back */}
                <AnimatePresence initial={false}>
                  {!editorOpen && (
                    <motion.button
                      key="edit"
                      type="button"
                      onClick={() => setEditorOpen(true)}
                      initial={{ opacity: 0, scale: 0.85, x: -6 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85, x: -6 }}
                      transition={{ duration: 0.3, ease: smooth }}
                      whileTap={{ scale: 0.96 }}
                      className="hidden items-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-foreground/85 lg:flex"
                    >
                      <Pen className="h-3 w-3" />
                      Edit
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Title and status */}
              <div className="flex min-w-0 flex-col items-center leading-tight">
                <span className="flex items-center gap-1.5 truncate text-xs font-medium text-foreground">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDark ? "bg-foreground" : "bg-muted"
                    }`}
                  />
                  {activeTemplate.name}
                </span>
                <span className="relative hidden overflow-hidden text-[11px] text-foreground/45 sm:block" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={statusText}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.22, ease: smooth }}
                      className="block max-w-[36vw] truncate"
                    >
                      {statusText}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              {/* Save and Publish */}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={savePortfolio}
                  disabled={!isDirty || saveState === "saving" || !canPersist}
                  className="rounded border border-border/70 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.1em] text-foreground transition disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {saveState === "saving" ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={publishPortfolio}
                  disabled={publishState === "publishing" || !canPersist}
                  className="rounded bg-foreground px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.1em] text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {publishState === "publishing"
                    ? "Publishing..."
                    : publishState === "published" && !isDirty
                      ? "Published"
                      : "Publish"}
                </button>
              </div>
            </div>

            {loadState === "failed" && (
              <div
                role="alert"
                className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-5 py-2 text-[11px] text-red-700 sm:px-6"
              >
                <span>
                  Your saved portfolio could not be loaded. Saving and publishing
                  are turned off so your saved work is not overwritten.
                </span>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded border border-red-300 px-3 py-1 font-mono uppercase tracking-[0.1em] hover:bg-red-100"
                >
                  Reload
                </button>
              </div>
            )}

            <AnimatePresence initial={false}>
              {publishState === "published" && portfolioSlug && !isDirty && (
                <motion.div
                  key="published"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: smooth }}
                  className="shrink-0 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-end gap-3 border-b border-border/40 bg-white px-5 py-2 text-[10px] font-mono uppercase tracking-[0.1em] text-foreground/50 sm:px-6">
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary" /> Published successfully
                    </span>
                    <span className="normal-case tracking-normal text-foreground/40">
                      {window.location.origin}/p/{portfolioSlug}
                    </span>
                    <button
                      type="button"
                      onClick={copyPublicLink}
                      className="flex items-center gap-1.5 text-foreground hover:text-primary"
                    >
                      <Copy className="h-3 w-3" /> {copied ? "Copied" : "Copy link"}
                    </button>
                    <a
                      href={`/p/${portfolioSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground hover:text-primary"
                    >
                      View portfolio
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Portfolio */}
            <div
              className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${
                isDark ? "bg-foreground" : "bg-white"
              } ${mobileView === "preview" ? "block" : "hidden lg:block"}`}
              data-lenis-prevent
              ref={previewViewportRef}
            >
              {pageState.templateId === "minimal" ? (
                <MinimalPreview
                  data={data}
                  scrollContainerRef={previewViewportRef}
                />
              ) : (
                <BoldPreview data={data} />
              )}
            </div>
          </div>
        </motion.main>
      </motion.div>
    </AnimatePresence>
  );
}
