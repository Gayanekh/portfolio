import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { PRIVACY } from "@/components/legal/content";

export const metadata: Metadata = {
  title: "Privacy policy | Portory",
  description: "What personal information Portory handles when you build and publish a website, and what you can choose.",
};

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} />;
}
