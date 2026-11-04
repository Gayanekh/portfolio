"use client";

import AboutPeek from "../sections/AboutPeek";
import PanelAbout from "../sections/PanelAbout";
import PanelContact from "../sections/PanelContact";
import PanelHeader from "../sections/PanelHeader";
import PanelHonours from "../sections/PanelHonours";
import PanelJournal from "../sections/PanelJournal";
import PanelServices from "../sections/PanelServices";
import PanelSlider from "../sections/PanelSlider";
import PanelVoices from "../sections/PanelVoices";
import PanelWork from "../sections/PanelWork";
import { FACTS, INSTA, PEEK, POSTS, PRESS, SERVICES, SLIDES, SOCIALS, STATS, TAB_ITEMS, TABS, TOPICS, VOICES, WORKS } from "./shared";

// The Gallery template's sections: a bold, poster-like photography
// portfolio, every page in the opening slider's panels (see
// ../sections/panel-kit). Each `field` is a text or image address of the
// section (see the defaults in index.ts).

// The header pinned at the top, once the hero's own top row has gone.
export function Header() {
  return <PanelHeader />;
}

// The opening screen: the site title and menu over a slider of series, with
// a short About peek in the grey panel's corner.
export function Hero() {
  return <PanelSlider slides={SLIDES} aside={<AboutPeek images={PEEK} target="about" />} />;
}

export function About() {
  return <PanelAbout stats={STATS} facts={FACTS} ctaTarget="contact" />;
}

export function Work() {
  return <PanelWork works={WORKS} />;
}

export function Services() {
  return <PanelServices services={SERVICES} ctaTarget="contact" />;
}

export function Honours() {
  return <PanelHonours tabs={TABS} items={TAB_ITEMS} press={PRESS} />;
}

export function Voices() {
  return <PanelVoices voices={VOICES} />;
}

export function Journal() {
  return <PanelJournal posts={POSTS} />;
}

export function Contact() {
  return <PanelContact topics={TOPICS} socials={SOCIALS} insta={INSTA} />;
}
