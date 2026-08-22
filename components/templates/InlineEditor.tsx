"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  PortfolioData,
  ProjectData,
} from "@/context/PortfolioContext";

interface InlineEditorProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

export default function InlineEditor({ data, onChange }: InlineEditorProps) {
  const [openProject, setOpenProject] = useState<number | null>(0);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  const updateField = (key: keyof PortfolioData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const updateService = (index: number, value: string) => {
    const services = [...data.services];
    services[index] = value;
    onChange({ ...data, services });
  };

  const addService = () => {
    onChange({ ...data, services: [...data.services, ""] });
  };

  const removeService = (index: number) => {
    onChange({
      ...data,
      services: data.services.filter((_, i) => i !== index),
    });
  };

  const updateProject = (
    projectIndex: number,
    key: keyof ProjectData,
    value: string | string[],
  ) => {
    const projects = data.projects.map((p, i) =>
      i === projectIndex ? { ...p, [key]: value } : p,
    );
    onChange({ ...data, projects });
  };

  const addProject = () => {
    const num = String(data.projects.length + 1).padStart(2, "0");
    const newProject: ProjectData = {
      number: num,
      category: "Work",
      title: "",
      description: "",
      focus: [],
      year: "",
      image: "",
    };
    onChange({ ...data, projects: [...data.projects, newProject] });
    setOpenProject(data.projects.length);
  };

  const removeProject = (index: number) => {
    onChange({
      ...data,
      projects: data.projects
        .filter((_, i) => i !== index)
        .map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") })),
    });
    setOpenProject(null);
  };

  const handleImageUpload = (projectIndex: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      updateProject(
        projectIndex,
        "image",
        (event.target?.result as string) || "",
      );
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({ ...data, avatar: (event.target?.result as string) || "" });
    };
    reader.readAsDataURL(file);
  };

  const inputClass =
    "w-full bg-white border border-border/50 rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground/25 focus:ring-1 focus:ring-foreground/5 transition-all placeholder:text-foreground/20";
  const labelClass =
    "text-[10px] font-mono tracking-[0.1em] uppercase text-foreground/35 block mb-1.5";

  return (
    <div className="space-y-8">
      {/* Identity */}
      <section>
        <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-foreground/25 mb-5">
          Identity
        </p>
        <div className="space-y-3.5">
          {/* Avatar upload */}
          <div>
            <label className={labelClass}>Avatar</label>
            <div className="flex items-center gap-4">
              <div
                className="relative w-16 h-16 rounded-full bg-foreground/[0.03] border border-dashed border-border/50 overflow-hidden cursor-pointer group shrink-0"
                onClick={() => avatarRef.current?.click()}
              >
                {data.avatar ? (
                  <img
                    src={data.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Upload className="w-4 h-4 text-foreground/15" />
                  </div>
                )}
                <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-foreground/30 leading-relaxed">
                  Click to upload a profile photo.
                </p>
                {data.avatar && (
                  <button
                    onClick={() => onChange({ ...data, avatar: "" })}
                    className="text-[10px] font-mono tracking-[0.1em] uppercase text-red-400/60 hover:text-red-500 transition-colors mt-1"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={avatarRef}
                onChange={(e) =>
                  e.target.files?.[0] && handleAvatarUpload(e.target.files[0])
                }
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              placeholder="Jane Smith"
              value={data.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Role / Tagline</label>
            <input
              className={inputClass}
              placeholder="Product Designer"
              value={data.role}
              onChange={(e) => updateField("role", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Available</label>
              <input
                className={inputClass}
                placeholder="2026"
                value={data.availableYear}
                onChange={(e) => updateField("availableYear", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                placeholder="you@email.com"
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-foreground/25 mb-5">
          About
        </p>
        <div className="space-y-3.5">
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              placeholder="Design-driven creative..."
              value={data.aboutHeading}
              onChange={(e) => updateField("aboutHeading", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Write a short introduction about yourself..."
              value={data.aboutBody}
              onChange={(e) => updateField("aboutBody", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section>
        <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-foreground/25 mb-5">
          Services
        </p>
        <div className="space-y-2.5">
          {data.services.map((service, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                className={`flex-1 ${inputClass}`}
                placeholder="e.g. UX Design"
                value={service}
                onChange={(e) => updateService(index, e.target.value)}
              />
              <button
                onClick={() => removeService(index)}
                className="p-2 rounded-lg text-foreground/20 hover:text-foreground/50 hover:bg-foreground/5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={addService}
            className="flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-foreground/30 hover:text-foreground/60 transition-colors mt-2"
          >
            <Plus className="w-3 h-3" /> Add service
          </button>
        </div>
      </section>

      {/* Projects */}
      <section>
        <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-foreground/25 mb-5">
          Projects
        </p>
        <div className="space-y-2">
          {data.projects.map((proj, pi) => (
            <div
              key={pi}
              className="border border-border/40 rounded-xl bg-white overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-foreground/[0.02] transition-colors"
                onClick={() =>
                  setOpenProject(openProject === pi ? null : pi)
                }
              >
                <span className="text-xs font-mono text-foreground/60">
                  {String(pi + 1).padStart(2, "0")} —{" "}
                  {proj.title || "Untitled Project"}
                </span>
                {openProject === pi ? (
                  <ChevronUp className="w-3.5 h-3.5 text-foreground/25" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-foreground/25" />
                )}
              </button>

              <AnimatePresence>
                {openProject === pi && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3.5 border-t border-border/30">
                      {/* Image upload */}
                      <div className="mt-3.5">
                        <label className={labelClass}>Image</label>
                        <div
                          className="relative w-full h-28 bg-foreground/[0.02] border border-dashed border-border/40 rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => fileRefs.current[pi]?.click()}
                        >
                          {proj.image ? (
                            <img
                              src={proj.image}
                              alt={proj.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-1.5">
                              <Upload className="w-4 h-4 text-foreground/15" />
                              <p className="text-[10px] font-mono text-foreground/20">
                                Click to upload
                              </p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Upload className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => {
                            fileRefs.current[pi] = el;
                          }}
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleImageUpload(pi, e.target.files[0])
                          }
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Title</label>
                        <input
                          className={inputClass}
                          placeholder="Project Name"
                          value={proj.title}
                          onChange={(e) =>
                            updateProject(pi, "title", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                          className={`${inputClass} resize-none`}
                          rows={2}
                          placeholder="What is this project about?"
                          value={proj.description}
                          onChange={(e) =>
                            updateProject(pi, "description", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Focus</label>
                          <input
                            className={inputClass}
                            placeholder="Design, Dev"
                            value={proj.focus.join(", ")}
                            onChange={(e) =>
                              updateProject(
                                pi,
                                "focus",
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Year</label>
                          <input
                            className={inputClass}
                            placeholder="2025"
                            value={proj.year}
                            onChange={(e) =>
                              updateProject(pi, "year", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeProject(pi)}
                        className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.1em] uppercase text-red-400/60 hover:text-red-500 transition-colors mt-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <button
            onClick={addProject}
            className="flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-foreground/30 hover:text-foreground/60 transition-colors mt-1"
          >
            <Plus className="w-3 h-3" /> Add project
          </button>
        </div>
      </section>
    </div>
  );
}
