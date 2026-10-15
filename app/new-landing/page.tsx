import type { Metadata } from "next";
import NewLanding from "@/components/new-landing/NewLanding";

export const metadata: Metadata = {
  title: "Portory | New landing (draft)",
  robots: { index: false },
};

// A draft of the new landing page, designed from scratch at /new-landing.
// When it is ready, render <NewLanding /> from app/page.tsx instead.
export default function NewLandingPage() {
  return <NewLanding />;
}
