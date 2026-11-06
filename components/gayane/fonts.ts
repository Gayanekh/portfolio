import { Space_Grotesk } from "next/font/google";
import { fontVariables } from "@/components/editorial-landing/ui";

// The portfolio's type, after the Kyne reference: Space Grotesk for the large
// uppercase headings, Inter Tight (the site's own) for text, and Instrument Serif
// for the name in the header.
const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500"], variable: "--gk-display", preload: false });

export const fonts = `${display.variable} ${fontVariables}`;
