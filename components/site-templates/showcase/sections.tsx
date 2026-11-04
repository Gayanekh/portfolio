"use client";

import ShowcaseAbout from "../sections/showcase/ShowcaseAbout";
import ShowcaseContact from "../sections/showcase/ShowcaseContact";
import ShowcaseFooter from "../sections/showcase/ShowcaseFooter";
import ShowcaseHeader from "../sections/showcase/ShowcaseHeader";
import ShowcaseHero from "../sections/showcase/ShowcaseHero";
import ShowcaseServices from "../sections/showcase/ShowcaseServices";
import ShowcaseVoices from "../sections/showcase/ShowcaseVoices";
import ShowcaseWork from "../sections/showcase/ShowcaseWork";
import { BAND, FACTS, JOBS, PROJECTS, ROLES, SERVICES, SOCIALS, VOICES } from "./shared";

// The Showcase template's sections: an image-led portfolio for
// photographers, UI/UX and graphic designers. Every section is built from the
// Showcase kit (../sections/showcase/kit); each `field` is a text or image
// address of the section (see the defaults in index.ts).

export const Header = () => <ShowcaseHeader />;
export const Intro = () => <ShowcaseHero roles={ROLES} />;
export const Work = () => <ShowcaseWork projects={PROJECTS} />;
export const Services = () => <ShowcaseServices services={SERVICES} band={BAND} />;
export const About = () => <ShowcaseAbout facts={FACTS} jobs={JOBS} />;
export const Voices = () => <ShowcaseVoices voices={VOICES} />;
export const Contact = () => <ShowcaseContact socials={SOCIALS} />;
export const Footer = () => <ShowcaseFooter />;
