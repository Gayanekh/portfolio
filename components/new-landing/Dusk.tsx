import { easedStops } from "@/components/landing/landing-ui";

// The page's light background turning into the dark closing wall and
// footer: a stretch of eased gradient, so there is no line where the dark
// starts. The wall below is pulled up into its foot, where it is already dark.
const FADE = `linear-gradient(to bottom, ${easedStops((amount, at) => `color-mix(in srgb, var(--foreground) ${Math.round(amount * 100)}%, transparent) ${at}%`)})`;

export default function Dusk() {
  return <div aria-hidden="true" style={{ backgroundImage: FADE }} className="h-[45svh] min-h-64" />;
}
