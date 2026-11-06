"use client";

import { PERSON, PROJECTS, SERVICES, STATEMENT } from "@/components/gayane/content";
import { Fade, FlowHalf, halves, hairline, margins, Portrait, ProjectRow, SectionTitle, space, type, Words } from "@/components/gayane/ui";

// The home page: the name staggered against the line and, across it, the portrait
// and statement; then the selected work, and what Gayane does.
export default function Home() {
  return (
    <>
      <section className={`lg:min-h-[calc(100svh_-_2.75rem)] ${halves}`}>
        <div className="flex flex-col justify-end pb-6 pl-8 pr-4 pt-[clamp(2.5rem,8vw,4rem)] lg:pb-[clamp(3rem,16svh,9rem)] lg:pl-[clamp(1.5rem,4.2vw,3.75rem)] lg:pr-[clamp(1.5rem,4.2vw,3.75rem)]">
          <div className="[container-type:inline-size]">
            <h1 className="m-0 text-[min(15cqw,7.5rem)] font-light leading-[1.05] tracking-[-0.035em]">
              <span className="block text-right lg:text-right">
                <Words text={PERSON.first} step={0.04} />
              </span>
              <span aria-hidden="true" className={`${hairline} ml-auto mt-[0.12em] block w-[52%] pt-[0.12em]`} />
              <span className="block">
                <Words text={PERSON.last} delay={0.08} step={0.04} />
              </span>
            </h1>
          </div>
        </div>
        <FlowHalf className="flex flex-col justify-center gap-6 pb-6 lg:pb-[clamp(2rem,6svh,4rem)] lg:pt-[clamp(1.5rem,5svh,3rem)]">
          <Fade delay={0.3}>
            <Portrait className="w-[clamp(11rem,19vw,17rem)]" />
          </Fade>
          <p className={`max-w-[34rem] ${type.statement}`}>
            <Words text={STATEMENT.lead} delay={0.2} />{" "}
            <span className="text-[var(--dim)]">
              <Words text={STATEMENT.soft} delay={0.2 + STATEMENT.lead.split(" ").length * 0.02} />
            </span>
          </p>
          <Fade delay={0.5}>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {SERVICES.map((service) => (
                <li key={service.name} className={`rounded-[4px] border border-solid border-[var(--line)] px-3 py-1.5 text-[var(--dim)] ${type.small}`}>
                  {service.name}
                </li>
              ))}
            </ul>
          </Fade>
        </FlowHalf>
      </section>

      <section aria-labelledby="gk-work" className={`${space.section} ${margins}`}>
        <SectionTitle id="gk-work" title="Selected work" note={`+${PROJECTS.length} products, 2015 – 2026`} />
        <div className="flex flex-col gap-[clamp(2.5rem,5vw,4.5rem)]">
          {PROJECTS.map((project) => (
            <ProjectRow key={project.name} project={project} />
          ))}
        </div>
      </section>

      <section aria-labelledby="gk-services" className={`${space.section} ${margins} ${halves}`}>
        <SectionTitle id="gk-services" title="What I do" note={PERSON.since} />
        <ol className="m-0 list-none p-0 lg:pl-[clamp(1.5rem,4.2vw,3.75rem)]">
          {SERVICES.map((service, i) => (
            <li key={service.name} className={`${hairline} py-5 first:border-t-0 first:pt-0`}>
              <h3 className={type.heading}>
                <span className="text-[var(--accent)]">#{i + 1}</span> {service.name}
              </h3>
              <p className={`m-0 mt-2 max-w-[32rem] text-[var(--dim)] ${type.body}`}>{service.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
