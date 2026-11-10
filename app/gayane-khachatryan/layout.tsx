import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fonts } from "@/components/gayane/fonts";

const TITLE = "Gayane Khachatryan — Senior Product Designer";
const DESCRIPTION = "Senior UI/UX and product designer with 10+ years of experience designing complex web and mobile products, design systems and design-to-code workflows.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "profile" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

// The reveal animations start from a hidden state (opacity 0, clipped, shifted). Where nothing will play them (scripts
// off) or where they should not (reduced motion), the content is shown as it is. The selectors match exactly "opacity:
// 0" (not 0.45 and the like, which are meant) in the forms React and the browser write it, and clipped reveals.
const HIDDEN = [
  '[style*="opacity:0;"]',
  '[style*="opacity: 0;"]',
  '[style$="opacity:0"]',
  '[style$="opacity: 0"]',
  '[style*="clip-path:inset"]',
  '[style*="clip-path: inset"]',
].join(",");
const SHOW = `${HIDDEN}{opacity:1!important;clip-path:none!important;transform:none!important;filter:none!important}`;
const NO_SCRIPT = SHOW;
const REDUCED_MOTION = `@media (prefers-reduced-motion: reduce){${SHOW}}`;

export default function GayaneLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-screen bg-[#16171a] font-[family-name:var(--font-ui)] antialiased ${fonts}`}>
      <noscript>
        <style>{NO_SCRIPT}</style>
      </noscript>
      <style>{REDUCED_MOTION}</style>
      {children}
    </div>
  );
}
