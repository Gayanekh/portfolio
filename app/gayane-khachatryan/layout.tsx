import type { Metadata } from "next";
import type { ReactNode } from "react";
import Closing from "@/components/gayane/Closing";
import Header from "@/components/gayane/Header";

const colors = "[--bg:#ffffff] [--fg:#121212] [--dim:#6b6b6b] [--accent:#bb4e1c] [--line:rgb(18_18_18/0.14)] [--panel:#ebebea]";
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
    <div data-site-scale className={`relative min-h-screen overflow-x-clip bg-[var(--bg)] font-[family-name:var(--font-ui)] text-[var(--fg)] antialiased ${colors}`}>
      {/* The line down the page, behind everything; its dot, above, travels it as the page scrolls. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3.5 w-px bg-[var(--line)] lg:left-1/2" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3.5 z-30 w-px lg:left-1/2">
        <span className="sticky top-11 block h-[calc(100svh_-_2.75rem)]">
          <span className="gk-dot absolute left-0 top-3 block size-2.5 rounded-full bg-[var(--accent)]" />
        </span>
      </span>
      <Header />
      <main>{children}</main>
      <Closing />
    </div>
  );
}
