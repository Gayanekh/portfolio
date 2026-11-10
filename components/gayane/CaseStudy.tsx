"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CASES, caseUrl, type Case } from "@/components/gayane/cases";

// One project's page. It takes its animation from samrichmond.framer.website's case pages
// (read from their code): every block rises 40px out of nothing on a spring with no bounce
// over 1.2s, the blocks of a group one after another 60ms apart; and its order from them
// too: the title and the facts about the project, the big picture, then sections that each
// have a small label on the left and the text on the right, the figures, and the next
// project. The pictures are laid out as on Pulvinar's project pages (the user asked): one
// big picture with a phone beside it, then the pictures she adds, one wide and then in pairs.
const SPRING = { type: "spring", bounce: 0, duration: 1.2 } as const;
const wrap = "mx-auto w-full max-w-[1240px] px-[clamp(1.25rem,4vw,3rem)]";
const label = "m-0 font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]";
const body = "font-[family-name:var(--font-ui)] text-[clamp(1rem,1.25vw,1.1875rem)] leading-[1.5] tracking-[-0.01em] text-[#efefed]/85";

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ ...SPRING, delay }} className={className}>
      {children}
    </motion.div>
  );
}

// The project's own page, live, in a phone. So that it shrinks and grows with the picture beside it, the
// phone has seven steps by the width of the panel it sits in (a container query), from 120px to 280px
// wide. On phones, in the slider, it is 200px (max-md, so the steps do not touch it: there is no
// container there). The page inside is laid out at phone width (390px) and scaled down to the phone's
// screen (its width less the 12px border, over 390); the iframe is 15px wider, so its scrollbar falls
// outside the clipped screen. It is a picture here, not a page: no scrolling, touches or focus.
function Phone({ href, name, image }: { href: string; name: string; image?: string }) {
  return (
    <div className="relative h-[246px] w-[120px] shrink-0 overflow-hidden rounded-[1.5rem] border-[6px] border-solid border-[#2a2b2f] bg-[#0d0e10] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] max-md:h-[419px] max-md:w-[200px] @[225px]:h-[289px] @[225px]:w-[140px] @[255px]:h-[332px] @[255px]:w-[160px] @[285px]:h-[376px] @[285px]:w-[180px] @[315px]:h-[419px] @[315px]:w-[200px] @[365px]:h-[505px] @[365px]:w-[240px] @[430px]:h-[592px] @[430px]:w-[280px]">
      {image ? (
        <Image src={image} alt={`${name} on a phone`} fill sizes="280px" className="object-cover" />
      ) : (
        <iframe src={href} title={`${name} on a phone`} loading="lazy" inert scrolling="no" className="absolute left-0 top-0 h-[845px] w-[405px] origin-top-left scale-[0.2769] border-0 bg-white max-md:scale-[0.4821] @[225px]:scale-[0.3282] @[255px]:scale-[0.3795] @[285px]:scale-[0.4308] @[315px]:scale-[0.4821] @[365px]:scale-[0.5846] @[430px]:scale-[0.6872]" />
      )}
    </div>
  );
}

// The big picture and the project on a phone. From 768px up they sit side by side, as on Pulvinar's
// project pages; on phones they are a slider (the user asked): the picture, then the phone as the
// next slide, swiped sideways (scroll snapping), keeping the page's side spaces, the 16px between
// the slides and the rounded corners. A dot for each slide sits under it, and previous and next
// buttons come up over it when the pointer is on it.
function Media({ item }: { item: Case }) {
  const track = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const last = 1;
  const go = (index: number) => track.current?.children[index]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  const arrow = "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-[4px] border-0 bg-[#efefed] text-[#16171a] opacity-0 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] transition-opacity duration-300 focus-visible:opacity-100 group-hover/slider:opacity-100 md:hidden";
  return (
    <Reveal>
      <div className="group/slider relative">
        <div
          ref={track}
          onScroll={(event) => setSlide(Math.round(event.currentTarget.scrollLeft / (event.currentTarget.clientWidth + 16)))}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-12 md:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          <div className={`relative h-[460px] w-full shrink-0 snap-start overflow-hidden rounded-[1.25rem] bg-[#1f2024] md:col-span-8 md:h-auto ${item.ratio}`}>
            <Image src={item.image} alt={`The ${item.title} page`} fill priority sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
          </div>
          <div className="flex h-[460px] w-full shrink-0 snap-start items-center justify-center rounded-[1.25rem] bg-[#1f2024] md:col-span-4 md:h-auto md:p-4 md:@container">
            <Phone href={item.phone} name={item.title} image={item.mobileImage} />
          </div>
        </div>
        {slide > 0 && (
          <button type="button" aria-label="Previous" onClick={() => go(slide - 1)} className={`${arrow} left-3`}>
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </button>
        )}
        {slide < last && (
          <button type="button" aria-label="Next" onClick={() => go(slide + 1)} className={`${arrow} right-3`}>
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </button>
        )}
      </div>
      <div className="mt-4 flex justify-center gap-2 md:hidden">
        {["The page", "On a phone"].map((name, index) => (
          <button key={name} type="button" aria-label={name} aria-current={slide === index} onClick={() => go(index)} className={`size-2 cursor-pointer rounded-full border-0 p-0 transition-colors duration-300 ${slide === index ? "bg-[#c6f36b]" : "bg-[#efefed]/30"}`} />
        ))}
      </div>
    </Reveal>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-5 border-0 border-t border-solid border-[rgb(239_239_237/0.14)] py-[clamp(2rem,4vw,3.5rem)] md:grid-cols-12 md:gap-8">
      <Reveal className="md:col-span-4">
        <p className={`${label} max-md:font-[family-name:var(--gk-display)] max-md:text-[clamp(1.5rem,6.5vw,2rem)] max-md:font-light max-md:normal-case max-md:leading-[1.1] max-md:tracking-[-0.03em] max-md:text-[#efefed]`}>
          <span className="max-md:hidden">{index} — </span>
          {title}
        </p>
      </Reveal>
      <div className="flex flex-col gap-5 md:col-span-8">{children}</div>
    </section>
  );
}

export default function CaseStudy({ item }: { item: Case }) {
  const at = CASES.findIndex((entry) => entry.slug === item.slug);
  const next = CASES[(at + 1) % CASES.length];
  const meta = [
    { label: "Type", value: item.kind },
    { label: "Role", value: item.role },
    { label: "Year", value: item.year },
    { label: "Tags", value: item.tags },
  ];
  const more = item.images ?? [];

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen overflow-x-clip bg-[#16171a] pb-[clamp(3rem,6vw,5rem)] text-[#efefed]">
        {/* The top bar, pinned as the page scrolls: back to the portfolio on the left; on the right the
            project's place in the gallery and Show preview (a light outline, lime on hover), which opens its live page in a new tab. */}
        <div className="sticky top-0 z-40 bg-[#16171a]/75 backdrop-blur-xl">
          <header className={`${wrap} flex h-16 items-center justify-between gap-6`}>
            <Link href="/gayane-khachatryan" aria-label="Gayane Khachatryan, back to the portfolio" className="font-[family-name:var(--gk-display)] text-[1.125rem] font-medium tracking-[0.04em] text-[#efefed] no-underline transition-colors duration-300 hover:text-[#c6f36b]">
              GK
            </Link>
            <div className="flex items-center gap-5">
              <span className={`${label} tabular-nums max-sm:hidden`}>
                {String(at + 1).padStart(2, "0")} / {String(CASES.length).padStart(2, "0")}
              </span>
              <a href={item.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-[4px] border border-solid border-[rgb(239_239_237/0.3)] px-3.5 py-2 font-[family-name:var(--font-ui)] text-[13px] font-medium text-[#efefed] no-underline transition-colors duration-300 hover:border-[#c6f36b] hover:text-[#c6f36b]">
                Show preview
                <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              </a>
            </div>
          </header>
        </div>

        {/* The title and the facts about the project. */}
        <div className={`${wrap} pt-[clamp(2.5rem,7vw,6rem)]`}>
          <Reveal>
            <p className={`${label} flex items-center gap-2 !text-[#c6f36b]`}>
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#c6f36b]" />
              {item.category}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="m-0 mt-5 font-[family-name:var(--gk-display)] text-[clamp(2.75rem,9vw,7.5rem)] font-light leading-[0.95] tracking-[-0.05em]">{item.title}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className={`${body} m-0 mt-6 max-w-[40rem] !text-[#efefed]/70`}>{item.subtitle}</p>
          </Reveal>
          <dl className="m-0 mt-[clamp(2rem,5vw,4rem)] grid grid-cols-2 gap-x-6 gap-y-6 border-0 border-t border-solid border-[rgb(239_239_237/0.14)] pt-6 md:grid-cols-4">
            {meta.map((entry, i) => (
              <Reveal key={entry.label} delay={0.18 + i * 0.06}>
                <dt className={label}>{entry.label}</dt>
                <dd className="m-0 mt-2 font-[family-name:var(--font-ui)] text-[14px] leading-[1.4] text-[#efefed]">{entry.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        {/* The big picture and the project on a phone: side by side, or a slider on phones. */}
        <div className={`${wrap} mt-[clamp(2.5rem,5vw,4rem)]`}>
          <Media item={item} />
        </div>

        {/* Sections: a small label on the left, the text on the right. */}
        <div className={`${wrap} mt-[clamp(3rem,7vw,6rem)]`}>
          <Section index="01" title="About">
            {item.about.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={`${body} m-0`}>{paragraph}</p>
              </Reveal>
            ))}
          </Section>
          <Section index="02" title="Where it comes from">
            {item.origin.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={`${body} m-0`}>{paragraph}</p>
              </Reveal>
            ))}
          </Section>
          <Section index="03" title="What is inside">
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {item.inside.map((line, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <li className={`${body} flex gap-3`}>
                    <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-[#c6f36b]" />
                    {line}
                  </li>
                </Reveal>
              ))}
            </ul>
          </Section>
          {item.status && (
            <Section index="04" title="Status">
              {item.status.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className={`${body} m-0`}>{paragraph}</p>
                </Reveal>
              ))}
            </Section>
          )}
        </div>

        {/* The pictures she adds: one wide, then in pairs. */}
        {more.length > 0 && (
          <div className={`${wrap} mt-[clamp(2rem,4vw,3rem)] grid gap-4 md:grid-cols-2`}>
            {more.map((src, i) => (
              <Reveal key={src} className={i === 0 ? "md:col-span-2" : ""}>
                <div className={`relative w-full overflow-hidden rounded-[6px] bg-[#1f2024] ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <Image src={src} alt={`${item.title}, picture ${i + 1}`} fill sizes={i === 0 ? "100vw" : "50vw"} className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* The figures. */}
        <div className={`${wrap} mt-[clamp(2.5rem,5vw,4rem)]`}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[6px] bg-[rgb(239_239_237/0.14)] md:grid-cols-4">
            {item.facts.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 0.06} className="bg-[#16171a] p-[clamp(1.25rem,2.4vw,2rem)]">
                <p className={`m-0 font-[family-name:var(--gk-display)] text-[clamp(1.5rem,2.8vw,2.5rem)] font-light leading-none tracking-[-0.04em] ${/^[0-9]/.test(fact.value) ? "text-[#c6f36b]" : "text-[#efefed]"}`}>{fact.value}</p>
                <p className={`${label} mt-3 !normal-case !tracking-[0.02em]`}>{fact.label}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* The next project. */}
        <div className={`${wrap} mt-[clamp(4rem,9vw,8rem)]`}>
          <Reveal>
            <Link href={caseUrl(next.slug)} className="group block border-0 border-t border-solid border-[rgb(239_239_237/0.14)] pt-8 text-[#efefed] no-underline">
              <p className={label}>Next project</p>
              <span className="mt-4 flex items-end justify-between gap-6">
                <span className="font-[family-name:var(--gk-display)] text-[clamp(2rem,7vw,5.5rem)] font-light leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-[#c6f36b]">{next.title}</span>
                <ArrowUpRight aria-hidden="true" className="mb-2 size-[clamp(1.75rem,4vw,3.5rem)] shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#c6f36b]" strokeWidth={1.25} />
              </span>
            </Link>
          </Reveal>
          <p className={`${label} mt-[clamp(3rem,6vw,5rem)] !normal-case !tracking-[0.02em]`}>© 2026 Gayane Khachatryan</p>
        </div>
      </main>
    </MotionConfig>
  );
}
