import type { Metadata } from "next";
import { Footer } from "./_site/sections";
import { Header } from "./_site/ui";

export const metadata: Metadata = {
  title: { default: "Gayane Khachatryan | Senior Product Designer", template: "%s | Gayane Khachatryan" },
  description: "Senior UI/UX and product designer with 10+ years designing complex web and mobile products, design systems and design-to-code workflows.",
};

// Gayane Khachatryan's portfolio: a black, editorial site after the
// anigasparyan.framer.website reference, its content from her CV (_site/data.ts).
export default function GayaneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-dark-page className="min-h-screen bg-black text-[#e6e6e6] antialiased selection:bg-white selection:text-black">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
