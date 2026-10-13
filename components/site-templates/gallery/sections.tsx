"use client";

import { Heading, Section } from "../core/blocks";
import PanelSlider from "../sections/PanelSlider";
import { SLIDES } from "./shared";

// The Gallery template's sections: a bold, poster-like portfolio. Each
// `field` is a text or image address of the section (see the defaults in
// index.ts).

// The opening screen: the site title and menu over a slider of series.
export function Hero() {
  return <PanelSlider slides={SLIDES} />;
}

// A section waiting for its design: its title on a full, empty screen, so the
// menu already leads somewhere. Replaced as the design arrives.
export function Placeholder() {
  return (
    <Section spacing="full">
      <Heading field="title" />
    </Section>
  );
}
