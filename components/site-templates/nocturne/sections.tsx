"use client";

import NocturneContact from "../sections/nocturne/NocturneContact";
import NocturneDev from "../sections/nocturne/NocturneDev";
import NocturneGraphic from "../sections/nocturne/NocturneGraphic";
import NocturneHeader from "../sections/nocturne/NocturneHeader";
import NocturneHero from "../sections/nocturne/NocturneHero";
import NocturnePath from "../sections/nocturne/NocturnePath";
import NocturnePhoto from "../sections/nocturne/NocturnePhoto";
import NocturneUiux from "../sections/nocturne/NocturneUiux";
import NocturneWork from "../sections/nocturne/NocturneWork";
import { CASE_STATS, CASES, DETAILS, DISCIPLINES, JOBS, PHOTOS, PIECES, PRINCIPLES, ROLES, SCHOOLS, STACK, STEPS, WORKS } from "./shared";

// The Nocturne template's sections: a dark, editorial portfolio for people
// who design, build, photograph and draw. Every section is built from the
// Nocturne kit (../sections/nocturne/kit); each `field` is a text or image
// address of the section (see the defaults in index.ts).

export const Header = () => <NocturneHeader />;
export const Hero = () => <NocturneHero roles={ROLES} targets={DISCIPLINES} />;
export const Work = () => <NocturneWork works={WORKS} />;
export const Uiux = () => <NocturneUiux steps={STEPS} cases={CASES} stats={CASE_STATS} />;
export const Development = () => <NocturneDev principles={PRINCIPLES} stack={STACK} />;
export const Photography = () => <NocturnePhoto photos={PHOTOS} />;
export const Graphic = () => <NocturneGraphic pieces={PIECES} />;
export const About = () => <NocturnePath jobs={JOBS} schools={SCHOOLS} />;
export const Contact = () => <NocturneContact details={DETAILS} />;
