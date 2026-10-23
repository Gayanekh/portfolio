import { Inter_Tight, Newsreader } from "next/font/google";

// The auth pages' type: Inter Tight for the small text, labels and form,
// Newsreader (light) for the large editorial headline and serif accents.
export const authSans = Inter_Tight({ subsets: ["latin"] });
export const authSerif = Newsreader({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"] });
