import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/gayane/Footer";
import Header from "@/components/gayane/Header";
import { fonts } from "@/components/gayane/fonts";
import { CursorDot } from "@/components/gayane/kit";

// Kept here, not in the kit: a server layout cannot read plain values from a "use client" file.
const colors = "[--bg:#16171a] [--fg:#efefed] [--dim:#9a9a96] [--accent:#c6f36b] [--line:rgb(239_239_237/0.14)] [--card:#1f2024]";
const TITLE = "Gayane Khachatryan — Senior Product Designer";
const DESCRIPTION = "Senior UI/UX and product designer with 10+ years of experience designing complex web and mobile products, design systems and design-to-code workflows.";

export const metadata: Metadata = {
  title: { default: TITLE, template: "%s — Gayane Khachatryan" },
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "profile" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function GayaneLayout({ children }: { children: ReactNode }) {
  return (
    <div data-site-scale className={`min-h-screen overflow-x-clip bg-[var(--bg)] font-[family-name:var(--font-ui)] text-[var(--fg)] antialiased ${fonts} ${colors}`}>
      <Header />
      <main>{children}</main>
      <Footer />
      <CursorDot />
    </div>
  );
}
