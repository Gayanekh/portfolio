"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import type { TemplateData } from "@/components/templates/template-data";

interface TemplateCardProps {
  template: TemplateData;
  isSelected: boolean;
  onSelect: () => void;
  delay?: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function TemplateCard({
  template,
  isSelected,
  onSelect,
  delay = 0,
}: TemplateCardProps) {
  const isDark = template.theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay }}
      className="group/card relative flex flex-col"
    >
      <button
        type="button"
        onClick={onSelect}
        className={`
          relative flex flex-col text-left rounded-2xl overflow-hidden
          transition-all duration-500 ease-out
          ${
            isSelected
              ? "ring-2 ring-foreground shadow-xl shadow-black/8"
              : "ring-1 ring-border/60 hover:ring-border hover:shadow-lg hover:shadow-black/5"
          }
        `}
      >
        {/* Selected indicator */}
        <div
          className={`
            absolute top-4 right-4 z-20 w-7 h-7 rounded-full flex items-center justify-center
            transition-all duration-300
            ${
              isSelected
                ? "bg-foreground scale-100 opacity-100"
                : "bg-foreground/0 scale-75 opacity-0 group-hover/card:opacity-40 group-hover/card:scale-90"
            }
          `}
        >
          <Check
            className={`w-3.5 h-3.5 ${
              isDark ? "text-white" : "text-primary-foreground"
            } ${isSelected ? "" : "text-foreground"}`}
            strokeWidth={2.5}
          />
        </div>

        {/* Preview area */}
        <div
          className={`
            relative aspect-[16/10] overflow-hidden
            ${isDark ? "bg-[#0e0e0e]" : "bg-[#f5f5f3]"}
          `}
        >
          {isDark ? (
            <DarkMockup images={template.previewImages} />
          ) : (
            <LightMockup images={template.previewImages} />
          )}

          {/* Hover zoom overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/[0.03] transition-colors duration-500" />
        </div>

        {/* Info area */}
        <div className="p-5 sm:p-6 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-normal text-foreground tracking-tight">
              {template.name}
            </h3>
            <span
              className={`
                text-[9px] font-mono tracking-[0.15em] uppercase px-2 py-[3px] rounded-full
                ${
                  isDark
                    ? "bg-foreground/8 text-foreground/50"
                    : "bg-foreground/5 text-foreground/45"
                }
              `}
            >
              {template.badge}
            </span>
          </div>

          <p className="text-[10px] font-mono tracking-[0.12em] uppercase text-foreground/30 mb-2.5">
            {template.tagline}
          </p>

          <p className="text-[13px] text-foreground/45 leading-[1.6] mb-5">
            {template.description}
          </p>

          <div className="flex items-center justify-between">
            <div
              className={`
                inline-flex items-center gap-2.5 text-[11px] font-mono tracking-[0.1em] uppercase
                transition-colors duration-300
                ${
                  isSelected
                    ? "text-foreground"
                    : "text-foreground/40 group-hover/card:text-foreground/70"
                }
              `}
            >
              {isSelected ? "Selected" : "Use this template"}
              <ArrowRight
                className={`
                  w-3.5 h-3.5 transition-transform duration-300
                  ${isSelected ? "" : "group-hover/card:translate-x-0.5"}
                `}
              />
            </div>

            <Link
              href={template.demoHref}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.1em] uppercase text-foreground/25 hover:text-foreground/60 transition-colors duration-300"
            >
              Demo
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

/* ─── Light mockup (Minimal template) ─── */

function LightMockup({ images }: { images: string[] }) {
  return (
    <div className="absolute inset-0 p-4 sm:p-6 flex gap-4 group-hover/card:scale-[1.02] transition-transform duration-700 ease-out">
      {/* Sidebar skeleton */}
      <div className="hidden sm:flex flex-col gap-3 w-24 shrink-0 pt-1">
        <div className="w-10 h-10 rounded-full bg-black/[0.06]" />
        <div className="space-y-1.5">
          <div className="h-2 bg-black/[0.06] rounded w-16" />
          <div className="h-1.5 bg-black/[0.04] rounded w-12" />
        </div>
        <div className="space-y-1 mt-2">
          <div className="h-1 bg-black/[0.03] rounded w-full" />
          <div className="h-1 bg-black/[0.03] rounded w-4/5" />
          <div className="h-1 bg-black/[0.03] rounded w-3/5" />
        </div>
      </div>

      {/* Projects */}
      <div className="flex-1 space-y-3 overflow-hidden">
        {images.map((src, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-[55%] aspect-[16/10] rounded-sm overflow-hidden bg-black/[0.04] shrink-0">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover grayscale opacity-80"
                loading="lazy"
              />
            </div>
            <div className="flex-1 pt-0.5 space-y-1.5">
              <div className="h-1 bg-black/[0.05] rounded w-6" />
              <div className="h-2 bg-black/[0.07] rounded w-4/5" />
              <div className="space-y-0.5 mt-1.5">
                <div className="h-1 bg-black/[0.03] rounded w-full" />
                <div className="h-1 bg-black/[0.03] rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dark mockup (Bold template) ─── */

function DarkMockup({ images }: { images: string[] }) {
  return (
    <div className="absolute inset-0 p-4 sm:p-6 group-hover/card:scale-[1.02] transition-transform duration-700 ease-out">
      {/* Hero skeleton */}
      <div className="space-y-2 mb-4 pb-3 border-b border-white/[0.06]">
        <div className="h-1.5 bg-white/[0.05] rounded w-14" />
        <div className="h-5 bg-white/[0.08] rounded w-44" />
        <div className="h-2 bg-white/[0.04] rounded w-52" />
      </div>

      {/* Grid projects */}
      <div className="grid grid-cols-2 gap-2.5">
        {images.slice(0, 2).map((src, i) => (
          <div key={i} className="space-y-1.5">
            <div className="aspect-[4/3] rounded-sm overflow-hidden bg-white/[0.04]">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover opacity-60"
                loading="lazy"
              />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-white/[0.06] rounded w-3/4" />
              <div className="h-1 bg-white/[0.03] rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
