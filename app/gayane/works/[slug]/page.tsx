import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKS } from "../../_site/data";
import { WorkDetail } from "../../_site/sections";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return WORKS.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: WORKS.find((work) => work.slug === slug)?.title ?? "Work" };
}

export default async function WorkPage({ params }: { params: Params }) {
  const { slug } = await params;
  const work = WORKS.find((item) => item.slug === slug);
  if (!work) notFound();
  return <WorkDetail work={work} />;
}
