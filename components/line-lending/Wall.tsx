"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ease, focusRing, font } from "@/components/landing-next/ui";
import { ROOMS, WALL } from "@/components/line-lending/content";

// The wall: four columns by three rows of the real templates, their
// screenshots and their square shots; the tile right of the middle (null)
// cycles through every template.
const TILES: ({ src: string; name: string } | null)[] = [
  ...ROOMS.slice(0, 4).map((room) => ({ src: room.image, name: room.name })),
  { src: ROOMS[4].square, name: ROOMS[4].name },
  { src: ROOMS[5].image, name: ROOMS[5].name },
  null,
  { src: ROOMS[0].square, name: ROOMS[0].name },
  ...ROOMS.slice(1, 5).map((room) => ({ src: room.square, name: room.name })),
];
// How far each tile floats in front of the wall (0 to 1).
const DEPTH = [0.35, 0.8, 0.5, 1, 0.9, 0.4, 0.7, 0.55, 0.6, 1, 0.3, 0.75];
const CYCLE_MS = 2600;
const SPRING = { stiffness: 140, damping: 22, mass: 0.8 };
// The wall fades in from the section above and out at its foot.
const MASK = "[mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]";

function Tile({ index, tile, on, shown, px, py, setRef }: { index: number; tile: (typeof TILES)[number]; on: boolean; shown: number; px: MotionValue<number>; py: MotionValue<number>; setRef: (element: HTMLDivElement | null) => void }) {
  const depth = DEPTH[index];
  const x = useSpring(useTransform(px, (v) => v * -46 * depth), SPRING);
  const y = useSpring(useTransform(py, (v) => v * -34 * depth), SPRING);
  const room = ROOMS[shown];
  const name = tile ? tile.name : room.name;
  return (
    <motion.div
      ref={setRef}
      style={{ x, y }}
      initial={false}
      animate={{ opacity: on ? 1 : 0.4, scale: on ? 1.05 : 1, z: on ? 70 : depth * 24 }}
      transition={{ duration: 0.55, ease }}
      className={`relative overflow-hidden rounded-xl bg-[var(--ink-2)] transition-shadow duration-500 ${on ? "z-10 shadow-[0_0_0_1px_rgb(157_140_255/0.6),0_30px_70px_-20px_rgb(0_0_0/0.8)]" : "shadow-[0_0_0_1px_rgb(255_255_255/0.06)]"}`}
    >
      {tile ? (
        <Image src={tile.src} alt="" fill sizes="25vw" className="object-cover object-top" />
      ) : (
        <AnimatePresence initial={false}>
          <motion.span key={room.id} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }} className="absolute inset-0">
            <Image src={room.image} alt="" fill sizes="25vw" className="object-cover object-top" />
          </motion.span>
        </AnimatePresence>
      )}
      <div className="absolute inset-x-0 bottom-0 hidden justify-center p-4 md:flex">
        <AnimatePresence mode="wait" initial={false}>
          {on && (
            <motion.span key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }} className="whitespace-nowrap rounded-full bg-[rgb(11_10_15/0.6)] px-3 py-2 text-xs font-semibold text-[var(--bone)] backdrop-blur-md">
              {name}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// "Create with Portory", the home page's closing band, in the night: a wall
// of the real templates across the width that leans towards the pointer,
// each tile drifting by its own depth, the tile under the pointer lifting
// out with its name, a soft iris light following, and one tile cycling
// through every template. The heading floats in front, its lead-in in the
// serif and the name in the grotesque, rising line by line. The whole band
// opens the templates. Reduced motion keeps it still.
export default function Wall() {
  const still = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const over = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), SPRING);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), SPRING);
  const wallScale = useSpring(useTransform(over, [0, 1], [1, 1.04]), SPRING);
  const textX = useSpring(useTransform(px, (v) => v * 22), SPRING);
  const textY = useSpring(useTransform(py, (v) => v * 16), SPRING);
  const lightX = useTransform(px, (v) => `${(v + 0.5) * 100}%`);
  const lightY = useTransform(py, (v) => `${(v + 0.5) * 100}%`);
  const lightOpacity = useSpring(over, SPRING);
  const light = useMotionTemplate`radial-gradient(32rem circle at ${lightX} ${lightY}, rgb(157 140 255 / 0.18), transparent 70%)`;

  useEffect(() => {
    if (still) return;
    const timer = setInterval(() => setShown((i) => (i + 1) % ROOMS.length), CYCLE_MS);
    return () => clearInterval(timer);
  }, [still]);

  const lean = (event: PointerEvent<HTMLDivElement>) => {
    if (still || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - box.left) / box.width - 0.5);
    py.set((event.clientY - box.top) / box.height - 0.5);
    over.set(1);
    // The wall sits under the link that covers the band, so find the tile by position.
    const at = tileRefs.current.findIndex((tile) => {
      const rect = tile?.getBoundingClientRect();
      return !!rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    });
    setHovered(at < 0 ? null : at);
  };
  const rest = () => {
    px.set(0);
    py.set(0);
    over.set(0);
    setHovered(null);
  };

  return (
    <section aria-label={`${WALL.lead} ${WALL.name}`} className="relative z-10 bg-[var(--ink)]">
      <div onPointerMove={lean} onPointerLeave={rest} className="relative isolate h-[min(100svh,62rem)] min-h-[36rem] overflow-hidden">
        <div aria-hidden="true" className={`absolute inset-0 -z-10 [perspective:1400px] ${MASK}`}>
          <motion.div style={still ? undefined : { rotateX, rotateY, scale: wallScale }} className="absolute -inset-x-[6%] -inset-y-[8%] grid grid-cols-4 grid-rows-3 gap-[clamp(0.75rem,1.2vw,1rem)] [transform-style:preserve-3d]">
            {TILES.map((tile, i) => (
              <Tile key={i} index={i} tile={tile} on={i === hovered} shown={shown} px={px} py={py} setRef={(element) => { tileRefs.current[i] = element; }} />
            ))}
          </motion.div>
          <motion.div style={{ backgroundImage: light, opacity: lightOpacity }} className="pointer-events-none absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_40%,rgb(11_10_15/0.55)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_36%_at_50%_50%,rgb(11_10_15/0.75),transparent_100%)]" />
        </div>

        {/* The whole band opens the templates. */}
        <Link href={WALL.href} aria-label={WALL.label} className={`${focusRing} absolute inset-0 rounded-[4px]`} />

        <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
          <motion.div style={still ? undefined : { x: textX, y: textY }} className="text-center">
            <motion.h2
              aria-label={`${WALL.lead} ${WALL.name}`}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ staggerChildren: 0.14 }}
              className="m-0 flex flex-col items-center leading-[0.95] text-[var(--bone)] [text-shadow:0_2px_40px_rgb(0_0_0/0.6)]"
            >
              <motion.span aria-hidden="true" variants={{ hidden: { opacity: 0, y: "0.35em" }, shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }} className={`block ${font.serif} text-[length:clamp(2rem,calc(1.2rem_+_3vw),5rem)]`}>
                {WALL.lead}
              </motion.span>
              <motion.span aria-hidden="true" variants={{ hidden: { opacity: 0, y: "0.35em" }, shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }} className={`block ${font.display} text-[length:clamp(3rem,calc(1.6rem_+_6vw),10rem)] font-semibold tracking-[-0.05em]`}>
                {WALL.name}
              </motion.span>
            </motion.h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
