import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { TERMS } from "@/components/legal/content";

export const metadata: Metadata = {
  title: "Terms of use | Portory",
  description: "The simple rules for using Portory.",
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
