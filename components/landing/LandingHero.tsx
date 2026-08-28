"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MinimalPreview from "@/components/templates/MinimalPreview";
import type { PortfolioData } from "@/context/PortfolioContext";

const previewData: PortfolioData = {
  name: "Your Name",
  role: "Product Designer",
  availableYear: "2026",
  email: "you@example.com",
  avatar: "",
  aboutHeading: "",
  aboutBody: "Thoughtful digital experiences, clearly presented.",
  services: ["Product Design", "UX Strategy"],
  skills: ["Research", "Prototyping"],
  navigation: {
    enabled: true,
    links: { work: true, about: true, services: false, contact: true },
    showAvailability: true,
  },
  showScrollProgress: true,
  projects: [
    {
      number: "01",
      category: "Work",
      title: "Project One",
      description: "A focused case study.",
      focus: ["Design"],
      year: "2026",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      number: "02",
      category: "Work",
      title: "Project Two",
      description: "A considered digital product.",
      focus: ["Strategy"],
      year: "2025",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

export default function LandingHero() {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-16 px-6 pb-24 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10 lg:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-6 text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/45">
          Portfolio builder
        </p>
        <h1 className="max-w-xl text-5xl font-light leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Build a portfolio
          <br />
          <span className="text-foreground/35">worth sharing.</span>
        </h1>
        <p className="mt-7 max-w-md text-base leading-relaxed text-foreground/55">
          Choose a template, customize every detail, and publish your
          professional portfolio in minutes.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <Link
            href="/templates"
            className="inline-flex items-center gap-3 rounded-md bg-foreground px-5 py-3 text-xs text-primary-foreground transition-opacity hover:opacity-80"
          >
            Start building <span aria-hidden="true">-&gt;</span>
          </Link>
          <Link
            href="/templates"
            className="text-xs text-foreground/55 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            Explore templates
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="overflow-hidden rounded-lg border border-border/60 bg-white shadow-xl shadow-black/5"
      >
        <div className="flex items-center gap-1.5 border-b border-border/50 bg-[#fafafa] px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-foreground/10" />
          <span className="h-2 w-2 rounded-full bg-foreground/10" />
          <span className="h-2 w-2 rounded-full bg-foreground/10" />
          <span className="ml-5 flex-1 rounded bg-foreground/[0.03] px-3 py-1 text-center text-[9px] font-mono text-foreground/25">
            yourname.dev
          </span>
        </div>
        <div className="max-h-[540px] overflow-hidden">
          <MinimalPreview data={previewData} />
        </div>
      </motion.div>
    </section>
  );
}
