// Mock content for the landing page (template slider, preview dialog and the
// small round avatars). Photos are free Unsplash images used as placeholders
// until the real templates exist; they are not wired to any account data.

const unsplash = (id: string, size: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&${size}`;

/* ---------- Photos ---------- */

// Portraits for the round avatars. The keys are kept from the earlier
// illustrations so every place that names one still works.
const ART = {
  chem: "photo-1615751596346-9df8006e5381",
  river: "photo-1595152772835-219674b2a8a6",
  rubric: "photo-1699899657675-1003c7d28f2d",
  harbour: "photo-1625241152315-4a698f74ceb7",
  boats: "photo-1527980965255-d3b416303d12",
  portrait: "photo-1609016683866-029bca027853",
  city: "photo-1699899657675-1003c7d28f2d",
} as const;

export type ArtKey = keyof typeof ART;

export function Art({ name, className = "block h-full w-full" }: { name: ArtKey; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- small remote mock photo
    <img src={unsplash(ART[name], "w=160&h=160")} alt="" aria-hidden="true" loading="lazy" decoding="async" className={`${className} object-cover`} />
  );
}

// One portfolio photo per template, shown wherever a template preview appears.
export const TEMPLATE_IMAGE: Record<TemplateId, string> = {
  atelier: unsplash("photo-1487014679447-9f8336841d58", "w=1600"),
  ledger: unsplash("photo-1502945015378-0e284ca1a5be", "w=1600"),
  gallery: unsplash("photo-1592839961515-64c68091f712", "w=1600"),
  chapter: unsplash("photo-1522199755839-a2bacb67c546", "w=1600"),
};

/* ---------- Sample people and templates ---------- */

type Kind = "case" | "gallery" | "lesson" | "engagement";

interface Project { kind: Kind; title: string; summary: string; role?: string; tools?: string; outcome?: string; audience?: string; client?: string; art: ArtKey }
interface Person {
  key: PersonKey; role: string; name: string; headline: string; location: string; intro: string; skills: string[];
  experience: { role: string; org: string; start: string; end: string; summary: string }[];
  education: { credential: string; school: string; year: string }[];
  projects: Project[];
  contact: { label: string; value: string }[];
}
export type PersonKey = "amara" | "tomas" | "lena";
export type TemplateId = "atelier" | "ledger" | "gallery" | "chapter";
export type TemplateStyle = "image" | "text" | "case";

export const PEOPLE: Record<PersonKey, Person> = {
  amara: {
    key: "amara", role: "Teacher", name: "Amara Okafor", headline: "Secondary science teacher and curriculum designer", location: "Leeds, UK",
    intro: "I design science lessons that start with something students can touch, measure or argue about. Ten years in classrooms, the last four leading a department of eight teachers.",
    skills: ["Curriculum design", "Practical science", "Assessment design", "Mentoring new teachers", "Google Classroom", "Lab safety"],
    experience: [
      { role: "Head of Science", org: "Harrow Lane Academy", start: "2021", end: "Present", summary: "Lead a team of eight across Years 7 to 13. Rebuilt the Key Stage 3 practical programme." },
      { role: "Science Teacher", org: "Northfield School", start: "2016", end: "2021", summary: "Taught biology and chemistry to Years 7 to 11 and ran the after-school STEM club." },
    ],
    education: [{ credential: "PGCE, Secondary Science", school: "University of Leeds", year: "2016" }, { credential: "BSc Biology", school: "University of Manchester", year: "2015" }],
    projects: [
      { kind: "lesson", title: "Kitchen Chemistry", summary: "A six-week Year 8 unit where students investigate reactions with household materials, then design and run their own fair test.", audience: "Year 8, mixed ability", role: "Designed the unit and wrote all teacher notes", outcome: "Now taught by every Year 8 class in the department", art: "chem" },
      { kind: "case", title: "River survey field day", summary: "An annual fieldwork day measuring flow rate and invertebrate diversity on the River Aire, with results feeding into Year 10 statistics lessons.", role: "Organiser and risk lead", tools: "Fieldwork planning, risk assessment, data loggers", outcome: "140 students took part in 2025", art: "river" },
      { kind: "case", title: "Rethinking practical assessment", summary: "Replaced end-of-topic written tests with short practical checkpoints marked against a shared rubric.", role: "Project lead", tools: "Rubric design, moderation", outcome: "Marking time per class fell from about three hours to one", art: "rubric" },
    ],
    contact: [{ label: "Email", value: "amara.okafor@example.com" }, { label: "LinkedIn", value: "linkedin.com/in/amara-okafor" }],
  },
  tomas: {
    key: "tomas", role: "Photographer", name: "Tomás Reyes", headline: "Documentary photographer", location: "Valparaíso, Chile",
    intro: "I photograph working harbours and the people who keep them running. Commissioned by NGOs, newspapers and port authorities across South America.",
    skills: ["Documentary photography", "Photo editing", "Long-form storytelling", "Lightroom", "Medium format film", "Spanish and English"],
    experience: [
      { role: "Freelance photographer", org: "Self-employed", start: "2018", end: "Present", summary: "Editorial and NGO commissions." },
      { role: "Staff photographer", org: "El Litoral", start: "2014", end: "2018", summary: "Daily news and weekend features." },
    ],
    education: [{ credential: "Diploma in Photojournalism", school: "Universidad de Chile", year: "2013" }],
    projects: [
      { kind: "gallery", title: "Night shift at the port", summary: "Twelve images of dock crews working the overnight unloading.", role: "Photographer and editor", tools: "Medium format film", art: "harbour" },
      { kind: "gallery", title: "Fishing families of Caleta Portales", summary: "A year with three families who still fish from wooden boats.", role: "Photographer", tools: "35mm digital", art: "boats" },
      { kind: "engagement", title: "Annual report photography", client: "Fundación Mar Abierto", summary: "Portraits and location images for the foundation's 2025 report.", role: "Lead photographer", outcome: "Delivered 40 edited images in three weeks", art: "portrait" },
    ],
    contact: [{ label: "Email", value: "tomas.reyes@example.com" }, { label: "Website", value: "tomasreyes.example" }, { label: "Instagram", value: "instagram.com/tomasreyes" }],
  },
  lena: {
    key: "lena", role: "Consultant", name: "Lena Fischer", headline: "Sustainability consultant for mid-sized manufacturers", location: "Hamburg, Germany",
    intro: "I help manufacturing companies measure their emissions and turn the numbers into a plan their operations team can actually run.",
    skills: ["Carbon accounting", "CSRD reporting", "Supplier engagement", "Excel modelling", "Workshop facilitation", "German and English"],
    experience: [
      { role: "Independent consultant", org: "Fischer Advisory", start: "2020", end: "Present", summary: "Emissions baselines and reduction plans for manufacturers." },
      { role: "Senior Analyst", org: "Nordwind Energy Consulting", start: "2015", end: "2020", summary: "Energy audits and efficiency programmes." },
    ],
    education: [{ credential: "MSc Environmental Management", school: "Leuphana University Lüneburg", year: "2015" }],
    projects: [
      { kind: "engagement", title: "Scope 3 baseline for a packaging maker", client: "Packaging manufacturer, name under NDA", summary: "Mapped emissions across 220 suppliers and built a model the finance team now updates every quarter.", role: "Lead consultant", outcome: "The company's first complete Scope 3 figure", art: "rubric" },
      { kind: "case", title: "Supplier workshop programme", summary: "Four half-day workshops teaching suppliers to report energy data in a shared format.", role: "Designer and facilitator", tools: "Workshop design, data templates", outcome: "Supplier data coverage rose from 30% to 72%", art: "city" },
    ],
    contact: [{ label: "Email", value: "lena.fischer@example.com" }, { label: "Website", value: "fischer-advisory.example" }],
  },
};

export const TEMPLATES: { id: TemplateId; name: string; style: TemplateStyle; bestFor: string; needs: string[]; sample: PersonKey }[] = [
  { id: "atelier", name: "Atelier", style: "image", bestFor: "Architects, illustrators, makers and anyone whose projects are best seen first", needs: ["Visual projects", "Short descriptions"], sample: "amara" },
  { id: "ledger", name: "Ledger", style: "text", bestFor: "Teachers, consultants, healthcare and legal professionals", needs: ["Experience", "Credentials", "Skills"], sample: "lena" },
  { id: "gallery", name: "Gallery", style: "image", bestFor: "Photographers, artists and filmmakers", needs: ["Large images", "Minimal text"], sample: "tomas" },
  { id: "chapter", name: "Chapter", style: "case", bestFor: "Researchers, writers, policy and product people", needs: ["Case studies", "Outcomes"], sample: "lena" },
];
export const STYLE_LABEL: Record<TemplateStyle, string> = { image: "Image-led", text: "Text-led", case: "Case-study" };
export const templateName = (id: TemplateId) => TEMPLATES.find((t) => t.id === id)?.name ?? id;
