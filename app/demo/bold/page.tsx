"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "Fintech Onboarding Redesign",
    description:
      "Redesigned the first-time user onboarding journey for a mobile wallet, reducing drop-off across identity verification and card-linking flows.",
    focus: ["UX Strategy", "Prototyping", "A/B Testing"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "02",
    title: "SaaS Design System",
    description:
      "Built a scalable React component library and Figma token system used by four product squads to unify enterprise dashboard experiences.",
    focus: ["Design Systems", "React", "Accessibility"],
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "03",
    title: "E-commerce Checkout Optimization",
    description:
      "Simplified checkout architecture and interaction states for a high-volume storefront, improving completion and reducing support tickets.",
    focus: ["Conversion", "UI Architecture", "Research"],
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "04",
    title: "Healthcare Patient Portal",
    description:
      "Designed a patient-facing portal with clearer appointment, records, and messaging flows while meeting strict privacy and accessibility requirements.",
    focus: ["Service Design", "WCAG", "Product Thinking"],
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80",
  },
];

const services = [
  "Product Design",
  "UX Strategy",
  "Design Systems",
  "Prototyping",
  "Frontend Dev",
];

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function BoldDemoPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        scrollHeight > 0
          ? Math.max(0, Math.min(100, (scrollTop / scrollHeight) * 100))
          : 0,
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-white/[0.04]">
        <motion.div
          className="h-full bg-white/20"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 lg:px-10 py-5 bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/[0.04]"
      >
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.15em] uppercase text-white/30">
          Gayane Khachatryan
        </span>
        <div className="flex items-center gap-5">
          <a
            href="#works"
            className="hidden md:inline text-[10px] font-mono tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors duration-300"
          >
            Works
          </a>
          <a
            href="#contact"
            className="hidden md:inline text-[10px] font-mono tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors duration-300"
          >
            Contact
          </a>
          <Link
            href="/template"
            className="text-[10px] sm:text-[11px] font-mono tracking-[0.12em] uppercase bg-white text-[#0a0a0a] px-4 py-2 rounded-lg hover:bg-white/90 transition-colors duration-300"
          >
            Use Template
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="px-6 sm:px-8 lg:px-10 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24 max-w-[1120px] mx-auto"
      >
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-5 mb-6"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/[0.06] border border-white/[0.08] overflow-hidden shrink-0">
            <img
              src="/avatar.png"
              alt="Gayane Khachatryan"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20 mb-1">
              Portfolio
            </p>
            <p className="text-[13px] text-white/30 font-mono tracking-[0.1em] uppercase">
              Product Designer
            </p>
          </div>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extralight text-white leading-[1.08] tracking-[-0.02em] mb-5"
        >
          Gayane
          <br />
          Khachatryan
        </motion.h1>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
          className="text-[15px] text-white/35 leading-relaxed max-w-[480px] mb-8"
        >
          Design-focused product thinker creating intuitive, research-driven
          digital experiences across fintech, SaaS, and healthcare.
        </motion.p>
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
          className="flex flex-wrap items-center gap-4 text-[10px] font-mono tracking-[0.15em] uppercase text-white/20"
        >
          <span>Product Designer</span>
          <span className="w-1 h-1 rounded-full bg-white/15" />
          <span>hello@gayanekhachatryan.com</span>
          <span className="w-1 h-1 rounded-full bg-white/15" />
          <span>Available 2026</span>
        </motion.div>
      </motion.section>

      {/* Services */}
      <section className="px-6 sm:px-8 lg:px-10 py-10 border-y border-white/[0.06]">
        <div className="max-w-[1120px] mx-auto flex flex-wrap gap-3">
          {services.map((service) => (
            <span
              key={service}
              className="text-[10px] font-mono tracking-[0.12em] uppercase border border-white/[0.08] text-white/35 px-4 py-2.5 rounded-lg hover:border-white/20 hover:text-white/60 transition-all duration-300 cursor-default"
            >
              {service}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="works" className="px-6 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/15 mb-10 sm:mb-12">
            Selected Work
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {projects.map((project, i) => (
              <motion.article
                key={project.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease, delay: i % 2 === 1 ? 0.08 : 0 }}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/[0.03] mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover year badge */}
                  <div className="absolute bottom-3 left-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/60 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-md">
                      {project.year}
                    </span>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute top-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-start gap-2.5 mb-1.5">
                  <span className="text-[10px] font-mono text-white/15 mt-0.5">
                    {project.number}
                  </span>
                  <span className="w-4 h-px bg-white/10 mt-2.5" />
                  <h3 className="text-[15px] font-light text-white/75 group-hover:text-white/95 transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
                <p className="text-[12px] text-white/25 leading-[1.6] pl-[30px] mb-2.5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pl-[30px]">
                  {project.focus.map((f, fi) => (
                    <span
                      key={fi}
                      className="text-[9px] font-mono tracking-[0.1em] uppercase text-white/15"
                    >
                      {f}
                      {fi < project.focus.length - 1 && (
                        <span className="ml-1.5 text-white/8">/</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Archive */}
      <section className="px-6 sm:px-8 lg:px-10 py-12 border-t border-white/[0.06]">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/15 mb-4">
            Archive
          </p>
          <p className="text-[13px] text-white/25 leading-relaxed max-w-xl">
            Additional work includes product audits, dashboard redesigns,
            design system migrations, and mobile feature launches across
            fintech, commerce, and healthcare products.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="px-6 sm:px-8 lg:px-10 py-16 sm:py-20 border-t border-white/[0.06]"
      >
        <div className="max-w-[1120px] mx-auto flex items-end justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/15 mb-3">
              Get in Touch
            </p>
            <a
              href="mailto:hello@gayanekhachatryan.com"
              className="text-xl sm:text-2xl font-extralight text-white/60 hover:text-white/90 transition-colors duration-300"
            >
              hello@gayanekhachatryan.com
            </a>
          </div>
          <span className="hidden sm:block text-[10px] font-mono tracking-[0.15em] uppercase text-white/10">
            GK
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-8 lg:px-10 py-8 border-t border-white/[0.04]">
        <div className="max-w-[1120px] mx-auto flex items-center justify-between">
          <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/10">
            Bold Template Demo
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/10 hover:text-white/30 transition-colors duration-300"
            >
              Light Demo
            </Link>
            <Link
              href="/template"
              className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/10 hover:text-white/30 transition-colors duration-300"
            >
              Use Template
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
