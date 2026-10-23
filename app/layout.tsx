import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Suspense } from "react";
import LenisProvider from "@/components/LenisProvider";
import { LastPageTracker } from "@/components/navigation/LastPage";

import "./globals.css";

// The site's type: Inter for text and UI (--font-ui, on body) and Inter Tight
// for headings (globals.css). Inter Tight is also --font-1, the portfolio
// templates' own font ("Original"), which their font packs replace.
const inter = Inter({ subsets: ["latin"], variable: "--font-ui" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-1" });

export const metadata: Metadata = {
  title: "Portory | Build a portfolio worth sharing",
  description:
    "Choose a template, customize your work, and build a portfolio worth sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior lets Next jump (not smooth-scroll) to the top on
    // navigation; a stable gutter stops pages shifting when a scrollbar appears.
    <html lang="en" data-scroll-behavior="smooth" className="[scrollbar-gutter:stable]">
      <body className={`${inter.variable} ${interTight.variable}`}>
        <LenisProvider>
          {children}
          <Suspense fallback={null}>
            <LastPageTracker />
          </Suspense>
        </LenisProvider>
      </body>
    </html>
  );
}
