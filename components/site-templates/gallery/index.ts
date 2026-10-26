import { defineTemplate } from "../core/types";
import { Hero, Placeholder } from "./sections";
import { SLIDES } from "./shared";

// Gallery: a bold, poster-like portfolio for photographers and artists. White
// panels, a soft grey one, near-black text in a heavy grotesk and a red
// accent, until a palette or font pack is picked. Built step by step from the
// design reference: the opening slider first.

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1800`;

const SAMPLE_SLIDES = [
  {
    eyebrow: "Nothingtosee",
    title: "pre18",
    subtitle: "acceptance of ignorance",
    text: "We can get so caught up in making pictures beautiful that we forget art is meant to ask questions, and to help us see familiar things in a different way.",
    image: photo("photo-1609016683866-029bca027853"),
  },
  {
    eyebrow: "Quiet light",
    title: "lumen",
    subtitle: "the weight of a still room",
    text: "A year of mornings photographed in the same few rooms, watching how light alone changes what a space feels like.",
    image: photo("photo-1615751596346-9df8006e5381"),
  },
  {
    eyebrow: "After hours",
    title: "noct3",
    subtitle: "a city that never rests",
    text: "Night walks through a sleeping city: empty streets, lit windows and the people still awake behind them.",
    image: photo("photo-1595152772835-219674b2a8a6"),
  },
];

export const galleryTemplate = defineTemplate({
  id: "gallery",
  name: "Gallery",
  description: "A bold, poster-like portfolio for photographers and artists: a huge title across split panels, a large image and a red index of your series.",
  siteTitle: { section: "hero", field: "siteTitle" },
  theme:
    "[--card:#ffffff] [--foreground:#1d1d1f] [--muted-foreground:#8e8e8e] [--border:#e4e4e4] [--primary:#ff4747] [--font-1:var(--tf-inter-tight)] [--font-display:var(--tf-inter-tight)]",
  inProgress: {
    note: "Gallery is still being designed: only its opening slider is finished.",
    notWorking: ["The About, Artists and Magazine pages are empty for now", "The menu leads to those empty pages"],
  },
  sections: [
    {
      id: "hero",
      label: "Series",
      Component: Hero,
      defaults: {
        siteTitle: "GRIT",
        ...Object.fromEntries(
          SAMPLE_SLIDES.flatMap((slide, i) => [
            [`slide${i + 1}Eyebrow`, slide.eyebrow],
            [`slide${i + 1}Title`, slide.title],
            [`slide${i + 1}Subtitle`, slide.subtitle],
            [`slide${i + 1}Text`, slide.text],
            [`slide${i + 1}Image`, slide.image],
          ]),
        ),
      },
      fields: SLIDES.map((n) => ({ name: `slide${n}Image`, label: `Series ${n} image address` })),
    },
    // Empty until their designs arrive.
    { id: "about", label: "About", menu: "About", Component: Placeholder, defaults: { title: "About" }, inProgress: "Not designed yet: only its title shows." },
    { id: "artists", label: "Artists", menu: "Artists", Component: Placeholder, defaults: { title: "Artists" }, inProgress: "Not designed yet: only its title shows." },
    { id: "magazine", label: "Magazine", menu: "Magazine", Component: Placeholder, defaults: { title: "Magazine" }, inProgress: "Not designed yet: only its title shows." },
  ],
});
