"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// The small line drawings beside How it works' steps: fine dark lines with
// soft orange accents. The first time a drawing comes into view it is traced
// as if by an invisible pen, one stroke after another; its orange fills and
// small details settle in once the outlines are done. Decorative; the step's
// title and line say it. With reduced motion it shows drawn.

const INK = "currentColor";
// The fills: the primary colour from the page's themes (ui.ts); How it works sets
// it to the street drawing's orange, #d96a3a (the user asked them to match).
const ACCENT = "var(--accent)";
const PEN = [0.45, 0, 0.25, 1] as const;

type Kit = {
  // A stroke traced by the pen: the n-th one, taking `long` (a share of a stroke's time).
  pen: (n: number, long?: number) => object;
  // A fill or detail settling in after the n-th stroke.
  settle: (n: number) => object;
  line: object;
};

function useKit(): [React.RefObject<SVGSVGElement | null>, Kit] {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const still = useReducedMotion();
  const on = still || seen;
  const STEP = 0.22;
  const kit: Kit = {
    pen: (n, long = 1) => ({
      initial: still ? false : { pathLength: 0, opacity: 0 },
      animate: on ? { pathLength: 1, opacity: 1 } : undefined,
      transition: { pathLength: { duration: 0.9 * long, ease: PEN, delay: 0.25 + n * STEP }, opacity: { duration: 0.05, delay: 0.25 + n * STEP } },
    }),
    settle: (n) => ({
      initial: still ? false : { opacity: 0 },
      animate: on ? { opacity: 1 } : undefined,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.25 + n * STEP },
    }),
    line: { fill: "none", stroke: INK, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const },
  };
  return [ref, kit];
}

// 01 Choose: a browser of six template cards, one picked, with the cursor on it.
function Choose() {
  const [ref, { pen, settle, line }] = useKit();
  return (
    <svg ref={ref} viewBox="0 0 140 96" className="h-full w-full">
      <motion.rect x={4} y={4} width={132} height={88} rx={7} {...line} {...pen(0, 1.6)} />
      <motion.path d="M4 18 H136" {...line} strokeWidth={1.2} {...pen(1)} />
      {[0, 1, 2].map((d) => (
        <motion.circle key={d} cx={13 + d * 7} cy={11} r={1.8} fill={INK} {...settle(2 + d * 0.2)} />
      ))}
      <motion.rect x={42} y={7.5} width={86} height={7} rx={3.5} {...line} strokeWidth={1.1} {...pen(2)} />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const x = 14 + (k % 3) * 40;
        const y = 26 + Math.floor(k / 3) * 32;
        return (
          <g key={k}>
            {k === 4 && <motion.rect x={x} y={y} width={32} height={26} rx={3} fill={ACCENT} {...settle(9)} />}
            <motion.rect x={x} y={y} width={32} height={26} rx={3} {...line} strokeWidth={1.2} {...pen(3 + k * 0.6, 0.8)} />
            <motion.path d={`M${x + 5} ${y + 19} H${x + 20}`} {...line} strokeWidth={1} {...pen(3.4 + k * 0.6, 0.5)} />
          </g>
        );
      })}
      <motion.path d="M96 76 l0 16 l4 -3.5 l3 6.5 l2.6 -1.2 l-3 -6.5 l5.4 0 z" fill={INK} stroke="#f8f7f6" strokeWidth={1} strokeLinejoin="round" {...settle(10)} />
    </svg>
  );
}

// 02 Make it yours: a page with its palette and its type beside it.
function Yours() {
  const [ref, { pen, settle, line }] = useKit();
  return (
    <svg ref={ref} viewBox="0 0 140 96" className="h-full w-full">
      <motion.rect x={4} y={10} width={74} height={80} rx={6} {...line} {...pen(0, 1.5)} />
      <motion.rect x={13} y={20} width={56} height={30} rx={3} fill={ACCENT} {...settle(6)} />
      <motion.rect x={13} y={20} width={56} height={30} rx={3} {...line} strokeWidth={1.2} {...pen(1)} />
      <motion.path d="M17 44 l12 -10 l8 6 l10 -12 l18 16" {...line} strokeWidth={1.2} {...pen(2)} />
      <motion.path d="M13 60 H60 M13 69 H50 M13 78 H40" {...line} strokeWidth={1.1} {...pen(2.6)} />
      <motion.rect x={88} y={10} width={48} height={36} rx={6} {...line} {...pen(3.4)} />
      <motion.circle cx={112} cy={28} r={4.5} fill={ACCENT} {...settle(7)} />
      {[0, 1, 2].map((k) => (
        <motion.circle key={k} cx={100 + k * 12} cy={28} r={4.5} {...line} strokeWidth={1.1} {...pen(4 + k * 0.3, 0.5)} />
      ))}
      <motion.rect x={88} y={54} width={48} height={36} rx={6} {...line} {...pen(5)} />
      <motion.text x={112} y={80} textAnchor="middle" fill={INK} fontSize="22" className="font-[family-name:var(--el-serif)] italic" {...settle(6.4)}>
        Aa
      </motion.text>
    </svg>
  );
}

// 03 Publish: the page live at its address, with a check.
function Publish() {
  const [ref, { pen, settle, line }] = useKit();
  return (
    <svg ref={ref} viewBox="0 0 140 96" className="h-full w-full">
      <motion.rect x={4} y={14} width={110} height={78} rx={7} {...line} {...pen(0, 1.5)} />
      <motion.path d="M4 28 H114" {...line} strokeWidth={1.2} {...pen(1)} />
      {[0, 1, 2].map((d) => (
        <motion.circle key={d} cx={13 + d * 7} cy={21} r={1.8} fill={INK} {...settle(2 + d * 0.2)} />
      ))}
      <motion.rect x={38} y={17} width={68} height={8} rx={4} {...line} strokeWidth={1.1} {...pen(1.6)} />
      <motion.text x={44} y={23.6} fill={INK} fontSize="6.2" className="font-mono" {...settle(3)}>
        portory.net/you
      </motion.text>
      <motion.path d="M16 44 H64 M16 54 H80 M16 64 H56" {...line} strokeWidth={1.1} {...pen(2.4)} />
      <motion.rect x={16} y={72} width={34} height={11} rx={5.5} fill={ACCENT} {...settle(5)} />
      <motion.rect x={16} y={72} width={34} height={11} rx={5.5} {...line} strokeWidth={1.1} {...pen(3.2, 0.6)} />
      <motion.circle cx={122} cy={18} r={13} fill={ACCENT} {...settle(5.4)} />
      <motion.circle cx={122} cy={18} r={13} {...line} {...pen(3.8)} />
      <motion.path d="M116 18 l4 4 l7.5 -8" {...line} strokeWidth={2} {...pen(5.2, 0.6)} />
    </svg>
  );
}

// The two small pieces beside each step's drawing in How it works' collage
// (StepCollage), traced the same way: for Choose a click and the categories,
// for Make it yours the controls and the phone preview, for Publish the web
// and the page sent off.
function Click() {
  const [ref, { pen, settle, line }] = useKit();
  return (
    <svg ref={ref} viewBox="0 0 64 64" className="h-full w-full">
      <motion.circle cx={26} cy={24} r={6} fill={ACCENT} {...settle(3)} />
      <motion.path d="M26 24 l0 24 l6 -5 l4.6 9.6 l4 -1.9 l-4.6 -9.6 l8 0 z" {...line} {...pen(0, 1.3)} />
      <motion.path d="M22 15 l-2.5 -4.5 M30 13.5 l0 -5 M16.5 21 l-5 -2" {...line} strokeWidth={1.4} {...pen(1.6, 0.5)} />
    </svg>
  );
}

function Kinds() {
  const [ref, { pen, settle, line }] = useKit();
  const pills = [{ y: 14, w: 42 }, { y: 28, w: 32 }, { y: 42, w: 38 }];
  return (
    <svg ref={ref} viewBox="0 0 64 64" className="h-full w-full">
      <motion.rect x={11} y={28} width={32} height={10} rx={5} fill={ACCENT} {...settle(3.4)} />
      {pills.map((p, k) => (
        <g key={k}>
          <motion.rect x={11} y={p.y} width={p.w} height={10} rx={5} {...line} strokeWidth={1.3} {...pen(k * 0.7, 0.8)} />
          <motion.circle cx={17} cy={p.y + 5} r={1.6} fill={INK} {...settle(0.8 + k * 0.7)} />
        </g>
      ))}
    </svg>
  );
}

function Controls() {
  const [ref, { pen, settle, line }] = useKit();
  const knobs = [22, 40, 30];
  return (
    <svg ref={ref} viewBox="0 0 64 64" className="h-full w-full">
      {knobs.map((x, k) => (
        <g key={k}>
          <motion.path d={`M12 ${18 + k * 14} H52`} {...line} strokeWidth={1.3} {...pen(k * 0.6, 0.8)} />
          {k === 1 && <motion.circle cx={x} cy={32} r={4.5} fill={ACCENT} {...settle(3)} />}
          <motion.circle cx={x} cy={18 + k * 14} r={4.5} {...line} strokeWidth={1.3} {...pen(1 + k * 0.6, 0.5)} />
        </g>
      ))}
    </svg>
  );
}

function Phone() {
  const [ref, { pen, settle, line }] = useKit();
  return (
    <svg ref={ref} viewBox="0 0 64 64" className="h-full w-full">
      <motion.rect x={20} y={6} width={24} height={52} rx={5} {...line} {...pen(0, 1.3)} />
      <motion.path d="M29 11 H35" {...line} strokeWidth={1.4} {...pen(1)} />
      <motion.rect x={24} y={17} width={16} height={13} rx={2} fill={ACCENT} {...settle(3)} />
      <motion.rect x={24} y={17} width={16} height={13} rx={2} {...line} strokeWidth={1.1} {...pen(1.4, 0.6)} />
      <motion.path d="M24 36 H40 M24 42 H36 M24 48 H32" {...line} strokeWidth={1.1} {...pen(2, 0.7)} />
    </svg>
  );
}

function Web() {
  const [ref, { pen, settle, line }] = useKit();
  return (
    <svg ref={ref} viewBox="0 0 64 64" className="h-full w-full">
      <motion.circle cx={32} cy={33} r={20} {...line} {...pen(0, 1.3)} />
      <motion.ellipse cx={32} cy={33} rx={9} ry={20} {...line} strokeWidth={1.2} {...pen(1)} />
      <motion.path d="M12 33 H52 M15.5 23 Q32 27 48.5 23 M15.5 43 Q32 39 48.5 43" {...line} strokeWidth={1.2} {...pen(1.6, 0.8)} />
      <motion.circle cx={47} cy={17} r={5} fill={ACCENT} {...settle(3)} />
    </svg>
  );
}

function Send() {
  const [ref, { pen, settle, line }] = useKit();
  return (
    <svg ref={ref} viewBox="0 0 64 64" className="h-full w-full">
      <motion.path d="M30 34 L54 12 L41 50 Z" fill={ACCENT} {...settle(3)} />
      <motion.path d="M10 30 L54 12 L41 50 L30 34 Z M30 34 L54 12" {...line} {...pen(0, 1.4)} />
      <motion.path d="M8 52 q7 -1 12 -9" {...line} strokeWidth={1.3} strokeDasharray="2 3.5" {...settle(2.2)} />
    </svg>
  );
}

const PIECES = [
  [Click, Kinds],
  [Controls, Phone],
  [Web, Send],
];

export function StepPiece({ step, slot }: { step: number; slot: 1 | 2 }) {
  const Piece = (PIECES[step] ?? PIECES[0])[slot - 1];
  return <Piece />;
}

const ICONS = [Choose, Yours, Publish];

export default function StepIcon({ step }: { step: number }) {
  const Icon = ICONS[step] ?? Choose;
  return <Icon />;
}
