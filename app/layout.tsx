import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portory | Build a portfolio worth sharing",
  description:
    "Choose a template, customize your work, and build a portfolio worth sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LenisProvider>
          <PageTransition>{children}</PageTransition>
        </LenisProvider>
      </body>
    </html>
  );
}
