"use client";

import Image from "next/image";
import { useRef } from "react";
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
// The Opus "Our recent projects" effect (the user asked for it, on phones too),
// keeping the user's covers whole with their 160px padding: as the card crosses
// the screen, from entering at the bottom to leaving at the top, the picture
// slides down inside it (moving slower than the page), from 7% of the card's
// height above its place to 7% below — inside the padding, so the screens are
// never cut. Behind it, a blurred copy of the picture fills the card and, where the
// card is wider (phones), the picture's own side edges are stretched out, so the
// edges always show the picture's own background. Transform only, on its own layer.
const SHIFT = 7;

export default function CoverPhoto({ src, name, shape, ground, focus, fit = false, whole = false, contain = false, corner = false }: { src: string; name: string; shape: "square" | "wide" | "tile" | "banner" | "landscape"; ground: string; focus: string; fit?: boolean; whole?: boolean; contain?: boolean; corner?: boolean }) {
  const box = useRef<HTMLSpanElement>(null);
  // No parallax on touch screens: moving the picture with the scroll made phone scrolling stutter.
  const reduced = useReducedMotion();
  const mouse = useFinePointer();
  const still = reduced || !mouse || whole || contain;
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["-7%", "7%"]);
  // The whole covers take that effect on every screen (only reduced motion stops it).
  const opusY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : [`-${SHIFT}%`, `${SHIFT}%`]);
  // With `contain`, the band left of the picture is its own left edge stretched
  // sideways (row for row) and the band to its right its right edge, so its
  // background carries on with no seam; with `corner` the picture is instead set,
  // framed, on the plain `ground` with a soft shadow (for one whose pages run off its edges)
  // (for a picture whose pages run off its edges).
  return (
    <span ref={box} style={{ backgroundColor: ground }} className={`${cover.box} ${cover[shape]}`}>
      {whole && <Image src={src} alt="" aria-hidden="true" fill sizes="(min-width: 768px) 60vw, 100vw" className="scale-110 object-cover blur-2xl" />}
      {(whole || (contain && !corner)) &&
        (["0 0", "100% 0"] as const).map((at, i) => (
          <span key={at} aria-hidden="true" style={{ backgroundImage: `url(${src})`, backgroundSize: corner ? "6000%" : "6000% 100%", backgroundPosition: at, backgroundRepeat: "no-repeat" }} className={`absolute inset-y-0 block w-1/2 ${i ? "right-0" : "left-0"}`} />
        ))}
      <motion.span style={whole ? { y: opusY } : { y }} className={`absolute ${whole || contain ? "inset-0" : "-inset-y-[8%] inset-x-0"} block will-change-transform`}>
        <Image
          src={src}
          alt={`The ${name} template`}
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          style={{ objectPosition: whole || (shape === "square" && !fit) ? focus : "50% 50%" }}
          className={contain ? `object-contain ${corner ? "!inset-y-[6%] !h-[88%] drop-shadow-[0_14px_24px_rgb(0_0_0/0.16)]" : ""}` : whole ? "object-contain" : fit ? `object-contain ${shape === "banner" ? "[mask-image:linear-gradient(90deg,transparent_16%,black_27%,black_73%,transparent_84%)]" : "[mask-image:linear-gradient(transparent_19%,black_28%,black_72%,transparent_81%)]"}` : `object-cover ${shape === "wide" ? "scale-[1.06]" : ""}`}
        />
      </motion.span>
    </span>
  );
}
