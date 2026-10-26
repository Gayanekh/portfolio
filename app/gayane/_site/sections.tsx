/* eslint-disable @next/next/no-img-element -- remote sample photos */
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { ABOUT_IMAGES, BASE, EDUCATION, EXPERIENCE, PERSON, SKILLS, SUMMARY, WORKS, type Work } from "./data";
import { CopyEmail, Marquee, Reveal, SkillIcon, focus } from "./ui";

// The site's look, after the reference: black pages, light grey type in
// Inter Tight (light for display, tight tracking), small spaced capitals for
// labels, and a two-part layout: a label on the left, the content from 37%.

export const edge = "px-[clamp(1rem,1.4vw,1.25rem)]";
const label = "m-0 text-[0.8125rem] font-semibold uppercase tracking-[0.3em] text-[#e6e6e6]";
const spaced = "text-[0.8125rem] font-semibold uppercase tracking-[0.3em]";
const display = "font-light uppercase leading-[0.9] tracking-[-0.05em]";
const split = "grid grid-cols-1 gap-8 md:grid-cols-[37%_minmax(0,1fr)] md:gap-0";

// Plus marks in a block's corners.
function Corners({ dark = false }: { dark?: boolean }) {
  const mark = `absolute size-5 ${dark ? "text-black" : "text-white"}`;
  return (
    <span aria-hidden="true">
      <Plus strokeWidth={1.25} className={`${mark} left-[clamp(1rem,2.5vw,2rem)] top-[clamp(1rem,2.5vw,2rem)]`} />
      <Plus strokeWidth={1.25} className={`${mark} right-[clamp(1rem,2.5vw,2rem)] top-[clamp(1rem,2.5vw,2rem)]`} />
      <Plus strokeWidth={1.25} className={`${mark} bottom-[clamp(1rem,2.5vw,2rem)] left-[clamp(1rem,2.5vw,2rem)]`} />
      <Plus strokeWidth={1.25} className={`${mark} bottom-[clamp(1rem,2.5vw,2rem)] right-[clamp(1rem,2.5vw,2rem)]`} />
    </span>
  );
}

// The opening screen: the framed portrait, the name in huge light capitals,
// a short intro, and where she is based.
export function Hero() {
  return (
    <section aria-label="Introduction" className={`${edge} flex min-h-svh flex-col pb-5 pt-20`}>
      <div className="grid flex-1 grid-cols-1 items-center gap-10 md:grid-cols-2">
        <Reveal className="relative mx-auto aspect-[2/3] w-[min(21rem,62vw)] overflow-hidden">
          <img src={PERSON.portrait} alt="" className="h-full w-full object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-black/25" />
          <Corners />
        </Reveal>
        <Reveal delay={0.1} className="@container flex min-w-0 flex-col">
          {/* Sized to the column, so the longer surname always fits it. */}
          <h1 className={`m-0 text-[min(9.5rem,15cqi)] text-[#e6e6e6] ${display}`}>
            {PERSON.first}
            <br />
            {PERSON.last}
          </h1>
          <p className="m-0 mt-6 max-w-[17rem] self-start indent-8 text-[0.9375rem] font-medium leading-[1.15] text-[#8a8a8a] md:ml-[20%]">
            {PERSON.intro}
          </p>
        </Reveal>
      </div>
      <div className="mt-10 flex items-center justify-between text-[0.9375rem] font-medium text-[#e6e6e6]">
        <span>Based in {PERSON.location}</span>
        <ArrowDown aria-hidden="true" strokeWidth={1.25} className="size-4" />
      </div>
    </section>
  );
}

// A work as a dark image card: its title bottom left, what it involved
// bottom right; the picture eases in under the pointer.
function WorkCard({ work }: { work: Work }) {
  return (
    <Link href={`${BASE}/works/${work.slug}`} className={`${focus} group relative block aspect-[10/11] overflow-hidden bg-[#111] md:aspect-[698/755]`}>
      <img src={work.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-75" />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-[clamp(1rem,1.5vw,1.25rem)] bottom-[clamp(1.5rem,4vw,3.5rem)] flex items-end justify-between gap-6">
        <h3 className="m-0 text-[clamp(1.75rem,2.3vw,2rem)] font-normal leading-none tracking-[-0.04em] text-[#e6e6e6]">{work.title}</h3>
        <p className="m-0 max-w-[13rem] text-[0.875rem] font-semibold leading-[1.15] text-white">{work.tags}</p>
      </div>
    </Link>
  );
}

export function WorkGrid({ works = WORKS }: { works?: Work[] }) {
  return (
    <section aria-label="Works" className={`${edge} grid grid-cols-1 gap-[5px] md:grid-cols-2`}>
      {works.map((work, i) => (
        <Reveal key={work.slug} delay={(i % 2) * 0.08}>
          <WorkCard work={work} />
        </Reveal>
      ))}
    </section>
  );
}

// A page's own title: its name sliding across in huge type.
export function PageTitle({ text }: { text: string }) {
  return (
    <div className="flex min-h-[clamp(20rem,60svh,46rem)] items-end pb-[clamp(1rem,2vw,2rem)] pt-24">
      <h1 className="sr-only">{text}</h1>
      <Marquee text={text.toUpperCase()} className={`w-full text-[clamp(6rem,20vw,19rem)] text-[#e6e6e6] ${display}`} />
    </div>
  );
}

export function About({ more = false }: { more?: boolean }) {
  return (
    <section id="about" aria-label="About" className={`${edge} ${split} scroll-mt-20 py-[clamp(4rem,9vw,8rem)]`}>
      <Reveal>
        <h2 className={label}>About</h2>
      </Reveal>
      <div className="flex flex-col gap-[clamp(3rem,6vw,5rem)]">
        <Reveal className="flex max-w-[44rem] flex-col gap-5">
          {SUMMARY.map((text) => (
            <p key={text} className="m-0 indent-8 text-[clamp(1.25rem,1.9vw,1.6rem)] font-normal leading-[1.2] tracking-[-0.02em] text-[#e6e6e6]">
              {text}
            </p>
          ))}
          {more && (
            <Link href={`${BASE}/about`} className={`${focus} mt-2 inline-flex w-fit items-center gap-2 text-[0.9375rem] font-medium text-[#e6e6e6]`}>
              More about me <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </Reveal>
        <div className="grid grid-cols-[1fr_1fr] items-end gap-[clamp(0.5rem,0.7vw,0.75rem)] md:max-w-[53rem]">
          <Reveal className="aspect-[420/525] overflow-hidden">
            <img src={ABOUT_IMAGES[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
          <Reveal delay={0.1} className="aspect-[420/287] overflow-hidden">
            <img src={ABOUT_IMAGES[1]} alt="" loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section aria-label="Experience" className={`${edge} ${split} py-[clamp(4rem,9vw,8rem)]`}>
      <Reveal>
        <h2 className={label}>Experience</h2>
      </Reveal>
      <div className="flex flex-col">
        {EXPERIENCE.map((job) => (
          <Reveal key={job.company} className="border-t border-white/15 pb-12 pt-8">
            <div className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 ${spaced} text-[#8a8a8a]`}>
              <span>{job.company}</span>
              <span className="md:pr-5">{job.years}</span>
            </div>
            <h3 className={`m-0 mt-5 ${spaced} text-white`}>
              {job.role} <span className="text-[#8a8a8a]">· {job.place}</span>
            </h3>
            <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0 md:pl-8">
              {job.points.map((point) => (
                <li key={point} className="relative pl-4 text-[clamp(1rem,1.25vw,1.125rem)] leading-[1.3] text-[#c9c9c9] before:absolute before:left-0 before:content-['•']">
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" aria-label="Skills" className={`${edge} ${split} scroll-mt-20 py-[clamp(4rem,9vw,8rem)]`}>
      <Reveal className="md:sticky md:top-24 md:self-start">
        <h2 className={label}>Capabilities</h2>
      </Reveal>
      <div className="flex flex-col gap-[clamp(4rem,8vw,7rem)]">
        {SKILLS.map((group) => (
          <Reveal key={group.id} className="grid grid-cols-1 gap-6 lg:grid-cols-[25%_minmax(0,1fr)]">
            <h3 className="m-0 text-[clamp(1.75rem,2.4vw,2rem)] font-normal uppercase leading-none tracking-[-0.04em] text-[#e6e6e6] lg:col-span-2">{group.title}</h3>
            <div className="flex flex-col gap-8 lg:col-start-2">
              <p className="m-0 max-w-[17rem] text-[0.9375rem] font-medium leading-[1.3] text-[#8a8a8a]">{group.text}</p>
              <ul className="m-0 grid max-w-[32rem] list-none grid-cols-1 gap-x-2 p-0 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item} className={`flex min-h-[2.875rem] items-center gap-4 border-b border-white/15 py-2 ${spaced} text-[0.75rem] text-white`}>
                    <SkillIcon name={item} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" aria-label="Education" className="relative scroll-mt-20 px-[clamp(1rem,6vw,5rem)] py-[clamp(6rem,14vw,12rem)]">
      <Corners />
      <Reveal className="mx-auto flex max-w-[40rem] flex-col gap-12">
        <h2 className="m-0 text-[clamp(1.75rem,2.4vw,2rem)] font-normal leading-none tracking-[-0.04em] text-[#e6e6e6]">Education</h2>
        {EDUCATION.map((item) => (
          <div key={item.title} className="flex flex-col gap-2">
            <p className="m-0 text-[clamp(1.125rem,1.4vw,1.25rem)] text-[#e6e6e6]">
              {item.title}, {item.field}
            </p>
            <p className={`m-0 ${spaced} text-[#8a8a8a]`}>{item.school}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

// The light band before the footer: three lines from the CV and a way to talk.
export function Focus() {
  return (
    <section aria-label="Focus" className="relative bg-[#e6e6e3] px-5 py-[clamp(7rem,14vw,12rem)] text-black">
      <Corners dark />
      <Reveal className="flex flex-col items-center text-center">
        <p className={`m-0 ${spaced}`}>( Focus )</p>
        <span aria-hidden="true" className="my-6 h-10 w-px bg-black" />
        <p className="m-0 text-[clamp(1.75rem,2.6vw,2.25rem)] font-normal leading-[1.1] tracking-[-0.03em]">
          Complex products, made clear
          <br />
          Design systems in Figma and code
          <br />
          Accessible by default
        </p>
        <Link href={`${BASE}/contact`} className={`${focus} mt-16 inline-flex items-center gap-3 rounded-full border border-black/15 py-1.5 pl-1.5 pr-7 text-[0.9375rem] font-medium transition-colors hover:bg-black hover:text-white`}>
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-black text-[0.9375rem] font-semibold text-white">
            GK
          </span>
          Let&apos;s talk
        </Link>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const links = [
    { href: PERSON.linkedin, label: "LinkedIn", external: true },
    { href: `mailto:${PERSON.email}`, label: "Mail" },
    { href: PERSON.phoneHref, label: "Phone" },
  ];
  return (
    <footer className="overflow-hidden bg-black pb-8 text-[#e6e6e6]">
      <Marquee text={PERSON.name.toUpperCase()} className={`text-[clamp(6rem,20vw,19rem)] ${display}`} />
      <div className="grid min-h-[clamp(16rem,40svh,34rem)] grid-cols-2">
        <div className={`${edge} flex flex-col justify-end gap-1 text-[0.8125rem] text-[#8a8a8a]`}>
          <span>{PERSON.role}</span>
          <span>{PERSON.location} · {PERSON.work}</span>
        </div>
        <nav aria-label="Contact" className="flex flex-col items-start border-l border-white/60 pl-5 pt-2">
          {links.map((link) => (
            <a key={link.label} href={link.href} {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})} className={`${focus} text-[clamp(1.5rem,2.1vw,1.85rem)] leading-[1.15] text-[#e6e6e6] no-underline hover:text-white`}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export function Contact() {
  return (
    <section aria-label="Contact" className={`${edge} flex min-h-svh flex-col items-center justify-center gap-8 pt-16 text-center`}>
      <h1 className="m-0 text-[clamp(3.5rem,9vw,8.5rem)] font-light leading-none tracking-[-0.05em] text-[#e6e6e6]">Contact me</h1>
      <div className="flex flex-wrap items-center justify-center gap-4 text-[0.9375rem] font-medium text-white">
        <a href={`mailto:${PERSON.email}`} className={`${focus} rounded-full border border-white/40 px-5 py-2 no-underline transition-colors hover:bg-white hover:text-black`}>
          Email
        </a>
        <a href={PERSON.linkedin} target="_blank" rel="noreferrer" className={`${focus} rounded-full border border-white/40 px-5 py-2 no-underline transition-colors hover:bg-white hover:text-black`}>
          LinkedIn
        </a>
        <CopyEmail className="px-3 py-2" />
      </div>
      <p className="m-0 text-[0.9375rem] text-[#8a8a8a]">
        {PERSON.email} · <a href={PERSON.phoneHref} className={`${focus} text-[#8a8a8a] no-underline hover:text-white`}>{PERSON.phone}</a>
      </p>
    </section>
  );
}

// A work's own page: the picture full screen with the title, then what it
// was, the facts, and what was done; the next work at the foot.
export function WorkDetail({ work }: { work: Work }) {
  const next = WORKS[(WORKS.indexOf(work) + 1) % WORKS.length];
  const facts = [
    { label: "Years", value: work.years },
    { label: "Industry", value: work.industry },
    { label: "Services", value: work.tags },
    { label: "Company", value: work.company },
  ];
  return (
    <>
      <section aria-label={work.title} className="relative flex min-h-svh items-end overflow-hidden">
        <img src={work.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <h1 className={`relative m-0 ml-auto px-[clamp(1rem,1.4vw,1.25rem)] pb-[clamp(1.5rem,4vw,3rem)] text-[clamp(3rem,8vw,7.5rem)] font-light leading-none tracking-[-0.05em] text-[#e6e6e6]`}>{work.title}</h1>
      </section>
      <section aria-label="Info" className={`${edge} ${split} py-[clamp(4rem,9vw,8rem)]`}>
        <Reveal>
          <h2 className={label}>Info</h2>
        </Reveal>
        <div className="flex flex-col gap-[clamp(4rem,10vw,10rem)]">
          <Reveal>
            <p className="m-0 indent-[clamp(3rem,9vw,6rem)] text-[clamp(1.75rem,3.3vw,3rem)] font-light leading-[1.05] tracking-[-0.04em] text-[#e6e6e6]">{work.statement}</p>
          </Reveal>
          <Reveal className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:ml-[21%]">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-3">
                <span className={`${spaced} text-[#8a8a8a]`}>{fact.label}</span>
                <span className="max-w-[15rem] text-[1.125rem] leading-[1.2] text-[#e6e6e6]">{fact.value}</span>
              </div>
            ))}
          </Reveal>
          <Reveal className="md:ml-[21%]">
            <span className={`${spaced} text-[#8a8a8a]`}>What I did</span>
            <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
              {work.done.map((point) => (
                <li key={point} className="relative pl-4 text-[clamp(1rem,1.25vw,1.125rem)] leading-[1.3] text-[#c9c9c9] before:absolute before:left-0 before:content-['•']">
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      <section aria-label="Next work" className={`${edge} pb-[clamp(4rem,9vw,8rem)]`}>
        <p className={`m-0 mb-5 ${spaced} text-[#8a8a8a]`}>Next</p>
        <Link href={`${BASE}/works/${next.slug}`} className={`${focus} group relative block aspect-[16/7] overflow-hidden bg-[#111]`}>
          <img src={next.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50 transition-[transform,opacity] duration-700 group-hover:scale-[1.03] group-hover:opacity-65" />
          <span className="absolute bottom-[clamp(1rem,3vw,2.5rem)] left-[clamp(1rem,1.5vw,1.25rem)] text-[clamp(2rem,5vw,4.5rem)] font-light leading-none tracking-[-0.05em] text-[#e6e6e6]">{next.title}</span>
          <ArrowUpRight aria-hidden="true" strokeWidth={1.25} className="absolute right-[clamp(1rem,1.5vw,1.25rem)] top-[clamp(1rem,1.5vw,1.25rem)] size-10 text-[#e6e6e6] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Link>
      </section>
    </>
  );
}
