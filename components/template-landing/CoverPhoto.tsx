"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cover } from "@/components/other-landing/ui";
import useFinePointer from "@/components/template-landing/useFinePointer";

// A template's finished cover picture (the user supplied them), filling its
// card edge to edge like the Opus reference's project images (cropped to the
// square or wide shape, a touch zoomed so the mock-up fills more of it). As
// the card crosses the screen the picture moves inside it, as Opus's do; off
// with reduced motion. A square card keeps the picture's `focus` (its name side).
// `ground` is the picture's own edge colour, shown while
// it loads. With `fit` the whole picture shows, the mock-up floating in the
// card as in the Endcap reference (the templates grid), on its `ground`, its
// edges that meet it (top and bottom, or the sides in a banner) fading into it
// so no seam shows. With `whole` the picture is not zoomed or moved: it fills
// the card, cropping only the plain background above and below its mock-ups
// and no parallax (the user's own art-directed covers).
// The Opus "Our recent projects" effect (the user asked for it, smooth on phones
// too): the picture is 5% larger than its card (halved from 10% so the covers' 160px
// padding always shows, the user asked) (the user's covers are the card's
// shape with 160px of padding, so only padding is hidden), and as the card crosses
// the screen, from entering at the bottom to leaving at the top, it slides down
// inside it by that extra 5%, moving slower than the page. Nothing else is drawn
// (an earlier blurred backdrop and stretched edges made phone scrolling choppy);
// one transformed layer, so it stays on the GPU.
// The browser drives that slide itself, with a CSS scroll timeline (.cover-drift in
// globals.css), so it keeps up with the phone's scrolling and no script runs for it.
const EXTRA = 5;

const never = () => () => {};
const useScrollTimelines = () =>
  useSyncExternalStore(
    never,
    () => CSS.supports("animation-timeline: view()"),
    () => true,
  );

// The picture's layer moved by script, where CSS cannot do it.
function ScriptedLayer({ box, range, style, className, children }: { box: RefObject<HTMLSpanElement | null>; range: [string, string]; style?: CSSProperties; className: string; children: ReactNode }) {
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], range);
  return (
    <motion.span style={{ ...style, y }} className={`${className} will-change-transform`}>
      {children}
    </motion.span>
  );
}

export default function CoverPhoto({ src, name, shape, ground, focus, fit = false, whole = false, contain = false, corner = false, extra = EXTRA }: { src: string; name: string; shape: "square" | "wide" | "tile" | "banner" | "landscape"; ground: string; focus: string; fit?: boolean; whole?: boolean; contain?: boolean; corner?: boolean; extra?: number }) {
  const box = useRef<HTMLSpanElement>(null);
  // No scripted parallax on touch screens: moving the picture with the scroll made phone scrolling stutter.
  const reduced = useReducedMotion();
  const mouse = useFinePointer();
  const timelines = useScrollTimelines();
  const scripted = !reduced && mouse && !contain && !(whole && timelines);
  // The whole covers take that effect on every screen the browser can drive it (only reduced motion stops it).
  const half = (extra / 2 / (100 + extra)) * 100;
  const place = whole ? { top: `-${extra / 2}%`, height: `${100 + extra}%` } : undefined;
  const layer = `absolute ${whole ? "inset-x-0" : contain ? "inset-0" : "-inset-y-[8%] inset-x-0"} block`;
  const picture = (
    <Image
      src={src}
      alt={`The ${name} template`}
      fill
      sizes="(min-width: 768px) 60vw, 100vw"
      style={{ objectPosition: whole || (shape === "square" && !fit) ? focus : "50% 50%" }}
      className={whole ? "relative object-cover" : contain ? `object-contain ${corner ? "!inset-y-[6%] !h-[88%] drop-shadow-[0_14px_24px_rgb(0_0_0/0.16)]" : ""}` : fit ? `object-contain ${shape === "banner" ? "[mask-image:linear-gradient(90deg,transparent_16%,black_27%,black_73%,transparent_84%)]" : "[mask-image:linear-gradient(transparent_19%,black_28%,black_72%,transparent_81%)]"}` : `object-cover ${shape === "wide" ? "scale-[1.06]" : ""}`}
    />
  );
  // With `contain`, the band left of the picture is its own left edge stretched
  // sideways (row for row) and the band to its right its right edge, so its
  // background carries on with no seam; with `corner` the picture is instead set,
  // framed, on the plain `ground` with a soft shadow (for one whose pages run off its edges)
  // (for a picture whose pages run off its edges).
  return (
    <span ref={box} style={{ backgroundColor: ground }} className={`${cover.box} ${cover[shape]} ${whole ? "cover-timeline" : ""}`}>
      {contain && !corner &&
        (["0 0", "100% 0"] as const).map((at, i) => (
          <span key={at} aria-hidden="true" style={{ backgroundImage: `url(${src})`, backgroundSize: corner ? "6000%" : "6000% 100%", backgroundPosition: at, backgroundRepeat: "no-repeat" }} className={`absolute inset-y-0 block w-1/2 ${i ? "right-0" : "left-0"}`} />
        ))}
      {scripted ? (
        <ScriptedLayer box={box} range={whole ? [`-${half}%`, `${half}%`] : ["-7%", "7%"]} style={place} className={layer}>
          {picture}
        </ScriptedLayer>
      ) : (
        <span style={whole ? ({ ...place, "--cover-drift": `${half}%` } as CSSProperties) : undefined} className={`${layer} ${whole ? "cover-drift" : ""}`}>
          {picture}
        </span>
      )}
    </span>
  );
}
