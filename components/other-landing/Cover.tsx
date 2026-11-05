"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import useFinePointer from "@/components/template-landing/useFinePointer";
import Picture from "@/components/other-landing/Picture";
import { cover } from "@/components/other-landing/ui";

// How far the windows drift inside the cover, up and down, as it crosses the
// screen (a share of the cover's height), after the Opus reference's
// project images.
const DRIFT = "8%";

// One browser window showing the template's screen; `crop` picks the part
// of the screenshot it shows.
function Window({ src, alt, place, crop }: { src: string; alt: string; place: string; crop: string }) {
  return (
    <span className={`${cover.window} ${place}`}>
      <span aria-hidden="true" className={cover.bar}>
        <span className={cover.dot} />
        <span className={cover.dot} />
        <span className={cover.dot} />
      </span>
      <span className={cover.screen}>
        <Picture src={src} alt={alt} sizes="(min-width: 768px) 32vw, 64vw" className={`object-cover ${crop}`} />
      </span>
    </span>
  );
}

// A template's cover: two windows of its site, tilted and centred on the
// muted ground and its bands, in a square or a wide card, or filling its
// parent (/template-landing's hero). The one behind shows the lower part
// of the screen. In a `group`, it tilts a little on hover. With `drift`, the
// windows move slowly against the bands as the cover crosses the screen, as
// if fixed behind it (the Opus reference's project images); not for anyone
// who prefers less motion.
export default function Cover({ src, name, shape, drift = false }: { src: string; name: string; shape: "square" | "wide" | "fill" | "tile" | "banner" | "landscape"; drift?: boolean }) {
  const box = useRef<HTMLSpanElement>(null);
  // No drift on touch screens: moving the windows with the scroll made phone scrolling stutter.
  const reduced = useReducedMotion();
  const mouse = useFinePointer();
  const still = reduced || !mouse;
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], drift && !still ? [`-${DRIFT}`, DRIFT] : ["0%", "0%"]);
  return (
    <span ref={box} className={`${cover.box} ${cover[shape]}`}>
      <span aria-hidden="true" className={cover.band} />
      <span aria-hidden="true" className={cover.strip} />
      <span className={cover.focus}>
        <motion.span style={{ y }} className="absolute inset-0 block will-change-transform">
          <span className={cover.stage}>
            <Window src={src} alt="" place={cover.back} crop="object-bottom" />
            <Window src={src} alt={`The ${name} template`} place={cover.front} crop="object-top" />
          </span>
        </motion.span>
      </span>
    </span>
  );
}
