// Everything the Exhibition template says, in page order; the sections only
// lay it out. It is a template example: the artist, the works and the
// venue are fictional, the pictures free images from Unsplash, and nothing
// here is wired to a real service. *Marked* words are a headline's accent.

const photo = (id: string, size = "w=1200") => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&${size}`;

export const ARTIST = { name: "Ilse Varga", show: "Afterlight", signature: "Ilse Varga" };

// The work that settles into its frame after the hero.
export const FRAMED = {
  workId: "tide",
  room: "Room one",
  note: "Exhibition",
  show: "Afterlight",
};

export const NAV = [
  { href: "#works", label: "Works" },
  { href: "#story", label: "The show" },
  { href: "#visit", label: "Visit" },
];

// The works, in the order they hang.
export const WORKS = [
  { id: "tide", title: "Tide, burning", year: "2024", medium: "Oil on canvas", size: "160 × 120 cm", image: photo("photo-1541961017774-22349e4a1262") },
  { id: "still", title: "Still life with a late tulip", year: "2021", medium: "Oil on panel", size: "90 × 70 cm", image: photo("photo-1579783902614-a3fb3927b6a5") },
  { id: "blue", title: "Blue hour", year: "2025", medium: "Acrylic on linen", size: "120 × 120 cm", image: photo("photo-1536924940846-227afb31e2a5") },
  { id: "face", title: "Someone I met twice", year: "2023", medium: "Mixed media", size: "100 × 80 cm", image: photo("photo-1547891654-e66ed7ebb968") },
  { id: "violet", title: "Violet, moving", year: "2026", medium: "Oil on canvas", size: "180 × 140 cm", image: photo("photo-1549490349-8643362247b5") },
  { id: "garden", title: "Night garden", year: "2020", medium: "Oil on panel", size: "80 × 60 cm", image: photo("photo-1574182245530-967d9b3831af") },
  { id: "field", title: "The field before rain", year: "2019", medium: "Oil on canvas", size: "110 × 150 cm", image: photo("photo-1578301978693-85fa9c0320b9") },
  { id: "robe", title: "The green robe", year: "2022", medium: "Oil on canvas", size: "140 × 100 cm", image: photo("photo-1576773689115-5cd2b0223523") },
];

// The strip of works after the hero, as on the Archivio reference: the
// paintings in a row at one height, arrows under them and one link.
export const SHOWCASE = {
  label: "Explore the works",
  href: "/templates/demo/exhibition/works",
  previous: "Previous work",
  next: "Next work",
};

// About the show, as on the Archivio reference: a short text between two
// studio photographs. The *marked* words are set in bold.
export const ABOUT = {
  paragraphs: [
    "*Afterlight* brings together twelve years of Ilse Varga’s paintings, from the first flower studies of 2019 to the large weather canvases finished this spring.",
    "Hung across three rooms of Halle Nord, the show follows a single hour, the one after sunset, through colour, flowers and weather.",
  ],
  link: { href: "#story", label: "About the artist" },
  photos: [
    { image: photo("photo-1452802447250-470a88ac82bc", "w=900"), alt: "A palette of mixed paint held in the studio" },
    { image: photo("photo-1456086272160-b28b0645b729", "w=900"), alt: "A hand painting among open pots of colour" },
  ],
};

// The works page (/templates/demo/exhibition/works), opened from "Explore the works".
export const GALLERY = {
  title: "The works",
  grid: "Grid view",
  slider: "Slider view",
  hint: "Scroll or drag",
};

export const WORKS_SECTION = {
  label: "The works",
  title: "Each painting a *different room* of the same house.",
  text: "A selection from the show, hung at their relative sizes, each with its label.",
};

// The show's story, in three rooms.
export const STORY = {
  // The artist's words, each line a little fainter than the one before.
  quote: ["I paint the hour", "after the light has gone,", "when the colours", "are still deciding", "what they were."],
  quoteBy: "Ilse Varga, studio notes, 2025",
  studio: { image: photo("photo-1501084817091-a4f3d1d19e07", "w=1600"), alt: "The studio: easels, canvases and paint under a skylight", caption: "The studio outside Leipzig" },
  bio: "Born in Graz in 1971, Ilse Varga studied painting in Vienna and has worked in a studio outside Leipzig since 2004. Afterlight is her first large show in twelve years.",
  link: { href: "#visit", label: "Plan your visit" },
  label: "The three rooms",
  rooms: [
    { name: "Room one", title: "Heat", text: "The large abstracts: colour poured, scraped back and poured again, painted in the summers at Lake Balaton." },
    { name: "Room two", title: "Still", text: "Flowers and tables, painted slowly from life through the winters, each one a few weeks of light in a studio." },
    { name: "Room three", title: "Weather", text: "Fields, figures and skies, the newest work, where the two ways of painting begin to meet." },
  ],
};

// Visit and contact, as one quiet block (the Archivio reference's "Contatti"):
// where and when, how to get in touch, and the talks as a short list.
export const VISIT = {
  label: "Visit and contact",
  title: "Come and stand in front of them.",
  details: [
    { label: "Where", text: "Halle Nord, Gallery 2, Kanalstraße 18, Leipzig. Step-free access throughout." },
    { label: "When", text: "14 March – 30 June 2026. Tuesday to Sunday, 10:00 – 18:00; Thursdays until 21:00." },
    { label: "Entry", text: "Free, no booking needed. Guided walks on Saturdays at 14:00." },
  ],
  contact: { label: "Write to the studio", email: "studio@ilsevarga.example" },
};

// Talks and openings, shown as a list (nothing to book).
export const EVENTS = {
  label: "Talks and openings",
  items: [
    { day: "Thu 20 Mar, 19:00", title: "In conversation: the hour after the light", place: "Gallery 2, free" },
    { day: "Sat 5 Apr, 11:00", title: "Painting weather: a family morning", place: "Studio room" },
    { day: "Thu 22 May, 20:00", title: "Late opening with music", place: "All rooms" },
  ],
};

export const FOOTER = {
  note: "A template example. The artist, works and venue are fictional.",
  year: "© 2026",
};
