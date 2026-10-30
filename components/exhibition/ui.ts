import { focusRing } from "@/components/landing-next/ui";

// The page's two voices, shared by the sections: small capitals for labels
// and links, and one plain heading style (the sans at a single size) for
// anything said out loud. No bold headlines, no section numbers.
export const caps = "text-[0.75rem] font-semibold uppercase tracking-[0.14em]";
export const say = "m-0 text-[length:clamp(1.5rem,calc(1rem_+_1.1vw),2.25rem)] font-normal leading-[1.25] tracking-[-0.01em]";
export const prose = "m-0 text-[1.0625rem] leading-[1.75]";

// A link in small capitals with a thin rule under it.
export const underline = `${focusRing} ${caps} border-0 border-b border-solid border-[var(--bone)]/50 pb-2 text-[var(--bone)] no-underline transition-colors hover:border-[var(--bone)]`;

// "*marked*" words, written for the kit's headlines, read here as plain text.
export const plain = (text: string) => text.replaceAll("*", "");
