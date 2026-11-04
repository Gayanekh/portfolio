import { defineTemplate } from "../core/types";
import { About, Contact, Header, Hero, Honours, Journal, Services, Voices, Work } from "./sections";
import { FACTS, INSTA, PEEK, POSTS, SERVICES, SLIDES, SOCIALS, STATS, TAB_ITEMS, TABS, VOICES, WORKS } from "./shared";

// Gallery: a bold, poster-like portfolio for photographers and artists. White
// panels, a soft grey one, near-black text in a heavy grotesk and a red
// accent, until a palette or font pack is picked. Every page follows the
// opening slider's panels; Work follows the design reference's "work" page
// (docs/design-references/gallery).

const photo = (id: string, width = 1800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${width}`;

// Fields numbered by prefix (`work1Title`...), from a list of samples.
const numbered = <T extends Record<string, string>>(prefix: string, samples: T[]) =>
  Object.fromEntries(
    samples.flatMap((sample, i) => Object.entries(sample).map(([key, value]) => [`${prefix}${i + 1}${key[0].toUpperCase()}${key.slice(1)}`, value])),
  );

const SAMPLE_SLIDES = [
  {
    eyebrow: "Portraits, 2025",
    title: "faces",
    subtitle: "people, as they are",
    text: "A year of portraits made in kitchens, studios and stairwells. No direction and no retouching, just people in the moment they forget the camera.",
    image: photo("photo-1531123897727-8f129e1688ce", 2400),
  },
  {
    eyebrow: "Editorial, 2024",
    title: "drift",
    subtitle: "fashion in open air",
    text: "A summer editorial on the Alentejo coast in natural light only, where the wind does the styling and no two frames are alike.",
    image: photo("photo-1544957992-20514f595d6f", 2400),
  },
  {
    eyebrow: "Landscape, 2023",
    title: "above",
    subtitle: "where the clouds settle",
    text: "Twelve dawns on the same shore, waiting for the minute the light breaks through the clouds and the water turns to fire.",
    image: photo("photo-1490730141103-6cac27aaab94", 2400),
  },
];

const SAMPLE_WORKS = [
  { title: "Noor in pink", category: "Portrait", year: "2025", image: photo("photo-1531746020798-e6953c6e8e04") },
  { title: "Yellow hour", category: "Editorial", year: "2024", image: photo("photo-1515886657613-9f3515b0c78f") },
  { title: "Still water", category: "Landscape", year: "2023", image: photo("photo-1501785888041-af3ef285b470") },
  { title: "Wet neon", category: "Street", year: "2024", image: photo("photo-1519501025264-65ba15a82390") },
  { title: "Old Tom", category: "Portrait", year: "2024", image: photo("photo-1552058544-f2b08422138a") },
  { title: "Window light", category: "Editorial", year: "2025", image: photo("photo-1529626455594-4ff0802cfb7e") },
  { title: "Green ridge", category: "Landscape", year: "2022", image: photo("photo-1470071459604-3b5ec3a7fe05") },
  { title: "The round window", category: "Street", year: "2025", image: photo("photo-1488161628813-04466f872be2") },
  { title: "Daniel, after dark", category: "Portrait", year: "2023", image: photo("photo-1506794778202-cad84cf45f1d") },
  { title: "Sun on yellow", category: "Editorial", year: "2023", image: photo("photo-1469334031218-e382a71b716b") },
  { title: "Night over the peaks", category: "Landscape", year: "2024", image: photo("photo-1519681393784-d120267933ba") },
  { title: "Avenue, 8 a.m.", category: "Street", year: "2022", image: photo("photo-1449824913935-59a10b8d2000") },
];

const SAMPLE_SERVICES = [
  {
    name: "Portrait sessions",
    price: "from €450",
    details: "2 hours · 30 edited images",
    text: "Relaxed sessions at home, outdoors or in my Lisbon studio, for actors, authors, founders and anyone who wants a portrait that looks like them.",
    image: photo("photo-1544005313-94ddf0286df2"),
  },
  {
    name: "Editorial & fashion",
    price: "from €1,400 / day",
    details: "Crew and casting on request",
    text: "Stories for magazines and labels, from moodboard and casting to the final edit, on location or in the studio.",
    image: photo("photo-1496747611176-843222e1e57c"),
  },
  {
    name: "Weddings & elopements",
    price: "from €2,800",
    details: "Full day · 400+ images · album",
    text: "Small weddings and elopements anywhere in Europe, photographed quietly and documentary-style, with a printed album to keep.",
    image: photo("photo-1519741497674-611481863552"),
  },
  {
    name: "Brand & commercial",
    price: "from €950",
    details: "Half day · usage licence",
    text: "Product, campaign and team photography for brands that want pictures made with the same care as their work.",
    image: photo("photo-1542291026-7eec264c27ff"),
  },
  {
    name: "Fine-art prints",
    price: "from €180",
    details: "Signed · editions of 25",
    text: "Archival prints of selected series on cotton rag paper, signed and numbered, shipped worldwide in a flat case.",
    image: photo("photo-1452587925148-ce544e77e70d"),
  },
];

const SAMPLE_TABS = [
  {
    label: "Exhibitions",
    items: [
      { year: "2025", title: "Faces, solo exhibition", place: "Galeria Luz, Lisbon" },
      { year: "2024", title: "Quiet Light", place: "Kunsthalle Nord, Hamburg" },
      { year: "2024", title: "New European Portraits (group)", place: "Maison de l'Image, Lyon" },
      { year: "2023", title: "Above, solo exhibition", place: "Centro de Fotografia, Porto" },
      { year: "2022", title: "Salt & Stone (group)", place: "Atlas Gallery, Copenhagen" },
    ],
  },
  {
    label: "Awards",
    items: [
      { year: "2025", title: "Portrait of the Year, shortlist", place: "International Portrait Prize" },
      { year: "2024", title: "Gold, editorial series", place: "European Photo Awards" },
      { year: "2023", title: "Landscape of the Year, second place", place: "Open Horizons Awards" },
      { year: "2022", title: "Emerging talent grant", place: "Lisbon Arts Foundation" },
    ],
  },
  {
    label: "Publications",
    items: [
      { year: "2025", title: "Cover story: Faces", place: "Northern Light Quarterly" },
      { year: "2024", title: "Drift, a 12-page editorial", place: "Frame & Field" },
      { year: "2024", title: "Interview: on honest light", place: "Grain Magazine" },
      { year: "2023", title: "Above the clouds", place: "Atlas Review" },
      { year: "2022", title: "Portfolio feature", place: "Lumen Journal" },
    ],
  },
];

const SAMPLE_PRESS = ["Northern Light Quarterly", "Frame & Field", "Grain Magazine", "Atlas Review", "Lumen Journal", "Open Shutter"];

const SAMPLE_VOICES = [
  {
    quote: "Mara has a rare way of making people forget they're being photographed. Our cover portraits were the most honest we've ever run.",
    name: "Elena Duarte",
    role: "Photo editor, Northern Light Quarterly",
    image: photo("photo-1438761681033-6461ffad8d80", 300),
  },
  {
    quote: "Calm, prepared and endlessly patient. She turned a rainy day on the coast into the best campaign our label has had.",
    name: "Tomás Reis",
    role: "Founder, Maré Studio",
    image: photo("photo-1500648767791-00dcc994a43e", 300),
  },
  {
    quote: "We didn't want posed wedding photos, and we didn't get any. Every picture feels exactly like the day felt.",
    name: "Ana & Jonas",
    role: "Married in Sintra, 2024",
    image: photo("photo-1534528741775-53994a69daeb", 300),
  },
  {
    quote: "A clear brief, no surprises, and pictures our whole team still uses a year later. Working with Mara is easy.",
    name: "Sam Okafor",
    role: "Head of brand, Northwind Coffee",
    image: photo("photo-1507003211169-0a1dd7228f2d", 300),
  },
];

const SAMPLE_POSTS = [
  {
    category: "Behind the scenes",
    date: "Oct 2026",
    title: "Chasing fog above the hills",
    excerpt: "Four mornings, one tripod and the twenty minutes when the clouds finally broke.",
    image: photo("photo-1492691527719-9d1e07e534b4", 1200),
    url: "https://medium.com/",
  },
  {
    category: "Gear",
    date: "Aug 2026",
    title: "What's in my bag this year",
    excerpt: "The two cameras, three lenses and one small light that go everywhere with me.",
    image: photo("photo-1516035069371-29a1b244cc32", 1200),
    url: "https://medium.com/",
  },
  {
    category: "Film",
    date: "Jun 2026",
    title: "Notes from my first short film",
    excerpt: "What twelve years of stills taught me about moving pictures, and what they didn't.",
    image: photo("photo-1485846234645-a62644f84728", 1200),
    url: "https://medium.com/",
  },
];

const SAMPLE_INSTA = [
  "photo-1494790108377-be9c29b29330",
  "photo-1507525428034-b723cf961d3e",
  "photo-1517841905240-472988babdf9",
  "photo-1514565131-fce0801e5785",
  "photo-1511285560929-80b456fea0bc",
  "photo-1504703395950-b89145a5425b",
  "photo-1433086966358-54859d0ed716",
  "photo-1511765224389-37f0e77cf0eb",
];

export const galleryTemplate = defineTemplate({
  id: "gallery",
  name: "Gallery",
  description:
    "A bold, poster-like portfolio for photographers: a huge title across split panels, a slider of your series, filterable work with a full-screen viewer, services, recognition, kind words, a journal and a booking form.",
  siteTitle: { section: "hero", field: "siteTitle" },
  theme:
    "[--card:#ffffff] [--foreground:#1d1d1f] [--muted-foreground:#8e8e8e] [--border:#e4e4e4] [--primary:#ff4747] [--font-1:var(--tf-inter-tight)] [--font-display:var(--tf-inter-tight)]",
  sections: [
    // Pinned at the top once the hero's top row has scrolled away; it shows
    // the hero's site title and the menu, so it has no fields of its own.
    { id: "header", label: "Header", Component: Header, defaults: {}, stack: false },
    {
      id: "hero",
      label: "Series",
      Component: Hero,
      defaults: {
        siteTitle: "MARA VOSS",
        ...numbered("slide", SAMPLE_SLIDES),
        // The About peek
        peekLabel: "About me",
        peekName: "Mara Voss",
        peekRole: "Photographer, Lisbon",
        peekMore: "Read more",
        peek1Image: photo("photo-1506863530036-1efeddceb993", 400),
        peek2Image: photo("photo-1495745966610-2a67f2297e5e", 400),
        peek3Image: photo("photo-1500051638674-ff996a0ec29e", 400),
      },
      fields: [
        ...SLIDES.map((n) => ({ name: `slide${n}Image`, label: `Series ${n} image address` })),
        ...PEEK.map((n) => ({ name: `peek${n}Image`, label: `About peek photo ${n} address` })),
      ],
    },
    {
      id: "about",
      label: "About",
      menu: "About",
      Component: About,
      defaults: {
        eyebrow: "Behind the lens",
        title: "about",
        image: photo("photo-1554080353-a576cf803bda"),
        lead: "I photograph people the way they are when they forget the camera is there.",
        bio1: "I'm Mara Voss, a portrait and editorial photographer based in Lisbon. For twelve years I've worked with magazines, brands and private clients across Europe, always with the same idea: honest light, real moments and very little fuss.",
        bio2: "I shoot on digital and medium-format film, edit every picture by hand and keep shoots small and calm, so the people in front of the lens can simply be themselves.",
        signature: "Mara Voss",
        cta: "Book a session",
        since: "Since 2014",
        stat1Value: "12",
        stat1Label: "Years behind the camera",
        stat2Value: "340+",
        stat2Label: "Sessions and commissions",
        stat3Value: "9",
        stat3Label: "Solo exhibitions",
        fact1Label: "Based in",
        fact1Value: "Lisbon, Portugal",
        fact2Label: "Available",
        fact2Value: "Worldwide",
        fact3Label: "Cameras",
        fact3Value: "Leica SL2, Hasselblad 500C/M",
        fact4Label: "Languages",
        fact4Value: "English, Portuguese, German",
      },
      fields: [{ name: "image", label: "Portrait address" }, ...STATS.map((n) => ({ name: `stat${n}Value`, label: `Figure ${n}` })), ...FACTS.map((n) => ({ name: `fact${n}Value`, label: `Fact ${n}` }))],
    },
    {
      id: "work",
      label: "Work",
      menu: "Work",
      Component: Work,
      defaults: {
        eyebrow: "Selected work",
        title: "work",
        intro: "Portraits, editorials, landscapes and street pictures from the last few years. Pick a category, or open any picture full screen.",
        allLabel: "All",
        ...numbered("work", SAMPLE_WORKS),
      },
      fields: WORKS.flatMap((n) => [
        { name: `work${n}Image`, label: `Work ${n} image address` },
        { name: `work${n}Category`, label: `Work ${n} category` },
      ]),
    },
    {
      id: "services",
      label: "Services",
      menu: "Services",
      Component: Services,
      defaults: {
        eyebrow: "What I offer",
        title: "services",
        intro: "Every shoot starts with a conversation. Prices include planning, the shoot and hand-edited pictures; travel is quoted separately.",
        cta: "Book a session",
        ...numbered("service", SAMPLE_SERVICES),
      },
      fields: SERVICES.map((n) => ({ name: `service${n}Image`, label: `Service ${n} image address` })),
    },
    {
      id: "honours",
      label: "Recognition",
      Component: Honours,
      defaults: {
        eyebrow: "Recognition",
        title: "honours",
        intro: "Exhibitions, awards and publications from the last few years, with thanks to every curator, editor and sitter who made them possible.",
        featuredLabel: "As featured in",
        ...Object.fromEntries(SAMPLE_PRESS.map((name, i) => [`press${i + 1}`, name])),
        ...Object.fromEntries(
          TABS.flatMap((t, i) => [
            [`tab${t}Label`, SAMPLE_TABS[i].label],
            ...TAB_ITEMS.flatMap((n, j) => {
              const item = SAMPLE_TABS[i].items[j];
              return [
                [`tab${t}Item${n}Year`, item?.year ?? ""],
                [`tab${t}Item${n}Title`, item?.title ?? ""],
                [`tab${t}Item${n}Place`, item?.place ?? ""],
              ];
            }),
          ]),
        ),
      },
      fields: TABS.flatMap((t) => TAB_ITEMS.map((n) => ({ name: `tab${t}Item${n}Title`, label: `Tab ${t}, row ${n}` }))),
    },
    {
      id: "voices",
      label: "Kind words",
      Component: Voices,
      defaults: {
        eyebrow: "Kind words",
        title: "voices",
        ...numbered("voice", SAMPLE_VOICES),
      },
      fields: VOICES.map((n) => ({ name: `voice${n}Image`, label: `Quote ${n} photo address` })),
    },
    {
      id: "journal",
      label: "Journal",
      menu: "Journal",
      Component: Journal,
      defaults: {
        eyebrow: "Journal",
        title: "journal",
        intro: "Notes from shoots, the gear I trust and the stories behind the pictures.",
        allLabel: "All stories",
        // A placeholder link; replace with your blog.
        allUrl: "https://medium.com/",
        readLabel: "Read story",
        ...numbered("post", SAMPLE_POSTS),
      },
      fields: [
        { name: "allUrl", label: "All stories link" },
        ...POSTS.flatMap((n) => [
          { name: `post${n}Image`, label: `Story ${n} image address` },
          { name: `post${n}Url`, label: `Story ${n} link` },
        ]),
      ],
    },
    {
      id: "contact",
      label: "Contact",
      menu: "Contact",
      Component: Contact,
      defaults: {
        eyebrow: "Get in touch",
        title: "contact",
        status: "Now booking spring & summer 2027",
        lead: "Tell me about the story you'd like to tell.",
        email: "hello@maravoss.com",
        studioLabel: "Studio",
        studio: "Rua da Rosa 112, Lisbon, Portugal",
        phoneLabel: "Phone",
        phone: "+351 912 345 678",
        social1Label: "Instagram",
        social1Url: "https://www.instagram.com/",
        social2Label: "Behance",
        social2Url: "https://www.behance.net/",
        social3Label: "LinkedIn",
        social3Url: "https://www.linkedin.com/",
        // The booking form, which opens an email to `email`
        formName: "Your name",
        formEmail: "Your email",
        formType: "Type of shoot",
        formDate: "Preferred date or season",
        formMessage: "Tell me a little about it",
        formSend: "Send enquiry",
        formSent: "Your email app is opening with the message ready to send.",
        topic1: "Portrait",
        topic2: "Editorial",
        topic3: "Wedding",
        topic4: "Brand",
        topic5: "Prints",
        // The Instagram strip
        handle: "@mara.voss",
        handleUrl: "https://www.instagram.com/",
        ...Object.fromEntries(SAMPLE_INSTA.map((id, i) => [`insta${i + 1}Image`, photo(id, 600)])),
        // The footer
        copyright: "© 2026 Mara Voss. All pictures are my own.",
        credit: "Portrait, editorial and landscape photography, Lisbon and worldwide",
        top: "Back to top",
      },
      fields: [
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
        ...SOCIALS.map((n) => ({ name: `social${n}Url`, label: `Link ${n} address` })),
        { name: "handleUrl", label: "Instagram address" },
        ...INSTA.map((n) => ({ name: `insta${n}Image`, label: `Instagram picture ${n} address` })),
      ],
    },
  ],
});
