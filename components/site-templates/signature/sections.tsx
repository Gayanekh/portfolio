"use client";

import SignatureProfile from "../sections/signature/SignatureProfile";
import { About as AboutSection, Intro as IntroSection, Projects as ProjectsSection } from "../sections/signature/SignatureMain";
import { Awards as AwardsSection, Contact as ContactSection, Experience as ExperienceSection, Services as ServicesSection, Stack as StackSection, Voices as VoicesSection } from "../sections/signature/SignatureMore";
import { AWARDS, FAN, JOBS, PROJECTS, QUOTES, SERVICE_ITEMS, SERVICES, SOCIALS, STATS, STICKERS, TOOLS } from "./shared";

// The Signature (Minimal) template's sections: a pinned, living profile
// panel on the left and the portfolio scrolling beside it (see
// ../sections/signature/kit). Each `field` is a text or image address of the
// section (see the defaults in index.ts).

export const Profile = () => <SignatureProfile stickers={STICKERS} />;
export const Intro = () => <IntroSection fan={FAN} workTarget="projects" contactTarget="contact" />;
export const About = () => <AboutSection stats={STATS} />;
export const Projects = () => <ProjectsSection projects={PROJECTS} />;
export const Services = () => <ServicesSection services={SERVICES} items={SERVICE_ITEMS} />;
export const Stack = () => <StackSection tools={TOOLS} />;
export const Experience = () => <ExperienceSection jobs={JOBS} />;
export const Awards = () => <AwardsSection awards={AWARDS} />;
export const Voices = () => <VoicesSection quotes={QUOTES} />;
export const Contact = () => <ContactSection socials={SOCIALS} />;
