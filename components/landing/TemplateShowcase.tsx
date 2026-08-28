"use client";

import Link from "next/link";
import { templates } from "@/components/templates/template-data";
import TemplateCard from "@/components/templates/TemplateCard";

export default function TemplateShowcase() {
  return (
    <section
      id="templates"
      className="border-y border-border/50 bg-white px-6 py-24 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-[1200px]">
        <p className="mb-5 text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/45">
          Choose a template
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
            Pick your style,
            <br />
            <span className="text-foreground/35">make it yours.</span>
          </h2>
          <Link
            href="/templates"
            className="text-xs text-foreground/55 underline decoration-border underline-offset-4 hover:text-foreground"
          >
            View all templates -&gt;
          </Link>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {templates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={false}
              onSelect={() => undefined}
              delay={index * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
