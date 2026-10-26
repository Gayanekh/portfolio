import type { Metadata } from "next";
import { Focus, PageTitle, WorkGrid } from "../_site/sections";

export const metadata: Metadata = { title: "Works" };

export default function WorksPage() {
  return (
    <>
      <PageTitle text="Works" />
      <WorkGrid />
      <div className="h-[clamp(4rem,9vw,8rem)]" />
      <Focus />
    </>
  );
}
