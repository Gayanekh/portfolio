import { animate } from "framer-motion";

// Where a template page scrolls: the editor's canvas, or the window (null).
export function scrollParent(element: HTMLElement) {
  for (let node = element.parentElement; node; node = node.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) return node;
  }
  return null;
}

// The visible area of that scroller, in screen coordinates.
export function viewOf(parent: HTMLElement | null) {
  return parent ? parent.getBoundingClientRect() : { top: 0, height: window.innerHeight };
}

// Glide the page until `element` is at the top of the view: a slow, eased
// scroll, the same in the editor's canvas and on the page.
export function glideTo(element: HTMLElement) {
  const parent = scrollParent(element);
  const from = parent ? parent.scrollTop : window.scrollY;
  const to = from + element.getBoundingClientRect().top - viewOf(parent).top;
  return animate(from, to, {
    duration: 1.2,
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (y) => (parent ?? window).scrollTo({ top: y, behavior: "instant" }),
  });
}
