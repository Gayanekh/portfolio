import Link from "next/link";
import MinimalPreview from "@/components/templates/MinimalPreview";
import { demoPortfolioData } from "@/components/templates/demo-data";

export default function MinimalDemoPage() {
  return (
    <>
      <MinimalPreview data={demoPortfolioData} />
      <Link
        href="/templates?template=minimal&edit=1"
        className="fixed bottom-5 right-5 z-50 rounded-md bg-foreground px-4 py-2 text-[10px] font-mono uppercase tracking-[0.12em] text-primary-foreground"
      >
        Use Template
      </Link>
    </>
  );
}
