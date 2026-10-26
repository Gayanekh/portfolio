import type { Metadata } from "next";
import { About, Education, Experience, Focus, PageTitle } from "../_site/sections";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageTitle text="About" />
      <About />
      <Experience />
      <Education />
      <Focus />
    </>
  );
}
