"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ease } from "@/components/landing/landing-ui";

// A card's picture with the Endcap reference's hover (the user asked): while a
// mouse is over it, a round "View" bubble in the primary colour grows in under
// the pointer and follows it, a little behind; it shrinks away when the pointer
// leaves. Only for a mouse (touch has no hover); with reduced motion it sits
// exactly at the pointer. Decorative: the link inside says where it goes.
export default function ViewArea({ children, className = "" }: { children: ReactNode; className?: string }) {
  const still = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 });
  const followY = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 });
  const [on, setOn] = useState(false);

  const place = (event: PointerEvent<HTMLDivElement>, jump = false) => {
    const box = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - box.left;
    const py = event.clientY - box.top;
    x.set(px);
    y.set(py);
    // Entering, the bubble starts where the pointer is rather than gliding in from a corner.
    if (jump) {
      followX.jump(px);
      followY.jump(py);
    }
  };

  return (
    <div
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        place(event, true);
        setOn(true);
      }}
      onPointerMove={(event) => event.pointerType === "mouse" && place(event)}
      onPointerLeave={() => setOn(false)}
      className={`relative [@media(hover:hover)]:cursor-none [@media(hover:hover)]:[&_*]:cursor-none ${className}`}
    >
      {children}
      <motion.span aria-hidden="true" style={{ x: still ? x : followX, y: still ? y : followY }} className="pointer-events-none absolute left-0 top-0 z-10 block">
        <span className="block -translate-x-1/2 -translate-y-1/2">
          <motion.span
            initial={false}
            animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
            transition={{ duration: still ? 0 : 0.35, ease }}
            className="grid size-[4.25rem] place-items-center rounded-full bg-[#bb4e1c] text-white shadow-[0_12px_32px_-12px_rgb(0_0_0/0.4)]"
          >
            <span className="flex items-center gap-0.5 text-[0.6875rem] font-medium tracking-[-0.01em]">
              View
              <ArrowUpRight className="size-3" strokeWidth={2} />
            </span>
          </motion.span>
        </span>
      </motion.span>
    </div>
  );
}
