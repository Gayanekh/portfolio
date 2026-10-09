"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Plus } from "lucide-react";
import AuthControls from "@/components/auth/AuthControls";
import BrandMark from "@/components/auth/BrandMark";
import { useLanding } from "@/components/landing/LandingProvider";
import FloatingCta from "@/components/landing/FloatingCta";
import { ease, focusRing, primaryButton } from "@/components/landing/landing-ui";

// Destinations are unchanged from the previous landing header.
const LINKS = [
  { href: "#templates", label: "Templates" },
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#contact", label: "Get started" },
];

// Scroll position (px) after which the full bar has left the screen and the
// compact bar takes over.
const SWAP_AT = 120;

// The bar's contents. `compact` is the narrower, slightly smaller version.
function Bar({ compact }: { compact: boolean }) {
  return (
    <div
      data-nav-card={compact ? "true" : undefined}
      className={`mx-auto overflow-hidden rounded-3xl backdrop-blur-sm ${compact ? "w-[min(92%,36rem)] lg:w-[min(92%,48rem)] card" : "w-full"}`}
    >
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 p-3 xl:gap-x-4 xl:p-4 2xl:gap-x-5 2xl:p-5 ${compact ? "[zoom:0.86]" : ""}`}>
        <Link href="/" aria-label="Portory home" className={`${focusRing} flex shrink-0 items-center gap-2 rounded-lg`}>
          <span className="hidden sm:block lg:hidden xl:block [&_img]:h-6"><BrandMark /></span>
        </Link>
         <ul className="order-last m-0 flex basis-full list-none flex-wrap items-center justify-center gap-x-1 gap-y-1 border-t border-foreground/5 p-0 pt-2 lg:order-none lg:flex-1 lg:basis-auto lg:border-0 lg:pt-0">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${focusRing} uppercase block whitespace-nowrap rounded-full px-1.5 py-1.5  font-medium  no-underline transition-colors hover:bg-foreground/5 hover:text-foreground sm:px-2.5 text-base`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex shrink-0 items-center gap-2 [&_a]:no-underline">
          
          <AuthControls />       
        </div>
      </div>
    </div>
  );
}

// Header as in the reference recording: at the top of the page the full-width
// bar sits in the page and scrolls away with it. Once it is gone, the compact
// bar slides down from above the screen and stays fixed; scrolling back to the
// top slides it up again and the full bar is there.
export default function LandingHeader() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > SWAP_AT));
  // Pick up the starting state when the page opens part-way down.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setCompact(scrollY.get() > SWAP_AT));
    return () => cancelAnimationFrame(frame);
  }, [scrollY]);

  return (
    <>
      <FloatingCta />
      <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
        <nav
          aria-label="Main navigation"
          aria-hidden={compact || undefined}
          inert={compact}
          className="absolute left-1/2 top-5 z-[1000] -translate-x-1/2 w-content-width mx-auto"
        >
          <Bar compact={false} />
        </nav>
      </motion.div>
      <div className="pointer-events-none fixed inset-x-0 top-5 z-[1000] flex justify-center">
        <AnimatePresence>
          {compact && (
            <motion.nav
              key="compact"
              aria-label="Main navigation"
              initial={{ y: "-160%" }}
              animate={{ y: 0 }}
              exit={{ y: "-160%" }}
              transition={{ duration: 0.45, ease }}
              className="pointer-events-auto w-content-width"
            >
              <Bar compact />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
