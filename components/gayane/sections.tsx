"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BASE, CONTACT, EXPERTISE, FAQS, HERO, PERSON, PROCESS, SERVICES, WORKS } from "@/components/gayane/content";
import { AVATAR, button, ConnectCard, display, frame, Letters, link, PlusSquare, Pop, Rise, type, WorkCard } from "@/components/gayane/kit";
import { focusRing } from "@/components/template-landing/ui";

const still = { duration: 0 };

// The hero, held still while the page slides up over it: the headline in the
// reference's three sizes, See work, what Gayane does and Connect. Behind it, as the
// reference's portrait, Gayane's own photo close up in black and white (the user asked)
// under a dark veil (darker than the reference's 52%: the photo is lighter), deepest at the foot, settling from 120% on load.
export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section aria-label="Introduction" className="sticky top-0 z-0 h-svh min-h-[40rem] overflow-hidden">
      <motion.span aria-hidden="true" initial={{ transform: "scale(1.2)" }} animate={{ transform: "scale(1)" }} transition={reduced ? still : { duration: 1.5, ease: [0.44, 0, 0.56, 1] }} className="absolute inset-0 block">
        <Image src={AVATAR} alt="" fill priority sizes="100vw" className="object-cover object-[60%_22%] grayscale lg:object-[50%_24%]" />
      </motion.span>
      <span aria-hidden="true" className="absolute inset-0 block bg-[rgb(22_23_26/0.6)] bg-[image:linear-gradient(0deg,rgb(22_23_26/0.85)_0%,transparent_40%),linear-gradient(90deg,rgb(22_23_26/0.35)_0%,transparent_60%)]" />

      <div className={`relative flex h-full flex-col justify-between pb-10 pt-[clamp(6.5rem,13vw,11.5rem)] ${frame}`}>
        <div>
          <Rise>
            <h1 className={type.hero}>
              <span className="flex flex-wrap items-end">
                {HERO.big}
                <span className={`${display} mb-[0.3em] text-[length:clamp(1.25rem,2.8vw,2.5rem)] font-normal leading-[1.3] tracking-normal`}>{HERO.small}</span>
              </span>
              <span className="block text-[length:clamp(3.25rem,7.6vw,6.875rem)] leading-[1.1] tracking-normal">{HERO.large}</span>
            </h1>
          </Rise>
          <Rise delay={0.15} className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Link href={`${BASE}/work`} className={button}>
              {HERO.cta}
            </Link>
            <p className={`m-0 max-w-[26rem] text-[var(--dim)] ${type.body}`}>{HERO.intro}</p>
          </Rise>
        </div>

        <Rise delay={0.3} className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-[27rem]">
            <h2 className="m-0 text-[length:clamp(1.25rem,1.7vw,1.5rem)] font-semibold tracking-[-0.02em]">What I do</h2>
            <ul className="m-0 mt-4 list-none p-0">
              {SERVICES.map((service, i) => (
                <li key={service} className={`flex justify-between border-0 border-b border-dashed border-[var(--line)] py-2 uppercase ${i === 0 ? "" : "text-[#afafaf]"}`}>
                  <span>/ {service}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
          </div>
          <ConnectCard />
        </Rise>
      </div>
    </section>
  );
}

// A section's title: the letters spelling in, and on the right an optional link.
function SectionHead({ title, accent, note, more }: { title: string; accent?: string[]; note?: string; more?: { href: string; label: string } }) {
  return (
    <div className="mb-[clamp(2.5rem,6vw,5.5rem)] flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className={`${type.heading} uppercase`}>
          <Letters text={title} accent={accent} />
        </h2>
        {note && <p className={`m-0 mt-4 max-w-[26rem] text-[var(--dim)] ${type.body}`}>{note}</p>}
      </div>
      {more && (
        <Link href={more.href} className={`${link} flex w-fit items-center gap-2 border-0 border-b border-solid border-[var(--accent)] pb-2 text-[1.25rem]`}>
          {more.label}
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      )}
    </div>
  );
}

// The projects in two columns, the right one starting lower, as in the reference.
export function Works({ limit, title = "Selected works", more = true }: { limit?: number; title?: string; more?: boolean }) {
  const works = WORKS.slice(0, limit);
  const columns = [works.filter((_, i) => i % 2 === 0), works.filter((_, i) => i % 2 === 1)];
  return (
    <section aria-label={title} className={`py-[clamp(5rem,10vw,9rem)] ${frame}`}>
      <SectionHead title={title} more={more ? { href: `${BASE}/work`, label: "View works" } : undefined} />
      <div className="grid gap-x-5 gap-y-14 lg:grid-cols-2">
        {columns.map((column, c) => (
          <div key={c} className={`flex flex-col gap-14 lg:gap-28 ${c === 1 ? "lg:pt-[clamp(6rem,14vw,14rem)]" : ""}`}>
            {column.map((work) => (
              <WorkCard key={work.name} work={work} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// Expertise: rows of cards that sharpen and grow into place with the scroll (globals.css,
// .gk-stack); one open at a time, its line and tags beside its name.
export function Expertise() {
  const [open, setOpen] = useState(0);
  return (
    <section aria-label="My expertise" className={`py-[clamp(5rem,10vw,9rem)] ${frame}`}>
      <SectionHead title="My expertise" accent={["expertise"]} note="Complex products, made calm: how I work across design, systems and code." />
      <div className="flex flex-col gap-6">
        {EXPERTISE.map((item, i) => {
          const wide = open === i;
          return (
            <div key={item.name} className="gk-stack rounded-[8px] bg-[var(--card)]">
              <h3 className="m-0">
                <button type="button" aria-expanded={wide} aria-controls={`gk-skill-${i}`} onClick={() => setOpen(wide ? -1 : i)} className={`${focusRing} flex w-full cursor-pointer items-center gap-4 rounded-[8px] border-0 bg-transparent p-[clamp(1rem,1.8vw,1.5rem)] text-left text-[var(--fg)]`}>
                  <span className={`${display} text-[1.5rem] text-[var(--dim)]`}>0{i + 1}.</span>
                  <span className={`${type.title} flex-1`}>{item.name}</span>
                  <PlusSquare open={wide} />
                </button>
              </h3>
              <div id={`gk-skill-${i}`} inert={!wide} className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${wide ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="grid gap-6 px-[clamp(1rem,1.8vw,1.5rem)] pb-[clamp(1.25rem,2vw,1.75rem)] lg:grid-cols-2">
                    <span aria-hidden="true" className="max-lg:hidden" />
                    <div>
                      <p className={`m-0 text-[var(--dim)] ${type.body}`}>{item.text}</p>
                      <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                        {item.tags.map((tag) => (
                          <li key={tag} className="rounded-[4px] border border-solid border-[var(--line)] px-3 py-1.5 text-[0.875rem] text-[var(--dim)]">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// The process, held on screen while the page scrolls through its four steps: the
// count, the step's panel rising in, and the four names with this one in the accent
// colour. On phones and tablets the steps simply follow one another.
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.min(PROCESS.length - 1, Math.max(0, Math.floor(p * PROCESS.length)))));
  const count = String(PROCESS.length).padStart(2, "0");
  return (
    <section ref={ref} aria-label="The process" className="lg:h-[400svh]">
      <div className={`py-[clamp(5rem,10vw,9rem)] lg:sticky lg:top-24 lg:flex lg:h-[calc(100svh_-_6rem)] lg:flex-col lg:justify-center lg:py-0 ${frame}`}>
        <h2 className={`${type.heading} uppercase lg:hidden`}>
          <Letters text="The process" accent={["process"]} />
        </h2>
        <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)_minmax(0,1.6fr)] gap-8 lg:grid">
          <p aria-live="polite" className={`${display} m-0 text-[length:clamp(3rem,5vw,4.5rem)] font-medium leading-[1.2]`}>
            <span className="text-[var(--accent)]">{String(step + 1).padStart(2, "0")}</span>/{count}
          </p>
          <div className="relative aspect-[597/571] max-h-[calc(100svh_-_12rem)] overflow-hidden rounded-[8px] bg-[var(--card)]">
            <AnimatePresence initial={false}>
              <motion.div key={step} initial={{ opacity: 0, transform: "translateY(12rem)" }} animate={{ opacity: 1, transform: "translateY(0rem)" }} exit={{ opacity: 0 }} transition={reduced ? still : { type: "spring", duration: 1.2, bounce: 0 }} className="absolute inset-0 flex flex-col justify-between p-[clamp(1.5rem,2.6vw,2.5rem)]">
                <span className={`${display} text-[length:clamp(6rem,13vw,12rem)] font-medium leading-none tracking-[-0.04em] text-[var(--accent)]`}>{String(step + 1).padStart(2, "0")}</span>
                <span>
                  <span className={`${type.title} block`}>{PROCESS[step].title}</span>
                  <span className={`mt-3 block max-w-[24rem] text-[var(--dim)] ${type.body}`}>{PROCESS[step].text}</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <ol className="m-0 flex list-none flex-col justify-end gap-6 p-0">
            {PROCESS.map((item, i) => (
              <li key={item.title} className={`transition-[color,font-size] duration-500 ${i === step ? "text-[1.75rem] text-[var(--accent)]" : "text-[1.25rem] text-[var(--fg)]"}`}>
                {item.title}
              </li>
            ))}
          </ol>
        </div>
        <ol className="m-0 mt-10 flex list-none flex-col gap-4 p-0 lg:hidden">
          {PROCESS.map((item, i) => (
            <li key={item.title}>
              <Pop className="rounded-[8px] bg-[var(--card)] p-5">
                <span className={`${display} text-[2.5rem] font-medium text-[var(--accent)]`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`${type.title} mt-2 block`}>{item.title}</span>
                <span className={`mt-2 block text-[var(--dim)] ${type.body}`}>{item.text}</span>
              </Pop>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FIELD = `${focusRing} w-full rounded-[2px] border border-solid border-[var(--line)] bg-[rgb(22_23_26/0.6)] px-4 py-3 text-[1rem] text-[var(--fg)] placeholder:text-[var(--dim)] focus:border-[var(--fg)]`;
const LABEL = "flex flex-col gap-3 text-[1.125rem] font-bold tracking-[-0.02em]";

// "Let's Work Together.": the title and Connect on the left, the form on the right.
// There is no mail service behind the site, so sending opens the visitor's email app
// with the message written out.
export function ContactSection() {
  const [sent, setSent] = useState(false);
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = `${data.get("first")} ${data.get("last")}`.trim();
    const body = `${data.get("message")}\n\n${name}\n${data.get("email")}`;
    window.location.href = `mailto:${PERSON.email}?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <section aria-label="Contact" className="relative overflow-hidden bg-[var(--card)] py-[clamp(5rem,10vw,9rem)]">
      <span aria-hidden="true" className="absolute inset-0 block bg-[radial-gradient(50%_60%_at_85%_20%,rgb(198_243_107/0.1),transparent_70%)]" />
      <div className={`relative grid gap-12 lg:grid-cols-2 ${frame}`}>
        <div className="flex flex-col justify-between gap-10">
          <div>
            <h2 className={type.heading}>
              <Letters text={CONTACT.lead} />
              <span className="block text-[var(--accent)]">
                <Letters text={CONTACT.soft} />
              </span>
            </h2>
            <p className={`m-0 mt-6 text-[var(--dim)] ${type.body}`}>{CONTACT.text}</p>
          </div>
          <Pop>
            <ConnectCard />
          </Pop>
        </div>
        <Pop>
          <form onSubmit={send} className="flex flex-col gap-7 rounded-[4px] bg-[rgb(22_23_26/0.55)] p-[clamp(1.25rem,2.2vw,2rem)]">
            <div className="grid gap-7 sm:grid-cols-2">
              <label className={LABEL}>
                <span>
                  First Name <span aria-hidden="true">*</span>
                </span>
                <input name="first" autoComplete="given-name" placeholder="First Name" required className={FIELD} />
              </label>
              <label className={LABEL}>
                <span>
                  Last Name <span aria-hidden="true">*</span>
                </span>
                <input name="last" autoComplete="family-name" placeholder="Last Name" required className={FIELD} />
              </label>
            </div>
            <label className={LABEL}>
              <span>
                Email <span aria-hidden="true">*</span>
              </span>
              <input name="email" type="email" autoComplete="email" placeholder="Enter your email" required className={FIELD} />
            </label>
            <label className={LABEL}>
              <span>
                Message <span aria-hidden="true">*</span>
              </span>
              <textarea name="message" rows={5} placeholder="Leave your message" required className={`${FIELD} resize-y`} />
            </label>
            <button type="submit" className={`${button} !h-14 !w-full`}>
              Send message
            </button>
            <p aria-live="polite" className={`m-0 text-[var(--dim)] ${type.small}`}>
              {sent ? `Nothing opened? Write to ${PERSON.email}.` : "This opens your email app."}
            </p>
          </form>
        </Pop>
      </div>
    </section>
  );
}

// The questions: the title on the left, one answer open at a time on the right.
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section aria-label="Frequently asked questions" className={`py-[clamp(5rem,10vw,9rem)] ${frame}`}>
      <h2 className={type.heading}>
        <Letters text="Frequently" />
        <Letters text="Asked Questions" accent={["Questions"]} />
      </h2>
      <div className="mt-[clamp(2.5rem,6vw,5.5rem)] flex flex-col gap-4 lg:ml-auto lg:w-[67%]">
        {FAQS.map((faq, i) => {
          const wide = open === i;
          return (
            <div key={faq.question} className="gk-stack rounded-[6px] bg-[var(--card)]">
              <h3 className="m-0">
                <button type="button" aria-expanded={wide} aria-controls={`gk-faq-${i}`} onClick={() => setOpen(wide ? -1 : i)} className={`${focusRing} flex w-full cursor-pointer items-center justify-between gap-4 rounded-[6px] border-0 bg-transparent p-5 text-left text-[length:clamp(1.125rem,1.6vw,1.5rem)] font-semibold tracking-[-0.03em] text-[var(--fg)]`}>
                  {faq.question}
                  <PlusSquare open={wide} />
                </button>
              </h3>
              <div id={`gk-faq-${i}`} inert={!wide} className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${wide ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className={`m-0 max-w-[48rem] px-5 pb-5 text-[var(--dim)] ${type.body}`}>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
