// The page's smooth scrolling (LenisProvider) registers itself here, so code
// that moves the page goes through it. A plain window.scrollTo with smooth
// behaviour runs alongside Lenis's own scroll and stops part-way.
type Scroller = { scrollTo: (top: number, options: { immediate?: boolean; force?: boolean }) => void };
let lenis: Scroller | null = null;

export function setPageScroller(instance: Scroller | null) {
  lenis = instance;
}

// Scrolls the page to `top` (px): smoothly, or at once with `immediate`
// (reduced motion).
export function scrollPageTo(top: number, { immediate = false }: { immediate?: boolean } = {}) {
  if (lenis) lenis.scrollTo(top, { immediate, force: true });
  else window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}
