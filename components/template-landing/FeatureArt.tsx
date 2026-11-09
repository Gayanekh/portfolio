"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link2, Lock, MousePointer2, Repeat } from "lucide-react";

// The small drawings in the Features cards (the user asked for illustrations
// built from each card's icon idea): thin light lines on the dark card, one
// soft accent each. Each is decorative; the card's title and line say it.
const line = "border border-solid border-[color-mix(in_srgb,var(--fg)_28%,transparent)]";
const fill = "bg-[color-mix(in_srgb,var(--fg)_6%,transparent)]";
const bar = "block h-1.5 rounded-full bg-[color-mix(in_srgb,var(--fg)_18%,transparent)]";

// A tiny page: a few bars, the first in the accent colour, over a tinted picture
// (`plain` leaves it grey, beside a coloured one).
function Page({ className = "", plain = false }: { className?: string; plain?: boolean }) {
  return (
    <span className={`flex flex-col gap-1.5 p-2.5 ${className}`}>
      <span className={`${bar} w-1/2 ${plain ? "bg-[color-mix(in_srgb,var(--fg)_35%,transparent)]" : "!bg-[var(--accent)]"}`} />
      <span className={`${bar} w-full`} />
      <span className={`${bar} w-4/5`} />
      <span className={`mt-1 block h-6 rounded-[3px] ${plain ? "bg-[color-mix(in_srgb,var(--fg)_12%,transparent)]" : "bg-[color-mix(in_srgb,var(--accent)_45%,transparent)]"}`} />
    </span>
  );
}

function Screens() {
  return (
    <span className="relative flex items-end gap-3">
      <span className="flex flex-col items-center">
        <span className={`block h-[6.5rem] w-[10rem] rounded-[6px] ${line} ${fill}`}>
          <Page />
        </span>
        <span className="block h-1.5 w-[11.5rem] rounded-b-[4px] bg-[color-mix(in_srgb,var(--fg)_22%,transparent)]" />
      </span>
      <span className={`block h-[5.5rem] w-[2.9rem] rounded-[8px] ${line} ${fill}`}>
        <Page className="!gap-1 !p-1.5" />
      </span>
    </span>
  );
}

function Switch() {
  return (
    <span className="flex items-center gap-3">
      <span className={`block h-[5rem] w-[6.5rem] rounded-[5px] ${line} ${fill}`}>
        <Page plain />
      </span>
      <span className="grid size-9 place-items-center rounded-full bg-[var(--accent)] text-[#16171a]">
        <Repeat className="size-4" strokeWidth={2.25} />
      </span>
      <span className={`block h-[5rem] w-[6.5rem] rounded-[5px] ${line} bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]`}>
        <Page />
      </span>
    </span>
  );
}

function Address() {
  return (
    <span className="flex w-[15rem] flex-col items-start gap-3">
      <span className={`flex w-full items-center gap-2 rounded-full ${line} ${fill} px-3 py-2`}>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block size-1.5 rounded-full bg-[color-mix(in_srgb,var(--fg)_30%,transparent)]" />
          ))}
        </span>
        <Link2 className="ml-1 size-3.5 text-[var(--accent)]" />
        <span className="font-mono text-[0.75rem] text-[var(--fg)]">portory.net/you</span>
      </span>
      <span className="ml-3 flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,#3ccf7e_16%,transparent)] px-2.5 py-1 font-mono text-[0.6875rem] text-[#7fe0a8]">
        <span className="block size-1.5 rounded-full bg-[#3ccf7e]" />
        Published
      </span>
    </span>
  );
}

function Edit() {
  const still = useReducedMotion();
  return (
    <span className={`relative flex w-[14rem] flex-col gap-2 rounded-[6px] ${line} ${fill} p-4`}>
      <span className="flex items-center text-[1.125rem] font-medium tracking-[-0.02em] text-[var(--fg)]">
        Mara Voss
        <motion.span aria-hidden="true" animate={still ? undefined : { opacity: [1, 1, 0, 0] }} transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }} className="ml-0.5 block h-5 w-[2px] bg-[var(--accent)]" />
      </span>
      <span className={`${bar} w-full !bg-[color-mix(in_srgb,var(--accent)_55%,transparent)]`} />
      <span className={`${bar} w-3/4`} />
      <MousePointer2 className="absolute -bottom-3 right-6 size-6 fill-[var(--accent)] text-[#16171a]" strokeWidth={1.5} />
    </span>
  );
}

function Draft() {
  return (
    <span className={`relative flex w-[13rem] flex-col gap-3 rounded-[6px] ${line} ${fill} p-4`}>
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] px-2.5 py-1 font-mono text-[0.6875rem] text-[var(--accent)]">
          <Lock className="size-3" strokeWidth={2.25} />
          Draft · only you
        </span>
      </span>
      <span className={`${bar} w-full !bg-[color-mix(in_srgb,var(--accent)_55%,transparent)]`} />
      <span className={`${bar} w-2/3`} />
      <span className="mt-1 block w-fit rounded-[4px] border border-dashed border-[color-mix(in_srgb,var(--fg)_30%,transparent)] px-2.5 py-1 text-[0.75rem] text-[color-mix(in_srgb,var(--fg)_45%,transparent)]">Publish changes</span>
    </span>
  );
}

const ART = { screens: Screens, switch: Switch, address: Address, edit: Edit, draft: Draft } as const;

export default function FeatureArt({ id }: { id: keyof typeof ART }) {
  const Art = ART[id];
  return (
    <span aria-hidden="true" className="grid place-items-center">
      <Art />
    </span>
  );
}
