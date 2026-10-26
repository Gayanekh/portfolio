"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotionConfig, useSpring, useTransform, type MotionValue } from "framer-motion";
import { themeFontVariables } from "@/components/template-detail/theme-options";
import { TEMPLATES, TEMPLATE_IMAGE } from "@/components/landing/sample-portfolios";
import { ease, easedStops, focusRing, fluidText } from "@/components/landing/landing-ui";

const BROWSE = {
  href: "/templates",
  label: "Browse templates",
  lead: "Create with",
  name: "Portory",
};

// Mock template thumbnails (free Unsplash photos) until the real templates exist.
const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=700`;
const PHOTOS = [
  "photo-1467232004584-a241de8bcf5d",
  "photo-1642132652860-471b4228023e",
  "photo-1634084462412-b54873c0a56d",
  "photo-1648134859177-66e35b61e106",
  "photo-1530435460869-d13625c69bbf",
  "photo-1646193186138-148d07f84b13",
  "photo-1649442746245-f51f4b76963f",
  "photo-1627896181038-a0cf83c86008",
].map(photo);
// The templates the featured tile cycles through, with their names for its label.
const FEATURED = TEMPLATES.map((template) => ({ name: template.name, image: TEMPLATE_IMAGE[template.id] }));
// The wall: four columns by three rows. The tile right of centre (null) is
// the featured one; template photos fill out the rest. A tile with a name
// shows it when it lights up.
const TILES: ({ src: string; name?: string } | null)[] = [
  { src: PHOTOS[0] }, { src: PHOTOS[1] }, { src: PHOTOS[2] }, { src: FEATURED[1].image, name: FEATURED[1].name },
  { src: PHOTOS[3] }, { src: PHOTOS[4] }, null, { src: PHOTOS[5] },
  { src: FEATURED[2].image, name: FEATURED[2].name }, { src: PHOTOS[6] }, { src: PHOTOS[7] }, { src: FEATURED[3].image, name: FEATURED[3].name },
];
// How far each tile floats in front of the wall (0 to 1): uneven, so the
// tiles drift apart as the pointer moves and the wall reads as layered.
const DEPTH = [0.35, 0.8, 0.5, 1, 0.9, 0.4, 0.7, 0.55, 0.6, 1, 0.3, 0.75];
const CYCLE_MS = 2600;
const spring = { stiffness: 140, damping: 22, mass: 0.8 };
// Each line of the heading rising into place, the second after the first.
const line = { hidden: { opacity: 0, y: "0.35em" }, shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } };
// The wall's mask: the tiles ease in over the top 45% (out of the section
// above) and out over the bottom 45% (into the footer), so it has no edges.
const half = (from: number, to: number) => easedStops((amount, at) => `rgb(0 0 0 / ${amount}) ${from + ((to - from) * at) / 100}%`);
const fadeIn = half(0, 45);
const fadeOut = half(100, 55).split(", ").reverse().join(", ");
const WALL_MASK = `linear-gradient(to bottom, ${fadeIn}, ${fadeOut})`;

// One tile of the wall. It drifts against the pointer by its depth, and the
// lit one lifts towards the viewer.
function WallTile({
  index,
  tile,
  on,
  shown,
  px,
  py,
  setRef,
}: {
  index: number;
  tile: { src: string; name?: string } | null;
  on: boolean;
  shown: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
  setRef: (element: HTMLDivElement | null) => void;
}) {
  const depth = DEPTH[index];
  const x = useSpring(useTransform(px, (v) => v * -46 * depth), spring);
  const y = useSpring(useTransform(py, (v) => v * -34 * depth), spring);
  const name = tile ? (tile.name ?? BROWSE.label) : FEATURED[shown].name;
  return (
    <motion.div
      ref={setRef}
      style={{ x, y }}
      initial={false}
      animate={{ opacity: on ? 1 : 0.35, scale: on ? 1.05 : 1, z: on ? 70 : depth * 24 }}
      transition={{ duration: 0.55, ease }}
      className={`relative overflow-hidden rounded-xl transition-shadow duration-500 ${on ? "z-10 shadow-[0_0_0_1px_rgb(255_255_255/0.35),0_30px_70px_-20px_rgb(0_0_0/0.8)]" : "shadow-[0_0_0_1px_rgb(255_255_255/0.06)]"}`}
    >
      {tile ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote mock photo
        <img src={tile.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <AnimatePresence initial={false}>
          <motion.img
            key={shown}
            src={FEATURED[shown].image}
            alt=""
            decoding="async"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      )}
      {/* The lit tile's name, on a pill like the hero's cards. */}
      <div className="absolute inset-x-0 bottom-0 hidden justify-center p-4 md:flex">
        <AnimatePresence mode="wait" initial={false}>
          {on && (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease }}
              className="whitespace-nowrap rounded-full bg-[rgb(11_5_29/0.35)] px-3 py-2 text-xs font-bold leading-none text-[#f9f8f5] backdrop-blur-md"
            >
              {name}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// The closing band: a wall of templates across the full width, about a screen
// tall, running on into the dark footer below, with one large line over its middle;
// the whole band links to the gallery. The featured tile keeps changing.
//
// With a mouse the band responds in 3D: the wall leans towards the pointer
// and comes forward a little, each tile drifts by its own depth (so the wall
// separates into layers), the tile under the pointer lifts out and is named,
// and a soft light follows the pointer. The heading floats in front, drifting
// the other way. Its words rise into place as the band scrolls into view.
// Reduced motion keeps it all still. Keeps the #contact anchor.
export default function FinalCTA() {
  const reduced = useReducedMotionConfig();
  const [shown, setShown] = useState(0);
  // The tile under the pointer, the only one lit (none without a pointer).
  const [hovered, setHovered] = useState<number | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  // The pointer across the band (-0.5 to 0.5), and whether it is over it (0 or 1).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const over = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), spring);
  const wallScale = useSpring(useTransform(over, [0, 1], [1, 1.04]), spring);
  // The heading drifts against the wall and turns a touch with the pointer.
  const textX = useSpring(useTransform(px, (v) => v * 22), spring);
  const textY = useSpring(useTransform(py, (v) => v * 16), spring);
  const textRotateY = useSpring(useTransform(px, [-0.5, 0.5], [5, -5]), spring);
  const textRotateX = useSpring(useTransform(py, [-0.5, 0.5], [-4, 4]), spring);
  // The light that follows the pointer.
  const lightX = useTransform(px, (v) => `${(v + 0.5) * 100}%`);
  const lightY = useTransform(py, (v) => `${(v + 0.5) * 100}%`);
  const lightOpacity = useSpring(over, spring);
  const light = useMotionTemplate`radial-gradient(32rem circle at ${lightX} ${lightY}, rgb(255 255 255 / 0.14), transparent 70%)`;

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setShown((i) => (i + 1) % FEATURED.length), CYCLE_MS);
    return () => clearInterval(timer);
  }, [reduced]);

  const lean = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
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

  // Pulled up into the address section's foot, so the wall's fade starts before any edge.
  return (
    <section id="contact" aria-label={`${BROWSE.lead} ${BROWSE.name}`} className="relative mt-[clamp(-6rem,calc(-1.456rem_-_9.467vw),-4rem)] scroll-mt-24">
      <div
        onPointerMove={lean}
        onPointerLeave={rest}
        className="relative isolate h-[min(110svh,68rem)] min-h-[40rem] overflow-hidden bg-foreground"
      >
        {/* The wall, leaning with the pointer. It runs past the band's edges, so the outer tiles are cut off.
            A mask fades the tiles themselves in from the section above and out into the footer; the
            perspective sits inside the mask, so the wall keeps its depth. */}
        <div aria-hidden="true" style={{ maskImage: WALL_MASK, WebkitMaskImage: WALL_MASK }} className="absolute inset-0 -z-10 [perspective:1400px]">
          <motion.div
            style={{ rotateX, rotateY, scale: wallScale }}
            className="absolute -inset-x-[6%] -inset-y-[8%] grid grid-cols-4 grid-rows-3 gap-[clamp(0.75rem,calc(0.432rem_+_1.183vw),1rem)] [transform-style:preserve-3d]"
          >
            {TILES.map((tile, i) => (
              <WallTile
                key={i}
                index={i}
                tile={tile}
                on={i === hovered}
                shown={shown}
                px={px}
                py={py}
                setRef={(element) => {
                  tileRefs.current[i] = element;
                }}
              />
            ))}
          </motion.div>
          {/* The light following the pointer. */}
          <motion.div style={{ backgroundImage: light, opacity: lightOpacity }} className="pointer-events-none absolute inset-0" />
          {/* Darken the wall's sides, and its middle behind the heading; inside the mask, so it fades out at the top and foot too and leaves no seam. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_40%,rgb(0_0_0/0.4)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_36%_at_50%_50%,rgb(0_0_0/0.62),transparent_100%)]" />
        </div>

        {/* The whole band opens the gallery. */}
        <Link href={BROWSE.href} aria-label={BROWSE.label} className={`${focusRing} absolute inset-0 focus-visible:-outline-offset-4 focus-visible:outline-white`} />

        {/* The heading, floating in front of the wall: its lead-in set in a light
            serif over the name in the site's sans, each line rising in turn.
            Clicks pass through to the band's link. */}
        <div className={`pointer-events-none absolute inset-0 grid place-items-center px-6 [perspective:1200px] ${themeFontVariables}`}>
          <motion.div style={{ x: textX, y: textY, rotateX: textRotateX, rotateY: textRotateY }} className="text-center">
            <motion.h2
              aria-label={`${BROWSE.lead} ${BROWSE.name}`}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ staggerChildren: 0.14 }}
              className={`m-0 flex flex-col items-center ${fluidText.ctaTitle} leading-[1.05] text-white [text-shadow:0_2px_40px_rgb(0_0_0/0.5)]`}
            >
              <motion.span aria-hidden="true" variants={line} className="block font-[family-name:var(--tf-fraunces)] font-light tracking-[-0.01em]">
                {BROWSE.lead}
              </motion.span>
              <motion.span aria-hidden="true" variants={line} className="block font-medium tracking-[-0.035em]">
                {BROWSE.name}
              </motion.span>
            </motion.h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
