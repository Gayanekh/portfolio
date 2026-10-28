import { Bricolage_Grotesque, DM_Mono, Instrument_Serif } from "next/font/google";

// The new landing's own type, as CSS variables on its root: a characterful
// grotesque for headlines, a serif italic for accents and a mono for labels.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--nl-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--nl-serif" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--nl-mono" });

export const fontVariables = `${display.variable} ${serif.variable} ${mono.variable}`;
