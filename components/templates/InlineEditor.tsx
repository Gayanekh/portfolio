"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, X } from "lucide-react";
import { PortfolioData, ProjectData } from "@/context/PortfolioContext";

interface InlineEditorProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

interface SectionHeaderProps {
  children: string;
}

const SectionHeader = ({ children }: SectionHeaderProps) => (
  <div className="flex items-center gap-3 mb-4">
    <p className="shrink-0 text-[12px] font-mono font-semibold tracking-[0.12em] uppercase text-foreground/80">
      {children}
    </p>
    <span className="h-px flex-1 bg-border/60" aria-hidden="true" />
  </div>
);

const NavigationToggle = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <label className="flex items-center justify-between gap-4 text-xs font-light text-foreground/70">
    <span>{label}</span>
    <span className="relative inline-flex h-[17px] w-[30px] shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-foreground/15 transition-colors peer-checked:bg-foreground" />
      <span className="pointer-events-none absolute left-[2px] top-[2px] h-[13px] w-[13px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[13px]" />
    </span>
  </label>
);

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

  const updateSkill = (index: number, value: string) => {
    const skills = [...data.skills];
    skills[index] = value;
    onChange({ ...data, skills });
  };

  const addSkill = () => {
    onChange({ ...data, skills: [...data.skills, ""] });
  };

  const removeSkill = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
    });
  };

  const updateNavigation = (
    key: "enabled" | "showAvailability",
    value: boolean,
  ) => {
    onChange({
      ...data,
      navigation: { ...data.navigation, [key]: value },
    });
  };

  const updateNavigationLink = (
    key: keyof PortfolioData["navigation"]["links"],
    value: boolean,
  ) => {
    onChange({
      ...data,
      navigation: {
        ...data.navigation,
        links: { ...data.navigation.links, [key]: value },
      },
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
    "w-full bg-white border border-border/60 rounded-lg px-3.5 py-2.5 text-sm font-light text-foreground/75 outline-none focus:border-foreground/35 focus:ring-1 focus:ring-foreground/10 transition-all placeholder:text-foreground/30";
  const labelClass =
    "text-[10px] font-mono font-normal tracking-[0.1em] uppercase text-foreground/50 block mb-1";
  const sectionClass = "pt-1";

  return (
    <div className="space-y-9">
      {/* Identity */}
      <section className={sectionClass}>
        <SectionHeader>Identity</SectionHeader>
        <div className="space-y-3">
          {/* Avatar upload */}
          <div>
            <label className={labelClass}>Avatar</label>
            <div className="flex items-center gap-4">
              <div
                className="relative w-16 h-16 rounded-full bg-foreground/[0.05] border border-dashed border-border/70 overflow-hidden cursor-pointer group shrink-0 hover:border-foreground/40 hover:bg-foreground/[0.08] transition-colors"
                role="button"
                tabIndex={0}
                aria-label="Upload profile photo"
                onClick={() => avatarRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    avatarRef.current?.click();
                  }
                }}
              >
                {data.avatar ? (
                  <img
                    src={data.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Upload className="w-4 h-4 text-foreground/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-light text-foreground/45 leading-relaxed">
                  Click to upload a profile photo.
                </p>
                {data.avatar && (
                  <button
                    onClick={() => onChange({ ...data, avatar: "" })}
                    type="button"
                    className="text-[10px] font-mono tracking-[0.1em] uppercase text-red-500/70 hover:text-red-600 transition-colors mt-1"
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
              placeholder="Your name"
              value={data.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Role / Tagline</label>
            <input
              className={inputClass}
              placeholder="Product designer"
              value={data.role}
              onChange={(e) => updateField("role", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Available for work</label>
              <input
                className={inputClass}
                placeholder="Year, e.g. 2026"
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

      {/* Navigation */}
      <section className={sectionClass}>
        <SectionHeader>Navigation</SectionHeader>
        <div className="space-y-3.5">
          <NavigationToggle
            label="Show navigation"
            checked={data.navigation.enabled}
            onChange={(checked) => updateNavigation("enabled", checked)}
          />

          <AnimatePresence initial={false}>
            {data.navigation.enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -4 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-2 border-t border-border/40 pt-3">
                  <p className="mb-2 text-[10px] font-mono font-normal tracking-[0.1em] uppercase text-foreground/50">
                    Navigation links
                  </p>
                  {(
                    [
                      ["work", "Work"],
                      ["about", "About"],
                      ["services", "Services"],
                      ["contact", "Contact"],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-xs font-light text-foreground/70"
                    >
                      <input
                        type="checkbox"
                        checked={data.navigation.links[key]}
                        onChange={(e) =>
                          updateNavigationLink(key, e.target.checked)
                        }
                        className="h-[13px] w-[13px] shrink-0 accent-foreground"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-3 mt-3">
                  <NavigationToggle
                    label="Show available for work"
                    checked={data.navigation.showAvailability}
                    onChange={(checked) =>
                      updateNavigation("showAvailability", checked)
                    }
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Display */}
      <section className={sectionClass}>
        <SectionHeader>Display</SectionHeader>
        <NavigationToggle
          label="Show scroll progress"
          checked={data.showScrollProgress}
          onChange={(checked) =>
            onChange({ ...data, showScrollProgress: checked })
          }
        />
      </section>

      {/* About */}
      <section className={sectionClass}>
        <SectionHeader>About</SectionHeader>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Heading</label>
            <input
              className={inputClass}
              placeholder="A short introduction"
              value={data.aboutHeading}
              onChange={(e) => updateField("aboutHeading", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Write a short introduction about yourself"
              value={data.aboutBody}
              onChange={(e) => updateField("aboutBody", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={sectionClass}>
        <SectionHeader>Services</SectionHeader>
        <div className="space-y-2">
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
                type="button"
                aria-label={`Remove service ${index + 1}`}
                className="p-2 rounded-lg text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={addService}
            type="button"
            className="flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-foreground/55 hover:text-foreground/80 transition-colors mt-2"
          >
            <Plus className="w-3 h-3" /> Add service
          </button>
        </div>
      </section>

      {/* Skills */}
      <section className={sectionClass}>
        <SectionHeader>Skills</SectionHeader>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 rounded-md border border-border/60 bg-white px-2.5 py-1.5"
            >
              <input
                className="w-24 bg-transparent text-xs font-light text-foreground/75 outline-none placeholder:text-foreground/30"
                placeholder="Add skill"
                aria-label={`Skill ${index + 1}`}
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
              />
              <button
                type="button"
                aria-label={`Remove skill ${index + 1}`}
                onClick={() => removeSkill(index)}
                className="rounded-sm p-0.5 text-foreground/45 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSkill}
          className="flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-foreground/55 hover:text-foreground/80 transition-colors mt-3"
        >
          <Plus className="w-3 h-3" /> Add skill
        </button>
      </section>

      {/* Projects */}
      <section className={sectionClass}>
        <SectionHeader>Projects</SectionHeader>
        <div className="space-y-2">
          {data.projects.map((proj, pi) => (
            <div
              key={pi}
              className="border border-border/40 rounded-xl bg-white overflow-hidden"
            >
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-foreground/[0.03] transition-colors"
                onClick={() => setOpenProject(openProject === pi ? null : pi)}
              >
                <span className="text-xs font-mono text-foreground/70">
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
                    <div className="px-4 pb-4 space-y-3 border-t border-border/30">
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
                              <Upload className="w-4 h-4 text-foreground/40" />
                              <p className="text-[10px] font-mono text-foreground/45">
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
                        type="button"
                        className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.1em] uppercase text-red-500/70 hover:text-red-600 transition-colors mt-1"
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
            type="button"
            className="flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-foreground/55 hover:text-foreground/80 transition-colors mt-1"
          >
            <Plus className="w-3 h-3" /> Add project
          </button>
        </div>
      </section>
    </div>
  );
}
