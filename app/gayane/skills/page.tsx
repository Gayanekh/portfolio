import type { Metadata } from "next";
import { Focus, PageTitle, Skills } from "../_site/sections";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return (
    <>
      <PageTitle text="Skills" />
      <Skills />
      <Focus />
    </>
  );
}
