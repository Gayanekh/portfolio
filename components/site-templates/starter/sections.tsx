"use client";

import { Body, Columns, Eyebrow, FieldLink, Grid, Heading, Media, Section, Stack } from "../core/blocks";

// The Starter template's sections: the base to copy for a new template.
// Build sections from the kit's blocks; each `field` is a text of the section
// (see the defaults in index.ts).

export function Hero() {
  return (
    <Section spacing="lg">
      <Columns align="center" gap="lg">
        <Stack gap="md">
          <Eyebrow tone="muted" field="eyebrow" />
          <Heading level={1} size="display" field="title" />
          <Body size="lg" tone="muted" measure="wide" field="text" />
        </Stack>
        <Media ratio="portrait" mobileFirst />
      </Columns>
    </Section>
  );
}

const ITEMS = [1, 2, 3];

export function Work() {
  return (
    <Section spacing="lg" divider>
      <Stack gap="lg">
        <Heading field="title" />
        <Grid cols={3}>
          {ITEMS.map((n) => (
            <Stack key={n} gap="xs">
              <Media />
              <Heading level={3} size="md" font="sans" field={`item${n}Title`} />
              <Body size="sm" tone="muted" field={`item${n}Text`} />
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
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
        <FieldLink field="email" href={(email) => `mailto:${email}`} />
      </Stack>
    </Section>
  );
}
