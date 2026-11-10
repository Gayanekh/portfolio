import type { Metadata } from "next";
import TemplateLanding from "@/components/template-landing/TemplateLanding";

const TITLE = "Portory — Your website, already designed";
const DESCRIPTION = "Pick a designed template, make it yours and publish it at portory.net/you. Portfolios, photography, events and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // How a shared link looks (LinkedIn, Slack, iMessage…).
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", siteName: "Portory", images: [{ url: "/images/covers/exhibition.jpg", width: 2400, height: 1500, alt: "The Exhibition template on a laptop and a phone" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/covers/exhibition.jpg"] },
};

// The main landing is /template-landing's (the user chose it); the previous
// home page is kept at /classic-home.

export default function Page() {
  return <TemplateLanding />;
}
