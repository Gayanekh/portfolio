"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "../core/blocks";
import { useField, useSectionId, useTemplate } from "../core/context";
import { glideTo, scrollParent, viewOf } from "../core/scroll";
import { STORY_CHANGE, STORY_GO } from "../core/StoryScroller";

const ease = [0.22, 1, 0.36, 1] as const;
const number = (index: number) => String(index + 1).padStart(2, "0");

type Item = { id: string; label: string };

// A tall, narrow rail down the right edge of the screen, pinned while the
// page scrolls: the menu button at the top, and in the middle the number of
// the item in view over a short line, with a dash for each other item
// (follow one to go there; every item is as tall, its line at the foot, so
// the lines stay evenly spaced), and under them the name of the item in view.
// The menu opens as a tall panel sliding in from the right. On phones only
// the menu button shows.
// Its items: the sections with a `menu` name, with a story's panels
// (StoryScroller) in place of the section holding it.
// Its section's field: `siteTitle`.
export default function SideRail() {
  const id = useSectionId();
  const { template, navigate } = useTemplate();
  const title = useField("siteTitle").node;
  const railRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [items, setItems] = useState<Item[]>(() =>
    template.sections.filter((section) => section.menu).map((section) => ({ id: section.id, label: section.menu ?? section.id })),
  );
  // The item in view: the last one whose top has passed the middle of the screen.
  useEffect(() => {
    const rail = railRef.current;
    const root = rail?.closest("[data-site-template]");
    if (!rail || !root) return;
    const parent = scrollParent(rail);
    const scroller: HTMLElement | Window = parent ?? window;
    // A pinned story's panels in place of the section holding it, and the
    // other sections with a `menu` name, top to bottom.
    const targets = () =>
      template.sections.flatMap((section) => {
        const element = root.querySelector<HTMLElement>(`[data-section="${section.id}"]`);
        const panels = Array.from(element?.querySelectorAll<HTMLElement>("[data-rail-item]") ?? []);
        if (panels.length) return panels.map((panel) => ({ element: panel, id: panel.dataset.railItem!, label: panel.dataset.railLabel ?? "" }));
        return section.menu ? [{ element, id: section.id, label: section.menu }] : [];
      });
    const update = () => {
      const view = viewOf(parent);
      const list = targets();
      let current = 0;
      list.forEach((item, index) => {
        // A story's showing panel; a section once its top passes the middle
        // of the screen (later ones win, so scrolling past the story moves on).
        const panel = item.element?.hasAttribute("data-rail-item");
        if (panel ? item.element!.hasAttribute("data-rail-active") : item.element && item.element.getBoundingClientRect().top - view.top <= view.height / 2) {
          current = index;
        }
      });
      setActive(current);
      setItems((previous) => {
        const next = list.map(({ id: itemId, label }) => ({ id: itemId, label }));
        return JSON.stringify(previous) === JSON.stringify(next) ? previous : next;
      });
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    root.addEventListener(STORY_CHANGE, update);
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.removeEventListener(STORY_CHANGE, update);
      observer.disconnect();
    };
  }, [template]);

  // A story panel: back to the story (if the page has scrolled past it) and
  // show that panel. A section: through the template's menu.
  const goTo = (target: string) => {
    const root = railRef.current?.closest<HTMLElement>("[data-site-template]");
    const panel = root?.querySelector<HTMLElement>(`[data-rail-item="${target}"]`);
    if (!root || !panel) return navigate(target);
    // Scrolled on to a later section: back to the top, where the story is the
    // opening section (as in Persona).
    const onSection = !root.querySelector(`[data-rail-item="${items[active]?.id}"]`);
    if (onSection && active > items.findIndex((item) => item.id === target)) glideTo(root);
    panel.closest("[data-story]")?.dispatchEvent(new CustomEvent(STORY_GO, { detail: target }));
  };

  const go = (event: MouseEvent, target: string) => {
    event.preventDefault();
    goTo(target);
  };

  const menuButton = (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="site-menu"
      onClick={() => setOpen((o) => !o)}
      className="flex h-11 cursor-pointer items-center rounded-full border-0 bg-card/70 px-2.5 backdrop-blur-sm"
    >
      <span className="relative block h-2 w-8">
        <motion.span
          animate={open ? { top: 3, rotate: 45 } : { top: 0, rotate: 0 }}
          transition={{ duration: 0.35, ease }}
          className="absolute inset-x-0 h-[2px] bg-foreground"
        />
        {/* On whole pixels, both lines as thick, so they render alike */}
        <motion.span
          animate={open ? { top: 3, rotate: -45 } : { top: 6, rotate: 0 }}
          transition={{ duration: 0.35, ease }}
          className="absolute inset-x-0 h-[2px] bg-foreground"
        />
      </span>
    </button>
  );

  return (
    // Takes no room in the page; the rail hangs from the top of the screen.
    <header ref={railRef} data-section={id} className="sticky top-0 z-40 h-0">
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease }}
            className="absolute right-0 top-0 flex h-[100svh] w-[min(26rem,100cqw)] flex-col gap-10 bg-card px-8 pb-12 pt-28 shadow-[-24px_0_48px_-24px_rgb(0_0_0/0.25)] @xl:pr-28"
          >
            <div className="text-[13px] tracking-[0.03em] text-muted-foreground">{title}</div>
            <Menu size="large" items={items} active={items[active]?.id} onPick={goTo} onFollow={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phones: the menu button alone */}
      <div className="absolute right-3 top-3 @xl:hidden">{menuButton}</div>

      {/* From the desktop layout up: the rail. It is see-through, so an image
          reaching the screen's edge (as in Persona's hero) runs under it; its
          button and numbers sit on soft frosted pills to stay readable. */}
      <nav
        aria-label="Sections"
        className="absolute right-0 top-0 hidden h-[100svh] w-20 flex-col items-center border-l border-foreground/10 py-8 @xl:flex"
      >
        {menuButton}
        <ol className="m-0 mt-[22svh] flex list-none flex-col items-center gap-2 rounded-full bg-card/70 px-2 py-3 backdrop-blur-sm">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => go(event, item.id)}
                aria-label={item.label}
                aria-current={index === active ? "location" : undefined}
                className="flex h-9 flex-col items-center justify-end gap-2 text-foreground no-underline"
              >
                {index === active ? (
                  <>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease }}
                        className="font-display text-xs italic tracking-[0.05em]"
                      >
                        {number(index)}
                      </motion.span>
                    </AnimatePresence>
                    <motion.span layoutId={`${id}-active`} transition={{ duration: 0.45, ease }} className="block h-px w-6 bg-foreground" />
                  </>
                ) : (
                  <span className="block h-px w-2.5 bg-foreground/30 transition-colors duration-300 hover:bg-foreground" />
                )}
              </a>
            </li>
          ))}
        </ol>
        {/* The name of the section in view, set vertically under the numbers */}
        <div aria-hidden="true" className="mt-4 overflow-hidden rounded-full bg-card/70 px-1.5 py-3 backdrop-blur-sm">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={items[active]?.id}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="block text-[10px] font-medium uppercase leading-none tracking-[0.14em] [writing-mode:vertical-rl]"
            >
              {items[active]?.label}
            </motion.span>
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
