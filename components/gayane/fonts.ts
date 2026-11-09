import { Space_Grotesk } from "next/font/google";
import { fontVariables } from "@/components/editorial-landing/ui";

// The portfolio's type: Space Grotesk for display (light to medium), Inter Tight (the
// site's own) for text, and Instrument Serif for the italic words.
const display = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--gk-display", preload: false });

export const fonts = `${display.variable} ${fontVariables}`;
