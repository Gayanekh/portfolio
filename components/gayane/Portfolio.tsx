"use client";

import { useEffect, useRef } from "react";
import TemplateRenderer from "@/components/site-templates/core/TemplateRenderer";
import { scrollPageTo } from "@/lib/scroll";
import NocturneDev from "@/components/site-templates/sections/nocturne/NocturneDev";
import NocturneHero from "@/components/site-templates/sections/nocturne/NocturneHero";
import NocturneUiux from "@/components/site-templates/sections/nocturne/NocturneUiux";
import NocturneWork from "@/components/site-templates/sections/nocturne/NocturneWork";
import { CASES, PRINCIPLES, STEPS } from "@/components/site-templates/nocturne/shared";
import AboutContact from "@/components/gayane/AboutContact";
import Header from "@/components/gayane/Header";
import { gayaneTemplate } from "@/components/gayane/template";

// The sections whose lists are shorter than Nocturne's: two disciplines, three
// roles, seven projects (Portory and its six templates), two figures per case study. About carries the contact too (./AboutContact).
const Hero = () => <NocturneHero roles={[1, 2, 3]} targets={["uiux", "development"]} />;
const Work = () => <NocturneWork works={[1, 6, 7, 8, 9, 10, 11]} />;
// Sixteen tools in her stack (Nocturne's own has twelve).
const STACK = Array.from({ length: 16 }, (_, i) => i + 1);
const Dev = () => <NocturneDev principles={PRINCIPLES} stack={STACK} />;
const Uiux = () => <NocturneUiux steps={STEPS} cases={CASES} stats={[1, 2]} />;

// Built once, with the module (so an edit to her content shows at once while developing).
const TEMPLATE = gayaneTemplate({ header: Header, hero: Hero, work: Work, uiux: Uiux, development: Dev, about: AboutContact });

// Section titles spelled in letter by letter as they scroll into view, as on her
// earlier design (globals.css, .gk-letter): each title's words are split into
// letters once it has rendered (again whenever a section renders its titles anew,
// as the pinned Work section does once it knows its layout), and Nocturne's own
// word rise is turned off. React's own text nodes stay where they are, emptied, with
// the letters set beside them, so React can still update or remove them.
function useLetters(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const split = () => root.current?.querySelectorAll<HTMLElement>("h2, h3").forEach((title) => {
      // Not the project names in the Work gallery: it holds still while its cards move sideways, so a scroll-driven reveal would never finish there.
      if (title.dataset.gkLetters === "done" || (title.tagName === "H3" && title.closest('[data-section="work"]'))) return;
      title.dataset.gkLetters = "done";
      let i = 0;
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      for (const node of nodes) {
        if (!node.textContent?.trim()) continue;
        const letters = document.createDocumentFragment();
        for (const char of node.textContent) {
          const letter = document.createElement("span");
          letter.className = "gk-letter";
          letter.style.setProperty("--i", String(i++));
          letter.textContent = char;
          letters.append(letter);
        }
        node.before(letters);
        node.nodeValue = "";
      }
    });
    split();
    const observer = new MutationObserver(split);
    if (root.current) observer.observe(root.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [root]);
}

// Where the page opens. A refresh starts at the top (the user asked): the browser would put the page back where it was
// scrolled, which here lands among the pinned, sideways-moving sections before they have measured themselves. So
// restoring is switched off for this page only (and back on when leaving it). Going back or forward is left to the
// browser, which puts the page where it was. An address with a section in it (#work) goes to that section, once the
// page has laid itself out and again as it settles (the pinned Work section settles its height late), until the
// visitor scrolls, touches or presses a key.
const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function useStartAtTop() {
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "back_forward") return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const target = decodeURIComponent(window.location.hash.slice(1));
    if (!target) window.scrollTo(0, 0);
    const timers: number[] = [];
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"];
    let touched = false;
    const touch = () => {
      touched = true;
    };
    if (target) {
      // Real input from the visitor stops the realigning (a layout shift is not the visitor scrolling).
      inputs.forEach((name) => window.addEventListener(name, touch, { passive: true }));
      const jump = () => {
        const element = document.getElementById(target);
        if (element && !touched) element.scrollIntoView({ behavior: "instant", block: "start" });
      };
      for (const wait of [400, 1000, 2000, 3500]) timers.push(window.setTimeout(jump, wait));
    }
    return () => {
      timers.forEach(window.clearTimeout);
      inputs.forEach((name) => window.removeEventListener(name, touch));
      window.history.scrollRestoration = previous;
    };
  }, []);
}

// A menu link: the page's smooth scroller takes the page to the section, just under the header (at once with reduced
// motion), and the section goes in the address.
function follow(section: string) {
  const element = document.getElementById(section);
  if (!element) return;
  const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  scrollPageTo(window.scrollY + element.getBoundingClientRect().top - margin, { immediate: still() });
  window.history.replaceState(null, "", `#${section}`);
}

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  useLetters(root);
  useStartAtTop();
  return (
    <div ref={root} className="gk-titles">
      <TemplateRenderer template={TEMPLATE} onNavigate={follow} />
    </div>
  );
}
