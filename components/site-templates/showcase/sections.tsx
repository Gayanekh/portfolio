"use client";

import { Body, Card, Columns, Eyebrow, FieldLink, Grid, Heading, Media, Section, Stack } from "../core/blocks";
import { useField } from "../core/context";
import SiteHeader from "../sections/SiteHeader";
import { PROJECTS, SERVICES } from "./shared";

// The Showcase template's sections: an image-led portfolio for photographers,
// UI/UX and graphic designers. Built from the kit's blocks only; each `field`
// is a text or image address of the section (see the defaults in index.ts).

export function Header() {
  return <SiteHeader layout="split" />;
}

export function Intro() {
  return (
    <Section spacing="lg">
      <Stack gap="lg">
        <Stack gap="md">
          <Eyebrow tone="muted" field="eyebrow" />
          <Heading level={1} size="display" font="displaySoft" field="title" />
          <Body size="lg" tone="muted" measure="wide" field="text" />
        </Stack>
        <Media field="image" ratio="wide" label="Featured work" />
      </Stack>
    </Section>
  );
}

function Project({ n }: { n: number }) {
  const title = useField(`project${n}Title`).value;
  return (
    <Card>
      <Media field={`project${n}Image`} label={title} />
      <Eyebrow tone="muted" field={`project${n}Meta`} />
      <Heading level={3} size="md" font="sans" field={`project${n}Title`} />
    </Card>
  );
}

export function Work() {
  return (
    <Section spacing="lg" divider>
      <Stack gap="lg">
        <Columns align="end">
          <Heading font="displaySoft" field="title" />
          <Body tone="muted" measure="narrow" field="text" />
        </Columns>
        <Grid cols={2} gap="wide">
          {PROJECTS.map((n) => (
            <Project key={n} n={n} />
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}

export function Services() {
  return (
    <Section spacing="lg" divider>
      <Stack gap="lg">
        <Heading font="displaySoft" field="title" />
        <Grid cols={3}>
          {SERVICES.map((n) => (
            <Stack key={n} gap="xs">
              <Eyebrow tone="muted">{`0${n}`}</Eyebrow>
              <Heading level={3} size="md" font="sans" field={`service${n}Title`} />
              <Body size="sm" tone="muted" field={`service${n}Text`} />
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}

export function About() {
  const name = useField("name").value;
  return (
    <Section spacing="lg" divider>
      <Columns layout="narrowStart" align="center" gap="lg">
        <Media field="portrait" ratio="portrait" label={`Portrait of ${name}`} />
        <Stack gap="md">
          <Heading font="displaySoft" field="title" />
          <Body size="lg" field="text" />
          <Body size="sm" tone="muted" field="clients" />
        </Stack>
      </Columns>
    </Section>
  );
}

export function Contact() {
  return (
    <Section spacing="lg" divider>
      <Stack gap="md">
        <Eyebrow tone="muted" field="eyebrow" />
        <Heading size="display" font="displaySoft" field="title" />
        <Body tone="muted" measure="narrow" field="text" />
        <FieldLink field="email" href={(email) => `mailto:${email}`} />
      </Stack>
    </Section>
  );
}
