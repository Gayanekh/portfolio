import { Mrs_Saint_Delafield } from "next/font/google";

// The artist's signature, as the page's logo.
const hand = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--ex-hand" });

export const handVariable = hand.variable;
export const handFont = "font-[family-name:var(--ex-hand)] font-normal";
