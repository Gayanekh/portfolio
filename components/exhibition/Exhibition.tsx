"use client";

import { MotionConfig, motion } from "framer-motion";
import About from "@/components/exhibition/About";
import Brush from "@/components/exhibition/Brush";
import Frame from "@/components/exhibition/Frame";
import HangWork, { type Place } from "@/components/exhibition/HangWork";
import Hero from "@/components/exhibition/Hero";
import Showcase from "@/components/exhibition/Showcase";
import { ARTIST, EVENTS, FOOTER, NAV, STORY, VISIT, WORKS, WORKS_SECTION } from "@/components/exhibition/content";
import { handFont, handVariable } from "@/components/exhibition/fonts";
import { caps, plain, prose, say, underline } from "@/components/exhibition/ui";
import { Reveal } from "@/components/landing-next/kit";
import StartAtTop from "@/components/new-landing/StartAtTop";
import { fontVariables } from "@/components/landing-next/fonts";
import { ease, focusRing, shell, space } from "@/components/landing-next/ui";

// The page's colours, as on the Archivio Mario Russo reference: one soft
// neutral black (#141414) behind everything and one white for all the text.
// The shared kit's accent and muted tokens all point at that white, so its
// labels and headlines carry no other colour.
const palette = "[--ink:#141414] [--ink-2:#141414] [--bone:#ffffff] [--bone-2:#1e1e1e] [--iris:#ffffff] [--iris-deep:#ffffff] [--peach:#ffffff] [--mist:#ffffff]";

// The hang: each work's place on a twelve-column wall (span and start), its
// shape and how far it drops, so the works sit at uneven heights and sizes
// like objects in a room (the Archivio reference), each with its label.
const HANG: Place[] = [
  { col: "lg:col-span-4 lg:col-start-1", shape: "aspect-[3/4]", drop: "lg:mt-0" },
  { col: "lg:col-span-3 lg:col-start-6", shape: "aspect-[4/5]", drop: "lg:mt-[14vw]" },
  { col: "lg:col-span-3 lg:col-start-10", shape: "aspect-square", drop: "lg:mt-[5vw]" },
  { col: "lg:col-span-3 lg:col-start-2", shape: "aspect-square", drop: "lg:mt-[6vw]" },
  { col: "lg:col-span-5 lg:col-start-6", shape: "aspect-[4/3]", drop: "lg:mt-[2vw]" },
  { col: "lg:col-span-3 lg:col-start-1", shape: "aspect-[4/5]", drop: "lg:mt-[4vw]" },
  { col: "lg:col-span-4 lg:col-start-5", shape: "aspect-[3/2]", drop: "lg:mt-[12vw]" },
  { col: "lg:col-span-3 lg:col-start-10", shape: "aspect-[3/4]", drop: "lg:mt-[1vw]" },
];

// "Exhibition": a template example for one artist's show, made from the
// /new-landing ("Exhibit") hero, set in the Archivio Mario Russo reference's
// calm voice: one colour, small capitals and serif italic, the signature as
// the logo, the artist's words, the scattered hang and a quiet contact block.
// From Painted Sky: the painting settling into its frame and museum labels.
// A brush follows the pointer. Visual only: links stay on the page.
export default function Exhibition() {
  return (
    <MotionConfig reducedMotion="user">
      <div data-site-scale className={`relative min-h-screen overflow-x-clip bg-[var(--ink)] font-sans text-[var(--bone)] antialiased ${palette} ${fontVariables} ${handVariable}`}>
        {/* A refresh opens the page at the hero, not where it was left. */}
        <StartAtTop />
        <Brush />

        {/* The bar: the artist's signature and the show's sections. */}
        <header className="fixed inset-x-0 top-0 z-50">
          <nav aria-label="Sections" className={`${shell} mt-4 flex h-14 items-center justify-between gap-6 rounded-full border border-solid border-white/10 bg-[rgb(20_20_20/0.6)] px-5 backdrop-blur-xl`}>
            <a href="#top" aria-label={`${ARTIST.name}, ${ARTIST.show}`} className={`${focusRing} rounded ${handFont} text-[1.9rem] leading-none text-[var(--bone)] no-underline`}>
              {ARTIST.signature}
            </a>
            <ul className="m-0 hidden list-none gap-1 p-0 sm:flex">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={`${focusRing} block rounded-full px-3.5 py-1.5 text-[0.875rem] text-[var(--bone)] no-underline transition-colors hover:bg-white/10 hover:text-[var(--bone)]`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="relative z-10">
          <Hero />
          <Frame />
          <About />

          <section id="works" aria-labelledby="ex-works-title" className={`relative ${space} scroll-mt-20`}>
            <div className={`${shell} flex flex-col gap-[clamp(3rem,6vw,5rem)]`}>
              <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
                <div className="flex flex-col gap-5">
                  <p className={`m-0 ${caps}`}>{WORKS_SECTION.label}</p>
                  <h2 id="ex-works-title" className={`max-w-[22ch] ${say}`}>
                    {plain(WORKS_SECTION.title)}
                  </h2>
                </div>
                <p className={`max-w-[24rem] ${prose}`}>{WORKS_SECTION.text}</p>
              </Reveal>

              {/* The scattered hang, each work with its museum label. */}
              <ul className="m-0 grid list-none grid-cols-2 gap-x-[clamp(0.75rem,1.6vw,1.75rem)] gap-y-[clamp(2rem,4vw,3rem)] p-0 lg:grid-cols-12 lg:items-start">
                {WORKS.map((work, i) => (
                  <HangWork key={work.id} work={work} place={HANG[i]} index={i} />
                ))}
              </ul>
            </div>
          </section>

          {/* The artist: the studio in black and white beside one column that
              holds her words line by line, the signature, a short biography
              and one link; then the three rooms as a quiet list. */}
          <section id="story" aria-label="The artist and the show" className={`relative ${space} scroll-mt-20`}>
            <div className={`${shell} flex flex-col items-center gap-[clamp(4rem,8vw,7rem)]`}>
              <div className="grid w-full gap-[clamp(2.5rem,6vw,7rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
                <motion.figure
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 1.1, ease }}
                  className="m-0 flex flex-col gap-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- a free sample image */}
                  <img src={STORY.studio.image} alt={STORY.studio.alt} loading="lazy" className="block aspect-square w-full object-cover grayscale" />
                  <figcaption className={caps}>{STORY.studio.caption}</figcaption>
                </motion.figure>

                <div className="flex max-w-[34rem] flex-col gap-[clamp(2.5rem,4vw,3.5rem)]">
                  <figure className="m-0 flex flex-col gap-6">
                    <blockquote className="m-0">
                      {STORY.quote.map((line, i) => (
                        <motion.span
                          key={line}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1 - i * 0.17, y: 0 }}
                          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                          transition={{ duration: 1, ease, delay: i * 0.12 }}
                          className={`block ${say}`}
                        >
                          {line}
                        </motion.span>
                      ))}
                    </blockquote>
                    <figcaption className="flex flex-col items-start gap-3">
                      <span className={`${handFont} text-[2.25rem] leading-none text-[var(--bone)]`}>{ARTIST.signature}</span>
                      <span className={caps}>{STORY.quoteBy}</span>
                    </figcaption>
                  </figure>

                  <Reveal delay={0.15} className="flex flex-col items-start gap-8 border-0 border-t border-solid border-white/15 pt-[clamp(2rem,3vw,2.5rem)]">
                    <p className={`max-w-[28rem] ${prose}`}>{STORY.bio}</p>
                    <a href={STORY.link.href} className={underline}>
                      {STORY.link.label}
                    </a>
                  </Reveal>
                </div>
              </div>

              <div className="flex w-full flex-col gap-8">
                <p className={`m-0 text-center ${caps}`}>{STORY.label}</p>
                <ol className="m-0 grid list-none gap-[clamp(2rem,4vw,4rem)] p-0 lg:grid-cols-3">
                  {STORY.rooms.map((room, i) => (
                    <Reveal key={room.name} delay={i * 0.1} className="flex flex-col items-center gap-4 border-0 border-t border-solid border-white/15 pt-8 text-center">
                      <span className={caps}>{room.name}</span>
                      <h3 className={say}>{room.title}</h3>
                      <p className={`max-w-[22rem] ${prose}`}>{room.text}</p>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <Showcase />

          {/* Visit and contact, as the Archivio reference's "Contatti": one
              quiet block with where and when, the studio's address and the
              talks as a short list. */}
          <section id="visit" aria-labelledby="ex-visit-title" className={`${space} scroll-mt-20`}>
            <div className={`${shell} grid gap-[clamp(3rem,6vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]`}>
              <Reveal className="flex flex-col gap-5">
                <p className={`m-0 ${caps}`}>{VISIT.label}</p>
                <h2 id="ex-visit-title" className={`max-w-[14ch] ${say}`}>
                  {VISIT.title}
                </h2>
              </Reveal>

              <div className="flex flex-col gap-[clamp(3rem,5vw,4.5rem)]">
                <dl className="m-0 grid gap-8 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {VISIT.details.map((detail, i) => (
                    <Reveal key={detail.label} delay={i * 0.08} className="flex flex-col gap-3">
                      <dt className={caps}>{detail.label}</dt>
                      <dd className={`${prose} text-[0.9375rem]`}>{detail.text}</dd>
                    </Reveal>
                  ))}
                </dl>

                <Reveal className="flex flex-col items-start gap-4">
                  <span className={caps}>{VISIT.contact.label}</span>
                  <span className={say}>{VISIT.contact.email}</span>
                </Reveal>

                {/* Talks and openings, as a list. */}
                <div className="flex flex-col gap-4">
                  <p className={`m-0 ${caps}`}>{EVENTS.label}</p>
                  <ul className="m-0 list-none border-0 border-t border-solid border-white/15 p-0">
                    {EVENTS.items.map((event, i) => (
                      <motion.li
                        key={event.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                        transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                        className="flex flex-col gap-1 border-0 border-b border-solid border-white/15 py-5"
                      >
                        <span className={say}>{event.title}</span>
                        <span className="text-[0.875rem]">
                          {event.day} · {event.place}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className={`relative z-10 ${shell} flex flex-col items-center gap-3 border-0 border-t border-solid border-white/10 py-6 text-[0.8125rem] sm:flex-row sm:justify-between`}>
          <span className={`${handFont} text-[1.75rem] leading-none text-[var(--bone)]`}>{ARTIST.signature}</span>
          <span>
            {FOOTER.year} · {FOOTER.note}
          </span>
        </footer>
      </div>
    </MotionConfig>
  );
}
