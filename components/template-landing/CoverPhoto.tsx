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
// so no seam shows. With `whole` the picture is shown complete (filling the card,
// whose shape it nearly shares, so no edge of the ground shows)
// and no parallax (the user's own art-directed covers).
export default function CoverPhoto({ src, name, shape, ground, focus, fit = false, whole = false }: { src: string; name: string; shape: "square" | "wide" | "tile" | "banner"; ground: string; focus: string; fit?: boolean; whole?: boolean }) {
  const box = useRef<HTMLSpanElement>(null);
  // No parallax on touch screens: moving the picture with the scroll made phone scrolling stutter.
  const reduced = useReducedMotion();
  const mouse = useFinePointer();
  const still = reduced || !mouse || whole;
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["-7%", "7%"]);
  return (
    <span ref={box} style={{ backgroundColor: ground }} className={`${cover.box} ${cover[shape]}`}>
      <motion.span style={{ y }} className={`absolute ${whole ? "inset-0" : "-inset-y-[8%] inset-x-0"} block will-change-transform`}>
        <Image
          src={src}
          alt={`The ${name} template`}
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          style={{ objectPosition: shape === "square" && !fit ? focus : "50% 50%" }}
          className={whole ? "object-cover" : fit ? `object-contain ${shape === "banner" ? "[mask-image:linear-gradient(90deg,transparent_16%,black_27%,black_73%,transparent_84%)]" : "[mask-image:linear-gradient(transparent_19%,black_28%,black_72%,transparent_81%)]"}` : `object-cover ${shape === "wide" ? "scale-[1.06]" : ""}`}
        />
      </motion.span>
    </span>
  );
}
