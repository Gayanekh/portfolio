"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/landing/Reveal";
import { LandingSection, SectionHeader } from "@/components/landing/Section";
import { ease, text } from "@/components/landing/landing-ui";

const STEPS = [
  { title: "Choose a template", text: "Pick a layout that suits how you like to present your work. Switch any time; your content stays put." },
  { title: "Add your information and work", text: "Fill in your details and work samples one section at a time. The live preview shows exactly how your page will look." },
  { title: "Publish and share", text: "Get a portory.net address to send to anyone. Edit any time and publish your changes when they're ready." },
];


const row = "flex items-center justify-between rounded-xl border border-foreground/10 bg-white px-3.5 py-2.5";

// The small product UI shown for each step.
function StepVisual({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="flex items-center gap-1 rounded-full bg-foreground/[0.06] p-1 text-sm">
        {["Atelier", "Ledger", "Gallery"].map((name) => (
          <span key={name} className={`rounded-full px-3.5 py-1.5 ${name === "Ledger" ? "bg-foreground font-medium text-background" : "text-foreground/60"}`}>
            {name}
          </span>
        ))}
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="flex w-full max-w-[16rem] flex-col gap-2 text-sm">
        <div className={row}><span>About you</span><span className="text-success-foreground">Done</span></div>
        <div className={row}><span>Projects</span><span className="text-foreground/55">2 added</span></div>
      </div>
    );
  }
  return (
    <div className="flex w-full max-w-[16rem] flex-col gap-2 text-sm">
      <div className="rounded-xl border border-foreground/10 bg-foreground/[0.04] px-3.5 py-2.5 text-foreground/60">portory.net/lena-fischer</div>
      <div className={row}><span>Status</span><span className="text-success-foreground">Published</span></div>
    </div>
  );
}

function StepCard({ step, compact = false }: { step: number; compact?: boolean }) {
  return (
    <div className="h-full rounded-[1.75rem] border border-foreground/5 bg-card p-3 shadow-[0_1px_3px_rgb(0_0_0/0.04),0_24px_48px_-24px_rgb(0_0_0/0.25)]">
      <div className={`grid h-full place-items-center rounded-[1.25rem] bg-white px-6 ${compact ? "" : "min-h-[14rem]"}`}>
        <StepVisual step={step} />
      </div>
    </div>
  );
}

// How it works, after the reference: the steps scroll by on the left while the
// three images stay pinned in a column on the right. Whichever step is in the middle of
// the screen is highlighted, and so is its image. On phones each step shows
// its own image under the text instead.
export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = stepRefs.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      // A thin band across the middle of the screen decides the active step.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <LandingSection id="how-it-works" label="How it works">
      <SectionHeader
        label="How it works"
        title="Everything you need to present your work"
        intro="From choosing a template to sharing your link — Portory keeps every step simple."
      />
      <Reveal>
        <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <motion.article
                key={step.title}
                ref={(element) => { stepRefs.current[i] = element; }}
                animate={{ opacity: i === active ? 1 : 0.35 }}
                transition={{ duration: 0.4, ease }}
                aria-current={i === active ? "step" : undefined}
                className="flex flex-col justify-center gap-4 py-10 md:min-h-[75vh] md:py-0"
              >
                <span className="grid size-8 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">{i + 1}</span>
                <h3 className="m-0 text-balance text-[length:clamp(1.6rem,7vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[length:clamp(1.75rem,3vw,2.75rem)]">{step.title}</h3>
                <p className={`${text.lgXl} m-0 max-w-[30rem] text-balance leading-snug text-foreground/65`}>{step.text}</p>
                <div className="mt-4 h-64 md:hidden">
                  <StepCard step={i} />
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pinned images in a column: they stay put while the steps scroll past. */}
          <div aria-hidden="true" className="relative hidden md:block">
            <div className="sticky top-[max(6rem,calc(50vh-23rem))] flex h-[min(46rem,calc(100vh-8rem))] flex-col gap-5">
              {STEPS.map((step, i) => {
                const on = i === active;
                return (
                  <motion.div
                    key={step.title}
                    initial={false}
                    animate={{ scale: on ? 1 : 0.96, opacity: on ? 1 : 0.5 }}
                    transition={{ duration: 0.6, ease }}
                    className="min-h-0 flex-1"
                  >
                    <StepCard step={i} compact />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </LandingSection>
  );
}
