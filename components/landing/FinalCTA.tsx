"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotionConfig, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { LandingSection, SectionHeader } from "@/components/landing/Section";
import { Art, TEMPLATE_IMAGE } from "@/components/landing/sample-portfolios";
import { ease, focusRing, text } from "@/components/landing/landing-ui";

// Mock template thumbnails (free Unsplash photos) until the real templates exist.
const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=700`;
const TILES = [
  "photo-1467232004584-a241de8bcf5d",
  "photo-1642132652860-471b4228023e",
  "photo-1634084462412-b54873c0a56d",
  "photo-1648134859177-66e35b61e106",
  null, // the centre tile, which cycles through the templates
  "photo-1530435460869-d13625c69bbf",
  "photo-1646193186138-148d07f84b13",
  "photo-1649442746245-f51f4b76963f",
  "photo-1627896181038-a0cf83c86008",
].map((id) => id && photo(id));
const CENTRE = Object.values(TEMPLATE_IMAGE);
const CYCLE_MS = 2600;

// The template wall from the reference: a dark card filled with a grid of
// template thumbnails that fades into the dark at its edges. The centre one
// keeps changing, the card leans towards the pointer, and the call to action
// sits at the bottom.
function TemplateWall() {
  const reduced = useReducedMotionConfig();
  const [shown, setShown] = useState(0);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setShown((i) => (i + 1) % CENTRE.length), CYCLE_MS);
    return () => clearInterval(timer);
  }, [reduced]);

  const lean = (event: PointerEvent<HTMLAnchorElement>) => {
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
    <div className="[perspective:1200px]">
      <motion.a
        href="#templates"
        onPointerMove={lean}
        onPointerLeave={rest}
        style={{ rotateX, rotateY }}
        className={`${focusRing} group relative block h-[25rem] overflow-hidden rounded-3xl bg-foreground no-underline md:h-auto md:aspect-[8/7]`}
      >
        {/* The grid runs past the card's sides and bottom, so the outer tiles are cut off. */}
        <div aria-hidden="true" className="absolute -inset-x-[14%] -top-[6%] grid h-full grid-cols-3 grid-rows-3 gap-3 md:gap-4">
          {TILES.map((src, i) =>
            src ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote mock photo
              <img key={i} src={src} alt="" loading="lazy" decoding="async" className="h-full w-full rounded-md object-cover opacity-60" />
            ) : (
              <div key={i} className="relative overflow-hidden rounded-md">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={shown}
                    src={CENTRE[shown]}
                    alt=""
                    decoding="async"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
              </div>
            ),
          )}
        </div>
        {/* Fade the edges and the bottom into the dark. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_30%,rgb(0_0_0/0.55)_80%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground from-45% to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 whitespace-nowrap p-5 text-center text-lg font-semibold tracking-[-0.01em] text-white md:text-base lg:text-xl xl:p-7 xl:text-2xl">
          Browse website templates
          <ArrowRight aria-hidden="true" strokeWidth={2} className="size-5 transition-transform duration-300 group-hover:translate-x-1 xl:size-6" />
        </span>
      </motion.a>
    </div>
  );
}

// Contact section, laid out like the reference: one light card with a tag,
// a large heading, a short paragraph and a small sign-off at the bottom on
// the left, and the template wall on the right. Keeps the #contact anchor.
export default function FinalCTA() {
  return (
    <LandingSection id="contact" label="Get started">
      <SectionHeader
        label="Get started"
        title="Let's Build Yours"
        intro="Your work deserves a place of its own. Pick a template and have a page ready to share."
      />
      <Reveal>
        <div className="grid grid-cols-1 gap-8 rounded-[2rem] bg-white/55 p-5 shadow-[0_1px_2px_rgb(0_0_0/0.03)] ring-1 ring-foreground/5 md:grid-cols-2 md:gap-10 md:p-8 xl:p-10">
          <div className="flex flex-col justify-between gap-10">
            <div className="flex flex-col items-start gap-4 xl:gap-5">
              <span className="rounded-full bg-white px-3 py-1.5 text-sm text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.05)] ring-1 ring-foreground/5">Professional templates</span>
              <h3 className="m-0 text-balance text-[length:clamp(2rem,8vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.025em] md:text-[length:clamp(2rem,3.6vw,3.5rem)]">
                A Simple &amp; Professional Portfolio
              </h3>
              <p className={`${text.lgXl} m-0 max-w-[32rem] leading-snug text-foreground/75`}>
                Start from a considered template, see every change in a live preview, and publish a page that works on every screen. One simple link is all you need to share it with your next opportunity.
              </p>
            </div>
          </div>
          <TemplateWall />
        </div>
      </Reveal>
    </LandingSection>
  );
}
