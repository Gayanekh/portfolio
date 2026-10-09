import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";

import "./globals.css";

// Loads Inter Tight and exposes it as --font-1, which globals.css applies to body.
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
      <body className={interTight.variable}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
