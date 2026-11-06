"use client";

import { ABOUT, EDUCATION, EXPERIENCE, PERSON, SKILLS, STACK } from "@/components/gayane/content";
import Image from "next/image";
import { AVATAR, display, frame, Letters, Pop, Rise, type, Zoom } from "@/components/gayane/kit";

// About: the title and story, then the experience as cards that sharpen into place,
// the skills, the stack and the education.
export default function About() {
  return (
    <div className={`pb-[clamp(5rem,10vw,9rem)] pt-[clamp(8rem,14vw,12rem)] ${frame}`}>
      <Rise className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <h1 className={`${type.heading} uppercase`}>
          About <span className="text-[var(--accent)]">me</span>
        </h1>
        <span className="relative block aspect-[4/5] w-[clamp(10rem,18vw,16rem)] shrink-0 overflow-hidden rounded-[8px]">
          <Zoom>
            <Image src={AVATAR} alt="Gayane Khachatryan" fill priority sizes="(min-width: 640px) 18vw, 160px" className="object-cover object-[50%_30%]" />
          </Zoom>
        </span>
      </Rise>
      <Rise delay={0.15} className="mt-8 grid gap-6 lg:grid-cols-2">
        <p className={`m-0 ${type.title} !normal-case`}>{ABOUT.lead}</p>
        <div>
          <p className={`m-0 text-[var(--dim)] ${type.body}`}>{ABOUT.more}</p>
          <p className={`m-0 mt-4 ${type.body}`}>
            {PERSON.location} · {PERSON.status}
          </p>
        </div>
      </Rise>

      <section aria-label="Experience" className="mt-[clamp(5rem,10vw,9rem)]">
        <h2 className={`${type.heading} uppercase`}>
          <Letters text="Experience" />
        </h2>
        <div className="mt-[clamp(2rem,5vw,4rem)] flex flex-col gap-6">
          {EXPERIENCE.map((job) => (
            <article key={job.company} className="gk-stack rounded-[8px] bg-[var(--card)] p-[clamp(1.25rem,2.2vw,2rem)]">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h3 className={type.title}>
                  {job.role} <span className="text-[var(--accent)]">· {job.company}</span>
                </h3>
                <span className={`text-[var(--dim)] ${type.body}`}>
                  {job.years} · {job.place}
                </span>
              </div>
              <ol className="m-0 mt-6 grid list-none gap-x-10 gap-y-4 p-0 lg:grid-cols-2">
                {job.points.map((point, i) => (
                  <li key={point} className={`flex gap-3 ${type.body}`}>
                    <span className={`${display} w-7 shrink-0 text-[var(--accent)]`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[var(--dim)]">{point}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Skills" className="mt-[clamp(5rem,10vw,9rem)]">
        <h2 className={`${type.heading} uppercase`}>
          <Letters text="Skills & stack" accent={["stack"]} />
        </h2>
        <dl className="m-0 mt-[clamp(2rem,5vw,4rem)]">
          {SKILLS.map((skill) => (
            <div key={skill.group} className="grid gap-2 border-0 border-t border-solid border-[var(--line)] py-5 lg:grid-cols-[34%_1fr] lg:gap-8">
              <dt className={`uppercase text-[var(--dim)] ${type.small}`}>{skill.group}</dt>
              <dd className={`m-0 ${type.body}`}>{skill.items}</dd>
            </div>
          ))}
        </dl>
        <Pop className="mt-8">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {STACK.map((tool) => (
              <li key={tool} className="rounded-[4px] border border-solid border-[var(--line)] px-3 py-1.5 text-[0.9375rem] text-[var(--dim)]">
                {tool}
              </li>
            ))}
          </ul>
        </Pop>
      </section>

      <section aria-label="Education" className="mt-[clamp(5rem,10vw,9rem)]">
        <h2 className={`${type.heading} uppercase`}>
          <Letters text="Education" />
        </h2>
        <Pop className="mt-[clamp(2rem,5vw,4rem)] rounded-[8px] bg-[var(--card)] p-[clamp(1.25rem,2.2vw,2rem)]">
          <p className={`m-0 ${type.title} !normal-case`}>{EDUCATION.school}</p>
          {EDUCATION.degrees.map((degree) => (
            <p key={degree.title} className={`m-0 mt-3 text-[var(--dim)] ${type.body}`}>
              <span className="text-[var(--fg)]">{degree.title}</span>, {degree.field}
            </p>
          ))}
        </Pop>
      </section>
    </div>
  );
}
