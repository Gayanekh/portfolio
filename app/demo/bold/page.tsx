import Link from "next/link";
import BoldPreview from "@/components/templates/BoldPreview";
import { demoPortfolioData } from "@/components/templates/demo-data";

export default function BoldDemoPage() {
  return (
    <>
      <BoldPreview data={demoPortfolioData} />
      <Link
        href="/templates?template=bold&edit=1"
        className="fixed bottom-5 right-5 z-50 rounded-md bg-white px-4 py-2 text-[10px] font-mono uppercase tracking-[0.12em] text-[#111]"
      >
        Use Template
      </Link>
    </>
  );
}
