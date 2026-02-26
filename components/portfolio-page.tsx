"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const projects = [
  {
    title: "Platform Migration",
    description:
      "Led migration from monolith to modular services, cutting deployment risk and improving release cadence.",
    impact: "42% faster release cycle",
  },
  {
    title: "Design System Rollout",
    description:
      "Built shared UI foundation across product surfaces with clear contribution standards.",
    impact: "3x faster frontend delivery",
  },
  {
    title: "Observability Program",
    description:
      "Introduced production telemetry, SLO dashboards, and incident workflows for critical paths.",
    impact: "65% lower mean time to resolution",
  },
];

export default function PortfolioPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),_transparent_45%)]" />
      <div className="container py-16 md:py-24">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <p className="text-sm font-medium text-primary">Senior Engineer</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            I design and ship resilient product experiences at scale.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            I partner with product and platform teams to move from strategy to
            production with clear architecture, quality execution, and
            measurable outcomes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">View Resume</Button>
            <Button size="lg" variant="outline">
              Book Intro Call
            </Button>
          </div>
          <div className="flex gap-5 text-muted-foreground">
            <a className="hover:text-foreground" href="#" aria-label="GitHub">
              <Github className="size-5" />
            </a>
            <a className="hover:text-foreground" href="#" aria-label="LinkedIn">
              <Linkedin className="size-5" />
            </a>
            <a
              className="hover:text-foreground"
              href="mailto:hello@example.com"
              aria-label="Email"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </motion.section>

        <section className="mt-20 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                10+ years building software in high-growth environments.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              I work across frontend architecture, developer experience, and
              product delivery. My focus is creating systems that are
              maintainable for teams and delightful for users.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Current Focus</CardTitle>
              <CardDescription>
                What I help teams with right now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Frontend platform modernization</p>
              <p>• Design system adoption</p>
              <p>• Performance and observability</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-20 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Selected Projects
            </h2>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              All case studies <ArrowUpRight className="size-4" />
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm font-medium text-primary">
                    {project.impact}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>Let’s build something meaningful.</CardTitle>
              <CardDescription>
                Open to senior IC and staff-level opportunities with
                product-minded engineering teams.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="gap-2">
                Contact Me <ArrowUpRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
