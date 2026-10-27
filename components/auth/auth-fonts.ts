import { Inter_Tight } from "next/font/google";

// The auth pages' type: Inter Tight throughout, as on the rest of the site
// (its headings). `authSans` sets the small text, labels and form;
// `authDisplay` the large light headlines (weights 300 and 400).
export const authSans = Inter_Tight({ subsets: ["latin"] });
export const authDisplay = Inter_Tight({ subsets: ["latin"], weight: ["300", "400"] });
