"use client";

import { useState, type ReactNode } from "react";
import { Download, Plus } from "lucide-react";
import { ABOUT, EDUCATION, EXPERIENCE, FAQS, PERSON, SERVICES, SKILLS, STACK, STATS } from "@/components/gayane/content";
import { ContactLinks, Fade, FlowHalf, hairline, halves, link, Numbered, Portrait, SectionTitle, space, StillHalf, type, Words } from "@/components/gayane/ui";
import { focusRing } from "@/components/template-landing/ui";

function Section({ title, note, action, children }: { title: string; note?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className={space.section}>
      <div className="flex items-baseline justify-between gap-4">
        <SectionTitle title={title} note={note} />
        {action}
      </div>
      {children}
    </section>
  );
}

// One question open at a time; its row opens with a CSS transition.
function Faqs() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {FAQS.map((faq, i) => (
        <div key={faq.question} className={hairline}>
          <h3 className="m-0">
            <button type="button" aria-expanded={open === i} aria-controls={`gk-faq-${i}`} onClick={() => setOpen(open === i ? null : i)} className={`${focusRing} flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-0 py-4 text-left text-[var(--fg)] ${type.heading}`}>
              {faq.question}
              <Plus aria-hidden="true" strokeWidth={1.25} className={`size-5 shrink-0 text-[var(--dim)] transition-transform duration-300 ${open === i ? "rotate-45 text-[var(--accent)]" : ""}`} />
            </button>
          </h3>
          <div id={`gk-faq-${i}`} inert={open !== i} className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <p className={`m-0 max-w-[36rem] pb-4 text-[var(--dim)] ${type.body}`}>{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// About: the title, portrait and contact hold still on one side of the line while
// the story, numbers, services, tools, experience, skills, education and questions
// scroll on the other.
export default function About() {
  return (
    <div className={halves}>
      <StillHalf>
        <h1 className={type.title}>
          <Words text="About Me." step={0.04} />
        </h1>
        <Fade delay={0.4} className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Portrait className="w-[clamp(11rem,17vw,15rem)] lg:order-2" />
          <ContactLinks />
        </Fade>
      </StillHalf>

      <FlowHalf>
        <p className={type.statement}>
          <Words text={ABOUT.lead} delay={0.2} step={0.015} />
        </p>
        <Fade delay={0.5}>
          <p className={`m-0 mt-5 max-w-[36rem] text-[var(--dim)] ${type.body}`}>{ABOUT.more}</p>
          <dl className="m-0 mt-[clamp(2rem,4vw,3rem)] grid grid-cols-2 gap-x-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className={`${hairline} py-3`}>
                <dd className="m-0 text-[length:clamp(2rem,3vw,2.75rem)] font-light leading-none tracking-[-0.03em]">{stat.value}</dd>
                <dt className={`mt-2 text-[var(--dim)] ${type.small}`}>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Fade>

        <Section title="Services" note="+What I bring to a team">
          <ol className="m-0 list-none p-0">
            {SERVICES.map((service, i) => (
              <li key={service.name} className={`${hairline} py-5`}>
                <h3 className={type.heading}>
                  <span className="text-[var(--accent)]">#{i + 1}</span> {service.name}
                </h3>
                <p className={`m-0 mt-2 max-w-[32rem] text-[var(--dim)] ${type.body}`}>{service.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Software Stack">
          <ul className="m-0 list-none p-0">
            {STACK.map((tool) => (
              <li key={tool.name} className={`${hairline} flex items-baseline justify-between gap-4 py-3`}>
                <span className={type.heading}>{tool.name}</span>
                <span className={`text-right text-[var(--dim)] ${type.small}`}>{tool.use}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Experience"
          note="+2015 – 2026"
          action={
            PERSON.cv && (
              <a href={PERSON.cv} download className={`${link} flex shrink-0 items-center gap-1.5 ${type.small}`}>
                <Download aria-hidden="true" className="size-3.5" />
                Download CV
              </a>
            )
          }
        >
          <div className="flex flex-col gap-[clamp(2.5rem,4vw,3.5rem)]">
            {EXPERIENCE.map((job) => (
              <article key={job.company} className={`${hairline} pt-4`}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className={type.heading}>
                    {job.role} <span className="text-[var(--dim)]">— {job.company}</span>
                  </h3>
                  <span className={`shrink-0 text-[var(--accent)] ${type.small}`}>{job.years}</span>
                </div>
                <p className={`m-0 mt-1 text-[var(--dim)] ${type.small}`}>{job.place}</p>
                <ol className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
                  {job.points.map((point, i) => (
                    <Numbered key={point} n={i + 1}>
                      {point}
                    </Numbered>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <dl className="m-0">
            {SKILLS.map((skill) => (
              <div key={skill.group} className={`${hairline} grid gap-1 py-3 sm:grid-cols-[34%_1fr] sm:gap-4`}>
                <dt className={`text-[var(--dim)] ${type.small}`}>{skill.group}</dt>
                <dd className={`m-0 ${type.body}`}>{skill.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Education">
          <div className={`${hairline} pt-4`}>
            <p className={`m-0 ${type.heading}`}>{EDUCATION.school}</p>
            {EDUCATION.degrees.map((degree) => (
              <p key={degree.title} className={`m-0 mt-2 text-[var(--dim)] ${type.body}`}>
                {degree.title}, {degree.field}
              </p>
            ))}
          </div>
        </Section>

        <Section title="FAQs">
          <Faqs />
        </Section>
      </FlowHalf>
    </div>
  );
}
