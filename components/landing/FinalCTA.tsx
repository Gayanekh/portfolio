"use client";

import Link from "next/link";
import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotionConfig, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { TEMPLATES, TEMPLATE_IMAGE } from "@/components/landing/sample-portfolios";
import { displayTitle, ease, focusRing, kickerOnDark, lead } from "@/components/landing/landing-ui";

const CONTENT = {
  kicker: "Get started",
  title: "Let's build yours.",
  text: "Your work deserves a place of its own. Pick a template and have a page ready to share.",
  start: { href: "/templates", label: "Get started" },
  browse: { href: "/templates/gallery", label: "Browse templates" },
  // The closing points, from the earlier "A Simple & Professional Portfolio" text.
  points: [
    { title: "A considered template", text: "Start from a layout made for your kind of work." },
    { title: "Every change, live", text: "See each edit in a live preview before anyone else does." },
    { title: "One simple link", text: "A page that works on every screen, ready to share." },
  ],
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
// the featured one, clear of the text on the left; template photos fill out the rest.
const TILES = [PHOTOS[0], PHOTOS[1], PHOTOS[2], FEATURED[1].image, PHOTOS[3], PHOTOS[4], null, PHOTOS[5], FEATURED[2].image, PHOTOS[6], PHOTOS[7], FEATURED[3].image];
const CYCLE_MS = 2600;

const pill = `${focusRing} group/button inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[0.95rem] font-medium no-underline transition-colors duration-200`;

// The closing band: a rounded dark panel, inset from the screen edges, with
// the template wall as its background. The heading, intro and two calls to
// action sit on the left, three short points along the bottom. The featured
// tile keeps changing and names its template, the wall leans towards the
// pointer, and anywhere outside the buttons links to the gallery. Keeps the
// #contact anchor.
export default function FinalCTA() {
  const reduced = useReducedMotionConfig();
  const [shown, setShown] = useState(0);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-3, 3]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [3, -3]), { stiffness: 150, damping: 20 });

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
  };
  const rest = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section id="contact" aria-label={CONTENT.kicker} className="scroll-mt-24 px-2 pb-2 md:px-3 md:pb-3">
      <div
        onPointerMove={lean}
        onPointerLeave={rest}
        className="relative isolate overflow-hidden rounded-[2rem] bg-foreground text-white [perspective:1600px] md:rounded-[2.5rem]"
      >
        {/* The wall, leaning with the pointer. It runs past the panel's edges, so the outer tiles are cut off. */}
        <motion.div aria-hidden="true" style={{ rotateX, rotateY }} className="absolute -inset-x-[6%] -inset-y-[8%] -z-10 grid grid-cols-4 grid-rows-3 gap-3 md:gap-4">
          {TILES.map((src, i) =>
            src ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote mock photo
              <img key={i} src={src} alt="" loading="lazy" decoding="async" className="h-full w-full rounded-xl object-cover opacity-50" />
            ) : (
              <div key={i} className="relative overflow-hidden rounded-xl ring-1 ring-white/20">
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
                {/* The template's name, on a pill like the hero's cards (hidden on phones, where the tile runs under the points). */}
                <div className="absolute inset-x-0 bottom-0 hidden justify-center p-4 md:flex">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={shown}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, ease }}
                      className="whitespace-nowrap rounded-full bg-[rgb(11_5_29/0.3)] px-3 py-2 text-xs font-bold leading-none text-[#f9f8f5] backdrop-blur-md"
                    >
                      {FEATURED[shown].name}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            ),
          )}
        </motion.div>
        {/* Fade the wall into the dark: behind the heading (from the top on phones, the left on wider screens) and under the points. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_68%_45%,transparent_20%,rgb(0_0_0/0.5)_85%)]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground from-15% via-foreground/60 via-35% to-transparent to-55% md:bg-gradient-to-r md:from-foreground md:from-15% md:via-foreground/70 md:via-40% md:to-transparent md:to-70%" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-foreground from-25% to-transparent" />

        <Reveal className="mx-auto flex min-h-[46rem] w-content-width flex-col justify-between gap-56 py-14 md:min-h-[44rem] md:gap-16 md:py-20 lg:min-h-[48rem]">
          <div className="flex max-w-[36rem] flex-col items-start gap-5">
            <p className={kickerOnDark}>{CONTENT.kicker}</p>
            <h2 className={`${displayTitle} text-white`}>{CONTENT.title}</h2>
            <p className={`${lead} max-w-[30rem] text-white/75`}>{CONTENT.text}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href={CONTENT.start.href} className={`${pill} relative z-10 bg-white text-black hover:bg-white/85`}>
                {CONTENT.start.label}
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </Link>
              {/* Its ::after covers the panel, so anywhere outside the buttons links to the gallery. */}
              <Link
                href={CONTENT.browse.href}
                className={`${pill} border border-white/20 bg-white/10 text-white backdrop-blur-xl after:absolute after:inset-0 after:content-[''] hover:bg-white/20`}
              >
                {CONTENT.browse.label}
              </Link>
            </div>
          </div>

          <ul className="m-0 grid list-none grid-cols-1 gap-6 border-t border-white/15 p-0 pt-6 md:grid-cols-3 md:gap-10 md:pt-8">
            {CONTENT.points.map((point, i) => (
              <li key={point.title} className="flex gap-4">
                <span aria-hidden="true" className="pt-0.5 font-mono text-xs text-white/40">0{i + 1}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-base font-semibold tracking-[-0.01em] text-white">{point.title}</span>
                  <span className="text-sm leading-relaxed text-white/60">{point.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
