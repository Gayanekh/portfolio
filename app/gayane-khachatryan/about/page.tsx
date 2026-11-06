import type { Metadata } from "next";
import About from "@/components/gayane/About";

export const metadata: Metadata = { title: "About" };

export default function GayaneAboutPage() {
  return <About />;
}
