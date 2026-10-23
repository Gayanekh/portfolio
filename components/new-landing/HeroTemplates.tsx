"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotionConfig } from "framer-motion";
import { MoveRight } from "lucide-react";
import { HERO, STACK } from "@/components/new-landing/content";
import StackSlider from "@/components/new-landing/StackSlider";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";

// The hero, side by side: the headline, text and buttons on the left and the
// card stack on the right (the text first on phones).
// The stack (StackSlider) plays by itself: every few seconds the next
// template's card rises and covers the one before, and after the last it
// plays back to the first. It pauses on hover, on focus, off screen and with
// reduced motion; a dot shows its card, and so does the wheel over the stack.

const COUNT = STACK.length;
// How long each card stays before the next.
const AUTOPLAY_MS = 3500;
// One card handing over to the next; going back to the first takes a little longer.
const HANDOVER = { duration: 0.9, ease };
const REWIND = { duration: 1.4, ease };
// The wheel over the stack: one card per gesture, and a long spin moves on
// again after WHEEL_REPEAT_MS. A gesture ends once the wheel has been still
// for WHEEL_QUIET_MS (trackpads keep sending smaller and smaller events
// for a while after the fingers lift; those still belong to the gesture).
const WHEEL_QUIET_MS = 250;
const WHEEL_REPEAT_MS = 900;

const heroButton = `${focusRing} group inline-flex h-12 items-center gap-2 rounded px-6 text-[0.95rem] font-medium no-underline transition-colors`;

export default function HeroTemplates() {
  const reduced = useReducedMotionConfig();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Where along the stack we are: 0 … COUNT - 1, eased towards the active card.
  const position = useMotionValue(0);
  const previous = useRef(0);

  useEffect(() => {
    const from = previous.current;
    previous.current = active;
    if (reduced) {
      position.set(active);
      return;
    }
    const controls = animate(position, active, active < from - 1 ? REWIND : HANDOVER);
    return () => controls.stop();
  }, [active, reduced, position]);

  // With the pointer over the stack, the wheel moves through the cards and
  // the page holds still. Only a new gesture past the first or last card
  // scrolls the page, so the hero never traps the visitor.
  const stackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    let lastEvent = 0;
    let lastStep = 0;
    // Whether the current gesture belongs to the stack (true) or the page (false).
    let ownGesture = false;
    const onWheel = (event: WheelEvent) => {
      const now = event.timeStamp;
      const newGesture = now - lastEvent >= WHEEL_QUIET_MS;
      lastEvent = now;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      // `previous` holds the card on show (set when `active` changes).
      const next = previous.current + (event.deltaY > 0 ? 1 : -1);
      const canMove = next >= 0 && next < COUNT;
      if (newGesture) {
        ownGesture = canMove;
        // A fresh gesture past either end goes to the page.
        if (!canMove) return;
        lastStep = 0;
      }
      if (!ownGesture) return;
      event.preventDefault();
      // Ignore the faint tail of a gesture; move on once per WHEEL_REPEAT_MS.
      if (!canMove || Math.abs(event.deltaY) < 4 || now - lastStep < WHEEL_REPEAT_MS) return;
      lastStep = now;
      setActive(next);
    };
    stack.addEventListener("wheel", onWheel, { passive: false });
    return () => stack.removeEventListener("wheel", onWheel);
  }, []);

  // Autoplay; picking a card restarts the wait because `active` changes.
  useEffect(() => {
    if (reduced || paused || !inView) return;
    const timer = window.setTimeout(() => setActive((active + 1) % COUNT), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, reduced, paused, inView]);

  return (
    // The top padding keeps the content clear of the floating header.
    <section ref={sectionRef} id="home" aria-label="Introduction" className="flex min-h-svh items-center pb-10 pt-[7.5rem] md:pt-28">
      {/* Side by side: the text on the left, the card stack on the right (stacked on phones). */}
      <div className="mx-auto grid w-content-width grid-cols-1 items-center gap-10 px-3 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-10 lg:gap-12 xl:px-4 2xl:px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex max-w-[36rem] flex-col items-start gap-5"
        >
          {/* The page's largest heading: a step above the section titles at every width. */}
          <h1 className="m-0 text-balance text-[length:clamp(2.5rem,11vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] md:text-[length:clamp(2.75rem,4.6vw,4.5rem)]">
            {HERO.title} <span className="text-foreground/40">{HERO.accent}</span>
          </h1>
          <p className="m-0 max-w-[36rem] text-pretty text-base leading-relaxed text-foreground/65">{HERO.text}</p>
          <div className="flex flex-wrap gap-3">
            {/* FloatingCta watches this id to show the button again once it has scrolled away. */}
            <Link id="hero-cta" href={HERO.primary.href} className={`${heroButton} ${primaryButton}`}>
              {HERO.primary.label}
              <MoveRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>          </div>
        </motion.div>

        {/* The card stack. */}
        <div
          ref={stackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setPaused(false)}
          className="flex justify-center md:justify-end"
        >
          <StackSlider items={STACK} position={position} active={active} onSelect={setActive} />
        </div>
      </div>
    </section>
  );
}
