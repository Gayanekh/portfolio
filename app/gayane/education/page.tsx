import type { Metadata } from "next";
import { Education, Focus, PageTitle } from "../_site/sections";

export const metadata: Metadata = { title: "Education" };

export default function EducationPage() {
  return (
    <>
      <PageTitle text="Education" />
      <Education />
      <Focus />
    </>
  );
}
