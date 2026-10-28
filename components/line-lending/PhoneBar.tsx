"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp, MoveRight } from "lucide-react";
import { ease, focusRing } from "@/components/landing-next/ui";
import { PHONE_BAR } from "@/components/line-lending/content";
import { scrollPageTo } from "@/lib/scroll";

// Scrolling this far in one direction counts as a change of direction.
const TURN = 8;

// On phones, as on the home page: once the hero has scrolled away, Get
// started and Back to top float together at the foot of the screen. The
// bar slides away while scrolling down to read and comes back on the way up.
export default function PhoneBar() {
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);
  const [anchor, setAnchor] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const pastHero = y > window.innerHeight * 0.85;
    if (!pastHero) {
      if (shown) setShown(false);
      return;
    }
    if (y > anchor + TURN) {
      if (shown) setShown(false);
      setAnchor(y);
    } else if (y < anchor - TURN) {
      if (!shown) setShown(true);
      setAnchor(y);
    }
  });

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ y: "140%" }}
          animate={{ y: 0 }}
          exit={{ y: "140%" }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-2xl bg-[rgb(22_20_29/0.88)] p-2 ring-1 ring-white/10 backdrop-blur-xl lg:hidden"
        >
          <Link href={PHONE_BAR.start.href} className={`${focusRing} group/start inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[4px] bg-[var(--bone)] text-[0.9375rem] font-medium text-[var(--ink)] no-underline`}>
            {PHONE_BAR.start.label}
            <MoveRight aria-hidden="true" className="size-4" />
          </Link>
          <button type="button" aria-label={PHONE_BAR.top} onClick={() => scrollPageTo(0)} className={`${focusRing} grid size-12 cursor-pointer place-items-center rounded-[4px] border-0 bg-white/[0.08] text-[var(--bone)]`}>
            <ArrowUp aria-hidden="true" className="size-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
