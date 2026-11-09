// The page's few shared classes, measured on the Monolog reference: off-white
// #f8f7f6 and ink #16171a, Geist text, a serif italic word over a heavy
// capital word for headings, a 808px content column.

export const ease = [0.22, 1, 0.36, 1] as const;

export const column = "mx-auto w-full max-w-[50.5rem] px-5";
export const wide = "mx-auto w-full max-w-[82rem] px-4 sm:px-16";
export const space = "py-[clamp(5rem,10vw,9rem)]";

export const sans = "font-[family-name:var(--ml-sans)]";
export const serif = "font-[family-name:var(--ml-serif)] font-normal italic";
export const logoFont = "font-[family-name:var(--ml-logo)] font-semibold";

// Headings: the italic word, then the capital word under or beside it.
export const caps = "font-extrabold uppercase tracking-[-0.05em]";
export const lead = "text-[1.125rem] leading-[1.4] text-[#16171a]/55";
export const small = "text-[0.875rem] leading-[1.4] tracking-[0.02em]";

export const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-[#16171a] focus-visible:ring-offset-2";

export const button = `${focusRing} inline-flex h-14 items-center justify-center rounded-[10px] bg-[#16171a] px-10 text-[1rem] text-[#f8f7f6] no-underline transition-colors duration-300 hover:bg-[#2a2a2a]`;
export const chip = "rounded-full border border-solid border-[#16171a]/10 bg-white px-4 py-1 text-[0.875rem] text-[#16171a]/80";
