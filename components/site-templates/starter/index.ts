import { defineTemplate } from "../core/types";
import SiteFooter, { siteFooterDefaults } from "../sections/SiteFooter";
import SiteHeader, { siteHeaderDefaults } from "../sections/SiteHeader";
import { About, Contact, Hero, Work } from "./sections";

// The base for a new template. To make one:
// 1. Copy this folder and give the template its own id and name.
// 2. Change the sections (sections.tsx) using the blocks in ../core/blocks;
//    add a block or a variant there when a design needs one, not classes here.
// 3. Set the starting text of every field in `defaults`.
// 4. Add it to ../registry.ts. It then opens at /templates/editor/<id>.
export const starterTemplate = defineTemplate({
  id: "starter",
  name: "Starter",
  description: "The base for new templates: a header with the menu, a hero, work, about, contact and a footer.",
  siteTitle: { section: "header", field: "siteTitle" },
  inProgress: {
    note: "Starter is the plain base new templates are built from, not a finished design.",
  },
  sections: [
    { id: "header", label: "Header", Component: SiteHeader, defaults: siteHeaderDefaults },
    {
      id: "hero",
      label: "Hero",
      Component: Hero,
      defaults: {
        eyebrow: "Welcome",
        title: "A short line about what you do",
        text: "One or two sentences that tell visitors who you are and what they will find here.",
      },
    },
    {
      id: "work",
      label: "Work",
      menu: "Work",
      Component: Work,
      defaults: {
        title: "Selected work",
        item1Title: "First project",
        item1Text: "What it was, and what you did.",
        item2Title: "Second project",
        item2Text: "What it was, and what you did.",
        item3Title: "Third project",
        item3Text: "What it was, and what you did.",
      },
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        title: "About",
        text: "A few sentences about you: your background, how you work and what you care about.",
      },
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        title: "Contact",
        text: "Have a project in mind? Write to me and I'll reply within two days.",
        email: "hello@yoursite.com",
      },
      fields: [{ name: "email", label: "Email" }],
    },
    { id: "footer", label: "Footer", Component: SiteFooter, defaults: siteFooterDefaults },
  ],
});
