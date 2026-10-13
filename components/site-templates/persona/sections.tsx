"use client";

import {
  ArrowButton,
  ArrowLead,
  Band,
  Body,
  Chapter,
  Columns,
  FieldLink,
  Media,
  Portrait,
  PosterTitle,
  Reveal,
  RoundLink,
  Row,
  Section,
  Stack,
} from "../core/blocks";
import { NoteTiles, PinnedIndex, ScrollText, ServiceCards } from "../core/interactive";
import { ProjectSlide, type ProjectShape } from "../core/ProjectSlides";
import SectionLabel from "../core/SectionLabel";
import PosterHero from "../sections/PosterHero";
import SideRail from "../sections/SideRail";
import { EXPERIENCE, INFO, PROJECTS, SERVICES, SKILLS, SOCIALS, TAGS, WAYS } from "./shared";

// The Persona template's sections: a bold, editorial personal portfolio in
// the look of a fashion poster.
// Built from the kit's blocks only; each `field` is a text or image address
// of the section (see the defaults in index.ts).

export function Header() {
  return <SideRail />;
}

// The first page, a fashion poster: the disciplines and a figure, the name
// huge, the tagline and Discover more (which glides down to About), beside a
// black-and-white portrait crossed by an accent band.
export function Hero() {
  return <PosterHero tags={TAGS} moreTarget="about" />;
}

// About, before Contact, in the hero's poster look, without labels: the title
// and a portrait (black and white until pointed at) beside the profile's first
// sentence, lighting up word by word as it is read, its key phrases marked in
// the accent; the rest as tiles with large accent numbers, turning to the
// accent when pointed at; then the work experience on a dark screen pinned
// while the page scrolls: at first only its title, then the roles
// sliding in from the right one by one, each with its line (and back out to
// the right, scrolling up), the others fading back from the one pointed at.
// A small bar pinned at the top names the part in view.
export function About() {
  return (
    <Section spacing="start" gutter="rail" clip>
      <SectionLabel show="name" />
      <Stack gap="xl">
        <Chapter field="infoLabel">
          <Stack gap="xl">
            <Columns layout="poster" gap="none">
              <Stack gap="lg">
                <Reveal effect="mask">
                  <PosterTitle size="section" field="title" />
                </Reveal>
                <Reveal delay={0.15}>
                  <Portrait>
                    <Media field="photo" ratio="portrait" tone="mono" label="Lena Marlow" />
                  </Portrait>
                </Reveal>
              </Stack>
              <ScrollText field="info1" />
            </Columns>

            <NoteTiles fields={INFO.slice(1).map((n) => `info${n}`)} />
          </Stack>
        </Chapter>

        <Chapter field="experienceLabel">
          <Band tone="dark" height="flush">
            <PinnedIndex
              heading={<PosterTitle size="section" field="experienceLabel" />}
              items={EXPERIENCE.map((n) => ({ title: `exp${n}Company`, note: `exp${n}Role`, date: `exp${n}Dates`, text: `exp${n}Text` }))}
            />
          </Band>
        </Chapter>
      </Stack>
    </Section>
  );
}

// Contact, the last page: the title and a line; then, on a soft band edge to
// edge, how to reach you (the email set large), two ways to start (each with
// a black button) and round links to follow you; then a dark closing band:
// "Let's work together", a long arrow to "Say hello", and the links in a row.
export function Contact() {
  return (
    <Section spacing="start" gutter="rail" clip>
      <Stack gap="xl">
        <Stack gap="sm">
          <Reveal effect="mask">
            <PosterTitle size="section" field="title" />
          </Reveal>
          <Reveal delay={0.15}>
            <Body size="statement" measure="narrow" field="intro" />
          </Reveal>
        </Stack>

        <Band tone="soft">
          <Columns layout="pairEnd" gap="lg">
            <Reveal>
              <Stack gap="md">
                <PosterTitle level={3} size="sm" stop={false} field="touchTitle" />
                <Body size="sm" tone="muted" measure="tight" field="touchText" />
                <FieldLink size="display" field="email" href={(email) => `mailto:${email}`} />
              </Stack>
            </Reveal>
            <Stack gap="xl">
              {WAYS.map((way, i) => (
                <Reveal key={way} delay={0.1 + i * 0.1}>
                  <Stack gap="md">
                    <PosterTitle level={3} size="sm" stop={false} field={`${way}Title`} />
                    <Body size="sm" tone="muted" measure="tight" field={`${way}Text`} />
                    <ArrowButton tone="dark" field={`${way}Cta`} hrefField={`${way}Url`} />
                  </Stack>
                </Reveal>
              ))}
            </Stack>
            <Reveal delay={0.3}>
              <Stack gap="xs">
                {SOCIALS.map((name) => (
                  <RoundLink key={name} field={`${name}Mark`} labelField={`${name}Label`} hrefField={`${name}Url`} />
                ))}
              </Stack>
            </Reveal>
          </Columns>
        </Band>
      </Stack>

      <Band tone="dark">
        <Stack gap="lg" align="center">
          <Reveal effect="mask">
            <PosterTitle size="xl" field="closing" />
          </Reveal>
          <Reveal delay={0.15}>
            <ArrowLead field="closingLead" linkField="closingCta" hrefField="email" href={(email) => `mailto:${email}`} />
          </Reveal>
          <Reveal delay={0.3}>
            <Row justify="between">
              <FieldLink size="plain" field="emailLink" hrefField="emailHref" />
              {SOCIALS.map((name) => (
                <FieldLink key={name} size="plain" field={`${name}Label`} hrefField={`${name}Url`} />
              ))}
            </Row>
          </Reveal>
        </Stack>
      </Band>
    </Section>
  );
}

// Services, between Projects and About: an introduction as the Projects'
// (the title and a line under it on the left; a few words and Book a call on
// the right), then the services as cards in interlocking rows, each with the
// skills behind it.
export function Services() {
  return (
    <Section spacing="lg" gutter="rail">
      <Stack gap="xl">
        <Columns layout="poster" gap="none" align="end">
          <Stack gap="sm">
            <Reveal effect="mask">
              <PosterTitle size="section" field="title" />
            </Reveal>
            <Reveal delay={0.15}>
              <Body size="statement" field="subtitle" />
            </Reveal>
          </Stack>
          <Reveal delay={0.3}>
            <Stack gap="md">
              <Body tone="muted" measure="narrow" field="intro" />
              <ArrowButton tone="accent" field="cta" hrefField="ctaUrl" />
            </Stack>
          </Reveal>
        </Columns>
        <ServiceCards
          cards={SERVICES.map((n) => ({
            name: `service${n}Name`,
            text: `service${n}Text`,
            image: `service${n}Image`,
            skills: SKILLS.map((s) => `service${n}Skill${s}`),
          }))}
        />
      </Stack>
    </Section>
  );
}

// Each project's image shape, in turn, so neighbouring projects differ.
const SHAPES: ProjectShape[] = ["tall", "wide", "portrait", "slim"];

// Projects: an introduction in the hero's columns (the title in heavy
// capitals and a line under it on the left; a few words and View all
// projects on the right), then one project per screen, laid out as the hero
// (the text on the left, the image on the right, in the same poster look).
// A small bar pinned at the top says where the visitor is.
export function Projects() {
  return (
    <Section spacing="start" gutter="rail" clip>
      <Columns layout="poster" gap="none" align="end">
        <Stack gap="sm">
          <Reveal effect="mask">
            <PosterTitle size="section" field="title" />
          </Reveal>
          <Reveal delay={0.15}>
            <Body size="statement" field="subtitle" />
          </Reveal>
        </Stack>
        <Reveal delay={0.3}>
          <Stack gap="md">
            <Body tone="muted" measure="narrow" field="intro" />
            <ArrowButton tone="accent" field="allProjects" hrefField="allProjectsUrl" />
          </Stack>
        </Reveal>
      </Columns>
      <SectionLabel show="count" />
      {PROJECTS.map((n, i) => (
        <ProjectSlide key={n} fields={`project${n}`} side="end" shape={SHAPES[i % SHAPES.length]} />
      ))}
    </Section>
  );
}
