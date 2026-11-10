"use client";

import { useEffect, useRef } from "react";
import TemplateRenderer from "@/components/site-templates/core/TemplateRenderer";
import NocturneHero from "@/components/site-templates/sections/nocturne/NocturneHero";
import NocturneUiux from "@/components/site-templates/sections/nocturne/NocturneUiux";
import NocturneWork from "@/components/site-templates/sections/nocturne/NocturneWork";
import { CASES, STEPS } from "@/components/site-templates/nocturne/shared";
import AboutContact from "@/components/gayane/AboutContact";
import Header from "@/components/gayane/Header";
import { gayaneTemplate } from "@/components/gayane/template";

// The sections whose lists are shorter than Nocturne's: two disciplines, three
// roles, seven projects (Portory and its six templates), two figures per case study. About carries the contact too (./AboutContact).
const Hero = () => <NocturneHero roles={[1, 2, 3]} targets={["uiux", "development", "graphic"]} />;
const Work = () => <NocturneWork works={[1, 6, 7, 8, 9, 10, 11]} />;
const Uiux = () => <NocturneUiux steps={STEPS} cases={CASES} stats={[1, 2]} />;

// Built once, with the module (so an edit to her content shows at once while developing).
const TEMPLATE = gayaneTemplate({ header: Header, hero: Hero, work: Work, uiux: Uiux, about: AboutContact });

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

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  useLetters(root);
  return (
    <div ref={root} className="gk-titles">
      <TemplateRenderer template={TEMPLATE} />
    </div>
  );
}
