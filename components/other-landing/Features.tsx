import { Link2, Lock, MousePointerClick, Repeat, Smartphone, type LucideIcon } from "lucide-react";
import { FEATURES } from "@/components/other-landing/content";
import { Heading, Reveal } from "@/components/other-landing/parts";
import { colors, frame, section, type } from "@/components/other-landing/ui";

const ICONS: Record<(typeof FEATURES.items)[number]["id"], LucideIcon> = {
  screens: Smartphone,
  switch: Repeat,
  address: Link2,
  edit: MousePointerClick,
  draft: Lock,
};

// Where each card sits on desktop: two on the left, the address down the
// whole middle, two on the right.
const PLACE = ["lg:col-start-1 lg:row-start-1", "lg:col-start-1 lg:row-start-2", "lg:col-start-2 lg:row-span-2 lg:row-start-1", "lg:col-start-3 lg:row-start-1", "lg:col-start-3 lg:row-start-2"];

// The reference's five feature cards: an icon at the top, the title and a
// line at the foot.
export default function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className={`${frame} ${section}`}>
      <Heading id="features-title" label={FEATURES.label} lines={FEATURES.title} />
      <ul className={`m-0 mt-[clamp(2rem,3.5vw,3.25rem)] grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-[0.625rem]`}>
        {FEATURES.items.map((item, i) => {
          const Icon = ICONS[item.id];
          return (
            <li key={item.id} className={`${PLACE[i]} ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <Reveal order={i % 3} className={`flex h-full min-h-[clamp(13rem,16.5vw,14.875rem)] flex-col justify-between gap-12 p-[clamp(1.25rem,1.4vw,1.25rem)] ${colors.card}`}>
                <Icon aria-hidden="true" strokeWidth={2.25} className="size-5 text-[#090909]" />
                <div>
                  <h3 className={type.title}>{item.title}</h3>
                  <p className={`mb-0 mt-3 max-w-[18rem] ${type.body} ${colors.body}`}>{item.text}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
