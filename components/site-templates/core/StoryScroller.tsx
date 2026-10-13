"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { glideTo, scrollParent, viewOf } from "./scroll";

// A story in one screen: the media on the right never moves, and the text on
// the left changes panel by panel, only when asked (a "next" button through
// useStory, or the side rail). Each new panel slides up over the current
// one, which stays in place, sinking a little and fading back; going back
// slides the later panels away again. Below the desktop layout the panels
// simply follow one another, and "next" glides down to the next one.
//
// The side rail finds the panels by their `data-rail-item`; the active one
// carries `data-rail-active`. It switches panels by sending a STORY_GO event
// (detail: the panel id) to the story, and learns of changes from a
// STORY_CHANGE event.

export const STORY_GO = "story-go";
export const STORY_CHANGE = "story-change";

export interface StoryPanel {
  id: string;
  // Its name in the side rail and the menu.
  label: string;
  content: ReactNode;
}

const StoryContext = createContext<{ next: () => void; last: boolean }>({ next: () => {}, last: true });

// For a panel's content: go to the next panel, and whether this is the last.
export const useStory = () => useContext(StoryContext);

// The desktop layout starts at 36rem of page width (the kit's @xl).
const DESKTOP = 576;
const ease = [0.22, 1, 0.36, 1] as const;

export default function StoryScroller({ panels, media }: { panels: StoryPanel[]; media: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [inPlace, setInPlace] = useState(false);
  // Panels move into place without animation until the first change asked for.
  const [moving, setMoving] = useState(false);
  const reduceMotion = useReducedMotion();

  // Show a panel; below the desktop layout, also glide down to it.
  const show = (index: number) => {
    setMoving(true);
    setActive(index);
    if (!inPlace) {
      const panel = panelRefs.current[index];
      if (panel) glideTo(panel);
    }
  };

  // In place (one screen, panels layered) from the desktop layout up.
  useEffect(() => {
    const root = rootRef.current;
    const page = root?.closest("[data-site-template]") as HTMLElement | null;
    if (!root) return;
    const measure = () => setInPlace((page ?? root).clientWidth >= DESKTOP);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page ?? root);
    return () => observer.disconnect();
  }, []);

  // Scrolling brings back the first panel: scrolling up over the story (at
  // the top of the page) glides back to it, and once the next section has
  // covered the story it quietly returns to it, ready for when the visitor
  // scrolls back up.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !inPlace || active === 0) return;
    const parent = scrollParent(root);
    const scroller: HTMLElement | Window = parent ?? window;
    const atTop = () => (parent ? parent.scrollTop : window.scrollY) <= 2;
    const back = () => {
      setMoving(true);
      setActive(0);
    };
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY < 0 && atTop()) back();
    };
    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => (touchY = event.touches[0].clientY);
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches[0].clientY - touchY > 40 && atTop()) back();
    };
    // The section after the story's, once it has covered the story.
    const page = root.closest("[data-site-template]");
    const own = root.closest("[data-section]");
    const sections = Array.from(page?.querySelectorAll("[data-section]") ?? []);
    const next = own ? sections[sections.indexOf(own) + 1] : undefined;
    const onScroll = () => {
      if (next && next.getBoundingClientRect().top <= viewOf(parent).top + 1) {
        setMoving(false);
        setActive(0);
      }
    };
    root.addEventListener("wheel", onWheel, { passive: true });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [active, inPlace]);

  // The side rail asks for a panel.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const go = (event: Event) => {
      const index = panels.findIndex((panel) => panel.id === (event as CustomEvent<string>).detail);
      if (index >= 0) show(index);
    };
    root.addEventListener(STORY_GO, go);
    return () => root.removeEventListener(STORY_GO, go);
  });

  // Tell the side rail which panel is showing.
  useEffect(() => {
    rootRef.current?.dispatchEvent(new CustomEvent(STORY_CHANGE, { bubbles: true, detail: panels[active]?.id }));
  }, [active, panels]);

  return (
    <div ref={rootRef} data-story className="grid grid-cols-1 gap-10 @xl:h-[100svh] @xl:grid-cols-[1fr_1.8fr] @xl:gap-[5cqw] @xl:pt-[6.75rem]">
      <div className="relative flex flex-col gap-24 @xl:block @xl:h-full @xl:overflow-hidden">
        {panels.map((panel, index) => {
          // Panels before the active one are covered, after it are waiting below.
          const state = index < active ? "covered" : index === active ? "shown" : "below";
          const layered = inPlace && !reduceMotion;
          return (
            <StoryContext.Provider key={panel.id} value={{ next: () => show(index + 1), last: index === panels.length - 1 }}>
              <motion.div
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                data-rail-item={panel.id}
                data-rail-label={panel.label}
                data-rail-active={index === active ? "" : undefined}
                aria-hidden={inPlace && state !== "shown" ? true : undefined}
                inert={inPlace && state !== "shown" ? true : undefined}
                initial={false}
                animate={layered ? { y: state === "below" ? "100%" : "0%" } : undefined}
                transition={{ duration: moving ? 0.9 : 0, ease }}
                // Before the page is interactive, the waiting panels are already
                // out of view; reduced motion simply hides them.
                className={`bg-card @xl:absolute @xl:inset-0 ${state === "below" ? "@xl:translate-y-full" : ""} ${inPlace && reduceMotion && state !== "shown" ? "@xl:invisible" : ""}`}
              >
                <motion.div
                  initial={false}
                  animate={layered ? (state === "covered" ? { y: "6%", opacity: 0.4 } : { y: "0%", opacity: 1 }) : undefined}
                  transition={{ duration: moving ? 0.9 : 0, ease }}
                  className="flex h-full flex-col justify-center"
                >
                  {panel.content}
                </motion.div>
              </motion.div>
            </StoryContext.Provider>
          );
        })}
      </div>
      <div className="order-first flex @xl:order-none">{media}</div>
    </div>
  );
}
