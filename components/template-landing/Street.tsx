"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ease, themes } from "@/components/template-landing/ui";
import useFinePointer from "@/components/template-landing/useFinePointer";

// A dark band under the hero, after the Endcap reference (the user asked for
// its animation): a line drawing of a row of website windows that draws
// itself, line by line from left to right, the first time it scrolls into
// view; then its details come in. Four windows are blank outlines (one with a
// "Draft" tag), the fifth is filled in the page's orange and shows
// portory.net/you: many blank pages, then yours, published. A cursor glides
// gently over the windows one after the other; over each, a small fine-line
// drawing (a paper plane, a pen nib, overlapping colour circles, a moon and
// stars, a cluster of sparkles for yours) draws itself above it and floats
// softly, in place of the reference's sun and clouds. Decorative; the page's words
// say the same.

const INK = "#efefed";
const SOFT = "rgb(239 239 237 / 0.45)";
// The primary colour, from the page's themes (ui.ts): this band takes the dark
// theme, so it is the shade lighter that reads on black.
const ORANGE = "var(--accent)";
const DARK = "#141414";

// Window frames along the street (x, width); the fifth is the filled one.
const UNITS = [
  { x: 150, w: 210 },
  { x: 360, w: 210 },
  { x: 570, w: 230 },
  { x: 800, w: 220 },
];
const FILLED = { x: 1030, w: 270 };
const GROUND = 330;
const TOP = 200;

export default function Street() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const still = useReducedMotion();
  const on = still || seen;
  // The shapes float only with a mouse (on touch screens it made scrolling
  // stutter) and only while the band is on screen.
  const mouse = useFinePointer();
  const visible = useInView(ref);
  const float = on && !still && mouse && visible;

  // One stroke drawing itself: from nothing to whole, `order` steps after the start.
  const draw = (order: number, duration = 1.6) => ({
    initial: still ? false : { pathLength: 0, opacity: 0 },
    animate: on ? { pathLength: 1, opacity: 1 } : undefined,
    transition: { pathLength: { duration, ease: [0.32, 0.72, 0, 1] as const, delay: 0.1 + order * 0.12 }, opacity: { duration: 0.01, delay: 0.1 + order * 0.12 } },
  });
  // A detail fading in after the lines.
  const appear = (delay: number, y = 6) => ({
    initial: still ? false : { opacity: 0, y },
    animate: on ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, ease, delay },
  });
  const line = { fill: "none", stroke: INK, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const soft = { ...line, stroke: SOFT, strokeWidth: 1.2 };
  const fine = { ...line, stroke: SOFT, strokeWidth: 1 };

  // A small shape centred over each window (cx), drawn at `at`.
  const cx = [...UNITS, FILLED].map((u) => u.x + u.w / 2);
  const SKY = 140;
  // A four-point sparkle of radius r at (x, y), its sides curving in.
  const spark = (x: number, y: number, r: number) => {
    const k = r * 0.18;
    return `M${x} ${y - r} C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y} C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r} C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y} C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r} Z`;
  };
  // A line drawing itself in `seconds`, starting at `at` seconds.
  const pen = (at: number, seconds = 1.2) => draw((at - 0.1) / 0.12, seconds);

  const SHAPES = [
    // 01: a paper plane on its way, a soft dotted trail behind it (sharing).
    (at: number) => {
      const x = cx[0] + 14;
      const y = SKY;
      return (
        <g>
          <motion.path d={`M${x - 24} ${y + 4} L${x + 26} ${y - 14} L${x + 6} ${y + 14} Z M${x + 26} ${y - 14} L${x} ${y + 4} L${x + 6} ${y + 14}`} {...fine} {...pen(at, 1.3)} />
          <motion.path d={`M${x - 30} ${y + 7} C${x - 46} ${y + 16} ${x - 60} ${y - 6} ${x - 78} ${y + 2}`} fill="none" stroke={SOFT} strokeWidth={1} strokeLinecap="round" strokeDasharray="1 6" {...appear(at + 0.6, 0)} />
        </g>
      );
    },
    // 02: a pen nib, the tool of the maker (editing).
    (at: number) => {
      const x = cx[1];
      const y = SKY;
      return (
        <g>
          <motion.path d={`M${x} ${y - 24} C${x + 10} ${y - 12} ${x + 14} ${y + 2} ${x + 8} ${y + 16} L${x} ${y + 26} L${x - 8} ${y + 16} C${x - 14} ${y + 2} ${x - 10} ${y - 12} ${x} ${y - 24} Z`} {...fine} {...pen(at, 1.4)} />
          <motion.path d={`M${x} ${y + 5} L${x} ${y + 25} M${x - 7} ${y - 14} H${x + 7}`} {...fine} {...pen(at + 0.5, 0.8)} />
          <motion.circle cx={x} cy={y + 2} r={2.6} fill={ORANGE} {...appear(at + 0.8, 0)} />
        </g>
      );
    },
    // 03: three overlapping circles, a soft colour palette, one warm.
    (at: number) => {
      const x = cx[2];
      const y = SKY + 2;
      return (
        <g>
          <motion.circle cx={x} cy={y + 9} r={12} fill={ORANGE} initial={still ? false : { opacity: 0 }} animate={on ? { opacity: 0.55 } : undefined} transition={{ duration: 1, ease, delay: at + 0.7 }} />
          {[
            [x - 9, y - 6],
            [x + 9, y - 6],
            [x, y + 9],
          ].map(([px, py], k) => (
            <motion.circle key={k} cx={px} cy={py} r={12} {...fine} stroke={k === 2 ? INK : SOFT} {...pen(at + k * 0.2, 1.1)} />
          ))}
        </g>
      );
    },
    // 04: a crescent moon with two small stars (a quiet night, all set).
    (at: number) => {
      const x = cx[3] - 8;
      const y = SKY;
      return (
        <g>
          <motion.path d={`M${x + 6} ${y - 17} A17 17 0 1 0 ${x + 6} ${y + 17} A22 22 0 0 1 ${x + 6} ${y - 17} Z`} {...fine} {...pen(at, 1.4)} />
          <motion.path d={spark(x + 26, y - 12, 5)} fill="none" stroke={INK} strokeWidth={0.9} strokeLinejoin="round" {...appear(at + 0.6, 0)} />
          <motion.circle cx={x + 32} cy={y + 8} r={1.6} fill={SOFT} {...appear(at + 0.8, 0)} />
          <motion.circle cx={x + 20} cy={y + 18} r={1.1} fill={SOFT} {...appear(at + 0.9, 0)} />
        </g>
      );
    },
    // 05, yours: a small cluster of sparkles, the large one in orange.
    (at: number) => {
      const x = cx[4] + 82;
      const y = 48;
      return (
        <motion.g initial={still ? false : { opacity: 0, scale: 0.5, rotate: -20 }} animate={on ? { opacity: 1, scale: 1, rotate: 0 } : undefined} transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1], delay: at }} style={{ transformOrigin: `${x}px ${y}px` }}>
          <path d={spark(x, y, 10)} fill={ORANGE} />
          <path d={spark(x + 16, y - 10, 4.5)} fill="none" stroke={ORANGE} strokeWidth={0.9} strokeLinejoin="round" />
          <circle cx={x + 15} cy={y + 9} r={1.6} fill={ORANGE} />
        </motion.g>
      );
    },
  ];
  // When the cursor is over each window (seconds), and its gentle path there.
  const PASS = [2.9, 3.9, 4.9, 5.9, 7];
  const CURSOR = [
    { x: 40, y: 270, t: 2.3 },
    ...PASS.flatMap((t, i) => [
      { x: cx[i] - 8, y: TOP + (i === 4 ? 30 : 52) + (i % 2) * 8, t },
      { x: cx[i] + 10, y: TOP + (i === 4 ? 26 : 46) + (i % 2) * 8, t: t + 0.5 },
    ]),
  ];
  // At the end it rests on your window a moment, then fades slowly away.
  const REST = CURSOR[CURSOR.length - 1];
  CURSOR.push({ ...REST, t: REST.t + 1 }, { x: REST.x + 4, y: REST.y + 2, t: REST.t + 2.6 });

  return (
    <div ref={ref} aria-hidden="true" className={`relative z-10 overflow-hidden bg-[#0f0f0f] py-[clamp(1.25rem,2.5vw,2.25rem)] ${themes.dark}`}>
      {/* On phones the drawing is shown larger, cropped to its right part (windows 03 to 05). */}
      <svg viewBox="0 0 1440 400" className="mx-auto block h-auto w-full max-w-[64rem] max-md:w-[164%] max-md:max-w-none max-md:-translate-x-[38%]">
        {/* The ruler along the top, its ticks at each window's edges. */}
        <motion.path d="M150 70 H1300" {...soft} {...draw(0, 1.8)} />
        {[150, 360, 570, 800, 1030, 1300].map((x, i) => (
          <motion.path key={x} d={`M${x} 62 V78`} {...soft} {...draw(1 + i * 0.3, 0.6)} />
        ))}
        <motion.text x={1165} y={52} textAnchor="middle" fill={ORANGE} className="font-mono" fontSize="12" letterSpacing="1.5" {...appear(2.4)}>
          YOUR WEBSITE
        </motion.text>

        {/* The row of blank windows. */}
        <motion.path d={`M${UNITS[0].x} ${TOP} H${FILLED.x}`} {...line} {...draw(1, 2)} />
        {UNITS.map((u, i) => (
          <g key={u.x}>
            <motion.path d={`M${u.x} ${TOP} V${GROUND}`} {...line} {...draw(2 + i, 1.2)} />
            {/* The browser bar: three dots and an address field. */}
            <motion.path d={`M${u.x} ${TOP + 22} H${u.x + u.w}`} {...soft} {...draw(2.5 + i)} />
            {[0, 1, 2].map((d) => (
              <motion.circle key={d} cx={u.x + 14 + d * 10} cy={TOP + 11} r={2.4} fill={SOFT} {...appear(1.6 + i * 0.15, 0)} />
            ))}
            <motion.rect x={u.x + 50} y={TOP + 6} width={u.w - 70} height={10} rx={5} {...soft} {...draw(3 + i, 1)} />
            {/* The blank page: a heading line, two text lines and an image box. */}
            <motion.path d={`M${u.x + 20} ${TOP + 46} H${u.x + 20 + u.w * 0.45}`} {...line} {...draw(3.5 + i, 1)} />
            <motion.path d={`M${u.x + 20} ${TOP + 62} H${u.x + u.w - 24} M${u.x + 20} ${TOP + 74} H${u.x + u.w * 0.6}`} {...soft} {...draw(4 + i, 1.1)} />
            <motion.rect x={u.x + 20} y={TOP + 88} width={u.w - 44} height={GROUND - TOP - 108} rx={3} {...soft} {...draw(4.5 + i, 1.3)} />
          </g>
        ))}
        <motion.path d={`M${FILLED.x} ${TOP} V${GROUND}`} {...line} {...draw(6, 1.2)} />

        {/* The "Draft" tag hanging on the third window. */}
        <motion.g {...appear(2.2, -8)}>
          <path d={`M${UNITS[2].x + 40} ${TOP} l10 14 l10 -14`} fill="none" stroke={SOFT} strokeWidth={1.2} />
          <rect x={UNITS[2].x + 22} y={TOP + 14} width={56} height={22} rx={3} fill={ORANGE} transform={`rotate(-6 ${UNITS[2].x + 50} ${TOP + 25})`} />
          <text x={UNITS[2].x + 50} y={TOP + 29} textAnchor="middle" fill={DARK} className="font-mono" fontSize="10" fontWeight="600" letterSpacing="1" transform={`rotate(-6 ${UNITS[2].x + 50} ${TOP + 25})`}>
            DRAFT
          </text>
        </motion.g>

        {/* Your website: the fifth window, filled in orange, showing your address. */}
        <motion.g {...appear(1.9, 10)}>
          <rect x={FILLED.x} y={TOP - 40} width={FILLED.w} height={GROUND - TOP + 40} fill={ORANGE} />
          <rect x={FILLED.x} y={TOP - 40} width={FILLED.w} height={26} fill="rgb(0 0 0 / 0.12)" />
          {[0, 1, 2].map((d) => (
            <circle key={d} cx={FILLED.x + 16 + d * 11} cy={TOP - 27} r={3} fill={DARK} />
          ))}
          <rect x={FILLED.x + 56} y={TOP - 34} width={FILLED.w - 76} height={14} rx={7} fill="rgb(255 255 255 / 0.55)" />
          <text x={FILLED.x + 66} y={TOP - 23.5} fill={DARK} className="font-mono" fontSize="10">
            portory.net/you
          </text>
          <text x={FILLED.x + 24} y={TOP + 34} fill={DARK} fontSize="30" fontWeight="600" letterSpacing="-1">
            Your site.
          </text>
          <path d={`M${FILLED.x + 24} ${TOP + 56} H${FILLED.x + FILLED.w - 40} M${FILLED.x + 24} ${TOP + 70} H${FILLED.x + FILLED.w * 0.62}`} stroke={DARK} strokeOpacity={0.55} strokeWidth={1.4} strokeLinecap="round" />
          {/* A picture on the page: a framed box with hills and a sun inside it. */}
          <rect x={FILLED.x + 24} y={TOP + 82} width={FILLED.w - 48} height={GROUND - TOP - 96} rx={4} fill="none" stroke={DARK} strokeWidth={1.6} />
          <path d={`M${FILLED.x + 32} ${GROUND - 20} l34 -18 l22 12 l30 -22 l${FILLED.w - 158} 28`} fill="none" stroke={DARK} strokeWidth={1.6} strokeLinejoin="round" />
          <circle cx={FILLED.x + FILLED.w - 52} cy={TOP + 96} r={5} fill={DARK} />
        </motion.g>

        {/* The street, its marks and the numbers. */}
        <motion.path d={`M60 ${GROUND} H1380`} {...line} {...draw(0.5, 2)} />
        {Array.from({ length: 22 }, (_, k) => 140 + k * 56).map((x, k) => (
          <motion.path key={x} d={`M${x} ${GROUND + 44} l22 -24`} {...soft} {...draw(2 + k * 0.08, 0.5)} />
        ))}
        {[...UNITS, FILLED].map((u, i) => (
          <motion.text key={u.x} x={u.x + u.w / 2} y={GROUND + 56} textAnchor="middle" fill={i === 4 ? ORANGE : SOFT} className="font-mono" fontSize="11" letterSpacing="1.5" {...appear(2.6 + i * 0.08, 0)}>
            {String(i + 1).padStart(2, "0")}
          </motion.text>
        ))}

        {/* Above each window, as the cursor passes it, a small design shape draws itself
            and then floats softly (Portory's own sky, in place of a sun and clouds). */}
        {SHAPES.map((shape, i) => (
          <motion.g key={i} initial={still ? false : { y: 0 }} animate={float ? { y: [0, -4, 0] } : { y: 0 }} transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: PASS[i] + 1.2 }}>
            {shape(PASS[i])}
          </motion.g>
        ))}

        {/* The cursor gliding gently over the windows, one after the other, to yours. */}
        {!still && (
          <motion.g
            initial={{ x: CURSOR[0].x, y: CURSOR[0].y, opacity: 0 }}
            animate={on ? { x: CURSOR.map((p) => p.x), y: CURSOR.map((p) => p.y), opacity: CURSOR.map((_, k) => (k === 0 || k === CURSOR.length - 1 ? 0 : 1)) } : undefined}
            transition={{ duration: CURSOR[CURSOR.length - 1].t - CURSOR[0].t, times: CURSOR.map((p) => (p.t - CURSOR[0].t) / (CURSOR[CURSOR.length - 1].t - CURSOR[0].t)), ease: "easeInOut", delay: CURSOR[0].t }}
          >
            <path d="M0 0 l0 26 l7 -6 l5.5 11.5 l4.5 -2.2 l-5.5 -11.5 l9.5 0 z" fill={INK} stroke="#0f0f0f" strokeWidth={1.4} strokeLinejoin="round" />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
