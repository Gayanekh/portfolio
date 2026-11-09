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

export default function GayaneLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-screen bg-[#16171a] font-[family-name:var(--font-ui)] antialiased ${fonts}`}>
      {children}
    </div>
  );
}
