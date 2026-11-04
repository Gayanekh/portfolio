import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";

// After the Formwell reference: a tight grotesk for everything (Inter Tight,
// close to its Supreme), Instrument Serif italic for the soft words, and a
// small mono for labels. Warm stone ground, near-black ink, one deep green.
const sans = Inter_Tight({ subsets: ["latin"], variable: "--el-sans" });
const serifFace = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--el-serif" });
const monoFace = Geist_Mono({ subsets: ["latin"], variable: "--el-mono" });

export const fontVariables = `${sans.variable} ${serifFace.variable} ${monoFace.variable}`;

export const ease = [0.22, 1, 0.36, 1] as const;

export const shell = "mx-auto w-full max-w-[90rem] px-6";
export const space = "py-[clamp(6rem,11vw,10rem)]";

export const sansFont = "font-[family-name:var(--el-sans)]";
export const serif = "font-[family-name:var(--el-serif)] font-normal italic";
export const mono = "font-[family-name:var(--el-mono)] text-[0.71875rem] uppercase tracking-[0.04em]";
export const muted = "text-[#6a6863]";
export const faint = "text-[#a29f98]";
export const green = "text-[#17614c]";

// Headings, measured on the reference (72 / 104 / 152px, tight tracking).
export const h2 = "m-0 text-[clamp(2.75rem,5vw,4.5rem)] font-medium leading-[0.96] tracking-[-0.055em]";
export const body = "text-[1rem] leading-[1.5] tracking-[-0.01em] text-[#6a6863]";

export const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-[#17614c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#edebe6]";

// The reference's button: an ink pill with a small light square holding the arrow.
export const pill = `${focusRing} group/pill inline-flex h-12 items-center gap-4 rounded-[10px] bg-[#121211] py-1 pl-4 pr-1 text-[0.9375rem] font-medium tracking-[-0.015em] text-[#edebe6] no-underline transition-colors duration-300 hover:bg-[#17614c]`;
export const pillSquare = "grid size-10 place-items-center rounded-[7px] bg-[#f8f7f4] text-[#121211] transition-transform duration-300 group-hover/pill:rotate-45";
export const pillLight = `${focusRing} group/pill inline-flex h-12 items-center gap-4 rounded-[10px] bg-[#f8f7f4] py-1 pl-4 pr-1 text-[0.9375rem] font-medium tracking-[-0.015em] text-[#121211] no-underline transition-colors duration-300 hover:bg-white`;
export const pillLightSquare = "grid size-10 place-items-center rounded-[7px] bg-[#121211] text-[#f8f7f4] transition-transform duration-300 group-hover/pill:rotate-45";

// An underlined text link with a small arrow.
export const underline = `${focusRing} inline-flex items-center gap-2 rounded-sm border-0 border-b border-solid border-[#121211] pb-1 text-[0.9375rem] tracking-[-0.015em] text-[#121211] no-underline transition-colors hover:border-[#17614c] hover:text-[#17614c]`;
export const chip = "rounded-[6px] border border-solid border-[#121211]/10 bg-[#f8f7f4] px-2.5 py-1 text-[0.875rem] text-[#121211]";
