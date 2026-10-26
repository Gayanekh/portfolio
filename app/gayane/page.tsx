import { About, Education, Experience, Focus, Hero, Skills, WorkGrid } from "./_site/sections";

export default function GayaneHome() {
  return (
    <>
      <Hero />
      <WorkGrid />
      <About more />
      <Experience />
      <Skills />
      <Education />
      <Focus />
    </>
  );
}
