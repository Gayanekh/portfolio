"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Copy, Eye, Pen } from "lucide-react";
import { PortfolioData, ProjectData } from "@/context/PortfolioContext";
import HeroSection from "@/components/templates/HeroSection";
import TemplateCard from "@/components/templates/TemplateCard";
import InlineEditor from "@/components/templates/InlineEditor";
import MinimalPreview from "@/components/templates/MinimalPreview";
import BoldPreview from "@/components/templates/BoldPreview";
import { templates } from "@/components/templates/template-data";
import { createClient } from "@/lib/supabase/client";
import { templateEditorNext } from "@/lib/auth-routing";

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

    fetch("/api/portfolios")
      .then(async (response) => {
        if (!response.ok) return null;
        const result = await response.json();
        return result.portfolio;
      })
      .then((portfolio) => {
        if (!portfolio) return;
        setData(portfolio.portfolio_data);
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
      .catch(() => undefined);
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
    setSaveState("saving");
    setFeedback("");
    try {
      const response = await fetch("/api/portfolios/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: pageState.templateId,
          portfolioData: data,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSavedData(JSON.stringify(data));
      setSavedTemplateId(pageState.templateId);
      setPortfolioSlug(result.portfolio.slug);
      setSaveState("saved");
      setPublishState("idle");
    } catch {
      setSaveState("error");
      setFeedback("Unable to save. Please try again.");
    }
  };

  const publishPortfolio = async () => {
    if (publishState === "publishing") return;
    if (pageState.step !== "customize") return;
    setPublishState("publishing");
    setFeedback("");
    try {
      const response = await fetch("/api/portfolios/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: pageState.templateId,
          portfolioData: data,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSavedData(JSON.stringify(data));
      setSavedTemplateId(pageState.templateId);
      setPortfolioSlug(result.portfolio.slug);
      setPublishState("published");
      setSaveState("saved");
    } catch {
      setPublishState("error");
      setFeedback("Unable to publish. Please try again.");
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
      <div className="min-h-screen bg-[#fafafa]">
        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 lg:px-10 py-5 bg-[#fafafa]/80 backdrop-blur-xl"
        >
          <Link
            href="/demo/minimal"
            className="text-[10px] sm:text-[11px] font-mono text-foreground/40 tracking-[0.15em] uppercase hover:text-foreground/70 transition-colors duration-300"
          >
            Gayane Khachatryan
          </Link>
          <Link
            href="/demo/minimal"
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
                        selectedId === "bold" ? "bg-[#111]" : "bg-[#e8e8e6]"
                      }`}
                    />
                    <p className="text-[11px] font-mono tracking-[0.1em] uppercase text-foreground/40 truncate">
                      {templates.find((t) => t.id === selectedId)?.name}{" "}
                      template selected
                    </p>
                  </div>
                  <button
                    onClick={() => continueToEditor(selectedId)}
                    className="group shrink-0 inline-flex items-center gap-2.5 bg-foreground text-primary-foreground text-[11px] font-mono tracking-[0.1em] uppercase px-6 py-3 rounded-xl hover:bg-foreground/90 transition-all duration-300"
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="editor"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="h-screen bg-[#f5f5f3] flex flex-col overflow-hidden"
      >
        {/* Top bar */}
        <div className="shrink-0 bg-white/90 backdrop-blur-xl border-b border-border/40 px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={() =>
              setPageState({ step: "select", selected: pageState.templateId })
            }
            className="flex items-center gap-2 text-[10px] font-mono tracking-[0.12em] uppercase text-foreground/35 hover:text-foreground/70 transition-colors duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Templates</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2.5">
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

            <span className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-[0.12em] uppercase text-foreground/25 bg-foreground/[0.03] border border-border/30 rounded-lg px-3 py-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDark ? "bg-[#111]" : "bg-[#e8e8e6]"
                }`}
              />
              {activeTemplate.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden text-[10px] font-mono uppercase tracking-[0.1em] text-foreground/45 sm:inline">
                {feedback ||
                  (isDirty
                    ? "Unsaved changes"
                    : saveState === "saving"
                      ? "Saving..."
                      : "Saved")}
              </span>
              <button
                type="button"
                onClick={savePortfolio}
                disabled={!isDirty || saveState === "saving"}
                className="rounded-md border border-border/70 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.1em] text-foreground transition disabled:cursor-not-allowed disabled:opacity-35"
              >
                {saveState === "saving" ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={publishPortfolio}
                disabled={publishState === "publishing"}
                className="rounded-md bg-foreground px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.1em] text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishState === "publishing"
                  ? "Publishing..."
                  : publishState === "published" && !isDirty
                    ? "Published"
                    : "Publish"}
              </button>
            </div>
          </div>
        </div>

        {publishState === "published" && portfolioSlug && !isDirty && (
          <div className="shrink-0 flex flex-wrap items-center justify-end gap-3 border-b border-border/40 bg-white px-5 py-2 text-[10px] font-mono uppercase tracking-[0.1em] text-foreground/50 sm:px-6">
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
        )}

        {/* Split layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Editor panel */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:w-[420px] xl:w-[460px] shrink-0 min-h-0 flex-1 lg:flex-none h-full overflow-y-auto overscroll-contain bg-[#fafafa] border-r border-border/30 ${
              mobileView === "editor" ? "block" : "hidden lg:block"
            }`}
            data-lenis-prevent
          >
            <div className="p-6 sm:p-7">
              <div className="mb-8">
                <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-foreground/25 mb-1.5">
                  Editor
                </p>
                <p className="text-[13px] text-foreground/40 leading-relaxed">
                  Fill in your details. The preview updates live.
                </p>
              </div>
              <InlineEditor data={data} onChange={setData} />
            </div>
          </motion.aside>

          {/* Preview panel */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`flex-1 min-w-0 min-h-0 h-full overflow-hidden bg-[#eeeee9] ${
              mobileView === "preview" ? "block" : "hidden lg:block"
            }`}
            data-lenis-prevent
          >
            <div className="flex h-full min-h-0 flex-col p-4 sm:p-6 lg:p-8">
              {/* Browser frame */}
              <div
                className={`
                  flex h-full min-h-0 flex-col overflow-hidden rounded-xl shadow-2xl shadow-black/8
                  ${isDark ? "bg-[#1a1a1a]" : "bg-white"}
                  border ${isDark ? "border-white/[0.06]" : "border-border/30"}
                `}
              >
                {/* Chrome bar */}
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 border-b ${
                    isDark
                      ? "border-white/[0.06] bg-[#111]"
                      : "border-border/20 bg-[#fafafa]"
                  }`}
                >
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`w-[9px] h-[9px] rounded-full ${
                          isDark ? "bg-white/[0.08]" : "bg-black/[0.08]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex-1 mx-8">
                    <div
                      className={`
                        rounded-md px-3 py-1 text-[10px] font-mono text-center
                        ${
                          isDark
                            ? "bg-white/[0.04] text-white/20"
                            : "bg-black/[0.03] text-black/20"
                        }
                      `}
                    >
                      {data.name
                        ? data.name.toLowerCase().replace(/\s+/g, "") + ".dev"
                        : "yourname.dev"}
                    </div>
                  </div>
                  <div className="w-[42px]" />
                </div>

                {/* Scrollable portfolio viewport */}
                <div
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
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
            </div>
          </motion.main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
