"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, Pen } from "lucide-react";
import { PortfolioData, ProjectData } from "@/context/PortfolioContext";
import HeroSection from "@/components/templates/HeroSection";
import TemplateCard, {
  type TemplateData,
} from "@/components/templates/TemplateCard";
import InlineEditor from "@/components/templates/InlineEditor";
import MinimalPreview from "@/components/templates/MinimalPreview";
import BoldPreview from "@/components/templates/BoldPreview";

/* ─── template data ─── */

const templates: TemplateData[] = [
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Clean & Refined",
    description:
      "A light, editorial layout with a sticky sidebar and stacked project cards. Perfect for designers and creatives who want their work to speak for itself.",
    badge: "Light",
    theme: "light",
    demoHref: "/",
    previewImages: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "bold",
    name: "Bold",
    tagline: "Dark & Striking",
    description:
      "A dark, immersive layout with a cinematic hero and grid-based project showcase. Ideal for developers, photographers, and anyone who wants to stand out.",
    badge: "Dark",
    theme: "dark",
    demoHref: "/demo/bold",
    previewImages: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

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
  projects: [makeProject(0), makeProject(1), makeProject(2), makeProject(3)],
};

/* ─── page state type ─── */

type PageState =
  | { step: "select"; selected: string | null }
  | { step: "customize"; templateId: string };

/* ═══════════════════════════════════════════════
   TEMPLATE PAGE
   ═══════════════════════════════════════════════ */

export default function TemplatePage() {
  const [pageState, setPageState] = useState<PageState>({
    step: "select",
    selected: null,
  });
  const [data, setData] = useState<PortfolioData>(
    JSON.parse(JSON.stringify(initialData)),
  );
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

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
            href="/"
            className="text-[10px] sm:text-[11px] font-mono text-foreground/40 tracking-[0.15em] uppercase hover:text-foreground/70 transition-colors duration-300"
          >
            Gayane Khachatryan
          </Link>
          <Link
            href="/"
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
                    selected:
                      selectedId === template.id ? null : template.id,
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
                    onClick={() =>
                      setPageState({
                        step: "customize",
                        templateId: selectedId,
                      })
                    }
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
  const activeTemplate = templates.find(
    (t) => t.id === pageState.templateId,
  )!;
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
        <div className="shrink-0 bg-white/90 backdrop-blur-xl border-b border-border/40 px-5 sm:px-6 py-3.5 flex items-center justify-between">
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
          </div>
        </div>

        {/* Split layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Editor panel */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:w-[420px] xl:w-[460px] shrink-0 bg-[#fafafa] border-r border-border/30 h-full overflow-y-auto ${
              mobileView === "editor" ? "block" : "hidden lg:block"
            }`}
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
            className={`flex-1 h-full overflow-y-auto bg-[#eeeee9] ${
              mobileView === "preview" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Browser frame */}
              <div
                className={`
                  rounded-xl overflow-hidden shadow-2xl shadow-black/8
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

                {/* Template preview */}
                {pageState.templateId === "minimal" ? (
                  <MinimalPreview data={data} />
                ) : (
                  <BoldPreview data={data} />
                )}
              </div>
            </div>
          </motion.main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
