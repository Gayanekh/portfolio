import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { Suspense } from "react";
import LenisProvider from "@/components/LenisProvider";
import StartAtTopOnReload from "@/components/StartAtTopOnReload";
import { LastPageTracker } from "@/components/navigation/LastPage";

import "./globals.css";

// The site's type: Inter Tight everywhere (the user asked for one font across
// the landing, templates and login): for text and UI (--font-ui, on body) and
// headings (globals.css). It is also --font-1, the portfolio templates' own
// font ("Original"), which their font packs replace.
const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-ui" });
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
          <StartAtTopOnReload />
          {children}
          <Suspense fallback={null}>
            <LastPageTracker />
          </Suspense>
        </LenisProvider>
      </body>
    </html>
  );
}
