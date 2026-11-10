import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/gayane/CaseStudy";
import { CASES, caseBySlug } from "@/components/gayane/cases";
import { loadShots } from "@/components/gayane/shots";

// One page for each project in the portfolio's Work gallery, opened from its card.
type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return CASES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const item = caseBySlug(slug);
  if (!item) return {};
  const title = `${item.title} — Gayane Khachatryan`;
  return { title, description: item.subtitle, openGraph: { title, description: item.subtitle } };
}

export default async function CasePage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = caseBySlug(slug);
  if (!item) notFound();
  // The screenshots of a template (Portory's page has its own pictures): the ones that are there, with their sizes.
  const shots = slug === "portory" ? undefined : await loadShots(slug);
  return <CaseStudy item={item} shots={shots} />;
}
