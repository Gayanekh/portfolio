"use client";

import { Body, Columns, FieldLink, Heading, Section, Stack } from "../core/blocks";
import DeckShowcase from "../sections/DeckShowcase";
import { PROJECTS } from "./shared";

// The Deck template's sections. Each `field` is a text or image address of
// the section (see the defaults in index.ts).

// The opening: the name beside a deck of project images that stacks as the
// page scrolls, then glides into the project slider.
export function Work() {
  return <DeckShowcase projects={PROJECTS} />;
}

export function About() {
  return (
    <Section spacing="lg" divider>
      <Columns layout="narrowStart">
        <Heading field="title" />
        <Body size="lg" measure="wide" field="text" />
      </Columns>
    </Section>
  );
}

export function Contact() {
  return (
    <Section spacing="lg" divider>
      <Stack gap="md" align="center">
        <Heading field="title" />
        <Body tone="muted" measure="narrow" field="text" />
        <FieldLink field="email" href={(email) => `mailto:${email}`} size="large" />
      </Stack>
    </Section>
  );
}
