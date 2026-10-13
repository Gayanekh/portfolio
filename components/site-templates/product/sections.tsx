"use client";

import { Body, Columns, Eyebrow, FieldLink, Grid, Heading, Media, Section, Stack } from "../core/blocks";
import { useField } from "../core/context";
import SiteHeader from "../sections/SiteHeader";
import { CypressArt, SoapArt, WashArt } from "./art";
import { CartCount } from "./cart";
import { AddToCartForm, InstagramLink, LoginLink } from "./parts";

// The Product template's sections, built from the kit's blocks only. Each
// `field` is a text of the section (see the defaults in index.ts).

export function Header() {
  return (
    <SiteHeader
      start={<InstagramLink />}
      end={
        <>
          <LoginLink />
          <CartCount />
        </>
      }
    />
  );
}

export function Shop() {
  const title = useField("title").value;
  return (
    <Section spacing="lg">
      <Columns gap="lg">
        <Stack gap="md">
          <Heading level={1} size="display" field="title" />
          <Body size="xl" field="price" />
          <Body tone="muted" measure="wide" field="description" />
          <AddToCartForm title={title} />
        </Stack>
        <Media ratio="portrait" mobileFirst label="Bar of soap beside a round mirror and dried grasses">
          <SoapArt />
        </Media>
      </Columns>
    </Section>
  );
}

export function Details() {
  return (
    <Section spacing="lg">
      <Columns layout="wideStart">
        <Media ratio="square" label="Wind-shaped cypress trees on a sandy hillside">
          <CypressArt />
        </Media>
        <Stack gap="md">
          <Heading size="lg" font="sans" field="title" />
          <Eyebrow field="label" />
          <Body size="sm" tone="muted" field="ingredients" />
        </Stack>
      </Columns>
    </Section>
  );
}

const POSTS = [
  { n: 1, from: "#cfd8c8", to: "#5f7a5c" },
  { n: 2, from: "#f0e2d0", to: "#c9a684" },
  { n: 3, from: "#e6dfd6", to: "#9a8b7a" },
];

export function Journal() {
  return (
    <Section spacing="lg" divider>
      <Stack gap="lg">
        <Heading field="title" />
        <Grid cols={3}>
          {POSTS.map(({ n, from, to }) => (
            <Stack key={n} gap="xs">
              <Media>
                <WashArt id={`post-${n}`} from={from} to={to} />
              </Media>
              <Eyebrow tone="muted" field={`post${n}Date`} />
              <Heading level={3} size="md" font="sans" field={`post${n}Title`} />
              <Body size="sm" tone="muted" field={`post${n}Excerpt`} />
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
        <Stack gap="md">
          <Body size="lg" measure="wide" field="text" />
          <Body size="sm" tone="muted" field="note" />
        </Stack>
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
