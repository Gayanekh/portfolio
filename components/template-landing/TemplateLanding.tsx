"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CAPTIONS, THEME } from "@/components/template-landing/content";
import Header from "@/components/template-landing/Header";
import Hero from "@/components/template-landing/Hero";
import Work from "@/components/template-landing/Work";
import Band from "@/components/template-landing/Band";
import Features from "@/components/template-landing/Features";
import Design from "@/components/template-landing/Design";
import Claim from "@/components/template-landing/Claim";
import Steps from "@/components/template-landing/Steps";
import Questions from "@/components/template-landing/Questions";
import End from "@/components/template-landing/End";
import { ease, focusRing, frame, themes } from "@/components/template-landing/ui";

type Theme = keyof typeof themes;
const STORAGE_KEY = "template-landing-theme";
const THEME_EVENT = "template-landing-theme-change";
// Fallback when storage is unavailable (e.g. private mode).
let memoryTheme: Theme = "light";

const subscribeTheme = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
};
const readTheme = (): Theme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : localStorage.getItem(STORAGE_KEY) === "light" ? "light" : memoryTheme;
  } catch {
    return memoryTheme;
  }
};
const saveTheme = (next: Theme) => {
  memoryTheme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not remembered; the in-memory choice still applies for this visit.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
};

// The section in view, by its data-caption (the last whose top has passed
// the middle of the screen), for the caption in the bottom right.
function useCaption() {
  const [caption, setCaption] = useState("top");
  useEffect(() => {
    const update = () => {
      let current = "top";
      document.querySelectorAll<HTMLElement>("[data-caption]").forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight / 2) current = section.dataset.caption ?? current;
      });
      setCaption((previous) => (previous === current ? previous : current));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return caption;
}

// /template-landing: the Portory home page's content (its hero, templates,
// features, Make it yours, How it works, FAQ, address and footer) in the
// reference's grid language, separate from the home page. Behind everything run the grid's hairlines,
// the full height of the page; on top sit two fixed corners: the light/dark
// switch in the bottom left and, in the bottom right, a caption naming the
// section in view, rolling as it changes. The theme is remembered in this
// browser (a convenience; it falls back to light).
export default function TemplateLanding() {
  // Light on the server and the first render, then the saved choice.
  const theme = useSyncExternalStore(subscribeTheme, readTheme, (): Theme => "light");
  const caption = useCaption();
  const choose = saveTheme;

  return (
    <MotionConfig reducedMotion="user">
      <div data-site-scale className={`relative min-h-screen overflow-x-clip bg-[var(--bg)] text-[var(--fg)] antialiased transition-colors duration-500 ${themes[theme]}`}>
        {/* The grid's hairlines, the full height of the page, behind everything; drawn over the page itself (not the window) so they sit exactly on the columns, scrollbar or not. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className={`relative h-full ${frame}`}>
            <div className="relative h-full border-0 border-x border-solid border-[var(--line)]">
              <span className="absolute inset-y-0 left-1/4 hidden w-px bg-[var(--line)] lg:block" />
              <span className="absolute inset-y-0 left-1/2 hidden w-px bg-[var(--line)] lg:block" />
              <span className="absolute inset-y-0 left-3/4 hidden w-px bg-[var(--line)] lg:block" />
            </div>
          </div>
        </div>

        <Header />
        <main className="relative z-10">
          <Hero />
          <Work />
          <Band />
          <Features />
          <Design />
          <Steps />
          <Questions />
          <Claim />
        </main>
        <End />

        {/* The light/dark switch. */}
        <div role="radiogroup" aria-label="Theme" className="fixed bottom-[clamp(1rem,2.5vh,1.75rem)] left-[clamp(1rem,1.75vw,2rem)] z-40 hidden flex-col gap-0.5 sm:flex">
          {(Object.keys(themes) as Theme[]).map((option) => {
            const on = option === theme;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => choose(option)}
                className={`${focusRing} flex cursor-pointer items-center gap-2.5 rounded-[4px] border-0 bg-transparent p-0 text-[1rem] transition-colors duration-300 ${on ? "text-[var(--fg)]" : "text-[var(--dim)] hover:text-[var(--fg)]"}`}
              >
                <span aria-hidden="true" className={`size-[0.45rem] border border-solid border-current transition-colors duration-300 ${on ? "bg-current" : "bg-transparent"}`} />
                {THEME[option]}
              </button>
            );
          })}
        </div>

        {/* What is on screen, in the bottom right. */}
        <p aria-hidden="true" className="pointer-events-none fixed bottom-[clamp(1rem,2.5vh,1.75rem)] right-[clamp(1rem,1.75vw,2rem)] z-40 m-0 hidden h-[1.3em] overflow-hidden text-[0.9375rem] sm:block">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span key={caption} initial={{ y: "110%" }} animate={{ y: "0%" }} exit={{ y: "-110%" }} transition={{ duration: 0.5, ease }} className="block">
              {CAPTIONS[caption]}
            </motion.span>
          </AnimatePresence>
        </p>
      </div>
    </MotionConfig>
  );
}
